import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack, IoDownload, IoPlay, IoTrashOutline } from 'react-icons/io5';
import { useTheme } from '@/context/ThemeContext';
import { useDownloads } from '@/hooks/useDownloads';
import { usePlayer } from '@/context/PlayerContext';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

export default function DownloadsPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { downloadedSongs, loading, removeDownloadRecord } = useDownloads();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const handlePlay = (song: any, index: number) => {
    playTrack(song, downloadedSongs, index);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', borderBottom: `1px solid ${colors.glassBorder}` }}>
        <button className="icon-btn" onClick={() => navigate(-1)} style={{ color: colors.text }}><IoChevronBack size={26} /></button>
        <IoDownload size={24} color={colors.primary} />
        <h2 style={{ fontSize: 22, fontWeight: 900, color: colors.text }}>Downloads</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => <SkeletonLoader key={i} height={60} style={{ borderRadius: 12 }} />)}
          </div>
        ) : downloadedSongs.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{ fontSize: 64, opacity: 0.4 }}>⬇️</div>
            <p style={{ color: colors.textSecondary, fontSize: 16 }}>No downloaded songs yet</p>
            <p style={{ color: colors.textSecondary, fontSize: 13, textAlign: 'center', maxWidth: 260 }}>
              Tap ⋯ on any song and choose "Download Song" to save it for offline listening.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {downloadedSongs.map((song, index) => {
              const isActive = currentTrack?.id === song.id;
              return (
                <div key={song.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12,
                  background: isActive ? `${colors.primary}15` : colors.surface,
                  border: isActive ? `1px solid ${colors.primary}44` : '1px solid transparent'
                }}>
                  <div 
                    onClick={() => handlePlay(song, index)}
                    style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
                  >
                    <img src={song.artworkUrl} alt={song.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: isActive ? 1 : 0, transition: 'opacity 0.2s'
                    }}>
                      {isActive && isPlaying ? (
                        <div className="playing-bars"><div className="bar"/><div className="bar"/><div className="bar"/></div>
                      ) : (
                        <IoPlay color="#fff" size={20} style={{ marginLeft: 2 }} />
                      )}
                    </div>
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: isActive ? colors.primary : colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {song.title}
                    </div>
                    <div style={{ fontSize: 13, color: colors.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {song.artist}
                    </div>
                  </div>

                  <button 
                    onClick={() => removeDownloadRecord(song.id)}
                    className="icon-btn" 
                    style={{ color: colors.textSecondary, padding: 8 }}
                    title="Remove from app downloads"
                  >
                    <IoTrashOutline size={20} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
