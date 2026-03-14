import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack, IoAddCircle, IoPeople } from 'react-icons/io5';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/services/firebaseConfig';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

interface CollabPlaylist {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  createdAt: any;
}

export default function CollaborationHubPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [playlists, setPlaylists] = useState<CollabPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchPlaylists = async () => {
      try {
        // Query for playlists where user is either the owner OR a member
        // For simplicity with Firestore indexing, we'll use a single query on 'members' 
        // and ensure the owner is always in the members array.
        const q = query(collection(db, 'collab_playlists'), where('members', 'array-contains', user.uid));
        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as CollabPlaylist));
        setPlaylists(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, [user]);

  const handleCreate = async () => {
    if (!user || !newName.trim()) return;
    try {
      const docRef = await addDoc(collection(db, 'collab_playlists'), {
        name: newName.trim(),
        ownerId: user.uid,
        ownerName: user.displayName || 'Anonymous',
        members: [user.uid], // Owner is the first member
        createdAt: serverTimestamp()
      });
      setShowModal(false);
      setNewName('');
      navigate(`/collab/${docRef.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: `1px solid ${colors.glassBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="icon-btn" onClick={() => navigate(-1)} style={{ color: colors.text }}><IoChevronBack size={26} /></button>
          <IoPeople size={24} color={colors.primary} />
          <h2 style={{ fontSize: 22, fontWeight: 900, color: colors.text }}>Collab Playlists</h2>
        </div>
        <button onClick={() => setShowModal(true)} style={{ background: 'none', border: 'none', color: colors.primary, cursor: 'pointer' }}>
          <IoAddCircle size={32} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SkeletonLoader height={80} style={{ borderRadius: 16 }} />
            <SkeletonLoader height={80} style={{ borderRadius: 16 }} />
          </div>
        ) : playlists.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <IoPeople size={64} color={`${colors.primary}44`} />
            <p style={{ color: colors.textSecondary, fontSize: 16 }}>No collab playlists yet</p>
            <button 
              onClick={() => setShowModal(true)}
              style={{ padding: '12px 24px', background: colors.primary, color: '#fff', borderRadius: 24, border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Start a Collaboration
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {playlists.map(p => (
              <div 
                key={p.id}
                onClick={() => navigate(`/collab/${p.id}`)}
                style={{
                  background: `linear-gradient(135deg, ${colors.surfaceHighlight}, ${colors.surface})`,
                  padding: 20, borderRadius: 16, border: `1px solid ${colors.glassBorder}`,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}
              >
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>{p.name}</h3>
                  <p style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>Created by {p.ownerName}</p>
                </div>
                <IoChevronBack size={20} color={colors.textSecondary} style={{ transform: 'rotate(180deg)' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)} style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: 400, padding: 24, position: 'relative', bottom: 'auto', borderRadius: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>Name Your Playlist</h3>
            <input 
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. Roadtrip Vibes"
              style={{
                width: '100%', padding: 16, borderRadius: 12, border: `1px solid ${colors.glassBorder}`,
                background: colors.surfaceHighlight, color: colors.text, fontSize: 16, outline: 'none',
                marginBottom: 24
              }}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={() => setShowModal(false)}
                style={{ flex: 1, padding: 14, background: 'transparent', color: colors.text, border: `1px solid ${colors.glassBorder}`, borderRadius: 12, fontWeight: 'bold', cursor: 'pointer' }}
              >Cancel</button>
              <button 
                onClick={handleCreate}
                disabled={!newName.trim()}
                style={{ flex: 1, padding: 14, background: colors.primary, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 'bold', cursor: 'pointer', opacity: newName.trim() ? 1 : 0.5 }}
              >Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
