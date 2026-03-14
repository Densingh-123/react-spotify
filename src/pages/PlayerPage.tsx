import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronDown, IoEllipsisHorizontal, IoPlaySkipBack, IoPlaySkipForward, IoPlay, IoPause, IoShuffle, IoRepeat, IoHeart, IoHeartOutline, IoClose, IoAddCircle, IoDownload, IoList, IoShareSocial, IoMusicalNotes } from 'react-icons/io5';
import { usePlayer } from '@/context/PlayerContext';
import { useLikes } from '@/hooks/useLikes';
import { getLyrics, LyricLine, SongItem } from '@/services/api';
import { useTheme } from '@/context/ThemeContext';
import PlaylistPickerModal from '@/components/PlaylistPickerModal';

export default function PlayerPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { currentTrack, isPlaying, position, duration, togglePlay, skipNext, skipPrev, seekTo, repeatMode, setRepeat, queue, jumpToQueueIndex } = usePlayer();
  const { toggleLike, isLiked } = useLikes();

  const [showMenu, setShowMenu] = useState(false);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const lyricsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'lyrics' | 'queue'>('lyrics');
  const [pickerVisible, setPickerVisible] = useState(false);

  const progressPercent = duration > 0 ? Math.min(1, Math.max(0, position / duration)) : 0;
  const displayPercent = isSeeking ? seekValue : progressPercent;

  const liked = currentTrack ? isLiked(currentTrack.id) : false;

  useEffect(() => {
    if (!currentTrack) {
      setLyrics([]);
      return;
    }

    let active = true;
    setLyrics([]); // Clear lyrics immediately for new track

    getLyrics(currentTrack.id, currentTrack.title, currentTrack.artist, currentTrack.album, duration)
      .then(d => {
        if (active) {
          setLyrics(d.synced);
        }
      })
      .catch(err => {
        console.error('Failed to fetch lyrics:', err);
        if (active) setLyrics([]);
      });

    return () => { active = false; };
  }, [currentTrack?.id, duration > 0]);

  const currentLyricIdx = lyrics.findIndex((l, i) => {
    const nextTime = lyrics[i + 1]?.time || 9999;
    return position >= l.time && position < nextTime;
  });

  useEffect(() => {
    if (currentLyricIdx !== -1 && lyricsRef.current) {
      const lineHeight = 45;
      lyricsRef.current.scrollTo({ top: Math.max(0, currentLyricIdx * lineHeight - 100), behavior: 'smooth' });
    }
  }, [currentLyricIdx]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    if (!bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setSeekValue(pct);
  }, [duration]);

  const handleSeekEnd = useCallback(() => {
    if (isSeeking && duration) { seekTo(seekValue * duration); setIsSeeking(false); }
  }, [isSeeking, seekValue, duration, seekTo]);

  const cyclRepeat = () => setRepeat(repeatMode === 'off' ? 'track' : repeatMode === 'track' ? 'queue' : 'off');

  if (!currentTrack) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <IoMusicalNotes size={64} color={colors.primary} />
        <p style={{ color: colors.textSecondary, fontSize: 18 }}>No song playing</p>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ background: colors.primary }}>Browse Music</button>
      </div>
    );
  }

  const menuOptions = [
    { icon: <IoHeart size={20} color={liked ? '#e91e63' : colors.primary} />, label: liked ? 'Unlike Song' : 'Like Song', action: () => { if (currentTrack) toggleLike(currentTrack as SongItem); setShowMenu(false); } },
    { icon: <IoAddCircle size={20} color={colors.primary} />, label: 'Add to Playlist', action: () => { setPickerVisible(true); setShowMenu(false); } },
    { icon: <IoDownload size={20} color={colors.primary} />, label: 'Download Song', action: () => { if (currentTrack?.streamUrl) window.open(currentTrack.streamUrl, '_blank'); setShowMenu(false); } },
    { icon: <IoList size={20} color={colors.primary} />, label: 'View Queue', action: () => { setActiveTab('queue'); setShowMenu(false); } },
    { icon: <IoShareSocial size={20} color={colors.primary} />, label: 'Share Song', action: () => { navigator.share?.({ title: currentTrack.title, text: `${currentTrack.title} by ${currentTrack.artist}` }); setShowMenu(false); } },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '0 20px 20px', overflowY: 'auto', position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginBottom: 24 }}>
        <button className="icon-btn" onClick={() => navigate(-1)} style={{ color: colors.text }}><IoChevronDown size={30} /></button>
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.text }}>Now Playing</span>
        <button className="icon-btn" onClick={() => setShowMenu(true)} style={{ color: colors.text }}><IoEllipsisHorizontal size={26} /></button>
      </div>

      {/* Album Art */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <div style={{
          width: 'min(280px, 60vw)', height: 'min(280px, 60vw)', borderRadius: '50%',
          overflow: 'hidden', border: `3px solid ${colors.border}`,
          boxShadow: `0 12px 40px ${colors.primary}44`,
          animation: isPlaying ? 'album-spin 12s linear infinite' : 'album-spin 12s linear infinite paused',
        }}>
          <img src={currentTrack.artworkUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400'} alt={currentTrack.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Song Info + Like */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentTrack.title}</div>
          <div 
            onClick={() => navigate(`/artist/${encodeURIComponent(currentTrack.artist)}`)}
            style={{ fontSize: 15, color: colors.textSecondary, marginTop: 4, cursor: 'pointer', display: 'inline-block' }}
          >
            {currentTrack.artist}
          </div>
        </div>
        <button className="icon-btn" onClick={() => toggleLike(currentTrack as SongItem)} style={{ color: liked ? '#e91e63' : colors.textSecondary, flexShrink: 0 }}>
          {liked ? <IoHeart size={28} /> : <IoHeartOutline size={28} />}
        </button>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 24 }}>
        <div
          ref={progressRef}
          className="progress-container"
          onMouseDown={e => { setIsSeeking(true); handleSeek(e); }}
          onMouseMove={e => { if (isSeeking) handleSeek(e); }}
          onMouseUp={handleSeekEnd}
          onMouseLeave={() => { if (isSeeking) handleSeekEnd(); }}
          onTouchStart={e => { setIsSeeking(true); handleSeek(e); }}
          onTouchMove={e => { if (isSeeking) handleSeek(e); }}
          onTouchEnd={handleSeekEnd}
        >
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${displayPercent * 100}%` }} />
            <div className={`progress-bar-handle ${isSeeking ? 'seeking' : ''}`} style={{ left: `${displayPercent * 100}%` }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 12, color: colors.textSecondary }}>{formatTime(isSeeking ? seekValue * duration : position)}</span>
          <span style={{ fontSize: 12, color: colors.textSecondary }}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: 24 }}>
        <button className="icon-btn" style={{ color: colors.textSecondary }}><IoShuffle size={26} /></button>
        <button className="icon-btn" style={{ color: colors.text }} onClick={() => skipPrev()}><IoPlaySkipBack size={42} /></button>
        <button
          onClick={() => togglePlay()}
          style={{
            width: 76, height: 76, borderRadius: '50%', background: colors.primary, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: `0 6px 20px ${colors.primary}77`, transition: 'transform 0.15s',
          }}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.92)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isPlaying ? <IoPause size={44} color="#fff" /> : <IoPlay size={44} color="#fff" style={{ marginLeft: 4 }} />}
        </button>
        <button className="icon-btn" style={{ color: colors.text }} onClick={() => skipNext()}><IoPlaySkipForward size={42} /></button>
        <button className="icon-btn" style={{ color: repeatMode !== 'off' ? colors.primary : colors.textSecondary }} onClick={cyclRepeat}>
          <IoRepeat size={26} />
          {repeatMode === 'track' && <span style={{ position: 'absolute', fontSize: 8, bottom: 2, fontWeight: 900 }}>1</span>}
        </button>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', background: colors.surface, borderRadius: 16, padding: 4, marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab('lyrics')}
          style={{
            flex: 1, padding: '10px', borderRadius: 12, fontSize: 13, fontWeight: 700,
            background: activeTab === 'lyrics' ? colors.primary : 'transparent',
            color: activeTab === 'lyrics' ? '#fff' : colors.textSecondary,
            transition: 'all 0.2s'
          }}
        >Lyrics</button>
        <button
          onClick={() => setActiveTab('queue')}
          style={{
            flex: 1, padding: '10px', borderRadius: 12, fontSize: 13, fontWeight: 700,
            background: activeTab === 'queue' ? colors.primary : 'transparent',
            color: activeTab === 'queue' ? '#fff' : colors.textSecondary,
            transition: 'all 0.2s'
          }}
        >Up Next</button>
      </div>

      {/* Content Area (Lyrics or Queue) */}
      <div style={{ background: colors.surface, borderRadius: 20, padding: 16, marginBottom: 24, minHeight: 400 }}>
        {activeTab === 'lyrics' ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: colors.textSecondary }}>Lyrics</p>
            </div>
            {lyrics.length > 0 ? (
              <div ref={lyricsRef} style={{ height: 350, overflowY: 'auto', paddingRight: 4 }}>
                {lyrics.map((line, idx) => {
                  const isActive = idx === currentLyricIdx;
                  return (
                    <div key={`${line.time}-${idx}`} style={{
                      height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: isActive ? 1 : 0.4,
                      transform: isActive ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.3s',
                    }}>
                      <span style={{
                        fontSize: isActive ? 18 : 15, fontWeight: isActive ? 800 : 400,
                        color: isActive ? colors.primary : colors.textSecondary,
                        textAlign: 'center',
                        textShadow: isActive ? `0 0 20px ${colors.primary}` : 'none',
                      }}>{line.text}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                <span style={{ fontSize: 48 }}>🎵</span>
                <p style={{ color: colors.textSecondary, marginTop: 12, fontSize: 14 }}>No synchronized lyrics available</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: colors.textSecondary }}>Up Next</p>
              <span style={{ fontSize: 11, color: colors.primary, fontWeight: 600 }}>{queue.length} Songs</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 350, overflowY: 'auto', paddingRight: 4 }}>
              {queue.map((song, idx) => {
                const isCurrent = currentTrack.id === song.id;
                return (
                  <div
                    key={`queue-${song.id}-${idx}`}
                    onClick={() => jumpToQueueIndex(idx)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: 8, borderRadius: 12,
                      background: isCurrent ? `${colors.primary}15` : 'transparent',
                      cursor: 'pointer', transition: 'background 0.2s',
                      border: isCurrent ? `1px solid ${colors.primary}33` : '1px solid transparent'
                    }}
                    onMouseEnter={e => !isCurrent && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => !isCurrent && (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                      <img src={song.artworkUrl} alt={song.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {isCurrent && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div className="playing-bars">
                            <div className="bar" />
                            <div className="bar" />
                            <div className="bar" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: isCurrent ? colors.primary : colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.title}</div>
                      <div style={{ fontSize: 12, color: colors.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.artist}</div>
                    </div>
                    {isPlaying && isCurrent && <IoMusicalNotes size={16} color={colors.primary} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Options Menu */}
      {showMenu && (
        <div className="modal-backdrop" onClick={() => setShowMenu(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ padding: '12px 0 24px' }}>
            <div className="modal-handle" />
            <p style={{ fontWeight: 700, fontSize: 17, color: colors.text, padding: '0 20px 4px' }}>{currentTrack.title}</p>
            <p style={{ fontSize: 13, color: colors.textSecondary, padding: '0 20px 16px' }}>{currentTrack.artist}</p>
            {menuOptions.map(opt => (
              <button key={opt.label} onClick={opt.action} style={{
                display: 'flex', alignItems: 'center', gap: 16, width: '100%', padding: '14px 20px',
                background: 'none', border: 'none', color: colors.text, fontSize: 16, fontWeight: 500, cursor: 'pointer',
              }}>
                {opt.icon}{opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <PlaylistPickerModal 
        visible={pickerVisible} 
        onClose={() => setPickerVisible(false)} 
        song={currentTrack as SongItem} 
      />
    </div>
  );
}
