import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { IoChevronBack, IoPlay, IoEllipsisVertical } from 'react-icons/io5';
import { useSearchMusic } from '@/hooks/useMusicData';
import { usePlaylists } from '@/hooks/usePlaylists';
import { usePlayer } from '@/context/PlayerContext';
import { useTheme } from '@/context/ThemeContext';
import { SongItem } from '@/services/api';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import SongOptionsMenu from '@/components/SongOptionsMenu';
import PlaylistPickerModal from '@/components/PlaylistPickerModal';
import { useAuth } from '@/context/AuthContext';

export default function PlaylistDetailPage() {
  const { colors } = useTheme();
  const nav = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { playTrack } = usePlayer();
  const { playlists } = usePlaylists();

  const playlistName = searchParams.get('name') || 'Playlist';
  const playlistQuery = searchParams.get('query') || playlistName;
  const playlistColor = searchParams.get('color') || 'var(--color-primary)';

  // If it's a real Firestore playlist, get songs from it
  const firestorePlaylist = playlists.find(p => p.id === id);
  const { data, isLoading } = useSearchMusic(firestorePlaylist ? '' : playlistQuery);

  const songs: SongItem[] = firestorePlaylist?.songs?.length
    ? firestorePlaylist.songs
    : data?.pages.flatMap(p => p) || [];

  const [selectedSong, setSelectedSong] = useState<SongItem | null>(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  const handlePlay = async (item: SongItem) => {
    if (!user) { nav('/login'); return; }
    const idx = songs.findIndex(s => s.id === item.id);
    await playTrack(item, songs, Math.max(0, idx));
    nav('/player');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(160deg, ${playlistColor}55, transparent)`, padding: '16px 16px 20px' }}>
        <button className="icon-btn" onClick={() => nav(-1)} style={{ color: colors.text, marginBottom: 12 }}><IoChevronBack size={26} /></button>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
          <div style={{ width: 100, height: 100, borderRadius: 20, overflow: 'hidden', flexShrink: 0, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
            {songs[0] ? (
              <img src={songs[0].artworkUrl} alt={playlistName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ background: playlistColor, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>🎵</div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{playlistName}</div>
            <div style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>{songs.length} songs</div>
            <button onClick={() => songs.length > 0 && handlePlay(songs[0])} style={{
              marginTop: 14, padding: '10px 28px', border: 'none', borderRadius: 25,
              background: colors.primary, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <IoPlay size={16} /> Play All
            </button>
          </div>
        </div>
      </div>

      {/* Song list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>
        {isLoading && !firestorePlaylist ? Array(8).fill(0).map((_, i) => <SkeletonLoader key={i} height={72} style={{ marginBottom: 10, borderRadius: 14 }} />) :
          songs.map((item, idx) => (
            <div key={`${item.id}-${idx}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '10px 12px', borderRadius: 14, cursor: 'pointer', marginBottom: 4,
              }}
              onClick={() => handlePlay(item)}
              onMouseEnter={e => (e.currentTarget.style.background = colors.surfaceHighlight)}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
              <div style={{ fontSize: 15, fontWeight: 700, width: 24, textAlign: 'center', color: colors.textSecondary, flexShrink: 0 }}>{idx + 1}</div>
              <img src={item.artworkUrl} alt={item.title} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} loading="lazy" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                <div style={{ fontSize: 12, color: colors.textSecondary }}>{item.artist}</div>
              </div>
              <button style={{ background: 'none', border: 'none', color: colors.textSecondary, cursor: 'pointer', padding: 8 }}
                onClick={e => { e.stopPropagation(); setSelectedSong(item); setOptionsVisible(true); }}>
                <IoEllipsisVertical size={20} />
              </button>
            </div>
          ))
        }
        {!isLoading && songs.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{ fontSize: 48, opacity: 0.4 }}>🎵</div>
            <p style={{ color: colors.textSecondary, marginTop: 12 }}>No songs here yet</p>
          </div>
        )}
      </div>

      <SongOptionsMenu visible={optionsVisible} onClose={() => setOptionsVisible(false)} song={selectedSong} onAddToPlaylist={() => { setOptionsVisible(false); setPickerVisible(true); }} />
      <PlaylistPickerModal visible={pickerVisible} onClose={() => setPickerVisible(false)} song={selectedSong} />
    </div>
  );
}
