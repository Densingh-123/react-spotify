import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import MusicPlayerService, { PlayerTrack } from '@/services/musicService';
import { SongItem } from '@/services/api';

interface PlayerContextType {
  currentTrack: PlayerTrack | null;
  queue: PlayerTrack[];
  isPlaying: boolean;
  position: number;
  duration: number;
  repeatMode: 'off' | 'track' | 'queue';
  playTrack: (track: SongItem, queue?: SongItem[], index?: number) => Promise<void>;
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => Promise<void>;
  seekTo: (seconds: number) => void;
  skipNext: () => Promise<void>;
  skipPrev: () => Promise<void>;
  setRepeat: (mode: 'off' | 'track' | 'queue') => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    return MusicPlayerService.subscribe(() => forceUpdate(n => n + 1));
  }, []);

  const playTrack = useCallback(async (track: SongItem, queue?: SongItem[], index?: number) => {
    await MusicPlayerService.playTrack(track, queue, index);
  }, []);

  return (
    <PlayerContext.Provider value={{
      currentTrack: MusicPlayerService.currentTrack,
      queue: MusicPlayerService.queue,
      isPlaying: MusicPlayerService.isPlaying,
      position: MusicPlayerService.position,
      duration: MusicPlayerService.duration,
      repeatMode: MusicPlayerService.repeatMode,
      playTrack,
      play: () => MusicPlayerService.play(),
      pause: () => MusicPlayerService.pause(),
      togglePlay: () => MusicPlayerService.togglePlay(),
      seekTo: (s) => MusicPlayerService.seekTo(s),
      skipNext: () => MusicPlayerService.skipNext(),
      skipPrev: () => MusicPlayerService.skipPrev(),
      setRepeat: (m) => MusicPlayerService.setRepeat(m),
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
