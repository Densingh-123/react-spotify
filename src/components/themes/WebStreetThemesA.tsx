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

// ─── 43. METRO RIDE (daytime elevated commute) ────────────────────────────────────
export const MetroRide = () => {
  const state = useRef({ worldX: 0, phase: 'moving', timer: 0, platformWorldOffset: -9999 });

  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);

    // --- State Machine ---
    state.current.timer++;
    const timer = state.current.timer;
    let speed = 25; // Base high speed
    let doorsOpen = 0;
    let personProgress = -1; // -1 means hidden

    if (state.current.phase === 'moving') {
      if (timer > 250) { 
        state.current.phase = 'slowing'; 
        state.current.timer = 0; 
        // Distance traveled during slowing = (25 / 2) * 80 frames = 1000
        state.current.platformWorldOffset = state.current.worldX + 1000 + w/2;
      }
    } else if (state.current.phase === 'slowing') {
      const p = timer / 80;
      speed = 25 * (1 - p);
      if (timer > 80) { state.current.phase = 'stopped'; state.current.timer = 0; }
    } else if (state.current.phase === 'stopped') {
      speed = 0;
      if (timer <= 30) {
        doorsOpen = timer / 30; // opening
      } else if (timer <= 110) {
        doorsOpen = 1;
        // Person walking in (frames 30 to 110 = 80 frames)
        personProgress = (timer - 30) / 80;
      } else if (timer <= 140) {
        doorsOpen = 1 - (timer - 110) / 30; // closing
      } else if (timer > 160) {
        state.current.phase = 'accelerating'; state.current.timer = 0;
      }
    } else if (state.current.phase === 'accelerating') {
      const p = timer / 80;
      speed = 25 * p;
      if (timer > 80) { state.current.phase = 'moving'; state.current.timer = 0; }
    }

    state.current.worldX += speed;
    const wx = state.current.worldX;


    // --- Layer 1: Sky & Sun ---
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.6);
    sky.addColorStop(0, '#38bdf8'); sky.addColorStop(1, '#e0f2fe');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
    
    // Sun
    const sunG = ctx.createRadialGradient(w * 0.8, h * 0.2, 0, w * 0.8, h * 0.2, 80);
    sunG.addColorStop(0, '#fef08a'); sunG.addColorStop(1, 'transparent');
    ctx.fillStyle = sunG; ctx.beginPath(); ctx.arc(w * 0.8, h * 0.2, 80, 0, Math.PI*2); ctx.fill();

    // Clouds
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    [[0.2, 0.15, 60], [0.6, 0.25, 80], [0.85, 0.1, 50]].forEach(([cx, cy, cw], i) => {
       const clx = ((cx * w - t * 0.2 * (i+1)) % (w + 200) + w + 200) % (w + 200) - 100;
       ctx.beginPath(); ctx.ellipse(clx, cy * h, cw, cw*0.35, 0, 0, Math.PI*2); ctx.fill();
    });

    // --- Layer 2: Distant City (Layer 1) ---
    ctx.fillStyle = '#bae6fd';
    for (let i = -1; i < w / 100 + 2; i++) {
       const bx = ((i * 100 - wx * 0.05) % (w + 100) + w + 100) % (w + 100) - 100;
       const bidx = Math.floor((i * 100 - wx * 0.05) / 100);
       const bh = h * (0.3 + Math.abs(Math.sin(bidx * 79)) * 0.3);
       ctx.fillRect(bx, h * 0.6 - bh, 80, bh);
    }

    // --- Layer 3: Closer City (Layer 2) ---
    ctx.fillStyle = '#94a3b8';
    for (let i = -1; i < w / 150 + 2; i++) {
       const bx = ((i * 150 - wx * 0.15) % (w + 150) + w + 150) % (w + 150) - 150;
       const bidx = Math.floor((i * 150 - wx * 0.15) / 150);
       const bh = h * (0.2 + Math.abs(Math.cos(bidx * 137)) * 0.3);
       ctx.fillRect(bx, h * 0.65 - bh, 120, bh);
       ctx.fillStyle = '#cbd5e1'; // Windows
       if (Math.abs(Math.sin(bidx)) > 0.3) {
           ctx.fillRect(bx + 20, h * 0.65 - bh + 20, 20, 30);
           ctx.fillRect(bx + 60, h * 0.65 - bh + 20, 20, 30);
       }
       ctx.fillStyle = '#94a3b8';
    }

    // --- Layer 4: Trees & Ground ---
    ctx.fillStyle = '#166534';
    ctx.fillRect(0, h * 0.6, w, h * 0.4); // Ground
    
    for (let i = -1; i < w / 200 + 2; i++) {
       const tx_tree = ((i * 200 - wx * 0.4) % (w + 200) + w + 200) % (w + 200) - 200;
       const tidx = Math.floor((i * 200 - wx * 0.4) / 200);
       
       // Trunk
       ctx.fillStyle = '#78350f';
       ctx.fillRect(tx_tree + 25, h * 0.5, 10, h * 0.15);
       
       // Leaves
       ctx.fillStyle = Math.sin(tidx) > 0 ? '#15803d' : '#14532d';
       ctx.beginPath(); ctx.arc(tx_tree + 30, h * 0.45, 40, 0, Math.PI*2); ctx.fill();
       ctx.beginPath(); ctx.arc(tx_tree + 15, h * 0.48, 30, 0, Math.PI*2); ctx.fill();
       ctx.beginPath(); ctx.arc(tx_tree + 45, h * 0.48, 30, 0, Math.PI*2); ctx.fill();
    }

    // --- Layer 5: Platform ---
    const pX = state.current.platformWorldOffset - wx;
    if (pX > -w && pX < w * 2) {
       const statW = 1200;
       const sx = pX - statW/2;
       
       ctx.fillStyle = '#cbd5e1'; // Concrete platform
       ctx.fillRect(sx, h * 0.55, statW, h * 0.2);
       
       // Yellow warning line
       ctx.fillStyle = '#eab308';
       ctx.fillRect(sx, h * 0.72, statW, 8);
       
       // Roof/Pillars
       ctx.fillStyle = '#94a3b8';
       for(let px_pil = sx + 50; px_pil < sx + statW; px_pil += 300) {
           ctx.fillRect(px_pil, h * 0.1, 20, h * 0.45);
       }
       ctx.fillStyle = '#f1f5f9'; // Roof
       ctx.fillRect(sx, h * 0.05, statW, h * 0.05);
       
       // Station Sign
       ctx.fillStyle = '#0284c7';
       ctx.fillRect(sx + statW/2 - 80, h * 0.3, 160, 40);
       ctx.fillStyle = '#ffffff';
       ctx.font = `bold ${Math.max(16, h * 0.03)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
       ctx.fillText("CITY CENTER", sx + statW/2, h * 0.3 + 20);

       // Boarding Person
       if (personProgress >= 0) {
           const depth = personProgress; // 0 to 1
           const scale = 1 + depth * 0.6;
           const personDrawX = sx + statW/2;
           const personDrawY = h * 0.6 + depth * h * 0.1; 
           
           ctx.save();
           ctx.translate(personDrawX, personDrawY);
           ctx.scale(scale, scale);
           
           ctx.fillStyle = '#1e293b'; 
           const bob_p = Math.sin(depth * Math.PI * 10) * 4;
           
           // Head
           ctx.beginPath(); ctx.arc(0, -50 + bob_p, 12, 0, Math.PI*2); ctx.fill();
           // Body
           ctx.fillRect(-15, -35 + bob_p, 30, 45);
           // Legs
           const leg1 = Math.sin(depth * Math.PI * 10) * 15;
           const leg2 = -leg1;
           ctx.beginPath(); ctx.moveTo(-5, 10 + bob_p); ctx.lineTo(-5 + leg1, 35); ctx.lineWidth = 10; ctx.strokeStyle = '#1e293b'; ctx.stroke();
           ctx.beginPath(); ctx.moveTo(5, 10 + bob_p); ctx.lineTo(5 + leg2, 35); ctx.stroke();
           
           ctx.restore();
       }
    }

    // --- Layer 6: The Train ---
    const bob = speed > 0 ? Math.sin(t * 0.4) * (speed * 0.1) : 0;
    const ty = h * 0.35 + bob;
    const th = h * 0.5;

    const doorW = w * 0.2;
    const doorX = w/2 - doorW/2;
    
    // Train interior back wall
    ctx.fillStyle = '#334155'; ctx.fillRect(doorX, ty + th * 0.2, doorW, th * 0.7);
    // Interior light strips
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(doorX, ty + th * 0.25, doorW, 8);
    // Floor
    ctx.fillStyle = '#1e293b'; ctx.fillRect(doorX, ty + th * 0.85, doorW, th * 0.05);

    // Train Exterior
    ctx.fillStyle = '#e2e8f0'; 
    ctx.fillRect(0, ty, doorX, th); 
    ctx.fillRect(doorX + doorW, ty, w - (doorX + doorW), th);
    
    ctx.fillRect(doorX, ty, doorW, th * 0.2); // Roof edge above door
    ctx.fillRect(doorX, ty + th * 0.9, doorW, th * 0.1); // Under door

    // Blue accent stripe
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, ty + th * 0.8, w, th * 0.05);

    // Continuous dark window band
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, ty + th * 0.2, doorX, th * 0.4);
    ctx.fillRect(doorX + doorW, ty + th * 0.2, w - (doorX + doorW), th * 0.4);

    // Reflection on exterior windows
    const windowG = ctx.createLinearGradient(0, ty + th * 0.2, 0, ty + th * 0.6);
    windowG.addColorStop(0, 'rgba(255,255,255,0.2)'); windowG.addColorStop(1, 'transparent');
    ctx.fillStyle = windowG;
    ctx.fillRect(0, ty + th * 0.2, doorX, th * 0.4);
    ctx.fillRect(doorX + doorW, ty + th * 0.2, w - (doorX + doorW), th * 0.4);

    // The Sliding Doors
    ctx.fillStyle = '#f1f5f9';
    const slide = doorsOpen * (doorW * 0.48);
    ctx.fillRect(doorX - slide, ty + th * 0.2, doorW/2, th * 0.7); // Left
    ctx.fillRect(doorX + doorW/2 + slide, ty + th * 0.2, doorW/2, th * 0.7); // Right
    
    // Door glass
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(doorX - slide + 8, ty + th * 0.25, doorW/2 - 16, th * 0.4);
    ctx.fillRect(doorX + doorW/2 + slide + 8, ty + th * 0.25, doorW/2 - 16, th * 0.4);

    // --- Layer 7: Foreground Railings / Blur ---
    const fgSpeed = speed * 1.5;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, h * 0.9, w, h * 0.1); 
    
    if (fgSpeed > 0) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.4)'; 
        const fgSpacing = 600;
        for(let i = 0; i < 4; i++) {
            const fgX = ((i * fgSpacing - wx * 1.5) % (w + fgSpacing) + w + fgSpacing) % (w + fgSpacing) - fgSpacing;
            ctx.fillRect(fgX, 0, 40 + fgSpeed * 2.5, h); 
        }
    }
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
