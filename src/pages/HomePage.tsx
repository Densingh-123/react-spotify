import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoPlay, IoMusicalNotes, IoNotificationsOutline, IoSettingsOutline, IoChevronForward, IoEllipsisHorizontal, IoLockClosed, IoFlame, IoGlobeOutline, IoCheckmarkCircle, IoHandRight } from 'react-icons/io5';
import {
  FaPodcast, FaHeart, FaLeaf, FaSmile, FaBolt, FaCar, FaGlassCheers, FaDumbbell, FaCloudRain, FaLightbulb, FaMoon
} from 'react-icons/fa';

import { useTrendingMusic } from '@/hooks/useMusicData';
import { useRecentlyPlayed } from '@/hooks/useRecentlyPlayed';
import { useAuth } from '@/context/AuthContext';
import { usePlayer } from '@/context/PlayerContext';
import { SongItem, fetchMoodSongs } from '@/services/api';
import { useTheme } from '@/context/ThemeContext';
import SongCard from '@/components/ui/SongCard';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import SongOptionsMenu from '@/components/SongOptionsMenu';
import PlaylistPickerModal from '@/components/PlaylistPickerModal';
import GlassCard from '@/components/ui/GlassCard';

// YouTube Music-style mood filter chips
const MOOD_FILTERS = [
  { label: 'All', icon: <IoMusicalNotes /> },
  { label: 'Podcasts', icon: <FaPodcast /> },
  { label: 'Romance', icon: <FaHeart /> },
  { label: 'Relax', icon: <FaLeaf /> },
  { label: 'Feel good', icon: <FaSmile /> },
  { label: 'Energise', icon: <FaBolt /> },
  { label: 'Commute', icon: <FaCar /> },
  { label: 'Party', icon: <FaGlassCheers /> },
  { label: 'Work out', icon: <FaDumbbell /> },
  { label: 'Sad', icon: <FaCloudRain /> },
  { label: 'Focus', icon: <FaLightbulb /> },
  { label: 'Sleep', icon: <FaMoon /> },
];

const LANGUAGES = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Marathi', 'Bengali', 'Bhojpuri', 'Malayalam', 'Gujarati', 'Punjabi'
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function getCleanName(user: { displayName?: string | null; email?: string | null } | null): string {
  if (!user) return '';
  if (user.displayName) {
    return user.displayName.split(' ')[0].replace(/[0-9]/g, '');
  }
  if (user.email) {
    const local = user.email.split('@')[0].replace(/[0-9]/g, '') || 'Friend';
    return local.charAt(0).toUpperCase() + local.slice(1).toLowerCase();
  }
  return 'Friend';
}

function getContrastColor(hex: string) {
  if (!hex) return '#ffffff';
  let c = hex.startsWith('#') ? hex.substring(1) : hex;
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  if (c.length !== 6) return '#ffffff';
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 128 ? '#ffffff' : '#000000';
}

const uniqueSongs = (songs: SongItem[]) =>
  Array.from(new Map(songs.map(s => [s.id, s])).values());

// Global cache to preserve the user's selected Home tab across screen navigation
let globalActiveFilter = 'All';
let globalFilteredSongs: SongItem[] = [];

export default function HomePage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { user, preferences, prefLoading, updateLanguages } = useAuth();
  const { playTrack } = usePlayer();

  const userLangs = preferences?.languages?.length ? preferences.languages : ['English', 'Tamil', 'Hindi'];
  const { data: trending, isLoading } = useTrendingMusic(userLangs);
  const { recentlyPlayed } = useRecentlyPlayed(12);

  const [activeFilter, setActiveFilter] = useState(globalActiveFilter);
  const [filteredSongs, setFilteredSongs] = useState<SongItem[]>(globalFilteredSongs);
  const [filterLoading, setFilterLoading] = useState(false);

  const [selectedSong, setSelectedSong] = useState<SongItem | null>(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [tempLangs, setTempLangs] = useState<string[]>(preferences?.languages || []);

  const handleFilterSelect = useCallback(async (filter: string) => {
    setActiveFilter(filter);
    globalActiveFilter = filter;
    if (filter === 'All') {
      setFilteredSongs([]);
      globalFilteredSongs = [];
      return;
    }
    setFilterLoading(true);
    try {
      const songs = await fetchMoodSongs(filter, userLangs);
      const deduped = uniqueSongs(songs);
      setFilteredSongs(deduped);
      globalFilteredSongs = deduped;
    } catch (e) {
      console.warn('Failed to load mood songs', e);
    } finally {
      setFilterLoading(false);
    }
  }, [userLangs]);

  const allTrending = uniqueSongs(trending || []);

  const safeSlice = (arr: SongItem[], seed: number) => {
    if (!arr.length) return [];
    const offset = (seed * 17) % arr.length;
    const result = [];
    for(let i = 0; i < Math.min(25, arr.length); i++) {
      result.push(arr[(offset + i) % arr.length]);
    }
    return result;
  };

  const featuredNow    = safeSlice(allTrending, 1);
  const quickPicks     = safeSlice(allTrending, 2);
  const freshFinds     = safeSlice(allTrending, 3);
  const newReleases    = safeSlice(allTrending, 4);
  const oldFavourites  = safeSlice(allTrending, 5);
  const topCharts      = safeSlice(allTrending, 6);
  const topAlbums      = safeSlice(allTrending, 7);
  const trendingSongs  = allTrending; // User request: Show ALL songs in Trending Now

  const listenAgain    = uniqueSongs(recentlyPlayed).slice(0, 25);

  const topArtists = Array.from(
    new Map(allTrending.map(item => [item.artist, item])).values()
  ).slice(0, 25);

  const handlePlay = async (track: SongItem, fallbackList: SongItem[]) => {
    if (!user) { navigate('/login'); return; }
    
    let queue = activeFilter !== 'All' ? displaySongs : allTrending;
    if (!queue.find(s => s.id === track.id)) {
      queue = [...fallbackList, ...queue];
    }
    
    const deduped = uniqueSongs(queue);
    const idx = deduped.findIndex(s => s.id === track.id);
    await playTrack(track, deduped, Math.max(0, idx));
    navigate('/player');
  };

  const openOptions = (song: SongItem) => { setSelectedSong(song); setOptionsVisible(true); };
  const openPicker = () => { setOptionsVisible(false); setPickerVisible(true); };

  const handleSaveLangs = async () => {
    if (tempLangs.length === 0) return;
    await updateLanguages(tempLangs);
    setLangModalVisible(false);
  };

  const toggleLang = (lang: string) => {
    setTempLangs(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]);
  };

  useEffect(() => {
    if (user && !prefLoading && (!preferences?.languages || preferences.languages.length === 0)) {
      setLangModalVisible(true);
      setTempLangs(['English', 'Tamil']);
    }
  }, [user, prefLoading, preferences]);

  const displaySongs = activeFilter !== 'All' ? filteredSongs : [];

  const renderSection = (title: string, songs: SongItem[], icon?: React.ReactNode, noMargin?: boolean) => {
    if (!songs || songs.length === 0) return null;
    return (
      <div className="section" style={{ marginBottom: noMargin ? 0 : 28 }}>
        <div className="section-header-row" style={{ marginBottom: 14 }}>
          <div className="section-title" style={{ color: colors.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            {icon} {title}
          </div>
        </div>
        <div className="h-scroll" style={{ gap: 14 }}>
          {songs.map((item) => (
            <SongCard
              key={`${title}-${item.id}`}
              item={item}
              onPress={() => handlePlay(item, songs)}
              onMorePress={() => openOptions(item)}
              width={150} height={200}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '0 16px 65px', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: colors.primary + '22', border: `1px solid ${colors.primary}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IoMusicalNotes size={24} color={colors.primary} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              {getGreeting()}{user ? `, ${getCleanName(user)}` : ''}
              <IoHandRight size={13} color={colors.primary} style={{ marginLeft: 2 }} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: colors.text, letterSpacing: -0.5 }}>Melodify</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="icon-btn" onClick={() => { setTempLangs(preferences?.languages || []); setLangModalVisible(true); }} style={{ background: 'rgba(255,255,255,0.05)', color: colors.text }}>
            <IoGlobeOutline size={20} />
          </button>
          <button className="icon-btn" onClick={() => navigate('/settings')} style={{ background: 'rgba(255,255,255,0.05)', color: colors.text }}>
            <IoSettingsOutline size={20} />
          </button>
        </div>
      </div>

      {/* ── Genres & Moods ── */}
      <div className="section-title" style={{ color: colors.text, marginBottom: 12 }}>Genres & Moods</div>
      <div className="h-scroll" style={{ gap: 8, marginBottom: 20, paddingBottom: 4 }}>
        {MOOD_FILTERS.map(f => {
          const isActive = activeFilter === f.label;
          const activeTextColor = getContrastColor(colors.primary);
          return (
            <button
              key={f.label}
              onClick={() => handleFilterSelect(f.label)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 20,
                background: isActive ? colors.primary : colors.surface,
                border: `1px solid ${isActive ? colors.primary : 'rgba(255,255,255,0.12)'}`,
                color: isActive ? activeTextColor : colors.text,
                fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >
              <span style={{ color: isActive ? activeTextColor : colors.textSecondary, display: 'flex', alignItems: 'center' }}>
                {f.icon}
              </span>
              {f.label}
            </button>
          );
        })}
      </div>

      {/* ── Always Visible Top Sections ── */}
      {featuredNow.length > 0 && (
        <div className="section" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ color: colors.text }}>Featured Today</div>
          <div className="h-scroll" style={{ gap: 14 }}>
            {isLoading ? [0, 1, 2].map(i => <SkeletonLoader key={i} width={280} height={200} style={{ borderRadius: 22, flexShrink: 0 }} />) :
              featuredNow.map(item => (
                <div key={`feat-${item.id}`} className="hero-card" style={{ width: 280, height: 200, cursor: 'pointer' }} onClick={() => handlePlay(item, featuredNow)}>
                  <img src={item.artworkUrl} alt={item.title} className="hero-card-img" />
                  <div className="hero-card-gradient" style={{ padding: '16px', paddingTop: '40px' }}>
                    <div style={{ position: 'absolute', top: 12, right: 12, background: colors.primary, padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 900, color: getContrastColor(colors.primary), letterSpacing: 1 }}>FEATURED</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.artist}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 18, background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IoPlay size={18} color={getContrastColor(colors.primary)} />
                      </div>
                      <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => { e.stopPropagation(); openOptions(item); }}>
                        <IoEllipsisHorizontal size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {listenAgain.length > 0 && (
        <div className="section" style={{ marginBottom: 28 }}>
          <div className="section-header-row" style={{ marginBottom: 14 }}>
            <div className="section-title" style={{ color: colors.text, marginBottom: 0 }}>Listen Again</div>
            <button className="see-all-btn" onClick={() => navigate('/recently-played')} style={{ color: '#aaa', fontSize: 13, fontWeight: 600 }}>
              See All <IoChevronForward size={12} />
            </button>
          </div>
          <div className="h-scroll" style={{ gap: 14 }}>
            {listenAgain.map((item, idx) => (
              <SongCard key={`la-${item.id}-${idx}`} item={item} onPress={() => handlePlay(item, listenAgain)} onMorePress={() => openOptions(item)} width={150} height={200} />
            ))}
          </div>
        </div>
      )}

      {!user && (
        <div className="section" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ color: colors.text }}>Listen Again</div>
          <GlassCard style={{ padding: 24, borderRadius: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
            <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 16 }}>Login to see your recently played songs</p>
            <button className="btn-primary" onClick={() => navigate('/login')} style={{ background: colors.primary, padding: '12px 24px', borderRadius: 12 }}>Login</button>
          </GlassCard>
        </div>
      )}

      {/* Mood Filtered Content or Default Content */}
      {activeFilter !== 'All' ? (
        <div>
          {filterLoading ? (
            <div>
              {renderSection(`Top Charts`, [])}
              {renderSection(`Trending Now`, [])}
            </div>
          ) : displaySongs.length > 0 ? (
            <div>
              {renderSection(`Top ${activeFilter} Picks`, displaySongs.slice(0, 25))}
              {renderSection(`Top Charts`, displaySongs.slice(25, 50))}
              {renderSection(`Top Albums`, displaySongs.slice(50, 75))}
              {renderSection(`Trending Now`, displaySongs.slice(75, 100))}
              {renderSection(`New ${activeFilter}`, displaySongs.slice(100, 125))}
              {renderSection(`Best of ${activeFilter}`, displaySongs.slice(125, 150))}
              {renderSection(`More ${activeFilter}`, displaySongs.slice(150, 250))}
            </div>
          ) : (
            <div style={{ color: colors.textSecondary, padding: '0 16px', marginTop: 12 }}>No songs found for "{activeFilter}"</div>
          )}
        </div>
      ) : (
        <div>
          {/* ── Default Home Content ── */}
          {isLoading ? (
            <div className="section" style={{ marginBottom: 28 }}>
              <div className="section-title" style={{ color: colors.text }}>Quick Picks</div>
              <div className="h-scroll" style={{ gap: 14 }}>
                {[0, 1, 2, 3].map(i => <SkeletonLoader key={i} width={150} height={200} style={{ flexShrink: 0 }} />)}
              </div>
            </div>
          ) : renderSection('Quick Picks', quickPicks)}

          {renderSection('Fresh Finds', freshFinds)}
          {renderSection('New Releases', newReleases)}
          {renderSection('Old Favourites', oldFavourites)}
          
          {renderSection('Top Charts', topCharts)}
          {renderSection('Top Albums', topAlbums)}

          {/* Top Artists */}
      {topArtists.length > 0 && (
        <div className="section" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ color: colors.text }}>Top Artists</div>
          <div className="h-scroll" style={{ gap: 14 }}>
            {isLoading ? [0, 1, 2, 3].map((_, i) => <SkeletonLoader key={i} width={80} height={80} style={{ borderRadius: 40, flexShrink: 0 }} />) :
              topArtists.map(item => (
                <div key={`artist-${item.artist}`} style={{ textAlign: 'center', width: 90, flexShrink: 0, cursor: 'pointer' }} onClick={() => handlePlay(item, topArtists)}>
                  <div style={{ width: 80, height: 80, borderRadius: 40, overflow: 'hidden', margin: '0 auto 8px' }}>
                    <img src={item.artworkUrl} alt={item.artist} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.artist || item.title}</div>
                </div>
              ))}
          </div>
        </div>
      )}

          {renderSection(`Trending Now (${allTrending.length})`, trendingSongs, <IoFlame color="#ff9800" size={20} />, true)}

        </div>
      )}

      <SongOptionsMenu visible={optionsVisible} onClose={() => setOptionsVisible(false)} song={selectedSong} onAddToPlaylist={openPicker} />
      <PlaylistPickerModal visible={pickerVisible} onClose={() => setPickerVisible(false)} song={selectedSong} />

      {/* Language Selection Modal */}
      {langModalVisible && (
        <div className="modal-backdrop center" onClick={() => setLangModalVisible(false)} style={{ zIndex: 99999 }}>
          <div className="modal-center-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 450, background: colors.surface }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: colors.text, margin: 0 }}>Select Languages</h2>
                <button style={{ background: 'none', border: 'none', color: colors.text }} onClick={() => setLangModalVisible(false)}>✕</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
              {LANGUAGES.map(lang => {
                const isSelected = tempLangs.includes(lang);
                return (
                  <button
                    key={lang}
                    onClick={() => toggleLang(lang)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 16px', borderRadius: 12, background: isSelected ? colors.primary : colors.surfaceHighlight,
                      border: `1px solid ${isSelected ? colors.primary : 'transparent'}`,
                      color: isSelected ? '#fff' : colors.text,
                      fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
                    }}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>

            <button style={{ width: '100%', marginTop: 32, padding: '16px', borderRadius: 16, background: colors.primary, color: '#fff', fontSize: 18, fontWeight: 'bold', border: 'none', cursor: 'pointer' }} onClick={handleSaveLangs} disabled={tempLangs.length === 0}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
