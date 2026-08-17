import type { SceneState } from './types';

export function drawVignette(s: SceneState) {
  const { ctx, W, H } = s;
  const grad = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.8);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(20, 10, 30, 0.35)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

export function drawSunRays(s: SceneState) {
  const { ctx, W, H, time } = s;
  const sunX = W * 0.72;
  const sunY = H * 0.42;

  ctx.save();
  ctx.globalAlpha = 0.04;
  const numRays = 12;
  for (let i = 0; i < numRays; i++) {
    const angle = (i / numRays) * Math.PI * 2 + time * 0.001;
    const len = H * 0.5;
    ctx.beginPath();
    ctx.moveTo(sunX, sunY);
    ctx.lineTo(sunX + Math.cos(angle) * len, sunY + Math.sin(angle) * len);
    ctx.lineTo(sunX + Math.cos(angle + 0.15) * len, sunY + Math.sin(angle + 0.15) * len);
    ctx.closePath();
    ctx.fillStyle = '#ffd080';
    ctx.fill();
  }
  ctx.restore();
}

export function drawHeatHaze(s: SceneState, groundY: number) {
  const { ctx, W, time } = s;
  ctx.save();
  ctx.globalAlpha = 0.03;
  for (let x = 0; x < W; x += 20) {
    const offset = Math.sin(x * 0.02 + time * 0.005) * 3;
    ctx.fillStyle = '#ffe8d0';
    ctx.fillRect(x, groundY - 5 + offset, 15, 2);
  }
  ctx.restore();
}
