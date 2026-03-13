import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronForward, IoLogOut, IoPerson, IoColorPalette, IoLockClosed, IoHelpCircle, IoInformationCircle, IoMusicalNotes, IoDownload, IoTime, IoHeart } from 'react-icons/io5';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsPage() {
  const { colors } = useTheme();
  const nav = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    nav('/login');
  };

  const sections = [
    {
      title: 'Account',
      items: [
        { icon: IoPerson, label: 'Profile', sub: user?.email || 'Not logged in', action: () => {} },
        { icon: IoLogOut, label: 'Sign Out', sub: 'See you next time!', action: handleSignOut, danger: true },
      ]
    },
    {
      title: 'Music',
      items: [
        { icon: IoDownload, label: 'Downloads', sub: 'Offline songs', action: () => nav('/downloads') },
        { icon: IoTime, label: 'Recently Played', sub: 'Your history', action: () => nav('/recently-played') },
        { icon: IoHeart, label: 'Liked Songs', sub: 'Your favorites', action: () => nav('/liked') },
      ]
    },
    {
      title: 'Personalization',
      items: [
        { icon: IoColorPalette, label: 'Themes', sub: '40 themes available', action: () => nav('/themes') },
        { icon: IoMusicalNotes, label: 'Audio Quality', sub: 'High quality streaming', action: () => {} },
      ]
    },
    {
      title: 'Support & Info',
      items: [
        { icon: IoHelpCircle, label: 'Support Chat', sub: 'AI-powered help', action: () => nav('/support') },
        { icon: IoLockClosed, label: 'Privacy Policy', sub: 'How we protect your data', action: () => {} },
        { icon: IoInformationCircle, label: 'About Melodify', sub: 'Version 1.0.0', action: () => {} },
      ]
    },
  ];

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      {/* Profile header */}
      <div style={{
        padding: '30px 20px 24px',
        background: `linear-gradient(160deg, ${colors.primary}22 0%, transparent 80%)`,
        display: 'flex', alignItems: 'center', gap: 18,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 22,
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 6px 20px ${colors.primary}55`,
        }}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: 22, objectFit: 'cover' }} />
          ) : (
            <IoPerson size={38} color="#fff" />
          )}
        </div>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: colors.text }}>
            {user?.displayName || 'Music Lover'}
          </h2>
          <p style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
            {user?.email || 'Guest User'}
          </p>
          {!user && (
            <button onClick={() => nav('/login')} style={{
              marginTop: 10, padding: '8px 20px', border: 'none', borderRadius: 12,
              background: colors.primary, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}>Login Now</button>
          )}
        </div>
      </div>

      {/* Settings sections */}
      <div style={{ padding: '8px 16px 120px' }}>
        {sections.map(sec => (
          <div key={sec.title} style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase', color: colors.textSecondary, padding: '0 4px 10px' }}>
              {sec.title}
            </p>
            <div style={{ background: colors.surface, borderRadius: 18, overflow: 'hidden', border: `1px solid ${colors.glassBorder}` }}>
              {sec.items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button key={item.label} onClick={item.action}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '14px 16px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      borderBottom: idx < sec.items.length - 1 ? `1px solid ${colors.glassBorder}` : 'none',
                      textAlign: 'left', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = colors.surfaceHighlight)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: (item as any).danger ? '#ff000020' : colors.primary + '20',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={18} color={(item as any).danger ? '#ff4444' : colors.primary} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: (item as any).danger ? '#ff4444' : colors.text }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 1 }}>{item.sub}</div>
                    </div>
                    <IoChevronForward size={16} color={colors.textSecondary} />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <p style={{ textAlign: 'center', fontSize: 13, color: colors.textSecondary, paddingTop: 8 }}>
          Melodify v1.0.0 — Made with ❤️
        </p>
      </div>
    </div>
  );
}
