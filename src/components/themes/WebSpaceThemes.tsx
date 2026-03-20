import React, { useEffect, useRef, useMemo } from 'react';

// ─── Shared canvas hook ───────────────────────────────────────────────────────
export function useCanvas(draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let t = 0, raf = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const loop = () => { draw(ctx, canvas.width, canvas.height, t++); raf = requestAnimationFrame(loop); };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return ref;
}

// ─── 1. TWINKLING STARS ──────────────────────────────────────────────────────
export const TwinklingStars = () => {
  const stars = useMemo(() => Array.from({ length: 280 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 2 + 0.3,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.02 + 0.005,
    color: Math.random() > 0.8 ? '#a8d4ff' : '#ffffff',
    baseOpacity: Math.random() * 0.5 + 0.3,
  })), []);

  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    // Deep space gradient
    const bg = ctx.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.5, Math.max(w, h));
    bg.addColorStop(0, '#0a1628');
    bg.addColorStop(0.5, '#050a1b');
    bg.addColorStop(1, '#020619');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

    stars.forEach(s => {
      const op = s.baseOpacity + Math.sin(t * s.speed + s.phase) * 0.4;
      const x = s.x * w, y = s.y * h;
      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.max(0.05, op);
      ctx.fill();
      if (s.r > 1.5) {
        ctx.shadowColor = s.color; ctx.shadowBlur = s.r * 4;
        ctx.fill(); ctx.shadowBlur = 0;
      }
    });
    ctx.globalAlpha = 1;
  });
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// ─── 2. GALAXY SPIRAL ────────────────────────────────────────────────────────
export const GalaxySpiral = () => {
  const pts = useMemo(() => {
    const arr: {x:number,y:number,r:number,c:string,arm:number}[] = [];
    for (let i = 0; i < 800; i++) {
      const arm = i % 2;
      const angle = i * 0.28 + arm * Math.PI;
      const radius = i * 0.32;
      const scatter = (Math.random() - 0.5) * 28;
      arr.push({
        x: Math.cos(angle) * radius + scatter,
        y: Math.sin(angle) * radius * 0.45 + scatter * 0.4,
        r: Math.random() * 2 + 0.3,
        c: ['#c084fc','#818cf8','#f0abfc','#a5b4fc','#e879f9'][Math.floor(Math.random()*5)],
        arm,
      });
    }
    return arr;
  }, []);

  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)*0.7);
    bg.addColorStop(0,'#1e0040'); bg.addColorStop(0.5,'#0b001e'); bg.addColorStop(1,'#000000');
    ctx.fillStyle = bg; ctx.fillRect(0,0,w,h);

    const angle = t * 0.003;
    const zoom = 1 + Math.sin(t * 0.002) * 0.06;
    ctx.save(); ctx.translate(w/2, h/2); ctx.rotate(angle); ctx.scale(zoom, zoom);

    pts.forEach(p => {
      const op = 0.6 - (Math.hypot(p.x, p.y) / 280) * 0.45;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0.05, op); ctx.fill();
    });
    // Core glow
    const core = ctx.createRadialGradient(0,0,0,0,0,55);
    core.addColorStop(0,'rgba(255,255,255,1)'); core.addColorStop(0.3,'rgba(243,168,255,0.7)');
    core.addColorStop(0.7,'rgba(124,58,237,0.3)'); core.addColorStop(1,'transparent');
    ctx.globalAlpha = 1; ctx.fillStyle = core;
    ctx.beginPath(); ctx.arc(0,0,55,0,Math.PI*2); ctx.fill();
    ctx.restore();
  });
  return <canvas ref={ref} style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} />;
};

// ─── 3. SHOOTING STARS ───────────────────────────────────────────────────────
interface Streak { x:number; y:number; vx:number; vy:number; len:number; life:number; maxLife:number; }
export const ShootingStars = () => {
  const bgStars = useMemo(() => Array.from({length:150},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.5+0.3,op:Math.random()*0.6+0.3})),[]);
  const streaks = useRef<Streak[]>([]);
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#030712'; ctx.fillRect(0,0,w,h);
    bgStars.forEach(s => {
      ctx.beginPath(); ctx.arc(s.x*w, s.y*h, s.r, 0, Math.PI*2);
      ctx.fillStyle='#fff'; ctx.globalAlpha=s.op*(0.6+Math.sin(t*0.01+s.x*10)*0.4); ctx.fill();
    });
    ctx.globalAlpha = 1;
    // Spawn streaks
    if (Math.random() < 0.025) {
      streaks.current.push({
        x: Math.random()*w*0.8+w*0.1, y: Math.random()*h*0.35,
        vx: -(Math.random()*8+6), vy: Math.random()*5+3,
        len: Math.random()*120+60, life:0, maxLife:55,
      });
    }
    streaks.current = streaks.current.filter(s => s.life < s.maxLife);
    streaks.current.forEach(s => {
      const op = s.life < 8 ? s.life/8 : (s.maxLife - s.life)/s.maxLife;
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * (s.len/10), s.y - s.vy * (s.len/10));
      grad.addColorStop(0, `rgba(255,255,255,${op})`);
      grad.addColorStop(0.4, `rgba(180,220,255,${op*0.6})`);
      grad.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx*(s.len/10), s.y - s.vy*(s.len/10));
      ctx.strokeStyle = grad; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.shadowColor='#9dd8ff'; ctx.shadowBlur=8;
      ctx.beginPath(); ctx.arc(s.x,s.y,2,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${op})`; ctx.fill(); ctx.shadowBlur=0;
      s.x+=s.vx; s.y+=s.vy; s.life++;
    });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 4. NEBULA CLOUDS ────────────────────────────────────────────────────────
export const NebulaClouds = () => {
  const blobs = useMemo(() => [
    {bx:0.2,by:0.3,c:'#f472b6',s:320,sp:0.003,ph:0},
    {bx:0.8,by:0.2,c:'#818cf8',s:360,sp:0.0025,ph:1.2},
    {bx:0.5,by:0.6,c:'#22d3ee',s:280,sp:0.0035,ph:2.4},
    {bx:0.1,by:0.7,c:'#c084fc',s:240,sp:0.003,ph:0.8},
    {bx:0.9,by:0.8,c:'#fb7185',s:220,sp:0.0028,ph:3.1},
    {bx:0.5,by:0.12,c:'#a78bfa',s:340,sp:0.002,ph:1.8},
  ], []);

  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,w,h);
    blobs.forEach(b => {
      const ox = Math.sin(t*b.sp+b.ph)*32;
      const oy = Math.cos(t*b.sp*0.7+b.ph)*22;
      const cx2 = b.bx*w+ox, cy2 = b.by*h+oy;
      const g = ctx.createRadialGradient(cx2,cy2,0,cx2,cy2,b.s);
      g.addColorStop(0,b.c+'66'); g.addColorStop(0.4,b.c+'44'); g.addColorStop(1,'transparent');
      ctx.fillStyle=g; ctx.globalAlpha=0.9;
      ctx.beginPath(); ctx.arc(cx2,cy2,b.s,0,Math.PI*2); ctx.fill();
    });
    // starfield over
    ctx.globalAlpha=0.4;
    for(let i=0;i<80;i++){
      const sx=(Math.sin(i*127.3)*0.5+0.5)*w, sy=(Math.cos(i*311.7)*0.5+0.5)*h;
      ctx.beginPath(); ctx.arc(sx,sy,Math.random()*1.5+0.3,0,Math.PI*2);
      ctx.fillStyle='#fff'; ctx.fill();
    }
    ctx.globalAlpha=1;
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 5. FLOATING PLANETS ─────────────────────────────────────────────────────
export const FloatingPlanets = () => {
  const planets = useMemo(() => [
    {bx:0.5,by:0.3,r:70,c1:'#60a5fa',c2:'#1e3a8a',ring:true,sp:0.004,ph:0},
    {bx:0.18,by:0.65,r:44,c1:'#f97316',c2:'#7c2d12',ring:false,sp:0.0055,ph:2},
    {bx:0.8,by:0.55,r:54,c1:'#34d399',c2:'#064e3b',ring:false,sp:0.0045,ph:4},
    {bx:0.12,by:0.22,r:28,c1:'#a78bfa',c2:'#4c1d95',ring:false,sp:0.006,ph:1},
    {bx:0.85,by:0.2,r:20,c1:'#fbbf24',c2:'#78350f',ring:false,sp:0.007,ph:3},
  ],[]);
  const stars = useMemo(()=>Array.from({length:120},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.5+0.2,op:Math.random()*0.7+0.2})),[]);

  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    const bg=ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0,'#000000'); bg.addColorStop(1,'#050510');
    ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    // stars
    stars.forEach(s=>{ctx.beginPath();ctx.arc(s.x*w,s.y*h,s.r,0,Math.PI*2);ctx.fillStyle='#fff';ctx.globalAlpha=s.op*(0.7+Math.sin(t*0.015+s.x*5)*0.3);ctx.fill();});
    ctx.globalAlpha=1;

    planets.forEach(p => {
      const ox=Math.sin(t*p.sp+p.ph)*28, oy=Math.cos(t*p.sp*0.8+p.ph)*14;
      const cx=p.bx*w+ox, cy=p.by*h+oy;
      ctx.save(); ctx.translate(cx,cy);
      // ring
      if(p.ring){
        ctx.save(); ctx.scale(1,0.28);
        ctx.beginPath(); ctx.arc(0,0,p.r+16,0,Math.PI*2);
        ctx.strokeStyle=p.c1+'88'; ctx.lineWidth=10; ctx.stroke();
        ctx.restore();
      }
      // planet sphere
      const sg=ctx.createRadialGradient(-p.r*0.3,-p.r*0.3,p.r*0.1,-p.r*0.1,-p.r*0.1,p.r*1.2);
      sg.addColorStop(0,'rgba(255,255,255,0.5)'); sg.addColorStop(0.3,p.c1); sg.addColorStop(1,p.c2);
      ctx.beginPath(); ctx.arc(0,0,p.r,0,Math.PI*2);
      ctx.fillStyle=sg; ctx.fill();
      ctx.shadowColor=p.c1; ctx.shadowBlur=25; ctx.fill(); ctx.shadowBlur=0;
      ctx.restore();
    });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 6. ASTEROID FIELD ───────────────────────────────────────────────────────
export const AsteroidField = () => {
  interface Asteroid { x:number;y:number;z:number;sz:number;rot:number;rotV:number;color:string; }
  const asteroids = useRef<Asteroid[]>([]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle='#111'; ctx.fillRect(0,0,w,h);
    // Stars
    for(let i=0;i<80;i++){const sx=(Math.sin(i*73)*0.5+0.5)*w,sy=(Math.cos(i*137)*0.5+0.5)*h;ctx.beginPath();ctx.arc(sx,sy,0.8,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.6)';ctx.fill();}
    // Init
    if(asteroids.current.length<30) {
      for(let i=0;i<30;i++) asteroids.current.push({x:Math.random()*w,y:Math.random()*h,z:Math.random()*2+0.2,sz:Math.random()*24+6,rot:Math.random()*Math.PI*2,rotV:(Math.random()-0.5)*0.03,color:['#78716c','#a8a29e','#57534e','#d6d3d1'][Math.floor(Math.random()*4)]});
    }
    asteroids.current.forEach(a=>{
      a.z+=0.012; a.rot+=a.rotV;
      const scale=a.z; const ax=w/2+(a.x-w/2)*scale,ay=h/2+(a.y-h/2)*scale;
      if(a.z>4||ax<-100||ax>w+100||ay<-100||ay>h+100){a.x=Math.random()*w;a.y=Math.random()*h;a.z=0.1;}
      const sz=a.sz*scale;
      ctx.save(); ctx.translate(ax,ay); ctx.rotate(a.rot);
      ctx.beginPath();
      ctx.ellipse(0,0,sz,sz*0.72,0,0,Math.PI*2);
      const ag=ctx.createRadialGradient(-sz*0.3,-sz*0.3,0,0,0,sz);
      ag.addColorStop(0,'rgba(255,255,255,0.15)'); ag.addColorStop(0.5,a.color); ag.addColorStop(1,'#1c1917');
      ctx.fillStyle=ag; ctx.globalAlpha=Math.min(1,scale*0.5); ctx.fill();
      ctx.restore();
    });
    ctx.globalAlpha=1;
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 7. BLACK HOLE ───────────────────────────────────────────────────────────
export const BlackHole = () => {
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h); ctx.fillStyle='#000'; ctx.fillRect(0,0,w,h);
    // Stars background
    for(let i=0;i<100;i++){const sx=(Math.sin(i*157)*0.5+0.5)*w,sy=(Math.cos(i*277)*0.5+0.5)*h;ctx.beginPath();ctx.arc(sx,sy,0.6,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fill();}
    const cx=w/2,cy=h/2,rot=t*0.025;
    // Accretion disk outer glow
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(rot); ctx.scale(1,0.22);
    for(let i=4;i>=1;i--){
      const r=95+i*20;
      const hue=30+i*8;
      ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2);
      ctx.strokeStyle=`hsla(${hue},100%,${45+i*5}%,${0.18+i*0.12})`; ctx.lineWidth=18-i*2; ctx.stroke();
    }
    ctx.restore();
    // Main disk
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(rot); ctx.scale(1,0.2);
    const disk=ctx.createRadialGradient(0,0,42,0,0,160);
    disk.addColorStop(0,'#000'); disk.addColorStop(0.36,'#000');
    disk.addColorStop(0.5,`hsl(${35+Math.sin(t*0.03)*8},100%,55%)`);
    disk.addColorStop(0.68,'rgba(220,38,38,0.6)'); disk.addColorStop(0.85,'rgba(100,20,10,0.3)'); disk.addColorStop(1,'transparent');
    ctx.fillStyle=disk; ctx.beginPath(); ctx.arc(0,0,170,0,Math.PI*2); ctx.fill();
    ctx.restore();
    // Event horizon
    const eh=ctx.createRadialGradient(cx,cy,0,cx,cy,48);
    eh.addColorStop(0,'#000'); eh.addColorStop(0.8,'#000'); eh.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=eh; ctx.beginPath(); ctx.arc(cx,cy,52,0,Math.PI*2); ctx.fill();
    // Gravitational lens ring
    ctx.beginPath(); ctx.arc(cx,cy,52,0,Math.PI*2);
    ctx.strokeStyle=`rgba(251,191,36,${0.3+Math.sin(t*0.04)*0.1})`; ctx.lineWidth=3; ctx.stroke();
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 8. CONSTELLATIONS ───────────────────────────────────────────────────────
const CSTARS=[{x:.2,y:.2},{x:.35,y:.15},{x:.5,y:.25},{x:.65,y:.18},{x:.3,y:.4},{x:.55,y:.45},{x:.75,y:.35},{x:.15,y:.6},{x:.4,y:.65},{x:.6,y:.7},{x:.8,y:.6},{x:.25,y:.8},{x:.5,y:.82},{x:.7,y:.78},{x:.9,y:.3},{x:.45,y:.1},{x:.7,y:.5},{x:.1,y:.45}];
const LINES=[[0,1],[1,2],[2,3],[4,5],[5,6],[7,8],[8,9],[9,10],[11,12],[12,13],[2,5],[5,9],[0,4],[3,6],[15,1],[15,2],[16,6],[16,10],[7,11],[17,4]];
export const Constellations = () => {
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    const bg=ctx.createLinearGradient(0,0,0,h); bg.addColorStop(0,'#020617'); bg.addColorStop(1,'#0a0f23');
    ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    // Bg stars
    for(let i=0;i<120;i++){const sx=(Math.sin(i*89)*0.5+0.5)*w,sy=(Math.cos(i*173)*0.5+0.5)*h;ctx.beginPath();ctx.arc(sx,sy,0.5,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${0.3+Math.sin(i)*0.3})`;ctx.fill();}
    // Lines
    const lineOp=0.35+Math.sin(t*0.012)*0.2;
    LINES.forEach(([a,b])=>{
      ctx.beginPath(); ctx.moveTo(CSTARS[a].x*w,CSTARS[a].y*h); ctx.lineTo(CSTARS[b].x*w,CSTARS[b].y*h);
      ctx.strokeStyle=`rgba(96,165,250,${lineOp})`; ctx.lineWidth=0.8; ctx.stroke();
    });
    // Star nodes
    CSTARS.forEach((s,i)=>{
      const op=0.6+Math.sin(t*0.015+i*0.7)*0.4;
      const x=s.x*w,y=s.y*h;
      ctx.shadowColor='#a5b4fc'; ctx.shadowBlur=12;
      ctx.beginPath(); ctx.arc(x,y,3.5,0,Math.PI*2);
      ctx.fillStyle=`rgba(199,210,254,${op})`; ctx.fill();
      ctx.shadowBlur=0;
    });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};
