import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoChevronBack, IoMusicalNotes, IoPerson, IoPlay, IoEllipsisHorizontal } from 'react-icons/io5';
import { searchMusic, SongItem } from '@/services/api';
import { usePlayer } from '@/context/PlayerContext';
import { useTheme } from '@/context/ThemeContext';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import SongOptionsMenu from '@/components/SongOptionsMenu';
import PlaylistPickerModal from '@/components/PlaylistPickerModal';

export default function ArtistPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { playTrack } = usePlayer();
  
  const [songs, setSongs] = useState<SongItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState<SongItem | null>(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    if (!name) return;
    setLoading(true);
    searchMusic(name)
      .then(res => {
        setSongs(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [name]);

  const handlePlay = (song: SongItem) => {
    playTrack(song, songs, songs.indexOf(song));
    navigate('/player');
  };

  return (
    <div style={{ padding: '0 16px 100px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0', gap: 16 }}>
        <button className="icon-btn" onClick={() => navigate(-1)} style={{ color: colors.text }}>
          <IoChevronBack size={24} />
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: colors.text, margin: 0 }}>Artist</h1>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 32, marginTop: 16 }}>
        <div style={{ 
          width: 120, height: 120, borderRadius: 60, overflow: 'hidden', margin: '0 auto 16px',
          boxShadow: `0 8px 24px ${colors.primary}33`, background: colors.surface
        }}>
          {songs[0]?.artworkUrl ? (
            <img src={songs[0].artworkUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IoPerson size={48} color={colors.textSecondary} />
            </div>
          )}
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: colors.text, margin: 0 }}>{name}</h2>
        <p style={{ color: colors.textSecondary, fontSize: 14, marginTop: 4 }}>{songs.length} Tracks</p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: colors.text, margin: 0 }}>Top Songs</h3>
          <button 
            onClick={() => songs[0] && handlePlay(songs[0])}
            style={{ 
              width: 44, height: 44, borderRadius: 22, background: colors.primary, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' 
            }}
          >
            <IoPlay size={20} color="#fff" style={{ marginLeft: 2 }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading ? (
            Array(5).fill(0).map((_, i) => <SkeletonLoader key={i} height={64} style={{ borderRadius: 12 }} />)
          ) : (
            songs.map((song, idx) => (
              <div 
                key={song.id} 
                onClick={() => handlePlay(song)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 12, padding: 8, borderRadius: 12,
                  background: colors.surface, cursor: 'pointer'
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden' }}>
                  <img src={song.artworkUrl} alt={song.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.title}</div>
                  <div style={{ fontSize: 12, color: colors.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.artist}</div>
                </div>
                <button 
                  className="icon-btn" 
                  onClick={(e) => { e.stopPropagation(); setSelectedSong(song); setOptionsVisible(true); }}
                  style={{ color: colors.textSecondary }}
                >
                  <IoEllipsisHorizontal size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <SongOptionsMenu 
        visible={optionsVisible} 
        onClose={() => setOptionsVisible(false)} 
        song={selectedSong} 
        onAddToPlaylist={() => { setOptionsVisible(false); setPickerVisible(true); }} 
      />
      <PlaylistPickerModal 
        visible={pickerVisible} 
        onClose={() => setPickerVisible(false)} 
        song={selectedSong} 
      />
    </div>
  );
}
