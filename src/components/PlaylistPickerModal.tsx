import React from 'react';
import { SongItem } from '@/services/api';
import { usePlaylists } from '@/hooks/usePlaylists';
import { IoClose, IoMusicalNote } from 'react-icons/io5';

interface Props {
  visible: boolean;
  onClose: () => void;
  song: SongItem | null;
}

export default function PlaylistPickerModal({ visible, onClose, song }: Props) {
  const { playlists, addSongToPlaylist } = usePlaylists();

  if (!visible) return null;

  const handleAdd = async (playlistId: string) => {
    if (song) await addSongToPlaylist(playlistId, song);
    onClose();
  };

  return (
    <div className="modal-backdrop center" onClick={onClose}>
      <div className="modal-center-card" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <p style={{ fontWeight: 800, fontSize: 20, color: 'var(--color-text)' }}>Add to Playlist</p>
          <button className="icon-btn" onClick={onClose} style={{ color: 'var(--color-text-secondary)' }}>
            <IoClose size={22} />
          </button>
        </div>
        {playlists.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '20px 0' }}>
            No playlists yet. Create one in the Library tab.
          </p>
        ) : (
          playlists.map(p => (
            <button
              key={p.id}
              onClick={() => handleAdd(p.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 0', width: '100%', background: 'none',
                border: 'none', borderBottom: '1px solid var(--color-glass-border)',
                cursor: 'pointer', color: 'var(--color-text)',
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: p.color + '33',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: p.color,
              }}>
                <IoMusicalNote size={22} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{p.songs?.length || 0} songs</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
