import React from 'react';
import { SongItem } from '@/services/api';
import { IoPause, IoPlay, IoEllipsisHorizontal } from 'react-icons/io5';

interface Props {
  item: SongItem;
  onPress: () => void;
  onMorePress: () => void;
  isPlaying?: boolean;
  width?: number;
  height?: number;
}

export default function SongCard({ item, onPress, onMorePress, isPlaying, width = 150, height = 200 }: Props) {
  return (
    <div
      className="song-card"
      style={{ width, height, background: 'var(--color-surface)' }}
      onClick={onPress}
    >
      <div style={{ position: 'relative', width: '100%', flex: 1, overflow: 'hidden' }}>
        <img
          src={item.artworkUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400'}
          alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
        }} />
        {/* Playing indicator */}
        {isPlaying && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div className="spinner" />
          </div>
        )}
        {/* More button */}
        <button
          style={{
            position: 'absolute', top: 6, right: 6,
            background: 'rgba(0,0,0,0.5)', border: 'none',
            borderRadius: 50, width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff',
          }}
          onClick={e => { e.stopPropagation(); onMorePress(); }}
        >
          <IoEllipsisHorizontal size={16} />
        </button>
        {/* Play button overlay */}
        <div style={{
          position: 'absolute', bottom: 8, right: 8,
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--color-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isPlaying ? <IoPause size={16} color="#fff" /> : <IoPlay size={16} color="#fff" style={{ marginLeft: 2 }} />}
        </div>
      </div>
      <div className="song-card-info" style={{ padding: '8px 8px 10px' }}>
        <div className="song-card-title" style={{ color: 'var(--color-text)' }}>{item.title}</div>
        <div className="song-card-artist">{item.artist}</div>
      </div>
    </div>
  );
}
