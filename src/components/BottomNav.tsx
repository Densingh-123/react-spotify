import React from 'react';
import { NavLink } from 'react-router-dom';
import { IoHome, IoSearch, IoLibrary } from 'react-icons/io5';

const NAV_ITEMS = [
  { to: '/', icon: IoHome, label: 'Home' },
  { to: '/search', icon: IoSearch, label: 'Search' },
  { to: '/library', icon: IoLibrary, label: 'Library' },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
        >
          <Icon size={22} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
