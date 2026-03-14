import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { IoChevronBack, IoSearch, IoAdd, IoTrash, IoMusicalNote, IoPerson } from 'react-icons/io5';
import { useTheme } from '@/context/ThemeContext';
import { usePlaylists } from '@/hooks/usePlaylists';
import { searchMusic, SongItem } from '@/services/api';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

export default function PlaylistManagementPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { playlists, setPlaylistSongs } = usePlaylists();
  
  const playlist = playlists.find(p => p.id === id);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SongItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync local songs state with playlist
  const [songs, setSongs] = useState<SongItem[]>([]);

  useEffect(() => {
    if (playlist) {
      setSongs(playlist.songs || []);
    }
  }, [playlist]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await searchMusic(searchQuery);
      setSearchResults(results);
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const addSong = async (song: SongItem) => {
    if (songs.some(s => s.id === song.id)) return;
    const newSongs = [...songs, song];
    setSongs(newSongs);
    await setPlaylistSongs(id!, newSongs);
  };

  const removeSong = async (songId: string) => {
    const newSongs = songs.filter(s => s.id !== songId);
    setSongs(newSongs);
    await setPlaylistSongs(id!, newSongs);
  };

  if (!playlist) return <div style={{ padding: 40, textAlign: 'center', color: colors.text }}>Playlist not found</div>;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: colors.background }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: `1px solid ${colors.glassBorder}` }}>
        <button className="icon-btn" onClick={() => navigate(-1)} style={{ color: colors.text }}>
          <IoChevronBack size={26} />
        </button>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: colors.text, margin: 0 }}>Manage {playlist.name}</h2>
          <p style={{ fontSize: 13, color: colors.textSecondary, margin: 0 }}>{songs.length} tracks</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>
        {/* Search Section */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: colors.text, marginBottom: 16 }}>Find more songs</h3>
          <div style={{ display: 'flex', gap: 10, background: colors.surface, padding: 8, borderRadius: 16, border: `1px solid ${colors.glassBorder}` }}>
            <input 
              style={{ flex: 1, background: 'none', border: 'none', color: colors.text, padding: '8px 12px', fontSize: 15 }}
              placeholder="Search for tracks to add..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={handleSearch}
              style={{ padding: '10px 20px', borderRadius: 12, background: colors.primary, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              {searching ? '...' : <IoSearch size={20} />}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
               {searchResults.map(result => (
                 <div key={result.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 12, background: colors.surfaceHighlight }}>
                    <img src={result.artworkUrl} style={{ width: 44, height: 44, borderRadius: 8 }} alt="" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: colors.text }}>{result.title}</div>
                      <div style={{ fontSize: 12, color: colors.textSecondary }}>{result.artist}</div>
                    </div>
                    <button 
                      onClick={() => addSong(result)}
                      style={{ 
                        width: 32, height: 32, borderRadius: '50%', background: colors.primary, color: '#fff', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer'
                      }}
                    >
                      <IoAdd size={20} />
                    </button>
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* Current Songs Section */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: colors.text, marginBottom: 16 }}>Playlist Songs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {songs.map((song, i) => (
              <div key={`${song.id}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 16, background: colors.surface }}>
                 <div style={{ width: 40, height: 40, borderRadius: 10, background: colors.surfaceHighlight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.textSecondary, fontWeight: 700, fontSize: 14 }}>
                   {i + 1}
                 </div>
                 <img src={song.artworkUrl} style={{ width: 40, height: 40, borderRadius: 8 }} alt="" />
                 <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.title}</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>{song.artist}</div>
                 </div>
                 <button 
                  onClick={() => removeSong(song.id)}
                  style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
                 >
                   <IoTrash size={20} />
                 </button>
              </div>
            ))}
            {songs.length === 0 && (
              <p style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 20 }}>No songs in this playlist yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
