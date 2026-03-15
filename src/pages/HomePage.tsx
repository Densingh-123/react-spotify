import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMusicalNotes, IoNotificationsOutline, IoSettingsOutline, IoChevronForward, IoEllipsisHorizontal, IoLockClosed, IoFlame, IoGlobeOutline, IoCheckmarkCircle } from 'react-icons/io5';
import { useTrendingMusic } from '@/hooks/useMusicData';
import { useRecentlyPlayed } from '@/hooks/useRecentlyPlayed';
import { useAuth } from '@/context/AuthContext';
import { usePlayer } from '@/context/PlayerContext';
import { SongItem } from '@/services/api';
import { useTheme } from '@/context/ThemeContext';
import SongCard from '@/components/ui/SongCard';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import SongOptionsMenu from '@/components/SongOptionsMenu';
import PlaylistPickerModal from '@/components/PlaylistPickerModal';
import GlassCard from '@/components/ui/GlassCard';

const GENRES = [
  { label: 'Pop', color: '#FF6B6B', image: '/genres/pop.png' },
  { label: 'Chill', color: '#4ECDC4', image: '/genres/chill.png' },
  { label: 'Workout', color: '#45B7D1', image: '/genres/workout.png' },
  { label: 'Rock', color: '#96CEB4', image: '/genres/rock.png' },
  { label: 'Party', color: '#FFEEAD', image: '/genres/party.png' },
  { label: 'Melody', color: '#FFB7B2', image: '/genres/melody.png' },
  { label: 'Dance', color: '#E2F0CB', image: '/genres/dance.png' },
  { label: 'Devotional', color: '#B5EAD7', image: '/genres/devotional.png' },
  { label: 'Classical', color: '#C7CEEA', image: '/genres/classical.png' },
  { label: 'Jazz', color: '#D4A5A5', image: '/genres/jazz.png' },
  { label: 'Folk', color: '#9B59B6', image: '/genres/folk.png' },
  { label: 'Hip-Hop', color: '#E67E22', image: '/genres/hiphop.png' },
];

const GENRE_QUERIES: Record<string, string> = {
  Pop: 'pop hits 2024', Chill: 'lofi chill beats', Workout: 'workout motivation',
  Rock: 'classic rock anthems', Party: 'party dance hits', Jazz: 'smooth jazz collection',
  Melody: 'melody songs', Dance: 'folk dance songs', Devotional: 'devotional tracks',
  Classical: 'indian classical music', Folk: 'village folk music', 'Hip-Hop': 'hip hop beats 2024',
};

const LANGUAGES = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Marathi', 'Bengali', 'Bhojpuri', 'Malayalam', 'Gujarati', 'Punjabi'
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomePage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { user, preferences, prefLoading, updateLanguages } = useAuth();
  const { playTrack } = usePlayer();
  const { data: trending, isLoading, refetch } = useTrendingMusic(preferences?.languages);
  const { recentlyPlayed } = useRecentlyPlayed(12);
  const [selectedSong, setSelectedSong] = useState<SongItem | null>(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [tempLangs, setTempLangs] = useState<string[]>(preferences?.languages || []);

  const featured = trending?.slice(0, 3) || [];
  const topCharts = trending?.slice(3, 11) || [];
  const topAlbums = trending?.slice(11, 20) || [];
  const topArtists = trending?.slice(20, 28) || [];
  const trendingNow = trending?.slice(28) || [];

  const handlePlay = async (track: SongItem, list: SongItem[]) => {
    if (!user) { navigate('/login'); return; }
    const idx = list.findIndex(s => s.id === track.id);
    await playTrack(track, list, idx);
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

  // Show lang modal for new users who haven't set prefs
  useEffect(() => {
    if (user && !prefLoading && (!preferences?.languages || preferences.languages.length === 0)) {
      setLangModalVisible(true);
      setTempLangs(['English', 'Tamil']);
    }
  }, [user, prefLoading, preferences]);

  return (
    <div style={{ padding: '0 16px 16px', overflowY: 'auto', height: '100%' }}>
      {/* Mobile Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: colors.primary + '22', border: `1px solid ${colors.primary}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IoMusicalNotes size={26} color={colors.primary} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 600 }}>{getGreeting()} 👋</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: colors.text, letterSpacing: -0.8 }}>Melodify</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="icon-btn" onClick={() => { setTempLangs(preferences?.languages || []); setLangModalVisible(true); }} style={{ background: 'rgba(255,255,255,0.07)', color: colors.text }}>
            <IoGlobeOutline size={20} />
          </button>
          {/* <button className="icon-btn" onClick={() => navigate('/settings')} style={{ background: 'rgba(255,255,255,0.07)', color: colors.text }}>
            <IoNotificationsOutline size={20} />
          </button> */}
          <button className="icon-btn" onClick={() => navigate('/settings')} style={{ background: 'rgba(255,255,255,0.07)', color: colors.text }}>
            <IoSettingsOutline size={20} />
          </button>
        </div>
      </div>

      {/* Featured Today */}
      <div className="section">
        <div className="section-title" style={{ color: colors.text }}>Featured Today</div>
        <div className="h-scroll" style={{ gap: 14 }}>
          {isLoading ? [0, 1, 2].map(i => <SkeletonLoader key={i} width={280} height={220} style={{ marginRight: 0, borderRadius: 22, flexShrink: 0 }} />) :
            featured.map(item => (
              <div key={item.id} className="hero-card" style={{ width: 280, cursor: 'pointer' }} onClick={() => handlePlay(item, featured)}>
                <img src={item.artworkUrl} alt={item.title} className="hero-card-img" />
                <div className="hero-card-gradient">
                  <div style={{ position: 'absolute', top: 12, right: 12, background: colors.primary, padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 900, color: '#fff', letterSpacing: 1 }}>FEATURED</div>
                  <div style={{ fontSize: 19, fontWeight: 800, color: '#fff', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.artist}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 50, background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IoMusicalNotes size={18} color="#fff" />
                    </div>
                    <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => { e.stopPropagation(); openOptions(item); }}>
                      <IoEllipsisHorizontal size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <div className="section">
          <div className="section-header-row">
            <div className="section-title" style={{ color: colors.text, marginBottom: 0 }}>Recently Played</div>
            <button className="see-all-btn" onClick={() => navigate('/recently-played')}>
              See All <IoChevronForward size={14} />
            </button>
          </div>
          <div className="h-scroll">
            {recentlyPlayed.map((item, idx) => (
              <SongCard key={`rp-${item.id}-${idx}`} item={item} onPress={() => handlePlay(item, recentlyPlayed)} onMorePress={() => openOptions(item)} width={140} height={185} />
            ))}
          </div>
        </div>
      )}
      {!user && (
        <div className="section">
          <div className="section-title" style={{ color: colors.text }}>Recently Played</div>
          <GlassCard style={{ padding: 24, borderRadius: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
            <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 16 }}>Login to see your recently played songs</p>
            <button className="btn-primary" onClick={() => navigate('/login')} style={{ background: colors.primary }}>Login</button>
          </GlassCard>
        </div>
      )}

      {/* Genres */}
      <div className="section">
        <div className="section-title" style={{ color: colors.text }}>Genres & Moods</div>
        <div className="h-scroll">
          {GENRES.map(g => (
            <div key={g.label} className="genre-card"
              onClick={() => {
                const query = preferences?.languages?.length 
                  ? `${preferences.languages.join(' ')} ${GENRE_QUERIES[g.label] || g.label}`
                  : (GENRE_QUERIES[g.label] || g.label);
                navigate(`/playlist/${g.label.toLowerCase()}?name=${encodeURIComponent(g.label)}&query=${encodeURIComponent(query)}`);
              }}>
              <img src={g.image} alt={g.label} className="genre-card-img" />
              <div className="genre-card-overlay" style={{ background: `linear-gradient(to top, ${g.color}EE, transparent)` }}>
                <span className="genre-label">{g.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Charts */}
      <div className="section">
        <div className="section-header-row">
          <div className="section-title" style={{ color: colors.text, marginBottom: 0 }}>Top Charts</div>
          <button className="see-all-btn" onClick={() => navigate('/search')}>See All <IoChevronForward size={14} /></button>
        </div>
        <div className="h-scroll">
          {isLoading ? Array(4).fill(0).map((_, i) => <SkeletonLoader key={i} width={160} height={210} style={{ borderRadius: 16, flexShrink: 0 }} />) :
            topCharts.map((item, idx) => <SongCard key={item.id} item={item} onPress={() => handlePlay(item, topCharts)} onMorePress={() => openOptions(item)} width={160} height={210} />)}
        </div>
      </div>

      {/* Top Albums */}
      <div className="section">
        <div className="section-title" style={{ color: colors.text }}>Top Albums</div>
        <div className="h-scroll">
          {isLoading ? Array(4).fill(0).map((_, i) => <SkeletonLoader key={i} width={160} height={210} style={{ borderRadius: 16, flexShrink: 0 }} />) :
            topAlbums.map((item, idx) => <SongCard key={item.id} item={item} onPress={() => handlePlay(item, topAlbums)} onMorePress={() => openOptions(item)} width={160} height={210} />)}
        </div>
      </div>

      {/* Top Artists */}
      <div className="section">
        <div className="section-title" style={{ color: colors.text }}>Top Artists</div>
        <div className="h-scroll">
          {isLoading ? Array(4).fill(0).map((_, i) => <SkeletonLoader key={i} width={80} height={80} style={{ borderRadius: 40, flexShrink: 0 }} />) :
            topArtists.map((item, idx) => (
              <div key={item.id} style={{ textAlign: 'center', width: 100, flexShrink: 0, cursor: 'pointer' }} onClick={() => handlePlay(item, topArtists)}>
                <div style={{ width: 80, height: 80, borderRadius: 40, overflow: 'hidden', margin: '0 auto 8px' }}>
                  <img src={item.artworkUrl} alt={item.artist} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.artist || item.title}</div>
              </div>
            ))}
        </div>
      </div>

      {/* Trending Now */}
      {trendingNow.length > 0 && (
        <div className="section">
          <div className="section-title" style={{ color: colors.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            Trending Now <IoFlame color="#ff9800" size={20} />
          </div>
          <div className="h-scroll">
            {trendingNow.map((item, idx) => <SongCard key={item.id} item={item} onPress={() => handlePlay(item, trendingNow)} onMorePress={() => openOptions(item)} width={140} height={185} />)}
          </div>
        </div>
      )}

      <SongOptionsMenu visible={optionsVisible} onClose={() => setOptionsVisible(false)} song={selectedSong} onAddToPlaylist={openPicker} />
      <PlaylistPickerModal visible={pickerVisible} onClose={() => setPickerVisible(false)} song={selectedSong} />

      {/* Language Selection Modal */}
      {langModalVisible && (
        <div className="modal-backdrop center" onClick={() => setLangModalVisible(false)}>
          <div className="modal-center-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 450 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ width: 60, height: 60, borderRadius: 20, background: colors.primary + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <IoGlobeOutline size={32} color={colors.primary} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: colors.text }}>Preferred Languages</h2>
              <p style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>Select languages to personalize your music</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxHeight: 300, overflowY: 'auto', padding: '4px' }}>
              {LANGUAGES.map(lang => {
                const isSelected = tempLangs.includes(lang);
                return (
                  <button
                    key={lang}
                    onClick={() => toggleLang(lang)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px', borderRadius: 14, background: isSelected ? colors.primary + '15' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isSelected ? colors.primary + '44' : 'transparent'}`,
                      color: isSelected ? colors.primary : colors.text,
                      fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
                    }}
                  >
                    {lang}
                    {isSelected && <IoCheckmarkCircle size={18} color={colors.primary} />}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setLangModalVisible(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, background: colors.primary }} onClick={handleSaveLangs} disabled={tempLangs.length === 0}>
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
