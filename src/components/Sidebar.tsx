import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { IoHome, IoSearch, IoLibrary, IoSettings, IoChatbubbles, IoMusicalNotes } from 'react-icons/io5';
import { useAuth } from '@/context/AuthContext';

const NAV_ITEMS = [
  { to: '/', icon: IoHome, label: 'Home' },
  { to: '/search', icon: IoSearch, label: 'Search' },
  { to: '/library', icon: IoLibrary, label: 'Library' },
  { to: '/settings', icon: IoSettings, label: 'Settings' },
  { to: '/support', icon: IoChatbubbles, label: 'Support' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate('/')}>
        <div className="sidebar-logo-icon">
          <IoMusicalNotes size={22} color="var(--color-primary)" />
        </div>
        <span className="sidebar-brand" style={{ color: 'var(--color-text)' }}>BloomeeTunes</span>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
      {!user && (
        <div style={{ padding: '16px 20px' }}>
          <button
            style={{
              width: '100%', padding: '12px', borderRadius: 12,
              background: 'var(--color-primary)', color: '#fff',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}
