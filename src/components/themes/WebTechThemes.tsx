import React, { useEffect, useRef, useMemo } from 'react';
import { useCanvas } from './WebSpaceThemes';

// ─── 21. SNOWFALL (Winter scene) ─────────────────────────────────────────────
export const SnowfallScene = () => {
  interface Flake { x:number; y:number; r:number; vy:number; vx:number; op:number; }
  const flakes = useRef<Flake[]>([]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    const bg=ctx.createLinearGradient(0,0,0,h); bg.addColorStop(0,'#1e293b'); bg.addColorStop(0.6,'#334155'); bg.addColorStop(1,'#475569');
    ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    // Trees silhouette
    for(let i=0;i<10;i++){const tx=w*(i/9),th=h*(0.25+Math.sin(i*1.7)*0.08);ctx.beginPath();ctx.moveTo(tx,h*0.65);ctx.lineTo(tx-22,h*0.65-th);ctx.lineTo(tx+22,h*0.65-th);ctx.closePath();ctx.fillStyle='rgba(15,23,42,0.95)';ctx.fill();}
    // Snowy ground
    ctx.fillStyle='#e2e8f0'; ctx.beginPath(); ctx.ellipse(w/2,h,w*0.7,h*0.18,0,0,Math.PI*2); ctx.fill();
    // Snowflakes
    while(flakes.current.length<120) flakes.current.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*4+1.5,vy:Math.random()*1.5+0.5,vx:(Math.random()-0.5)*0.8,op:Math.random()*0.5+0.5});
    flakes.current=flakes.current.filter(f=>f.y<h+10);
    flakes.current.forEach(f=>{
      f.y+=f.vy; f.x+=f.vx+Math.sin(t*0.01+f.x)*0.3;
      const blur=f.r>3?0.6:f.r>2?1:1.4;
      ctx.shadowBlur=f.r*4; ctx.shadowColor='rgba(255,255,255,0.5)';
      ctx.beginPath(); ctx.arc(f.x,f.y,f.r*blur,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${f.op})`; ctx.fill();
    });
    ctx.shadowBlur=0;
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 22. BUTTERFLIES (Garden) ─────────────────────────────────────────────────
export const ButterfliesGarden = () => {
  const bflies = useMemo(()=>Array.from({length:12},(_,i)=>({x:Math.random(),y:Math.random()*0.8,phase:i*0.52,sp:0.003+Math.random()*0.002,c:['#f97316','#3b82f6','#f59e0b','#22c55e','#ec4899'][i%5],size:25+Math.random()*20})),[]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    const bg=ctx.createLinearGradient(0,0,0,h); bg.addColorStop(0,'#86efac'); bg.addColorStop(0.5,'#d9f99d'); bg.addColorStop(1,'#bbf7d0');
    ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    // Flowers
    for(let i=0;i<20;i++){const fx=w*(i/19),fy=h*(0.7+Math.sin(i)*0.1);['#f43f5e','#f97316','#a78bfa','#fbbf24','#22d3ee'].forEach((c,j)=>{ctx.beginPath();ctx.arc(fx+Math.cos(j*72*Math.PI/180)*14,fy+Math.sin(j*72*Math.PI/180)*14,8,0,Math.PI*2);ctx.fillStyle=c+'cc';ctx.fill();});ctx.beginPath();ctx.arc(fx,fy,7,0,Math.PI*2);ctx.fillStyle='#fef08a';ctx.fill();}
    // Butterfly draw
    bflies.forEach(b=>{
      const bx=(b.x+t*b.sp)%1.1*w, by=b.y*h+Math.sin(t*b.sp*8+b.phase)*30;
      const wingFlap=Math.abs(Math.sin(t*0.15+b.phase));
      const sz=b.size*wingFlap;
      ctx.save(); ctx.translate(bx,by);
      // Upper wings
      ctx.beginPath(); ctx.ellipse(-sz,0,sz,sz*0.7,0.3,0,Math.PI*2); ctx.fillStyle=b.c+'cc'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(sz,0,sz,sz*0.7,-0.3,0,Math.PI*2); ctx.fillStyle=b.c+'cc'; ctx.fill();
      // Lower wings
      ctx.beginPath(); ctx.ellipse(-sz*0.5,sz*0.4,sz*0.55,sz*0.45,0.5,0,Math.PI*2); ctx.fillStyle=b.c+'99'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(sz*0.5,sz*0.4,sz*0.55,sz*0.45,-0.5,0,Math.PI*2); ctx.fillStyle=b.c+'99'; ctx.fill();
      // Body
      ctx.beginPath(); ctx.ellipse(0,0,3,sz*0.4,0,0,Math.PI*2); ctx.fillStyle='#1e293b'; ctx.fill();
      ctx.restore();
    });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 23. GRASS WIND ──────────────────────────────────────────────────────────
export const GrassWind = () => {
  const blades = useMemo(()=>Array.from({length:80},(_,i)=>({x:i/79,h:0.18+Math.random()*0.2,sp:Math.random()*0.02+0.008,ph:Math.random()*Math.PI*2,c:['#16a34a','#15803d','#22c55e','#4ade80'][Math.floor(Math.random()*4)]})),[]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    const sky=ctx.createLinearGradient(0,0,0,h); sky.addColorStop(0,'#38bdf8'); sky.addColorStop(0.6,'#bae6fd'); sky.addColorStop(1,'#e0f2fe');
    ctx.fillStyle=sky; ctx.fillRect(0,0,w,h);
    // Sun
    ctx.fillStyle='rgba(255,230,100,0.85)'; ctx.beginPath(); ctx.arc(w*0.8,h*0.15,65,0,Math.PI*2); ctx.fill();
    // Ground
    ctx.fillStyle='#166534'; ctx.fillRect(0,h*0.7,w,h*0.3);
    // Wave visual - cascading sway
    const waveOff=Math.sin(t*0.018)*0.4;
    blades.forEach(b=>{
      const bx=b.x*w;
      const baseY=h*0.7;
      const bladeH=h*b.h;
      const sway=(Math.sin(t*b.sp+b.ph+b.x*Math.PI*3+waveOff)*1.2)*bladeH*0.45;
      ctx.beginPath(); ctx.moveTo(bx,baseY);
      ctx.bezierCurveTo(bx+sway*0.3,baseY-bladeH*0.4,bx+sway*0.7,baseY-bladeH*0.7,bx+sway,baseY-bladeH);
      ctx.strokeStyle=b.c; ctx.lineWidth=2.5; ctx.lineCap='round'; ctx.stroke();
    });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 24. SUNRISE SKY ─────────────────────────────────────────────────────────
export const SunriseSky = () => {
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    const cycle=(t%600)/600;
    const hue1=240-cycle*240, hue2=280-cycle*250, hue3=25+cycle*5;
    const g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,`hsl(${hue1},80%,15%)`); g.addColorStop(0.35,`hsl(${hue2},70%,25%)`);
    g.addColorStop(0.65,`hsl(${hue3},90%,55%)`); g.addColorStop(1,`hsl(20,100%,65%)`);
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    // Horizon glow
    const hz=ctx.createLinearGradient(0,h*0.55,0,h*0.8);
    hz.addColorStop(0,'rgba(255,160,30,0.7)'); hz.addColorStop(1,'transparent');
    ctx.fillStyle=hz; ctx.fillRect(0,h*0.55,w,h*0.25);
    // Rising sun (cycle: 0→1 = night→day)
    const sunY=h*(0.75-cycle*0.4);
    const sunG=ctx.createRadialGradient(w/2,sunY,0,w/2,sunY,120);
    sunG.addColorStop(0,'rgba(255,240,150,1)'); sunG.addColorStop(0.3,'rgba(255,160,30,0.9)'); sunG.addColorStop(1,'transparent');
    ctx.fillStyle=sunG; ctx.beginPath(); ctx.arc(w/2,sunY,120,0,Math.PI*2); ctx.fill();
    // Stars fading
    for(let i=0;i<60;i++){const sx=(Math.sin(i*89)*0.5+0.5)*w,sy=(Math.cos(i*137)*0.5+0.5)*h*0.5;ctx.beginPath();ctx.arc(sx,sy,1,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${Math.max(0,(0.5-cycle)*1.5)})`;ctx.fill();}
    // Silhouette hills
    ctx.beginPath(); ctx.moveTo(0,h*0.82); for(let x=0;x<=w;x+=20) ctx.lineTo(x,h*0.82+Math.sin(x*0.005)*35-Math.cos(x*0.003)*20); ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath();
    ctx.fillStyle='rgba(10,20,5,0.9)'; ctx.fill();
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 25. GLASS ORBS ──────────────────────────────────────────────────────────
export const GlassOrbs = () => {
  const orbs = useMemo(()=>[
    {bx:0.2,by:0.35,r:90,c:'#8b5cf6',sp:0.004,ph:0},
    {bx:0.7,by:0.25,r:70,c:'#06b6d4',sp:0.005,ph:1.4},
    {bx:0.45,by:0.65,r:110,c:'#f472b6',sp:0.003,ph:2.8},
    {bx:0.8,by:0.65,r:55,c:'#22c55e',sp:0.006,ph:0.7},
    {bx:0.12,by:0.7,r:65,c:'#f97316',sp:0.0045,ph:3.5},
    {bx:0.6,by:0.45,r:45,c:'#6366f1',sp:0.007,ph:2.1},
  ],[]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h); ctx.fillStyle='#050505'; ctx.fillRect(0,0,w,h);
    // Stars background
    for(let i=0;i<80;i++){const sx=(Math.sin(i*73)*0.5+0.5)*w,sy=(Math.cos(i*137)*0.5+0.5)*h;ctx.beginPath();ctx.arc(sx,sy,0.7,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fill();}
    orbs.forEach(o=>{
      const ox=o.bx*w+Math.sin(t*o.sp+o.ph)*40;
      const oy=o.by*h+Math.cos(t*o.sp*0.8+o.ph)*28;
      const r=o.r;
      // Ambient glow behind
      const aGlow=ctx.createRadialGradient(ox,oy,0,ox,oy,r*2.5);
      aGlow.addColorStop(0,o.c+'44'); aGlow.addColorStop(1,'transparent');
      ctx.fillStyle=aGlow; ctx.beginPath(); ctx.arc(ox,oy,r*2.5,0,Math.PI*2); ctx.fill();
      // Glass sphere body
      const sg=ctx.createRadialGradient(ox-r*0.3,oy-r*0.3,r*0.05,ox,oy,r);
      sg.addColorStop(0,'rgba(255,255,255,0.25)'); sg.addColorStop(0.3,o.c+'55'); sg.addColorStop(0.7,o.c+'22'); sg.addColorStop(1,'rgba(0,0,0,0.3)');
      ctx.beginPath(); ctx.arc(ox,oy,r,0,Math.PI*2); ctx.fillStyle=sg; ctx.fill();
      ctx.strokeStyle=`rgba(255,255,255,0.35)`; ctx.lineWidth=1.5; ctx.stroke();
      // Highlight
      const hl=ctx.createRadialGradient(ox-r*0.3,oy-r*0.38,0,ox-r*0.22,oy-r*0.28,r*0.45);
      hl.addColorStop(0,'rgba(255,255,255,0.6)'); hl.addColorStop(1,'transparent');
      ctx.fillStyle=hl; ctx.beginPath(); ctx.arc(ox,oy,r,0,Math.PI*2); ctx.fill();
    });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 26. LIQUID GRADIENT ─────────────────────────────────────────────────────
export const LiquidGradient = () => {
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle='#020617'; ctx.fillRect(0,0,w,h);
    const colors=[['#8b5cf6','#4f46e5'],['#ec4899','#db2777'],['#06b6d4','#0891b2'],['#f97316','#ea580c']];
    colors.forEach(([c1,c2],i)=>{
      const cx=w*(0.3+Math.sin(t*0.008+i*1.57)*0.4);
      const cy=h*(0.3+Math.cos(t*0.006+i*1.1)*0.35);
      const r=Math.min(w,h)*(0.35+Math.sin(t*0.004+i)*0.1);
      const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r);
      g.addColorStop(0,c1+'cc'); g.addColorStop(0.5,c2+'66'); g.addColorStop(1,'transparent');
      ctx.globalCompositeOperation='screen';
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
    });
    ctx.globalCompositeOperation='source-over';
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 27. NEON LINES ──────────────────────────────────────────────────────────
export const NeonLines = () => {
  const lines = useMemo(()=>Array.from({length:24},(_,i)=>({angle:i/24*Math.PI,len:0,maxLen:120+Math.random()*180,sp:Math.random()*2+1,c:['#22d3ee','#f472b6','#22c55e','#f97316','#a78bfa'][i%5],phase:i*0.4})),[]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h); ctx.fillStyle='#050505'; ctx.fillRect(0,0,w,h);
    const cx=w/2,cy=h/2;
    lines.forEach((l,i)=>{
      const progress=(t*0.015+l.phase)%(Math.PI*2);
      const len=Math.sin(progress)*l.maxLen;
      if(len<=0) return;
      const a=l.angle+t*0.005;
      const x1=cx+Math.cos(a)*20, y1=cy+Math.sin(a)*20;
      const x2=cx+Math.cos(a)*len, y2=cy+Math.sin(a)*len;
      const g=ctx.createLinearGradient(x1,y1,x2,y2);
      g.addColorStop(0,l.c+'ff'); g.addColorStop(1,l.c+'00');
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
      ctx.strokeStyle=g; ctx.lineWidth=2; ctx.shadowColor=l.c; ctx.shadowBlur=12; ctx.stroke();
      ctx.shadowBlur=0;
    });
    // Central glow
    const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,40); cg.addColorStop(0,'rgba(255,255,255,0.9)'); cg.addColorStop(1,'transparent');
    ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(cx,cy,40,0,Math.PI*2); ctx.fill();
    // Grid
    ctx.globalAlpha=0.06; ctx.strokeStyle='#22d3ee'; ctx.lineWidth=0.5;
    for(let x=0;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    for(let y=0;y<h;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    ctx.globalAlpha=1;
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 28. PARTICLE NETWORK ────────────────────────────────────────────────────
export const ParticleNetwork = () => {
  interface Node { x:number; y:number; vx:number; vy:number; }
  const nodes = useRef<Node[]>([]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,w,h);
    if(nodes.current.length===0) nodes.current=Array.from({length:80},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-0.5)*0.6,vy:(Math.random()-0.5)*0.6}));
    const ns=nodes.current;
    ns.forEach(n=>{n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>w)n.vx*=-1;if(n.y<0||n.y>h)n.vy*=-1;});
    // Connections with data pulses
    ns.forEach((a,i)=>ns.slice(i+1).forEach(b=>{
      const d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<140){
        const op=0.6*(1-d/140);
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
        ctx.strokeStyle=`rgba(100,116,139,${op*0.5})`; ctx.lineWidth=0.8; ctx.stroke();
        // Pulse travelling along edge
        const pulse=(t*0.02)%1;
        const px=a.x+(b.x-a.x)*pulse, py=a.y+(b.y-a.y)*pulse;
        ctx.beginPath(); ctx.arc(px,py,2.5,0,Math.PI*2);
        ctx.fillStyle=`rgba(96,165,250,${op})`; ctx.fill();
      }
    }));
    ns.forEach(n=>{ctx.beginPath();ctx.arc(n.x,n.y,3,0,Math.PI*2);ctx.fillStyle='#60a5fa';ctx.shadowColor='#60a5fa';ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0;});
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 29. 3D CUBES ────────────────────────────────────────────────────────────
export const ThreeDCubes = () => {
  const cubes = useMemo(()=>Array.from({length:10},(_,i)=>({x:(Math.random()-0.5)*0.7,y:(Math.random()-0.5)*0.6,z:Math.random()*0.5,size:30+Math.random()*50,rotX:Math.random()*Math.PI,rotY:Math.random()*Math.PI,rotVX:(Math.random()-0.5)*0.012,rotVY:(Math.random()-0.5)*0.015,c:['#6366f1','#8b5cf6','#22d3ee','#f472b6','#22c55e'][i%5]})),[]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,w,h);
    // Star bg
    for(let i=0;i<40;i++){const sx=(Math.sin(i*89)*0.5+0.5)*w,sy=(Math.cos(i*137)*0.5+0.5)*h;ctx.beginPath();ctx.arc(sx,sy,0.7,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.25)';ctx.fill();}
    cubes.forEach(c=>{
      c.rotX+=c.rotVX; c.rotY+=c.rotVY;
      const cx=w/2+c.x*w*0.45, cy=h/2+c.y*h*0.45;
      const sz=c.size;
      // Project 3D cube faces
      const cos=Math.cos, sin=Math.sin, rx=c.rotX, ry=c.rotY;
      function project(x:number,y:number,z:number):[number,number]{
        const x1=x*cos(ry)-z*sin(ry); const z1=x*sin(ry)+z*cos(ry);
        const y1=y*cos(rx)-z1*sin(rx);
        return [cx+x1,cy+y1];
      }
      const v=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(([x,y,z])=>project(x*sz,y*sz,z*sz));
      const faces=[[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[0,3,7,4],[1,2,6,5]];
      const brightness=[1,0.55,0.75,0.45,0.65,0.8];
      faces.forEach((face,fi)=>{
        ctx.beginPath(); ctx.moveTo(...v[face[0]]); face.slice(1).forEach(vi=>ctx.lineTo(...v[vi])); ctx.closePath();
        ctx.fillStyle=c.c+(Math.round(brightness[fi]*100+30).toString(16).padStart(2,'0'));
        ctx.strokeStyle=c.c+'ff'; ctx.lineWidth=1; ctx.fill(); ctx.stroke();
      });
    });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 30. SMOKE WAVES ─────────────────────────────────────────────────────────
export const SmokeWaves = () => {
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h); ctx.fillStyle='#050505'; ctx.fillRect(0,0,w,h);
    const colors=[['#8b5cf6','#4f46e5'],['#ec4899','#9333ea'],['#f97316','#dc2626']];
    ctx.globalCompositeOperation='screen';
    colors.forEach(([c1],i)=>{
      for(let layer=0;layer<5;layer++){
        const y=h*(0.3+i*0.2+layer*0.02)+Math.sin(t*0.008+i+layer)*h*0.05;
        const x=Math.sin(t*0.005+i*2+layer)*w*0.3;
        const g=ctx.createRadialGradient(w/2+x,y,0,w/2+x,y,w*0.55);
        g.addColorStop(0,c1+'44'); g.addColorStop(0.4,c1+'22'); g.addColorStop(1,'transparent');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(w/2+x,y,w*0.55,0,Math.PI*2); ctx.fill();
      }
    });
    ctx.globalCompositeOperation='source-over';
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 31. ENERGY WAVES ────────────────────────────────────────────────────────
export const EnergyWaves = () => {
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h); ctx.fillStyle='#020617'; ctx.fillRect(0,0,w,h);
    const cx=w/2,cy=h/2;
    for(let ring=0;ring<8;ring++){
      const r=((t*2.5+ring*55)%500);
      const op=Math.max(0,1-r/450)*0.8;
      // Main ring
      ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
      ctx.strokeStyle=`rgba(14,165,233,${op})`; ctx.lineWidth=3-ring*0.2; ctx.stroke();
      // Inner electric fringe
      if(r>20){
        for(let a=0;a<Math.PI*2;a+=0.25){
          const spk=Math.random()*12;
          ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
          ctx.lineTo(cx+Math.cos(a)*(r+spk),cy+Math.sin(a)*(r+spk));
          ctx.strokeStyle=`rgba(56,189,248,${op*0.5})`; ctx.lineWidth=1; ctx.stroke();
        }
      }
    }
    // Center orb
    const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,60); cg.addColorStop(0,'rgba(255,255,255,0.9)'); cg.addColorStop(0.3,'rgba(56,189,248,0.7)'); cg.addColorStop(1,'transparent');
    ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(cx,cy,60,0,Math.PI*2); ctx.fill();
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 32. AURORA BOREALIS ─────────────────────────────────────────────────────
export const AuroraLights = () => {
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle='#020617'; ctx.fillRect(0,0,w,h);
    // Stars
    for(let i=0;i<120;i++){const sx=(Math.sin(i*89)*0.5+0.5)*w,sy=(Math.cos(i*137)*0.5+0.5)*h*0.65;ctx.beginPath();ctx.arc(sx,sy,0.8,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${0.2+Math.sin(i*0.5+t*0.01)*0.3})`;ctx.fill();}
    // Mountain silhouette
    ctx.beginPath(); ctx.moveTo(0,h*0.75);
    const mpts=[.0,.08,.15,.22,.3,.38,.45,.52,.6,.7,.8,.9,1.0];
    const mhts=[.75,.6,.72,.55,.65,.58,.68,.52,.60,.7,.62,.72,.75];
    mpts.forEach((x,i)=>ctx.lineTo(x*w,mhts[i]*h));
    ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath(); ctx.fillStyle='#010b06'; ctx.fill();
    // Aurora curtains
    ctx.globalCompositeOperation='screen';
    [['#22c55e','#16a34a',0],[`#8b5cf6`,'#6d28d9',1.5],['#06b6d4','#0e7490',3]].forEach(([c1,_c2,phase])=>{
      ctx.beginPath(); ctx.moveTo(0,h*0.4);
      for(let x=0;x<=w;x+=4) ctx.lineTo(x,h*0.4+Math.sin(x*0.006+t*0.008+(+phase))*h*0.12+Math.cos(x*0.01+t*0.005+(+phase)*0.7)*h*0.06);
      ctx.lineTo(w,h*0.15); ctx.lineTo(0,h*0.15);
      const ag=ctx.createLinearGradient(0,h*0.15,0,h*0.5); ag.addColorStop(0,'transparent'); ag.addColorStop(0.3,c1+'88'); ag.addColorStop(0.7,c1+'44'); ag.addColorStop(1,'transparent');
      ctx.fillStyle=ag; ctx.fill();
    });
    ctx.globalCompositeOperation='source-over';
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 33. MATRIX RAIN ─────────────────────────────────────────────────────────
export const MatrixRain = () => {
  interface MCol { x:number; y:number; speed:number; chars:string[]; }
  const cols = useRef<MCol[]>([]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.fillStyle='rgba(0,0,0,0.07)'; ctx.fillRect(0,0,w,h);
    if(cols.current.length===0){
      const colW=18; const numCols=Math.ceil(w/colW);
      cols.current=Array.from({length:numCols},(_,i)=>({x:i*colW,y:Math.random()*-h,speed:Math.random()*3+1,chars:Array.from({length:40},()=>String.fromCharCode(0x30A0+Math.floor(Math.random()*96)))}));
    }
    ctx.font='bold 14px monospace'; ctx.textAlign='center';
    cols.current.forEach(col=>{
      col.y+=col.speed;
      if(col.y>h+20) col.y=Math.random()*-200;
      col.chars.forEach((ch,i)=>{
        const cy=col.y-i*18;
        if(cy<-20||cy>h+20) return;
        const isHead=i===0;
        ctx.fillStyle=isHead?'rgba(200,255,200,1)':`rgba(0,255,65,${Math.max(0,0.8-i*0.025)})`;
        ctx.shadowColor='#00ff41'; ctx.shadowBlur=isHead?12:0;
        ctx.fillText(ch,col.x,cy);
        ctx.shadowBlur=0;
      });
      if(t%4===0) col.chars[Math.floor(Math.random()*col.chars.length)]=String.fromCharCode(0x30A0+Math.floor(Math.random()*96));
    });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',background:'#000'}} />;
};

// ─── 34. CIRCUIT GLOW ────────────────────────────────────────────────────────
export const CircuitGlow = () => {
  const paths = useMemo(()=>{
    const ps:number[][][] = [];
    for(let i=0;i<30;i++){
      const path:number[][]=[[Math.random()*400,Math.random()*800]];
      for(let j=0;j<6;j++){const last=path[path.length-1];path.push(Math.random()>0.5?[last[0]+Math.random()*100-50,last[1]]:[last[0],last[1]+Math.random()*100-50]);}
      ps.push(path);
    }
    return ps;
  },[]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    const bg=ctx.createLinearGradient(0,0,0,h); bg.addColorStop(0,'#020617'); bg.addColorStop(1,'#0c1445');
    ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    // Grid
    ctx.globalAlpha=0.08; ctx.strokeStyle='#38bdf8'; ctx.lineWidth=0.5;
    for(let x=0;x<w;x+=35){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    for(let y=0;y<h;y+=35){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    ctx.globalAlpha=1;
    // Circuit paths
    const scaleX=w/400, scaleY=h/800;
    paths.forEach((path,pi)=>{
      const offset=(t*0.008+pi*0.4)%1;
      ctx.beginPath(); ctx.moveTo(path[0][0]*scaleX,path[0][1]*scaleY);
      path.slice(1).forEach(p=>ctx.lineTo(p[0]*scaleX,p[1]*scaleY));
      ctx.strokeStyle='rgba(56,189,248,0.15)'; ctx.lineWidth=1.5; ctx.stroke();
      // Moving pulse
      const totalPts=path.length-1;
      const segIdx=Math.floor(offset*totalPts);
      const segProg=(offset*totalPts)%1;
      const p1=path[Math.min(segIdx,totalPts-1)];
      const p2=path[Math.min(segIdx+1,totalPts)];
      if(p1&&p2){
        const px=(p1[0]+(p2[0]-p1[0])*segProg)*scaleX;
        const py=(p1[1]+(p2[1]-p1[1])*segProg)*scaleY;
        ctx.shadowColor='#38bdf8'; ctx.shadowBlur=16;
        ctx.beginPath(); ctx.arc(px,py,5,0,Math.PI*2); ctx.fillStyle='#7dd3fc'; ctx.fill();
        // Trail
        const trail=ctx.createRadialGradient(px,py,0,px,py,20); trail.addColorStop(0,'rgba(56,189,248,0.6)'); trail.addColorStop(1,'transparent');
        ctx.fillStyle=trail; ctx.beginPath(); ctx.arc(px,py,20,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0;
      }
      // Junction nodes
      path.forEach(p=>{ctx.beginPath();ctx.arc(p[0]*scaleX,p[1]*scaleY,3,0,Math.PI*2);ctx.fillStyle='rgba(56,189,248,0.5)';ctx.fill();});
    });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 35. NEURAL NETWORK ──────────────────────────────────────────────────────
export const NeuralNetwork = () => {
  const layers = useMemo(()=>[[3],[6],[8],[6],[4],[2]].map((l,_li)=>l[0]),[]);
  const network = useMemo(()=>{
    const maxN=8;
    return [3,6,8,6,4,2].map((n,li)=>Array.from({length:n},(_,ni)=>({
      x:(li/(6-1))*0.85+0.05,
      y:(ni/(n>1?n-1:1))*0.75+0.12+((maxN-n)/maxN)*0.38*0.5,
      active:false, brightness:0.5
    })));
  },[]);

  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h); ctx.fillStyle='#020617'; ctx.fillRect(0,0,w,h);
    // Pulse position
    const pulse=(t*0.008)%(network.length);
    // Draw edges
    for(let li=0;li<network.length-1;li++){
      network[li].forEach(n1=>{
        network[li+1].forEach(n2=>{
          const isActive=Math.abs(pulse-li)<0.9&&Math.random()<0.3;
          ctx.beginPath(); ctx.moveTo(n1.x*w,n1.y*h); ctx.lineTo(n2.x*w,n2.y*h);
          ctx.strokeStyle=isActive?'rgba(96,165,250,0.6)':'rgba(51,65,85,0.4)'; ctx.lineWidth=isActive?1.5:0.8; ctx.stroke();
          // Data pulse
          if(isActive){
            const pp=(pulse-li);
            const px=n1.x*w+(n2.x-n1.x)*w*pp;
            const py=n1.y*h+(n2.y-n1.y)*h*pp;
            ctx.beginPath(); ctx.arc(px,py,3,0,Math.PI*2); ctx.fillStyle='rgba(147,197,253,0.9)'; ctx.fill();
          }
        });
      });
    }
    // Draw nodes
    network.forEach((layer,li)=>layer.forEach(n=>{
      const isActive=Math.abs(pulse-li)<0.5;
      const r=isActive?9:7;
      const ng=ctx.createRadialGradient(n.x*w,n.y*h,0,n.x*w,n.y*h,r*2.5);
      ng.addColorStop(0,isActive?'rgba(147,197,253,1)':'rgba(51,65,85,0.9)'); ng.addColorStop(1,'transparent');
      ctx.fillStyle=ng; ctx.beginPath(); ctx.arc(n.x*w,n.y*h,r*2.5,0,Math.PI*2); ctx.fill();
      ctx.shadowColor=isActive?'#60a5fa':'#1e40af'; ctx.shadowBlur=isActive?18:6;
      ctx.beginPath(); ctx.arc(n.x*w,n.y*h,r,0,Math.PI*2); ctx.fillStyle=isActive?'#93c5fd':'#1e3a8a'; ctx.fill();
      ctx.shadowBlur=0;
    }));
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 36. HOLOGRAM GRID ───────────────────────────────────────────────────────
export const HologramGrid = () => {
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h); ctx.fillStyle='#020617'; ctx.fillRect(0,0,w,h);
    const gridSz=55;
    // Scan line moving across
    const scanX=(t*3)%w;
    // Draw 3D grid (floor perspective)
    ctx.strokeStyle='rgba(14,165,233,0.3)'; ctx.lineWidth=1;
    for(let z=0;z<12;z++){
      const pct=z/12; const y=h*0.5+pct*h*0.5; const xScale=pct;
      ctx.beginPath(); ctx.moveTo(w/2-w*xScale*0.6,y); ctx.lineTo(w/2+w*xScale*0.6,y); ctx.stroke();
    }
    for(let x=-8;x<=8;x++){
      ctx.beginPath(); ctx.moveTo(w/2+x*(gridSz*0.5),h*0.5); ctx.lineTo(w/2+x*w*0.05,h); ctx.stroke();
    }
    // Vertical grid on back wall
    ctx.strokeStyle='rgba(14,165,233,0.15)'; ctx.lineWidth=0.8;
    for(let x=0;x<w;x+=gridSz){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h*0.5);ctx.stroke();}
    for(let y=0;y<h*0.5;y+=gridSz*0.7){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    // Scan pulse
    const sg=ctx.createLinearGradient(scanX-60,0,scanX+60,0); sg.addColorStop(0,'transparent'); sg.addColorStop(0.5,'rgba(14,165,233,0.5)'); sg.addColorStop(1,'transparent');
    ctx.fillStyle=sg; ctx.fillRect(scanX-60,0,120,h);
    // Horizon line glow
    ctx.shadowColor='#0ea5e9'; ctx.shadowBlur=30;
    ctx.beginPath(); ctx.moveTo(0,h*0.5); ctx.lineTo(w,h*0.5); ctx.strokeStyle='rgba(14,165,233,0.7)'; ctx.lineWidth=2; ctx.stroke();
    ctx.shadowBlur=0;
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 37. DATA STREAMS ────────────────────────────────────────────────────────
export const DataStreams = () => {
  interface Packet { x:number; y:number; vx:number; len:number; c:string; }
  const packets = useRef<Packet[]>([]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.fillStyle='rgba(2,6,23,0.2)'; ctx.fillRect(0,0,w,h);
    // DB cylinders on left
    ctx.save(); ctx.translate(60,h/2);
    ['#22d3ee','#06b6d4','#0891b2'].forEach((c,i)=>{
      ctx.beginPath(); ctx.ellipse(0,i*45-45,30,8,0,0,Math.PI*2); ctx.fillStyle=c+'44'; ctx.stroke();
      ctx.fillRect(-30,i*45-45,60,40); ctx.fillStyle=c+'22'; ctx.fill();
      ctx.strokeStyle=c+'66'; ctx.lineWidth=1.5; ctx.strokeRect(-30,i*45-45,60,40);
    });
    ctx.restore();
    // Monitor on right
    ctx.strokeStyle='#22d3ee55'; ctx.lineWidth=2; ctx.strokeRect(w-120,h/2-70,100,80);
    ctx.fillStyle='rgba(34,211,238,0.05)'; ctx.fillRect(w-120,h/2-70,100,80);
    // Lines on monitor (data display)
    for(let r=0;r<5;r++){const y=h/2-55+r*13;const len=Math.sin(t*0.05+r)*30+50;ctx.fillStyle='rgba(34,211,238,0.5)';ctx.fillRect(w-115,y,len,4);}
    // Packets traveling from DB to monitor
    if(Math.random()<0.06) packets.current.push({x:90,y:h/2+(Math.random()-0.5)*80,vx:Math.random()*4+3,len:Math.random()*30+20,c:['#22d3ee','#06b6d4','#67e8f9'][Math.floor(Math.random()*3)]});
    packets.current=packets.current.filter(p=>p.x<w-120);
    packets.current.forEach(p=>{
      p.x+=p.vx;
      const pg=ctx.createLinearGradient(p.x,p.y,p.x-p.len,p.y); pg.addColorStop(0,p.c+'ff'); pg.addColorStop(1,'transparent');
      ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p.x+p.len,p.y);
      ctx.strokeStyle=pg; ctx.lineWidth=2.5; ctx.stroke();
      ctx.beginPath(); ctx.arc(p.x,p.y,4,0,Math.PI*2); ctx.fillStyle=p.c; ctx.fill();
    });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',background:'#020617'}} />;
};

// ─── 38. RADAR SCAN ──────────────────────────────────────────────────────────
export const RadarScan = () => {
  const blips = useMemo(()=>Array.from({length:8},()=>({r:Math.random(),a:Math.random()*Math.PI*2,flash:0})),[]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h); ctx.fillStyle='#000d00'; ctx.fillRect(0,0,w,h);
    const cx=w/2, cy=h/2, R=Math.min(w,h)*0.42;
    // Outer ring
    ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.strokeStyle='rgba(34,197,94,0.6)'; ctx.lineWidth=2; ctx.stroke();
    // Range rings
    [0.33,0.67,1].forEach(s=>{ctx.beginPath();ctx.arc(cx,cy,R*s,0,Math.PI*2);ctx.strokeStyle='rgba(34,197,94,0.2)';ctx.lineWidth=1;ctx.stroke();});
    // Cross hairs
    ctx.strokeStyle='rgba(34,197,94,0.2)'; ctx.lineWidth=0.8;
    ctx.beginPath(); ctx.moveTo(cx-R,cy); ctx.lineTo(cx+R,cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,cy-R); ctx.lineTo(cx,cy+R); ctx.stroke();
    // Sweep beam
    const sweepAngle=t*0.035;
    const gradient=ctx.createConicGradient?.(sweepAngle, cx, cy);
    // Fallback: manual sweep fill
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(sweepAngle);
    for(let i=0;i<30;i++){
      const a=-(i/30)*Math.PI*0.5;
      const g=ctx.createLinearGradient(0,0,Math.cos(a)*R,Math.sin(a)*R);
      g.addColorStop(0,`rgba(34,197,94,${0.35-i*0.011})`); g.addColorStop(1,'transparent');
      ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,R,a,a+0.04); ctx.closePath();
      ctx.fillStyle=g; ctx.fill();
    }
    ctx.restore();
    // Main sweep line
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(sweepAngle);
    ctx.shadowColor='#22c55e'; ctx.shadowBlur=15;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(R,0);
    ctx.strokeStyle='rgba(34,197,94,0.9)'; ctx.lineWidth=2.5; ctx.stroke();
    ctx.shadowBlur=0; ctx.restore();
    // Blips
    blips.forEach(b=>{
      const da=Math.abs((sweepAngle%(Math.PI*2))-b.a);
      if(da<0.08) b.flash=1;
      b.flash=Math.max(0,b.flash-0.015);
      if(b.flash>0){
        const bx=cx+Math.cos(b.a)*b.r*R, by=cy+Math.sin(b.a)*b.r*R;
        ctx.shadowColor='#22c55e'; ctx.shadowBlur=18;
        ctx.beginPath(); ctx.arc(bx,by,5,0,Math.PI*2); ctx.fillStyle=`rgba(34,197,94,${b.flash})`; ctx.fill();
        ctx.shadowBlur=0;
      }
    });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 39. BALLOONS ────────────────────────────────────────────────────────────
interface Balloon { x:number; y:number; vy:number; color:string; wobble:number; ph:number; }
export const FloatingBalloons = () => {
  const balloons = useRef<Balloon[]>([]);
  const colors=['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899','#06b6d4'];
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    const sky=ctx.createLinearGradient(0,0,0,h); sky.addColorStop(0,'#38bdf8'); sky.addColorStop(0.5,'#7dd3fc'); sky.addColorStop(1,'#bfdbfe');
    ctx.fillStyle=sky; ctx.fillRect(0,0,w,h);
    // Clouds
    [[0.15,0.25,180],[0.55,0.12,220],[0.8,0.3,150]].forEach(([bx,by,cw])=>{ctx.fillStyle='rgba(255,255,255,0.85)';ctx.beginPath();ctx.arc(bx*w,by*h,+cw/2,0,Math.PI*2);ctx.arc(bx*w-+cw*0.3,by*h+8,+cw*0.38,0,Math.PI*2);ctx.arc(bx*w+ +cw*0.28,by*h+6,+cw*0.32,0,Math.PI*2);ctx.fill();});
    while(balloons.current.length<18) balloons.current.push({x:Math.random()*w,y:h+80+Math.random()*h*0.5,vy:-(Math.random()*0.8+0.4),color:colors[Math.floor(Math.random()*colors.length)],wobble:Math.random()*0.04+0.01,ph:Math.random()*Math.PI*2});
    balloons.current=balloons.current.filter(b=>b.y>-120);
    balloons.current.forEach(b=>{
      b.y+=b.vy; b.x+=Math.sin(t*b.wobble+b.ph)*0.6;
      const bx=b.x, by=b.y;
      // String
      ctx.beginPath(); ctx.moveTo(bx,by+42); ctx.quadraticCurveTo(bx+Math.sin(t*0.02+b.ph)*12,by+65,bx+Math.sin(t*0.01+b.ph)*8,by+85);
      ctx.strokeStyle='rgba(100,100,100,0.6)'; ctx.lineWidth=1.5; ctx.stroke();
      // Balloon body
      const bg=ctx.createRadialGradient(bx-12,by-12,4,bx,by,34); bg.addColorStop(0,'rgba(255,255,255,0.5)'); bg.addColorStop(0.4,b.color); bg.addColorStop(1,b.color+'88');
      ctx.beginPath(); ctx.ellipse(bx,by,28,34,0,0,Math.PI*2); ctx.fillStyle=bg; ctx.fill();
      ctx.shadowColor=b.color; ctx.shadowBlur=15; ctx.fill(); ctx.shadowBlur=0;
      // Knot
      ctx.beginPath(); ctx.arc(bx,by+37,4,0,Math.PI*2); ctx.fillStyle=b.color+'cc'; ctx.fill();
    });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 40. PAPER PLANES ────────────────────────────────────────────────────────
interface PaperPlane { x:number; y:number; vx:number; vy:number; angle:number; scale:number; }
export const PaperPlanes = () => {
  const planes = useRef<PaperPlane[]>([]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    const sky=ctx.createLinearGradient(0,0,0,h); sky.addColorStop(0,'#1e3a5f'); sky.addColorStop(0.5,'#2563eb'); sky.addColorStop(1,'#7dd3fc');
    ctx.fillStyle=sky; ctx.fillRect(0,0,w,h);
    // Clouds
    for(let i=0;i<5;i++){const cx2=w*(0.1+i*0.22),cy2=h*(0.15+i%2*0.12);ctx.beginPath();ctx.arc(cx2,cy2,60,0,Math.PI*2);ctx.arc(cx2-42,cy2+8,40,0,Math.PI*2);ctx.arc(cx2+38,cy2+5,45,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.65)';ctx.fill();}
    while(planes.current.length<15) {
      const a=(Math.random()-0.5)*0.3;
      planes.current.push({x:-80,y:Math.random()*h*0.85,vx:Math.random()*2.5+1.5,vy:Math.sin(a)*1.5,angle:a,scale:Math.random()*0.6+0.6});
    }
    planes.current=planes.current.filter(p=>p.x<w+100);
    planes.current.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy+Math.sin(t*0.03+p.x*0.01)*0.4; p.angle=Math.atan2(p.vy,p.vx)*0.4;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.angle); ctx.scale(p.scale,p.scale);
      // Paper plane shape
      ctx.beginPath(); ctx.moveTo(40,0); ctx.lineTo(-20,-18); ctx.lineTo(-8,0); ctx.lineTo(-20,18); ctx.closePath();
      ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.fill(); ctx.strokeStyle='rgba(200,220,255,0.6)'; ctx.lineWidth=1; ctx.stroke();
      // Center fold line
      ctx.beginPath(); ctx.moveTo(40,0); ctx.lineTo(-8,0); ctx.strokeStyle='rgba(180,200,240,0.5)'; ctx.lineWidth=0.8; ctx.stroke();
      // Shadow trail
      const tg=ctx.createLinearGradient(-60,0,40,0); tg.addColorStop(0,'transparent'); tg.addColorStop(1,'rgba(255,255,255,0.15)');
      ctx.fillStyle=tg; ctx.fillRect(-60,-5,100,10);
      ctx.restore();
    });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};
