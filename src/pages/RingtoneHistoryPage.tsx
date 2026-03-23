import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack, IoMusicalNotes, IoTrashOutline } from 'react-icons/io5';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseConfig';
import { useRecentlyPlayed } from '@/hooks/useRecentlyPlayed';
import { usePlayer } from '@/context/PlayerContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { SongItem } from '@/services/api';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

export default function RingtoneHistoryPage() {
  const { colors } = useTheme();
  const nav = useNavigate();
  const { user } = useAuth();
  const { ringtoneHistory, loading } = useRecentlyPlayed(50);
  const { playTrack } = usePlayer();

  const handlePlay = async (item: SongItem) => {
    if (!user) { nav('/login'); return; }
    const idx = ringtoneHistory.findIndex(s => s.id === item.id);
    await playTrack(item, ringtoneHistory, Math.max(0, idx));
    nav('/player');
  };

  const handleRemove = async (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    if (!user) return;
    try {
      const docId = `${user.uid}_${songId}`;
      await deleteDoc(doc(db, 'recentlyPlayed', docId));
    } catch (err) {
      console.error('Failed to remove from history:', err);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: `1px solid ${colors.glassBorder}` }}>
        <button className="icon-btn" onClick={() => nav(-1)} style={{ color: colors.text }}><IoChevronBack size={26} /></button>
        <IoMusicalNotes size={24} color={colors.primary} />
        <h2 style={{ fontSize: 22, fontWeight: 900, color: colors.text }}>Ringtones History</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>
        {loading ? Array(8).fill(0).map((_, i) => <SkeletonLoader key={i} height={72} style={{ marginBottom: 10, borderRadius: 14 }} />) :
          ringtoneHistory.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <div style={{ fontSize: 56 }}>⏳</div>
              <p style={{ color: colors.textSecondary, marginTop: 16 }}>No history yet. Start listening!</p>
            </div>
          ) : ringtoneHistory.map((item, idx) => (
            <div key={`${item.id}-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 12px', borderRadius: 14, cursor: 'pointer', marginBottom: 4 }}
              onClick={() => handlePlay(item)}
              onMouseEnter={e => (e.currentTarget.style.background = colors.surfaceHighlight)}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
              <img src={item.artworkUrl} alt={item.title} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} loading="lazy" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                <div style={{ fontSize: 12, color: colors.textSecondary }}>{item.artist}</div>
              </div>
              <button
                className="icon-btn-small"
                onClick={(e) => handleRemove(e, item.id)}
                style={{ color: colors.textSecondary, opacity: 0.6 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ff4d4d', e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.color = colors.textSecondary, e.currentTarget.style.opacity = '0.6')}
              >
                <IoTrashOutline size={18} />
              </button>
            </div>
          ))
        }
      </div>
    </div>
  );
}
