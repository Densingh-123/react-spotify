import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  IoChevronBack, IoPause, IoDownload, IoSave, 
  IoCut, IoTimeOutline, IoCheckmarkCircle, IoList, IoMusicalNotes, IoPlay
} from 'react-icons/io5';
import { useTheme } from '@/context/ThemeContext';
import { SongItem, getLyrics, LyricsData } from '@/services/api';
import { usePlayer } from '@/context/PlayerContext';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

export default function RingtoneEditPage() {
  const { id } = useParams();
  const { colors } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [song, setSong] = useState<SongItem | null>(location.state?.song || null);
  
  const { currentTrack, isPlaying, position, duration, playTrack, togglePlay, seekTo } = usePlayer();
  const [lyrics, setLyrics] = useState<LyricsData | null>(null);
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const [range, setRange] = useState({ start: 0, end: 30 });
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (song && (!currentTrack || currentTrack.id !== song.id)) {
      playTrack(song);
    }
    if (song) fetchLyrics();
  }, [song]);

  const fetchLyrics = async () => {
    if (!song) return;
    setLoadingLyrics(true);
    try {
      const data = await getLyrics(song.id, song.title, song.artist);
      setLyrics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLyrics(false);
    }
  };

  const handleDownload = async () => {
    if (!currentTrack?.resolvedUrl && !currentTrack?.streamUrl) return;
    setDownloading(true);
    try {
      const url = currentTrack.resolvedUrl || currentTrack.streamUrl;
      const response = await fetch(url!);
      const blob = await response.blob();
      const localUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = localUrl;
      a.download = `${song?.title || 'ringtone'}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(localUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed', error);
      alert('Failed to download.');
    } finally {
      setDownloading(false);
    }
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const seekTime = percentage * duration;
    seekTo(seekTime);
  };

  const currentLyricIndex = useMemo(() => {
    if (!lyrics?.synced || lyrics.synced.length === 0) return -1;
    let index = -1;
    for (let i = 0; i < lyrics.synced.length; i++) {
      if (position >= lyrics.synced[i].time) {
        index = i;
      } else {
        break;
      }
    }
    return index;
  }, [lyrics, position]);

  if (!song) return <div style={{ padding: 40, textAlign: 'center', color: colors.text }}>Ringtone not found</div>;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: colors.background, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, zIndex: 10 }}>
        <button className="icon-btn" onClick={() => navigate(-1)} style={{ color: colors.text }}>
          <IoChevronBack size={26} />
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: colors.text, margin: 0 }}>Ringtone Studio</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 120px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
          <div style={{ 
            width: 200, height: 200, borderRadius: 32, overflow: 'hidden', 
            boxShadow: `0 20px 40px ${colors.primary}44`, marginBottom: 24,
            border: `4px solid ${colors.surfaceHighlight}`,
            transform: isPlaying ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <img src={song.artworkUrl} alt={song.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: colors.text, margin: '0 0 8px 0', textShadow: `0 0 20px ${colors.primary}33` }}>{song.title}</h2>
            <p style={{ fontSize: 16, color: colors.textSecondary, fontWeight: 600, margin: 0 }}>{song.artist}</p>
          </div>
        </div>

        {/* Professional Trimmer UI */}
        <div style={{ 
          width: '100%', background: `linear-gradient(180deg, ${colors.surfaceHighlight}, ${colors.surface}dd)`, 
          padding: 24, borderRadius: 32, marginBottom: 32, border: `1px solid ${colors.glassBorder}`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
               <div style={{ width: 32, height: 32, borderRadius: 8, background: colors.primary + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <IoCut color={colors.primary} size={18} />
               </div>
               <span style={{ color: colors.text, fontWeight: 800, fontSize: 14 }}>Precision Tuner</span>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <div style={{ background: colors.surface, padding: '4px 12px', borderRadius: 20, fontSize: 12, color: colors.textSecondary, border: `1px solid ${colors.glassBorder}` }}>
                   Seek: {Math.floor(position)}s
                </div>
                <div style={{ background: colors.primary, padding: '4px 12px', borderRadius: 20, fontSize: 12, color: '#fff', fontWeight: 'bold' }}>
                   Duration: {Math.round(duration)}s
                </div>
             </div>
          </div>
          
          <div 
            onClick={handleWaveformClick}
            style={{ 
              height: 100, background: 'rgba(0,0,0,0.2)', borderRadius: 20, position: 'relative', 
              overflow: 'hidden', cursor: 'pointer', border: `1px solid ${colors.glassBorder}`
            }}
          >
             {/* Dynamic Waveform Bars */}
             <div style={{ display: 'flex', alignItems: 'end', gap: 2, height: '100%', width: '100%', padding: '0 4px' }}>
               {Array(100).fill(0).map((_, i) => {
                 const barPos = i / 100;
                 const isPlayed = barPos <= (position / (duration || 1));
                 const baseHeight = 30 + (Math.sin(i * 0.3) * 20 + 20);
                 // Increased movement for "moving" effect
                 const activeHeight = isPlaying ? baseHeight + (Math.sin((Date.now() / 150) + i) * 15) : baseHeight;
                 
                 return (
                   <div key={i} style={{ 
                     flex: 1, 
                     background: isPlayed ? colors.primary : colors.textSecondary,
                     opacity: isPlayed ? 1 : 0.2,
                     height: `${activeHeight}%`, 
                     borderRadius: '2px 2px 0 0',
                     transition: 'height 0.05s linear, background 0.3s ease',
                     boxShadow: isPlayed ? `0 0 10px ${colors.primary}66` : 'none'
                   }} />
                 );
               })}
             </div>

             {/* Live Playhead */}
             <div style={{ 
               position: 'absolute', left: `${(position / (duration || 1)) * 100}%`, width: 2,
               height: '100%', background: '#fff', boxShadow: '0 0 10px #fff', zIndex: 10,
               transition: 'left 0.1s linear'
             }} />
          </div>

          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
             <button 
               onClick={togglePlay}
               style={{ 
                 width: 64, height: 64, borderRadius: '50%', background: colors.primary, color: '#fff',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer',
                 boxShadow: `0 10px 20px ${colors.primary}44`, transform: isPlaying ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s'
               }}
             >
                {isPlaying ? <IoPause size={30} /> : <IoPlay size={30} style={{ marginLeft: 4 }} />}
             </button>

             <button 
               onClick={handleDownload}
               disabled={downloading || (!currentTrack?.streamUrl && !currentTrack?.resolvedUrl)}
               style={{ 
                 padding: '18px 40px', borderRadius: 20, background: colors.text, 
                 color: colors.background, fontWeight: 900, fontSize: 16, display: 'flex', alignItems: 'center', gap: 12,
                 cursor: 'pointer', transition: 'all 0.2s', border: 'none',
                 boxShadow: `0 10px 20px rgba(0,0,0,0.3)`
               }}
             >
               {downloading ? <div className="spinner" style={{ width: 20, height: 20, borderColor: colors.background, borderTopColor: 'transparent' }} /> : <IoSave size={22} />}
               <span>{downloading ? 'Studios Working...' : 'Save Ringtone'}</span>
             </button>
          </div>
        </div>

        {/* Neon Lyrics Section */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ height: 1, flex: 1, background: `linear-gradient(to right, transparent, ${colors.primary}66)` }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <IoMusicalNotes size={22} color={colors.primary} />
              <h3 style={{ fontSize: 20, fontWeight: 900, color: colors.text, margin: 0, letterSpacing: 1 }}>STUDIO LYRICS</h3>
            </div>
            <div style={{ height: 1, flex: 1, background: `linear-gradient(to left, transparent, ${colors.primary}66)` }} />
          </div>
          
          <div style={{ 
            background: `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))`, 
            borderRadius: 32, padding: 32, border: `1px solid ${colors.glassBorder}`,
            minHeight: 250, maxHeight: 500, overflowY: 'auto',
            boxShadow: `inset 0 0 40px rgba(0,0,0,0.5)`,
            backdropFilter: 'blur(10px)'
          }}>
            {loadingLyrics ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                <SkeletonLoader height={24} width="70%" />
                <SkeletonLoader height={24} width="50%" />
                <SkeletonLoader height={24} width="60%" />
              </div>
            ) : (lyrics?.synced && lyrics.synced.length > 0) || (lyrics?.plain) ? (
              <div style={{ 
                margin: 0, whiteSpace: 'pre-wrap', color: '#fff',
                fontSize: 20, fontWeight: 800, lineHeight: 2.2, textAlign: 'center',
                fontFamily: "'Outfit', sans-serif"
              }}>
                {(lyrics?.synced && lyrics.synced.length > 0 ? lyrics.synced : lyrics?.plain?.split('\n')?.map((t, i) => ({ time: 0, text: t })) || []).map((line: any, i: number) => {
                  const isActive = currentLyricIndex === i;
                  return (
                    <p key={i} style={{ 
                      margin: '0 0 16px 0', 
                      opacity: isActive ? 1 : 0.3,
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      color: isActive ? colors.primary : '#fff',
                      textShadow: isActive ? `0 0 15px ${colors.primary}, 0 0 30px ${colors.primary}44` : 'none',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                      {line.text}
                    </p>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <IoList size={48} color={`${colors.textSecondary}33`} style={{ marginBottom: 16 }} />
                <p style={{ color: colors.textSecondary, fontSize: 16, fontWeight: 600 }}>No studio lyrics available for this session.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
