import type { SceneState, RicePaddy } from './types';
import { HILLS } from './config';

function drawMountainLayer(s: SceneState, baseY: number, amplitude: number, color: string, freq: number, offset: number) {
  const { ctx, W, H } = s;
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 3) {
    const n = Math.sin(x * freq + offset) * 0.5
      + Math.sin(x * freq * 2.1 + offset * 1.3) * 0.25
      + Math.sin(x * freq * 0.5 + offset * 0.7) * 0.5;
    const y = baseY - n * amplitude;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawHills(s: SceneState) {
  const { H } = s;
  for (const hill of HILLS) {
    drawMountainLayer(s, H * hill.baseY, H * hill.amplitude, hill.color, hill.freq, hill.offset);
  }
}

export function drawDistantTrees(s: SceneState, baseY: number, color: string, count: number, sizeBase: number) {
  const { ctx, W, H } = s;
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const x = (i / count) * W + Math.sin(i * 7.3) * 30;
    const h = sizeBase + Math.sin(i * 3.7) * sizeBase * 0.4;
    const w = h * 0.4;
    const y = baseY + Math.sin(x * 0.005 + 300) * H * 0.04 - h;
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x - w / 2, y + h);
    ctx.lineTo(x, y);
    ctx.lineTo(x + w / 2, y + h);
    ctx.closePath();
    ctx.fill();
  }
}

const paddyData: RicePaddy[] = [];
let paddyInit = false;

function initPaddies(s: SceneState) {
  if (paddyInit) return;
  paddyInit = true;
  const { W, H } = s;
  const y = H * 0.62;
  const count = 4;
  const paddyW = W * 0.22;

  for (let i = 0; i < count; i++) {
    const px = W * 0.15 + i * W * 0.2;
    const py = y + Math.sin(i * 2.5) * 8;
    const stalks: RicePaddy['stalks'] = [];
    const numStalks = 25 + Math.floor(Math.random() * 15);
    for (let j = 0; j < numStalks; j++) {
      stalks.push({
        dx: (j / numStalks) * paddyW - paddyW / 2 + (Math.random() - 0.5) * 8,
        h: 14 + Math.random() * 10,
        phase: Math.random() * Math.PI * 2,
      });
    }
    paddyData.push({ x: px, y: py, w: paddyW, h: 16, stalks });
  }
}

export function drawRicePaddies(s: SceneState) {
  const { ctx, time } = s;
  initPaddies(s);

  for (const p of paddyData) {
    const waterGrad = ctx.createLinearGradient(p.x - p.w / 2, p.y, p.x - p.w / 2, p.y + p.h);
    waterGrad.addColorStop(0, 'rgba(140, 180, 210, 0.25)');
    waterGrad.addColorStop(0.5, 'rgba(160, 200, 220, 0.18)');
    waterGrad.addColorStop(1, 'rgba(120, 160, 130, 0.15)');
    ctx.fillStyle = waterGrad;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + p.h / 2, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(100, 130, 110, 0.12)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + p.h / 2, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
    ctx.stroke();

    for (const stalk of p.stalks) {
      const sway = Math.sin(time * 0.018 + stalk.phase) * 4;
      const sx = p.x + stalk.dx;
      const sy = p.y;
      ctx.beginPath();
      ctx.moveTo(sx, sy + 2);
      ctx.quadraticCurveTo(sx + sway * 0.5, sy - stalk.h * 0.6, sx + sway, sy - stalk.h);
      ctx.strokeStyle = `hsl(${85 + Math.sin(stalk.phase) * 10}, ${55 + Math.random() * 10}%, ${40 + Math.sin(stalk.phase) * 5}%)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(sx + sway + 2, sy - stalk.h, 3, 1.5, 0.3 + sway * 0.05, 0, Math.PI * 2);
      ctx.fillStyle = '#c8b84a';
      ctx.fill();
    }
  }
}

export function drawGround(s: SceneState, groundY: number) {
  const { ctx, W, H } = s;
  const grad = ctx.createLinearGradient(0, groundY - 20, 0, H);
  grad.addColorStop(0, '#4a7c3f');
  grad.addColorStop(0.3, '#3d6b30');
  grad.addColorStop(0.7, '#2d5522');
  grad.addColorStop(1, '#1e3d16');
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.moveTo(0, groundY);
  for (let x = 0; x <= W; x += 5) {
    ctx.lineTo(x, groundY + Math.sin(x * 0.006) * 8 + Math.sin(x * 0.015) * 3);
  }
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
}

export function drawPath(s: SceneState, groundY: number) {
  const { ctx, W } = s;
  const pathY = groundY + 20;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, pathY);
  for (let x = 0; x <= W; x += 4) {
    ctx.lineTo(x, pathY + Math.sin(x * 0.01) * 4);
  }
  ctx.lineTo(W, pathY + 18);
  for (let x = W; x >= 0; x -= 4) {
    ctx.lineTo(x, pathY + 18 + Math.sin(x * 0.012) * 3);
  }
  ctx.closePath();
  ctx.fillStyle = '#c8b090';
  ctx.fill();
  ctx.strokeStyle = 'rgba(160, 140, 110, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}
