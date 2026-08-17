import type { SceneState, GrassBlade, Particle, Butterfly } from './types';
import { NATURE } from './config';

const grassBlades: GrassBlade[] = [];
const flowers: { x: number; y: number; phase: number; color: string }[] = [];
const particles: Particle[] = [];
const butterflies: Butterfly[] = [];
let natureInit = false;

function initNature(s: SceneState) {
  if (natureInit) return;
  natureInit = true;
  const { W } = s;

  for (let i = 0; i < NATURE.GRASS_COUNT; i++) {
    grassBlades.push({
      x: Math.random() * W * 1.2 - W * 0.1,
      h: 18 + Math.random() * 35,
      lean: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
      color: `hsl(${95 + Math.random() * 35}, ${45 + Math.random() * 25}%, ${28 + Math.random() * 15}%)`,
    });
  }

  const flowerColors = ['#ff6b9d', '#ffd93d', '#ff8a65', '#ce93d8', '#ffab91', '#a5d6a7'];
  for (let i = 0; i < NATURE.FLOWER_COUNT; i++) {
    flowers.push({
      x: (i / NATURE.FLOWER_COUNT) * W + Math.sin(i * 11.3) * 40,
      y: -2 - Math.random() * 10,
      phase: Math.random() * Math.PI * 2,
      color: flowerColors[i % flowerColors.length],
    });
  }

  const bColors = ['#ff9a76', '#ffeaa7', '#dfe6e9', '#fab1a0'];
  for (let i = 0; i < 6; i++) {
    butterflies.push({
      x: Math.random() * W,
      y: s.H * 0.5 + Math.random() * s.H * 0.2,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
      color: bColors[i % bColors.length],
      size: 3 + Math.random() * 2,
    });
  }
}

function spawnParticle(s: SceneState) {
  particles.push({
    x: Math.random() * s.W,
    y: s.H * 0.45 + Math.random() * s.H * 0.45,
    vx: (Math.random() - 0.5) * 0.25,
    vy: -0.15 - Math.random() * 0.25,
    size: 1 + Math.random() * 2.5,
    life: 0,
    maxLife: 180 + Math.random() * 250,
    type: Math.random() < 0.4 ? 'firefly' : Math.random() < 0.5 ? 'seed' : 'dust',
  });
}

function updateParticles(s: SceneState) {
  const { ctx, time } = s;
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx + Math.sin(time * 0.01 + i) * 0.1;
    p.y += p.vy;
    p.life++;
    if (p.life > p.maxLife) { particles.splice(i, 1); continue; }
    const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.55;
    if (p.type === 'firefly') {
      const flicker = 0.5 + 0.5 * Math.sin(time * 0.1 + i * 3);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 255, 120, ${alpha * flicker * 0.3})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 255, 150, ${alpha * flicker})`;
      ctx.fill();
    } else if (p.type === 'seed') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(time * 0.005 + i);
      ctx.beginPath();
      ctx.moveTo(-p.size, 0);
      ctx.quadraticCurveTo(0, -p.size * 1.5, p.size, 0);
      ctx.quadraticCurveTo(0, p.size * 0.5, -p.size, 0);
      ctx.fillStyle = `rgba(255, 255, 240, ${alpha * 0.7})`;
      ctx.fill();
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 220, 140, ${alpha})`;
      ctx.fill();
    }
  }
}

function drawButterflies(s: SceneState) {
  const { ctx, time } = s;
  for (const b of butterflies) {
    b.x += b.vx + Math.sin(time * 0.008 + b.phase) * 0.3;
    b.y += b.vy + Math.cos(time * 0.006 + b.phase) * 0.2;
    if (b.x < -20) b.x = s.W + 20;
    if (b.x > s.W + 20) b.x = -20;
    if (b.y < s.H * 0.3) b.vy = Math.abs(b.vy);
    if (b.y > s.H * 0.8) b.vy = -Math.abs(b.vy);

    const wingAngle = Math.sin(time * 0.15 + b.phase) * 0.8;
    ctx.save();
    ctx.translate(b.x, b.y);

    ctx.fillStyle = b.color;
    ctx.save();
    ctx.scale(Math.cos(wingAngle), 1);
    ctx.beginPath();
    ctx.ellipse(-b.size, 0, b.size, b.size * 0.6, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.scale(Math.cos(-wingAngle), 1);
    ctx.beginPath();
    ctx.ellipse(b.size, 0, b.size, b.size * 0.6, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = 'rgba(60, 40, 30, 0.5)';
    ctx.fillRect(-0.5, -b.size * 0.8, 1, b.size * 1.6);

    ctx.restore();
  }
}

export function drawGrass(s: SceneState, groundY: number) {
  const { ctx, time } = s;
  initNature(s);

  for (const g of grassBlades) {
    const sway = Math.sin(time * 0.02 + g.phase) * 5;
    const x = g.x;
    const baseY = groundY + Math.sin(x * 0.01) * 3;
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.quadraticCurveTo(x + g.lean * 20 + sway, baseY - g.h * 0.6, x + sway + g.lean * 30, baseY - g.h);
    ctx.strokeStyle = g.color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  for (const f of flowers) {
    const sway = Math.sin(time * 0.015 + f.phase) * 3;
    ctx.beginPath();
    ctx.arc(f.x + sway, groundY + f.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = f.color;
    ctx.fill();
  }
}

export function drawHeroTree(s: SceneState, groundY: number) {
  const { ctx, W } = s;
  const tx = W * 0.05;
  const scale = 1.4;
  const trunkW = 16 * scale;
  const trunkH = 100 * scale;

  const trunkGrad = ctx.createLinearGradient(tx - trunkW / 2, 0, tx + trunkW / 2, 0);
  trunkGrad.addColorStop(0, '#3a2815');
  trunkGrad.addColorStop(0.4, '#5a3d20');
  trunkGrad.addColorStop(1, '#4a3018');
  ctx.fillStyle = trunkGrad;
  ctx.beginPath();
  ctx.moveTo(tx - trunkW / 2, groundY);
  ctx.quadraticCurveTo(tx - trunkW / 2 - 3, groundY - trunkH * 0.5, tx - trunkW * 0.3, groundY - trunkH);
  ctx.lineTo(tx + trunkW * 0.3, groundY - trunkH);
  ctx.quadraticCurveTo(tx + trunkW / 2 + 3, groundY - trunkH * 0.5, tx + trunkW / 2, groundY);
  ctx.closePath();
  ctx.fill();

  for (let i = 0; i < 3; i++) {
    const bx = tx + (i - 1) * trunkW * 0.25;
    ctx.beginPath();
    ctx.arc(bx, groundY - trunkH * 0.3 - i * 15, 3 + i, 0, Math.PI * 2);
    ctx.fillStyle = '#2a1a0a';
    ctx.fill();
  }

  const canopyR = 65 * scale;
  const canopyY = groundY - trunkH - canopyR * 0.3;

  const layers = [
    { dx: 0, dy: 0, r: 1.0, color: '#2d5a1e' },
    { dx: -0.4, dy: 0.15, r: 0.75, color: '#3a6e28' },
    { dx: 0.45, dy: 0.1, r: 0.7, color: '#2d5a1e' },
    { dx: -0.2, dy: -0.3, r: 0.6, color: '#4a7c35' },
    { dx: 0.15, dy: -0.25, r: 0.55, color: '#3d6b30' },
  ];

  for (const layer of layers) {
    const lx = tx + layer.dx * canopyR;
    const ly = canopyY + layer.dy * canopyR;
    const lr = layer.r * canopyR;
    const grad = ctx.createRadialGradient(lx, ly - lr * 0.3, lr * 0.1, lx, ly, lr);
    grad.addColorStop(0, '#5a8f4a');
    grad.addColorStop(0.5, layer.color);
    grad.addColorStop(1, '#1e3a12');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(lx, ly, lr, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(90, 143, 74, 0.15)';
  for (let i = 0; i < 5; i++) {
    const lx = tx + Math.sin(i * 2.5) * canopyR * 0.6;
    const ly = canopyY - canopyR * 0.1 + Math.cos(i * 1.8) * canopyR * 0.4;
    ctx.beginPath();
    ctx.arc(lx, ly, 4 + Math.sin(i) * 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawTree(s: SceneState, x: number, groundY: number, scale: number) {
  const { ctx } = s;
  const trunkW = 10 * scale;
  const trunkH = 65 * scale;

  ctx.fillStyle = '#4a3728';
  ctx.fillRect(x - trunkW / 2, groundY - trunkH, trunkW, trunkH);

  const canopyR = 38 * scale;
  const canopyY = groundY - trunkH - canopyR * 0.4;
  const layers = [
    { dx: 0, dy: 0, r: 1.0, color: '#2d5a1e' },
    { dx: -0.45, dy: 0.12, r: 0.7, color: '#1e4a12' },
    { dx: 0.5, dy: 0.08, r: 0.65, color: '#2d5a1e' },
  ];

  for (const layer of layers) {
    const lx = x + layer.dx * canopyR;
    const ly = canopyY + layer.dy * canopyR;
    const lr = layer.r * canopyR;
    const grad = ctx.createRadialGradient(lx, ly - lr * 0.2, lr * 0.1, lx, ly, lr);
    grad.addColorStop(0, '#4a7c35');
    grad.addColorStop(0.6, layer.color);
    grad.addColorStop(1, '#153a0d');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(lx, ly, lr, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawParticles(s: SceneState) {
  if (particles.length < NATURE.MAX_PARTICLES && Math.random() < 0.12) spawnParticle(s);
  updateParticles(s);
  drawButterflies(s);
}

export function drawBamboo(s: SceneState, groundY: number) {
  const { ctx, W, time } = s;
  const count = 5;
  const baseX = W * 0.72;

  for (let i = 0; i < count; i++) {
    const x = baseX + i * 12 + Math.sin(i * 3) * 5;
    const h = 80 + Math.sin(i * 2.7) * 25;
    const sway = Math.sin(time * 0.012 + i * 1.5) * 6;

    ctx.strokeStyle = '#5a8040';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.quadraticCurveTo(x + sway * 0.5, groundY - h * 0.6, x + sway, groundY - h);
    ctx.stroke();

    ctx.strokeStyle = '#4a6b30';
    ctx.lineWidth = 2.5;
    for (let j = 0; j < 4; j++) {
      const ny = groundY - h * (j + 1) / 5;
      const nx = x + sway * ((j + 1) / 5);
      ctx.beginPath();
      ctx.moveTo(nx - 1, ny);
      ctx.lineTo(nx + 1, ny);
      ctx.stroke();
    }

    ctx.fillStyle = '#6a9050';
    const leafX = x + sway;
    const leafY = groundY - h;
    ctx.beginPath();
    ctx.ellipse(leafX + 8, leafY - 3, 10, 3, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(leafX - 6, leafY - 6, 9, 2.5, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}
