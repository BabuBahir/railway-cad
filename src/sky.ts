import type { SceneState, Cloud } from './types';
import { SKY, SUN, CLOUD_COLORS } from './config';

const clouds: Cloud[] = [];
let cloudsInit = false;

function initClouds(W: number, H: number) {
  if (cloudsInit) return;
  cloudsInit = true;
  for (let i = 0; i < 8; i++) {
    clouds.push({
      x: Math.random() * W * 1.5 - W * 0.25,
      y: H * 0.06 + Math.random() * H * 0.22,
      w: 90 + Math.random() * 180,
      h: 22 + Math.random() * 35,
      speed: 0.06 + Math.random() * 0.12,
      opacity: 0.5 + Math.random() * 0.35,
    });
  }
}

export function drawSky(s: SceneState) {
  const { ctx, W, H } = s;
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0.0, SKY.TOP);
  grad.addColorStop(0.2, SKY.MID_HIGH);
  grad.addColorStop(0.45, SKY.MID);
  grad.addColorStop(0.65, SKY.LOW);
  grad.addColorStop(0.85, SKY.HORIZON);
  grad.addColorStop(1.0, '#fff5e6');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

export function drawSun(s: SceneState) {
  const { ctx, W, H } = s;
  const sunX = W * 0.72;
  const sunY = H * 0.42;
  const r = H * 0.07;

  const glow = ctx.createRadialGradient(sunX, sunY, r * 0.3, sunX, sunY, r * 5);
  glow.addColorStop(0, SUN.GLOW_INNER);
  glow.addColorStop(0.25, SUN.GLOW_MID);
  glow.addColorStop(0.6, SUN.GLOW_OUTER);
  glow.addColorStop(1, 'rgba(255, 140, 70, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(sunX - r * 5, sunY - r * 5, r * 10, r * 10);

  ctx.beginPath();
  ctx.arc(sunX, sunY, r, 0, Math.PI * 2);
  ctx.fillStyle = SUN.COLOR;
  ctx.fill();
}

export function drawClouds(s: SceneState) {
  const { ctx, W, H } = s;
  initClouds(W, H);

  for (const c of clouds) {
    c.x += c.speed;
    if (c.x - c.w > W) c.x = -c.w;

    ctx.save();
    ctx.globalAlpha = c.opacity;

    const grad = ctx.createLinearGradient(c.x, c.y - c.h, c.x, c.y + c.h);
    grad.addColorStop(0, CLOUD_COLORS.top);
    grad.addColorStop(1, CLOUD_COLORS.bottom);
    ctx.fillStyle = grad;

    const puffs = 7;
    for (let i = 0; i < puffs; i++) {
      const t = i / (puffs - 1);
      const px = c.x - c.w / 2 + t * c.w;
      const py = c.y - Math.sin(t * Math.PI) * c.h * 0.7;
      const rx = c.w / puffs * 0.85;
      const ry = c.h * (0.45 + 0.55 * Math.sin(t * Math.PI));
      ctx.beginPath();
      ctx.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

export function drawBirds(s: SceneState) {
  const { ctx, W, H, time } = s;
  ctx.strokeStyle = 'rgba(60, 40, 50, 0.4)';
  ctx.lineWidth = 1.5;

  for (let i = 0; i < 5; i++) {
    const bx = ((time * 0.25 + i * 220) % (W + 120)) - 60;
    const by = H * 0.12 + i * 20 + Math.sin(time * 0.025 + i * 2) * 12;
    const wingPhase = Math.sin(time * 0.07 + i * 3) * 7;

    ctx.beginPath();
    ctx.moveTo(bx - 10, by + wingPhase);
    ctx.quadraticCurveTo(bx - 3, by - 3, bx, by);
    ctx.quadraticCurveTo(bx + 3, by - 3, bx + 10, by + wingPhase);
    ctx.stroke();
  }
}
