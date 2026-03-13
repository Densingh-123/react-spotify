import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoAddCircle, IoHeart, IoDisc, IoPerson, IoClose } from 'react-icons/io5';
import { useLikes } from '@/hooks/useLikes';
import { usePlaylists } from '@/hooks/usePlaylists';
import { useTheme } from '@/context/ThemeContext';

const TABS = ['Playlists', 'Albums', 'Artists'] as const;
type Tab = typeof TABS[number];

const MOCK_ALBUMS = [
  { id: 'a1', name: 'Dawn FM', count: 16, color: '#1565c0', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80' },
  { id: 'a2', name: 'Midnights', count: 13, color: '#311b92', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&q=80' },
  { id: 'a3', name: 'Renaissance', count: 16, color: '#b71c1c', image: 'https://images.unsplash.com/photo-1514525253361-bee8a19740c1?w=400&q=80' },
  { id: 'a4', name: 'Utopia', count: 19, color: '#37474f', image: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=400&q=80' },
];
const MOCK_ARTISTS = [
  { id: 'r1', name: 'The Weeknd', count: 82, color: '#4a148c', image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80' },
  { id: 'r2', name: 'Taylor Swift', count: 120, color: '#880e4f', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80' },
  { id: 'r3', name: 'Drake', count: 95, color: '#1b5e20', image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=80' },
  { id: 'r4', name: 'Beyoncé', count: 78, color: '#e65100', image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&q=80' },
];

export default function LibraryPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { likedSongs } = useLikes();
  const { playlists, createPlaylist } = usePlaylists();
  const [activeTab, setActiveTab] = useState<Tab>('Playlists');
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = async () => {
    if (newName.trim()) {
      await createPlaylist(newName.trim());
      setModalVisible(false); setNewName('');
    }
  };

  let data: any[] = [];
  if (activeTab === 'Playlists') {
    data = [
      { id: 'liked', name: 'Liked Songs', count: likedSongs.length, color: '#e91e63', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80', isLiked: true },
      ...playlists.map(p => ({ id: p.id, name: p.name, count: p.songs?.length || 0, color: p.color, image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80' })),
    ];
  } else if (activeTab === 'Albums') data = MOCK_ALBUMS;
  else data = MOCK_ARTISTS;

  const handleItemPress = (item: any) => {
    if (item.isLiked) { navigate('/liked'); return; }
    navigate(`/playlist/${item.id}?name=${encodeURIComponent(item.name)}&color=${encodeURIComponent(item.color)}`);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: colors.text }}>Library</h1>
        <button className="icon-btn" onClick={() => setModalVisible(true)} style={{ color: colors.primary }}>
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
            }}>
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
                  {item.isLiked ? <IoHeart size={16} color={item.color} /> : <IoDisc size={16} color={item.color} />}
                </div>
              </div>
            </div>
          ))}
        </div>
        {data.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 60 }}>
            <div style={{ fontSize: 52, marginBottom: 12, opacity: 0.3 }}>📚</div>
            <p style={{ color: colors.textSecondary }}>No {activeTab.toLowerCase()} found</p>
          </div>
        )}
      </div>

      {/* Create Playlist Modal */}
      {modalVisible && (
        <div className="modal-backdrop center" onClick={() => setModalVisible(false)}>
          <div className="modal-center-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: colors.text }}>New Playlist</p>
              <button className="icon-btn" onClick={() => setModalVisible(false)} style={{ color: colors.textSecondary }}><IoClose size={22} /></button>
            </div>
            <input
              className="input-field"
              placeholder="Playlist name..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              style={{ color: colors.text, borderColor: colors.glassBorder, background: colors.surface, marginBottom: 20 }}
              autoFocus
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setModalVisible(false)} style={{ padding: '12px 24px', borderRadius: 12, background: 'none', border: 'none', color: colors.textSecondary, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleCreate} style={{ padding: '12px 24px', borderRadius: 12, background: colors.primary, color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
