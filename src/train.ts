import type { SceneState, SteamPuff } from './types';
import { TRAIN } from './config';

let trainX = -600;
const steamPuffs: SteamPuff[] = [];

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawBogie(s: SceneState, cx: number, cy: number, w: number) {
  const { ctx } = s;
  ctx.fillStyle = '#3a3530';
  ctx.fillRect(cx - w / 2, cy, w, 5);
  const wheelR = 5;
  const axleSpacing = w * 0.35;
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1.5;
  for (const dx of [-axleSpacing, axleSpacing]) {
    ctx.fillStyle = '#4a4540';
    ctx.beginPath();
    ctx.arc(cx + dx, cy + 9, wheelR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#666';
    ctx.beginPath();
    ctx.arc(cx + dx, cy + 9, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + dx, cy + 5);
    ctx.lineTo(cx + dx, cy + 9 - wheelR);
    ctx.stroke();
  }
  ctx.fillStyle = '#444';
  ctx.fillRect(cx - w / 2 + 3, cy - 2, 4, 3);
  ctx.fillRect(cx + w / 2 - 7, cy - 2, 4, 3);
}

function drawTrainCar(s: SceneState, cx: number, cy: number, isLead: boolean) {
  const { ctx } = s;
  const bw = TRAIN.BODY_W;
  const bh = TRAIN.BODY_H;
  const bx = cx - bw / 2;
  const by = cy - bh / 2;

  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(bx + 4, cy + bh / 2 + 2, bw - 8, 4);
  ctx.fillStyle = '#4a4540';
  ctx.fillRect(bx + 2, cy + bh / 2 - 3, bw - 4, 5);

  const bodyGrad = ctx.createLinearGradient(bx, by, bx, by + bh);
  bodyGrad.addColorStop(0, '#f5efe0');
  bodyGrad.addColorStop(0.5, '#efe8d8');
  bodyGrad.addColorStop(1, '#e5dac5');
  ctx.fillStyle = bodyGrad;
  roundedRect(ctx, bx, by, bw, bh, 4);
  ctx.fill();
  ctx.strokeStyle = 'rgba(80, 60, 40, 0.25)';
  ctx.lineWidth = 1;
  roundedRect(ctx, bx, by, bw, bh, 4);
  ctx.stroke();

  const stripeY = cy + 2;
  const stripeH = 6;
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(bx + 3, stripeY, bw - 6, stripeH);
  ctx.fillStyle = '#c9a84c';
  ctx.fillRect(bx + 3, stripeY - 1.5, bw - 6, 1.5);
  ctx.fillRect(bx + 3, stripeY + stripeH, bw - 6, 1.5);

  ctx.strokeStyle = 'rgba(80, 60, 40, 0.12)';
  ctx.lineWidth = 0.8;
  for (const px of [bx + bw * 0.25, bx + bw * 0.5, bx + bw * 0.75]) {
    ctx.beginPath();
    ctx.moveTo(px, by + 4);
    ctx.lineTo(px, by + bh - 2);
    ctx.stroke();
  }

  const numWindows = 5;
  const winW = 11;
  const winH = 12;
  const winY = by + 5;
  const winSpacing = (bw - 20) / (numWindows + 1);
  for (let i = 1; i <= numWindows; i++) {
    const wx = bx + 8 + winSpacing * i - winW / 2;
    ctx.fillStyle = '#3a3530';
    ctx.fillRect(wx - 1.5, winY - 1.5, winW + 3, winH + 3);
    const glassGrad = ctx.createLinearGradient(wx, winY, wx, winY + winH);
    glassGrad.addColorStop(0, '#8ec8d8');
    glassGrad.addColorStop(0.4, '#a8d8e0');
    glassGrad.addColorStop(1, '#ffe4b0');
    ctx.fillStyle = glassGrad;
    ctx.fillRect(wx, winY, winW, winH);
    ctx.strokeStyle = 'rgba(42, 37, 32, 0.35)';
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(wx, winY + winH * 0.45);
    ctx.lineTo(wx + winW, winY + winH * 0.45);
    ctx.stroke();
    const glow = ctx.createRadialGradient(wx + winW / 2, winY + winH / 2, 0, wx + winW / 2, winY + winH / 2, 14);
    glow.addColorStop(0, 'rgba(255, 210, 120, 0.25)');
    glow.addColorStop(1, 'rgba(255, 210, 120, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(wx - 6, winY - 6, winW + 12, winH + 12);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(wx + 1, winY + 1, 3, winH - 2);
  }

  const doorW = 8;
  const doorH = bh - 10;
  const doorY = by + 5;
  for (const dx of [bx + 5, bx + bw - 5 - doorW]) {
    ctx.fillStyle = '#4a4540';
    ctx.fillRect(dx - 0.5, doorY - 0.5, doorW + 1, doorH + 1);
    ctx.fillStyle = '#e0d4c0';
    ctx.fillRect(dx, doorY, doorW, doorH);
    ctx.fillStyle = '#8ec8d8';
    ctx.fillRect(dx + 1.5, doorY + 2, doorW - 3, 8);
    ctx.fillStyle = '#888';
    ctx.fillRect(dx + doorW - 3, doorY + doorH * 0.5, 1.5, 4);
  }

  const roofH = 7;
  ctx.fillStyle = '#5a5550';
  ctx.beginPath();
  ctx.moveTo(bx - 2, by);
  ctx.quadraticCurveTo(cx, by - roofH, bx + bw + 2, by);
  ctx.lineTo(bx + bw + 2, by + 2);
  ctx.lineTo(bx - 2, by + 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#777';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(bx - 2, by);
  ctx.quadraticCurveTo(cx, by - roofH, bx + bw + 2, by);
  ctx.stroke();

  ctx.fillStyle = '#666';
  for (let i = 0; i < 3; i++) {
    const vx = cx - 18 + i * 18;
    ctx.fillRect(vx - 4, by - roofH + 2, 8, 3);
    ctx.fillRect(vx - 2, by - roofH, 4, 2);
  }

  const bogieW = bw * 0.3;
  drawBogie(s, cx - bw * 0.28, cy + bh / 2 - 2, bogieW);
  drawBogie(s, cx + bw * 0.28, cy + bh / 2 - 2, bogieW);

  ctx.fillStyle = '#555';
  const bufH = 5;
  const bufW = 4;
  ctx.fillRect(bx - bufW, cy + bh / 2 - bufH - 2, bufW, bufH);
  ctx.fillStyle = '#666';
  ctx.beginPath();
  ctx.arc(bx - bufW, cy + bh / 2 - bufH / 2 - 2, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#555';
  ctx.fillRect(bx + bw, cy + bh / 2 - bufH - 2, bufW, bufH);
  ctx.fillStyle = '#666';
  ctx.beginPath();
  ctx.arc(bx + bw + bufW, cy + bh / 2 - bufH / 2 - 2, 2.5, 0, Math.PI * 2);
  ctx.fill();

  if (isLead) {
    const frontX = bx + bw;
    ctx.fillStyle = '#f5efe0';
    ctx.beginPath();
    ctx.moveTo(frontX, by + 2);
    ctx.quadraticCurveTo(frontX + 10, cy, frontX, by + bh - 2);
    ctx.lineTo(frontX, by + 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(80, 60, 40, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#3a3530';
    ctx.fillRect(frontX - 1, cy - 10, 3, 16);
    ctx.fillStyle = '#8ec8d8';
    ctx.fillRect(frontX, cy - 9, 2, 14);
    ctx.fillStyle = '#ffee88';
    ctx.beginPath();
    ctx.arc(frontX + 4, cy + 6, 4, 0, Math.PI * 2);
    ctx.fill();
    const hlGlow = ctx.createRadialGradient(frontX + 4, cy + 6, 0, frontX + 4, cy + 6, 20);
    hlGlow.addColorStop(0, 'rgba(255, 240, 150, 0.45)');
    hlGlow.addColorStop(0.5, 'rgba(255, 220, 100, 0.12)');
    hlGlow.addColorStop(1, 'rgba(255, 220, 100, 0)');
    ctx.fillStyle = hlGlow;
    ctx.beginPath();
    ctx.arc(frontX + 4, cy + 6, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(frontX + 4, cy + 6, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#cc3333';
    ctx.beginPath();
    ctx.arc(frontX + 2, cy - 5, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function updateSteam(s: SceneState, trainCy: number, leadX: number) {
  const { ctx, time } = s;
  if (time % 3 === 0) {
    const frontX = leadX + TRAIN.BODY_W / 2 + 8;
    steamPuffs.push({
      x: frontX + (Math.random() - 0.5) * 4,
      y: trainCy - TRAIN.BODY_H / 2 - 10 + (Math.random() - 0.5) * 4,
      vx: 0.3 + Math.random() * 0.3,
      vy: -0.15 - Math.random() * 0.2,
      size: 4 + Math.random() * 6,
      life: 0,
      maxLife: 80 + Math.random() * 60,
    });
  }
  for (let i = steamPuffs.length - 1; i >= 0; i--) {
    const p = steamPuffs[i];
    p.x += p.vx;
    p.y += p.vy;
    p.size += 0.12;
    p.life++;
    if (p.life > p.maxLife) { steamPuffs.splice(i, 1); continue; }
    const lifeRatio = p.life / p.maxLife;
    const alpha = Math.sin(lifeRatio * Math.PI) * 0.35;
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    grad.addColorStop(0, `rgba(240, 235, 230, ${alpha})`);
    grad.addColorStop(0.6, `rgba(220, 215, 210, ${alpha * 0.5})`);
    grad.addColorStop(1, 'rgba(200, 195, 190, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawTracks(s: SceneState, y: number) {
  const { ctx, W } = s;
  ctx.fillStyle = '#6b5545';
  const tieSpacing = 18;
  for (let x = 0; x < W; x += tieSpacing) {
    ctx.fillRect(x, y - 10, 4, 20);
  }
  ctx.strokeStyle = '#777';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, y - 6);
  ctx.lineTo(W, y - 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, y + 6);
  ctx.lineTo(W, y + 6);
  ctx.stroke();
}

export function drawTrain(s: SceneState, trackY: number) {
  trainX += TRAIN.SPEED;
  if (trainX > s.W + 200) {
    trainX = -TRAIN.NUM_CARRIAGES * (TRAIN.BODY_W + TRAIN.CARRIAGE_GAP) - 100;
  }
  const cy = trackY - TRAIN.BODY_H / 2 - 10;
  for (let i = 0; i < TRAIN.NUM_CARRIAGES; i++) {
    const carX = trainX - i * (TRAIN.BODY_W + TRAIN.CARRIAGE_GAP);
    drawTrainCar(s, carX, cy, i === 0);
  }
  updateSteam(s, cy, trainX);
}
