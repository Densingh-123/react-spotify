import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack, IoDownload, IoPlay, IoTrashOutline, IoMusicalNotes, IoTimeOutline, IoDiscOutline, IoEllipsisVertical } from 'react-icons/io5';
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
    // Ensure we mark it as local so MusicPlayerService knows to check cache
    playTrack({ ...song, isLocal: true }, downloadedSongs, index);
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '4.2 MB'; // Fallback estimate
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: colors.background }}>
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: 16, padding: '24px 20px', 
        background: `linear-gradient(180deg, ${colors.primary}22 0%, transparent 100%)`,
        borderBottom: `1px solid ${colors.glassBorder}` 
      }}>
        <button className="icon-btn" onClick={() => navigate(-1)} style={{ color: colors.text }}><IoChevronBack size={28} /></button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IoDownload size={22} color={colors.primary} />
            <h2 style={{ fontSize: 24, fontWeight: 900, color: colors.text, margin: 0 }}>Offline Library</h2>
          </div>
          <p style={{ fontSize: 13, color: colors.textSecondary, margin: '4px 0 0 0', fontWeight: 600 }}>
            {downloadedSongs.length} songs available for offline play
          </p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 100px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <SkeletonLoader height={64} width={64} style={{ borderRadius: 12 }} />
                <div style={{ flex: 1 }}>
                  <SkeletonLoader height={20} width="60%" style={{ marginBottom: 8 }} />
                  <SkeletonLoader height={14} width="40%" />
                </div>
              </div>
            ))}
          </div>
        ) : downloadedSongs.length === 0 ? (
          <div style={{ height: '70%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <div style={{ 
              width: 120, height: 120, borderRadius: '50%', background: colors.surfaceHighlight,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50,
              boxShadow: `0 20px 40px rgba(0,0,0,0.2)`
            }}>
              📥
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: colors.text, fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Empty Vault</h3>
              <p style={{ color: colors.textSecondary, fontSize: 14, maxWidth: 280, lineHeight: 1.5 }}>
                Your offline downloads will appear here. Tap the <IoEllipsisVertical style={{ verticalAlign: 'middle' }} /> menu on any track and select <b>Download Song</b>.
              </p>
            </div>
            <button 
              onClick={() => navigate('/')}
              style={{ 
                padding: '14px 32px', borderRadius: 24, background: colors.primary, 
                color: '#fff', border: 'none', fontWeight: 800, fontSize: 15, cursor: 'pointer',
                boxShadow: `0 10px 20px ${colors.primary}44`
              }}
            >
              Discover Music
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {downloadedSongs.map((song: any, index) => {
              const isActive = currentTrack?.id === song.id;
              return (
                <div key={song.id} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 24,
                  background: isActive ? `${colors.primary}15` : colors.surface,
                  border: `1px solid ${isActive ? colors.primary + '44' : colors.glassBorder}`,
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  cursor: 'pointer'
                }}
                onClick={() => handlePlay(song, index)}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ width: 64, height: 64, borderRadius: 16, overflow: 'hidden', position: 'relative', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', flexShrink: 0 }}>
                    <img src={song.artworkUrl} alt={song.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: isActive ? 1 : 0, transition: 'opacity 0.2s'
                    }}>
                      {isActive && isPlaying ? (
                        <div className="playing-bars"><div className="bar"/><div className="bar"/><div className="bar"/></div>
                      ) : (
                        <IoPlay color="#fff" size={24} style={{ marginLeft: 2 }} />
                      )}
                    </div>
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: isActive ? colors.primary : colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>
                      {song.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                       <span style={{ fontSize: 13, color: colors.textSecondary, fontWeight: 600 }}>{song.artist}</span>
                       <span style={{ width: 3, height: 3, borderRadius: '50%', background: colors.textSecondary, opacity: 0.5 }} />
                       <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: colors.textSecondary, fontSize: 11 }}>
                          <IoDiscOutline size={12} />
                          <span>{song.album || 'Single'}</span>
                       </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: colors.primary, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, background: colors.primary + '11', padding: '2px 8px', borderRadius: 8 }}>
                          <IoDownload size={10} />
                          <span>Offline Ready</span>
                       </div>
                       <div style={{ color: colors.textSecondary, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <IoTimeOutline size={12} />
                          <span>{new Date(song.downloadedAt).toLocaleDateString()}</span>
                       </div>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); removeDownloadRecord(song.id); }}
                    className="icon-btn" 
                    style={{ 
                      color: colors.textSecondary, width: 44, height: 44, borderRadius: 14,
                      background: 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={e => e.currentTarget.style.color = colors.textSecondary}
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
