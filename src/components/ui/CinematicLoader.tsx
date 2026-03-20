import React, { useEffect, useState } from 'react';

export default function CinematicLoader() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.05;
      setPulse(Math.sin(t) * 0.5 + 0.5);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: '#020617', overflow: 'hidden',
      perspective: '1000px'
    }}>
      {/* Deep cinematic background glow */}
      <div style={{
        position: 'absolute', width: '150vw', height: '150vh',
        background: 'radial-gradient(circle at center, rgba(30,41,59,0.8), #020617 60%)',
        animation: 'spin 30s linear infinite',
        opacity: 0.6
      }} />

      {/* 3D Glass Rings */}
      <div style={{
        position: 'relative', width: 120, height: 120,
        transformStyle: 'preserve-3d',
        animation: 'rotate3d 8s ease-in-out infinite alternate'
      }}>
        {[1, 2, 3].map((ring) => (
          <div key={ring} style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: `2px solid rgba(14, 165, 233, ${0.2 * ring})`,
            borderTop: `2px solid rgba(56, 189, 248, 0.9)`,
            borderBottom: `2px solid rgba(125, 211, 252, 0.😎`,
            boxShadow: `0 0 ${20 * ring}px rgba(14, 165, 233, ${0.1 * ring}), inset 0 0 ${10 * ring}px rgba(56, 189, 248, 0.2)`,
            transform: `rotateX(${60 + ring * 10}deg) rotateY(${15 * ring}deg) translateZ(${ring * 10 - 20}px)`,
            animation: `spin ${3 - ring * 0.5}s linear infinite`,
            backdropFilter: 'blur(4px)'
          }} />
        ))}

        {/* Center glowing core */}
        <div style={{
          position: 'absolute', inset: 30, borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #e0f2fe, #38bdf8 40%, #0369a1)',
          boxShadow: `0 0 ${40 + pulse * 20}px rgba(56, 189, 248, ${0.4 + pulse * 0.3})`,
          animation: 'floatCore 4s ease-in-out infinite alternate',
          transform: 'translateZ(15px)'
        }} />
      </div>

      <div style={{
        marginTop: 60, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: 28, fontWeight: 900,
          background: 'linear-gradient(to bottom right, #f8fafc, #94a3b8)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: 8, margin: 0, paddingLeft: 8,
          textTransform: 'uppercase'
        }}>
          Melodify
        </h1>
        <p style={{
          fontSize: 12, color: '#64748b', letterSpacing: 4, marginTop: 12,
          textTransform: 'uppercase', opacity: 0.6 + pulse * 0.4
        }}>
          
        </p>
      </div>

      <style>{`
        @keyframes rotate3d {
          0% { transform: rotateX(20deg) rotateY(-20deg) }
          100% { transform: rotateX(-20deg) rotateY(20deg) }
        }
        @keyframes spin {
          to { transform: rotate(360deg) }
        }
        @keyframes floatCore {
          0% { transform: translateZ(10px) scale(0.95) }
          100% { transform: translateZ(25px) scale(1.05) }
        }
      `}</style>
    </div>
  );
}
