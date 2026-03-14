import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IoMusicalNotes, IoSearch, IoPlay, IoPause, IoChevronBack, 
  IoHeart, IoHeartOutline, IoCut, IoNotifications
} from 'react-icons/io5';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useRingtones } from '@/hooks/useRingtones';
import { usePlayer } from '@/context/PlayerContext';
import { fetchTrendingRingtones, searchRingtones, SongItem } from '@/services/api';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

export default function RingtonesPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { user, preferences } = useAuth();
  const { playTrack, currentTrack, isPlaying: isGlobalPlaying, pause } = usePlayer();
  const { toggleLikeRingtone, isRingtoneLiked } = useRingtones();

  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState<SongItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        loadTrending();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadTrending = async () => {
    setLoading(true);
    const results = await fetchTrendingRingtones(preferences?.languages);
    setSongs(results);
    setLoading(false);
  };

  const performSearch = async (query: string) => {
    setLoading(true);
    const results = await searchRingtones(query, preferences?.languages);
    setSongs(results);
    setLoading(false);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const togglePlay = async (song: SongItem) => {
    if (!user) { navigate('/login'); return; }
    
    if (currentTrack?.id === song.id && isGlobalPlaying) {
      pause();
    } else {
      await playTrack(song, songs);
    }
  };

  const isPlaying = (id: string) => currentTrack?.id === id && isGlobalPlaying;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: colors.background }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button className="icon-btn" onClick={() => navigate(-1)} style={{ color: colors.text }}>
          <IoChevronBack size={24} />
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: colors.text, margin: 0 }}>Ringtones</h1>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 16,
          background: colors.surface, border: `1px solid ${colors.glassBorder}`
        }}>
          <IoSearch size={20} color={colors.textSecondary} />
          <input 
            placeholder="Search ringtones..." 
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{ 
              flex: 1, background: 'none', border: 'none', outline: 'none', 
              color: colors.text, fontSize: 16
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: colors.text, marginBottom: 16 }}>
          {searchQuery ? 'Search Results' : 'Trending Previews'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading ? (
            Array(8).fill(0).map((_, i) => <SkeletonLoader key={i} height={80} style={{ borderRadius: 16 }} />)
          ) : (
            songs.map((song) => (
              <div 
                key={song.id}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16,
                  background: colors.surface, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                {/* Artwork / Play Toggle */}
                <div 
                  onClick={() => togglePlay(song)}
                  style={{ 
                    position: 'relative', width: 56, height: 56, borderRadius: 12, overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                >
                  <img src={song.artworkUrl} alt={song.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ 
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isPlaying(song.id) ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'
                  }}>
                    {isPlaying(song.id) ? <IoPause size={24} color="#fff" /> : <IoPlay size={24} color="#fff" />}
                  </div>
                </div>

                {/* Info */}
                <div 
                  onClick={() => navigate(`/ringtones/edit/${song.id}`, { state: { song } })}
                  style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {song.title}
                  </div>
                  <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {song.artist}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button 
                    onClick={() => toggleLikeRingtone(song)}
                    className="icon-btn" 
                    style={{ color: isRingtoneLiked(song.id) ? '#e91e63' : colors.textSecondary }}
                  >
                    {isRingtoneLiked(song.id) ? <IoHeart size={22} /> : <IoHeartOutline size={22} />}
                  </button>
                  <button 
                    onClick={() => navigate(`/ringtones/edit/${song.id}`, { state: { song } })}
                    className="icon-btn" 
                    style={{ color: colors.primary }}
                  >
                    <IoCut size={22} />
                  </button>
                  <button className="icon-btn" style={{ color: colors.textSecondary }}>
                    <IoNotifications size={22} />
                  </button>
                </div>
              </div>
            ))
          )}

          {!loading && songs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.3 }}>🎧</div>
              <p style={{ color: colors.textSecondary }}>No ringtones found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
