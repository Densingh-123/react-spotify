import CryptoJS from 'crypto-js';

export const decodeSaavnUrl = (input: string): string => {
  if (!input) return '';
  try {
    const key = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_SAAVN_DES_KEY || '38346591');
    const decrypted = CryptoJS.DES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(input) } as any,
      key,
      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
    );
    let decoded = decrypted.toString(CryptoJS.enc.Utf8);
    decoded = decoded.replace(/\.mp4.*/, '.mp4').replace(/\.m4a.*/, '.m4a');
    return decoded.replace('http:', 'https:');
  } catch (e) {
    console.warn('Failed to decode Saavn URL', e);
    return '';
  }
};

export interface LyricLine { time: number; text: string; }
export interface LyricsData { plain: string; synced: LyricLine[]; }

export interface SongItem {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string;
  album?: string;
  streamUrl?: string;
  fullStreamUrl?: string;
  previewUrl?: string;
}

const CORS_PROXY = import.meta.env.VITE_CORS_PROXY || 'https://api.codetabs.com/v1/proxy/?quest=';
const PIPED_API_BASE = import.meta.env.VITE_PIPED_API_BASE || 'https://pipedapi.kavin.rocks';
const SAAVN_API_BASE = import.meta.env.VITE_SAAVN_API_BASE || 'https://www.jiosaavn.com/api.php';
const LRCLIB_API_BASE = import.meta.env.VITE_LRCLIB_API_BASE || 'https://lrclib.net/api';

const fetchViaProxy = (url: string) =>
  fetch(`${CORS_PROXY}${encodeURIComponent(url)}`);

export const getProxiedUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('api.codetabs.com') || url.includes('corsproxy.io')) return url;
  return `${CORS_PROXY}${encodeURIComponent(url)}`;
};

/**
 * Unified helper to get a playable audio URL with automatic fallback
 */
export const getPlayableAudioUrl = async (song: SongItem): Promise<string | null> => {
  // Try 1: Saavn Preview URL (Proxied) - Best for Ringtones
  if (song.previewUrl) {
    const proxied = getProxiedUrl(song.previewUrl);
    try {
      const res = await fetch(proxied, { method: 'HEAD' });
      if (res.ok && res.headers.get('content-length') !== '0') return proxied;
    } catch {}
  }

  // Try 2: Saavn Full Stream (if decoded)
  if (song.streamUrl && song.streamUrl.length > 20 && !song.streamUrl.includes('dummy')) {
    return getProxiedUrl(song.streamUrl);
  }

  // Try 3: YouTube/Piped Stream via ID
  const stream = await getStreamUrl(song.id).catch(() => null);
  if (stream) return stream;

  // Try 4: Search YouTube by Title/Artist
  return await getFullStreamUrl(song.title, song.artist);
};

export const getStreamUrl = async (videoId: string): Promise<string | null> => {
  try {
    const pDataRes = await fetchViaProxy(`${PIPED_API_BASE}/streams/${videoId}`);
    if (!pDataRes.ok) return null;
    const pData = await pDataRes.json();
    const audioStreams = pData.audioStreams || [];
    const bestAudio = audioStreams.find((s: any) =>
      s.mimeType && (s.mimeType.includes('mp4') || s.mimeType.includes('m4a'))
    ) || audioStreams[0];
    return bestAudio?.url || null;
  } catch (e) {
    console.error('Failed to fetch stream URL', e);
    return null;
  }
};

export const getFullStreamUrl = async (title: string, artist: string): Promise<string | null> => {
  try {
    const query = encodeURIComponent(`${title} ${artist} audio`);
    const res = await fetchViaProxy(`${PIPED_API_BASE}/search?q=${query}&filter=music_songs`);
    if (!res.ok) return null;
    const data = await res.json();
    const topResult = data?.items?.[0];
    const videoId = topResult?.url?.split('v=')?.[1] || topResult?.url?.split('/')?.pop();
    if (!videoId) return null;
    return await getStreamUrl(videoId);
  } catch {
    return null;
  }
};

export const getYoutubeId = async (title: string, artist: string): Promise<string | null> => {
  try {
    const query = encodeURIComponent(`${title} ${artist}`);
    const res = await fetchViaProxy(`${PIPED_API_BASE}/search?q=${query}&filter=videos`);
    if (!res.ok) return null;
    const data = await res.json();
    const topResult = data?.items?.[0];
    return topResult?.url?.split('v=')?.[1] || topResult?.url?.split('/')?.pop() || null;
  } catch {
    return null;
  }
};

const unescapeHtml = (safe: string) => {
  if (!safe) return '';
  return safe.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&apos;/g, "'");
};

const getHighResImage = (url: string) => {
  if (!url) return '';
  return url.replace('50x50', '500x500').replace('150x150', '500x500').replace('http:', 'https:');
};

const mapTrack = (track: any): SongItem => ({
  id: track.id,
  title: unescapeHtml(track.title || track.song),
  artist: unescapeHtml(track.more_info?.music || track.subtitle || track.primary_artists || 'Unknown Artist'),
  artworkUrl: getHighResImage(track.image),
  streamUrl: decodeSaavnUrl(track.more_info?.encrypted_media_url || track.encrypted_media_url || ''),
  previewUrl: track.more_info?.preview_url || track.media_preview_url || '',
});

const saavnFetch = async (url: string) => {
  const res = await fetchViaProxy(url);
  if (!res.ok) throw new Error('Saavn fetch failed');
  const data = await res.json();
  let results = data.results || [];
  if (typeof results === 'object' && !Array.isArray(results)) results = Object.values(results);
  return results;
};

export const fetchTrending = async (languages: string[] = ['Tamil', 'English']): Promise<SongItem[]> => {
  try {
    const mainLang = languages[0] || 'Tamil';
    const queryStr = `${mainLang.toLowerCase()} hits 2024`;
    const url = `${SAAVN_API_BASE}?p=1&q=${encodeURIComponent(queryStr)}&_format=json&_marker=0&ctx=wap6dot0&n=40&__call=search.getResults`;
    const results = await saavnFetch(url);
    return results.map(mapTrack);
  } catch (error) {
    console.error('Error fetching trending:', error);
    return [];
  }
};

export const searchMusic = async (query: string, offset = 0): Promise<SongItem[]> => {
  if (!query) return [];
  try {
    const encodedQuery = encodeURIComponent(query);
    const page = Math.floor(offset / 20) + 1;
    const url = `${SAAVN_API_BASE}?p=${page}&q=${encodedQuery}&_format=json&_marker=0&ctx=wap6dot0&n=20&__call=search.getResults`;
    const results = await saavnFetch(url);
    return results.map(mapTrack);
  } catch (error) {
    console.error('Error searching music:', error);
    return [];
  }
};

export const searchSongs = searchMusic;

export const searchRingtones = async (query: string, languages: string[] = ['Tamil']): Promise<SongItem[]> => {
  try {
    // Search the query directly first - most Saavn songs have 30s previews anyway
    const url = `${SAAVN_API_BASE}?p=1&q=${encodeURIComponent(query)}&_format=json&_marker=0&ctx=wap6dot0&n=30&__call=search.getResults`;
    let results = await saavnFetch(url);
    
    // If no results, try appending ' ringtone' as a fallback
    if (results.length === 0) {
      const fallbackUrl = `${SAAVN_API_BASE}?p=1&q=${encodeURIComponent(query + ' ringtone')}&_format=json&_marker=0&ctx=wap6dot0&n=30&__call=search.getResults`;
      results = await saavnFetch(fallbackUrl);
    }

    return results.map(mapTrack);
  } catch (error) {
    console.error('Error searching ringtones:', error);
    return [];
  }
};

export const fetchTrendingRingtones = async (languages: string[] = ['Tamil']): Promise<SongItem[]> => {
  try {
    const lang = languages[0] || 'Tamil';
    const query = encodeURIComponent(`${lang} instrumental hits`);
    const url = `${SAAVN_API_BASE}?p=1&q=${query}&_format=json&_marker=0&ctx=wap6dot0&n=40&__call=search.getResults`;
    const results = await saavnFetch(url);
    // Filter for things that likely have previews or sound like ringtones
    return results.map(mapTrack).filter(s => s.previewUrl || s.title.toLowerCase().includes('tone'));
  } catch (error) {
    console.error('Error fetching trending ringtones:', error);
    return [];
  }
};

export const getRecommendedSongs = async (track: SongItem): Promise<SongItem[]> => {
  try {
    // Basic recommendation: search for the artist or related terms
    const query = `${track.artist} ${track.title.split('(')[0]}`;
    const results = await searchMusic(query);
    // Filter out the current track
    return results.filter(s => s.id !== track.id).slice(0, 10);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};

export const getLyrics = async (id: string, title?: string, artist?: string, album?: string, duration?: number): Promise<LyricsData> => {
  try {
    if (title && artist) {
      const lrcLibData = await getLyricsLRCLib(title, artist, album, duration);
      if (lrcLibData) return lrcLibData;
    }
    const ytId = (title && artist) ? await getYoutubeId(title, artist) : id;
    if (!ytId) return { plain: 'No lyrics available.', synced: [] };
    const res = await fetchViaProxy(`${PIPED_API_BASE}/lyrics/${ytId}`);
    if (!res.ok) return { plain: 'No lyrics available.', synced: [] };
    const data = await res.json();
    if (Array.isArray(data.lines)) {
      const synced = data.lines.map((line: any) => ({
        time: line.startTimeMs / 1000,
        text: line.words || line.content || ''
      }));
      return { plain: synced.map((l: any) => l.text).join('\n'), synced };
    }
    return { plain: 'No lyrics available.', synced: [] };
  } catch {
    return { plain: 'Error loading lyrics.', synced: [] };
  }
};

const getLyricsLRCLib = async (title: string, artist: string, album?: string, duration?: number): Promise<LyricsData | null> => {
  try {
    const params = new URLSearchParams({ track_name: title, artist_name: artist });
    if (album) params.append('album_name', album);
    if (duration) params.append('duration', Math.round(duration).toString());
    const response = await fetch(`${LRCLIB_API_BASE}/get?${params.toString()}`);
    if (response.status === 200) {
      const data = await response.json();
      return { plain: data.plainLyrics || '', synced: parseLRC(data.syncedLyrics || data.plainLyrics || '') };
    }
    return null;
  } catch {
    return null;
  }
};

const parseLRC = (lrc: string): LyricLine[] => {
  if (!lrc) return [];
  const lines = lrc.split('\n');
  const result: LyricLine[] = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
  lines.forEach(line => {
    const match = timeRegex.exec(line);
    if (match) {
      const time = parseInt(match[1]) * 60 + parseInt(match[2]) + parseInt(match[3]) / (match[3].length === 3 ? 1000 : 100);
      const text = line.replace(timeRegex, '').trim();
      if (text) result.push({ time, text });
    }
  });
  return result.sort((a, b) => a.time - b.time);
};
