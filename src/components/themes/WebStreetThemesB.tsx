import React, { useRef } from 'react';
import { useCanvas } from './WebSpaceThemes';

// ─── 51. BEACH BONFIRE ────────────────────────────────────────────────────────
export const BeachBonfire = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    // Night ocean background
    ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, w, h);
    // Stars
    for (let i = 0; i < 80; i++) { const sx = (Math.sin(i * 89) * 0.5 + 0.5) * w, sy = (Math.cos(i * 137) * 0.5 + 0.5) * h * 0.45; ctx.beginPath(); ctx.arc(sx, sy, 0.7, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(i + t * 0.01) * 0.3})`; ctx.fill(); }
    // Moon
    ctx.beginPath(); ctx.arc(w * 0.85, h * 0.12, 28, 0, Math.PI * 2); ctx.fillStyle = '#fef3c7'; ctx.fill();
    // Ocean waves
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(0, h * (0.5 + i * 0.06));
      for (let x = 0; x <= w; x += 6) ctx.lineTo(x, h * (0.5 + i * 0.06) + Math.sin(x * 0.015 - t * 0.03 + i) * 8);
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
      ctx.fillStyle = `rgba(8,47,73,${0.6 + i * 0.2})`; ctx.fill();
    }
    // Sandy beach
    ctx.fillStyle = '#92400e'; ctx.fillRect(0, h * 0.62, w, h * 0.38);
    // Bonfire base (logs)
    const bx = w / 2, by = h * 0.68;
    ctx.fillStyle = '#78350f'; ctx.fillRect(bx - 35, by, 70, 8);
    ctx.save(); ctx.translate(bx, by); ctx.rotate(0.4); ctx.fillStyle = '#7c2d12'; ctx.fillRect(-35, 0, 70, 8); ctx.restore();
    // Fire flames
    for (let flame = 0; flame < 8; flame++) {
      const fOffset = Math.sin(t * 0.08 + flame * 0.9) * 14;
      const fHeight = h * (0.06 + Math.sin(t * 0.06 + flame) * 0.02);
      const fx = bx + fOffset + (flame - 4) * 10;
      const fg = ctx.createRadialGradient(fx, by - fHeight, 0, fx, by, fHeight);
      fg.addColorStop(0, 'rgba(255,255,200,0.9)');
      fg.addColorStop(0.3, 'rgba(249,115,22,' + (0.8 - flame * 0.05) + ')');
      fg.addColorStop(0.7, 'rgba(220,38,38,0.5)');
      fg.addColorStop(1, 'transparent');
      ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(fx, by - fHeight * 0.5, fHeight * 0.55, 0, Math.PI * 2); ctx.fill();
    }
    // Fire light glow on sand
    const flameGlow = ctx.createRadialGradient(bx, by - 30, 0, bx, by, 200);
    flameGlow.addColorStop(0, 'rgba(249,115,22,0.35)'); flameGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = flameGlow; ctx.beginPath(); ctx.arc(bx, by, 200, 0, Math.PI * 2); ctx.fill();
    // Silhouetted friends around fire
    [-0.28, -0.18, 0.18, 0.28, -0.08, 0.08].forEach((off, i) => {
      const sx2 = bx + off * w * 0.55, sy2 = by + 18;
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.beginPath(); ctx.arc(sx2, sy2 - 22, 11, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(sx2 - 8, sy2 - 12, 16, 28);
      // Arm reaching toward fire
      ctx.beginPath(); ctx.moveTo(sx2, sy2); ctx.lineTo(off < 0 ? sx2 + 20 : sx2 - 20, sy2 - 10);
      ctx.strokeStyle = 'rgba(0,0,0,0.85)'; ctx.lineWidth = 4; ctx.stroke();
    });
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 52. COLLEGE WALK ─────────────────────────────────────────────────────────
export const CollegeWalk = () => {
  interface Walker { x: number; y: number; sp: number; color: string; phase: number; }
  const walkers = useRef<Walker[]>([]);
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#fde68a'); bg.addColorStop(0.4, '#fed7aa'); bg.addColorStop(1, '#f0fdf4');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    // Trees lining path
    for (let i = 0; i < 8; i++) {
      const tx = w * (i / 7), ty = h * 0.35;
      ctx.fillStyle = '#92400e'; ctx.fillRect(tx - 4, ty, 8, h * 0.28);
      // Autumn canopy
      ['#dc2626','#ea580c','#d97706','#ca8a04'].forEach((c, ci) => { const r = 38 + ci * 6; ctx.beginPath(); ctx.arc(tx + Math.cos(ci) * 12, ty - 20 + Math.sin(ci) * 10, r, 0, Math.PI * 2); ctx.fillStyle = c + 'bb'; ctx.fill(); });
      // Falling leaves
      for (let li = 0; li < 4; li++) {
        const lx = tx + Math.sin(t * 0.02 + li * 2 + i) * 40;
        const ly = ty + ((t * 0.5 + li * 25 + i * 30) % 120);
        ctx.fillStyle = ['#f97316','#dc2626','#fbbf24'][li % 3]; ctx.beginPath(); ctx.arc(lx, ly, 5, 0, Math.PI * 2); ctx.fill();
      }
    }
    // Pathway
    ctx.fillStyle = '#d1fae5'; ctx.fillRect(w * 0.15, h * 0.58, w * 0.7, h * 0.08);
    ctx.fillStyle = '#f0fdf4'; ctx.fillRect(0, h * 0.6, w, h * 0.4);
    // Spawn walkers
    while (walkers.current.length < 12) walkers.current.push({ x: Math.random() * w, y: h * (0.62 + Math.random() * 0.2), sp: (Math.random() * 1.5 + 0.8) * (Math.random() > 0.5 ? 1 : -1), color: ['#7c3aed','#0284c7','#be185d','#166534','#92400e'][Math.floor(Math.random() * 5)], phase: Math.random() * Math.PI * 2 });
    walkers.current = walkers.current.filter(w2 => w2.x > -60 && w2.x < w + 60);
    walkers.current.forEach(wk => {
      wk.x += wk.sp;
      const leg = Math.sin(t * 0.18 + wk.phase) * 12;
      ctx.fillStyle = wk.color;
      ctx.beginPath(); ctx.arc(wk.x, wk.y - 22, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(wk.x - 7, wk.y - 13, 14, 22);
      // Legs
      ctx.beginPath(); ctx.moveTo(wk.x, wk.y + 9); ctx.lineTo(wk.x - leg, wk.y + 32); ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 4; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(wk.x, wk.y + 9); ctx.lineTo(wk.x + leg, wk.y + 32); ctx.stroke();
      // Book/bag
      ctx.fillStyle = '#f59e0b'; ctx.fillRect(wk.x + (wk.sp > 0 ? 9 : -19), wk.y - 10, 10, 14);
    });
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 53. ROOFTOP PARTY ────────────────────────────────────────────────────────
export const RooftopParty = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    // City night sky
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.55); sky.addColorStop(0, '#020617'); sky.addColorStop(1, '#0f172a');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.55);
    // City skyline
    [[0.05,0.5,60],[0.12,0.42,80],[0.22,0.55,55],[0.32,0.38,100],[0.45,0.6,70],[0.58,0.45,90],[0.7,0.52,65],[0.8,0.4,85],[0.9,0.58,60]].forEach(([bx,bh,bw]) => {
      ctx.fillStyle = '#0f172a'; ctx.fillRect(+bx*w, h*+bh, +bw, h*(0.55-+bh));
      for(let wi=+bx*w+8;wi<+bx*w+ +bw-8;wi+=15) for(let hy=h*+bh+10;hy<h*0.55;hy+=18) { if(Math.sin(wi*0.3+hy*0.2+t*0.008)>0.3) {ctx.fillStyle='rgba(251,191,36,0.4)';ctx.fillRect(wi,hy,7,9);} }
    });
    // Rooftop floor
    ctx.fillStyle = '#1e293b'; ctx.fillRect(0, h * 0.62, w, h * 0.38);
    ctx.fillStyle = 'rgba(71,85,105,0.4)'; ctx.fillRect(0, h * 0.62, w, 5);
    // String lights
    const flicker = 0.85 + Math.sin(t * 0.07) * 0.12;
    for (let li = 0; li < 4; li++) {
      const y1 = h * (0.55 + li * 0.015), y2 = y1 + Math.sin(li * 1.3) * 20;
      ctx.beginPath(); ctx.moveTo(0, y1);
      for (let lx = 0; lx <= w; lx += 6) ctx.lineTo(lx, y1 + Math.sin(lx * 0.06 + li) * 15);
      ctx.strokeStyle = 'rgba(71,85,105,0.4)'; ctx.lineWidth = 1.2; ctx.stroke();
      for (let lx = 0; lx < w; lx += 50) {
        ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 18 * flicker;
        ctx.beginPath(); ctx.arc(lx, y1 + Math.sin(lx * 0.06 + li) * 15, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251,191,36,${flicker})`; ctx.fill(); ctx.shadowBlur = 0;
      }
    }
    // Dancers / couples swaying
    [[0.18, 0.74], [0.35, 0.76], [0.55, 0.73], [0.72, 0.75], [0.88, 0.74]].forEach(([px, py], i) => {
      const sway = Math.sin(t * 0.04 + i * 1.2) * 4;
      const cx = px * w + sway;
      ctx.fillStyle = ['#818cf8','#f472b6','#22d3ee','#86efac','#fbbf24'][i];
      ctx.beginPath(); ctx.arc(cx, py * h - 30, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(cx - 8, py * h - 19, 16, 28);
      // Partner
      if (i % 2 === 0) {
        ctx.fillStyle = ['#f472b6','#818cf8','#86efac'][i % 3];
        ctx.beginPath(); ctx.arc(cx + 22, py * h - 30 + sway * 0.5, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(cx + 14, py * h - 19, 16, 28);
        // Connected hands
        ctx.beginPath(); ctx.moveTo(cx + 8, py * h - 5); ctx.lineTo(cx + 14, py * h - 5);
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2; ctx.stroke();
      }
    });
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 54. RAIN WALK (person walking in rain) ───────────────────────────────────
interface RainWalkDrop { x: number; y: number; vy: number; vx: number; }
export const RainWalk = () => {
  const rainDrops = useRef<RainWalkDrop[]>([]);
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#334155'); bg.addColorStop(1, '#1e293b');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    // City street sides
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w * 0.1, h); ctx.fillRect(w * 0.9, 0, w * 0.1, h);
    // Street lights
    [0.12, 0.88].forEach(lx => {
      ctx.fillStyle = '#475569'; ctx.fillRect(lx * w - 3, h * 0.15, 6, h * 0.55);
      const glowG = ctx.createRadialGradient(lx * w, h * 0.15, 0, lx * w, h * 0.15, 120);
      glowG.addColorStop(0, 'rgba(251,191,36,0.6)'); glowG.addColorStop(1, 'transparent');
      ctx.fillStyle = glowG; ctx.beginPath(); ctx.arc(lx * w, h * 0.15, 120, 0, Math.PI * 2); ctx.fill();
    });
    // Road
    ctx.fillStyle = '#1e293b'; ctx.fillRect(w * 0.1, h * 0.65, w * 0.8, h * 0.35);
    // Puddles
    [0.25, 0.5, 0.75].forEach(px => {
      ctx.fillStyle = 'rgba(56,189,248,0.2)'; ctx.beginPath(); ctx.ellipse(px * w, h * 0.78, 50, 12, 0, 0, Math.PI * 2); ctx.fill();
    });
    // Rain drops
    while (rainDrops.current.length < 150) rainDrops.current.push({ x: Math.random() * w, y: -20, vy: Math.random() * 12 + 8, vx: -2 });
    rainDrops.current = rainDrops.current.filter(d => d.y < h + 20);
    rainDrops.current.forEach(d => {
      d.y += d.vy; d.x += d.vx;
      ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + d.vx * 2, d.y - d.vy * 3);
      ctx.strokeStyle = 'rgba(147,197,253,0.55)'; ctx.lineWidth = 1.2; ctx.stroke();
    });
    // Person walking — joyful
    const px = w * 0.5, py = h * 0.72;
    const legSwing = Math.sin(t * 0.12) * 20;
    const bodyBounce = Math.abs(Math.sin(t * 0.12)) * 5;
    // Umbrella (bright yellow)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(px, py - 58 - bodyBounce, 45, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#d97706'; ctx.fillRect(px - 45, py - 60 - bodyBounce, 90, 5);
    ctx.beginPath(); ctx.moveTo(px, py - 57 - bodyBounce); ctx.lineTo(px, py - 18 - bodyBounce); ctx.lineTo(px + 12, py - 3 - bodyBounce);
    ctx.strokeStyle = '#92400e'; ctx.lineWidth = 2.5; ctx.stroke();
    // Rain boots (yellow)
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(px - 18 + legSwing, py + 24 - bodyBounce, 12, 20);
    ctx.fillRect(px + 6 - legSwing, py + 24 - bodyBounce, 12, 20);
    // Body
    ctx.fillStyle = '#0284c7'; ctx.fillRect(px - 14, py - 18 - bodyBounce, 28, 42);
    ctx.beginPath(); ctx.arc(px, py - 28 - bodyBounce, 16, 0, Math.PI * 2); ctx.fill();
    // Joy — arms up spinning motion
    const armAngle = t * 0.08;
    ctx.beginPath(); ctx.moveTo(px - 14, py - 5 - bodyBounce); ctx.lineTo(px - 14 - Math.cos(armAngle) * 25, py - 5 - bodyBounce - Math.sin(armAngle) * 15);
    ctx.strokeStyle = '#0284c7'; ctx.lineWidth = 5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px + 14, py - 5 - bodyBounce); ctx.lineTo(px + 14 + Math.cos(armAngle + 1) * 25, py - 5 - bodyBounce - Math.sin(armAngle + 1) * 15); ctx.stroke();
    // Splash when foot down
    if (legSwing > 12) { ctx.fillStyle = 'rgba(147,197,253,0.6)'; ctx.beginPath(); ctx.arc(px - 18 + legSwing, py + 44 - bodyBounce, 12, 0, Math.PI * 2); ctx.fill(); }
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 55. SUNSET SILHOUETTE ────────────────────────────────────────────────────
export const SunsetSilhouette = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#1e1b4b'); sky.addColorStop(0.3, '#7c3aed'); sky.addColorStop(0.55, '#f97316'); sky.addColorStop(0.7, '#fbbf24'); sky.addColorStop(1, '#fde68a');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
    // Sun on horizon
    const sunG = ctx.createRadialGradient(w / 2, h * 0.7, 0, w / 2, h * 0.7, 140);
    sunG.addColorStop(0, 'rgba(255,255,200,1)'); sunG.addColorStop(0.3, 'rgba(251,191,36,0.8)'); sunG.addColorStop(0.6, 'rgba(249,115,22,0.4)'); sunG.addColorStop(1, 'transparent');
    ctx.fillStyle = sunG; ctx.beginPath(); ctx.arc(w / 2, h * 0.7, 140, 0, Math.PI * 2); ctx.fill();
    // Ground
    ctx.fillStyle = '#030712'; ctx.fillRect(0, h * 0.7, w, h * 0.3);
    // Field silhouette
    ctx.beginPath(); ctx.moveTo(0, h * 0.7);
    for (let x = 0; x <= w; x += 8) ctx.lineTo(x, h * 0.7 + Math.sin(x * 0.015 + t * 0.01) * 12 - Math.cos(x * 0.009 + t * 0.008) * 8);
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fillStyle = '#020617'; ctx.fill();
    // Lone tree
    ctx.fillStyle = '#020617'; ctx.fillRect(w * 0.35 - 6, h * 0.42, 12, h * 0.28);
    ctx.beginPath(); ctx.arc(w * 0.35, h * 0.42, 35, 0, Math.PI * 2); ctx.fill();
    // Two silhouettes facing each other
    const wind = Math.sin(t * 0.015) * 3;
    [[0.56, 0.72], [0.64, 0.72]].forEach(([px, py], i) => {
      ctx.fillStyle = '#020617';
      ctx.beginPath(); ctx.arc(px * w, py * h - 28 + wind * (i === 0 ? 1 : -1), 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(px * w - 9, py * h - 16, 18, 30);
      // Hair in wind
      ctx.beginPath(); ctx.moveTo(px * w + (i === 0 ? 8 : -8), py * h - 34);
      ctx.bezierCurveTo(px * w + (i === 0 ? 20 : -20), py * h - 45 + wind * 2, px * w + (i === 0 ? 28 : -28), py * h - 38, px * w + (i === 0 ? 22 : -22), py * h - 30);
      ctx.strokeStyle = '#020617'; ctx.lineWidth = 4; ctx.stroke();
    });
    // Hands touching (center)
    ctx.beginPath(); ctx.moveTo(w * 0.565, h * 0.72); ctx.lineTo(w * 0.595, h * 0.72);
    ctx.strokeStyle = '#020617'; ctx.lineWidth = 4; ctx.stroke();
    // Sun reflection on ground
    const refG = ctx.createLinearGradient(w / 2 - 60, h * 0.7, w / 2 + 60, h * 0.7);
    refG.addColorStop(0, 'transparent'); refG.addColorStop(0.5, 'rgba(251,191,36,0.25)'); refG.addColorStop(1, 'transparent');
    ctx.fillStyle = refG; ctx.fillRect(w * 0.3, h * 0.7, w * 0.4, h * 0.3);
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 56. STREET FOOD (night market) ──────────────────────────────────────────
export const StreetFood = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h);
    // Food stalls
    const stalls = [
      { x: 0.1, label: 'PIZZA', grill: '#ef4444' },
      { x: 0.3, label: 'BURGER', grill: '#f97316' },
      { x: 0.5, label: 'CHICKEN', grill: '#d97706' },
      { x: 0.7, label: 'MOMOS', grill: '#22c55e' },
      { x: 0.9, label: 'TACOS', grill: '#8b5cf6' },
    ];
    stalls.forEach(st => {
      const sx = st.x * w;
      // Stall canopy
      ctx.fillStyle = st.grill; ctx.fillRect(sx - 60, h * 0.35, 120, 20);
      ctx.fillStyle = '#1e293b'; ctx.fillRect(sx - 55, h * 0.55, 110, h * 0.45);
      
      // Warm glow
      const sg = ctx.createRadialGradient(sx, h * 0.55, 0, sx, h * 0.55, 110);
      sg.addColorStop(0, st.grill + '66'); sg.addColorStop(1, 'transparent');
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, h * 0.55, 110, 0, Math.PI * 2); ctx.fill();

      // Counter
      ctx.fillStyle = '#334155'; ctx.fillRect(sx - 55, h * 0.55, 110, 16);
      
      // Cook silhouette
      ctx.fillStyle = '#1e293b';
      ctx.beginPath(); ctx.arc(sx, h * 0.47, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(sx - 12, h * 0.59, 24, 30);
      const stir = Math.sin(t * 0.1 + sx) * 12;
      ctx.beginPath(); ctx.moveTo(sx, h * 0.62); ctx.lineTo(sx + 18 + stir, h * 0.57);
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 4; ctx.stroke();
      
      // Steam
      for (let si = 0; si < 4; si++) {
        const steamX = sx - 30 + si * 20;
        const phase = (t * 0.5 + si * 25) % 60;
        const steamY = h * 0.54 - phase;
        ctx.beginPath(); ctx.moveTo(steamX, h * 0.54); 
        ctx.bezierCurveTo(steamX + 8, steamY + 15, steamX - 8, steamY + 5, steamX, steamY);
        ctx.strokeStyle = `rgba(226,232,240,${0.4 - phase / 150})`; 
        ctx.lineWidth = 3; ctx.stroke();
      }

      // Cinematic Food Icons
      ctx.save();
      ctx.translate(sx, h * 0.46);
      const scale = 1.2;
      ctx.scale(scale, scale);
      
      if (st.label === 'PIZZA') {
        ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.moveTo(0, -15); ctx.lineTo(15, 15); ctx.lineTo(-15, 15); ctx.fill();
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.5; ctx.stroke();
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(-4, 0, 3, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(4, 7, 3.5, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#84cc16'; ctx.beginPath(); ctx.arc(0, 10, 2, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-15, 15); ctx.lineTo(15, 15); ctx.strokeStyle = '#d97706'; ctx.lineWidth = 4; ctx.stroke();
      } else if (st.label === 'BURGER') {
        ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.ellipse(0, -10, 18, 8, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#84cc16'; ctx.fillRect(-17, -2, 34, 4);
        ctx.fillStyle = '#b45309'; ctx.fillRect(-16, 2, 32, 6);
        ctx.fillStyle = '#ef4444'; ctx.fillRect(-17, 8, 34, 3);
        ctx.fillStyle = '#d97706'; ctx.beginPath(); ctx.ellipse(0, 14, 16, 6, 0, 0, Math.PI*2); ctx.fill();
      } else if (st.label === 'CHICKEN') {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.moveTo(-15, 15); ctx.quadraticCurveTo(-20, -10, 0, -15); ctx.quadraticCurveTo(20, -5, 15, 15); ctx.quadraticCurveTo(0, 25, -15, 15); ctx.fill();
        ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-5, 0); ctx.quadraticCurveTo(0, 5, 5, -2); ctx.stroke();
        ctx.fillStyle = '#b45309'; ctx.beginPath(); ctx.arc(-8, 5, 2, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(8, 2, 2, 0, Math.PI*2); ctx.fill();
      } else if (st.label === 'MOMOS') {
        [-10, 0, 10].forEach(mx => {
           ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.ellipse(mx, 5, 8, 6, 0, 0, Math.PI*2); ctx.fill();
           ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(mx-6, 5); ctx.quadraticCurveTo(mx, -5, mx+6, 5); ctx.stroke();
        });
        ctx.fillStyle = '#94a3b8'; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.ellipse(0, 12, 18, 4, 0, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1;
      } else if (st.label === 'TACOS') {
        ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.moveTo(-15, -10); ctx.quadraticCurveTo(0, 20, 15, -10); ctx.fill();
        ctx.strokeStyle = '#d97706'; ctx.lineWidth = 3; ctx.stroke();
        ctx.fillStyle = '#84cc16'; ctx.beginPath(); ctx.ellipse(0, -8, 12, 4, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#dc2626'; ctx.fillRect(-8, -10, 4, 4); ctx.fillRect(4, -9, 3, 3);
      }
      ctx.restore();

      // Signage text
      ctx.fillStyle = '#fff'; ctx.font = `bold 11px sans-serif`; ctx.textAlign = 'center';
      ctx.fillText(st.label, sx, h * 0.385);
    });
    // Crowd of customers
    for (let i = 0; i < 20; i++) {
      const cx = (Math.sin(i * 127) * 0.4 + 0.5) * w;
      const cy = h * 0.7 + (Math.cos(i * 311) * 0.5 + 0.5) * h * 0.2;
      ctx.beginPath(); ctx.arc(cx, cy, 9, 0, Math.PI * 2); ctx.fillStyle = `hsl(${i * 25},50%,35%)`; ctx.fill();
    }
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 57. MARKET CROWD ─────────────────────────────────────────────────────────
export const MarketCrowd = () => {
  interface MWalker { x: number; y: number; sp: number; color: string; size: number; }
  const crowd = useRef<MWalker[]>([]);
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#fef3c7'); bg.addColorStop(1, '#fde68a');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    // Awnings
    ['#ef4444', '#3b82f6', '#22c55e', '#f97316', '#8b5cf6'].forEach((c, i) => { ctx.fillStyle = c + 'cc'; ctx.fillRect(i * w * 0.22 - 20, 0, w * 0.25, h * 0.15); });
    // Stall fronts
    for (let i = 0; i < 5; i++) { ctx.fillStyle = '#1e293b'; ctx.fillRect(i * w * 0.22 - 18, h * 0.15, w * 0.22, h * 0.25); }
    // Colorful goods: fabrics, spices
    ['#f43f5e','#fbbf24','#22c55e','#3b82f6','#f97316'].forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(i * w * 0.22 - 10, h * 0.16, w * 0.18, h * 0.1); });
    // Spice mounds
    [0.1,0.3,0.5,0.7,0.9].forEach((px, i) => { ctx.beginPath(); ctx.arc(px*w, h*0.44, 22, 0, Math.PI*2); ctx.fillStyle=['#f59e0b','#ef4444','#22c55e','#dc2626','#a78bfa'][i]; ctx.fill(); });
    // Crowd
    while (crowd.current.length < 55) crowd.current.push({ x: Math.random() * w, y: h * (0.5 + Math.random() * 0.45), sp: (Math.random() * 2 + 0.5) * (Math.random() > 0.45 ? 1 : -1), color: `hsl(${Math.floor(Math.random() * 360)},45%,38%)`, size: 9 + Math.random() * 6 });
    crowd.current = crowd.current.filter(p => p.x > -40 && p.x < w + 40);
    crowd.current.forEach(p => { p.x += p.sp + Math.sin(t * 0.03 + p.y) * 0.3; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill(); ctx.fillRect(p.x - p.size * 0.45, p.y, p.size * 0.9, p.size * 1.6); });
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 58. CITY TIMELAPSE (village → city) ──────────────────────────────────────
export const CityTimelapse = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const progress = (Math.sin(t * 0.006) * 0.5 + 0.5); // 0 = village, 1 = city
    // Sky - changes from dawn blue to smoggy orange
    const skyTop = `hsl(${200 - progress * 170},${60 - progress * 30}%,${15 + progress * 10}%)`;
    const skyBot = `hsl(${220 - progress * 180},${40 - progress * 20}%,${25 + progress * 20}%)`;
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.6); sky.addColorStop(0, skyTop); sky.addColorStop(1, skyBot);
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.6);
    // Stars fade as city grows
    for (let i = 0; i < 50; i++) { const sx = (Math.sin(i * 89) * 0.5 + 0.5) * w, sy = (Math.cos(i * 137) * 0.5 + 0.5) * h * 0.55; ctx.beginPath(); ctx.arc(sx, sy, 1, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${(1 - progress) * 0.7})`; ctx.fill(); }
    // Ground
    const groundColor = `hsl(${100 - progress * 80},${50 - progress * 40}%,${25 + progress * 10}%)`;
    ctx.fillStyle = groundColor; ctx.fillRect(0, h * 0.6, w, h * 0.4);
    // Trees (fade out as city grows)
    for (let i = 0; i < 14; i++) {
      const tx = (i / 13) * w; const treeOp = 1 - progress * 0.9;
      ctx.globalAlpha = treeOp;
      ctx.fillStyle = '#15803d'; ctx.fillRect(tx - 4, h * 0.45, 8, h * 0.16);
      ctx.beginPath(); ctx.arc(tx, h * 0.44, 18, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }
    // Village Houses (fade out as city grows)
    if (progress < 0.7) {
      ctx.globalAlpha = Math.max(0, 1 - (progress * 1.5));
      [[0.15, 0.52, 40], [0.35, 0.56, 45], [0.65, 0.50, 40], [0.85, 0.55, 35]].forEach(([bx, bh, bw], i) => {
        const hx = bx * w; const hy = h * bh;
        ctx.fillStyle = '#78350f'; // wood cabin
        ctx.fillRect(hx - bw/2, hy, bw, h * 0.6 - hy);
        // Roof
        ctx.beginPath(); ctx.moveTo(hx - bw/2 - 8, hy); ctx.lineTo(hx + bw/2 + 8, hy); ctx.lineTo(hx, hy - 25); ctx.fillStyle = '#451a03'; ctx.fill();
        // Warm window
        if (Math.sin(t * 0.05 + i) > 0) { ctx.fillStyle = 'rgba(251,191,36,0.85)'; ctx.fillRect(hx - 10, hy + 12, 20, 18); }
      });
      ctx.globalAlpha = 1;
    }
    // Buildings growing up (City encroaches)
    [[0.08,0.72],[0.18,0.65],[0.3,0.78],[0.42,0.6],[0.55,0.55],[0.65,0.7],[0.75,0.62],[0.85,0.75],[0.95,0.68]].forEach(([bx,bh],i) => {
      const finalH = h * (1 - +bh);
      const currentH = finalH * Math.max(0, progress - 0.2) * 1.25; // Delay city growth slightly
      if (currentH > 0) {
        const bw = 55 + (i % 3) * 20;
        ctx.fillStyle = '#1e293b'; ctx.fillRect(+bx*w - bw/2, h - currentH, bw, currentH);
        // Windows
        const winOp = Math.max(0, progress - 0.4);
        for(let wi=+bx*w-bw/2+8;wi<+bx*w+bw/2-8;wi+=16) for(let wiy=h-currentH+12;wiy<h-20;wiy+=22) { if(Math.sin(wi*0.2+wiy*0.15+t*0.01)>0&&winOp>0.1) {ctx.fillStyle=`rgba(251,191,36,${winOp*0.5})`;ctx.fillRect(wi,wiy,8,10);} }
      }
    });
    // Roads appearing
    if (progress > 0.4) {
      ctx.globalAlpha = Math.min(1, (progress - 0.4) * 2);
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, h * 0.78, w, h * 0.06);
      for (let ri = 0; ri < w / 100 + 1; ri++) { const rdx = (ri * 100 - (t * 3) % 100) + 0; ctx.fillStyle = '#fbbf24'; ctx.fillRect(rdx, h * 0.8, 50, 4); }
      ctx.globalAlpha = 1;
    }
    // Fast clouds streaking (timelapse effect)
    for (let ci = 0; ci < 3; ci++) {
      const cx2 = ((t * 1.5 + ci * w * 0.4) % (w * 1.5)) - 100;
      ctx.fillStyle = `rgba(255,255,255,${0.2 - progress * 0.15})`;
      ctx.beginPath(); ctx.arc(cx2, h * (0.18 + ci * 0.08), 55, 0, Math.PI * 2); ctx.fill();
    }
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 59. RAIN REFLECTION (full-width wet street) ──────────────────────────────
interface RRDrop { x: number; y: number; vy: number; vx: number; }
export const RainReflection = () => {
  const drops = useRef<RRDrop[]>([]);
  const rips = useRef<{ x: number; y: number; r: number; op: number }[]>([]);
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    // Dark city background
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h * 0.45);
    // City buildings silhouette
    [[0,0.38,80],[0.1,0.28,100],[0.22,0.35,70],[0.34,0.22,120],[0.48,0.3,90],[0.6,0.25,110],[0.72,0.33,80],[0.83,0.4,65],[0.92,0.28,95]].forEach(([bx,bh,bw]) => {
      ctx.fillStyle = '#1e293b'; ctx.fillRect(+bx*w,h*+bh,+bw,h*(0.45-+bh));
      for(let wi=+bx*w+6;wi<+bx*w+ +bw-6;wi+=14) for(let wiy=h*+bh+8;wiy<h*0.43;wiy+=18) { if(Math.sin(wi*0.2+wiy*0.15+t*0.01)>0.2) {ctx.fillStyle='rgba(251,191,36,0.5)';ctx.fillRect(wi,wiy,7,9);} }
    });
    // Neon lights in buildings
    [['#f43f5e',0.12,0.3],['#22d3ee',0.45,0.25],['#f97316',0.7,0.32]].forEach(([c,bx,by]) => {
      const ng=ctx.createRadialGradient(+bx*w,h*+by,0,+bx*w,h*+by,55); ng.addColorStop(0,c+'88'); ng.addColorStop(1,'transparent');
      ctx.fillStyle=ng; ctx.beginPath(); ctx.arc(+bx*w,h*+by,55,0,Math.PI*2); ctx.fill();
    });
    // Wet road
    ctx.fillStyle = '#1e293b'; ctx.fillRect(0, h * 0.45, w, h * 0.55);
    // Perfect reflection
    ctx.save(); ctx.translate(0, h); ctx.scale(1, -1);
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 0, w, h * 0.55);
    [[0,0.38,80],[0.1,0.28,100],[0.22,0.35,70],[0.34,0.22,120],[0.48,0.3,90],[0.6,0.25,110],[0.72,0.33,80],[0.83,0.4,65],[0.92,0.28,95]].forEach(([bx,bh,bw]) => { ctx.fillStyle = '#1e293b'; ctx.fillRect(+bx*w, h*+bh, +bw, h*(0.45-+bh)); });
    [['#f43f5e',0.12,0.3],['#22d3ee',0.45,0.25],['#f97316',0.7,0.32]].forEach(([c,bx,by]) => { const ng=ctx.createRadialGradient(+bx*w,h*+by,0,+bx*w,h*+by,55); ng.addColorStop(0,c+'88'); ng.addColorStop(1,'transparent'); ctx.fillStyle=ng; ctx.beginPath(); ctx.arc(+bx*w, h*+by, 55, 0, Math.PI*2); ctx.fill(); });
    ctx.globalAlpha = 1; ctx.restore();
    // Rain falling
    while (drops.current.length < 200) drops.current.push({ x: Math.random() * w, y: -20, vy: Math.random() * 14 + 8, vx: -1.5 });
    drops.current = drops.current.filter(d => d.y < h + 20);
    drops.current.forEach(d => {
      d.y += d.vy; d.x += d.vx;
      if (d.y >= h * 0.45) rips.current.push({ x: d.x, y: h * 0.455, r: 0, op: 0.8 });
      ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + d.vx * 2, d.y - 20);
      ctx.strokeStyle = 'rgba(147,197,253,0.4)'; ctx.lineWidth = 1; ctx.stroke();
    });
    drops.current = drops.current.filter(d => d.y < h * 0.45);
    rips.current = rips.current.filter(r => r.op > 0.02);
    rips.current.forEach(r => { r.r += 1.8; r.op -= 0.022; ctx.beginPath(); ctx.ellipse(r.x, r.y, r.r, r.r * 0.3, 0, 0, Math.PI * 2); ctx.strokeStyle = `rgba(148,163,184,${r.op})`; ctx.lineWidth = 1; ctx.stroke(); });
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 60. ZEBRA CROSSING (busy crosswalk) ──────────────────────────────────────
interface ZWalker { x: number; y: number; sp: number; dir: 1 | -1; color: string; }
export const ZebraCrossing = () => {
  const walkers = useRef<ZWalker[]>([]);
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#38bdf8'); bg.addColorStop(0.4, '#bae6fd'); bg.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h * 0.5);
    // Buildings
    [[0,0.25,90],[0.12,0.15,110],[0.25,0.3,80],[0.38,0.1,130],[0.55,0.22,95],[0.68,0.28,75],[0.78,0.18,105],[0.9,0.25,85]].forEach(([bx,bh,bw]) => { ctx.fillStyle='#94a3b8'; ctx.fillRect(+bx*w,h*+bh,+bw,h*(0.5-+bh)); });
    // Road
    ctx.fillStyle = '#374151'; ctx.fillRect(0, h * 0.5, w, h * 0.5);
    // Traffic waiting
    ['#ef4444','#3b82f6','#fbbf24'].forEach((c, i) => {
      const carX = w * 0.05 + i * 35; const carY = h * 0.62;
      ctx.fillStyle = c; ctx.fillRect(carX - 25, carY - 14, 50, 14);
      ctx.fillStyle = 'rgba(147,197,253,0.5)'; ctx.fillRect(carX - 20, carY - 26, 40, 14);
      [carX - 18, carX + 18].forEach(wx2 => { ctx.beginPath(); ctx.arc(wx2, carY, 8, 0, Math.PI * 2); ctx.fillStyle = '#1e293b'; ctx.fill(); });
    });
    // Zebra stripes
    for (let s = 0; s < 10; s++) { const sy = h * 0.68 + s * 12; ctx.fillStyle = s % 2 === 0 ? '#f1f5f9' : '#374151'; ctx.fillRect(w * 0.25, sy, w * 0.5, 12); }
    // Walk sign (green)
    ctx.fillStyle = '#22c55e'; ctx.fillRect(w * 0.24 - 14, h * 0.52, 22, 32);
    ctx.fillStyle = '#f0fdf4'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('WALK', w * 0.24 - 3, h * 0.54);
    // Walkers crossing
    if (Math.sin(t * 0.02) > 0) {
      while (walkers.current.length < 18) walkers.current.push({ x: w * (Math.random() > 0.5 ? 0.25 : 0.75), y: h * (0.7 + Math.random() * 0.15), sp: (Math.random() * 1.5 + 0.8), dir: Math.random() > 0.5 ? 1 : -1, color: `hsl(${Math.random()*360},45%,40%)` });
      walkers.current = walkers.current.filter(p => p.x > w * 0.23 && p.x < w * 0.78);
      walkers.current.forEach(p => {
        p.x += p.sp * p.dir;
        const leg = Math.sin(t * 0.2 + p.y) * 8;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y - 20, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(p.x - 5, p.y - 13, 10, 18);
        ctx.beginPath(); ctx.moveTo(p.x, p.y + 5); ctx.lineTo(p.x - leg, p.y + 22); ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 3; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(p.x, p.y + 5); ctx.lineTo(p.x + leg, p.y + 22); ctx.stroke();
      });
    }
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};
