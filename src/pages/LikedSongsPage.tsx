import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack, IoEllipsisVertical, IoHeart } from 'react-icons/io5';
import { useLikes } from '@/hooks/useLikes';
import { usePlayer } from '@/context/PlayerContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { SongItem } from '@/services/api';
import SongOptionsMenu from '@/components/SongOptionsMenu';
import PlaylistPickerModal from '@/components/PlaylistPickerModal';

export default function LikedSongsPage() {
  const { colors } = useTheme();
  const nav = useNavigate();
  const { user } = useAuth();
  const { likedSongs } = useLikes();
  const { playTrack } = usePlayer();
  const [selectedSong, setSelectedSong] = useState<SongItem | null>(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  const handlePlay = async (item: SongItem) => {
    if (!user) { nav('/login'); return; }
    const idx = likedSongs.findIndex(s => s.id === item.id);
    await playTrack(item, likedSongs, Math.max(0, idx));
    nav('/player');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', background: `linear-gradient(160deg, #e91e6333, transparent)`, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
        <button className="icon-btn" onClick={() => nav(-1)} style={{ color: colors.text }}><IoChevronBack size={26} /></button>
        <IoHeart size={28} color="#e91e63" />
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: colors.text }}>Liked Songs</h2>
          <p style={{ fontSize: 13, color: colors.textSecondary }}>{likedSongs.length} songs</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {likedSongs.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <div style={{ fontSize: 56 }}>💔</div>
            <p style={{ color: colors.textSecondary, marginTop: 16 }}>No liked songs yet. Tap ♥ on any song!</p>
          </div>
        ) : likedSongs.map((item, idx) => (
          <div key={`${item.id}-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 12px', borderRadius: 14, cursor: 'pointer', marginBottom: 4 }}
            onClick={() => handlePlay(item)}
            onMouseEnter={e => (e.currentTarget.style.background = colors.surfaceHighlight)}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
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
        ))}
      </div>

      <SongOptionsMenu visible={optionsVisible} onClose={() => setOptionsVisible(false)} song={selectedSong} onAddToPlaylist={() => { setOptionsVisible(false); setPickerVisible(true); }} />
      <PlaylistPickerModal visible={pickerVisible} onClose={() => setPickerVisible(false)} song={selectedSong} />
    </div>
  );
}
