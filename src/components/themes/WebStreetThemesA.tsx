import React, { useRef, useMemo } from 'react';
import { useCanvas } from './WebSpaceThemes';

// ─── 41. BUS WINDOW RAIN ─────────────────────────────────────────────────────
export const BusWindowRain = () => {
  interface Drop { x: number; y: number; vy: number; len: number; }
  const drops = useRef<Drop[]>([]);
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    // Night city background (blurry through glass)
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h);
    // City bokeh lights
    const lights = [
      [0.1,0.4,'#f97316'],[0.25,0.55,'#fbbf24'],[0.4,0.35,'#ef4444'],[0.55,0.5,'#22d3ee'],
      [0.7,0.4,'#f97316'],[0.85,0.6,'#fbbf24'],[0.15,0.7,'#22c55e'],[0.6,0.65,'#a78bfa'],
      [0.9,0.3,'#f43f5e'],[0.35,0.75,'#fbbf24'],[0.75,0.2,'#38bdf8'],
    ];
    lights.forEach(([lx,ly,c]) => {
      const r = 35 + Math.sin(t * 0.02 + +lx * 5) * 10;
      const g = ctx.createRadialGradient(+lx * w, +ly * h, 0, +lx * w, +ly * h, r);
      g.addColorStop(0, c + 'cc'); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(+lx * w, +ly * h, r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    // Bus motion — city moves sideways
    const offset = (t * 2.5) % w;
    // Neon sign streaks
    ['#f97316','#22d3ee','#f43f5e','#fbbf24'].forEach((c, i) => {
      const sx = (i * w * 0.28 - offset + w * 2) % (w * 1.4) - 50;
      ctx.fillStyle = c + '33'; ctx.fillRect(sx, h * (0.2 + i * 0.12), 90, 8);
    });
    // Glass overlay tint
    ctx.fillStyle = 'rgba(14,20,40,0.3)'; ctx.fillRect(0, 0, w, h);
    // Rain drops on window
    while (drops.current.length < 90) drops.current.push({ x: Math.random() * w, y: Math.random() * h, vy: Math.random() * 6 + 4, len: Math.random() * 60 + 25 });
    drops.current = drops.current.filter(d => d.y < h + 80);
    drops.current.forEach(d => {
      d.y += d.vy; d.x += 0.4;
      const g = ctx.createLinearGradient(d.x, d.y, d.x + 1, d.y - d.len);
      g.addColorStop(0, 'rgba(147,197,253,0.7)'); g.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + 1, d.y - d.len);
      ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke();
    });
    // Window frame
    ctx.strokeStyle = 'rgba(100,116,139,0.4)'; ctx.lineWidth = 18;
    ctx.strokeRect(0, 0, w, h);
    // Interior bus reflection (warm)
    ctx.fillStyle = 'rgba(251,191,36,0.04)'; ctx.fillRect(0, 0, w, h);
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 42. TRAIN WINDOW ────────────────────────────────────────────────────────
export const TrainWindow = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.45);
    sky.addColorStop(0, '#38bdf8'); sky.addColorStop(1, '#bae6fd');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.45);
    // Ground
    ctx.fillStyle = '#166534'; ctx.fillRect(0, h * 0.45, w, h * 0.55);
    // Speed lines – trees, poles, buildings blurring past
    const speed = t * 5;
    const items = [
      { period: 130, type: 'tree', color: '#15803d', h: 0.3 },
      { period: 90, type: 'pole', color: '#64748b', h: 0.22 },
      { period: 200, type: 'house', color: '#b45309', h: 0.18 },
    ];
    items.forEach(item => {
      for (let i = 0; i < Math.ceil(w / item.period) + 2; i++) {
        const x = ((i * item.period - speed) % (w + item.period) + w + item.period) % (w + item.period) - item.period;
        const bh = h * item.h;
        const by = h * 0.45 - bh;
        if (item.type === 'tree') {
          ctx.beginPath(); ctx.moveTo(x, h * 0.45); ctx.lineTo(x, by + bh * 0.4);
          ctx.strokeStyle = '#92400e'; ctx.lineWidth = 5; ctx.stroke();
          ctx.beginPath(); ctx.arc(x, by + bh * 0.35, 22, 0, Math.PI * 2);
          ctx.fillStyle = item.color; ctx.fill();
        } else if (item.type === 'pole') {
          ctx.fillStyle = item.color; ctx.fillRect(x - 2, by, 4, bh);
          ctx.fillRect(x - 18, by + 5, 36, 3);
        } else {
          ctx.fillStyle = item.color; ctx.fillRect(x - 25, by, 50, bh);
          ctx.fillStyle = '#78350f'; ctx.fillRect(x - 28, by - 12, 56, 18);
        }
      }
    });
    // Small pond gleam
    const pondX = ((t * 3) % (w + 200) - 200 + w) % (w + 200) - 200;
    ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.ellipse(pondX, h * 0.52, 50, 14, 0, 0, Math.PI * 2); ctx.fill();
    // Person silhouette (side profile, looking out)
    ctx.fillStyle = 'rgba(15,23,42,0.5)'; ctx.beginPath(); ctx.arc(w * 0.06, h * 0.5, 28, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(w * 0.03, h * 0.52, 56, h * 0.3);
    // Window frame
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 22; ctx.strokeRect(0, 0, w, h);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3; ctx.strokeRect(11, 11, w - 22, h - 22);
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 43. METRO RIDE (distant city — train on elevated tracks) ──────────────────
export const MetroRide = () => {
  const trainX = useRef(0);
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);

    // ── Sky: dusk gradient ──────────────────────────────────────────────────
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.55);
    sky.addColorStop(0, '#0a0a1a');
    sky.addColorStop(0.4, '#1a1040');
    sky.addColorStop(0.7, '#392060');
    sky.addColorStop(1, '#7c3a8a');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.55);

    // ── Stars ───────────────────────────────────────────────────────────────
    for (let i = 0; i < 80; i++) {
      const sx = (Math.sin(i * 89.7) * 0.5 + 0.5) * w;
      const sy = (Math.cos(i * 137.5) * 0.5 + 0.5) * h * 0.45;
      const twinkle = 0.4 + Math.sin(t * 0.05 + i) * 0.3;
      ctx.globalAlpha = twinkle;
      ctx.beginPath(); ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff'; ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ── Moon ────────────────────────────────────────────────────────────────
    const moonX = w * 0.85, moonY = h * 0.12;
    const moonG = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 32);
    moonG.addColorStop(0, '#fef9c3'); moonG.addColorStop(0.6, '#fde68a60'); moonG.addColorStop(1, 'transparent');
    ctx.fillStyle = moonG; ctx.beginPath(); ctx.arc(moonX, moonY, 32, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fef9c3'; ctx.beginPath(); ctx.arc(moonX, moonY, 18, 0, Math.PI * 2); ctx.fill();
    // Moon glow
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 80);
    moonGlow.addColorStop(0, 'rgba(254,249,195,0.15)'); moonGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = moonGlow; ctx.beginPath(); ctx.arc(moonX, moonY, 80, 0, Math.PI * 2); ctx.fill();

    // ── Distant city skyline (very far, small) ──────────────────────────────
    const cityBuildings = [
      { x: 0.02, w: 0.04, h: 0.28 }, { x: 0.05, w: 0.03, h: 0.22 },
      { x: 0.09, w: 0.05, h: 0.35 }, { x: 0.14, w: 0.03, h: 0.18 },
      { x: 0.18, w: 0.06, h: 0.30 }, { x: 0.25, w: 0.04, h: 0.42 }, // Tallest tower
      { x: 0.30, w: 0.03, h: 0.26 }, { x: 0.34, w: 0.05, h: 0.32 },
      { x: 0.40, w: 0.03, h: 0.20 }, { x: 0.44, w: 0.07, h: 0.38 },
      { x: 0.52, w: 0.04, h: 0.29 }, { x: 0.57, w: 0.03, h: 0.22 },
      { x: 0.61, w: 0.06, h: 0.36 }, { x: 0.67, w: 0.04, h: 0.44 }, // Tallest tower 2
      { x: 0.72, w: 0.03, h: 0.26 }, { x: 0.76, w: 0.05, h: 0.30 },
      { x: 0.82, w: 0.04, h: 0.24 }, { x: 0.87, w: 0.06, h: 0.34 },
      { x: 0.94, w: 0.04, h: 0.20 }, { x: 0.98, w: 0.03, h: 0.28 },
    ];

    const horizonY = h * 0.55;
    cityBuildings.forEach(b => {
      const bx = b.x * w;
      const bw = b.w * w;
      const bh = b.h * h;
      const by = horizonY - bh;

      // Building silhouette (dark blue-purple)
      ctx.fillStyle = '#1a1535';
      ctx.fillRect(bx, by, bw, bh);

      // Glowing windows (small dots scattered)
      for (let wy = by + 6; wy < horizonY - 4; wy += 9) {
        for (let wx2 = bx + 3; wx2 < bx + bw - 3; wx2 += 7) {
          if (Math.sin(wx2 * 0.8 + wy * 0.5) > 0.1) {
            const winFlicker = Math.sin(t * 0.03 + wx2 + wy) > 0.8 ? 0.2 : 1; // rare flicker
            ctx.globalAlpha = 0.7 * winFlicker;
            ctx.fillStyle = Math.sin(wx2 + wy) > 0.3 ? '#fbbf24' : '#93c5fd';
            ctx.fillRect(wx2, wy, 2, 4);
          }
        }
      }
      ctx.globalAlpha = 1;

      // Antenna / spire on tall buildings
      if (b.h > 0.35) {
        ctx.fillStyle = '#2d2050';
        ctx.fillRect(bx + bw / 2 - 1, by - h * 0.04, 2, h * 0.04);
        // Blinking antenna light
        const blink = Math.sin(t * 0.08) > 0;
        if (blink) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath(); ctx.arc(bx + bw / 2, by - h * 0.04, 2.5, 0, Math.PI * 2); ctx.fill();
        }
      }
    });

    // City ambient glow (orange/purple haze at horizon)
    const cityGlow = ctx.createLinearGradient(0, horizonY - 60, 0, horizonY);
    cityGlow.addColorStop(0, 'transparent');
    cityGlow.addColorStop(1, 'rgba(124,58,138,0.35)');
    ctx.fillStyle = cityGlow; ctx.fillRect(0, horizonY - 60, w, 60);

    // ── Ground / River ──────────────────────────────────────────────────────
    const ground = ctx.createLinearGradient(0, horizonY, 0, h);
    ground.addColorStop(0, '#0d0d0d'); ground.addColorStop(1, '#050505');
    ctx.fillStyle = ground; ctx.fillRect(0, horizonY, w, h - horizonY);

    // River reflection
    const riverY = horizonY + (h - horizonY) * 0.65;
    ctx.fillStyle = '#0c1a2e';
    ctx.beginPath(); ctx.ellipse(w * 0.5, riverY, w * 0.45, (h - horizonY) * 0.12, 0, 0, Math.PI * 2); ctx.fill();
    // River shimmer
    for (let rx = w * 0.15; rx < w * 0.85; rx += 18) {
      const ry2 = riverY + Math.sin(rx * 0.05 + t * 0.04) * 5;
      ctx.strokeStyle = 'rgba(147,197,253,0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(rx, ry2); ctx.lineTo(rx + 12, ry2 + 2); ctx.stroke();
    }

    // ── Elevated Metro Track ────────────────────────────────────────────────
    const trackY = h * 0.63; // Track sits between horizon and bottom
    const pillarH = h - trackY;

    // Pillars (fade into distance using parallax)
    const pillarSpacing = 90;
    const pillarOffset = (t * 1.5) % pillarSpacing;
    for (let i = -1; i < w / pillarSpacing + 2; i++) {
      const px = i * pillarSpacing - pillarOffset;
      ctx.fillStyle = '#1e1e2e';
      ctx.fillRect(px - 5, trackY + 8, 10, pillarH); // Pillar
      ctx.fillRect(px - 18, trackY + 6, 36, 8); // Capital
    }

    // Track bed
    ctx.fillStyle = '#2a2a3a';
    ctx.fillRect(0, trackY, w, 8);
    ctx.fillStyle = '#1a1a28';
    ctx.fillRect(0, trackY + 8, w, 4);

    // Rails (two parallel lines — silver)
    [trackY + 2, trackY + 9].forEach(ry => {
      ctx.beginPath();
      const railG = ctx.createLinearGradient(0, ry, w, ry + 1);
      railG.addColorStop(0, '#64748b'); railG.addColorStop(0.5, '#94a3b8'); railG.addColorStop(1, '#64748b');
      ctx.strokeStyle = railG; ctx.lineWidth = 2;
      ctx.moveTo(0, ry); ctx.lineTo(w, ry); ctx.stroke();
    });

    // ── Metro Train (small, distant, running fast) ──────────────────────────
    const TRAIN_SPEED = 1.8;
    trainX.current = (trainX.current + TRAIN_SPEED) % (w + 260);
    const tx = trainX.current - 130; // centered, moves left → right

    const trainW = 180; // Train appears small (distant)
    const trainH = 24;
    const tBase = trackY - trainH;

    // Motion blur trail behind train
    const trailGrad = ctx.createLinearGradient(tx - 60, 0, tx, 0);
    trailGrad.addColorStop(0, 'transparent');
    trailGrad.addColorStop(1, 'rgba(100,120,200,0.25)');
    ctx.fillStyle = trailGrad;
    ctx.fillRect(tx - 60, tBase, 60, trainH);

    // Train body
    const trainBodyGrad = ctx.createLinearGradient(tx, tBase, tx, tBase + trainH);
    trainBodyGrad.addColorStop(0, '#e2e8f0');
    trainBodyGrad.addColorStop(0.5, '#cbd5e1');
    trainBodyGrad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = trainBodyGrad;
    ctx.beginPath();
    ctx.roundRect?.(tx, tBase, trainW, trainH, 4);
    ctx.fill?.();

    // Blue accent stripe
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(tx, tBase + trainH * 0.72, trainW, trainH * 0.12);

    // Windows (small rectangles, lit up warmly)
    const winColors = ['#fde68a', '#fef3c7', '#fde68a'];
    for (let wi = 0; wi < 6; wi++) {
      const wx2 = tx + 12 + wi * 28;
      ctx.fillStyle = winColors[wi % 3];
      ctx.globalAlpha = 0.85;
      ctx.fillRect(wx2, tBase + 4, 16, trainH * 0.5);
    }
    ctx.globalAlpha = 1;

    // Train nose/front
    ctx.fillStyle = '#1e40af';
    ctx.beginPath();
    ctx.moveTo(tx + trainW, tBase);
    ctx.lineTo(tx + trainW + 14, tBase + trainH * 0.5);
    ctx.lineTo(tx + trainW, tBase + trainH);
    ctx.closePath(); ctx.fill();

    // Headlight glow
    const hlGlow = ctx.createRadialGradient(tx + trainW + 12, tBase + trainH / 2, 0, tx + trainW + 12, tBase + trainH / 2, 40);
    hlGlow.addColorStop(0, 'rgba(255,245,200,0.7)'); hlGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = hlGlow;
    ctx.beginPath(); ctx.arc(tx + trainW + 12, tBase + trainH / 2, 40, 0, Math.PI * 2); ctx.fill();

    // Pantograph (electric pickup arm)
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tx + trainW * 0.3, tBase);
    ctx.lineTo(tx + trainW * 0.3 + 8, tBase - 14);
    ctx.lineTo(tx + trainW * 0.5 + 8, tBase - 14); ctx.stroke();

    // Electric spark on overhead wire
    if (Math.sin(t * 0.5) > 0.7) {
      ctx.fillStyle = '#60a5fa';
      ctx.shadowColor = '#3b82f6'; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(tx + trainW * 0.5 + 8, tBase - 14, 3, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }

    // ── Overhead wire ───────────────────────────────────────────────────────
    ctx.strokeStyle = 'rgba(100,116,139,0.4)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, trackY - 14); ctx.lineTo(w, trackY - 14); ctx.stroke();
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};


// ─── 44. BIKE RIDE POV (friends night ride) ───────────────────────────────────
export const BikeRidePOV = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    // Night road
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h);
    // Sky with stars
    for (let i = 0; i < 50; i++) { const sx = (Math.sin(i * 89) * 0.5 + 0.5) * w, sy = (Math.cos(i * 137) * 0.5 + 0.5) * h * 0.4; ctx.beginPath(); ctx.arc(sx, sy, 0.7, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill(); }
    // Street lights
    for (let i = 0; i < 5; i++) {
      const lx = ((i * w * 0.25 - t * 3) % (w * 1.3) + w * 1.3) % (w * 1.3) - w * 0.1;
      // Pole
      ctx.fillStyle = '#475569'; ctx.fillRect(lx - 3, h * 0.3, 6, h * 0.45);
      // Light cone
      const lg = ctx.createRadialGradient(lx, h * 0.3, 0, lx, h * 0.55, 120);
      lg.addColorStop(0, 'rgba(255,220,100,0.6)'); lg.addColorStop(1, 'transparent');
      ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(lx, h * 0.3, 120, 0, Math.PI * 2); ctx.fill();
    }
    // Road surface
    const roadGrad = ctx.createLinearGradient(0, h * 0.5, 0, h);
    roadGrad.addColorStop(0, '#1e293b'); roadGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = roadGrad; ctx.fillRect(0, h * 0.5, w, h * 0.5);
    // Road lines
    const laneOffset = (t * 8) % 120;
    for (let i = -1; i < w / 120 + 2; i++) {
      const lx = i * 120 + laneOffset;
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(lx, h * 0.72, 60, 6);
    }
    // Headlight cone from camera
    const hcg = ctx.createRadialGradient(w / 2, h * 0.6, 0, w / 2, h, 300);
    hcg.addColorStop(0, 'rgba(255,245,200,0.4)'); hcg.addColorStop(1, 'transparent');
    ctx.fillStyle = hcg; ctx.beginPath(); ctx.arc(w / 2, h, 300, 0, Math.PI * 2); ctx.fill();
    // Handlebars
    ctx.fillStyle = '#334155'; ctx.fillRect(w / 2 - 80, h * 0.88, 160, 8);
    ctx.beginPath(); ctx.arc(w / 2 - 75, h * 0.88, 10, 0, Math.PI * 2); ctx.fillStyle = '#1e293b'; ctx.fill();
    ctx.beginPath(); ctx.arc(w / 2 + 75, h * 0.88, 10, 0, Math.PI * 2); ctx.fill();
    // Friend bikes ahead
    [[0.3, 0.58], [0.5, 0.54], [0.7, 0.58]].forEach(([bx, by], i) => {
      const size = 0.045 - i * 0.005;
      ctx.fillStyle = `rgba(100,116,139,${0.7 - i * 0.1})`;
      // Rider silhouette
      ctx.beginPath(); ctx.arc(bx * w, by * h - h * size * 0.8, h * size * 0.35, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(bx * w - h * size * 0.2, by * h - h * size * 0.5, h * size * 0.4, h * size * 0.6);
      // Tail light
      ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(bx * w, by * h + h * size * 0.1, 5, 0, Math.PI * 2); ctx.fillStyle = '#ef4444'; ctx.fill();
      ctx.shadowBlur = 0;
    });
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 45. HIGHWAY SUNSET ──────────────────────────────────────────────────────
export const HighwaySunset = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    // Sunset sky
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.6);
    sky.addColorStop(0, '#1e1b4b'); sky.addColorStop(0.3, '#7c3aed'); sky.addColorStop(0.6, '#f97316'); sky.addColorStop(1, '#fbbf24');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.65);
    // Sun
    const sunG = ctx.createRadialGradient(w / 2, h * 0.62, 0, w / 2, h * 0.62, 90);
    sunG.addColorStop(0, '#fff7ed'); sunG.addColorStop(0.3, '#fbbf24'); sunG.addColorStop(1, 'transparent');
    ctx.fillStyle = sunG; ctx.beginPath(); ctx.arc(w / 2, h * 0.62, 90, 0, Math.PI * 2); ctx.fill();
    // Road (perspective)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(w, h); ctx.lineTo(w * 0.7, h * 0.6); ctx.lineTo(w * 0.3, h * 0.6); ctx.closePath(); ctx.fill();
    // Road lines
    const dashOff = (t * 6) % 80;
    [0.45, 0.55].forEach(lx => {
      for (let i = -1; i < 10; i++) {
        const prog = i / 9;
        const x = w * 0.3 + (w * 0.4) * lx + prog * (w * (lx - 0.5) * 0.65);
        const y = h * 0.6 + (h * 0.4) * Math.pow(prog, 0.7) + dashOff * prog;
        const lineH = 30 * prog;
        ctx.fillStyle = '#fbbf24'; ctx.fillRect(x - 2, y, 4, lineH);
      }
    });
    // Silhouette landscape
    ctx.beginPath(); ctx.moveTo(0, h * 0.63);
    for (let x = 0; x <= w; x += 20) ctx.lineTo(x, h * 0.63 + Math.sin(x * 0.004) * 25 - Math.cos(x * 0.007) * 15);
    ctx.lineTo(w, h * 0.7); ctx.lineTo(0, h * 0.7); ctx.closePath();
    ctx.fillStyle = '#0a0a1a'; ctx.fill();
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 46. AUTO RICKSHAW (bridge with autos) ────────────────────────────────────
export const AutoRickshaw = () => {
  interface Auto { x: number; speed: number; lane: number; }
  const autos = useRef<Auto[]>([]);
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.5);
    sky.addColorStop(0, '#fde68a'); sky.addColorStop(1, '#fb923c');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.5);
    // River under bridge
    const river = ctx.createLinearGradient(0, h * 0.5, 0, h);
    river.addColorStop(0, '#38bdf8'); river.addColorStop(1, '#0891b2');
    ctx.fillStyle = river; ctx.fillRect(0, h * 0.5, w, h * 0.5);
    // Water shimmer
    for (let x = 0; x < w; x += 45) {
      const sy = h * 0.55 + Math.sin(x * 0.05 + t * 0.05) * 6;
      ctx.beginPath(); ctx.moveTo(x, sy); ctx.lineTo(x + 30, sy + 3);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2; ctx.stroke();
    }
    // Bridge structure
    ctx.fillStyle = '#78716c'; ctx.fillRect(0, h * 0.48, w, 22); // road deck
    ctx.fillStyle = '#92400e'; ctx.fillRect(0, h * 0.46, w, 6); // guardrail top
    // Bridge cables / arches
    [0.2, 0.5, 0.8].forEach(px => {
      const pillarX = px * w;
      ctx.fillStyle = '#78716c'; ctx.fillRect(pillarX - 10, h * 0.38, 20, h * 0.12);
      ctx.beginPath(); ctx.moveTo(pillarX, h * 0.38); ctx.quadraticCurveTo(pillarX - 100, h * 0.3, pillarX - 200, h * 0.46);
      ctx.strokeStyle = '#a8a29e'; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pillarX, h * 0.38); ctx.quadraticCurveTo(pillarX + 100, h * 0.3, pillarX + 200, h * 0.46);
      ctx.stroke();
    });
    // Road surface on bridge
    ctx.fillStyle = '#475569'; ctx.fillRect(0, h * 0.46, w, 26);
    // Spawn autos
    if (autos.current.length < 8 && Math.random() < 0.04) {
      autos.current.push({ x: -80, speed: Math.random() * 2 + 1.5, lane: Math.random() > 0.4 ? 0 : 1 });
    }
    autos.current = autos.current.filter(a => a.x < w + 100);
    autos.current.forEach(a => {
      a.x += a.speed;
      const ay = h * 0.465 - (a.lane === 1 ? 18 : 0);
      // Auto rickshaw body (yellow/green)
      ctx.fillStyle = a.lane === 0 ? '#fbbf24' : '#22c55e';
      ctx.beginPath();
      ctx.roundRect?.(a.x - 28, ay - 22, 58, 22, 4);
      ctx.fill?.();
      // Roof canopy
      ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(a.x - 26, ay - 30, 52, 10);
      // Wheels
      [a.x - 18, a.x + 18].forEach(wx => {
        ctx.beginPath(); ctx.arc(wx, ay, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#1e293b'; ctx.fill();
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5; ctx.stroke();
      });
      // Headlight
      ctx.beginPath(); ctx.arc(a.x + 30, ay - 12, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fef9c3'; ctx.fill();
    });
    // People visible on roadside / station markers
    [[0.08, 0.43], [0.92, 0.43]].forEach(([px, py]) => {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath(); ctx.arc(px * w, py * h, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(px * w - 6, py * h, 12, 25);
    });
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 47. PLANE TAKEOFF (airport morning) ─────────────────────────────────────
interface Plane { x: number; y: number; vx: number; vy: number; size: number; phase: string; }
export const PlaneTakeoff = () => {
  const planes = useRef<Plane[]>([]);
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    // Morning sky
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.65);
    sky.addColorStop(0, '#1e3a5f'); sky.addColorStop(0.4, '#3b82f6'); sky.addColorStop(0.7, '#fbbf24'); sky.addColorStop(1, '#fb923c');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.65);
    // Sun rising
    const sunG = ctx.createRadialGradient(w * 0.5, h * 0.62, 0, w * 0.5, h * 0.62, 110);
    sunG.addColorStop(0, 'rgba(255,255,200,0.95)'); sunG.addColorStop(0.4, 'rgba(251,191,36,0.7)'); sunG.addColorStop(1, 'transparent');
    ctx.fillStyle = sunG; ctx.beginPath(); ctx.arc(w * 0.5, h * 0.62, 110, 0, Math.PI * 2); ctx.fill();
    // Airport ground
    ctx.fillStyle = '#374151'; ctx.fillRect(0, h * 0.6, w, h * 0.4);
    // Runway
    ctx.fillStyle = '#1f2937'; ctx.fillRect(w * 0.1, h * 0.62, w * 0.8, h * 0.08);
    // Runway markings
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(w * 0.12 + i * w * 0.095, h * 0.655, w * 0.04, 4);
    }
    // Terminal building silhouette
    ctx.fillStyle = '#1e293b'; ctx.fillRect(0, h * 0.35, w * 0.18, h * 0.27);
    ctx.fillRect(w * 0.82, h * 0.4, w * 0.18, h * 0.22);
    // Control tower
    ctx.fillRect(w * 0.05, h * 0.2, 18, h * 0.42); ctx.fillRect(w * 0.03, h * 0.2, 54, 18);
    // Spawn planes
    if (planes.current.length < 5 && Math.random() < 0.015) {
      planes.current.push({ x: w * 0.15, y: h * 0.66, vx: 2.5, vy: -0.6, size: 0.07, phase: 'rolling' });
    }
    // Update planes
    planes.current = planes.current.filter(p => p.x < w + 200 && p.y > -100);
    planes.current.forEach(p => {
      if (p.phase === 'rolling' && p.x > w * 0.45) p.phase = 'takeoff';
      if (p.phase === 'takeoff') p.vy -= 0.04;
      p.x += p.vx; p.y += p.vy;
      // Draw plane
      const pw = w * p.size;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.vy, p.vx));
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath(); ctx.ellipse(0, 0, pw / 2, pw * 0.14, 0, 0, Math.PI * 2); ctx.fill();
      // Wings
      ctx.beginPath(); ctx.moveTo(pw * 0.05, 0); ctx.lineTo(-pw * 0.1, -pw * 0.35); ctx.lineTo(-pw * 0.25, 0); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(pw * 0.05, 0); ctx.lineTo(-pw * 0.1, pw * 0.35); ctx.lineTo(-pw * 0.25, 0); ctx.closePath(); ctx.fill();
      // Engines
      [-pw * 0.18, pw * 0.18].forEach(ey => {
        ctx.beginPath(); ctx.ellipse(-pw * 0.1, ey, pw * 0.12, pw * 0.05, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#94a3b8'; ctx.fill();
      });
      ctx.restore();
      // Engine exhaust trail
      if (p.phase === 'takeoff') {
        const tg = ctx.createLinearGradient(p.x - 40, p.y, p.x - 120, p.y);
        tg.addColorStop(0, 'rgba(255,255,255,0.3)'); tg.addColorStop(1, 'transparent');
        ctx.fillStyle = tg; ctx.fillRect(p.x - 120, p.y - 6, 80, 12);
      }
    });
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 48. NEON TAXI (cyberpunk city) ──────────────────────────────────────────
interface NTaxi { x: number; y: number; speed: number; type: 'car' | 'bike' | 'auto'; }
export const NeonTaxi = () => {
  const vehicles = useRef<NTaxi[]>([]);
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, w, h);
    // Skyscrapers with neon signs
    const buildings = [
      { x: 0, w: 120, h: 0.75, c: '#0f172a' }, { x: 110, w: 90, h: 0.65, c: '#111827' },
      { x: 190, w: 140, h: 0.8, c: '#0c1445' }, { x: 320, w: 80, h: 0.6, c: '#0f172a' },
      { x: 520, w: 160, h: 0.85, c: '#111827' }, { x: 670, w: 100, h: 0.7, c: '#0c1445' },
      { x: 760, w: 130, h: 0.78, c: '#0f172a' }, { x: 880, w: 90, h: 0.62, c: '#111827' },
    ];
    buildings.forEach(b => {
      ctx.fillStyle = b.c; ctx.fillRect(b.x, h * (1 - b.h), b.w, h * b.h);
      // Windows
      for (let wx = b.x + 12; wx < b.x + b.w - 12; wx += 22) {
        for (let wy = h * (1 - b.h) + 18; wy < h * 0.7; wy += 25) {
          if (Math.sin(wx * 0.3 + wy * 0.2 + t * 0.01) > 0) { ctx.fillStyle = 'rgba(251,191,36,0.4)'; ctx.fillRect(wx, wy, 12, 16); }
        }
      }
    });
    // Neon sign glows
    [['#f43f5e', 250, 0.22], ['#22d3ee', 550, 0.18], ['#f97316', 800, 0.25], ['#a78bfa', 150, 0.35]].forEach(([c, x, y]) => {
      const ng = ctx.createRadialGradient(+x, h * +y, 0, +x, h * +y, 60);
      ng.addColorStop(0, c + '88'); ng.addColorStop(1, 'transparent');
      ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(+x, h * +y, 60, 0, Math.PI * 2); ctx.fill();
    });
    // Wet road reflection
    ctx.fillStyle = 'rgba(14,20,40,0.6)'; ctx.fillRect(0, h * 0.72, w, h * 0.28);
    for (let rx = 0; rx < w; rx += 55) {
      const reflect = ctx.createLinearGradient(rx, h * 0.72, rx, h);
      reflect.addColorStop(0, `hsl(${t % 360 + rx * 0.2},70%,40%)`); reflect.addColorStop(1, 'transparent');
      ctx.fillStyle = reflect; ctx.globalAlpha = 0.12; ctx.fillRect(rx, h * 0.72, 30, h * 0.28);
    }
    ctx.globalAlpha = 1;
    // Road
    ctx.fillStyle = '#0a0f1a'; ctx.fillRect(0, h * 0.74, w, h * 0.26);
    // Spawn vehicles
    if (vehicles.current.length < 10 && Math.random() < 0.06) {
      const types: ('car' | 'bike' | 'auto')[] = ['car', 'bike', 'auto'];
      vehicles.current.push({ x: -100, y: h * (0.76 + Math.random() * 0.15), speed: Math.random() * 2 + 1.5, type: types[Math.floor(Math.random() * 3)] });
    }
    vehicles.current = vehicles.current.filter(v => v.x < w + 120);
    vehicles.current.forEach(v => {
      v.x += v.speed;
      const vx = v.x, vy = v.y;
      const taxiColor = '#f59e0b';
      if (v.type === 'car') {
        ctx.fillStyle = taxiColor; ctx.fillRect(vx - 35, vy - 22, 70, 22);
        ctx.fillStyle = 'rgba(147,197,253,0.5)'; ctx.fillRect(vx - 25, vy - 36, 50, 16);
        // Headlights
        const hl = ctx.createRadialGradient(vx + 35, vy - 10, 0, vx + 35, vy - 10, 50);
        hl.addColorStop(0, 'rgba(255,255,200,0.8)'); hl.addColorStop(1, 'transparent');
        ctx.fillStyle = hl; ctx.beginPath(); ctx.arc(vx + 35, vy - 10, 50, 0, Math.PI * 2); ctx.fill();
        // Person getting in
        if (Math.abs(vx - w * 0.5) < 60) {
          ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(vx + 45, vy - 28, 9, 0, Math.PI * 2); ctx.fill();
          ctx.fillRect(vx + 40, vy - 20, 10, 20);
        }
      } else if (v.type === 'bike') {
        ctx.fillStyle = '#22d3ee'; ctx.fillRect(vx - 18, vy - 18, 36, 12);
        [vx - 12, vx + 12].forEach(wx2 => { ctx.beginPath(); ctx.arc(wx2, vy, 8, 0, Math.PI * 2); ctx.fillStyle = '#1e293b'; ctx.fill(); });
      } else {
        ctx.fillStyle = '#22c55e'; ctx.fillRect(vx - 20, vy - 20, 40, 18); ctx.fillRect(vx - 22, vy - 10, 44, 10);
        [vx - 15, vx + 15].forEach(wx2 => { ctx.beginPath(); ctx.arc(wx2, vy, 7, 0, Math.PI * 2); ctx.fillStyle = '#1e293b'; ctx.fill(); });
      }
    });
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 49. TERRACE FRIENDS ─────────────────────────────────────────────────────
export const TerraceF = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    // Twilight sky
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.65);
    sky.addColorStop(0, '#020617'); sky.addColorStop(0.4, '#1e1b4b'); sky.addColorStop(1, '#312e81');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.65);
    // City skyline
    [[0,0.55,70],[0.08,0.6,90],[0.17,0.5,80],[0.28,0.65,65],[0.38,0.52,95],[0.50,0.7,60],[0.62,0.48,105],[0.74,0.6,75],[0.84,0.55,85],[0.93,0.65,55]].forEach(([bx,bh,bw]) => {
      ctx.fillStyle = '#0f172a'; ctx.fillRect(+bx*w, h*+bh, +bw, h*(1-+bh));
      for(let wxi=+bx*w+8;wxi<+bx*w+ +bw-8;wxi+=16) for(let wyi=h*+bh+10;wyi<h*0.85;wyi+=20) { if(Math.sin(wxi*0.2+wyi*0.15)>0.2) {ctx.fillStyle='rgba(251,191,36,0.35)';ctx.fillRect(wxi,wyi,8,10);} }
    });
    // Terrace floor
    ctx.fillStyle = '#1e293b'; ctx.fillRect(0, h * 0.72, w, h * 0.28);
    ctx.fillStyle = '#334155'; ctx.fillRect(0, h * 0.72, w, 6);
    // String lights
    const flickerOffset = Math.sin(t * 0.08) * 0.05;
    for (let lx = 0; lx < w; lx += 55) {
      const hung = h * 0.55 + Math.sin(lx * 0.05) * 30;
      ctx.beginPath(); ctx.arc(lx, hung, 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(251,191,36,${0.85 + flickerOffset})`; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 16; ctx.fill(); ctx.shadowBlur = 0;
    }
    // String wire
    ctx.beginPath(); for (let lx = 0; lx <= w; lx += 4) ctx.lineTo(lx, h * 0.55 + Math.sin(lx * 0.05) * 30);
    ctx.strokeStyle = 'rgba(71,85,105,0.5)'; ctx.lineWidth = 1.5; ctx.stroke();
    // Friends (6 people) sitting in group
    const positions = [0.1, 0.22, 0.34, 0.52, 0.66, 0.8, 0.9];
    positions.forEach((px, i) => {
      const py = h * 0.76;
      const wobble = Math.sin(t * 0.015 + i) * 3;
      // Body
      ctx.fillStyle = ['#818cf8','#f472b6','#22d3ee','#86efac','#fbbf24','#a78bfa','#fb923c'][i % 7];
      ctx.fillRect(px * w - 12, py + wobble, 24, 28);
      ctx.beginPath(); ctx.arc(px * w, py - 14 + wobble, 14, 0, Math.PI * 2); ctx.fill();
    });
    // Plants / decorative items
    [[0.04, 0.72], [0.97, 0.72]].forEach(([px, py]) => {
      ctx.fillStyle = '#15803d'; ctx.beginPath(); ctx.arc(px * w, py * h - 20, 20, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#166534'; ctx.fillRect(px * w - 5, py * h - 5, 10, 28);
    });
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 50. ROAD TRIP FRIENDS (desert/snow/forest regions) ─────────────────────
export const RoadTripFriends = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    // Cycle through 3 terrain regions
    const region = Math.floor((t * 0.005) % 3);
    const transition = (t * 0.005) % 1;
    // Background per region
    if (region === 0) {
      // Desert
      const dg = ctx.createLinearGradient(0, 0, 0, h);
      dg.addColorStop(0, '#fbbf24'); dg.addColorStop(0.5, '#fb923c'); dg.addColorStop(1, '#d97706');
      ctx.fillStyle = dg; ctx.fillRect(0, 0, w, h);
      // Sand dunes
      ctx.beginPath(); ctx.moveTo(0, h * 0.6);
      for (let x = 0; x <= w; x += 20) ctx.lineTo(x, h * 0.6 + Math.sin(x * 0.01 - t * 0.02) * 40);
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fillStyle = '#d97706'; ctx.fill();
      // Cactus
      ctx.fillStyle = '#166534'; ctx.fillRect(w * 0.75, h * 0.35, 12, h * 0.3);
      ctx.fillRect(w * 0.72, h * 0.42, 15, 8); ctx.fillRect(w * 0.78, h * 0.48, 15, 8);
    } else if (region === 1) {
      // Snow
      const sg = ctx.createLinearGradient(0, 0, 0, h); sg.addColorStop(0, '#dbeafe'); sg.addColorStop(1, '#f0f9ff'); ctx.fillStyle = sg; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#f1f5f9'; ctx.fillRect(0, h * 0.55, w, h * 0.45);
      // Snowfall
      for (let i = 0; i < 40; i++) { const sx = (Math.sin(i * 127 + t * 0.03) * 0.5 + 0.5) * w, sy = (Math.cos(i * 311 + t * 0.04) * 0.5 + 0.5) * h; ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fill(); }
      // Snowy mountains
      [[0.1, 0.35], [0.3, 0.25], [0.5, 0.3], [0.7, 0.22], [0.9, 0.32]].forEach(([mx, my]) => { ctx.beginPath(); ctx.moveTo(mx * w - 80, h * 0.6); ctx.lineTo(mx * w, my * h); ctx.lineTo(mx * w + 80, h * 0.6); ctx.closePath(); ctx.fillStyle = '#94a3b8'; ctx.fill(); ctx.beginPath(); ctx.moveTo(mx * w - 30, my * h + 20); ctx.lineTo(mx * w, my * h); ctx.lineTo(mx * w + 30, my * h + 20); ctx.closePath(); ctx.fillStyle = '#f8fafc'; ctx.fill(); });
    } else {
      // Forest
      const fg = ctx.createLinearGradient(0, 0, 0, h); fg.addColorStop(0, '#052e16'); fg.addColorStop(1, '#14532d'); ctx.fillStyle = fg; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 15; i++) { const tx = (i / 14) * w; ctx.beginPath(); ctx.moveTo(tx, h * 0.65); ctx.lineTo(tx - 30, h * 0.32); ctx.lineTo(tx + 30, h * 0.32); ctx.closePath(); ctx.fillStyle = '#166534'; ctx.fill(); ctx.beginPath(); ctx.moveTo(tx, h * 0.52); ctx.lineTo(tx - 22, h * 0.28); ctx.lineTo(tx + 22, h * 0.28); ctx.closePath(); ctx.fillStyle = '#15803d'; ctx.fill(); }
    }
    // Person with backpack (traveler)
    const walkerX = w * 0.45 + Math.sin(t * 0.015) * 8;
    const walkerY = h * 0.62;
    const legSwing = Math.sin(t * 0.12) * 18;
    ctx.fillStyle = '#1e293b';
    // Legs
    ctx.beginPath(); ctx.moveTo(walkerX, walkerY + 20); ctx.lineTo(walkerX - 10 + legSwing, walkerY + 55); ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 6; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(walkerX, walkerY + 20); ctx.lineTo(walkerX + 10 - legSwing, walkerY + 55); ctx.stroke();
    // Body
    ctx.fillRect(walkerX - 12, walkerY - 10, 24, 32);
    // Head
    ctx.beginPath(); ctx.arc(walkerX, walkerY - 22, 16, 0, Math.PI * 2); ctx.fill();
    // Backpack
    ctx.fillStyle = '#7c3aed'; ctx.fillRect(walkerX - 22, walkerY - 5, 12, 28);
    // Stick
    ctx.beginPath(); ctx.moveTo(walkerX + 14, walkerY - 5); ctx.lineTo(walkerX + 22, walkerY + 58); ctx.strokeStyle = '#92400e'; ctx.lineWidth = 3; ctx.stroke();
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};
