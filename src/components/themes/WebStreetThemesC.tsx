import React, { useRef } from 'react';
import { useCanvas } from './WebSpaceThemes';

// ─── 61. STREET MUSICIAN ──────────────────────────────────────────────────────
export const StreetMusician = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#09090b'; ctx.fillRect(0, 0, w, h);
    // Grungy brick wall
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < w / 50 + 1; col++) {
        const bx = col * 50 + (row % 2 === 0 ? 0 : 25), by = row * 40;
        ctx.fillStyle = row % 2 === 0 ? '#1c0a00' : '#0d0600';
        ctx.fillRect(bx, by, 48, 38);
        ctx.strokeStyle = '#050200'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, 48, 38);
      }
    }
    // Street lamp glow (single overhead)
    const lampX = w * 0.5, lampY = h * 0.06;
    ctx.fillStyle = '#475569'; ctx.fillRect(lampX - 3, lampY, 6, h * 0.22);
    ctx.fillRect(lampX - 30, lampY, 65, 10);
    const lampG = ctx.createRadialGradient(lampX, lampY + 10, 0, lampX, lampY + 10, 200);
    lampG.addColorStop(0, 'rgba(251,191,36,0.7)'); lampG.addColorStop(0.5, 'rgba(251,191,36,0.2)'); lampG.addColorStop(1, 'transparent');
    ctx.fillStyle = lampG; ctx.beginPath(); ctx.arc(lampX, lampY + 10, 200, 0, Math.PI * 2); ctx.fill();
    // Steam from manhole
    for (let si = 0; si < 5; si++) {
      const sy2 = h * 0.9 - ((t * 0.6 + si * 18) % 90);
      ctx.beginPath(); ctx.moveTo(w * 0.3, h * 0.9); ctx.bezierCurveTo(w * 0.3 + 10, sy2 + 30, w * 0.3 - 10, sy2 + 10, w * 0.3, sy2);
      ctx.strokeStyle = `rgba(200,200,200,${0.35 - ((t * 0.6 + si * 18) % 90) / 250})`; ctx.lineWidth = 3; ctx.stroke();
    }
    // Crate seat
    ctx.fillStyle = '#78350f'; ctx.fillRect(w * 0.5 - 28, h * 0.72, 56, 32);
    ctx.strokeStyle = '#92400e'; ctx.lineWidth = 2; ctx.strokeRect(w * 0.5 - 28, h * 0.72, 56, 32);
    // Amp
    ctx.fillStyle = '#1e293b'; ctx.fillRect(w * 0.64, h * 0.68, 50, 40);
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5; ctx.strokeRect(w * 0.64, h * 0.68, 50, 40);
    ctx.beginPath(); ctx.arc(w * 0.64 + 25, h * 0.68 + 22, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#64748b'; ctx.fill();
    // Musician silhouette
    const mx = w * 0.5, my = h * 0.72;
    const strum = Math.sin(t * 0.12) * 6;
    ctx.fillStyle = '#1e293b';
    // Body
    ctx.fillRect(mx - 14, my - 38, 28, 40);
    // Head
    ctx.beginPath(); ctx.arc(mx, my - 50, 16, 0, Math.PI * 2); ctx.fill();
    // Guitar
    ctx.save(); ctx.translate(mx + 10, my - 20); ctx.rotate(strum * 0.04);
    ctx.fillStyle = '#92400e'; ctx.beginPath(); ctx.ellipse(0, 0, 18, 22, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#78350f'; ctx.fillRect(3, -40, 8, 42);
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 0.7;
    [-3,0,3,6].forEach(sx => { ctx.beginPath(); ctx.moveTo(sx, -40); ctx.lineTo(sx - strum * 0.2, 20); ctx.stroke(); });
    ctx.restore();
    // Guitar case with coins
    ctx.fillStyle = '#1c1917'; ctx.fillRect(mx - 35, h * 0.88, 70, 28);
    ctx.strokeStyle = '#44403c'; ctx.lineWidth = 2; ctx.strokeRect(mx - 35, h * 0.88, 70, 28);
    ctx.fillStyle = '#fbbf24'; ['#fbbf24','#22c55e','#ef4444'].forEach((c, i) => { ctx.beginPath(); ctx.arc(mx - 18 + i * 18, h * 0.9, 6, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill(); });
    // Music notes floating
    ['♩','♪','♫','♬'].forEach((note, i) => {
      const nx = mx + Math.sin(t * 0.06 + i) * 45;
      const ny = h * 0.55 + ((t * 0.6 + i * 22) % 80);
      ctx.fillStyle = `rgba(251,191,36,${0.7 - ((t * 0.6 + i * 22) % 80) / 110})`; ctx.font = `${18 + i * 3}px serif`; ctx.textAlign = 'center'; ctx.fillText(note, nx, ny);
    });
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 62. EMPTY NIGHT ROAD ─────────────────────────────────────────────────────
export const EmptyNightRoad = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    // Moonlit sky
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.55);
    sky.addColorStop(0, '#020617'); sky.addColorStop(1, '#0f172a');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.55);
    // Stars
    for (let i = 0; i < 90; i++) { const sx = (Math.sin(i * 89) * 0.5 + 0.5) * w, sy = (Math.cos(i * 137) * 0.5 + 0.5) * h * 0.52; ctx.beginPath(); ctx.arc(sx, sy, 0.8, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(i + t * 0.01) * 0.25})`; ctx.fill(); }
    // Full moon
    ctx.beginPath(); ctx.arc(w * 0.8, h * 0.12, 32, 0, Math.PI * 2); ctx.fillStyle = '#fef9c3'; ctx.fill();
    ctx.beginPath(); ctx.arc(w * 0.8 + 8, h * 0.12 - 5, 28, 0, Math.PI * 2); ctx.fillStyle = '#020617'; ctx.fill();
    // Road
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(w, h); ctx.lineTo(w * 0.7, h * 0.55); ctx.lineTo(w * 0.3, h * 0.55); ctx.closePath(); ctx.fill();
    // Road lanes
    const dashOff = (t * 4) % 80;
    for (let i = -1; i < 12; i++) {
      const prog = Math.pow(i / 10, 1.2);
      const lx = w / 2; const ly = h * 0.55 + (h * 0.45) * prog + dashOff * prog;
      const lw = 30 * prog; const lh = 22 * prog;
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(lx - lw / 2, ly, lw, lh);
    }
    // Fog drifting low
    for (let fi = 0; fi < 5; fi++) {
      const fx = (fi * w * 0.25 - t * 0.8 + w * 2) % (w * 2) - w * 0.4;
      const fg = ctx.createRadialGradient(fx, h * 0.72, 0, fx, h * 0.72, 180);
      fg.addColorStop(0, 'rgba(148,163,184,0.18)'); fg.addColorStop(1, 'transparent');
      ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(fx, h * 0.72, 180, 0, Math.PI * 2); ctx.fill();
    }
    // Roadside trees silhouette
    for (let side = 0; side < 2; side++) {
      const baseX = side === 0 ? 0 : w * 0.85;
      for (let ti = 0; ti < 5; ti++) {
        const tx = baseX + (side === 0 ? ti * w * 0.06 : -ti * w * 0.06);
        const ty = h * 0.5 + ti * h * 0.04;
        const sz = 18 + ti * 6;
        ctx.fillStyle = 'rgba(0,10,5,0.95)';
        ctx.fillRect(tx - 3, ty, 6, h * 0.3);
        ctx.beginPath(); ctx.arc(tx, ty, sz, 0, Math.PI * 2); ctx.fill();
      }
    }
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 63. DELIVERY RIDE (night biker with streetlights) ────────────────────────
export const DeliveryRide = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, w, h);
    // City skyline silhouette
    [[0,0.45,70],[0.1,0.38,90],[0.2,0.5,65],[0.3,0.34,110],[0.45,0.42,80],[0.57,0.36,100],[0.68,0.48,70],[0.78,0.39,85],[0.9,0.44,65]].forEach(([bx,bh,bw]) => { ctx.fillStyle = '#0f172a'; ctx.fillRect(+bx*w, h*+bh, +bw, h*(0.6-+bh)); });
    // Stars
    for (let i = 0; i < 60; i++) { const sx = (Math.sin(i * 89) * 0.5 + 0.5) * w, sy = (Math.cos(i * 137) * 0.5 + 0.5) * h * 0.4; ctx.beginPath(); ctx.arc(sx, sy, 0.7, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill(); }
    // Road
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, h * 0.6, w, h * 0.4);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(0, h * 0.72, w, h * 0.12);
    // Street lights (moving past - parallax)
    for (let i = 0; i < 6; i++) {
      const lx = ((i * w * 0.2 - t * 4) % (w * 1.2) + w * 1.2) % (w * 1.2) - 60;
      ctx.fillStyle = '#475569'; ctx.fillRect(lx - 3, h * 0.3, 6, h * 0.32);
      const coneG = ctx.createRadialGradient(lx, h * 0.3, 0, lx, h * 0.55, 110);
      coneG.addColorStop(0, 'rgba(251,191,36,0.65)'); coneG.addColorStop(1, 'transparent');
      ctx.fillStyle = coneG; ctx.beginPath(); ctx.arc(lx, h * 0.3, 110, 0, Math.PI * 2); ctx.fill();
    }
    // Road center lines
    const laneOff = (t * 6) % 100;
    for (let i = -1; i < w / 100 + 2; i++) { const lx = i * 100 + laneOff; ctx.fillStyle = '#fbbf24'; ctx.fillRect(lx, h * 0.775, 55, 5); }
    // Delivery bike (center of screen, slightly left)
    const bikeX = w * 0.42, bikeY = h * 0.74;
    const bikeLean = Math.sin(t * 0.025) * 4;
    ctx.save(); ctx.translate(bikeX, bikeY); ctx.rotate(bikeLean * 0.02);
    // Wheels
    [0, 1].forEach(wi => { ctx.beginPath(); ctx.arc(wi === 0 ? -32 : 32, 15, 18, 0, Math.PI * 2); ctx.strokeStyle = '#334155'; ctx.lineWidth = 5; ctx.stroke(); ctx.beginPath(); ctx.arc(wi === 0 ? -32 : 32, 15, 6, 0, Math.PI * 2); ctx.fillStyle = '#475569'; ctx.fill(); });
    // Frame
    ctx.beginPath(); ctx.moveTo(-32, -5); ctx.lineTo(0, -22); ctx.lineTo(32, -5);
    ctx.moveTo(0, -22); ctx.lineTo(0, 15);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4; ctx.stroke();
    // Rider body
    ctx.fillStyle = '#334155'; ctx.fillRect(-16, -50, 32, 28);
    ctx.beginPath(); ctx.arc(0, -58, 14, 0, Math.PI * 2); ctx.fillStyle = '#1e293b'; ctx.fill();
    // Helmet
    ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.arc(0, -60, 14, Math.PI, 0); ctx.fill();
    // Delivery box on back
    ctx.fillStyle = '#f97316'; ctx.fillRect(16, -48, 36, 30);
    ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 1.5; ctx.strokeRect(16, -48, 36, 30);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('FOOD', 34, -30);
    // Headlight beam
    const hbg = ctx.createRadialGradient(45, -15, 0, 120, -15, 100);
    hbg.addColorStop(0, 'rgba(255,250,200,0.8)'); hbg.addColorStop(1, 'transparent');
    ctx.fillStyle = hbg; ctx.beginPath(); ctx.arc(120, -15, 100, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // Speed blur
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 5; i++) { ctx.fillStyle = '#60a5fa'; ctx.fillRect(0, h * (0.7 + i * 0.02), w, 2); }
    ctx.globalAlpha = 1;
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 64. STREET DOGS ──────────────────────────────────────────────────────────
export const StreetDogs = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#1c1917'; ctx.fillRect(0, 0, w, h);
    // Alley floor
    ctx.fillStyle = '#292524'; ctx.fillRect(0, h * 0.6, w, h * 0.4);
    // Brick walls
    for (let row = 0; row < 14; row++) for (let col = 0; col < w / 55 + 1; col++) {
      const bx = col * 55 + (row % 2 ? 27 : 0), by = row * 38;
      ctx.fillStyle = row % 2 ? '#211711' : '#1a100c'; ctx.fillRect(bx, by, 53, 36); ctx.strokeStyle = '#0d0700'; ctx.lineWidth = 1; ctx.strokeRect(bx, by, 53, 36);
    }
    // Distant window warm light
    ctx.fillStyle = 'rgba(251,191,36,0.25)'; ctx.fillRect(w * 0.7, h * 0.15, 55, 38);
    ctx.fillStyle = 'rgba(251,191,36,0.1)'; ctx.fillRect(w * 0.7, h * 0.15, 55, h * 0.47);
    // Blanket/cardboard pile
    ctx.fillStyle = '#44403c'; ctx.fillRect(w * 0.15, h * 0.67, w * 0.6, 22);
    ctx.fillStyle = '#78716c'; ctx.fillRect(w * 0.2, h * 0.65, w * 0.5, 14);
    // 3 sleeping dogs
    [[0.25],[0.45],[0.65]].forEach(([dx], i) => {
      const dy = h * 0.7; const breathe = Math.sin(t * 0.025 + i * 1.5) * 3;
      ctx.fillStyle = ['#92400e','#78350f','#d97706'][i];
      // Body
      ctx.beginPath(); ctx.ellipse(dx * w, dy + breathe, 35, 16, 0, 0, Math.PI * 2); ctx.fill();
      // Head
      ctx.beginPath(); ctx.arc(dx * w + (i % 2 ? 30 : -30), dy - 5 + breathe, 14, 0, Math.PI * 2);
      ctx.fillStyle = ['#92400e','#78350f','#d97706'][i]; ctx.fill();
      // Ear
      ctx.beginPath(); ctx.arc(dx * w + (i % 2 ? 38 : -38), dy - 12 + breathe, 7, 0, Math.PI * 2);
      ctx.fillStyle = ['#7c2d12','#6b2110','#b45309'][i]; ctx.fill();
      // Eye blink
      if (i === 1 && Math.sin(t * 0.04) > 0.95) {
        ctx.beginPath(); ctx.arc(dx * w + 35, dy - 5 + breathe, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24'; ctx.fill();
      }
      // Tail
      ctx.beginPath(); ctx.moveTo(dx * w + (i % 2 ? -33 : 33), dy + breathe);
      ctx.quadraticCurveTo(dx * w + (i % 2 ? -50 : 50), dy - 14 + breathe + Math.sin(t * 0.04 + i) * 5, dx * w + (i % 2 ? -45 : 45), dy - 8 + breathe);
      ctx.strokeStyle = ['#92400e','#78350f','#d97706'][i]; ctx.lineWidth = 4; ctx.stroke();
    });
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 65. WINDOW THINKING (person + house + night sky) ─────────────────────────
export const WindowThinking = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    // Night sky (formerly through window)
    const skyG = ctx.createLinearGradient(0, 0, 0, h * 0.85);
    skyG.addColorStop(0, '#020617'); skyG.addColorStop(1, '#0f172a');
    ctx.fillStyle = skyG; ctx.fillRect(0, 0, w, h);
    // Stars
    for (let i = 0; i < 90; i++) {
      const sx = (Math.sin(i * 89) * 0.5 + 0.5) * w;
      const sy = (Math.cos(i * 137) * 0.5 + 0.5) * h * 0.8;
      ctx.beginPath(); ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(i + t * 0.01) * 0.3})`; ctx.fill();
    }
    // Moon
    ctx.beginPath(); ctx.arc(w * 0.8, h * 0.15, 32, 0, Math.PI * 2); ctx.fillStyle = '#fef9c3'; ctx.fill();
    // Hills / Distant ground
    ctx.fillStyle = '#0a0f1a';
    ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(0, h * 0.8); ctx.quadraticCurveTo(w * 0.5, h * 0.7, w, h * 0.85); ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
    // Small house outside
    const hx = w * 0.7, hy = h * 0.75;
    ctx.fillStyle = '#1e293b'; ctx.fillRect(hx, hy, 100, 75);
    ctx.beginPath(); ctx.moveTo(hx - 10, hy); ctx.lineTo(hx + 50, hy - 45); ctx.lineTo(hx + 110, hy); ctx.closePath();
    ctx.fillStyle = '#334155'; ctx.fill();
    // House warm window
    ctx.fillStyle = 'rgba(251,191,36,0.5)'; ctx.fillRect(hx + 22, hy + 20, 28, 28);
    const hwG = ctx.createRadialGradient(hx + 36, hy + 34, 0, hx + 36, hy + 80, 70);
    hwG.addColorStop(0, 'rgba(251,191,36,0.25)'); hwG.addColorStop(1, 'transparent');
    ctx.fillStyle = hwG; ctx.fillRect(hx, hy, 100, 100);
    // Rain on glass full screen
    ctx.fillStyle = 'rgba(147,197,253,0.04)'; ctx.fillRect(0, 0, w, h);
    for (let ri = 0; ri < 50; ri++) {
      const rx = (Math.sin(ri * 37) * 0.5 + 0.5) * w;
      const ry = ((ri * 41 + t * 1.2) % h);
      const rLen = 30 + Math.sin(ri) * 20;
      const rg = ctx.createLinearGradient(rx, ry, rx + 2, ry + rLen);
      rg.addColorStop(0, 'rgba(147,197,253,0.6)'); rg.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + 2, ry + rLen);
      ctx.strokeStyle = rg; ctx.lineWidth = 1.5; ctx.stroke();
    }
    // Person silhouette on chair (profile, bottom left)
    const px = w * 0.25, py = h * 0.85;
    ctx.fillStyle = 'rgba(15,23,42,0.95)';
    // Chair
    ctx.fillRect(px - 35, py + 25, 70, 8); ctx.fillRect(px + 22, py - 15, 12, 48); ctx.fillRect(px - 35, py + 25, 8, 45); ctx.fillRect(px + 25, py + 25, 8, 45);
    // Body of person
    ctx.fillRect(px - 22, py - 18, 36, 45);
    // Head slightly tilted (thinking)
    ctx.beginPath(); ctx.arc(px + 6, py - 35, 22, 0, Math.PI * 2); ctx.fill();
    // Chin resting on hand
    ctx.beginPath(); ctx.moveTo(px - 22, py + 12); ctx.lineTo(px - 45, py - 18); ctx.strokeStyle = 'rgba(15,23,42,0.95)'; ctx.lineWidth = 10; ctx.stroke();
    ctx.beginPath(); ctx.arc(px - 45, py - 20, 12, 0, Math.PI * 2); ctx.fillStyle = 'rgba(15,23,42,0.95)'; ctx.fill();
    // Thought bubble
    const thoughtOp = 0.5 + Math.sin(t * 0.03) * 0.2;
    [16, 12, 8].forEach((r, i) => { ctx.beginPath(); ctx.arc(px + i * 16 + 15, py - 55 - i * 15, r, 0, Math.PI * 2); ctx.fillStyle = `rgba(148,163,184,${thoughtOp * (1 - i * 0.25)})`; ctx.fill(); });
    // Room light (warm dim lamp glow from bottom left)
    const lampG2 = ctx.createRadialGradient(0, h, 0, 0, h, w * 0.35);
    lampG2.addColorStop(0, 'rgba(251,191,36,0.3)'); lampG2.addColorStop(1, 'transparent');
    ctx.fillStyle = lampG2; ctx.beginPath(); ctx.arc(0, h, w * 0.35, 0, Math.PI * 2); ctx.fill();
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 66. TRAIN GOODBYE (village train) ────────────────────────────────────────
export const TrainGoodbye = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    // Countryside sky
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.55);
    sky.addColorStop(0, '#fde68a'); sky.addColorStop(0.5, '#fdba74'); sky.addColorStop(1, '#bae6fd');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.55);
    // Sun
    const sunG = ctx.createRadialGradient(w * 0.15, h * 0.1, 0, w * 0.15, h * 0.1, 65);
    sunG.addColorStop(0, '#fef3c7'); sunG.addColorStop(0.4, '#fbbf24'); sunG.addColorStop(1, 'transparent');
    ctx.fillStyle = sunG; ctx.beginPath(); ctx.arc(w * 0.15, h * 0.1, 65, 0, Math.PI * 2); ctx.fill();
    // Green fields
    ctx.fillStyle = '#15803d'; ctx.fillRect(0, h * 0.55, w, h * 0.45);
    // Pond
    ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.ellipse(w * 0.72, h * 0.68, 80, 25, 0, 0, Math.PI * 2); ctx.fill();
    // Trees
    for (let i = 0; i < 10; i++) {
      const tx = (i / 9) * w * 0.85 + w * 0.08;
      if (i === 5 || i === 6) continue; // gap for train
      ctx.fillStyle = '#92400e'; ctx.fillRect(tx - 4, h * 0.45, 8, h * 0.12);
      ctx.beginPath(); ctx.arc(tx, h * 0.44, 22, 0, Math.PI * 2); ctx.fillStyle = '#16a34a'; ctx.fill();
    }
    // Small village building
    ctx.fillStyle = '#d97706'; ctx.fillRect(w * 0.8, h * 0.44, 70, 55);
    ctx.beginPath(); ctx.moveTo(w * 0.8 - 5, h * 0.44); ctx.lineTo(w * 0.8 + 35, h * 0.36); ctx.lineTo(w * 0.8 + 75, h * 0.44); ctx.closePath();
    ctx.fillStyle = '#ef4444'; ctx.fill();
    // Train tracks
    ctx.fillStyle = '#78350f'; ctx.fillRect(0, h * 0.73, w, 6);
    ctx.fillStyle = '#4b5563'; ctx.fillRect(0, h * 0.71, w, 5); ctx.fillRect(0, h * 0.75, w, 5);
    for (let si = 0; si < w / 60; si++) { ctx.fillStyle = '#6b5436'; ctx.fillRect(si * 60, h * 0.7, 40, h * 0.08); }
    // Train moving (accelerating away)
    const trainX = w * 0.5 + (t * 2.5) % (w * 0.7) - w * 0.1;
    const trainLen = 280;
    // Locomotive
    ctx.fillStyle = '#1e40af'; ctx.fillRect(trainX, h * 0.6, trainLen * 0.35, 50);
    ctx.beginPath(); ctx.arc(trainX + trainLen * 0.35, h * 0.625, 25, 0, Math.PI * 2);
    ctx.fillStyle = '#1d4ed8'; ctx.fill();
    // Carriages
    [1, 2].forEach(ci => {
      ctx.fillStyle = '#1e3a8a'; ctx.fillRect(trainX + trainLen * 0.38 + ci * 75, h * 0.62, 70, 44);
      // Windows with hand visible
      if (ci === 1) {
        ctx.fillStyle = 'rgba(147,197,253,0.5)'; ctx.fillRect(trainX + trainLen * 0.38 + ci * 75 + 12, h * 0.63, 40, 28);
        // Waving hand silhouette
        ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(trainX + trainLen * 0.38 + ci * 75 + 32, h * 0.645 + Math.sin(t * 0.12) * 5, 8, 0, Math.PI * 2); ctx.fill();
      }
      // Wheels
      [20, 55].forEach(wx2 => { ctx.beginPath(); ctx.arc(trainX + trainLen * 0.38 + ci * 75 + wx2, h * 0.706, 10, 0, Math.PI * 2); ctx.fillStyle = '#0f172a'; ctx.fill(); ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.stroke(); });
    });
    // Smoke trail
    for (let si = 0; si < 8; si++) {
      const sx2 = trainX - si * 24 - Math.sin(t * 0.05 + si) * 15;
      const sy2 = h * 0.56 - si * 14;
      ctx.beginPath(); ctx.arc(sx2, sy2, 12 + si * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,200,200,${0.35 - si * 0.04})`; ctx.fill();
    }
    // Person on platform waving
    const platX = w * 0.35, platY = h * 0.72;
    const wave = Math.sin(t * 0.1) * 20;
    ctx.fillStyle = '#ec4899';
    ctx.beginPath(); ctx.arc(platX, platY - 30, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(platX - 10, platY - 17, 20, 32);
    // Waving arm
    ctx.beginPath(); ctx.moveTo(platX + 10, platY - 5); ctx.lineTo(platX + 30 + wave * 0.5, platY - 25 + wave * 0.3);
    ctx.strokeStyle = '#ec4899'; ctx.lineWidth = 5; ctx.stroke();
    ctx.beginPath(); ctx.arc(platX + 30 + wave * 0.5, platY - 25 + wave * 0.3, 5, 0, Math.PI * 2); ctx.fill();
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 67. LONELY WALK ──────────────────────────────────────────────────────────
export const LonelyWalk = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h);
    // Long wet street stretching away
    const roadG = ctx.createLinearGradient(w / 2, h * 0.45, w / 2, h);
    roadG.addColorStop(0, '#1e293b'); roadG.addColorStop(1, '#334155');
    ctx.fillStyle = roadG;
    ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(w, h); ctx.lineTo(w * 0.7, h * 0.45); ctx.lineTo(w * 0.3, h * 0.45); ctx.closePath(); ctx.fill();
    // Streetlamps creating pools of light
    const lamps = [0.15, 0.35, 0.5, 0.65, 0.8];
    lamps.forEach((lp, i) => {
      const lpProg = (i / (lamps.length - 1));
      const lx = w / 2 + (lp - 0.5) * w * lpProg * 0.85;
      const ly = h * 0.45 + h * 0.42 * lpProg;
      const lr = 70 + lpProg * 80;
      ctx.fillStyle = '#475569'; const poleH = h * 0.14 * (1 + lpProg * 0.5);
      ctx.fillRect(lx - 2, ly - poleH, 4, poleH + 10);
      const lg2 = ctx.createRadialGradient(lx, ly - poleH + 10, 0, lx, ly - poleH + lr, lr);
      lg2.addColorStop(0, 'rgba(251,191,36,0.7)'); lg2.addColorStop(1, 'transparent');
      ctx.fillStyle = lg2; ctx.beginPath(); ctx.arc(lx, ly - poleH + 10, lr, 0, Math.PI * 2); ctx.fill();
      // Wet road reflection
      const refG2 = ctx.createLinearGradient(lx - lr * 0.3, ly, lx + lr * 0.3, ly + lr);
      refG2.addColorStop(0, 'rgba(251,191,36,0.25)'); refG2.addColorStop(1, 'transparent');
      ctx.fillStyle = refG2; ctx.fillRect(lx - lr * 0.35, ly, lr * 0.7, lr);
    });
    // Light rain
    for (let ri = 0; ri < 50; ri++) {
      const rx = (Math.sin(ri * 37) * 0.5 + 0.5) * w, ry = ((ri * 41 + t * 3) % h);
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 1, ry - 15);
      ctx.strokeStyle = 'rgba(147,197,253,0.3)'; ctx.lineWidth = 1; ctx.stroke();
    }
    // Figure walking away — getting smaller
    const figX = w / 2, figY = h * 0.72 - Math.sin(t * 0.015) * 2;
    const figSize = 0.06; // small — far away
    const legSwing = Math.sin(t * 0.12) * 10;
    ctx.fillStyle = 'rgba(30,41,59,0.95)';
    // Legs
    ctx.beginPath(); ctx.moveTo(figX, figY + h * figSize * 0.5); ctx.lineTo(figX - legSwing, figY + h * figSize * 1.2); ctx.strokeStyle = 'rgba(30,41,59,0.95)'; ctx.lineWidth = h * figSize * 0.25; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(figX, figY + h * figSize * 0.5); ctx.lineTo(figX + legSwing, figY + h * figSize * 1.2); ctx.stroke();
    // Body
    ctx.fillRect(figX - h * figSize * 0.35, figY - h * figSize * 0.3, h * figSize * 0.7, h * figSize * 0.8);
    // Head
    ctx.beginPath(); ctx.arc(figX, figY - h * figSize * 0.55, h * figSize * 0.35, 0, Math.PI * 2); ctx.fill();
    // Umbrella
    ctx.beginPath(); ctx.arc(figX, figY - h * figSize * 1.2, h * figSize * 0.75, Math.PI, 0); ctx.fillStyle = '#1e40af'; ctx.fill();
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 68. CITY TOP VIEW ────────────────────────────────────────────────────────
export const CityTopView = () => {
  interface TVCar { x: number; y: number; vx: number; vy: number; c: string; }
  const cars = useRef<TVCar[]>([]);
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    // Bird's eye of city grid
    ctx.fillStyle = '#111827'; ctx.fillRect(0, 0, w, h);
    // City blocks / buildings (top view)
    const blockSize = 95;
    for (let bx = 0; bx < w; bx += blockSize + 28) {
      for (let by = 0; by < h; by += blockSize + 28) {
        const bw = blockSize - 5, bh = blockSize - 5;
        const shade = Math.floor(Math.random() * 30 + 25);
        ctx.fillStyle = `rgb(${shade},${shade + 5},${shade + 15})`; ctx.fillRect(bx + 5, by + 5, bw, bh);
        // Building top detail
        ctx.fillStyle = `rgba(${shade + 15},${shade + 20},${shade + 40},0.8)`;
        ctx.fillRect(bx + 18, by + 18, bw - 36, bh - 36);
        // Rooftop water tower or AC unit
        if ((bx + by) % 200 === 0) { ctx.fillStyle = '#374151'; ctx.fillRect(bx + bw * 0.4, by + bh * 0.35, 15, 20); }
      }
    }
    // Roads (horizontal + vertical)
    for (let rx = 0; rx < w; rx += blockSize + 28) { ctx.fillStyle = '#1f2937'; ctx.fillRect(rx + blockSize, 0, 28, h); }
    for (let ry = 0; ry < h; ry += blockSize + 28) { ctx.fillStyle = '#1f2937'; ctx.fillRect(0, ry + blockSize, w, 28); }
    // Road center lines
    for (let rx = 0; rx < w; rx += blockSize + 28) {
      for (let ly = (t * 2) % 40 - 40; ly < h; ly += 40) { ctx.fillStyle = '#fbbf24'; ctx.fillRect(rx + blockSize + 12, ly, 4, 22); }
    }
    for (let ry = 0; ry < h; ry += blockSize + 28) {
      for (let lx = (t * 2) % 40 - 40; lx < w; lx += 40) { ctx.fillStyle = '#fbbf24'; ctx.fillRect(lx, ry + blockSize + 12, 22, 4); }
    }
    // Car traffic (top-down view)
    if (cars.current.length < 40 && Math.random() < 0.08) {
      const isH = Math.random() > 0.5;
      const roadOffset = Math.floor(Math.random() * 5) * (blockSize + 28) + blockSize + 4;
      cars.current.push(isH ?
        { x: -20, y: roadOffset + Math.random() * 10, vx: Math.random() * 2 + 1.2, vy: 0, c: `hsl(${Math.random() * 360},60%,50%)` } :
        { x: roadOffset + Math.random() * 10, y: -20, vx: 0, vy: Math.random() * 2 + 1.2, c: `hsl(${Math.random() * 360},60%,50%)` });
    }
    cars.current = cars.current.filter(c => c.x < w + 30 && c.y < h + 30);
    cars.current.forEach(c => {
      c.x += c.vx; c.y += c.vy;
      ctx.fillStyle = c.c;
      if (c.vx !== 0) ctx.fillRect(c.x - 10, c.y - 5, 20, 10);
      else ctx.fillRect(c.x - 5, c.y - 12, 10, 22);
      // Headlights
      ctx.fillStyle = 'rgba(255,250,200,0.8)';
      if (c.vx > 0) ctx.beginPath(), ctx.arc(c.x + 10, c.y, 3, 0, Math.PI * 2), ctx.fill();
      if (c.vy > 0) ctx.beginPath(), ctx.arc(c.x, c.y + 12, 3, 0, Math.PI * 2), ctx.fill();
    });
    // Shadows of tall buildings
    ctx.globalAlpha = 0.15;
    for (let bx = 0; bx < w; bx += blockSize + 28) for (let by = 0; by < h; by += blockSize + 28) {
      ctx.fillStyle = '#000'; ctx.fillRect(bx + 12, by + 12, blockSize - 5, blockSize - 5);
    }
    ctx.globalAlpha = 1;
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 69. BUS STOP RAIN ────────────────────────────────────────────────────────
interface BSRDrop { x: number; y: number; vy: number; vx: number; }
export const BusStopRain = () => {
  const drops = useRef<BSRDrop[]>([]);
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#1e293b'); bg.addColorStop(1, '#0f172a');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    // Desolate street
    ctx.fillStyle = '#0a0f1a'; ctx.fillRect(0, h * 0.7, w, h * 0.3);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(0, h * 0.72, w, h * 0.06);
    // Bus stop structure (center)
    const bsx = w / 2, bsy = h * 0.42;
    ctx.fillStyle = '#334155'; ctx.fillRect(bsx - 65, bsy, 130, 5); // roof
    ctx.fillRect(bsx - 20, bsy, 5, h * 0.32); // left pillar
    ctx.fillRect(bsx + 15, bsy, 5, h * 0.32); // right pillar
    // Bus stop sign
    ctx.fillStyle = '#fbbf24'; ctx.fillRect(bsx - 18, bsy - 22, 36, 18);
    ctx.fillStyle = '#0f172a'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('BUS', bsx, bsy - 8);
    // Dim spotlight from sign
    const spotG = ctx.createRadialGradient(bsx, bsy - 5, 0, bsx, bsy - 5, 80);
    spotG.addColorStop(0, 'rgba(251,191,36,0.3)'); spotG.addColorStop(1, 'transparent');
    ctx.fillStyle = spotG; ctx.beginPath(); ctx.arc(bsx, bsy - 5, 80, 0, Math.PI * 2); ctx.fill();
    // Bench
    ctx.fillStyle = '#475569'; ctx.fillRect(bsx - 45, h * 0.7, 90, 10);
    [bsx - 38, bsx + 32].forEach(lx => { ctx.fillRect(lx, h * 0.7, 6, 22); });
    // Person waiting (huddled)
    const wx = bsx + 5, wy = h * 0.68;
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.arc(wx, wy - 26, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(wx - 16, wy - 13, 32, 30); // body hunched
    // Checking for bus — head turn
    const lookAngle = Math.sin(t * 0.02) > 0.7 ? 1 : 0;
    if (lookAngle) { ctx.beginPath(); ctx.arc(wx + 14, wy - 26, 14, 0, Math.PI * 2); ctx.fill(); }
    // Headlights of approaching bus in far distance
    const busX = -200 + (t * 1.5) % (w + 200);
    if (busX > -100) {
      const blg = ctx.createRadialGradient(busX, h * 0.73, 0, busX, h * 0.73, 120);
      blg.addColorStop(0, 'rgba(255,250,200,0.6)'); blg.addColorStop(1, 'transparent');
      ctx.fillStyle = blg; ctx.beginPath(); ctx.arc(busX, h * 0.73, 120, 0, Math.PI * 2); ctx.fill();
    }
    // Heavy rain blowing sideways
    while (drops.current.length < 200) drops.current.push({ x: Math.random() * w, y: -20, vy: Math.random() * 12 + 8, vx: -4 });
    drops.current = drops.current.filter(d => d.y < h + 20);
    drops.current.forEach(d => {
      d.y += d.vy; d.x += d.vx;
      ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + d.vx * 2.5, d.y - d.vy * 2.5);
      ctx.strokeStyle = 'rgba(147,197,253,0.45)'; ctx.lineWidth = 1.2; ctx.stroke();
    });
    // Puddle splashes
    [[bsx + 60, h * 0.73],[bsx - 55, h * 0.74]].forEach(([px, py]) => {
      const ripR = (t * 1.8) % 30;
      ctx.beginPath(); ctx.ellipse(+px, +py, ripR, ripR * 0.3, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(147,197,253,${0.5 - ripR / 60})`; ctx.lineWidth = 1; ctx.stroke();
    });
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 70. SUNRISE CITY ────────────────────────────────────────────────────────
export const SunriseCity = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const cycle = (Math.sin(t * 0.004) * 0.5 + 0.5);
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.6);
    sky.addColorStop(0, `hsl(${240 - cycle * 200},${60 - cycle * 40}%,${12 + cycle * 18}%)`);
    sky.addColorStop(0.5, `hsl(${280 - cycle * 240},70%,${20 + cycle * 30}%)`);
    sky.addColorStop(1, `hsl(${30},100%,${40 + cycle * 20}%)`);
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.6);
    // First rays of sun on horizon
    const sunG2 = ctx.createRadialGradient(w / 2, h * 0.6, 0, w / 2, h * 0.6, 200);
    sunG2.addColorStop(0, `rgba(255,220,100,${cycle * 0.95})`);
    sunG2.addColorStop(0.4, `rgba(249,115,22,${cycle * 0.5})`);
    sunG2.addColorStop(1, 'transparent');
    ctx.fillStyle = sunG2; ctx.beginPath(); ctx.arc(w / 2, h * 0.6, 200, 0, Math.PI * 2); ctx.fill();
    // Stars fading with cycle
    for (let i = 0; i < 50; i++) { const sx = (Math.sin(i * 89) * 0.5 + 0.5) * w, sy = (Math.cos(i * 137) * 0.5 + 0.5) * h * 0.55; ctx.beginPath(); ctx.arc(sx, sy, 0.8, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${Math.max(0, (1 - cycle) * 0.6)})`; ctx.fill(); }
    // City buildings still in blue shadow at bottom
    const bldConfig = [[0,0.45,75],[0.09,0.38,100],[0.19,0.52,65],[0.28,0.3,130],[0.40,0.42,90],[0.52,0.35,110],[0.63,0.48,70],[0.73,0.4,95],[0.83,0.55,60],[0.92,0.42,85]];
    bldConfig.forEach(([bx,bh,bw]) => {
      const buildH = h * (1 - +bh);
      ctx.fillStyle = `hsl(220,${20 - cycle * 10}%,${10 + cycle * 8}%)`;
      ctx.fillRect(+bx * w, h * +bh, +bw, buildH);
      // Golden sunrise touching tops of tallest towers
      const topGlow = cycle > 0.5 ? ctx.createLinearGradient(0, h * +bh, 0, h * +bh + 40) : null;
      if (topGlow) {
        topGlow.addColorStop(0, `rgba(251,191,36,${(cycle - 0.5) * 0.9})`);
        topGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = topGlow; ctx.fillRect(+bx * w, h * +bh, +bw, 40);
      }
      // Windows slowly turning on
      for (let wi = +bx * w + 8; wi < +bx * w + +bw - 8; wi += 15) {
        for (let wiy = h * +bh + 12; wiy < h - 20; wiy += 20) {
          if (Math.sin(wi * 0.2 + wiy * 0.15 + t * 0.012) > 0.2) {
            ctx.fillStyle = `rgba(251,191,36,${cycle * 0.55})`; ctx.fillRect(wi, wiy, 7, 10);
          }
        }
      }
    });
    // Ground / street
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, h * 0.85, w, h * 0.15);
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};
