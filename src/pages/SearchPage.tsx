import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IoSearch, IoClose, IoPlay, IoEllipsisVertical } from 'react-icons/io5';
import { useSearchMusic, useTrendingMusic } from '@/hooks/useMusicData';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/context/AuthContext';
import { usePlayer } from '@/context/PlayerContext';
import { SongItem } from '@/services/api';
import { useTheme } from '@/context/ThemeContext';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import SongOptionsMenu from '@/components/SongOptionsMenu';
import PlaylistPickerModal from '@/components/PlaylistPickerModal';

export default function SearchPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, preferences } = useAuth();
  const { playTrack } = usePlayer();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedSong, setSelectedSong] = useState<SongItem | null>(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 400);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useSearchMusic(debouncedQuery);
  const { data: recommendations, isLoading: recoLoading } = useTrendingMusic(preferences?.languages);
  
  const results: SongItem[] = data?.pages.flatMap(p => p) || [];
  const recommendedResults = Array.from(new Map((recommendations || []).map(s => [s.id, s])).values());

  const handlePlay = async (track: SongItem, list?: SongItem[]) => {
    if (!user) { navigate('/login'); return; }
    setPlayingId(track.id);
    const queue = list && list.length > 0 ? list : recommendedResults;
    const deduped = Array.from(new Map(queue.map(s => [s.id, s])).values());
    const idx = deduped.findIndex(s => s.id === track.id);
    await playTrack(track, deduped, Math.max(0, idx));
    navigate('/player');
    setPlayingId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '16px 16px 0' }}>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: colors.primary, marginBottom: 16 }}>Search</h1>
        <div className="input-wrapper" style={{ background: colors.surface, border: `1px solid ${colors.glassBorder}`, borderRadius: 30, padding: '0 20px', height: 56 }}>
          <IoSearch size={22} color={colors.textSecondary} />
          <input
            style={{ flex: 1, fontSize: 16, color: colors.text, marginLeft: 8 }}
            placeholder="Artists, songs, or podcasts"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button className="icon-btn" onClick={() => setQuery('')} style={{ color: colors.textSecondary }}>
              <IoClose size={22} />
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div style={{ padding: '16px' }}>
          {[1, 2, 3, 4, 5].map(i => <SkeletonLoader key={i} height={80} style={{ marginBottom: 10, borderRadius: 14 }} />)}
        </div>
      )}

      {/* Empty states or Recommended Feed */}
      {!isLoading && query.length === 0 && (
        <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Recommended for You</h2>
          {recoLoading ? (
            Array(6).fill(0).map((_, i) => <SkeletonLoader key={i} height={80} style={{ marginBottom: 12, borderRadius: 16 }} />)
          ) : (
            recommendedResults.map((item, index) => (
              <div
                key={`reco-${item.id}-${index}`}
                style={{
                  height: 80, borderRadius: 16, overflow: 'hidden',
                  position: 'relative', cursor: 'pointer', marginBottom: 12,
                }}
                onClick={() => handlePlay(item, recommendedResults)}
              >
                <img src={item.artworkUrl} alt={item.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.5), rgba(0,0,0,0.7))',
                  display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12,
                }}>
                  <span style={{ fontSize: 18, color: colors.primary, flexShrink: 0 }}>✨</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 900, fontSize: 15, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.artist}</div>
                  </div>
                  <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                    onClick={e => { e.stopPropagation(); setSelectedSong(item); setOptionsVisible(true); }}>
                    <IoEllipsisVertical size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {!isLoading && query.length > 0 && results.length === 0 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 80 }}>
          <div style={{ fontSize: 52 }}>🎵</div>
          <p style={{ color: colors.textSecondary, marginTop: 12 }}>No results found for "{query}"</p>
        </div>
      )}

      {/* Results */}
      {!isLoading && results.length > 0 && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {results.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              style={{
                height: 80, borderRadius: 16, overflow: 'hidden',
                position: 'relative', cursor: 'pointer', marginBottom: 12,
              }}
              onClick={() => handlePlay(item, results)}
            >
              {/* Background image */}
              <img src={item.artworkUrl} alt={item.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              {/* Dark gradient overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.5), rgba(0,0,0,0.7))',
                display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12,
              }}>
                {playingId === item.id ? (
                  <span className="spinner" style={{ flexShrink: 0 }} />
                ) : (
                  <IoPlay size={18} color={colors.primary} style={{ flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 900, fontSize: 15, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.artist}</div>
                </div>
                <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                  onClick={e => { e.stopPropagation(); setSelectedSong(item); setOptionsVisible(true); }}>
                  <IoEllipsisVertical size={20} />
                </button>
              </div>
            </div>
          ))}
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              style={{ width: '100%', padding: 14, background: 'var(--color-surface)', border: '1px solid var(--color-glass-border)', borderRadius: 12, color: colors.primary, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      )}

      <SongOptionsMenu visible={optionsVisible} onClose={() => setOptionsVisible(false)} song={selectedSong} onAddToPlaylist={() => { setOptionsVisible(false); setPickerVisible(true); }} />
      <PlaylistPickerModal visible={pickerVisible} onClose={() => setPickerVisible(false)} song={selectedSong} />
    </div>
  );
}
