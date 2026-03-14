import React from 'react';
import { SongItem } from '@/services/api';
import { IoHeart, IoDownload, IoList, IoShareSocial, IoMusicalNotes, IoAddCircle, IoClose } from 'react-icons/io5';
import { useLikes } from '@/hooks/useLikes';
import { useDownloads } from '@/hooks/useDownloads';

interface Props {
  visible: boolean;
  onClose: () => void;
  song: SongItem | null;
  onAddToPlaylist?: () => void;
}

export default function SongOptionsMenu({ visible, onClose, song, onAddToPlaylist }: Props) {
  const { toggleLike, isLiked } = useLikes();
  const { downloadSong, isDownloaded } = useDownloads();
  if (!visible || !song) return null;

  const liked = isLiked(song.id);

  const options = [
    { icon: <IoHeart size={22} color={liked ? '#e91e63' : 'var(--color-primary)'} />, label: liked ? 'Unlike Song' : 'Like Song', action: () => { toggleLike(song); onClose(); } },
    { icon: <IoAddCircle size={22} color="var(--color-primary)" />, label: 'Add to Playlist', action: () => { if (onAddToPlaylist) onAddToPlaylist(); else onClose(); } },
    { icon: <IoDownload size={22} color={isDownloaded(song.id) ? '#4caf50' : 'var(--color-primary)'} />, label: isDownloaded(song.id) ? 'Downloaded' : 'Download Song', action: () => { downloadSong(song); onClose(); } },
    { icon: <IoShareSocial size={22} color="var(--color-primary)" />, label: 'Share Song', action: () => { navigator.share?.({ title: song.title, text: `${song.title} by ${song.artist}` }); onClose(); } },
    { icon: <IoList size={22} color="var(--color-primary)" />, label: 'View Queue', action: onClose },
    { icon: <IoMusicalNotes size={22} color="var(--color-primary)" />, label: 'Go to Artist', action: onClose },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ padding: '0 20px 8px' }}>
          <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-text)' }}>{song.title}</p>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>{song.artist}</p>
        </div>
        {options.map(opt => (
          <button
            key={opt.label}
            onClick={opt.action}
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '14px 20px', width: '100%',
              color: 'var(--color-text)', fontSize: 15, fontWeight: 500,
              background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-highlight)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
