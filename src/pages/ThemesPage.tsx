import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack, IoCheckmarkCircle } from 'react-icons/io5';
import { useTheme, ThemeMode, themes } from '@/context/ThemeContext';

const THEME_GROUPS = [
  { title: ' Dark Themes', keys: ['black', 'midnight', 'amoled'] },
  { title: ' Light Themes', keys: ['white', 'snow'] },
  { title: ' Animated: Space', keys: ['twinkling_stars', 'galaxy_spiral', 'shooting_stars', 'nebula_clouds', 'floating_planets', 'asteroid_field', 'black_hole', 'constellation'] },
  { title: ' Animated: Water', keys: ['ocean_waves', 'underwater_bubbles', 'sea_shore', 'coral_reef', 'deep_sea_glow', 'water_ripple', 'rain_on_water', 'floating_boats'] },
  { title: ' Animated: Nature', keys: ['floating_leaves', 'cherry_blossom', 'moving_clouds', 'forest_fireflies', 'snowfall', 'butterflies', 'grass_sway', 'sunrise_gradient'] },
  { title: ' Animated: Abstract', keys: ['glass_orbs', 'liquid_gradient', 'neon_lines', 'particle_network', 'floating_cubes', 'colorful_smoke', 'energy_waves', 'aurora_borealis'] },
  { title: '🚗 Animated: Street & Travel', keys: ['highway_sunset','bus_window_rain','train_window','metro_ride','bike_ride_pov','auto_rickshaw','plane_takeoff','neon_taxi','terrace_friends','road_trip_friends','beach_bonfire','rain_walk','sunset_silhouette','street_food','city_timelapse','rain_reflection','street_musician','empty_night_road','window_thinking','train_goodbye','train_bridge','lonely_walk','city_top_view','bus_stop_rain','fog_street','festival_lights','ferris_wheel','slow_traffic','boat_ride','lofi_window','neon_alley','subway_rush','delivery_ride','market_crowd','college_walk','rooftop_party','street_dogs','zebra_crossing','truck_night','sunrise_city'] },
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
  twinkling_stars: 'Twinkling Stars', galaxy_spiral: 'Galaxy Spiral', shooting_stars: 'Shooting Stars', nebula_clouds: 'Nebula Clouds', floating_planets: 'Floating Planets', asteroid_field: 'Asteroid Field', black_hole: 'Black Hole', constellation: 'Constellation',
  ocean_waves: 'Ocean Waves', underwater_bubbles: 'Underwater Bubbles', sea_shore: 'Sea Shore', coral_reef: 'Coral Reef', deep_sea_glow: 'Deep Sea Glow', water_ripple: 'Water Ripple', rain_on_water: 'Rainy Water', floating_boats: 'Floating Boats',
  floating_leaves: 'Falling Leaves', cherry_blossom: 'Cherry Blossom', moving_clouds: 'Moving Clouds', forest_fireflies: 'Forest Fireflies', snowfall: 'Snowfall', butterflies: 'Butterflies', grass_sway: 'Swaying Grass', sunrise_gradient: 'Sunrise Sky',
  glass_orbs: 'Glass Orbs', liquid_gradient: 'Liquid Gradient', neon_lines: 'Neon Lines', particle_network: 'Particle Network', floating_cubes: 'Floating Cubes', colorful_smoke: 'Colorful Smoke', energy_waves: 'Energy Waves', aurora_borealis: 'Aurora Borealis',
  digital_matrix: 'Digital Matrix', circuit_glow: 'Circuit Board', ai_network: 'Neural Network', holographic_grid: 'Holographic Grid', data_stream: 'Data Stream', radar_scan: 'Radar Scan',
  floating_balloons: 'Floating Balloons', paper_planes: 'Paper Planes', fireplace_glow: 'Fireplace Glow',
  highway_sunset:'Highway Sunset', bus_window_rain:'Bus Window Rain', train_window:'Train Window', metro_ride:'Metro Ride', bike_ride_pov:'Bike Ride POV', auto_rickshaw:'Auto Rickshaw', plane_takeoff:'Plane Takeoff', neon_taxi:'Neon Taxi', terrace_friends:'Terrace Friends', road_trip_friends:'Road Trip Friends', beach_bonfire:'Beach Bonfire', rain_walk:'Rain Walk', sunset_silhouette:'Sunset Silhouette', street_food:'Street Food', city_timelapse:'City Timelapse', rain_reflection:'Rain Reflection', street_musician:'Street Musician', empty_night_road:'Empty Night Road', window_thinking:'Window Thinking', train_goodbye:'Train Goodbye', train_bridge:'Train Bridge', lonely_walk:'Lonely Walk', city_top_view:'City Top View', bus_stop_rain:'Bus Stop Rain', fog_street:'Fog Street', festival_lights:'Festival Lights', ferris_wheel:'Ferris Wheel', slow_traffic:'Slow Traffic', boat_ride:'Boat Ride', lofi_window:'Lo-Fi Window', neon_alley:'Neon Alley', subway_rush:'Subway Rush', delivery_ride:'Delivery Ride', market_crowd:'Market Crowd', college_walk:'College Walk', rooftop_party:'Rooftop Party', street_dogs:'Street Dogs', zebra_crossing:'Zebra Crossing', truck_night:'Truck Night', sunrise_city:'Sunrise City',
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
