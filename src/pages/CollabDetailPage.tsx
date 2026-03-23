import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoChevronBack, IoShareSocial, IoPlay, IoAddCircleOutline, IoMusicalNotes, IoSearch, IoAddCircle } from 'react-icons/io5';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/services/firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion, collection, query, onSnapshot, addDoc, orderBy, limit, getDocs, where, increment } from 'firebase/firestore';
import { SongItem, getRecommendedSongs, searchSongs } from '@/services/api';
import { usePlayer } from '@/context/PlayerContext';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

export default function CollabDetailPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { playTrack } = usePlayer();

  const [playlistName, setPlaylistName] = useState('');
  const [songs, setSongs] = useState<SongItem[]>([]);
  const [recommended, setRecommended] = useState<SongItem[]>([]);
  const [searchResults, setSearchResults] = useState<SongItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!id || !user) return;

    // Fetch Playlist Info & Auto-join
    const unsubInfo = onSnapshot(doc(db, 'collab_playlists', id), async (docSnap) => {
      if (!docSnap.exists()) return;
      const data = docSnap.data();
      setPlaylistName(data.name);

      // Auto-join if not a member
      if (user && data.members && !data.members.includes(user.uid)) {
        await updateDoc(doc(db, 'collab_playlists', id), {
          members: arrayUnion(user.uid)
        });
      }
    });

    // Subscribe to songs in real-time
    const q = query(collection(db, 'collab_playlists', id, 'songs'), orderBy('addedAt', 'asc'));
    const unsubSongs = onSnapshot(q, async (snap) => {
      const sList = snap.docs.map(d => d.data() as SongItem);
      setSongs(sList);
      setLoading(false);

      // Fetch personalized recommendations
      let seedSong = sList.length > 0 ? sList[sList.length - 1] : null;

      // If playlist is empty, try to seed from user's liked songs or history
      if (!seedSong && user) {
        const likedSnap = await getDocs(query(collection(db, 'users', user.uid, 'likedSongs'), limit(1)));
        if (!likedSnap.empty) {
          seedSong = likedSnap.docs[0].data() as SongItem;
        } else {
          // Try history
          const historySnap = await getDocs(query(collection(db, 'recentlyPlayed'), where('userId', '==', user.uid), limit(1)));
          if (!historySnap.empty) {
            const hData = historySnap.docs[0].data();
            seedSong = { id: hData.songId, title: hData.title, artist: hData.artist, artworkUrl: hData.artworkUrl, streamUrl: hData.streamUrl } as SongItem;
          }
        }
      }

      if (seedSong) {
        const recs = await getRecommendedSongs(seedSong);
        
        // Also fetch user's generic recent history to mix in
        const historySnap = await getDocs(query(collection(db, 'recentlyPlayed'), where('userId', '==', user.uid), limit(10)));
        const historySongs = historySnap.docs.map(d => {
           const hData = d.data();
           return { id: hData.songId, title: hData.title, artist: hData.artist, artworkUrl: hData.artworkUrl, streamUrl: hData.streamUrl } as SongItem;
        });

        // Filter out songs already in the playlist
        const existingIds = new Set(sList.map(s => s.id));
        const combined = [...recs, ...historySongs].filter(s => !existingIds.has(s.id));
        
        // Unique and slice
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
        setRecommended(unique.slice(0, 20));
      } else {
         // Fallback default
         const dummySong = { id: 'cWigVlzj', title: 'Illuminati', artist: 'Sushin Shyam', album: 'Aavesham', duration: 180, artworkUrl: '', streamUrl: 'https://jiosaavn-api-murex-two.vercel.app/api/songs/cWigVlzj' } as SongItem;
        getRecommendedSongs(dummySong).then(recs => setRecommended(recs.slice(0, 20)));
      }
    });

    return () => { unsubInfo(); unsubSongs(); };
  }, [id, user]);

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const results = await searchSongs(q);
      setSearchResults(results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const shareLink = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `Join my playlist: ${playlistName}`, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleAddSong = async (song: SongItem) => {
    if (!id) return;
    try {
      await addDoc(collection(db, 'collab_playlists', id, 'songs'), {
        ...song,
        addedBy: user?.displayName || 'Anonymous',
        addedAt: new Date()
      });
      await updateDoc(doc(db, 'collab_playlists', id), { songCount: increment(1) });
      // Optionally remove from recommendations UI instantly
      setRecommended(prev => prev.filter(s => s.id !== song.id));
    } catch (e) {
      console.error('Failed to add song', e);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: `1px solid ${colors.glassBorder}`, background: `linear-gradient(135deg, ${colors.primary}22, ${colors.surfaceHighlight})` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="icon-btn" onClick={() => navigate('/collab')} style={{ color: colors.text }}><IoChevronBack size={26} /></button>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IoMusicalNotes size={20} color="#fff" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: colors.text, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{playlistName}</h2>
        </div>
        <button onClick={shareLink} className="icon-btn" style={{ color: colors.primary }}>
          <IoShareSocial size={24} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20, paddingBottom: 100 }}>
        {loading ? (
          <SkeletonLoader height={200} style={{ borderRadius: 16 }} />
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>Playlist Tracks ({songs.length})</h3>
              {songs.length > 0 && (
                <button 
                  onClick={() => playTrack(songs[0], songs, 0)}
                  style={{ width: 40, height: 40, borderRadius: '50%', background: colors.primary, color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <IoPlay size={20} style={{ marginLeft: 3 }} />
                </button>
              )}
            </div>

            {songs.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', background: colors.surfaceHighlight, borderRadius: 16, border: `1px dashed ${colors.glassBorder}` }}>
                <p style={{ color: colors.textSecondary, marginBottom: 8 }}>This playlist is empty.</p>
                <p style={{ fontSize: 13, color: colors.textSecondary }}>Share the link or add songs from below!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {songs.map((song, i) => (
                  <div key={`${song.id}-${i}`} onClick={() => playTrack(song, songs, i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, borderRadius: 12, background: colors.surfaceHighlight, cursor: 'pointer' }}>
                    <img src={song.artworkUrl} style={{ width: 48, height: 48, borderRadius: 8 }} alt={song.title} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
                      <div style={{ fontSize: 12, color: colors.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.artist} • Added by {(song as any).addedBy}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: 40, marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>Find & Add Songs</h3>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 16,
                background: colors.surfaceHighlight, border: `1px solid ${colors.glassBorder}`
              }}>
                <IoSearch size={20} color={colors.textSecondary} />
                <input 
                  placeholder="Search and add to playlist..." 
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{ 
                    flex: 1, background: 'none', border: 'none', outline: 'none', 
                    color: colors.text, fontSize: 16
                  }}
                />
                {searching && <div className="spinner" style={{ width: 16, height: 16 }} />}
              </div>
            </div>

            {searchResults.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: colors.primary, textTransform: 'uppercase' }}>Search Results</h4>
                {searchResults.map(song => (
                  <div key={song.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={song.artworkUrl} style={{ width: 48, height: 48, borderRadius: 8 }} alt={song.title} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
                      <div style={{ fontSize: 13, color: colors.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.artist}</div>
                    </div>
                    <button onClick={() => { handleAddSong(song); setSearchQuery(''); setSearchResults([]); }} className="icon-btn" style={{ color: colors.primary, padding: 8 }}>
                      <IoAddCircle size={28} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <h3 style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginTop: 16, marginBottom: 16 }}>Recommended to Add</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recommended.map(song => (
                <div key={song.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={song.artworkUrl} style={{ width: 48, height: 48, borderRadius: 8 }} alt={song.title} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
                    <div style={{ fontSize: 13, color: colors.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.artist}</div>
                  </div>
                  <button onClick={() => handleAddSong(song)} className="icon-btn" style={{ color: colors.primary, padding: 8 }}>
                    <IoAddCircleOutline size={28} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
