import { SongItem, getFullStreamUrl, getRecommendedSongs } from './api';
import { db, auth } from './firebaseConfig';
import { collection, addDoc, serverTimestamp, query, where, getDocs, limit, doc, setDoc } from 'firebase/firestore';
import { trackListeningTime } from '@/hooks/useStats';

export type PlayerState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export interface PlayerTrack extends SongItem {
  resolvedUrl?: string;
}

type Listener = () => void;

class MusicPlayerServiceClass {
  private audio = new Audio();
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private _filters: BiquadFilterNode[] = [];
  
  // 10-band EQ frequencies
  public readonly eqBands = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

  private _queue: PlayerTrack[] = [];
  private _originalQueue: PlayerTrack[] = [];
  private _currentIndex = 0;
  private _state: PlayerState = 'idle';
  private _position = 0;
  private _duration = 0;
  private _listeners: Listener[] = [];
  private _repeatMode: 'off' | 'track' | 'queue' = 'off';
  private _isShuffled = false;
  private _sleepTimer: any = null;
  private _sleepTimerEnd: number | null = null;

  constructor() {
    this.audio.crossOrigin = 'anonymous'; // Required for Web Audio API with external URLs
    this.audio.addEventListener('timeupdate', () => {
      const now = this.audio.currentTime;
      if (this._state === 'playing') {
        const delta = now - this._position;
        if (delta > 0 && delta < 2) {
           trackListeningTime(delta, { artist: this.currentTrack?.artist });
        }
      }
      this._position = now;
      this._duration = this.audio.duration || 0;
      this.notify();
    });
    this.audio.addEventListener('playing', () => { this._state = 'playing'; this.notify(); });
    this.audio.addEventListener('pause', () => { this._state = 'paused'; this.notify(); });
    this.audio.addEventListener('ended', () => this.handleEnded());
    this.audio.addEventListener('error', () => { this._state = 'error'; this.notify(); });
    this.audio.addEventListener('loadstart', () => { this._state = 'loading'; this.notify(); });
    this.audio.addEventListener('canplay', () => {
      if (this._state === 'loading') { this._state = 'paused'; this.notify(); }
    });
  }

  get sleepTimerEnd() { return this._sleepTimerEnd; }

  private notify() { this._listeners.forEach(l => l()); }

  subscribe(listener: Listener) {
    this._listeners.push(listener);
    return () => { this._listeners = this._listeners.filter(l => l !== listener); };
  }

  get currentTrack(): PlayerTrack | null { return this._queue[this._currentIndex] || null; }
  get queue(): PlayerTrack[] { return this._queue; }
  get currentIndex(): number { return this._currentIndex; }
  get state(): PlayerState { return this._state; }
  get position(): number { return this._position; }
  get duration(): number { return this._duration; }
  get isPlaying(): boolean { return this._state === 'playing'; }
  get repeatMode() { return this._repeatMode; }
  get isShuffled() { return this._isShuffled; }

  async playTrack(track: SongItem, queue?: SongItem[], index?: number) {
    // Ensure Web Audio API is initialized upon user interaction block
    this.initAudioContext();
    if (this.audioContext?.state === 'suspended') {
      try { await this.audioContext.resume(); } catch(e){}
    }
    
    const newQueue = (queue || [track]).map(s => ({ ...s }));
    this._originalQueue = [...newQueue];
    
    // If shuffle is active, shuffle the remaining tracks
    const trackIndex = index ?? newQueue.findIndex(s => s.id === track.id);
    
    if (this._isShuffled) {
      if (newQueue.length > 1) {
        const remaining = newQueue.filter((_, i) => i !== trackIndex);
        for (let i = remaining.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
        }
        this._queue = [newQueue[trackIndex], ...remaining];
        this._currentIndex = 0;
      } else {
        this._queue = newQueue;
        this._currentIndex = trackIndex;
      }
    } else {
      this._queue = newQueue;
      this._currentIndex = Math.max(0, trackIndex);
    }
    
    await this.loadAndPlay(this._queue[this._currentIndex]);
  }

  private async loadAndPlay(track: PlayerTrack) {
    this._state = 'loading';
    this.notify();
    let url = track.streamUrl || '';

    // 1. Check offline cache first
    try {
      if ('caches' in window) {
        const cache = await caches.open('melodify-downloads');
        const cacheKey = new URL(`/local-audio/${track.id}`, window.location.origin).href;
        const cachedResponse = await cache.match(cacheKey);
        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          url = URL.createObjectURL(blob);
          console.log('Playing offline from cache:', track.id);
        }
      }
    } catch (e) {
      console.warn('Cache lookup failed', e);
    }

    // 2. If no valid stream URL or local URL, resolve via YouTube/Piped
    if (!url.startsWith('blob:') && (!url || url.includes('dummy') || url.length < 10)) {
      const resolved = await getFullStreamUrl(track.title, track.artist);
      url = resolved || '';
    }

    if (!url) {
      this._state = 'error';
      this.notify();
      return;
    }

    track.resolvedUrl = url;
    this.audio.src = url;
    this.audio.load();
    try {
      this.initAudioContext();
      if (this.audioContext?.state === 'suspended') {
         await this.audioContext.resume();
      }
      await this.audio.play();
      this.trackRecentlyPlayed(track);
    } catch (e) {
      console.error('Audio play error:', e);
      this._state = 'error';
      this.notify();
    }
  }

  pause() { this.audio.pause(); }

  async togglePlay() {
    if (this.isPlaying) this.pause();
    else await this.play();
  }

  seekTo(seconds: number) {
    this.audio.currentTime = Math.max(0, Math.min(seconds, this._duration));
  }

  async skipNext() {
    if (this._repeatMode === 'track') {
      this.audio.currentTime = 0;
      await this.audio.play();
      return;
    }
    if (this._currentIndex < this._queue.length - 1) {
      this._currentIndex++;
      await this.loadAndPlay(this._queue[this._currentIndex]);
    } else if (this._repeatMode === 'queue') {
      this._currentIndex = 0;
      await this.loadAndPlay(this._queue[0]);
    } else {
      // Autoplay: if we're at the end of the queue, fetch recommendations
      const current = this.currentTrack;
      if (current) {
        const reco = await getRecommendedSongs(current);
        if (reco.length > 0) {
          this._queue = [...this._queue, ...reco.map(s => ({ ...s }))];
          this._currentIndex++;
          await this.loadAndPlay(this._queue[this._currentIndex]);
        }
      }
    }
  }

  async skipPrev() {
    if (this._position > 3) {
      this.audio.currentTime = 0;
      return;
    }
    if (this._currentIndex > 0) {
      this._currentIndex--;
      await this.loadAndPlay(this._queue[this._currentIndex]);
    }
  }

  async jumpToQueueIndex(index: number) {
    if (index >= 0 && index < this._queue.length) {
      this._currentIndex = index;
      await this.loadAndPlay(this._queue[this._currentIndex]);
    }
  }

  setRepeat(mode: 'off' | 'track' | 'queue') {
    this._repeatMode = mode;
    this.notify();
  }

  toggleShuffle() {
    this._isShuffled = !this._isShuffled;
    if (this._isShuffled) {
      const current = this._queue[this._currentIndex];
      const remaining = this._queue.filter((_, i) => i !== this._currentIndex);
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      this._queue = [current, ...remaining];
      this._currentIndex = 0;
    } else {
      const current = this._queue[this._currentIndex];
      this._queue = [...this._originalQueue];
      this._currentIndex = Math.max(0, this._queue.findIndex(t => t.id === current.id));
    }
    this.notify();
  }

  setSleepTimer(minutes: number) {
    if (this._sleepTimer) clearTimeout(this._sleepTimer);
    this._sleepTimerEnd = null;
    
    if (minutes <= 0) {
      this.notify();
      return;
    }
    
    const waitTime = minutes * 60 * 1000;
    this._sleepTimerEnd = Date.now() + waitTime;
    
    this._sleepTimer = setTimeout(() => {
      this.pause();
      this._sleepTimerEnd = null;
      console.log('Sleep timer elapsed. Playback paused.');
      this.notify();
    }, waitTime);
    this.notify();
  }

  private async handleEnded() {
    if (this._repeatMode === 'track') {
      this.audio.currentTime = 0;
      await this.audio.play();
    } else {
      await this.skipNext();
    }
  }

  private async trackRecentlyPlayed(track: PlayerTrack) {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const docId = `${user.uid}_${track.id}`;
      await setDoc(doc(db, 'recentlyPlayed', docId), {
        userId: user.uid,
        songId: track.id,
        title: track.title,
        artist: track.artist,
        artworkUrl: track.artworkUrl,
        streamUrl: track.streamUrl || '',
        playedAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      console.warn('Failed to track recently played:', e);
    }
  }
  reset() {
    this.audio.pause();
    this.audio.src = '';
    this._queue = [];
    this._currentIndex = 0;
    this._position = 0;
    this._state = 'idle';
    this.notify();
  }

  // --- Equalizer Logic ---
  private initAudioContext() {
    if (this.audioContext) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
      this.sourceNode = this.audioContext.createMediaElementSource(this.audio);

      // Create filters
      this._filters = this.eqBands.map(freq => {
        const filter = this.audioContext!.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = freq;
        filter.Q.value = 1;
        filter.gain.value = 0;
        return filter;
      });

      // Chain them together
      this.sourceNode.connect(this._filters[0]);
      for (let i = 0; i < this._filters.length - 1; i++) {
        this._filters[i].connect(this._filters[i + 1]);
      }
      this._filters[this._filters.length - 1].connect(this.audioContext.destination);
    } catch (e) {
      console.warn('Web Audio API not supported or initialization failed:', e);
    }
  }

  async play() {
    if (!this.audioContext) this.initAudioContext();
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    if (this.audio.src) {
      await this.audio.play();
    } else if (this._queue.length > 0) {
      await this.loadAndPlay(this._queue[this._currentIndex]);
    }
  }

  getEqGain(index: number) {
    if (!this._filters[index]) return 0;
    return this._filters[index].gain.value;
  }

  setEqGain(index: number, value: number) {
    if (!this._filters[index]) return;
    this._filters[index].gain.value = value;
    this.notify();
  }
}

const MusicPlayerService = new MusicPlayerServiceClass();
export default MusicPlayerService;
