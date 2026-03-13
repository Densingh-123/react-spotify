import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/services/firebaseConfig';
import { SongItem } from '@/services/api';

export const useRecentlyPlayed = (limitCount = 10) => {
  const [recentlyPlayed, setRecentlyPlayed] = useState<SongItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubSnap: (() => void) | null = null;
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (unsubSnap) { unsubSnap(); unsubSnap = null; }
      if (!user) { setRecentlyPlayed([]); setLoading(false); return; }
      const q = query(collection(db, 'recentlyPlayed'), where('userId', '==', user.uid), orderBy('playedAt', 'desc'), limit(limitCount));
      unsubSnap = onSnapshot(q, (snap) => {
        setRecentlyPlayed(snap.docs.map(d => {
          const data = d.data();
          return { id: data.songId, title: data.title, artist: data.artist, artworkUrl: data.artworkUrl, streamUrl: data.streamUrl } as SongItem;
        }));
        setLoading(false);
      }, () => setLoading(false));
    });
    return () => { unsubAuth(); if (unsubSnap) unsubSnap(); };
  }, [limitCount]);

  return { recentlyPlayed, loading };
};
