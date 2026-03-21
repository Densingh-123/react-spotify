import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoAddCircle, IoHeart, IoDisc, IoPerson, IoClose, IoAlbums, IoPeople, IoList } from 'react-icons/io5';
import { useLikes } from '@/hooks/useLikes';
import { useRingtones } from '@/hooks/useRingtones';
import { usePlaylists, Playlist } from '@/hooks/usePlaylists';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { db } from '@/services/firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const TABS = ['Playlists', 'Albums', 'Artists'] as const;
type Tab = typeof TABS[number];

export default function LibraryPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { likedSongs } = useLikes();
  const { likedRingtones } = useRingtones();
  const { playlists, createPlaylist, createSmartCollection } = usePlaylists();
  const { preferences, user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('Playlists');
  const [collabPlaylists, setCollabPlaylists] = useState<any[]>([]);
  const [blends, setBlends] = useState<any[]>([]);
  const [loadingSocial, setLoadingSocial] = useState(true);

  // Fetch social items
  useEffect(() => {
    if (!user) return;
    const qCollab = query(collection(db, 'collab_playlists'), where('members', 'array-contains', user.uid));
    const unsubCollab = onSnapshot(qCollab, (snap) => {
      setCollabPlaylists(snap.docs.map(d => ({ id: d.id, ...d.data(), isCollab: true })));
    });

    const qBlend = query(collection(db, 'blends'), where('participants', 'array-contains', user.uid));
    const unsubBlend = onSnapshot(qBlend, (snap) => {
      setBlends(snap.docs.map(d => ({ id: d.id, ...d.data(), isBlend: true })));
    });

    return () => { unsubCollab(); unsubBlend(); };
  }, [user]);
  const [modalType, setModalType] = useState<Tab | null>(null);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const [contextMenu, setContextMenu] = useState<{ id: string, name: string, type: string, x: number, y: number } | null>(null);

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
  const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80';

  if (activeTab === 'Playlists') {
    data = [
      { id: 'liked', name: 'Liked Songs', count: likedSongs.length, color: '#e91e63', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80', isLiked: true },
      { id: 'ringtones', name: 'Liked Ringtones', count: likedRingtones.length, color: colors.primary, image: 'https://images.unsplash.com/photo-1459749411177-04218006733b?w=400&q=80', isRingtone: true },
      ...playlistsByType('playlist').map(p => ({
        id: p.id, name: p.name, count: p.songs?.length || 0, color: p.color,
        image: p.image || DEFAULT_IMAGE, isManageable: true
      })),
      ...collabPlaylists.map(p => ({
        id: p.id, name: p.name, count: p.songs?.length || 0, color: colors.primary,
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80', isCollab: true
      })),
      ...blends.map(b => ({
        id: b.id, name: `Vibe with ${b.partnerName}`, count: b.songs?.length || 0, color: '#9c27b0',
        image: 'https://images.unsplash.com/photo-1514525253344-f81f3f77ed96?w=400&q=80', isBlend: true, partnerId: b.participants.find((p:any) => p !== user?.uid)
      }))
    ];
  } else if (activeTab === 'Albums') {
    data = [
      ...playlistsByType('smart_album').map(p => ({
        id: p.id, name: p.name, count: p.songs?.length || 0, color: p.color,
        image: p.image || DEFAULT_IMAGE, isManageable: true
      })),
      ...collabPlaylists.map(p => ({
        id: p.id, name: p.name, count: p.songs?.length || 0, color: colors.primary,
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80', isCollab: true
      })),
      ...blends.map(b => ({
        id: b.id, name: `Vibe with ${b.partnerName}`, count: b.songs?.length || 0, color: '#9c27b0',
        image: 'https://images.unsplash.com/photo-1514525253344-f81f3f77ed96?w=400&q=80', isBlend: true, partnerId: b.participants.find((p:any) => p !== user?.uid)
      }))
    ];
  } else {
    data = playlistsByType('artist_collection').map(p => ({
      id: p.id, name: p.name, count: p.songs?.length || 0, color: p.color,
      image: p.image || DEFAULT_IMAGE, isManageable: true
    }));
  }

  const handleItemPress = (item: any) => {
    if (contextMenu) { setContextMenu(null); return; }
    if (item.isLiked) { navigate('/liked'); return; }
    if (item.isRingtone) { navigate('/ringtones'); return; }
    if (item.isCollab) { navigate(`/collab/${item.id}`); return; }
    if (item.isBlend) { navigate(`/blend/${item.partnerId}`); return; }
    navigate(`/playlist/${item.id}?name=${encodeURIComponent(item.name)}&color=${encodeURIComponent(item.color)}`);
  };

  const onRightClick = (e: React.MouseEvent, item: any) => {
    if (item.isLiked || item.isRingtone || item.isBlend) return;
    e.preventDefault();
    setContextMenu({ id: item.id, name: item.name, type: activeTab, x: e.clientX, y: e.clientY });
  };

  const { deletePlaylist: delPlaylist } = usePlaylists();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }} onClick={() => setContextMenu(null)}>
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
            <div 
              key={item.id} 
              style={{ borderRadius: 20, overflow: 'hidden', height: 220, position: 'relative', cursor: 'pointer' }} 
              onClick={() => handleItemPress(item)}
              onContextMenu={(e) => onRightClick(e, item)}
            >
              <img 
                src={item.image} 
                alt={item.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} 
                loading="lazy"
                onError={(e) => { (e.target as any).src = DEFAULT_IMAGE; }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 14,
              }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{item.count} tracks</div>
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  width: 32, height: 32, borderRadius: 10, background: item.color + '55',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {item.isLiked ? <IoHeart size={16} color={item.color} /> : 
                   item.isCollab ? <IoPeople size={16} color="#fff" /> :
                   item.isBlend ? <IoDisc size={16} color="#fff" /> :
                   activeTab === 'Artists' ? <IoPerson size={16} color={item.color} /> : 
                   <IoDisc size={16} color={item.color} />}
                </div>
                {(item.isCollab || item.isBlend) && (
                  <div style={{
                    position: 'absolute', top: 10, left: 10,
                    padding: '4px 8px', borderRadius: 8, background: item.isCollab ? colors.primary : '#9c27b0',
                    fontSize: 10, fontWeight: 900, color: '#fff', textTransform: 'uppercase'
                  }}>
                    {item.isCollab ? 'Collab' : 'Blend'}
                  </div>
                )}
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

      {/* Context Menu Modal */}
      {contextMenu && (
        <div style={{
          position: 'fixed', top: contextMenu.y, left: contextMenu.x,
          background: colors.surfaceHighlight, borderRadius: 16, border: `1px solid ${colors.glassBorder}`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 1000, overflow: 'hidden', minWidth: 160
        }}>
          <button 
            style={{ width: '100%', textAlign: 'left', padding: '12px 16px', border: 'none', background: 'none', color: colors.text, fontWeight: 600, cursor: 'pointer', borderBottom: `1px solid ${colors.glassBorder}` }}
            onClick={() => { navigate(`/manage/${contextMenu.id}`); setContextMenu(null); }}
          >
            Manage Songs
          </button>
          <button 
            style={{ width: '100%', textAlign: 'left', padding: '12px 16px', border: 'none', background: 'none', color: '#ff4444', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => { delPlaylist(contextMenu.id); setContextMenu(null); }}
          >
            Delete {activeTab.slice(0, -1)}
          </button>
        </div>
      )}

      {/* Create Modal */}
      {modalType && (
        <div className="modal-backdrop center" onClick={() => setModalType(null)}>
          <div className="modal-center-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: colors.text }}>
                New {modalType === 'Playlists' ? 'Playlist' : modalType === 'Albums' ? 'Smart Album' : 'Artist Collection'}
              </p>
              <button className="icon-btn" onClick={() => setModalType(null)} style={{ color: colors.textSecondary }}>
                <IoClose size={22} />
              </button>
            </div>
            <p style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 16 }}>
              {modalType === 'Playlists' ? 'Give your playlist a name.' : `Type a name (e.g. "Love", "Vijay") and we'll find 100 tracks in your preferred languages.`}
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
                {creating && <div className="spinner" style={{ width: 16, height: 16 }} />}
                {modalType === 'Playlists' ? 'Create' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
