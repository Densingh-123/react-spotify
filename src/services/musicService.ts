import { SongItem, getFullStreamUrl } from './api';
import { db, auth } from './firebaseConfig';
import { collection, addDoc, serverTimestamp, query, where, getDocs, limit } from 'firebase/firestore';

export type PlayerState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export interface PlayerTrack extends SongItem {
  resolvedUrl?: string;
}

type Listener = () => void;

class MusicPlayerServiceClass {
  private audio = new Audio();
  private _queue: PlayerTrack[] = [];
  private _currentIndex = 0;
  private _state: PlayerState = 'idle';
  private _position = 0;
  private _duration = 0;
  private _listeners: Listener[] = [];
  private _repeatMode: 'off' | 'track' | 'queue' = 'off';

  constructor() {
    this.audio.addEventListener('timeupdate', () => {
      this._position = this.audio.currentTime;
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

  async playTrack(track: SongItem, queue?: SongItem[], index?: number) {
    const newQueue = (queue || [track]).map(s => ({ ...s }));
    const trackIndex = index ?? newQueue.findIndex(s => s.id === track.id);
    this._queue = newQueue;
    this._currentIndex = Math.max(0, trackIndex);
    await this.loadAndPlay(this._queue[this._currentIndex]);
  }

  private async loadAndPlay(track: PlayerTrack) {
    this._state = 'loading';
    this.notify();
    let url = track.streamUrl || '';

    // If no valid stream URL, resolve via YouTube/Piped
    if (!url || url.includes('dummy') || url.length < 10) {
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
      await this.audio.play();
      this.trackRecentlyPlayed(track);
    } catch (e) {
      console.error('Audio play error:', e);
      this._state = 'error';
      this.notify();
    }
  }

  async play() {
    if (this.audio.src) {
      await this.audio.play();
    } else if (this._queue.length > 0) {
      await this.loadAndPlay(this._queue[this._currentIndex]);
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

  setRepeat(mode: 'off' | 'track' | 'queue') {
    this._repeatMode = mode;
    this.notify();
  }

  private handleEnded() {
    if (this._repeatMode === 'track') {
      this.audio.currentTime = 0;
      this.audio.play();
    } else {
      this.skipNext();
    }
  }

  private async trackRecentlyPlayed(track: PlayerTrack) {
    const user = auth.currentUser;
    if (!user) return;
    try {
      // Check if already in recently played
      const q = query(
        collection(db, 'recentlyPlayed'),
        where('userId', '==', user.uid),
        where('songId', '==', track.id),
        limit(1)
      );
      const existing = await getDocs(q);
      if (!existing.empty) return;

      await addDoc(collection(db, 'recentlyPlayed'), {
        userId: user.uid,
        songId: track.id,
        title: track.title,
        artist: track.artist,
        artworkUrl: track.artworkUrl,
        streamUrl: track.streamUrl || '',
        playedAt: serverTimestamp(),
      });
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
}

const MusicPlayerService = new MusicPlayerServiceClass();
export default MusicPlayerService;
