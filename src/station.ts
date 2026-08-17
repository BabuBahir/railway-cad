import type { SceneState } from './types';
import { PLATFORMS, COLORS, ANIME, TRAIN_NAMES, TRAIN_DESTINATIONS } from './config';

function drawBench(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.fillStyle = '#6b5545';
  ctx.fillRect(-14, -3, 28, 6);
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 0.8;
  ctx.strokeRect(-14, -3, 28, 6);

  ctx.fillStyle = '#5a4435';
  ctx.fillRect(-12, -2, 24, 4);

  ctx.fillStyle = '#4a3a2a';
  ctx.fillRect(-12, -1, 2, 2);
  ctx.fillRect(10, -1, 2, 2);

  ctx.restore();
}

function drawClock(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#5a4a3a';
  ctx.fillRect(-2, 0, 4, 22);

  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(0, -4, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#eee';
  ctx.beginPath();
  ctx.arc(0, -4, 6.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#333';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.arc(0, -4, 6.5, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(0, -4, 0.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.lineTo(0, -8);
  ctx.stroke();

  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.lineTo(3, -3);
  ctx.stroke();

  ctx.restore();
}

function drawVendingMachine(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.fillRect(-8 + 2, -12 + 2, 16, 24);

  ctx.fillStyle = '#3366aa';
  ctx.fillRect(-8, -12, 16, 24);
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 1;
  ctx.strokeRect(-8, -12, 16, 24);

  ctx.fillStyle = '#aaddff';
  ctx.fillRect(-6, -10, 12, 14);

  ctx.fillStyle = '#44aa44';
  ctx.fillRect(-5, 6, 4, 4);
  ctx.fillStyle = '#cc4444';
  ctx.fillRect(1, 6, 4, 4);

  ctx.fillStyle = '#222';
  ctx.fillRect(-3, -11, 6, 1);

  ctx.restore();
}

function drawTrashBin(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  ctx.beginPath();
  ctx.ellipse(x + 1, y + 1, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#555';
  ctx.beginPath();
  ctx.ellipse(x, y, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 0.8;
  ctx.stroke();

  ctx.fillStyle = '#666';
  ctx.fillRect(x - 4, y - 6, 8, 2);
}

function drawPlatformNumber(ctx: CanvasRenderingContext2D, x: number, y: number, num: string) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#fff';
  ctx.fillRect(-8, -8, 16, 16);
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 1;
  ctx.strokeRect(-8, -8, 16, 16);

  ctx.fillStyle = '#222';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(num, 0, 1);

  ctx.restore();
}

function drawDepartureBoard(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(-50, -18, 100, 36);
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 1;
  ctx.strokeRect(-50, -18, 100, 36);

  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(-48, -16, 96, 32);

  ctx.fillStyle = '#8a8a8a';
  ctx.fillRect(-46, -14, 92, 1);

  ctx.font = 'bold 5px monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#ffaa00';
  ctx.fillText('TIME', -44, -12);
  ctx.fillStyle = '#00ccff';
  ctx.fillText('TRAIN', -20, -12);
  ctx.fillStyle = '#00cc88';
  ctx.fillText('DEST', 24, -12);

  const blink = Math.floor(time / 30) % 2 === 0;

  for (let row = 0; row < 3; row++) {
    const rowY = -6 + row * 9;
    const baseMinute = (row * 7 + 3) % 60;
    const minuteStr = String(8 + row * 2).padStart(2, '0') + ':' + String(baseMinute).padStart(2, '0');

    ctx.fillStyle = '#333';
    ctx.fillRect(-46, rowY, 92, 7);

    ctx.font = 'bold 5px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = blink ? '#ffcc00' : '#cc9900';
    ctx.fillText(minuteStr, -44, rowY + 1);

    ctx.fillStyle = '#44ddff';
    ctx.fillText(TRAIN_NAMES[row * 2] || 'LOCAL', -20, rowY + 1);

    ctx.fillStyle = '#44ddaa';
    ctx.fillText(TRAIN_DESTINATIONS[row * 2] || 'CENTRAL', 24, rowY + 1);
  }

  ctx.fillStyle = '#ff3333';
  ctx.fillRect(-44, 12, 4, 3);
  ctx.fillStyle = '#333';
  ctx.font = 'bold 4px monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#aa0000';
  ctx.fillText('DEPARTURES', -38, 12);

  ctx.restore();
}

function drawShelterSign(ctx: CanvasRenderingContext2D, x: number, y: number, text: string) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#5a4a3a';
  ctx.fillRect(-2, 0, 4, 16);
  ctx.fillStyle = '#eee';
  ctx.fillRect(-18, -2, 36, 12);
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 1;
  ctx.strokeRect(-18, -2, 36, 12);
  ctx.fillStyle = '#222';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 4);

  ctx.restore();
}

export function drawPlatforms(s: SceneState) {
  const { ctx } = s;

  for (const plat of PLATFORMS) {
    ctx.save();
    ctx.translate(plat.x, plat.y);
    ctx.rotate(plat.angle);

    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(-plat.w / 2 + 5, -plat.h / 2 + 5, plat.w, plat.h);

    const platGrad = ctx.createLinearGradient(0, -plat.h / 2, 0, plat.h / 2);
    platGrad.addColorStop(0, '#c0b8a8');
    platGrad.addColorStop(0.3, COLORS.PLATFORM);
    platGrad.addColorStop(0.7, COLORS.PLATFORM);
    platGrad.addColorStop(1, COLORS.PLATFORM_DARK);
    ctx.fillStyle = platGrad;
    ctx.fillRect(-plat.w / 2, -plat.h / 2, plat.w, plat.h);

    ctx.strokeStyle = ANIME.OUTLINE_COLOR;
    ctx.lineWidth = ANIME.OUTLINE_WIDTH;
    ctx.strokeRect(-plat.w / 2, -plat.h / 2, plat.w, plat.h);

    ctx.fillStyle = '#e8c840';
    ctx.fillRect(-plat.w / 2 + 3, -plat.h / 2 + 2, plat.w - 6, 3);
    ctx.strokeStyle = ANIME.OUTLINE_COLOR;
    ctx.lineWidth = 0.6;
    ctx.strokeRect(-plat.w / 2 + 3, -plat.h / 2 + 2, plat.w - 6, 3);

    ctx.fillStyle = '#e8c840';
    ctx.fillRect(-plat.w / 2 + 3, plat.h / 2 - 5, plat.w - 6, 3);
    ctx.strokeStyle = ANIME.OUTLINE_COLOR;
    ctx.lineWidth = 0.6;
    ctx.strokeRect(-plat.w / 2 + 3, plat.h / 2 - 5, plat.w - 6, 3);

    const shelterW = 80;
    const shelterH = 30;
    const shelterX1 = -plat.w / 2 + 80;
    const shelterX2 = plat.w / 2 - 80;

    for (const sx of [shelterX1, shelterX2]) {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(sx - shelterW / 2 + 3, -shelterH / 2 + 3, shelterW, shelterH);

      const roofGrad = ctx.createLinearGradient(0, -shelterH / 2, 0, shelterH / 2);
      roofGrad.addColorStop(0, '#806050');
      roofGrad.addColorStop(1, '#604838');
      ctx.fillStyle = roofGrad;
      ctx.fillRect(sx - shelterW / 2, -shelterH / 2, shelterW, shelterH);
      ctx.strokeStyle = ANIME.OUTLINE_COLOR;
      ctx.lineWidth = ANIME.OUTLINE_INNER;
      ctx.strokeRect(sx - shelterW / 2, -shelterH / 2, shelterW, shelterH);

      ctx.fillStyle = '#5a4a3a';
      ctx.fillRect(sx - shelterW / 2 + 4, -shelterH / 2 + shelterH, 3, 5);
      ctx.fillRect(sx + shelterW / 2 - 7, -shelterH / 2 + shelterH, 3, 5);

      ctx.fillStyle = '#5a4a3a';
      ctx.fillRect(sx - shelterW / 2 + 4, -shelterH / 2 - 5, 3, 5);
      ctx.fillRect(sx + shelterW / 2 - 7, -shelterH / 2 - 5, 3, 5);

      ctx.fillStyle = '#706050';
      ctx.fillRect(sx - shelterW / 2 - 1, -shelterH / 2 - 3, shelterW + 2, 4);
      ctx.strokeStyle = ANIME.OUTLINE_COLOR;
      ctx.lineWidth = 0.8;
      ctx.strokeRect(sx - shelterW / 2 - 1, -shelterH / 2 - 3, shelterW + 2, 4);
    }

    drawBench(ctx, -plat.w / 2 + 30, -plat.h / 2 + 12, plat.angle);
    drawBench(ctx, -plat.w / 2 + 90, -plat.h / 2 + 12, plat.angle);
    drawBench(ctx, -plat.w / 2 + 150, -plat.h / 2 + 12, plat.angle);
    drawBench(ctx, plat.w / 2 - 30, -plat.h / 2 + 12, plat.angle);
    drawBench(ctx, plat.w / 2 - 90, -plat.h / 2 + 12, plat.angle);
    drawBench(ctx, plat.w / 2 - 150, -plat.h / 2 + 12, plat.angle);

    drawBench(ctx, -plat.w / 2 + 60, plat.h / 2 - 12, plat.angle);
    drawBench(ctx, -plat.w / 2 + 120, plat.h / 2 - 12, plat.angle);
    drawBench(ctx, plat.w / 2 - 60, plat.h / 2 - 12, plat.angle);
    drawBench(ctx, plat.w / 2 - 120, plat.h / 2 - 12, plat.angle);

    drawVendingMachine(ctx, -plat.w / 2 + 15, -plat.h / 2 + 18, plat.angle);
    drawVendingMachine(ctx, plat.w / 2 - 15, -plat.h / 2 + 18, plat.angle);

    drawTrashBin(ctx, -plat.w / 2 + 50, plat.h / 2 - 10);
    drawTrashBin(ctx, plat.w / 2 - 50, plat.h / 2 - 10);

    drawShelterSign(ctx, 0, -plat.h / 2 - 8, 'STATION');

    drawClock(ctx, -plat.w / 2 + 30, -plat.h / 2 - 5);

    drawPlatformNumber(ctx, -plat.w / 2 + 8, 0, '1');
    drawPlatformNumber(ctx, plat.w / 2 - 8, 0, '1');

    drawDepartureBoard(ctx, -plat.w / 2 + 55, plat.h / 2 - 14, s.time);

    ctx.restore();
  }
}
