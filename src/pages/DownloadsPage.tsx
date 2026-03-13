import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack, IoDownload } from 'react-icons/io5';
import { useTheme } from '@/context/ThemeContext';

export default function DownloadsPage() {
  const { colors } = useTheme();
  const nav = useNavigate();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', borderBottom: `1px solid ${colors.glassBorder}` }}>
        <button className="icon-btn" onClick={() => nav(-1)} style={{ color: colors.text }}><IoChevronBack size={26} /></button>
        <IoDownload size={24} color={colors.primary} />
        <h2 style={{ fontSize: 22, fontWeight: 900, color: colors.text }}>Downloads</h2>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ fontSize: 64, opacity: 0.4 }}>⬇️</div>
        <p style={{ color: colors.textSecondary, fontSize: 16 }}>No downloaded songs yet</p>
        <p style={{ color: colors.textSecondary, fontSize: 13, textAlign: 'center', maxWidth: 260 }}>
          Tap ⋯ on any song and choose "Download Song" to save it for offline listening.
        </p>
      </div>
    </div>
  );
}
