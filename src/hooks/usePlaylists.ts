import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '@/services/firebaseConfig';

export interface Playlist {
  id: string; name: string; userId: string; createdAt: any;
  songs: any[]; color: string; icon: string;
  type?: 'playlist' | 'smart_album' | 'artist_collection';
  image?: string;
}

export const usePlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) { setPlaylists([]); setLoading(false); return; }
    const q = query(collection(db, 'playlists'), where('userId', '==', auth.currentUser!.uid));
    return onSnapshot(q, (snap) => {
      setPlaylists(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Playlist[]);
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  const createPlaylist = async (name: string) => {
    if (!auth.currentUser) return;
    const colors = ['#e91e63', '#673ab7', '#ff5722', '#009688', '#f57f17', '#6200ea', '#2196f3'];
    const icons = ['musical-notes', 'heart', 'headset', 'disc', 'radio', 'star', 'planet'];
    await addDoc(collection(db, 'playlists'), {
      name, userId: auth.currentUser.uid, createdAt: serverTimestamp(), songs: [],
      color: colors[Math.floor(Math.random() * colors.length)],
      icon: icons[Math.floor(Math.random() * icons.length)],
    });
  };

  const addSongToPlaylist = async (playlistId: string, song: any) => {
    await updateDoc(doc(db, 'playlists', playlistId), { songs: arrayUnion(song) });
  };

  const createSmartCollection = async (keyword: string, type: 'smart_album' | 'artist_collection', languages: string[] = ['Tamil']) => {
    if (!auth.currentUser) return;
    const { searchMusicDeep } = await import('@/services/api');
    
    // Construct search query: "keyword languages songs"
    const langSuffix = languages.length > 0 ? ` ${languages[0]}` : '';
    const query = `${keyword}${langSuffix} ${type === 'smart_album' ? 'songs' : 'movie songs'}`;
    
    try {
      const results = await searchMusicDeep(query, 100);
      const songsToStore = results;
      
      const colors = ['#e91e63', '#673ab7', '#ff5722', '#009688', '#f57f17', '#6200ea', '#2196f3'];
      const icons = type === 'smart_album' ? ['disc', 'musical-notes'] : ['person', 'headset'];
      
      // Try to use the first song's artwork as the collection image
      const artworkUrl = songsToStore[0]?.artworkUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80';

      await addDoc(collection(db, 'playlists'), {
        name: keyword,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        songs: songsToStore,
        color: colors[Math.floor(Math.random() * colors.length)],
        icon: icons[Math.floor(Math.random() * icons.length)],
        type: type,
        image: artworkUrl // Add image for these collections
      });
    } catch (e) {
      console.error('Failed to create smart collection:', e);
    }
  };

  const deletePlaylist = async (playlistId: string) => {
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'playlists', playlistId));
  };

  const setPlaylistSongs = async (playlistId: string, songs: any[]) => {
    await updateDoc(doc(db, 'playlists', playlistId), { songs });
  };

  return { playlists, loading, createPlaylist, addSongToPlaylist, setPlaylistSongs, deletePlaylist, createSmartCollection };
};
