import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoPlay, IoPause, IoPlaySkipForward, IoClose } from 'react-icons/io5';
import { usePlayer } from '@/context/PlayerContext';
import { useTheme } from '@/context/ThemeContext';

export default function MiniPlayer() {
  const { colors } = useTheme();
  const { currentTrack, isPlaying, position, duration, togglePlay, skipNext, reset } = usePlayer();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentTrack || location.pathname === '/player') return null;

  const progress = duration > 0 ? (position / duration) * 100 : 0;
  const playIconColor = colors.primary === '#ffffff' ? '#000' : '#fff';

  return (
    <div className="mini-player">
      <div className="mini-player-inner">
        <img
          src={currentTrack.artworkUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100'}
          alt={currentTrack.title}
          className="mini-player-art"
          onClick={() => navigate('/player')}
          style={{ cursor: 'pointer' }}
        />
        <div className="mini-player-info" onClick={() => navigate('/player')} style={{ cursor: 'pointer' }}>
          <div className="mini-player-title">{currentTrack.title}</div>
          <div className="mini-player-artist">{currentTrack.artist}</div>
          <div className="mini-player-progress">
            <div className="mini-player-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="mini-player-controls">
          <button className="mini-player-play" style={{ background: colors.primary }} onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
            {isPlaying ? <IoPause size={18} color={playIconColor} /> : <IoPlay size={18} color={playIconColor} style={{ marginLeft: 2 }} />}
          </button>
          <button className="icon-btn" onClick={(e) => { e.stopPropagation(); skipNext(); }} style={{ color: 'var(--color-text-secondary)', width: 32, height: 32 }}>
            <IoPlaySkipForward size={20} />
          </button>
          <button className="icon-btn" onClick={(e) => { e.stopPropagation(); reset(); }} style={{ color: 'var(--color-text-secondary)', width: 32, height: 32 }}>
            <IoClose size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
