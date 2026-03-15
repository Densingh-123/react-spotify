import { useState, useEffect } from 'react';
import { db, auth } from '@/services/firebaseConfig';
import { doc, setDoc, deleteDoc, collection, onSnapshot, query, serverTimestamp } from 'firebase/firestore';
import { SongItem, getPlayableAudioUrl } from '@/services/api';

export function useDownloads() {
  const [downloadedSongs, setDownloadedSongs] = useState<SongItem[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) { setDownloadedSongs([]); setLoading(false); return; }
    const q = query(collection(db, 'users', user.uid, 'downloads'));
    return onSnapshot(q, (snap) => {
      setDownloadedSongs(snap.docs.map(d => d.data() as SongItem));
      setLoading(false);
    });
  }, [user?.uid]);

  const downloadSong = async (song: SongItem) => {
    if (!user) {
      alert('Please login to track your downloads.');
      return;
    }
    
    // Check if already downloading (prevent duplicates)
    if (downloadedSongs.some(s => s.id === song.id)) {
      alert('Song already downloaded.');
      return;
    }

    try {
      // 1. Resolve actual URL
      const streamUrl = await getPlayableAudioUrl(song);
      if (!streamUrl) throw new Error('Could not resolve stream URL');

      // 2. Fetch Audio Blob (must pass CORS)
      // We check if it's already proxied to avoid double-proxying
      const finalUrl = (streamUrl.startsWith('http') && !streamUrl.includes('proxy')) 
        ? (import.meta.env.VITE_CORS_PROXY || 'https://api.codetabs.com/v1/proxy/?quest=') + encodeURIComponent(streamUrl)
        : streamUrl;
      
      console.log('Downloading from:', finalUrl);
      const response = await fetch(finalUrl);
      if (!response.ok) throw new Error(`Failed to fetch audio stream: ${response.statusText}`);
      const blob = await response.blob();

      // 3. Save to Browser Cache API (for offline play within the web app)
      const cache = await caches.open('melodify-downloads');
      const cacheKey = new URL(`/local-audio/${song.id}`, window.location.origin).href;
      await cache.put(cacheKey, new Response(blob, { headers: { 'Content-Type': 'audio/mpeg' } }));

      // 4. Physical File Save (File System Access API)
      const filename = `${song.title.replace(/[\\/:*?"<>|]/g, '')} - ${song.artist.replace(/[\\/:*?"<>|]/g, '')}.mp3`;
      try {
        if ('showSaveFilePicker' in window) {
          const handle = await (window as any).showSaveFilePicker({
            suggestedName: filename,
            types: [{ description: 'MP3 Audio', accept: { 'audio/mpeg': ['.mp3'] } }],
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          alert(`Saved ${filename} to your file system!`);
        } else {
          // Fallback mechanism if File System Access API is not supported (e.g. mobile or Firefox)
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      } catch (saveError: any) {
        if (saveError.name !== 'AbortError') {
          console.error('Failed to save physical file:', saveError);
          // Don't throw, we still cached it for the app
        }
      }

      // 5. Save metadata to Firestore
      const docRef = doc(db, 'users', user.uid, 'downloads', song.id);
      await setDoc(docRef, {
        ...song,
        isLocal: true,
        cacheKey: cacheKey,
        downloadedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const removeDownloadRecord = async (songId: string) => {
     if (!user) return;
     const ref = doc(db, 'users', user.uid, 'downloads', songId);
     await deleteDoc(ref);
  };

  return { 
    downloadedSongs, 
    downloadSong, 
    removeDownloadRecord,
    isDownloaded: (id: string) => downloadedSongs.some(s => s.id === id), 
    loading 
  };
}
