import React, { useEffect, useRef } from 'react';
import { useTheme, ThemeMode } from '@/context/ThemeContext';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life?: number;
  maxLife?: number;
  angle?: number;
  speed?: number;
  targetX?: number;
  targetY?: number;
}

export default function AnimatedBackground() {
  const { currentMode, colors } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const requestRef = useRef<number | undefined>(undefined);
  const timeRef = useRef<number>(0);

  // Initialize particles based on theme
  const initParticles = (mode: ThemeMode, width: number, height: number) => {
    particles.current = [];
    
    switch (mode) {
      case 'twinkling_stars':
        for (let i = 0; i < 400; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * 2,
            vx: 0,
            vy: 0,
            size: Math.random() * 2,
            color: Math.random() > 0.8 ? '#b0c4ff' : '#ffffff',
            opacity: Math.random(),
            speed: 0.01 + Math.random() * 0.02
          });
        }
        break;
      case 'galaxy_spiral':
        for (let i = 0; i < 800; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * Math.min(width, height) * 0.4;
          const spiralAngle = dist * 0.01;
          particles.current.push({
            x: width / 2 + Math.cos(angle + spiralAngle) * dist,
            y: height / 2 + Math.sin(angle + spiralAngle) * dist,
            z: 0,
            vx: 0,
            vy: 0,
            size: Math.random() * 2,
            color: Math.random() > 0.5 ? '#9c27b0' : Math.random() > 0.5 ? '#03a9f4' : '#f06292',
            opacity: Math.random(),
            angle: angle + spiralAngle,
            speed: dist * 0.0005 + 0.001
          });
        }
        break;
      case 'shooting_stars':
        for (let i = 0; i < 200; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: 0,
            vx: 0, vy: 0,
            size: Math.random() * 1.5,
            color: '#fff',
            opacity: Math.random() * 0.5 + 0.2
          });
        }
        break;
      case 'nebula_clouds':
        for (let i = 0; i < 15; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            size: 200 + Math.random() * 300,
            color: Math.random() > 0.5 ? '#4a148c' : '#880e4f',
            opacity: 0.1 + Math.random() * 0.2
          });
        }
        break;
      case 'floating_planets':
        for (let i = 0; i < 8; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: 0,
            vx: 0.2 + Math.random() * 0.5,
            vy: 0,
            size: 40 + Math.random() * 80,
            color: colors.primary,
            opacity: 0.8,
            angle: Math.random() * Math.PI * 2,
            speed: 0.005 + Math.random() * 0.01
          });
        }
        break;
      case 'asteroid_field':
        for (let i = 0; i < 50; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: 5 + Math.random() * 15,
            color: '#78716c',
            opacity: 0.7,
            speed: Math.random() * 0.02
          });
        }
        break;
      case 'black_hole':
        for (let i = 0; i < 1000; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 100 + Math.random() * 300;
          particles.current.push({
            x: width / 2 + Math.cos(angle) * dist,
            y: height / 2 + Math.sin(angle) * dist,
            z: Math.random() * 10,
            vx: 0, vy: 0,
            size: 1 + Math.random() * 2,
            color: dist < 150 ? '#fbbf24' : dist < 220 ? '#3b82f6' : '#ffffff',
            opacity: Math.random(),
            angle: angle,
            speed: 2 + Math.random() * 3
          });
        }
        break;
      case 'constellation':
        for (let i = 0; i < 60; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: 0,
            vx: (Math.random() - 0.5) * 0.1,
            vy: (Math.random() - 0.5) * 0.1,
            size: 2 + Math.random() * 3,
            color: '#ffffff',
            opacity: Math.random(),
            speed: 0.02 + Math.random() * 0.05
          });
        }
        break;
      case 'digital_matrix':
        for (let i = 0; i < 100; i++) {
           particles.current.push({
             x: Math.random() * width,
             y: Math.random() * height,
             z: 0,
             vx: 0,
             vy: 2 + Math.random() * 5,
             size: 14 + Math.random() * 6,
             color: '#00ff41',
             opacity: Math.random()
           });
        }
        break;
      case 'underwater_bubbles':
        for (let i = 0; i < 100; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: height + Math.random() * 100,
            z: 0,
            vx: -0.5 + Math.random(),
            vy: -1 - Math.random() * 2,
            size: 2 + Math.random() * 8,
            color: '#ffffff',
            opacity: 0.1 + Math.random() * 0.4
          });
        }
        break;
      case 'sea_shore':
        for (let i = 0; i < 150; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: height * 0.7 + Math.random() * height * 0.3,
            z: 0, vx: -1 - Math.random(), vy: 0,
            size: 2 + Math.random() * 4,
            color: '#fff',
            opacity: Math.random() * 0.6
          });
        }
        break;
      case 'floating_boats':
        for (let i = 0; i < 6; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: height * 0.7 + Math.random() * 50,
            z: 0, vx: 0.5 + Math.random() * 0.5, vy: 0,
            size: 20 + Math.random() * 10, color: '#fff', opacity: 1
          });
        }
        break;
      case 'fireplace_glow':
        for (let i = 0; i < 50; i++) {
          particles.current.push({
            x: width / 2 + (Math.random() - 0.5) * 100,
            y: height - 20, z: 0,
            vx: (Math.random() - 0.5) * 1, vy: -1 - Math.random() * 3,
            size: 10 + Math.random() * 20,
            color: Math.random() > 0.5 ? '#f97316' : '#ef4444',
            opacity: 1, life: 1, maxLife: 0.5 + Math.random() * 0.5
          });
        }
        break;
      case 'coral_reef':
        for (let i = 0; i < 40; i++) {
          particles.current.push({
            x: Math.random() * width, y: height - Math.random() * 200, z: 0,
            vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.2,
            size: 10 + Math.random() * 20, color: i % 2 === 0 ? '#f43f5e' : '#fb7185',
            opacity: 0.8, angle: Math.random() * Math.PI * 2
          });
        }
        break;
      case 'moving_clouds':
        for (let i = 0; i < 12; i++) {
          particles.current.push({
            x: Math.random() * width, y: Math.random() * height * 0.5, z: 0,
            vx: 0.1 + Math.random() * 0.3, vy: 0,
            size: 150 + Math.random() * 200, color: '#ffffff', opacity: 0.3
          });
        }
        break;
      case 'grass_sway':
        for (let i = 0; i < 100; i++) {
          particles.current.push({
            x: (i / 100) * width, y: height, z: 0, vx: 0, vy: 0,
            size: 40 + Math.random() * 60, color: '#22c55e', opacity: 0.6
          });
        }
        break;
      case 'energy_waves':
        for (let i = 0; i < 10; i++) {
          particles.current.push({
            x: width / 2, y: height / 2, z: 0, vx: 0, vy: 0,
            size: 0, color: colors.primary, opacity: 1, speed: 2 + i
          });
        }
        break;
      case 'radar_scan':
        particles.current = [];
        for (let i = 0; i < 20; i++) {
          particles.current.push({
            x: Math.random() * width, y: Math.random() * height,
            z: 0, vx: 0, vy: 0, size: 4, color: '#22c55e', opacity: 0
          });
        }
        break;
      case 'deep_sea_glow':
        // Jellyfish
        for (let i = 0; i < 10; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: 0, vx: 0, vy: -0.2 - Math.random() * 0.3,
            size: 30 + Math.random() * 50,
            color: Math.random() > 0.5 ? '#6366f1' : '#a855f7',
            opacity: 0.6,
            speed: 0.02 + Math.random() * 0.03
          });
        }
        break;
      case 'rain_on_water':
        for (let i = 0; i < 150; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: 0, vx: 0.5, vy: 10 + Math.random() * 5,
            size: 1 + Math.random(),
            color: '#94a3b8',
            opacity: Math.random() * 0.5
          });
        }
        break;
      case 'floating_leaves':
        for (let i = 0; i < 50; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: -50 - Math.random() * height,
            z: 0, vx: -1 + Math.random() * 2, vy: 1 + Math.random() * 2,
            size: 10 + Math.random() * 20,
            color: Math.random() > 0.5 ? '#d97706' : '#b45309',
            opacity: 0.8,
            angle: Math.random() * Math.PI * 2,
            speed: 0.02 + Math.random() * 0.05
          });
        }
        break;
      case 'cherry_blossom':
        for (let i = 0; i < 70; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: -50 - Math.random() * height,
            z: 0, vx: 0.5 + Math.random(), vy: 0.8 + Math.random(),
            size: 8 + Math.random() * 12,
            color: '#fb7185',
            opacity: 0.7,
            angle: Math.random() * Math.PI * 2,
            speed: 0.02 + Math.random() * 0.04
          });
        }
        break;
      case 'snowfall':
        for (let i = 0; i < 200; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: 0,
            vx: -0.5 + Math.random(),
            vy: 1 + Math.random() * 2,
            size: 2 + Math.random() * 4,
            color: '#fff',
            opacity: Math.random() * 0.8
          });
        }
        break;
      case 'forest_fireflies':
        for (let i = 0; i < 50; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: 0, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
            size: 2 + Math.random() * 2,
            color: '#facc15',
            opacity: Math.random(),
            speed: 0.05 + Math.random() * 0.1
          });
        }
        break;
      case 'butterflies':
        for (let i = 0; i < 15; i++) {
          particles.current.push({
             x: Math.random() * width,
             y: Math.random() * height,
             z: 0, vx: 0, vy: 0, size: 10 + Math.random() * 10,
             color: colors.primary, opacity: 1,
             angle: Math.random() * Math.PI * 2,
             speed: 0.1 + Math.random() * 0.1,
             targetX: Math.random() * width,
             targetY: Math.random() * height
          });
        }
        break;
      case 'glass_orbs':
        for (let i = 0; i < 40; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * 200,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: 15 + Math.random() * 25,
            color: '#ffffff',
            opacity: 0.1 + Math.random() * 0.3
          });
        }
        break;
      case 'liquid_gradient':
        for (let i = 0; i < 5; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: 0, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
            size: 400 + Math.random() * 400,
            color: i % 2 === 0 ? '#8b5cf6' : '#ec4899',
            opacity: 0.2
          });
        }
        break;
      case 'neon_lines':
        for (let i = 0; i < 30; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: 0, vx: 5 + Math.random() * 5, vy: 5 + Math.random() * 5,
            size: 2, color: colors.primary, opacity: 1,
            speed: 100 + Math.random() * 200
          });
        }
        break;
      case 'floating_cubes':
        for (let i = 0; i < 20; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: 20 + Math.random() * 30,
            color: colors.primary,
            opacity: 0.5,
            angle: Math.random() * Math.PI * 2,
            speed: 0.01 + Math.random() * 0.02
          });
        }
        break;
      case 'circuit_glow':
        for (let i = 0; i < 40; i++) {
          particles.current.push({
             x: Math.floor(Math.random() * (width / 40)) * 40,
             y: Math.floor(Math.random() * (height / 40)) * 40,
             z: 0, vx: 0, vy: 0, size: 2, color: colors.primary, opacity: 1,
             speed: Math.random() > 0.5 ? 40 : -40
          });
        }
        break;
      case 'ai_network':
        for (let i = 0; i < 80; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: 0, vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8,
            size: 3 + Math.random() * 4,
            color: colors.primary, opacity: 0.8
          });
        }
        break;
      case 'floating_balloons':
        for (let i = 0; i < 30; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: height + 50 + Math.random() * 200,
            z: 0, vx: -0.5 + Math.random(), vy: -1 - Math.random() * 2,
            size: 15 + Math.random() * 20,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            opacity: 0.8
          });
        }
        break;
      case 'paper_planes':
        for (let i = 0; i < 12; i++) {
           particles.current.push({
             x: -100 - Math.random() * 500,
             y: Math.random() * height,
             z: 0, vx: 2 + Math.random() * 3, vy: -0.5 + Math.random(),
             size: 20, color: '#ffffff', opacity: 0.8,
             angle: Math.random() * 0.2
           });
        }
        break;
      // Default grouping init
      default:
        for (let i = 0; i < 150; i++) {
          particles.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3,
            color: colors.primary,
            opacity: Math.random()
          });
        }
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    timeRef.current += 0.01;

    ctx.save();
    switch (currentMode) {
      case 'nebula_clouds':
        ctx.filter = 'blur(60px)';
        particles.current.forEach(p => {
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
          p.x += p.vx; p.y += p.vy;
          if (p.x < -p.size || p.x > width + p.size) p.vx *= -1;
          if (p.y < -p.size || p.y > height + p.size) p.vy *= -1;
        });
        ctx.filter = 'none';
        break;

      case 'floating_planets':
        particles.current.forEach(p => {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0, p.color); grad.addColorStop(0.8, p.color); grad.addColorStop(1, 'transparent');
          ctx.globalAlpha = p.opacity; ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.beginPath(); ctx.arc(p.x + p.size*0.2, p.y + p.size*0.2, p.size, 0, Math.PI * 2); ctx.fill();
          p.x += p.vx; if (p.x > width + p.size) p.x = -p.size;
        });
        break;

      case 'asteroid_field':
        particles.current.forEach(p => {
          ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color;
          ctx.beginPath();
          for (let j = 0; j < 6; j++) {
            const angle = (j / 6) * Math.PI * 2;
            const r = p.size * (0.8 + Math.sin(angle * 3 + p.x) * 0.2);
            const x = p.x + Math.cos(angle) * r;
            const y = p.y + Math.sin(angle) * r;
            if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.closePath(); ctx.fill();
          p.x += p.vx; p.y += p.vy;
          if (p.x < -20) p.x = width + 20;
          if (p.y < -20) p.y = height + 20;
        });
        break;

      case 'black_hole':
        ctx.save();
        ctx.translate(width / 2, height / 2);
        const bGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 400);
        bGrad.addColorStop(0, 'transparent'); bGrad.addColorStop(0.2, '#000');
        bGrad.addColorStop(0.25, '#fbbf24'); bGrad.addColorStop(0.4, 'transparent');
        ctx.fillStyle = bGrad; ctx.fillRect(-width/2, -height/2, width, height);
        particles.current.forEach(p => {
          const dist = Math.sqrt(p.x*p.x + p.y*p.y);
          p.angle! -= p.speed! / (dist * 0.1 + 1);
          const pull = 0.5; const targetDist = dist - pull;
          p.x = Math.cos(p.angle!) * targetDist; p.y = Math.sin(p.angle!) * targetDist;
          if (targetDist < 40) {
            const newAngle = Math.random() * Math.PI * 2; const newDist = 300 + Math.random() * 100;
            p.x = Math.cos(newAngle) * newDist; p.y = Math.sin(newAngle) * newDist; p.angle = newAngle;
          }
          ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();
        break;

      case 'constellation':
        particles.current.forEach((p, i) => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
          p.opacity = 0.2 + Math.abs(Math.sin(timeRef.current * p.speed!)) * 0.8;
          ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
          for (let j = i + 1; j < particles.current.length; j++) {
            const p2 = particles.current[j]; const dist = Math.sqrt((p.x-p2.x)**2 + (p.y-p2.y)**2);
            if (dist < 150) {
               ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.5; ctx.globalAlpha = (1 - dist / 150) * 0.2;
               ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            }
          }
        });
        break;

      case 'twinkling_stars':
        particles.current.forEach(p => {
          p.opacity = 0.3 + Math.abs(Math.sin(timeRef.current * p.speed! * 100)) * 0.7;
          ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
          p.x += Math.sin(timeRef.current * 0.1) * 0.1; p.y += Math.cos(timeRef.current * 0.1) * 0.1;
        });
        break;

      case 'galaxy_spiral':
        ctx.save(); ctx.translate(width / 2, height / 2); ctx.rotate(timeRef.current * 0.05); ctx.translate(-width / 2, -height / 2);
        particles.current.forEach(p => {
          ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color; ctx.shadowBlur = 4; ctx.shadowColor = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();
        break;

      case 'shooting_stars':
        particles.current.forEach(p => {
          ctx.globalAlpha = p.opacity; ctx.fillStyle = '#fff';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        });
        if (Math.random() > 0.98) {
          const x = Math.random() * width; const y = Math.random() * height * 0.5;
          const len = 100 + Math.random() * 200;
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len, y + len * 0.5); ctx.stroke();
        }
        break;

      case 'digital_matrix':
        ctx.font = '20px monospace';
        particles.current.forEach(p => {
          ctx.fillStyle = p.color; ctx.globalAlpha = p.opacity;
          const char = String.fromCharCode(0x30A0 + Math.random() * 96);
          ctx.fillText(char, p.x, p.y);
          p.y += p.vy; if (p.y > height) p.y = -20;
        });
        break;

      case 'snowfall':
        particles.current.forEach(p => {
          ctx.fillStyle = p.color; ctx.globalAlpha = p.opacity;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
          p.y += p.vy; p.x += p.vx;
          if (p.y > height) p.y = -10; if (p.x > width) p.x = 0; if (p.x < 0) p.x = width;
        });
        break;

      case 'aurora_borealis':
        for (let i = 0; i < 3; i++) {
          const gradient = ctx.createLinearGradient(0, 0, width, height);
          gradient.addColorStop(0, 'transparent');
          gradient.addColorStop(0.5, i === 0 ? '#22c55e' : i === 1 ? '#a855f7' : '#06b6d4');
          gradient.addColorStop(1, 'transparent');
          ctx.strokeStyle = gradient; ctx.lineWidth = 100; ctx.globalAlpha = 0.2;
          ctx.beginPath(); ctx.moveTo(0, height * 0.2 + i * 50);
          for (let x = 0; x < width; x += 10) {
             const y = height * 0.2 + i * 50 + Math.sin(x * 0.005 + timeRef.current * (0.5 + i * 0.2)) * 100;
             ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        break;

      case 'particle_network':
        particles.current.forEach((p, i) => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1; if (p.y < 0 || p.y > height) p.vy *= -1;
          ctx.fillStyle = colors.primary; ctx.globalAlpha = p.opacity;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
          for (let j = i + 1; j < particles.current.length; j++) {
            const p2 = particles.current[j]; const dx = p.x - p2.x; const dy = p.y - p2.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 100) {
              ctx.strokeStyle = colors.primary; ctx.globalAlpha = (1 - dist / 100) * 0.3;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            }
          }
        });
        break;

      case 'ocean_waves':
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = i === 0 ? '#0c4a6e' : i === 1 ? '#075985' : '#0369a1';
          ctx.globalAlpha = 0.4; ctx.beginPath(); ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 20) {
            const y = height * 0.7 + i * 40 + Math.sin(x * 0.01 + timeRef.current * (0.5 + i * 0.3)) * 30;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(width, height); ctx.fill();
        }
        break;

      case 'underwater_bubbles':
        particles.current.forEach(p => {
          ctx.globalAlpha = p.opacity; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.stroke();
          p.y += p.vy; p.x += Math.sin(timeRef.current + p.y * 0.1) * 0.5;
          if (p.y < -20) p.y = height + 20;
        });
        break;

      case 'sea_shore':
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = i === 0 ? '#0c4a6e' : i === 1 ? '#075985' : '#0369a1';
          ctx.globalAlpha = 0.4; const offset = i * 40;
          ctx.beginPath(); ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 20) {
            const y = height * 0.8 + offset + Math.sin(x * 0.005 + timeRef.current * (1 + i * 0.5)) * 40;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(width, height); ctx.fill();
        }
        particles.current.forEach(p => {
          ctx.globalAlpha = p.opacity; ctx.fillStyle = '#fff';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
          p.x += p.vx; if (p.x < -10) p.x = width + 10;
        });
        break;

      case 'deep_sea_glow':
        particles.current.forEach(p => {
          p.opacity = 0.4 + Math.abs(Math.sin(timeRef.current * p.speed! * 10)) * 0.4;
          ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, Math.PI, 0); ctx.fill();
          ctx.lineWidth = 2; ctx.strokeStyle = p.color;
          for (let i = 0; i < 5; i++) {
            ctx.beginPath(); ctx.moveTo(p.x - p.size + (i * p.size * 0.4), p.y);
            ctx.lineTo(p.x - p.size + (i * p.size * 0.4) + Math.sin(timeRef.current * 5 + i) * 10, p.y + p.size * 1.5);
            ctx.stroke();
          }
          p.y += p.vy; if (p.y < -p.size * 2) p.y = height + p.size * 2;
        });
        break;

      case 'water_ripple':
        if (Math.random() > 0.98) {
          particles.current.push({ x: Math.random() * width, y: Math.random() * height, z: 0, vx: 0, vy: 0, size: 0, color: '#fff', opacity: 1, speed: 1.5 });
        }
        particles.current.forEach((p, idx) => {
          ctx.strokeStyle = '#fff'; ctx.globalAlpha = p.opacity; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.stroke();
          p.size += p.speed!; p.opacity -= 0.01;
          if (p.opacity <= 0) particles.current.splice(idx, 1);
        });
        break;

      case 'rain_on_water':
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
        particles.current.forEach(p => {
          ctx.globalAlpha = p.opacity; ctx.beginPath(); ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + 2, p.y + 15); ctx.stroke();
          p.y += p.vy; p.x += p.vx; if (p.y > height) { p.y = -20; p.x = Math.random() * width; }
        });
        break;

      case 'floating_leaves':
        particles.current.forEach(p => {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(timeRef.current * p.speed! + p.angle!);
          ctx.fillStyle = p.color; ctx.globalAlpha = p.opacity;
          ctx.beginPath(); ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
          p.y += p.vy; p.x += p.vx + Math.sin(timeRef.current + p.y * 0.01) * 0.5;
          if (p.y > height + 50) p.y = -50;
        });
        break;

      case 'cherry_blossom':
        particles.current.forEach(p => {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(timeRef.current * 0.02 + p.angle!);
          ctx.fillStyle = p.color; ctx.globalAlpha = p.opacity;
          ctx.beginPath(); ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          p.y += p.vy; p.x += p.vx + Math.sin(timeRef.current * 0.5) * 0.5;
          if (p.y > height + 20) p.y = -20;
        });
        break;

      case 'forest_fireflies':
        particles.current.forEach(p => {
          const glow = Math.abs(Math.sin(timeRef.current * p.speed!)) * 0.8;
          ctx.globalAlpha = glow; ctx.fillStyle = p.color; ctx.shadowBlur = 10; ctx.shadowColor = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
          p.x += p.vx + Math.sin(timeRef.current + p.y) * 0.2; p.y += p.vy + Math.cos(timeRef.current + p.x) * 0.2;
          if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
        });
        break;

      case 'butterflies':
        particles.current.forEach(p => {
          const dx = p.targetX! - p.x; const dy = p.targetY! - p.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 10) { p.targetX = Math.random() * width; p.targetY = Math.random() * height; }
          p.x += dx * 0.01; p.y += dy * 0.01;
          ctx.save(); ctx.translate(p.x, p.y);
          const wingSpread = Math.abs(Math.sin(timeRef.current * 10)) * p.size;
          ctx.fillStyle = p.color; ctx.beginPath();
          ctx.ellipse(-wingSpread/2, 0, wingSpread/2, p.size, 0, 0, Math.PI * 2);
          ctx.ellipse(wingSpread/2, 0, wingSpread/2, p.size, 0, 0, Math.PI * 2);
          ctx.fill(); ctx.restore();
        });
        break;

      case 'glass_orbs':
        particles.current.forEach(p => {
          const grad = ctx.createRadialGradient(p.x - p.size*0.3, p.y - p.size*0.3, 0, p.x, p.y, p.size);
          grad.addColorStop(0, 'rgba(255,255,255,0.4)'); grad.addColorStop(0.5, 'rgba(255,255,255,0.1)'); grad.addColorStop(1, 'rgba(255,255,255,0.05)');
          ctx.fillStyle = grad; ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          p.x += p.vx; p.y += p.vy;
          if (p.x < -p.size || p.x > width+p.size) p.vx *= -1;
          if (p.y < -p.size || p.y > height+p.size) p.vy *= -1;
        });
        break;

      case 'liquid_gradient':
        ctx.filter = 'blur(100px)';
        particles.current.forEach(p => {
          ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
          p.x += p.vx; p.y += p.vy;
          if (p.x < -p.size || p.x > width+p.size) p.vx *= -1;
          if (p.y < -p.size || p.y > height+p.size) p.vy *= -1;
        });
        ctx.filter = 'none';
        break;

      case 'floating_cubes':
        particles.current.forEach(p => {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(timeRef.current * p.speed! + p.angle!);
          ctx.strokeStyle = p.color; ctx.lineWidth = 1; ctx.globalAlpha = p.opacity;
          ctx.strokeRect(-p.size/2, -p.size/2, p.size, p.size); ctx.restore();
          p.x += p.vx; p.y += p.vy;
          if (p.x < -p.size || p.x > width+p.size) p.vx *= -1;
          if (p.y < -p.size || p.y > height+p.size) p.vy *= -1;
        });
        break;

      case 'circuit_glow':
        ctx.strokeStyle = colors.primary; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.2;
        for (let x = 0; x < width; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
        for (let y = 0; y < height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
        particles.current.forEach(p => {
          ctx.globalAlpha = 1; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 4, 4);
          if (Math.random() > 0.95) p.speed = Math.random() > 0.5 ? 40 : -40;
          if (Math.random() > 0.5) p.x += p.speed!; else p.y += p.speed!;
          if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
        });
        break;

      case 'ai_network':
        particles.current.forEach((p, i) => {
          p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > width) p.vx *= -1; if (p.y < 0 || p.y > height) p.vy *= -1;
          ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
          for (let j = i + 1; j < particles.current.length; j++) {
            const p2 = particles.current[j]; const dist = Math.sqrt((p.x-p2.x)**2 + (p.y-p2.y)**2);
            if (dist < 120) { ctx.strokeStyle = p.color; ctx.lineWidth = 0.5; ctx.globalAlpha = (1 - dist / 120) * 0.4;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); }
          }
        });
        break;

      case 'floating_balloons':
        particles.current.forEach(p => {
          ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.ellipse(p.x, p.y, p.size*0.8, p.size, 0, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.beginPath(); ctx.moveTo(p.x, p.y + p.size);
          ctx.lineTo(p.x + Math.sin(timeRef.current + p.y*0.01)*10, p.y + p.size + 40); ctx.stroke();
          p.y += p.vy; p.x += p.vx; if (p.y < -100) { p.y = height + 100; p.x = Math.random() * width; }
        });
        break;


      case 'moving_clouds':
        ctx.filter = 'blur(50px)';
        particles.current.forEach(p => {
          ctx.globalAlpha = p.opacity; ctx.fillStyle = '#fff';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
          p.x += p.vx; if (p.x > width + p.size) p.x = -p.size;
        });
        ctx.filter = 'none';
        break;

      case 'grass_sway':
        particles.current.forEach(p => {
          ctx.strokeStyle = p.color; ctx.lineWidth = 2; ctx.globalAlpha = p.opacity;
          ctx.beginPath(); ctx.moveTo(p.x, p.y);
          ctx.quadraticCurveTo(p.x + Math.sin(timeRef.current + p.x*0.01)*20, p.y - p.size/2, p.x + Math.sin(timeRef.current + p.x*0.01)*40, p.y - p.size);
          ctx.stroke();
        });
        break;

      case 'energy_waves':
        particles.current.forEach(p => {
          ctx.strokeStyle = p.color; ctx.lineWidth = 4; ctx.globalAlpha = p.opacity;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.stroke();
          p.size += p.speed!; p.opacity -= 0.005;
          if (p.opacity <= 0) { p.size = 0; p.opacity = 1; }
        });
        break;

      case 'radar_scan':
        ctx.save(); ctx.translate(width/2, height/2);
        const scanAngle = (timeRef.current * 2) % (Math.PI * 2);
        const rGrad = ctx.createConicGradient(scanAngle, 0, 0);
        rGrad.addColorStop(0, 'rgba(34, 197, 94, 0.4)'); rGrad.addColorStop(0.1, 'transparent');
        ctx.fillStyle = rGrad; ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0, Math.max(width, height), scanAngle-0.5, scanAngle); ctx.fill();
        particles.current.forEach(p => {
          const dx = p.x - width/2; const dy = p.y - height/2; const angle = Math.atan2(dy, dx) + Math.PI;
          const diff = Math.abs(angle - scanAngle);
          if (diff < 0.1) p.opacity = 1; else p.opacity -= 0.01;
          if (p.opacity > 0) {
            ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x - width/2, p.y - height/2, p.size, 0, Math.PI * 2); ctx.fill();
          }
        });
        ctx.restore();
        break;

      case 'sunrise_gradient':
        const sGrad = ctx.createLinearGradient(0, 0, 0, height);
        const sShift = Math.sin(timeRef.current * 0.1) * 0.2 + 0.5;
        sGrad.addColorStop(0, '#1e1b4b'); sGrad.addColorStop(sShift, '#f97316'); sGrad.addColorStop(1, '#0ea5e9');
        ctx.fillStyle = sGrad; ctx.fillRect(0, 0, width, height);
        break;

      case 'holographic_grid':
        ctx.strokeStyle = '#0ea5e9'; ctx.lineWidth = 1; ctx.globalAlpha = 0.3;
        const gridShift = (timeRef.current * 50) % 40;
        for (let i = -10; i < 10; i++) { ctx.beginPath(); ctx.moveTo(width/2 + i*100, height*0.4); ctx.lineTo(width/2 + i*500, height); ctx.stroke(); }
        for (let y = height*0.4; y <= height; y += 40) {
           const yPos = y + gridShift; if (yPos > height) continue;
           ctx.beginPath(); ctx.moveTo(0, yPos); ctx.lineTo(width, yPos); ctx.stroke();
        }
        break;

      case 'coral_reef':
        particles.current.forEach(p => {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.sin(timeRef.current + p.x*0.01) * 0.2);
          ctx.fillStyle = p.color; ctx.globalAlpha = p.opacity;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-10, -p.size); ctx.lineTo(10, -p.size); ctx.fill(); ctx.restore();
          p.x += p.vx; if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
        });
        break;

      case 'neon_lines':
        ctx.save();
        ctx.lineWidth = 2;
        particles.current.forEach(p => {
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.shadowBlur = 15;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 20, p.y + p.vy * 20);
          ctx.stroke();
          p.x += p.vx * 2;
          p.y += p.vy * 2;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        });
        ctx.restore();
        break;

      case 'floating_boats':
        ctx.save();
        particles.current.forEach(p => {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(Math.sin(timeRef.current + p.x * 0.01) * 0.1);
          ctx.fillStyle = '#fff';
          ctx.globalAlpha = p.opacity;
          // Simple boat shape
          ctx.beginPath();
          ctx.moveTo(-15, 0); ctx.lineTo(15, 0); ctx.lineTo(10, 10); ctx.lineTo(-10, 10);
          ctx.closePath();
          ctx.fill();
          // Sail
          ctx.beginPath();
          ctx.moveTo(0, 0); ctx.lineTo(0, -20); ctx.lineTo(12, -5);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
          
          p.x += p.vx;
          if (p.x > width + 50) p.x = -50;
        });
        ctx.restore();
        break;

      case 'data_stream':
        ctx.fillStyle = '#22d3ee';
        for (let i = 0; i < 50; i++) {
          const x = (timeRef.current * 1000 + i * 200) % width;
          const y = (i * 20) % height;
          ctx.globalAlpha = 0.4;
          ctx.fillRect(x, y, 100, 2);
        }
        break;

      case 'colorful_smoke':
        ctx.filter = 'blur(40px)';
        for (let i = 0; i < 6; i++) {
          const x = width/2 + Math.sin(timeRef.current * 0.5 + i) * width*0.3;
          const y = height/2 + Math.cos(timeRef.current * 0.3 + i) * height*0.3;
          ctx.fillStyle = `hsl(${(timeRef.current * 20 + i * 60) % 360}, 70%, 50%)`;
          ctx.globalAlpha = 0.3;
          ctx.beginPath(); ctx.arc(x, y, 150, 0, Math.PI * 2); ctx.fill();
        }
        ctx.filter = 'none';
        break;

      case 'paper_planes':
        particles.current.forEach(p => {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle!); ctx.fillStyle = '#fff'; ctx.globalAlpha = p.opacity;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-20, 10); ctx.lineTo(-15, 0); ctx.lineTo(-20, -10); ctx.closePath(); ctx.fill(); ctx.restore();
          p.x += p.vx; p.y += p.vy + Math.sin(timeRef.current + p.x*0.01);
          if (p.x > width + 100) p.x = -100;
        });
        break;

      case 'fireplace_glow':
        particles.current.forEach((p, idx) => {
          ctx.globalAlpha = p.opacity;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0, p.color); grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
          
          p.x += p.vx; p.y += p.vy;
          p.life! -= 0.01;
          p.opacity = p.life! / p.maxLife!;
          if (p.life <= 0) {
            p.x = width / 2 + (Math.random() - 0.5) * 100;
            p.y = height - 20;
            p.life = p.maxLife;
            p.opacity = 1;
          }
        });
        break;

      default:
        // Generic drift animation for other themes
        particles.current.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
          ctx.fillStyle = colors.primary;
          ctx.globalAlpha = p.opacity * 0.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
    }

    requestRef.current = requestAnimationFrame(() => draw(ctx, width, height));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(currentMode, canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Start drawing
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(() => draw(ctx, canvas.width, canvas.height));

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [currentMode, colors]); // Re-run if mode OR colors change

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0, // Changed from -1 to 0
        pointerEvents: 'none',
        background: 'var(--color-bg)',
      }}
    />
  );
}
