import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '@/services/firebaseConfig';

export interface Playlist {
  id: string; name: string; userId: string; createdAt: any;
  songs: any[]; color: string; icon: string;
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

  return { playlists, loading, createPlaylist, addSongToPlaylist };
};
