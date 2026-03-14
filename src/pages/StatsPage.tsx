import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack, IoStatsChart, IoTime, IoMusicalNotes, IoPerson } from 'react-icons/io5';
import { useTheme } from '@/context/ThemeContext';
import { useStats } from '@/hooks/useStats';
import { useRecentlyPlayed } from '@/hooks/useRecentlyPlayed';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';

export default function StatsPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { stats, loading } = useStats();
  const { recentlyPlayed } = useRecentlyPlayed(10);

  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const aggregated = [0,0,0,0,0,0,0];

    stats.forEach(s => {
      const date = new Date(s.date);
      const dayIdx = date.getDay();
      aggregated[dayIdx] += s.secondsListened;
    });

    return days.map((day, idx) => ({
      subject: day,
      A: Number((aggregated[idx] / 3600).toFixed(2)),
      fullMark: Math.max(1, ...aggregated.map(s => s / 3600))
    }));
  }, [stats]);

  const genreData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    stats.forEach(s => {
      if (s.artists) { // Using artists as a proxy for genres as implemented
        Object.entries(s.artists).forEach(([name, secs]) => {
          counts[name] = (counts[name] || 0) + secs;
        });
      }
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value: Number((value / 3600).toFixed(2)) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [stats]);

  const totalSeconds = stats.reduce((acc, curr) => acc + (curr.secondsListened || 0), 0);
  const totalHours = totalSeconds / 3600;
  
  const displayTime = useMemo(() => {
    if (totalSeconds < 60) return `${totalSeconds} SECS`;
    if (totalSeconds < 3600) return `${Math.floor(totalSeconds / 60)} MINS`;
    return `${totalHours.toFixed(1)} HRS`;
  }, [totalSeconds]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', borderBottom: `1px solid ${colors.glassBorder}`, background: `linear-gradient(to right, ${colors.surface}, ${colors.surfaceHighlight})` }}>
        <button className="icon-btn" onClick={() => navigate(-1)} style={{ color: colors.text }}><IoChevronBack size={26} /></button>
        <IoStatsChart size={24} color={colors.primary} />
        <h2 style={{ fontSize: 22, fontWeight: 900, color: colors.text }}>Listening Stats</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
            <div className="spinner" style={{ width: 40, height: 40, borderColor: `${colors.primary} transparent transparent transparent` }} />
          </div>
        ) : stats.length === 0 || totalSeconds === 0 ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{ fontSize: 64, opacity: 0.4 }}>🕸️</div>
            <p style={{ color: colors.textSecondary, fontSize: 16 }}>No metrics collected yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {/* Hero Stats */}
            <div style={{ 
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}99)`, 
              padding: 32, borderRadius: 28, boxShadow: `0 20px 40px ${colors.primary}33`,
              color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}><IoStatsChart size={120} /></div>
              <p style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, opacity: 0.9 }}>Total Listening Time</p>
              <div style={{ fontSize: 64, fontWeight: 900, margin: '12px 0' }}>
                {displayTime}
              </div>
              <p style={{ fontSize: 14, opacity: 0.8 }}>Across all sessions</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              {/* Radar Chart */}
              <div style={{ background: colors.surfaceHighlight, padding: 24, borderRadius: 24, border: `1px solid ${colors.glassBorder}` }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: colors.text, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                   <IoMusicalNotes color={colors.primary} /> Usage Activity
                </h3>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                      <PolarGrid stroke={`${colors.textSecondary}33`} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: colors.textSecondary, fontSize: 12, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ background: colors.surfaceHighlight, border: `1px solid ${colors.glassBorder}`, borderRadius: 12 }}
                        itemStyle={{ color: colors.primary, fontWeight: 'bold' }}
                      />
                      <Radar name="Usage" dataKey="A" stroke={colors.primary} fill={colors.primary} fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Artists/Genres Chart */}
              <div style={{ background: colors.surfaceHighlight, padding: 24, borderRadius: 24, border: `1px solid ${colors.glassBorder}` }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: colors.text, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <IoPerson color={colors.primary} /> Top Artists
                </h3>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={genreData} layout="vertical" margin={{ left: -20 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" tick={{ fill: colors.text, fontSize: 11, fontWeight: 600 }} width={100} />
                      <Tooltip 
                         cursor={{ fill: 'transparent' }}
                         contentStyle={{ background: colors.surfaceHighlight, border: `1px solid ${colors.glassBorder}`, borderRadius: 12 }}
                      />
                      <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                        {genreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`${colors.primary}${Math.max(40, 100 - (index * 15)).toString(16)}`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* History List */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: colors.text, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <IoTime color={colors.primary} /> Just Heard
                </h3>
                <button onClick={() => navigate('/recently-played')} className="btn-ghost" style={{ fontSize: 13, color: colors.primary }}>View Full History</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recentlyPlayed.map((song, i) => (
                  <div key={`${song.id}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, background: colors.surfaceHighlight }}>
                    <img src={song.artworkUrl} style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} alt="" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.title}</div>
                      <div style={{ fontSize: 12, color: colors.textSecondary }}>{song.artist}</div>
                    </div>
                    <div style={{ fontSize: 11, color: colors.textSecondary, opacity: 0.6 }}>{i === 0 ? 'Just now' : `${i + 1} tracks ago`}</div>
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
