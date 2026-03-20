import React, { useEffect, useRef, useMemo } from 'react';
import { useCanvas } from './WebSpaceThemes';

// ─── 9. OCEAN WAVES ──────────────────────────────────────────────────────────
export const OceanWaves = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0,0,w,h);
    // Sky
    const sky=ctx.createLinearGradient(0,0,0,h*0.55);
    sky.addColorStop(0,'#38bdf8'); sky.addColorStop(1,'#7dd3fc');
    ctx.fillStyle=sky; ctx.fillRect(0,0,w,h*0.55);
    // Sun
    const sunX=w*0.75, sunY=h*0.15;
    const sunG=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,80);
    sunG.addColorStop(0,'rgba(255,255,255,1)'); sunG.addColorStop(0.2,'rgba(255,235,150,0.9)'); sunG.addColorStop(1,'transparent');
    ctx.fillStyle=sunG; ctx.beginPath(); ctx.arc(sunX,sunY,80,0,Math.PI*2); ctx.fill();
    // Deep ocean base
    const sea=ctx.createLinearGradient(0,h*0.5,0,h);
    sea.addColorStop(0,'#0ea5e9'); sea.addColorStop(0.4,'#0369a1'); sea.addColorStop(1,'#082f49');
    ctx.fillStyle=sea; ctx.fillRect(0,h*0.52,w,h*0.5);
    // Waves
    const waveColors=[
      {op:0.9,yr:0.58,amp:18,freq:0.012,sp:0.04},
      {op:0.85,yr:0.65,amp:14,freq:0.015,sp:0.05},
      {op:0.95,yr:0.72,amp:11,freq:0.018,sp:0.06},
      {op:1,yr:0.8,amp:8,freq:0.022,sp:0.07},
      {op:1,yr:0.89,amp:5,freq:0.028,sp:0.08},
    ];
    waveColors.forEach(wave => {
      const baseY=h*wave.yr;
      ctx.beginPath(); ctx.moveTo(0,baseY);
      for(let x=0;x<=w;x+=4) ctx.lineTo(x,baseY+Math.sin(x*wave.freq-t*wave.sp)*wave.amp+Math.cos(x*0.009-t*0.03)*6);
      ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath();
      const wg=ctx.createLinearGradient(0,baseY,0,h);
      wg.addColorStop(0,`rgba(255,255,255,${wave.op*0.7})`); wg.addColorStop(0.1,`rgba(14,165,233,${wave.op*0.6})`); wg.addColorStop(1,`rgba(8,47,73,0.95)`);
      ctx.fillStyle=wg; ctx.fill();
      // sparkle on crest
      for(let x=0;x<w;x+=35){
        const cy2=baseY+Math.sin(x*wave.freq-t*wave.sp)*wave.amp+Math.cos(x*0.009-t*0.03)*6;
        const sparkOp=Math.sin(x*0.3+t*0.2)*0.5+0.5;
        const sp=ctx.createRadialGradient(x,cy2,0,x,cy2,8);
        sp.addColorStop(0,`rgba(255,255,255,${sparkOp*wave.op*0.8})`); sp.addColorStop(1,'transparent');
        ctx.fillStyle=sp; ctx.beginPath(); ctx.arc(x,cy2,8,0,Math.PI*2); ctx.fill();
      }
    });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 10. UNDERWATER BUBBLES ──────────────────────────────────────────────────
interface Bubble { x:number; y:number; r:number; vy:number; wobble:number; phase:number; }
export const UnderwaterBubbles = () => {
  const bubbles = useRef<Bubble[]>([]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    const bg=ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0,'#06b6d4'); bg.addColorStop(0.4,'#0891b2'); bg.addColorStop(1,'#083344');
    ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    // God rays
    for(let i=0;i<7;i++){
      const rx=w*(0.1+i*0.14)+Math.sin(t*0.005+i)*30;
      const ray=ctx.createLinearGradient(rx,0,rx+60,h);
      ray.addColorStop(0,'rgba(255,255,255,0.12)'); ray.addColorStop(1,'transparent');
      ctx.fillStyle=ray; ctx.beginPath(); ctx.moveTo(rx,0); ctx.lineTo(rx+80,h); ctx.lineTo(rx+20,h); ctx.lineTo(rx-30,0); ctx.closePath(); ctx.fill();
    }
    // Spawn bubbles
    if(bubbles.current.length<40&&Math.random()<0.1){
      bubbles.current.push({x:Math.random()*w,y:h+20,r:Math.random()*16+5,vy:-(Math.random()*1.5+0.5),wobble:Math.random()*0.05+0.01,phase:Math.random()*Math.PI*2});
    }
    bubbles.current=bubbles.current.filter(b=>b.y>-30);
    bubbles.current.forEach(b=>{
      b.y+=b.vy; b.x+=Math.sin(t*b.wobble+b.phase)*0.8;
      const bx=b.x, by=b.y, r=b.r;
      ctx.beginPath(); ctx.arc(bx,by,r,0,Math.PI*2);
      ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=1.5; ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.08)'; ctx.fill();
      // highlight
      const hl=ctx.createRadialGradient(bx-r*0.35,by-r*0.35,0,bx,by,r);
      hl.addColorStop(0,'rgba(255,255,255,0.45)'); hl.addColorStop(1,'transparent');
      ctx.fillStyle=hl; ctx.beginPath(); ctx.arc(bx,by,r,0,Math.PI*2); ctx.fill();
    });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 11. SEA SHORE ───────────────────────────────────────────────────────────
export const SeaShore = () => {
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    // Sky
    const sky=ctx.createLinearGradient(0,0,0,h*0.45);
    sky.addColorStop(0,'#fde68a'); sky.addColorStop(0.5,'#fb923c'); sky.addColorStop(1,'#f0fdfa');
    ctx.fillStyle=sky; ctx.fillRect(0,0,w,h*0.45);
    // Sand
    const sand=ctx.createLinearGradient(0,h*0.6,0,h);
    sand.addColorStop(0,'#fef3c7'); sand.addColorStop(1,'#d97706');
    ctx.fillStyle=sand; ctx.fillRect(0,h*0.6,w,h*0.4);
    // Water body
    const sea=ctx.createLinearGradient(0,h*0.42,0,h*0.62);
    sea.addColorStop(0,'#0ea5e9'); sea.addColorStop(1,'#14b8a6');
    ctx.fillStyle=sea; ctx.fillRect(0,h*0.42,w,h*0.22);
    // Waves washing up
    for(let i=0;i<4;i++){
      const prog=(t*0.018+i*0.55)%2;
      const extent=prog<1?prog:2-prog;
      const waveY=h*0.62-i*8;
      const waveW=extent*w*0.8;
      const waveX=(w-waveW)/2;
      ctx.beginPath(); ctx.ellipse(w/2,waveY,waveW/2,12-i*2,0,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${0.7-i*0.15})`; ctx.fill();
    }
    // Foam
    for(let x=0;x<w;x+=28){
      const fy=h*0.61+Math.sin(x*0.03+t*0.05)*5;
      ctx.beginPath(); ctx.arc(x,fy,6,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.fill();
    }
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 12. CORAL REEF ──────────────────────────────────────────────────────────
export const CoralReef = () => {
  const fish = useMemo(()=>Array.from({length:18},(_,i)=>({x:Math.random(),y:Math.random()*0.7+0.1,vx:(Math.random()*0.8+0.3)*(Math.random()>0.5?1:-1),c:['#f97316','#f59e0b','#22d3ee','#f472b6','#84cc16'][i%5],r:Math.random()*12+6})),[]);
  const coral = useMemo(()=>Array.from({length:14},(_,i)=>({x:i/13,c:['#f43f5e','#f97316','#a78bfa','#22d3ee','#84cc16'][i%5],h:0.15+Math.random()*0.25,sp:Math.random()*0.02+0.005,ph:Math.random()*Math.PI*2})),[]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    const bg=ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0,'#06b6d4'); bg.addColorStop(0.5,'#0891b2'); bg.addColorStop(1,'#083344');
    ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    // Sun rays from above
    for(let i=0;i<5;i++){const rx=w*(0.2+i*0.15);const ray=ctx.createLinearGradient(rx,0,rx,h*0.6);ray.addColorStop(0,'rgba(255,255,255,0.12)');ray.addColorStop(1,'transparent');ctx.fillStyle=ray;ctx.fillRect(rx-20,0,40,h*0.6);}
    // Sea floor
    const floor=ctx.createLinearGradient(0,h*0.75,0,h);
    floor.addColorStop(0,'#92400e'); floor.addColorStop(1,'#78350f');
    ctx.fillStyle=floor; ctx.fillRect(0,h*0.78,w,h*0.22);
    // Corals
    coral.forEach(c=>{
      const cx=c.x*w, baseY=h*0.78;
      const sway=Math.sin(t*c.sp+c.ph)*12;
      ctx.save(); ctx.translate(cx,baseY);
      // Branch coral
      const branches=5;
      for(let b=0;b<branches;b++){
        const ba=((b/branches)-0.5)*Math.PI*0.6+sway*0.02;
        const bh=h*c.h;
        ctx.beginPath(); ctx.moveTo(0,0);
        ctx.bezierCurveTo(Math.cos(ba)*bh*0.4,-(bh*0.5),Math.cos(ba)*bh*0.6+sway,-(bh*0.8),Math.cos(ba)*bh*0.5+sway,-(bh));
        ctx.strokeStyle=c.c; ctx.lineWidth=4-b*0.5; ctx.stroke();
      }
      ctx.restore();
    });
    // Fish
    fish.forEach(f=>{
      f.x=(f.x+f.vx*0.001+1)%1;
      const fx=f.x*w, fy=f.y*h+Math.sin(t*0.03+f.x*3)*12;
      ctx.save(); ctx.translate(fx,fy); if(f.vx<0)ctx.scale(-1,1);
      ctx.beginPath(); ctx.ellipse(0,0,f.r,f.r*0.55,0,0,Math.PI*2);
      ctx.fillStyle=f.c; ctx.fill();
      ctx.beginPath(); ctx.moveTo(-f.r,0); ctx.lineTo(-f.r-10,-8); ctx.lineTo(-f.r-10,8); ctx.closePath();
      ctx.fillStyle=f.c; ctx.fill();
      ctx.restore();
    });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 13. JELLYFISH GLOW (DEEP SEA GLOW) ────────────────────────────────────────
interface Jellyfish { x:number; y:number; phase:number; pulseSpeed:number; driftX:number; driftY:number; color:string; size:number; }
export const JellyfishGlow = () => {
  const jellies = useMemo<Jellyfish[]>(()=>[
    {x:0.15,y:0.3,phase:0,pulseSpeed:0.04,driftX:0.003,driftY:0.005,color:'#22d3ee',size:60},
    {x:0.85,y:0.5,phase:1.2,pulseSpeed:0.035,driftX:-0.004,driftY:0.004,color:'#c084fc',size:45},
    {x:0.45,y:0.7,phase:2.4,pulseSpeed:0.045,driftX:0.005,driftY:0.003,color:'#f472b6',size:70},
    {x:0.75,y:0.15,phase:3.6,pulseSpeed:0.03,driftX:-0.003,driftY:0.006,color:'#818cf8',size:52},
    {x:0.3,y:0.8,phase:4.2,pulseSpeed:0.025,driftX:0.004,driftY:-0.002,color:'#38bdf8',size:80},
    {x:0.6,y:0.1,phase:5.5,pulseSpeed:0.05,driftX:-0.002,driftY:0.005,color:'#e879f9',size:35},
  ],[]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    const bg=ctx.createLinearGradient(0,0,0,h); bg.addColorStop(0,'#0f172a'); bg.addColorStop(1,'#020617');
    ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    // God rays for depth
    for(let i=0;i<6;i++){
      const rx=w*(0.2+i*0.15)+Math.sin(t*0.005+i)*40;
      const ray=ctx.createLinearGradient(rx,0,rx+60,h);
      ray.addColorStop(0,'rgba(34,211,238,0.06)'); ray.addColorStop(1,'transparent');
      ctx.fillStyle=ray; ctx.beginPath(); ctx.moveTo(rx,0); ctx.lineTo(rx+100,h); ctx.lineTo(rx+30,h); ctx.lineTo(rx-40,0); ctx.closePath(); ctx.fill();
    }
    // Plankton particles
    for(let i=0;i<120;i++){
      const px=(Math.sin(i*98)*0.5+0.5)*w;
      const py=(Math.cos(i*123)*0.5+0.5)*h;
      const drift=Math.sin(t*0.01+i)*5;
      const op=0.3+Math.sin(t*0.03+i)*0.4;
      if(op>0.1){
        ctx.beginPath(); ctx.arc(px+Math.sin(t*0.02+i)*10,py+drift,1.2,0,Math.PI*2);
        ctx.fillStyle=`rgba(130,220,255,${op})`; ctx.fill();
        if(op>0.5) { ctx.shadowColor='#22d3ee'; ctx.shadowBlur=6; ctx.fill(); ctx.shadowBlur=0; }
      }
    }
    jellies.forEach(j=>{
      const jx=(j.x+Math.sin(t*j.driftX+j.phase)*0.15)*w;
      const jy=(j.y+Math.cos(t*j.driftY+j.phase)*0.1)*h;
      const pulse=Math.sin(t*j.pulseSpeed+j.phase);
      const scaleY=0.65+pulse*0.18;
      const sz=j.size;
      ctx.save(); ctx.translate(jx,jy); ctx.scale(1,scaleY);
      // Glow halo
      const halo=ctx.createRadialGradient(0,0,0,0,0,sz*2.8);
      halo.addColorStop(0,j.color+'66'); halo.addColorStop(1,'transparent');
      ctx.fillStyle=halo; ctx.beginPath(); ctx.arc(0,0,sz*2.8,0,Math.PI*2); ctx.fill();
      // Bell
      const bell=ctx.createRadialGradient(0,-sz*0.1,0,0,0,sz);
      bell.addColorStop(0,j.color+'e6'); bell.addColorStop(0.5,j.color+'88'); bell.addColorStop(1,j.color+'33');
      ctx.fillStyle=bell;
      ctx.beginPath(); ctx.arc(0,0,sz,Math.PI,0); ctx.closePath(); ctx.fill();
      // Ribs
      for(let i=-3;i<=3;i++){
        ctx.beginPath(); ctx.moveTo(i*(sz/4),0);
        const cx2=i*(sz/4)+Math.sin(i)*8; ctx.quadraticCurveTo(cx2,-sz*0.5,i*(sz/5),-sz);
        ctx.strokeStyle=j.color+'66'; ctx.lineWidth=1.5; ctx.stroke();
      }
      ctx.restore();
      // Tentacles
      for(let k=-3;k<=3;k++){
        ctx.beginPath(); ctx.moveTo(jx+k*(sz/4),jy);
        const tx=jx+k*(sz/4)+Math.sin(t*0.02+k+j.phase)*20;
        ctx.lineTo(tx,jy+sz*(1.5+Math.sin(t*0.03+k)*0.3));
        ctx.strokeStyle=j.color+'88'; ctx.lineWidth=1.5; ctx.stroke();
      }
    });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 14. WATER RIPPLE ────────────────────────────────────────────────────────
interface Ripple { x:number; y:number; r:number; maxR:number; op:number; }
export const WaterRipple = () => {
  const ripples = useRef<Ripple[]>([]);
  const lastDrop = useRef(0);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    // Mirror-like water surface
    const bg=ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0,'#bae6fd'); bg.addColorStop(0.5,'#e0f2fe'); bg.addColorStop(1,'#7dd3fc');
    ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    // Sky reflection pattern
    ctx.fillStyle='rgba(255,255,255,0.15)'; ctx.fillRect(0,0,w,h*0.4);
    // Drop spawner
    if(t-lastDrop.current>55){
      ripples.current.push({x:w*0.3+Math.random()*w*0.4,y:h*0.3+Math.random()*h*0.4,r:0,maxR:Math.min(w,h)*0.38,op:0.9});
      lastDrop.current=t;
    }
    ripples.current=ripples.current.filter(r=>r.op>0.02);
    ripples.current.forEach(r=>{
      r.r+=2.2; r.op-=0.012;
      ctx.beginPath(); ctx.arc(r.x,r.y,r.r,0,Math.PI*2);
      ctx.strokeStyle=`rgba(56,189,248,${r.op})`; ctx.lineWidth=2; ctx.stroke();
      if(r.r>15){ctx.beginPath(); ctx.arc(r.x,r.y,r.r-12,0,Math.PI*2); ctx.strokeStyle=`rgba(147,197,253,${r.op*0.5})`; ctx.lineWidth=1; ctx.stroke();}
    });
    // Center drop animation
    const dropY=h*0.35+Math.sin(t*0.04)*6;
    ctx.beginPath(); ctx.arc(w/2,dropY,4,0,Math.PI*2);
    ctx.fillStyle='rgba(56,189,248,0.8)'; ctx.fill();
    // Falling drop streak
    ctx.beginPath(); ctx.moveTo(w/2,dropY-25); ctx.lineTo(w/2,dropY-5);
    ctx.strokeStyle='rgba(56,189,248,0.4)'; ctx.lineWidth=2; ctx.stroke();
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 15. RAIN RIPPLES ────────────────────────────────────────────────────────
interface RainDrop { x:number; y:number; vy:number; len:number; }
export const RainRipples = () => {
  const drops = useRef<RainDrop[]>([]);
  const rips = useRef<Ripple[]>([]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    const bg=ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0,'#334155'); bg.addColorStop(1,'#1e293b');
    ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    // Water puddle surface full screen
    ctx.fillStyle='rgba(51,65,85,0.7)'; ctx.fillRect(0,0,w,h);
    // Spawn rain (full height)
    for(let i=0;i<10;i++) if(drops.current.length<300) drops.current.push({x:Math.random()*w,y:-20,vy:Math.random()*14+8,len:Math.random()*35+15});
    
    // Draw falling drops (let them fall until they hit a random Y target to spawn ripple)
    // We assign a random target floor for each drop
    drops.current.forEach(d=>{
      d.y+=d.vy;
      ctx.beginPath(); ctx.moveTo(d.x,d.y); ctx.lineTo(d.x-2,d.y-d.len);
      ctx.strokeStyle='rgba(148,163,184,0.6)'; ctx.lineWidth=1; ctx.stroke();
      // 10% chance to hit puddle per frame if in view
      if(d.y>h*0.1 && Math.random()<0.08) {
        rips.current.push({x:d.x,y:d.y,r:0,maxR:Math.random()*20+15,op:0.8});
        d.y = h+100; // kill drop
      }
    });

    drops.current=drops.current.filter(d=>d.y<h);
    rips.current=rips.current.filter(r=>r.op>0.02);
    rips.current.forEach(r=>{ r.r+=1.5; r.op-=0.025; ctx.beginPath(); ctx.ellipse(r.x,r.y,r.r,r.r*0.4,0,0,Math.PI*2); ctx.strokeStyle=`rgba(148,163,184,${r.op})`; ctx.lineWidth=1.5; ctx.stroke(); });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 16. FLOATING BOAT ───────────────────────────────────────────────────────
export const FloatingBoat = () => {
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    // Misty sky
    const sky=ctx.createLinearGradient(0,0,0,h*0.55);
    sky.addColorStop(0,'#fde68a'); sky.addColorStop(0.4,'#fb923c'); sky.addColorStop(1,'#e0f2fe');
    ctx.fillStyle=sky; ctx.fillRect(0,0,w,h*0.55);
    // Sun glow on horizon
    const sunG=ctx.createRadialGradient(w*0.5,h*0.52,0,w*0.5,h*0.52,200);
    sunG.addColorStop(0,'rgba(255,200,50,0.5)'); sunG.addColorStop(1,'transparent');
    ctx.fillStyle=sunG; ctx.fillRect(0,0,w,h*0.6);
    // Calm sea
    const sea=ctx.createLinearGradient(0,h*0.5,0,h);
    sea.addColorStop(0,'#7dd3fc'); sea.addColorStop(0.3,'#0ea5e9'); sea.addColorStop(1,'#082f49');
    ctx.fillStyle=sea; ctx.fillRect(0,h*0.5,w,h*0.5);
    // Gentle swells
    for(let i=0;i<3;i++){
      ctx.beginPath(); ctx.moveTo(0,h*(0.55+i*0.12));
      for(let x=0;x<=w;x+=6) ctx.lineTo(x,h*(0.55+i*0.12)+Math.sin(x*0.01-t*0.02+i)*7);
      ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath();
      ctx.fillStyle=`rgba(14,165,233,${0.1+i*0.08})`; ctx.fill();
    }
    // Sun reflection
    for(let x=-80;x<=80;x+=4){const ry=h*0.52+Math.abs(x)*0.15+Math.sin(x*0.1+t*0.03)*5;ctx.beginPath();ctx.arc(w/2+x,ry,2,0,Math.PI*2);ctx.fillStyle=`rgba(255,200,50,${0.6-Math.abs(x)/160})`;ctx.fill();}
    // Boat bob
    const bob=Math.sin(t*0.025)*6;
    const bx=w/2, by=h*0.56+bob;
    // Hull
    ctx.beginPath(); ctx.moveTo(bx-55,by+10); ctx.bezierCurveTo(bx-50,by+25,bx+50,by+25,bx+55,by+10);
    ctx.lineTo(bx+50,by+5); ctx.lineTo(bx-50,by+5); ctx.closePath();
    ctx.fillStyle='#92400e'; ctx.fill();
    ctx.strokeStyle='#78350f'; ctx.lineWidth=2; ctx.stroke();
    // Deck
    ctx.fillStyle='#d97706'; ctx.fillRect(bx-48,by-5,96,10);
    // Mast
    ctx.beginPath(); ctx.moveTo(bx+5,by-5); ctx.lineTo(bx+5,by-70);
    ctx.strokeStyle='#78350f'; ctx.lineWidth=3; ctx.stroke();
    // Mist
    ctx.fillStyle='rgba(255,255,255,0.15)'; ctx.fillRect(0,h*0.5,w,50);
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 17-20 NATURE THEMES ─────────────────────────────────────────────────────
interface FallingItem { x:number; y:number; rot:number; rotV:number; vy:number; vx:number; scale:number; emoji:string; }

function FallingItems({emojis,bgFrom,bgTo,count=25}:{emojis:string[];bgFrom:string;bgTo:string;count?:number}) {
  const items = useRef<FallingItem[]>([]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    const bg=ctx.createLinearGradient(0,0,0,h); bg.addColorStop(0,bgFrom); bg.addColorStop(1,bgTo);
    ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    // Sun
    ctx.fillStyle='rgba(255,200,50,0.3)'; ctx.beginPath(); ctx.arc(w*0.8,h*0.1,120,0,Math.PI*2); ctx.fill();
    while(items.current.length<count) items.current.push({x:Math.random()*w,y:-30,rot:Math.random()*Math.PI*2,rotV:(Math.random()-0.5)*0.06,vy:Math.random()*2+1,vx:(Math.random()-0.5)*2,scale:Math.random()*0.8+0.6,emoji:emojis[Math.floor(Math.random()*emojis.length)]});
    items.current=items.current.filter(i=>i.y<h+40);
    items.current.forEach(i=>{i.y+=i.vy;i.x+=i.vx+Math.sin(t*0.02+i.x)*0.5;i.rot+=i.rotV;ctx.save();ctx.translate(i.x,i.y);ctx.rotate(i.rot);ctx.scale(i.scale,i.scale);ctx.font='24px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(i.emoji,0,0);ctx.restore();});
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
}

export const FallingLeaves = () => <FallingItems emojis={['🍂','🍁','🍃','🟠','🟡']} bgFrom="#fffbeb" bgTo="#fef3c7" count={30} />;
export const CherryPetals = () => <FallingItems emojis={['🌸','🌺','💮','🩷']} bgFrom="#fff0f5" bgTo="#ffe4e6" count={35} />;
export const Snowfall = () => <FallingItems emojis={['❄️','⬡','❆','✦']} bgFrom="#f1f5f9" bgTo="#e2e8f0" count={50} />;
export const Butterflies = () => <FallingItems emojis={['🦋','🌼','🌻','🌷']} bgFrom="#fffbeb" bgTo="#fef3c7" count={20} />;

// ─── 19. MOVING CLOUDS ───────────────────────────────────────────────────────
export const MovingClouds = () => {
  const clouds = useMemo(()=>Array.from({length:8},(_,i)=>({x:Math.random(),y:0.05+i*0.12,w:180+Math.random()*200,h:55+Math.random()*40,sp:Math.random()*0.0003+0.0001})),[]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    const sky=ctx.createLinearGradient(0,0,0,h); sky.addColorStop(0,'#38bdf8'); sky.addColorStop(0.7,'#7dd3fc'); sky.addColorStop(1,'#bfdbfe');
    ctx.fillStyle=sky; ctx.fillRect(0,0,w,h);
    // Sun
    ctx.fillStyle='rgba(255,235,100,0.9)'; ctx.beginPath(); ctx.arc(w*0.15,h*0.12,55,0,Math.PI*2); ctx.fill();
    // Cloud draw function
    function drawCloud(cx:number,cy:number,cw:number,ch:number){
      ctx.save(); ctx.translate(cx,cy);
      const cg=ctx.createRadialGradient(0,0,0,0,ch*0.3,cw*0.6); cg.addColorStop(0,'rgba(255,255,255,0.98)'); cg.addColorStop(1,'rgba(220,230,255,0.7)');
      ctx.fillStyle=cg;
      ctx.beginPath(); ctx.arc(0,0,ch*0.5,0,Math.PI*2);
      [-cw*0.28,-cw*0.14,cw*0.12,cw*0.28].forEach((ox,i)=>{ctx.arc(ox,[-ch*0.1,-ch*0.22,-ch*0.15,-ch*0.05][i],ch*(0.38+i%2*0.12),0,Math.PI*2);});
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    clouds.forEach(c=>{
      const cx=((c.x+t*c.sp)%1.3-0.15)*w;
      drawCloud(cx,c.y*h,c.w,c.h);
    });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 20. FIREFLIES ───────────────────────────────────────────────────────────
interface Firefly { x:number; y:number; vx:number; vy:number; phase:number; speed:number; }
export const Fireflies = () => {
  const fflies = useMemo<Firefly[]>(()=>Array.from({length:55},()=>({x:Math.random(),y:Math.random(),vx:(Math.random()-0.5)*0.003,vy:(Math.random()-0.5)*0.002,phase:Math.random()*Math.PI*2,speed:Math.random()*0.04+0.02})),[]);
  const ref = useCanvas((ctx,w,h,t) => {
    ctx.clearRect(0,0,w,h);
    const bg=ctx.createLinearGradient(0,0,0,h); bg.addColorStop(0,'#020617'); bg.addColorStop(0.5,'#064e3b'); bg.addColorStop(1,'#022c22');
    ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    // Tree silhouettes
    for(let i=0;i<12;i++){
      const tx=w*(i/11); const th=h*(0.35+Math.sin(i*2.3)*0.15);
      ctx.beginPath(); ctx.moveTo(tx,h); ctx.lineTo(tx-38,h-th); ctx.lineTo(tx+38,h-th); ctx.closePath();
      ctx.fillStyle='rgba(0,20,10,0.95)'; ctx.fill();
    }
    // Stars
    for(let i=0;i<60;i++){const sx=(Math.sin(i*127)*0.5+0.5)*w,sy=(Math.cos(i*311)*0.5+0.5)*h*0.5;ctx.beginPath();ctx.arc(sx,sy,0.7,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.4)';ctx.fill();}
    // Fireflies
    fflies.forEach(f=>{
      f.x=(f.x+f.vx+f.vx*Math.sin(t*0.01+f.phase)*0.5+1)%1;
      f.y=(f.y+f.vy+f.vy*Math.cos(t*0.01+f.phase)*0.3+1)%1;
      const op=0.4+Math.sin(t*f.speed+f.phase)*0.6;
      const fx=f.x*w, fy=f.y*h;
      if(op>0.45){
        ctx.shadowColor='#facc15'; ctx.shadowBlur=18;
        ctx.beginPath(); ctx.arc(fx,fy,3.5,0,Math.PI*2);
        ctx.fillStyle=`rgba(250,204,21,${op})`; ctx.fill();
        ctx.shadowBlur=0;
      }
    });
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};
