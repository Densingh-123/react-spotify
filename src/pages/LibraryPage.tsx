import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoAddCircle, IoHeart, IoDisc, IoPerson, IoClose, IoAlbums, IoPeople, IoList } from 'react-icons/io5';
import { useLikes } from '@/hooks/useLikes';
import { usePlaylists, Playlist } from '@/hooks/usePlaylists';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const TABS = ['Playlists', 'Albums', 'Artists'] as const;
type Tab = typeof TABS[number];

export default function LibraryPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { likedSongs } = useLikes();
  const { playlists, createPlaylist, createSmartCollection } = usePlaylists();
  const { preferences } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('Playlists');
  const [modalType, setModalType] = useState<Tab | null>(null);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      if (modalType === 'Playlists') {
        await createPlaylist(newName.trim());
      } else if (modalType === 'Albums') {
        await createSmartCollection(newName.trim(), 'smart_album', preferences?.languages);
      } else if (modalType === 'Artists') {
        await createSmartCollection(newName.trim(), 'artist_collection', preferences?.languages);
      }
      setModalType(null);
      setNewName('');
    } finally {
      setCreating(false);
    }
  };

  const playlistsByType = (type: Playlist['type']) => 
    playlists.filter(p => p.type === type || (!p.type && type === 'playlist'));

  let data: any[] = [];
  if (activeTab === 'Playlists') {
    data = [
      { id: 'liked', name: 'Liked Songs', count: likedSongs.length, color: '#e91e63', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80', isLiked: true },
      ...playlistsByType('playlist').map(p => ({
        id: p.id, name: p.name, count: p.songs?.length || 0, color: p.color,
        image: p.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80'
      })),
    ];
  } else if (activeTab === 'Albums') {
    data = playlistsByType('smart_album').map(p => ({
      id: p.id, name: p.name, count: p.songs?.length || 0, color: p.color,
      image: p.image || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80'
    }));
  } else {
    data = playlistsByType('artist_collection').map(p => ({
      id: p.id, name: p.name, count: p.songs?.length || 0, color: p.color,
      image: p.image || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80'
    }));
  }

  const handleItemPress = (item: any) => {
    if (item.isLiked) { navigate('/liked'); return; }
    navigate(`/playlist/${item.id}?name=${encodeURIComponent(item.name)}&color=${encodeURIComponent(item.color)}`);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: colors.text }}>Library</h1>
        <button className="icon-btn" onClick={() => setModalType(activeTab)} style={{ color: colors.primary }}>
          <IoAddCircle size={32} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '12px 20px', gap: 10 }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px', borderRadius: 25, fontWeight: 700, fontSize: 14,
              background: activeTab === tab ? colors.primary : colors.surface,
              color: activeTab === tab ? '#fff' : colors.textSecondary,
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
            {tab === 'Playlists' && <IoList size={14} />}
            {tab === 'Albums' && <IoAlbums size={14} />}
            {tab === 'Artists' && <IoPeople size={14} />}
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 10px 120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {data.map(item => (
            <div key={item.id} style={{ borderRadius: 20, overflow: 'hidden', height: 220, position: 'relative', cursor: 'pointer' }} onClick={() => handleItemPress(item)}>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} loading="lazy" />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 14,
              }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{item.count} tracks</div>
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  width: 32, height: 32, borderRadius: 10, background: item.color + '55',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {item.isLiked ? <IoHeart size={16} color={item.color} /> : activeTab === 'Artists' ? <IoPerson size={16} color={item.color} /> : <IoDisc size={16} color={item.color} />}
                </div>
              </div>
            </div>
          ))}
        </div>
        {data.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 60 }}>
            <div style={{ fontSize: 52, marginBottom: 12, opacity: 0.3 }}>
              {activeTab === 'Playlists' ? '🎵' : activeTab === 'Albums' ? '📀' : '👥'}
            </div>
            <p style={{ color: colors.textSecondary }}>No {activeTab.toLowerCase()} found</p>
            <button 
              className="btn-ghost" 
              onClick={() => setModalType(activeTab)}
              style={{ marginTop: 16, color: colors.primary }}
            >
              Add your first {activeTab.slice(0, -1).toLowerCase()}
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {modalType && (
        <div className="modal-backdrop center" onClick={() => setModalType(null)}>
          <div className="modal-center-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: colors.text }}>
                {modalType === 'Playlists' ? 'New Playlist' : modalType === 'Albums' ? 'Smart Album' : 'Artist Collection'}
              </p>
              <button className="icon-btn" onClick={() => setModalType(null)} style={{ color: colors.textSecondary }}><IoClose size={22} /></button>
            </div>
            <p style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 16 }}>
              {modalType === 'Playlists' ? 'Give your playlist a name.' : `Type a name (e.g. "Love", "Vijay") and we'll find 25 tracks in your preferred languages.`}
            </p>
            <input
              className="input-field"
              placeholder={modalType === 'Playlists' ? "Playlist name..." : "Keyword (e.g. Love, Hip Hop, Artist Name)"}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !creating && handleCreate()}
              style={{ color: colors.text, borderColor: colors.glassBorder, background: colors.surface, marginBottom: 20 }}
              autoFocus
              disabled={creating}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setModalType(null)} style={{ padding: '12px 24px', borderRadius: 12, background: 'none', border: 'none', color: colors.textSecondary, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button 
                onClick={handleCreate} 
                disabled={creating || !newName.trim()}
                style={{ 
                  padding: '12px 24px', borderRadius: 12, background: colors.primary, color: '#fff', 
                  border: 'none', fontWeight: 700, cursor: 'pointer', opacity: creating ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', gap: 8
                }}
              >
                {creating ? <div className="spinner" style={{ width: 16, height: 16 }} /> : null}
                {modalType === 'Playlists' ? 'Create' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
