import React, { useRef } from 'react';
import { useCanvas } from './WebSpaceThemes';

// ─── 71. TRAIN BRIDGE (train over water) ─────────────────────────────────────
export const TrainBridge = () => {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    // Morning mist sky
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.45);
    sky.addColorStop(0, '#bfdbfe'); sky.addColorStop(0.5, '#e0f2fe'); sky.addColorStop(1, '#f0f9ff');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.45);
    // Mountains in mist
    [[0.08,0.3],[0.22,0.22],[0.4,0.32],[0.6,0.2],[0.78,0.28],[0.92,0.25]].forEach(([mx,mh]) => {
      ctx.beginPath(); ctx.moveTo(+mx*w-90,h*0.45); ctx.lineTo(+mx*w,h*+mh); ctx.lineTo(+mx*w+90,h*0.45); ctx.closePath();
      ctx.fillStyle='rgba(147,197,253,0.4)'; ctx.fill();
    });
    // River / water
    const river = ctx.createLinearGradient(0, h*0.45, 0, h);
    river.addColorStop(0,'#7dd3fc'); river.addColorStop(0.4,'#38bdf8'); river.addColorStop(1,'#0891b2');
    ctx.fillStyle=river; ctx.fillRect(0,h*0.45,w,h*0.55);
    // Water reflections
    for(let wi=0;wi<w;wi+=40){const wy=h*0.5+Math.sin(wi*0.04+t*0.03)*8;ctx.beginPath();ctx.moveTo(wi,wy);ctx.lineTo(wi+25,wy+4);ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=2;ctx.stroke();}
    // Bridge structure
    const bridgeY=h*0.48;
    // Main bridge deck
    ctx.fillStyle='#475569'; ctx.fillRect(0,bridgeY,w,16);
    // Bridge pillars going into water
    [0.15,0.35,0.55,0.75,0.92].forEach(px=>{
      ctx.fillStyle='#64748b'; ctx.fillRect(+px*w-12,bridgeY,24,h*(1-0.45));
      // Pillar reflection
      const pillarRefG=ctx.createLinearGradient(0,bridgeY+16,0,h*0.75);
      pillarRefG.addColorStop(0,'rgba(100,116,139,0.5)'); pillarRefG.addColorStop(1,'transparent');
      ctx.fillStyle=pillarRefG; ctx.fillRect(+px*w-12,bridgeY+16,24,h*0.3);
    });
    // Arch / truss detail
    [0.1,0.3,0.5,0.7,0.9].forEach((px,i)=>{
      ctx.beginPath(); ctx.moveTo(+px*w,bridgeY); ctx.arc(+px*w,bridgeY,50,Math.PI,-0); ctx.strokeStyle='#94a3b8'; ctx.lineWidth=3; ctx.stroke();
    });
    // Train moving across bridge
    const trainX = (-180 + (t*2.2)%(w+360));
    if(trainX > -200 && trainX < w+200){
      // Locomotive
      ctx.fillStyle='#1e40af'; ctx.beginPath(); ctx.roundRect?.(trainX,bridgeY-55,90,45,6); ctx.fill?.();
      // Nose cone
      ctx.beginPath(); ctx.moveTo(trainX+90,bridgeY-55); ctx.lineTo(trainX+90,bridgeY-10); ctx.lineTo(trainX+115,bridgeY-35); ctx.closePath(); ctx.fillStyle='#1d4ed8'; ctx.fill();
      // Carriages
      [1,2,3].forEach(ci=>{
        ctx.fillStyle='#1e3a8a'; ctx.beginPath(); ctx.roundRect?.(trainX-90*(ci+0.2),bridgeY-50,88,44,4); ctx.fill?.();
        // Carriage windows
        for(let wi2=0;wi2<3;wi2++){ctx.fillStyle='rgba(147,197,253,0.5)';ctx.fillRect(trainX-90*(ci+0.2)+12+wi2*24,bridgeY-44,18,22);}
        // Wheels
        [18,65].forEach(wx=>{ctx.beginPath();ctx.arc(trainX-90*(ci+0.2)+wx,bridgeY-3,8,0,Math.PI*2);ctx.fillStyle='#0f172a';ctx.fill();ctx.strokeStyle='#94a3b8';ctx.lineWidth=2;ctx.stroke();});
      });
      // Smoke from engine
      for(let si=0;si<5;si++){
        const sx=trainX-si*20-Math.sin(t*0.05+si)*15,sy=bridgeY-62-si*16;
        ctx.beginPath();ctx.arc(sx,sy,10+si*4,0,Math.PI*2);
        ctx.fillStyle=`rgba(200,200,200,${0.4-si*0.07})`;ctx.fill();
      }
      // Train reflection in water
      if(trainX>0&&trainX<w){
        ctx.save(); ctx.globalAlpha=0.25; ctx.translate(0,h); ctx.scale(1,-1);
        ctx.fillStyle='#1e40af'; ctx.fillRect(trainX,bridgeY-55,90,45);
        ctx.restore();
      }
    }
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 72. RAILWAY PLATFORM (busy station) ─────────────────────────────────────
interface Commuter { x:number; y:number; vx:number; vy:number; color:string; withBag:boolean; }
export const RailwayPlatform = () => {
  const commuters = useRef<Commuter[]>([]);
  const ref = useCanvas((ctx,w,h,t)=>{
    ctx.clearRect(0,0,w,h);
    // Platform background
    const bg=ctx.createLinearGradient(0,0,0,h); bg.addColorStop(0,'#1e293b'); bg.addColorStop(1,'#0f172a');
    ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    // Station roof/ceiling
    ctx.fillStyle='#334155'; ctx.fillRect(0,0,w,h*0.18);
    // Hanging station lamps
    for(let lx=40;lx<w;lx+=120){
      ctx.fillStyle='#475569'; ctx.fillRect(lx-2,0,4,h*0.1);
      ctx.beginPath(); ctx.arc(lx,h*0.1,10,0,Math.PI*2); ctx.fillStyle='#fef3c7'; ctx.fill();
      const lampG=ctx.createRadialGradient(lx,h*0.1,0,lx,h*0.1,90); lampG.addColorStop(0,'rgba(254,243,199,0.45)'); lampG.addColorStop(1,'transparent');
      ctx.fillStyle=lampG; ctx.beginPath(); ctx.arc(lx,h*0.1,90,0,Math.PI*2); ctx.fill();
    }
    // Platform floor (tile)
    ctx.fillStyle='#1e293b'; ctx.fillRect(0,h*0.6,w,h*0.4);
    const tileSize=50;
    for(let tx=0;tx<w;tx+=tileSize) for(let ty=Math.floor(h*0.6);ty<h;ty+=tileSize){if((tx/tileSize+ty/tileSize)%2===0){ctx.fillStyle='rgba(30,41,59,0.8)';ctx.fillRect(tx,ty,tileSize,tileSize);}}
    // Yellow safety line
    ctx.fillStyle='#fbbf24'; ctx.fillRect(0,h*0.62,w,5);
    // Train tracks (at bottom)
    ctx.fillStyle='#374151'; ctx.fillRect(0,h*0.85,w,h*0.15);
    ctx.fillStyle='#4b5563'; ctx.fillRect(0,h*0.85,w,6); ctx.fillRect(0,h*0.94,w,6);
    for(let rs=0;rs<w/55;rs++){ctx.fillStyle='#6b7280';ctx.fillRect(rs*55,h*0.84,35,h*0.12);}
    // Train in station (partially visible)
    const trainPresent = Math.sin(t*0.008) > -0.5;
    if(trainPresent){
      ctx.fillStyle='#1e40af'; ctx.fillRect(0,h*0.62,w,h*0.24);
      // Train windows
      for(let wx=40;wx<w;wx+=100){ctx.fillStyle='rgba(147,197,253,0.4)';ctx.fillRect(wx,h*0.65,70,50);}
      // Open doors
      [w*0.18,w*0.42,w*0.65,w*0.88].forEach(dx=>{ctx.fillStyle='#0f172a';ctx.fillRect(dx-18,h*0.62,36,h*0.24);});
      // Train number sign
      ctx.fillStyle='#fbbf24'; ctx.font=`bold ${w*0.018}px sans-serif`; ctx.textAlign='center';
      ctx.fillText('PLATFORM 3 | DEPARTS 17:42',w/2,h*0.2);
    }
    // Crowd of commuters (lots of people moving)
    while(commuters.current.length<50) commuters.current.push({
      x:Math.random()*w,y:h*(0.65+Math.random()*0.2),
      vx:(Math.random()*2+0.5)*(Math.random()>0.5?1:-1),vy:(Math.random()-0.5)*0.3,
      color:`hsl(${Math.random()*360},45%,40%)`,withBag:Math.random()>0.5
    });
    commuters.current=commuters.current.filter(p=>p.x>-20&&p.x<w+20);
    commuters.current.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy+(Math.sin(t*0.02+p.x)*0.15);
      p.y=Math.max(h*0.63,Math.min(h*0.83,p.y));
      const sz=9+Math.random()*3;
      const leg=Math.sin(t*0.18+p.x)*8;
      ctx.fillStyle=p.color;
      ctx.beginPath(); ctx.arc(p.x,p.y-sz*2,sz*0.75,0,Math.PI*2); ctx.fill();
      ctx.fillRect(p.x-sz*0.5,p.y-sz,sz,sz*1.8);
      ctx.beginPath(); ctx.moveTo(p.x,p.y+sz*0.8); ctx.lineTo(p.x-leg,p.y+sz*2.5); ctx.strokeStyle='#1e293b'; ctx.lineWidth=sz*0.4; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(p.x,p.y+sz*0.8); ctx.lineTo(p.x+leg,p.y+sz*2.5); ctx.stroke();
      if(p.withBag){ctx.fillStyle='#64748b';ctx.fillRect(p.x+(p.vx>0?sz*0.5:-sz*1.2),p.y-sz,sz*0.8,sz*1.2);}
    });
    // Departure board
    ctx.fillStyle='#0f172a'; ctx.fillRect(w*0.35,h*0.22,w*0.3,h*0.14);
    ctx.fillStyle='#22d3ee'; ctx.font=`${w*0.013}px monospace`; ctx.textAlign='center';
    ['12:30 MUMBAI','15:45 DELHI','17:00 JAIPUR'].forEach((r,i)=>{ctx.fillText(r,w*0.5,h*0.27+i*h*0.038);});
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 73. TRUCK NIGHT ──────────────────────────────────────────────────────────
export const TruckNight = () => {
  const ref = useCanvas((ctx,w,h,t)=>{
    ctx.clearRect(0,0,w,h); ctx.fillStyle='#020617'; ctx.fillRect(0,0,w,h);
    // Stars
    for(let i=0;i<50;i++){const sx=(Math.sin(i*89)*0.5+0.5)*w,sy=(Math.cos(i*137)*0.5+0.5)*h*0.5;ctx.beginPath();ctx.arc(sx,sy,0.6,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.4)';ctx.fill();}
    // Wet road
    ctx.fillStyle='#0f172a'; ctx.fillRect(0,h*0.55,w,h*0.45);
    // Road markings
    const dashOff=(t*3)%80;
    for(let i=-1;i<w/80+2;i++){ctx.fillStyle='rgba(251,191,36,0.4)';ctx.fillRect(i*80+dashOff,h*0.76,45,5);}
    // Road edges
    ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.fillRect(0,h*0.57,w,3); ctx.fillRect(0,h*0.95,w,3);
    // Headlights illuminating road ahead
    const headLG=ctx.createRadialGradient(w/2,h*0.55,0,w/2,h*0.75,250);
    headLG.addColorStop(0,'rgba(255,250,200,0.5)'); headLG.addColorStop(1,'transparent');
    ctx.fillStyle=headLG; ctx.beginPath(); ctx.arc(w/2,h*0.55,250,0,Math.PI*2); ctx.fill();
    // Taillights of distant truck ahead
    [w*0.42,w*0.58].forEach(tx=>{
      const tg=ctx.createRadialGradient(tx,h*0.6,0,tx,h*0.6,30); tg.addColorStop(0,'rgba(239,68,68,0.8)'); tg.addColorStop(1,'transparent');
      ctx.fillStyle=tg; ctx.beginPath(); ctx.arc(tx,h*0.6,30,0,Math.PI*2); ctx.fill();
    });
    // Full screen rain streaks
    for(let ri=0;ri<60;ri++){
      const rx=(Math.sin(ri*37)*0.5+0.5)*w;
      const rTop=(ri*41+t*2)%h; const rLen=40+Math.sin(ri)*25;
      const rg2=ctx.createLinearGradient(rx,rTop,rx+2,rTop+rLen);
      rg2.addColorStop(0,'rgba(147,197,253,0.55)'); rg2.addColorStop(1,'transparent');
      ctx.beginPath(); ctx.moveTo(rx,rTop); ctx.lineTo(rx+2,rTop+rLen); ctx.strokeStyle=rg2; ctx.lineWidth=1.5; ctx.stroke();
    }
    // Wiper sweep full screen base
    const wiperAngle=-Math.PI*0.85+Math.sin(t*0.05)*Math.PI*0.7;
    const wx=w*0.5, wy=h;
    ctx.beginPath(); ctx.moveTo(wx,wy); ctx.lineTo(wx+Math.cos(wiperAngle)*w*1.5,wy+Math.sin(wiperAngle)*(h*1.5));
    ctx.strokeStyle='rgba(100,116,139,0.5)'; ctx.lineWidth=6; ctx.stroke();
    const wiperAngle2=-Math.PI*0.35+Math.sin(t*0.05+0.5)*Math.PI*0.6;
    ctx.beginPath(); ctx.moveTo(wx,wy); ctx.lineTo(wx+Math.cos(wiperAngle2)*w*1.5,wy+Math.sin(wiperAngle2)*(h*1.5));
    ctx.stroke();
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 74. BOAT RIDE (backwater canal) ──────────────────────────────────────────
interface Wake { x:number; y:number; r:number; op:number; }
export const BoatRide = () => {
  const wakes = useRef<Wake[]>([]);
  const ref = useCanvas((ctx,w,h,t)=>{
    ctx.clearRect(0,0,w,h);
    // Sunset sky
    const sky=ctx.createLinearGradient(0,0,0,h*0.45);
    sky.addColorStop(0,'#fde68a'); sky.addColorStop(0.4,'#fb923c'); sky.addColorStop(1,'#f0fdfa');
    ctx.fillStyle=sky; ctx.fillRect(0,0,w,h*0.45);
    // Glowing sun
    const sunG=ctx.createRadialGradient(w*0.5,h*0.42,0,w*0.5,h*0.42,100);
    sunG.addColorStop(0,'rgba(255,240,150,0.95)'); sunG.addColorStop(0.4,'rgba(251,191,36,0.7)'); sunG.addColorStop(1,'transparent');
    ctx.fillStyle=sunG; ctx.beginPath(); ctx.arc(w*0.5,h*0.42,100,0,Math.PI*2); ctx.fill();
    // Water / canal
    const water=ctx.createLinearGradient(0,h*0.45,0,h);
    water.addColorStop(0,'#7dd3fc'); water.addColorStop(0.3,'#38bdf8'); water.addColorStop(1,'#0891b2');
    ctx.fillStyle=water; ctx.fillRect(0,h*0.45,w,h*0.55);
    // Sun golden reflection on water
    for(let xi=-60;xi<=60;xi+=4){const ry=h*0.46+Math.abs(xi)*0.1+Math.sin(xi*0.1+t*0.03)*5;ctx.beginPath();ctx.arc(w*0.5+xi,ry,2,0,Math.PI*2);ctx.fillStyle=`rgba(251,191,36,${0.65-Math.abs(xi)/120})`;ctx.fill();}
    // Palm trees on banks
    [[0.04,0.4],[0.1,0.38],[0.9,0.42],[0.96,0.39]].forEach(([bx,by])=>{
      const tx=+bx*w, ty=+by*h, th=h*0.18;
      ctx.fillStyle='#92400e'; ctx.fillRect(tx-4,ty,8,th+10);
      ctx.fillStyle='#166534'; [0,-0.3,0.3,-0.5,0.5].forEach((a,ai)=>{ctx.beginPath();ctx.moveTo(tx,ty);ctx.bezierCurveTo(tx+Math.sin(a)*50,ty-th*0.35,tx+Math.sin(a)*85,ty-th*0.7,tx+Math.sin(a)*80,ty-th*(0.85+ai*0.05));ctx.strokeStyle='#15803d';ctx.lineWidth=4-ai*0.5;ctx.stroke();});
    });
    // Village huts on bank
    [[0.08,0.42],[0.88,0.44]].forEach(([bx,by])=>{
      ctx.fillStyle='#d97706'; ctx.fillRect(+bx*w-25,+by*h,50,35);
      ctx.beginPath(); ctx.moveTo(+bx*w-28,+by*h); ctx.lineTo(+bx*w,+by*h-22); ctx.lineTo(+bx*w+28,+by*h); ctx.closePath(); ctx.fillStyle='#92400e'; ctx.fill();
      ctx.fillStyle='rgba(251,191,36,0.4)'; ctx.fillRect(+bx*w-10,+by*h+10,18,18);
    });
    // Wooden boat
    const bx2=w*0.5, by2=h*0.6+Math.sin(t*0.025)*6;
    // Wake from boat
    wakes.current.push({x:bx2,y:by2+8,r:8,op:0.7});
    wakes.current=wakes.current.filter(wk=>wk.op>0.02);
    wakes.current.forEach(wk=>{wk.r+=1.5;wk.op-=0.012;ctx.beginPath();ctx.ellipse(wk.x,wk.y+18,wk.r,wk.r*0.35,0,0,Math.PI*2);ctx.strokeStyle=`rgba(255,255,255,${wk.op})`;ctx.lineWidth=1.5;ctx.stroke();});
    // Hull
    ctx.beginPath(); ctx.moveTo(bx2-80,by2+20); ctx.bezierCurveTo(bx2-75,by2+38,bx2+75,by2+38,bx2+80,by2+20);
    ctx.lineTo(bx2+75,by2); ctx.lineTo(bx2-75,by2); ctx.closePath();
    ctx.fillStyle='#92400e'; ctx.fill(); ctx.strokeStyle='#78350f'; ctx.lineWidth=2; ctx.stroke();
    // Deck & passengers
    ctx.fillStyle='#b45309'; ctx.fillRect(bx2-65,by2-8,130,10);
    [[bx2-38,by2-14],[bx2+5,by2-16],[bx2+40,by2-13]].forEach(([px,py])=>{
      ctx.fillStyle='#1e293b'; ctx.beginPath(); ctx.arc(+px,+py-12,8,0,Math.PI*2); ctx.fill(); ctx.fillRect(+px-5,+py-5,10,18);
    });
    // Oarsman with oar
    ctx.beginPath(); ctx.moveTo(bx2-55,by2-4); ctx.lineTo(bx2-80,by2+20+Math.sin(t*0.04)*15);
    ctx.strokeStyle='#78350f'; ctx.lineWidth=3.5; ctx.stroke();
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 75. LO-FI WINDOW (cozy rainy study) ─────────────────────────────────────
interface LFDrop { x:number; y:number; vy:number; len:number; }
export const LoFiWindow = () => {
  const drops = useRef<LFDrop[]>([]);
  const ref = useCanvas((ctx,w,h,t)=>{
    ctx.clearRect(0,0,w,h);
    // Cozy room – warm dark
    ctx.fillStyle='#1c1410'; ctx.fillRect(0,0,w,h);
    // Bookshelf on left
    ctx.fillStyle='#2c1e10'; ctx.fillRect(0,h*0.25,w*0.12,h*0.75);
    ['#dc2626','#2563eb','#16a34a','#d97706','#7c3aed'].forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(w*0.02,h*0.28+i*h*0.06,w*0.08,h*0.05);});
    // Desk with coffee / notebook
    ctx.fillStyle='#3b2208'; ctx.fillRect(w*0.1,h*0.72,w*0.85,h*0.06);
    // Coffee mug
    const mugX=w*0.22, mugY=h*0.7;
    ctx.fillStyle='#fbbf24'; ctx.fillRect(mugX-14,mugY,28,30); ctx.beginPath(); ctx.arc(mugX+22,mugY+15,8,0,Math.PI*2); ctx.fillStyle='rgba(0,0,0,0)'; ctx.strokeStyle='#fbbf24'; ctx.lineWidth=3; ctx.stroke();
    // Coffee steam
    for(let si=0;si<3;si++){const sy2=mugY-((t*0.5+si*18)%45);ctx.beginPath();ctx.moveTo(mugX+si*5-5,mugY);ctx.bezierCurveTo(mugX+si*5,sy2+15,mugX+si*5+8,sy2+5,mugX+si*5+4,sy2);ctx.strokeStyle=`rgba(255,255,255,${0.4-((t*0.5+si*18)%45)/110})`;ctx.lineWidth=1.8;ctx.stroke();}
    // Notebook
    ctx.fillStyle='#fef9c3'; ctx.fillRect(w*0.3,h*0.68,w*0.22,h*0.08); ctx.strokeStyle='#d97706'; ctx.lineWidth=1; for(let li=0;li<4;li++) ctx.strokeRect(w*0.32,h*0.7+li*h*0.014,w*0.18,1);
    // Lamp
    const lampX=w*0.88, lampY=h*0.45;
    ctx.fillStyle='#92400e'; ctx.fillRect(lampX-2,lampY,4,h*0.28);
    ctx.beginPath(); ctx.moveTo(lampX-30,lampY); ctx.lineTo(lampX+30,lampY); ctx.lineTo(lampX+20,lampY-35); ctx.lineTo(lampX-20,lampY-35); ctx.closePath(); ctx.fillStyle='#fbbf24'; ctx.fill();
    const warmG=ctx.createRadialGradient(lampX,lampY,0,lampX,lampY+60,180); warmG.addColorStop(0,'rgba(251,191,36,0.4)'); warmG.addColorStop(1,'transparent');
    ctx.fillStyle=warmG; ctx.beginPath(); ctx.arc(lampX,lampY+60,180,0,Math.PI*2); ctx.fill();
    // Window (large, occupying center)
    const wx=w*0.18, wy=h*0.05, ww=w*0.58, wh=h*0.68;
    ctx.strokeStyle='#5c3d1e'; ctx.lineWidth=16; ctx.strokeRect(wx,wy,ww,wh);
    // Night city through window (blurry bokeh)
    ctx.fillStyle='rgba(9,15,30,0.85)'; ctx.fillRect(wx+8,wy+8,ww-16,wh-16);
    [[0.22,0.35,'#f97316'],[0.45,0.28,'#22d3ee'],[0.65,0.4,'#fbbf24'],[0.35,0.55,'#f43f5e'],[0.7,0.62,'#818cf8']].forEach(([lx,ly,c])=>{
      const lg2=ctx.createRadialGradient(+lx*w,+ly*h,0,+lx*w,+ly*h,35); lg2.addColorStop(0,c+'88'); lg2.addColorStop(1,'transparent');
      ctx.fillStyle=lg2; ctx.beginPath(); ctx.arc(+lx*w,+ly*h,35,0,Math.PI*2); ctx.fill();
    });
    // Rain on window
    while(drops.current.length<45) drops.current.push({x:wx+10+Math.random()*(ww-20),y:wy+10,vy:Math.random()*3+2,len:Math.random()*45+20});
    drops.current=drops.current.filter(d=>d.y<wy+wh-10);
    drops.current.forEach(d=>{
      d.y+=d.vy;
      const rg2=ctx.createLinearGradient(d.x,d.y,d.x,d.y-d.len); rg2.addColorStop(0,'rgba(147,197,253,0.6)'); rg2.addColorStop(1,'transparent');
      ctx.beginPath(); ctx.moveTo(d.x,d.y); ctx.lineTo(d.x+0.5,d.y-d.len); ctx.strokeStyle=rg2; ctx.lineWidth=1.5; ctx.stroke();
    });
    // Cat on windowsill
    const catX=wx+ww-35, catY=wy+wh-18;
    ctx.fillStyle='#78716c';
    ctx.beginPath(); ctx.arc(catX,catY-20,14,0,Math.PI*2); ctx.fill();
    ctx.fillRect(catX-10,catY-8,20,22); // body
    // Ears
    ctx.beginPath(); ctx.moveTo(catX-10,catY-28); ctx.lineTo(catX-18,catY-40); ctx.lineTo(catX-4,catY-28); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(catX+10,catY-28); ctx.lineTo(catX+18,catY-40); ctx.lineTo(catX+4,catY-28); ctx.closePath(); ctx.fill();
    // Cat tail curling
    ctx.beginPath(); ctx.moveTo(catX+8,catY+12); ctx.bezierCurveTo(catX+30,catY+8,catX+38,catY-8+Math.sin(t*0.03)*6,catX+28,catY-18+Math.sin(t*0.03)*6);
    ctx.strokeStyle='#78716c'; ctx.lineWidth=5; ctx.stroke();
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 76. NEON ALLEY ──────────────────────────────────────────────────────────
export const NeonAlley = () => {
  const ref = useCanvas((ctx,w,h,t)=>{
    ctx.clearRect(0,0,w,h); ctx.fillStyle='#020617'; ctx.fillRect(0,0,w,h);
    // Alley vanishing point perspective
    const vx=w*0.5, vy=h*0.35;
    // Alley floor (wet)
    ctx.fillStyle='#0a0f1a';
    ctx.beginPath(); ctx.moveTo(0,h); ctx.lineTo(w,h); ctx.lineTo(vx+80,vy); ctx.lineTo(vx-80,vy); ctx.closePath(); ctx.fill();
    // Left wall
    ctx.fillStyle='#0d0a12'; ctx.beginPath(); ctx.moveTo(0,h); ctx.lineTo(vx-80,vy); ctx.lineTo(0,vy); ctx.lineTo(0,h); ctx.closePath(); ctx.fill();
    // Right wall
    ctx.beginPath(); ctx.moveTo(w,h); ctx.lineTo(vx+80,vy); ctx.lineTo(w,vy); ctx.lineTo(w,h); ctx.closePath(); ctx.fill();
    // Pipes and AC units on buildings
    [[0.08,0.45],[0.06,0.6],[0.92,0.5],[0.94,0.65]].forEach(([px,py])=>{ctx.fillStyle='#334155';ctx.fillRect(+px*w-8,+py*h,16,35);});
    // Neon signs on walls (LEFT side)
    const signs=[
      {x:w*0.08,y:h*0.52,c:'#f43f5e',text:'HOTEL',flicker:Math.sin(t*0.07)>-0.7},
      {x:w*0.07,y:h*0.65,c:'#22d3ee',text:'RAMEN',flicker:Math.sin(t*0.09+1)>-0.5},
      {x:w*0.9,y:h*0.48,c:'#a78bfa',text:'BAR',flicker:true},
      {x:w*0.91,y:h*0.62,c:'#f97316',text:'CYBER',flicker:Math.sin(t*0.06+2)>-0.6},
    ];
    signs.forEach(s=>{
      if(!s.flicker) return;
      ctx.shadowColor=s.c; ctx.shadowBlur=18;
      ctx.strokeStyle=s.c; ctx.lineWidth=2.5;
      ctx.strokeRect(s.x-32,s.y-12,65,22);
      ctx.fillStyle=s.c; ctx.font=`bold 11px sans-serif`; ctx.textAlign='center';
      ctx.fillText(s.text,s.x,s.y+4);
      ctx.shadowBlur=0;
      // Glow on wet floor reflection
      const refG=ctx.createLinearGradient(s.x,h*0.85,s.x,h);
      refG.addColorStop(0,s.c+'44'); refG.addColorStop(1,'transparent');
      ctx.fillStyle=refG; ctx.fillRect(s.x-40,h*0.85,80,h*0.15);
    });
    // Steam
    for(let si=0;si<5;si++){const sx=vx-30+si*15,sy=h*0.55-((t*0.6+si*20)%65);ctx.beginPath();ctx.moveTo(sx,h*0.55);ctx.bezierCurveTo(sx+8,sy+20,sx-8,sy+8,sx,sy);ctx.strokeStyle=`rgba(200,200,200,${0.3-((t*0.6+si*20)%65)/200})`;ctx.lineWidth=2.5;ctx.stroke();}
    // Rain
    for(let ri=0;ri<40;ri++){const rx=(Math.sin(ri*37)*0.4+0.5)*w,ry=((ri*41+t*3)%h);ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-1.5,ry-18);ctx.strokeStyle='rgba(147,197,253,0.3)';ctx.lineWidth=1;ctx.stroke();}
    // Lone figure walking into the distance
    const figProgress=((t*0.008)%1);
    const figX=w*0.5+(Math.random()-0.5)*30, figY=vy+(h-vy)*figProgress*0.9;
    const figSize=0.025+(1-figProgress)*0.04;
    const legSwing=Math.sin(t*0.18)*10*(1-figProgress*0.8);
    ctx.fillStyle='rgba(10,12,25,0.95)';
    ctx.beginPath(); ctx.arc(figX,figY-h*figSize*0.5,h*figSize*0.35,0,Math.PI*2); ctx.fill();
    ctx.fillRect(figX-h*figSize*0.35,figY-h*figSize*0.15,h*figSize*0.7,h*figSize*0.8);
    ctx.beginPath(); ctx.moveTo(figX,figY+h*figSize*0.65); ctx.lineTo(figX-legSwing,figY+h*figSize*1.3); ctx.strokeStyle='rgba(10,12,25,0.95)'; ctx.lineWidth=h*figSize*0.25; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(figX,figY+h*figSize*0.65); ctx.lineTo(figX+legSwing,figY+h*figSize*1.3); ctx.stroke();
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 77. FOG STREET ──────────────────────────────────────────────────────────
export const FogStreet = () => {
  const ref = useCanvas((ctx,w,h,t)=>{
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle='#334155'; ctx.fillRect(0,0,w,h);
    // Victorian buildings silhouette
    [[0,0.5,90],[0.1,0.35,110],[0.22,0.45,80],[0.33,0.3,130],[0.48,0.4,90],[0.6,0.32,120],[0.72,0.45,75],[0.82,0.38,100],[0.93,0.48,75]].forEach(([bx,bh,bw])=>{
      ctx.fillStyle='rgba(20,30,45,0.8)'; ctx.fillRect(+bx*w,h*+bh,+bw,h*(1-+bh));
      // Victorian window arches
      for(let wi=+bx*w+12;wi<+bx*w+ +bw-12;wi+=25) for(let wiy=h*+bh+18;wiy<h*0.82;wiy+=35){if(Math.sin(wi*0.2+wiy*0.15)>0.2){ctx.fillStyle='rgba(251,191,36,0.3)';ctx.fillRect(wi,wiy,12,20);ctx.beginPath();ctx.arc(wi+6,wiy,6,Math.PI,0);ctx.fill();}}
    });
    // Cobble street
    ctx.fillStyle='#475569'; ctx.fillRect(0,h*0.7,w,h*0.3);
    for(let cx=10;cx<w;cx+=38) for(let cy=h*0.72;cy<h;cy+=25){ctx.fillStyle=`rgba(${50+Math.sin(cx*cy)*15},${60+Math.cos(cx*cy)*15},${75+Math.sin(cx*cy+1)*10},0.6)`;ctx.beginPath();ctx.ellipse(cx,cy,16,10,0,0,Math.PI*2);ctx.fill();}
    // Gas lamp glow orbs
    [0.12,0.35,0.58,0.8].forEach(lx=>{
      const lry=h*0.55;
      ctx.fillStyle='#64748b'; ctx.fillRect(+lx*w-3,h*0.38,6,lry-h*0.38);
      const lampOrb=ctx.createRadialGradient(+lx*w,h*0.38,0,+lx*w,h*0.38,95);
      lampOrb.addColorStop(0,'rgba(251,191,36,0.7)'); lampOrb.addColorStop(0.4,'rgba(251,191,36,0.25)'); lampOrb.addColorStop(1,'transparent');
      ctx.fillStyle=lampOrb; ctx.beginPath(); ctx.arc(+lx*w,h*0.38,95,0,Math.PI*2); ctx.fill();
    });
    // Thick rolling fog layers
    for(let fi=0;fi<8;fi++){
      const fx=(fi*w*0.18-t*0.5+w*2)%(w*1.8)-w*0.2;
      const fy=h*(0.45+fi*0.04)+Math.sin(fi*1.5+t*0.01)*20;
      const fr=Math.min(w,h)*(0.35+fi*0.04);
      const fogG=ctx.createRadialGradient(fx,fy,0,fx,fy,fr);
      fogG.addColorStop(0,`rgba(148,163,184,${0.2-fi*0.018})`); fogG.addColorStop(1,'transparent');
      ctx.fillStyle=fogG; ctx.beginPath(); ctx.arc(fx,fy,fr,0,Math.PI*2); ctx.fill();
    }
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 78. FESTIVAL LIGHTS ──────────────────────────────────────────────────────
export const FestivalLights = () => {
  const ref = useCanvas((ctx,w,h,t)=>{
    ctx.clearRect(0,0,w,h); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,w,h);
    // Tree silhouettes
    for(let i=0;i<10;i++){const tx=(i/9)*w;ctx.fillStyle='rgba(0,10,5,0.9)';ctx.beginPath();ctx.moveTo(tx,h);ctx.lineTo(tx-28,h*0.35);ctx.lineTo(tx+28,h*0.35);ctx.closePath();ctx.fill();}
    // Blurred crowd
    for(let i=0;i<30;i++){const cx=(Math.sin(i*127)*0.4+0.5)*w,cy=h*0.75+(Math.cos(i*311)*0.5+0.5)*h*0.2;ctx.fillStyle=`hsl(${i*25},40%,25%)`;ctx.beginPath();ctx.arc(cx,cy,12,0,Math.PI*2);ctx.fill();ctx.fillRect(cx-7,cy,14,22);}
    // String lights (multiple rows)
    const flicker=0.8+Math.sin(t*0.08)*0.12;
    const festColors=['#f43f5e','#f97316','#fbbf24','#22c55e','#3b82f6','#8b5cf6','#ec4899'];
    for(let row=0;row<6;row++){
      const rowY=h*(0.12+row*0.1);
      ctx.beginPath(); for(let x=0;x<=w;x+=8) ctx.lineTo(x,rowY+Math.sin(x*0.06+row)*18); ctx.strokeStyle='rgba(71,85,105,0.4)'; ctx.lineWidth=1; ctx.stroke();
      for(let lx=15+row*8;lx<w;lx+=55){
        const ly=rowY+Math.sin(lx*0.06+row)*18;
        const c=festColors[(lx+row)%festColors.length];
        const isFlicker=Math.sin(lx*0.3+t*0.05+row)>-0.6;
        if(isFlicker){
          ctx.shadowColor=c; ctx.shadowBlur=20*flicker;
          ctx.beginPath(); ctx.arc(lx,ly,6,0,Math.PI*2); ctx.fillStyle=c; ctx.fill();
          const lhalo=ctx.createRadialGradient(lx,ly,0,lx,ly,35); lhalo.addColorStop(0,c+'77'); lhalo.addColorStop(1,'transparent');
          ctx.fillStyle=lhalo; ctx.beginPath(); ctx.arc(lx,ly,35,0,Math.PI*2); ctx.fill();
          ctx.shadowBlur=0;
        }
      }
    }
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 79. FERRIS WHEEL ─────────────────────────────────────────────────────────
export const FerrisWheel = () => {
  const ref = useCanvas((ctx,w,h,t)=>{
    ctx.clearRect(0,0,w,h); ctx.fillStyle='#020617'; ctx.fillRect(0,0,w,h);
    // Carnival stars
    for(let i=0;i<80;i++){const sx=(Math.sin(i*89)*0.5+0.5)*w,sy=(Math.cos(i*137)*0.5+0.5)*h*0.5;ctx.beginPath();ctx.arc(sx,sy,0.8,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${0.3+Math.sin(i+t*0.015)*0.25})`;ctx.fill();}
    // Lake reflection below
    ctx.fillStyle='rgba(10,15,30,0.8)'; ctx.fillRect(0,h*0.75,w,h*0.25);
    // Carnival ground
    ctx.fillStyle='#1e293b'; ctx.fillRect(0,h*0.8,w,h*0.2);
    // Ferris wheel center
    const cx=w/2, cy=h*0.42;
    const R=h*0.35, rot=t*0.012;
    // Spokes
    const numGondolas=12;
    for(let g=0;g<numGondolas;g++){
      const a=g/numGondolas*Math.PI*2+rot;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);
      ctx.strokeStyle='rgba(251,191,36,0.5)'; ctx.lineWidth=2; ctx.stroke();
    }
    // Outer ring
    ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.strokeStyle='rgba(251,191,36,0.8)'; ctx.lineWidth=4; ctx.stroke();
    // Inner ring
    ctx.beginPath(); ctx.arc(cx,cy,R*0.25,0,Math.PI*2); ctx.strokeStyle='rgba(251,191,36,0.6)'; ctx.lineWidth=3; ctx.stroke();
    // Hub
    ctx.beginPath(); ctx.arc(cx,cy,14,0,Math.PI*2); ctx.fillStyle='#fbbf24'; ctx.fill();
    // Gondolas with lights
    const gondolaColors=['#ef4444','#3b82f6','#22c55e','#f97316','#8b5cf6','#ec4899','#ef4444','#3b82f6','#22c55e','#f97316','#8b5cf6','#ec4899'];
    for(let g=0;g<numGondolas;g++){
      const a=g/numGondolas*Math.PI*2+rot;
      const gx=cx+Math.cos(a)*R, gy=cy+Math.sin(a)*R;
      ctx.shadowColor=gondolaColors[g]; ctx.shadowBlur=12;
      ctx.fillStyle=gondolaColors[g]; ctx.fillRect(gx-10,gy-8,20,18);
      ctx.shadowBlur=0;
      // Gondola support line to rim
      ctx.beginPath(); ctx.moveTo(gx,gy-10); ctx.lineTo(gx,gy-22); ctx.strokeStyle='rgba(200,200,200,0.5)'; ctx.lineWidth=1.5; ctx.stroke();
      // Light reflection in lake
      if(gy<cy){
        const refGy=h*0.75+h*0.25-(gy-h*0.08);
        if(refGy>h*0.75){ctx.globalAlpha=0.25;ctx.fillStyle=gondolaColors[g];ctx.fillRect(gx-10,refGy-8,20,18);ctx.globalAlpha=1;}
      }
    }
    // Support legs
    ctx.strokeStyle='#4b5563'; ctx.lineWidth=8;
    ctx.beginPath(); ctx.moveTo(cx,cy+R); ctx.lineTo(cx-80,h*0.8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,cy+R); ctx.lineTo(cx+80,h*0.8); ctx.stroke();
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};

// ─── 80. SLOW TRAFFIC ─────────────────────────────────────────────────────────
interface STCar { x:number; y:number; lane:number; speed:number; color:string; braking:boolean; }
export const SlowTraffic = () => {
  const cars = useRef<STCar[]>([]);
  const ref = useCanvas((ctx,w,h,t)=>{
    ctx.clearRect(0,0,w,h);
    // Golden hour sky (overpass view angle)
    const sky=ctx.createLinearGradient(0,0,0,h);
    sky.addColorStop(0,'#7c3aed'); sky.addColorStop(0.3,'#f97316'); sky.addColorStop(0.5,'#fbbf24'); sky.addColorStop(1,'#fde68a');
    ctx.fillStyle=sky; ctx.fillRect(0,0,w,h*0.45);
    // Sun
    const sunG2=ctx.createRadialGradient(w*0.6,h*0.42,0,w*0.6,h*0.42,100); sunG2.addColorStop(0,'rgba(255,240,150,1)'); sunG2.addColorStop(0.4,'rgba(249,115,22,0.6)'); sunG2.addColorStop(1,'transparent');
    ctx.fillStyle=sunG2; ctx.beginPath(); ctx.arc(w*0.6,h*0.42,100,0,Math.PI*2); ctx.fill();
    // Highway base (bird's eye from overpass)
    ctx.fillStyle='#374151'; ctx.fillRect(0,h*0.45,w,h*0.55);
    // Lane dividers
    const numLanes=5;
    for(let li=1;li<numLanes;li++){
      const ly=h*0.45+li*(h*0.55/numLanes);
      const dashOff=(t*0.5)%40;
      for(let di=0;di<w/40+1;di++) ctx.fillStyle='rgba(251,191,36,0.5)',ctx.fillRect(di*40+dashOff,ly-1,22,4);
    }
    // Road shoulders
    ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.fillRect(0,h*0.45,w,3); ctx.fillRect(0,h-2,w,3);
    // Spawn cars (bumper to bumper)
    if(cars.current.length<60&&Math.random()<0.1){
      const lane=Math.floor(Math.random()*numLanes);
      const laneY=h*0.45+(lane+0.5)*(h*0.55/numLanes);
      cars.current.push({x:w+50,y:laneY,lane,speed:-(Math.random()*0.8+0.3),color:`hsl(${Math.random()*360},60%,${40+Math.random()*20}%)`,braking:Math.random()>0.6});
    }
    cars.current=cars.current.filter(c=>c.x>-80);
    cars.current.forEach(c=>{
      c.x+=c.speed;
      const cw=40, ch=22;
      // Car body (top-down view)
      ctx.fillStyle=c.color; ctx.fillRect(c.x-cw/2,c.y-ch/2,cw,ch);
      // Windshield
      ctx.fillStyle='rgba(147,197,253,0.4)'; ctx.fillRect(c.x-cw/2+5,c.y-ch/2+3,cw-10,ch*0.4);
      ctx.fillRect(c.x-cw/2+5,c.y+ch/2-ch*0.48,cw-10,ch*0.38);
      // Brake lights (red glow)
      if(c.braking||Math.random()<0.35){
        ctx.shadowColor='#ef4444'; ctx.shadowBlur=14;
        [c.y-ch/2+3,c.y+ch/2-5].forEach(ry=>{ctx.beginPath();ctx.arc(c.x-cw/2,ry,4,0,Math.PI*2);ctx.fillStyle='#ef4444';ctx.fill();});
        ctx.shadowBlur=0;
      }
    });
    // Overpass shadow top portion
    ctx.fillStyle='rgba(0,0,0,0.35)'; ctx.fillRect(0,h*0.45,w,15);
  });
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
};
