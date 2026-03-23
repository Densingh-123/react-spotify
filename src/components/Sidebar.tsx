import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { IoHome, IoSearch, IoLibrary, IoSettings, IoChatbubbles, IoMusicalNotes, IoStatsChart, IoPeople, IoChevronBack, IoPerson } from 'react-icons/io5';
import { useAuth } from '@/context/AuthContext';

const NAV_ITEMS = [
  { to: '/', icon: IoHome, label: 'Home' },
  { to: '/search', icon: IoSearch, label: 'Search' },
  { to: '/library', icon: IoLibrary, label: 'Library' },
  { to: '/collab', icon: IoPeople, label: 'Collab Playlists' },
  { to: '/ringtones', icon: IoMusicalNotes, label: 'Ringtones' },
  { to: '/stats', icon: IoStatsChart, label: 'Listening Stats' },
  { to: '/blend', icon: IoPeople, label: 'Blend' },
  { to: '/settings', icon: IoSettings, label: 'Settings' },
  { to: '/support', icon: IoChatbubbles, label: 'Support' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMinimized, setIsMinimized] = useState(() => localStorage.getItem('sidebarMini') === 'true');

  useEffect(() => {
    localStorage.setItem('sidebarMini', String(isMinimized));
    document.body.classList.toggle('sidebar-min-active', isMinimized);
    // Let CSS know the variable width for fixing floating elements
    document.documentElement.style.setProperty('--sidebar-width', isMinimized ? '80px' : '240px');
  }, [isMinimized]);

  return (
    <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, overflow: 'hidden' }} onClick={() => navigate('/')}>
          <div className="sidebar-logo-icon" style={{ flexShrink: 0 }}>
            <img src="/logo.png" alt="Melodify" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }} />
          </div>
          {!isMinimized && <span className="sidebar-brand" style={{ color: 'var(--color-text)', whiteSpace: 'nowrap' }}>Melodify</span>}
        </div>
        <button 
          className="icon-btn" 
          onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} 
          style={{ color: 'var(--color-text-secondary)', flexShrink: 0, width: 32, height: 32 }}
        >
          <IoChevronBack size={20} style={{ transform: isMinimized ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
        </button>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            title={isMinimized ? label : undefined}
          >
            <Icon size={20} style={{ flexShrink: 0 }} />
            {!isMinimized && <span className="nav-label" style={{ whiteSpace: 'nowrap' }}>{label}</span>}
          </NavLink>
        ))}
      </nav>
      {!user && (
        <div className="sidebar-login-container" style={{ padding: isMinimized ? '16px 12px' : '16px 20px' }}>
          <button
            style={{
              width: '100%', padding: '12px', borderRadius: 12,
              background: 'var(--color-primary)', color: '#fff',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}
            onClick={() => navigate('/login')}
            title={isMinimized ? 'Login' : undefined}
          >
            {isMinimized ? <IoPerson size={18} /> : 'Login'}
          </button>
        </div>
      )}
    </div>
  );
}
