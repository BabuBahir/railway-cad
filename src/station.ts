import type { SceneState } from './types';
import { PLATFORMS, COLORS, ANIME } from './config';

export function drawPlatforms(s: SceneState) {
  const { ctx } = s;

  for (const plat of PLATFORMS) {
    ctx.save();
    ctx.translate(plat.x, plat.y);
    ctx.rotate(plat.angle);

    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(-plat.w / 2 + 4, -plat.h / 2 + 4, plat.w, plat.h);

    const platGrad = ctx.createLinearGradient(0, -plat.h / 2, 0, plat.h / 2);
    platGrad.addColorStop(0, COLORS.PLATFORM);
    platGrad.addColorStop(1, COLORS.PLATFORM_DARK);
    ctx.fillStyle = platGrad;
    ctx.fillRect(-plat.w / 2, -plat.h / 2, plat.w, plat.h);

    ctx.strokeStyle = ANIME.OUTLINE_COLOR;
    ctx.lineWidth = ANIME.OUTLINE_WIDTH;
    ctx.strokeRect(-plat.w / 2, -plat.h / 2, plat.w, plat.h);

    ctx.fillStyle = '#f0d860';
    ctx.fillRect(-plat.w / 2 + 3, -plat.h / 2 + 2, plat.w - 6, 3);
    ctx.strokeStyle = ANIME.OUTLINE_COLOR;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(-plat.w / 2 + 3, -plat.h / 2 + 2, plat.w - 6, 3);

    const shelterW = 60;
    const shelterH = 25;
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(-shelterW / 2 + 3, -shelterH / 2 + 3, shelterW, shelterH);
    ctx.fillStyle = '#706050';
    ctx.fillRect(-shelterW / 2, -shelterH / 2, shelterW, shelterH);
    ctx.strokeStyle = ANIME.OUTLINE_COLOR;
    ctx.lineWidth = ANIME.OUTLINE_INNER;
    ctx.strokeRect(-shelterW / 2, -shelterH / 2, shelterW, shelterH);

    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(-4, -plat.h / 2 - 18, 8, 18);
    ctx.fillStyle = '#eee';
    ctx.fillRect(-8, -plat.h / 2 - 22, 16, 8);
    ctx.strokeStyle = ANIME.OUTLINE_COLOR;
    ctx.lineWidth = 1;
    ctx.strokeRect(-8, -plat.h / 2 - 22, 16, 8);

    for (let i = 0; i < 3; i++) {
      const bx = -plat.w / 2 + 25 + i * 50;
      if (bx > plat.w / 2 - 15) break;
      ctx.fillStyle = '#555';
      ctx.fillRect(bx, -plat.h / 2 + 6, 3, plat.h - 12);
      ctx.fillStyle = '#888';
      ctx.beginPath();
      ctx.arc(bx + 1.5, -plat.h / 2 + 6, 4, Math.PI, 0);
      ctx.fill();
    }

    ctx.restore();
  }
}
