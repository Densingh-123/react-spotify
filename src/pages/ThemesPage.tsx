import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack, IoCheckmarkCircle } from 'react-icons/io5';
import { useTheme, ThemeMode, themes } from '@/context/ThemeContext';

const THEME_GROUPS = [
  { title: '🌑 Dark Themes', keys: ['black','midnight','amoled','galaxy','ocean','forest','sunset','volcano','neon','cyberpunk','deep_blue','deep_purple','deep_red','deep_teal','deep_orange','matrix','dracula','nord_dark','synthwave','obsidian','charcoal','espresso','blood_moon','toxic','electric','royal_dark','emerald_dark','ruby','sapphire','twilight'] },
  { title: '☀️ Light Themes', keys: ['white','snow','sky','mint','rose','lemon','peach','lavender','sakura','nord_light'] },
];

const DISPLAY_NAMES: Record<string, string> = {
  black:'Pitch Black', midnight:'Midnight', amoled:'AMOLED', galaxy:'Galaxy', ocean:'Deep Ocean',
  forest:'Forest', sunset:'Sunset', volcano:'Volcano', neon:'Neon', cyberpunk:'Cyberpunk',
  deep_blue:'Deep Blue', deep_purple:'Deep Purple', deep_red:'Deep Red', deep_teal:'Deep Teal',
  deep_orange:'Deep Orange', matrix:'Matrix', dracula:'Dracula', nord_dark:'Nord Dark',
  synthwave:'Synthwave', obsidian:'Obsidian', charcoal:'Charcoal', espresso:'Espresso',
  blood_moon:'Blood Moon', toxic:'Toxic', electric:'Electric', royal_dark:'Royal Dark',
  emerald_dark:'Emerald Dark', ruby:'Ruby', sapphire:'Sapphire', twilight:'Twilight',
  white:'Pure White', snow:'Snow', sky:'Sky Blue', mint:'Mint', rose:'Rose',
  lemon:'Lemon', peach:'Peach', lavender:'Lavender', sakura:'Sakura', nord_light:'Nord Light',
};

export default function ThemesPage() {
  const nav = useNavigate();
  const { colors, currentMode, setThemeMode } = useTheme();

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 16px 20px', position: 'sticky', top: 0, background: 'var(--color-bg)', zIndex: 10, borderBottom: `1px solid ${colors.glassBorder}` }}>
        <button className="icon-btn" onClick={() => nav(-1)} style={{ color: colors.text }}><IoChevronBack size={26} /></button>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: colors.text }}>Themes</h2>
      </div>

      {/* Currently active */}
      <div style={{ margin: '16px 16px', background: colors.surface, borderRadius: 16, padding: '14px', border: `2px solid ${colors.primary}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: themes[currentMode].primary, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 12, color: colors.primary, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Active Theme</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: colors.text }}>{DISPLAY_NAMES[currentMode] || currentMode}</div>
        </div>
      </div>

      {THEME_GROUPS.map(group => (
        <div key={group.title} style={{ marginBottom: 28, padding: '0 16px' }}>
          <p style={{ fontSize: 16, fontWeight: 800, color: colors.text, marginBottom: 14 }}>{group.title}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
            {group.keys.map(key => {
              const t = themes[key as ThemeMode];
              const isSelected = key === currentMode;
              return (
                <button key={key} onClick={() => setThemeMode(key as ThemeMode)}
                  style={{
                    position: 'relative', border: isSelected ? `2px solid ${t.primary}` : '2px solid transparent',
                    borderRadius: 16, overflow: 'hidden', cursor: 'pointer', background: 'none', padding: 0,
                    height: 100, transition: 'border-color 0.2s, transform 0.15s',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  }}>
                  {/* Theme preview gradient */}
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${t.gradientColors[0]}, ${t.gradientColors[2] || t.gradientColors[0]})` }} />
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${t.primary}44, ${t.accent}44)` }} />
                  {/* Color dots */}
                  <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.primary }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.accent }} />
                  </div>
                  {/* Name */}
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'flex-end', padding: '10px 8px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.8)', textAlign: 'center', lineHeight: 1.2 }}>{DISPLAY_NAMES[key]}</span>
                  </div>
                  {isSelected && (
                    <div style={{ position: 'absolute', top: 8, left: 8 }}>
                      <IoCheckmarkCircle size={20} color={t.primary} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
