import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoChevronBack, IoShareSocial, IoPeople, IoPlay, IoClose } from 'react-icons/io5';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/services/firebaseConfig';
import { collection, query, getDocs, doc, getDoc, setDoc, serverTimestamp, where } from 'firebase/firestore';
import { SongItem } from '@/services/api';
import { usePlayer } from '@/context/PlayerContext';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

export default function BlendPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { partnerId } = useParams<{ partnerId: string }>();
  const { playTrack } = usePlayer();

  const [loading, setLoading] = useState(true);
  const [partnerUsername, setPartnerUsername] = useState('');
  const [mySongs, setMySongs] = useState<SongItem[]>([]);
  const [partnerSongs, setPartnerSongs] = useState<SongItem[]>([]);
  const [blendPlaylist, setBlendPlaylist] = useState<SongItem[]>([]);
  const [vibeMatch, setVibeMatch] = useState<number | null>(null);

  // Generate a shareable link
  const shareLink = () => {
    if (!user) return;
    const url = `${window.location.origin}/blend/${user.uid}`;
    if (navigator.share) {
      navigator.share({ title: 'Blend our Vibes!', text: 'Check out our Blend and shared playlist on Melodify!', url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Blend link copied to clipboard!');
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchBlendData = async () => {
      setLoading(true);
      try {
        // Fetch My Songs (using LikedSongs as the base profile for simplicity)
        const myQ = query(collection(db, 'users', user.uid, 'likedSongs'));
        const mySnap = await getDocs(myQ);
        const myLikes = mySnap.docs.map(d => d.data() as SongItem);
        setMySongs(myLikes);

        // If a partner ID is present, fetch their data and calculate blend
        if (partnerId && partnerId !== user.uid) {
          // Get partner name
          const pDoc = await getDoc(doc(db, 'users', partnerId));
          const pData = pDoc.exists() ? pDoc.data() : {};
          const pName = (pData.email ? pData.email.split('@')[0] : null) || pData.displayName || pData.username || 'Friend';
          setPartnerUsername(pName);

          const pQ = query(collection(db, 'users', partnerId, 'likedSongs'));
          const pSnap = await getDocs(pQ);
          const pLikes = pSnap.docs.map(d => d.data() as SongItem);
          setPartnerSongs(pLikes);

          calculateBlend(myLikes, pLikes);
        } else if (partnerId === user.uid) {
          // User opened their own link
          setPartnerUsername('(Your Link)');
          calculateBlend(myLikes, myLikes);
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.error('Failed to load blend data', e);
        setLoading(false);
      }
    };

    fetchBlendData();
  }, [user, partnerId]);

  const calculateBlend = (mine: SongItem[], theirs: SongItem[]) => {
    if (mine.length === 0 || theirs.length === 0) {
      setVibeMatch(0);
      setBlendPlaylist([...mine, ...theirs]); // Just combine if someone has no likes
      setLoading(false);
      return;
    }

    const theirIds = new Set(theirs.map(s => s.id));
    const commonSongs = mine.filter(s => theirIds.has(s.id));
    
    const uniqueCount = mine.length + theirs.length - commonSongs.length;
    let percentage = uniqueCount === 0 ? 0 : Math.round((commonSongs.length / uniqueCount) * 100);
    
    // Base bump if at least one overlap
    if (commonSongs.length > 0 && percentage < 15) {
      percentage += 15;
    }
    setVibeMatch(Math.min(100, Math.max(0, percentage)));

    const blended: SongItem[] = [];
    let i = 0, j = 0;
    const addedIds = new Set();
    while (i < mine.length || j < theirs.length) {
      if (i < mine.length && !addedIds.has(mine[i].id)) {
        blended.push(mine[i]);
        addedIds.add(mine[i].id);
      }
      if (j < theirs.length && !addedIds.has(theirs[j].id)) {
        blended.push(theirs[j]);
        addedIds.add(theirs[j].id);
      }
      i++; j++;
    }
    setBlendPlaylist(blended);

    // Persist the blend to Firestore for history
    if (user && partnerId && partnerId !== user.uid) {
      const blendId = [user.uid, partnerId].sort().join('_');
      setDoc(doc(db, 'blends', blendId), {
        participants: [user.uid, partnerId],
        partnerName: theirs.length > 0 ? (partnerUsername || 'Friend') : 'Friend',
        songs: blended.slice(0, 30), // Store preview of top 30
        vibeMatch: Math.min(100, percentage),
        updatedAt: serverTimestamp()
      }).catch(e => console.error('Failed to persist blend', e));
    }

    setLoading(false);
  };

  const handlePlayBlend = () => {
    if (blendPlaylist.length > 0) {
      playTrack(blendPlaylist[0], blendPlaylist, 0);
    }
  };

  if (!user) return null;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* Dynamic Background */}
      <div style={{
        position: 'absolute', top: -100, left: -100, right: -100, height: 400,
        background: partnerId ? `linear-gradient(135deg, ${colors.primary}99, #9c27b099)` : `linear-gradient(135deg, ${colors.primary}55, ${colors.surface})`,
        filter: 'blur(80px)', zIndex: 0, opacity: 0.6
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', zIndex: 1 }}>
        <button className="icon-btn" onClick={() => navigate(-1)} style={{ color: colors.text }}><IoChevronBack size={26} /></button>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: colors.text }}>Blend</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20, zIndex: 1 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <SkeletonLoader height={200} style={{ borderRadius: 24 }} />
            <SkeletonLoader height={60} style={{ borderRadius: 12 }} />
            <SkeletonLoader height={60} style={{ borderRadius: 12 }} />
          </div>
        ) : !partnerId ? (
          // Invite Screen
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 24, marginTop: 40 }}>
            <div style={{ width: 120, height: 120, borderRadius: '50%', background: `${colors.primary}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <IoPeople size={60} color={colors.primary} />
            </div>
            <div>
              <h3 style={{ fontSize: 28, fontWeight: 900, color: colors.text, marginBottom: 8 }}>Invite a Friend</h3>
              <p style={{ color: colors.textSecondary, fontSize: 15, maxWidth: 300 }}>
                Share your Blend link to see how your music tastes match up and get a custom shared playlist!
              </p>
            </div>
            
            <button 
              onClick={shareLink}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '16px 32px',
                background: colors.primary, color: '#fff', borderRadius: 30, border: 'none',
                fontSize: 18, fontWeight: 800, cursor: 'pointer', boxShadow: `0 8px 24px ${colors.primary}66`,
                transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <IoShareSocial size={24} />
              Share Blend Link
            </button>
          </div>
        ) : (
          // Blend Result Screen
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{
              background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
              padding: 32, borderRadius: 32, border: `1px solid ${colors.glassBorder}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
            }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 2 }}>Vibe Match</p>
              
              <div style={{ position: 'relative', width: 160, height: 160, margin: '24px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="160" height="160" viewBox="0 0 160 160" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                  <circle cx="80" cy="80" r="72" fill="none" stroke={`${colors.textSecondary}33`} strokeWidth="12" />
                  <circle 
                    cx="80" cy="80" r="72" fill="none" 
                    stroke={vibeMatch! > 70 ? '#4caf50' : vibeMatch! > 40 ? '#ff9800' : colors.primary} 
                    strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 72}
                    strokeDashoffset={2 * Math.PI * 72 * (1 - vibeMatch! / 100)}
                    style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                  />
                </svg>
                <div style={{ fontSize: 48, fontWeight: 900, color: colors.text }}>
                  {vibeMatch}%
                </div>
              </div>

              <h2 style={{ fontSize: 24, fontWeight: 800, color: colors.text }}>You + {partnerUsername}</h2>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: colors.text }}>Your Blend Playlist</h3>
                <button 
                  onClick={handlePlayBlend}
                  style={{
                    width: 48, height: 48, borderRadius: '50%', background: colors.primary, color: '#fff',
                    border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    boxShadow: `0 4px 16px ${colors.primary}66`
                  }}
                >
                  <IoPlay size={24} style={{ marginLeft: 3 }} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {blendPlaylist.map((song, idx) => (
                  <div key={`${song.id}-${idx}`} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: 8,
                    borderRadius: 12, background: colors.surface, cursor: 'pointer',
                    transition: 'background 0.2s'
                  }} onClick={() => playTrack(song, blendPlaylist, idx)}>
                    <img src={song.artworkUrl} alt={song.title} style={{ width: 48, height: 48, borderRadius: 8 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.title}</div>
                      <div style={{ fontSize: 13, color: colors.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.artist}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
