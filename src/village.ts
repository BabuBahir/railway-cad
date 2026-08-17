import type { SceneState, Building } from './types';
import { BUILDINGS, VILLAGE_GROUND_OFFSET } from './config';

function shadeColor(color: string, percent: number) {
  const num = parseInt(color.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + percent));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + percent));
  const b = Math.max(0, Math.min(255, (num & 0xff) + percent));
  return `rgb(${r},${g},${b})`;
}

function drawThatchedRoof(s: SceneState, cx: number, cy: number, w: number, h: number, color: string) {
  const { ctx } = s;
  ctx.save();

  ctx.beginPath();
  ctx.moveTo(cx - w / 2 - 12, cy);
  ctx.quadraticCurveTo(cx - w / 3, cy - h * 0.85, cx, cy - h);
  ctx.quadraticCurveTo(cx + w / 3, cy - h * 0.85, cx + w / 2 + 12, cy);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  ctx.strokeStyle = 'rgba(80, 50, 20, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  const lineCount = 8;
  ctx.strokeStyle = 'rgba(100, 70, 30, 0.15)';
  ctx.lineWidth = 0.7;
  for (let i = 1; i < lineCount; i++) {
    const t = i / lineCount;
    const lx1 = cx - w / 2 - 10 + t * (w + 20);
    const ly = cy - Math.sin(t * Math.PI) * h * 0.8;
    ctx.beginPath();
    ctx.moveTo(lx1, cy);
    ctx.quadraticCurveTo(lx1, ly + 4, cx, cy - h + 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawBuilding(s: SceneState, b: Building, groundY: number) {
  const { ctx, W } = s;
  const x = b.x * W;
  const baseY = groundY;
  const wallTop = baseY - b.h;

  if (b.type === 'torii') {
    const tw = b.w * 1.2;
    const th = b.h;
    const poleW = 5;
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(x - tw / 2, baseY - th, poleW, th);
    ctx.fillRect(x + tw / 2 - poleW, baseY - th, poleW, th);
    ctx.fillRect(x - tw / 2 - 5, baseY - th, tw + 10, 6);
    ctx.fillRect(x - tw / 2, baseY - th + 12, tw, 4);
    return;
  }

  const wallGrad = ctx.createLinearGradient(x - b.w / 2, wallTop, x + b.w / 2, wallTop);
  wallGrad.addColorStop(0, b.color);
  wallGrad.addColorStop(0.75, b.color);
  wallGrad.addColorStop(1, shadeColor(b.color, -15));
  ctx.fillStyle = wallGrad;
  ctx.fillRect(x - b.w / 2, wallTop, b.w, b.h);

  ctx.strokeStyle = 'rgba(100, 80, 50, 0.2)';
  ctx.lineWidth = 0.8;
  ctx.strokeRect(x - b.w / 2, wallTop, b.w, b.h);

  if (b.type === 'minka') {
    const stoneH = b.h * 0.25;
    ctx.fillStyle = '#b8a890';
    ctx.fillRect(x - b.w / 2, baseY - stoneH, b.w, stoneH);
    ctx.strokeStyle = 'rgba(80, 60, 40, 0.15)';
    ctx.lineWidth = 0.5;
    for (let sy = 0; sy < 3; sy++) {
      ctx.beginPath();
      ctx.moveTo(x - b.w / 2, baseY - stoneH + sy * (stoneH / 3));
      ctx.lineTo(x + b.w / 2, baseY - stoneH + sy * (stoneH / 3));
      ctx.stroke();
    }
  }

  if (b.type !== 'barn') {
    const winCount = b.type === 'minka' ? 2 : b.type === 'pagoda' ? 3 : 2;
    const winW = 7;
    const winH = 9;
    const spacing = b.w / (winCount + 1);
    for (let i = 1; i <= winCount; i++) {
      const wx = x - b.w / 2 + spacing * i - winW / 2;
      const wy = wallTop + b.h * 0.28;

      ctx.fillStyle = '#3a3025';
      ctx.fillRect(wx - 1.5, wy - 1.5, winW + 3, winH + 3);

      const glassGrad = ctx.createLinearGradient(wx, wy, wx, wy + winH);
      glassGrad.addColorStop(0, '#ffdd88');
      glassGrad.addColorStop(0.5, '#ffcc66');
      glassGrad.addColorStop(1, '#ffaa44');
      ctx.fillStyle = glassGrad;
      ctx.fillRect(wx, wy, winW, winH);

      ctx.strokeStyle = 'rgba(60, 45, 30, 0.5)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(wx + winW / 2, wy);
      ctx.lineTo(wx + winW / 2, wy + winH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(wx, wy + winH / 2);
      ctx.lineTo(wx + winW, wy + winH / 2);
      ctx.stroke();

      const glow = ctx.createRadialGradient(wx + winW / 2, wy + winH / 2, 0, wx + winW / 2, wy + winH / 2, 18);
      glow.addColorStop(0, 'rgba(255, 200, 80, 0.25)');
      glow.addColorStop(1, 'rgba(255, 200, 80, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(wx - 12, wy - 12, winW + 24, winH + 24);
    }
  }

  const doorW = b.type === 'barn' ? 12 : 8;
  const doorH = b.type === 'barn' ? 22 : 14;
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(x - doorW / 2, baseY - doorH, doorW, doorH);
  ctx.fillStyle = '#7a5a40';
  ctx.fillRect(x - doorW / 2 + 1, baseY - doorH + 1, doorW - 2, doorH - 2);

  if (b.type === 'barn') {
    ctx.beginPath();
    ctx.moveTo(x, wallTop - 2);
    ctx.lineTo(x - doorW / 2 - 2, baseY - doorH);
    ctx.lineTo(x + doorW / 2 + 2, baseY - doorH);
    ctx.closePath();
    ctx.fillStyle = '#4a3520';
    ctx.fill();
  }

  if (b.type === 'pagoda') {
    for (let lvl = 0; lvl < 3; lvl++) {
      const ly = wallTop - lvl * 20;
      const lw = b.w + 12 - lvl * 8;
      drawThatchedRoof(s, x, ly, lw, 16, '#4a3520');
    }
  } else if (b.type === 'minka') {
    drawThatchedRoof(s, x, wallTop, b.w + 16, b.roofH + 4, b.roofColor);
  } else {
    drawThatchedRoof(s, x, wallTop, b.w + 12, b.roofH, b.roofColor);
  }
}

export function drawVillage(s: SceneState, groundY: number) {
  const villageY = groundY + VILLAGE_GROUND_OFFSET;
  for (const b of BUILDINGS) {
    drawBuilding(s, b, villageY);
  }
}

export function drawStoneWall(s: SceneState, groundY: number) {
  const { ctx, W } = s;
  const wallY = groundY - 8;
  const wallH = 10;

  ctx.save();
  ctx.fillStyle = '#a09080';

  const segments = 12;
  for (let i = 0; i < segments; i++) {
    const sx = W * 0.1 + i * W * 0.07;
    const sw = W * 0.06;
    const sh = wallH + Math.sin(i * 1.7) * 3;
    ctx.fillStyle = `hsl(30, ${12 + Math.sin(i * 2.3) * 5}%, ${58 + Math.sin(i * 1.5) * 5}%)`;
    ctx.fillRect(sx, wallY - sh, sw, sh);

    if (i < segments - 1) {
      const gapX = sx + sw;
      const gapW = W * 0.01;
      ctx.fillStyle = '#3d6b30';
      ctx.fillRect(gapX, wallY - sh + 2, gapW, sh - 4);
    }
  }
  ctx.restore();
}

export function drawPoles(s: SceneState, groundY: number) {
  const { ctx, W } = s;
  ctx.strokeStyle = '#3a3530';
  ctx.lineWidth = 2.5;

  for (let i = 0; i < 6; i++) {
    const x = W * 0.05 + i * W * 0.17;
    const topY = groundY - 60;

    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.lineTo(x - 1, topY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x - 12, topY + 5);
    ctx.lineTo(x + 10, topY + 5);
    ctx.stroke();

    if (i < 5) {
      const nx = W * 0.05 + (i + 1) * W * 0.17;
      const sag = 10;
      ctx.beginPath();
      ctx.moveTo(x + 10, topY + 5);
      ctx.quadraticCurveTo((x + nx) / 2, topY + sag + 18, nx - 12, topY + 5);
      ctx.strokeStyle = 'rgba(50, 45, 40, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.strokeStyle = '#3a3530';
      ctx.lineWidth = 2.5;
    }
  }
}
