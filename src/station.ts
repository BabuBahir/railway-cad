import type { SceneState } from './types';
import { PLATFORMS, COLORS, ANIME } from './config';

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

function drawBench(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#6b5545';
  ctx.fillRect(x - 14, y - 3, 28, 6);
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 0.8;
  ctx.strokeRect(x - 14, y - 3, 28, 6);
  ctx.fillStyle = '#5a4435';
  ctx.fillRect(x - 12, y - 2, 24, 4);
  ctx.fillStyle = '#4a3a2a';
  ctx.fillRect(x - 12, y - 1, 2, 2);
  ctx.fillRect(x + 10, y - 1, 2, 2);
}

function drawClock(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#5a4a3a';
  ctx.fillRect(-2, 0, 4, 20);
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

function drawVendingMachine(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.fillRect(x - 8 + 2, y - 12 + 2, 16, 24);
  ctx.fillStyle = '#3366aa';
  ctx.fillRect(x - 8, y - 12, 16, 24);
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 8, y - 12, 16, 24);
  ctx.fillStyle = '#aaddff';
  ctx.fillRect(x - 6, y - 10, 12, 14);
  ctx.fillStyle = '#44aa44';
  ctx.fillRect(x - 5, y + 6, 4, 4);
  ctx.fillStyle = '#cc4444';
  ctx.fillRect(x + 1, y + 6, 4, 4);
  ctx.fillStyle = '#222';
  ctx.fillRect(x - 3, y - 11, 6, 1);
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

function drawPlatformSign(ctx: CanvasRenderingContext2D, x: number, y: number, num: string) {
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

function drawCommonDepartureBoard(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
  ctx.save();
  ctx.translate(x, y);

  const boardW = 160;
  const boardH = 52;

  ctx.fillStyle = '#1a1a1a';
  roundedRect(ctx, -boardW / 2, -boardH / 2, boardW, boardH, 4);
  ctx.fill();
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1.5;
  roundedRect(ctx, -boardW / 2, -boardH / 2, boardW, boardH, 4);
  ctx.stroke();

  ctx.fillStyle = '#222';
  ctx.fillRect(-boardW / 2 + 3, -boardH / 2 + 3, boardW - 6, boardH - 6);

  ctx.fillStyle = '#aaa';
  ctx.fillRect(-boardW / 2 + 5, -boardH / 2 + 14, boardW - 10, 1);

  ctx.font = 'bold 5px monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#ffaa00';
  ctx.fillText('TIME', -boardW / 2 + 7, -boardH / 2 + 5);
  ctx.fillStyle = '#00ccff';
  ctx.fillText('TRAIN', -boardW / 2 + 35, -boardH / 2 + 5);
  ctx.fillStyle = '#00cc88';
  ctx.fillText('DEST', -boardW / 2 + 80, -boardH / 2 + 5);
  ctx.fillStyle = '#ff6666';
  ctx.fillText('PLT', -boardW / 2 + 125, -boardH / 2 + 5);

  const blink = Math.floor(time / 30) % 2 === 0;

  const entries = [
    { time: '08:03', train: 'BULLET', dest: 'AIRPORT', plt: '1' },
    { time: '08:17', train: 'YELLOW', dest: 'WESTEND', plt: '1' },
    { time: '08:33', train: 'REGIONL', dest: 'SOUTHJCT', plt: '2' },
    { time: '08:47', train: 'EXPRESS', dest: 'CENTRAL', plt: '3' },
  ];

  for (let row = 0; row < entries.length; row++) {
    const rowY = -boardH / 2 + 17 + row * 8;
    const e = entries[row];

    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(-boardW / 2 + 5, rowY, boardW - 10, 7);

    ctx.font = 'bold 5px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = blink ? '#ffcc00' : '#cc9900';
    ctx.fillText(e.time, -boardW / 2 + 7, rowY + 1);

    ctx.fillStyle = '#44ddff';
    ctx.fillText(e.train, -boardW / 2 + 35, rowY + 1);

    ctx.fillStyle = '#44ddaa';
    ctx.fillText(e.dest, -boardW / 2 + 80, rowY + 1);

    ctx.fillStyle = '#ff6666';
    ctx.fillText(e.plt, -boardW / 2 + 125, rowY + 1);
  }

  ctx.fillStyle = '#222';
  ctx.font = 'bold 4px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CENTRAL STATION — DEPARTURES', 0, boardH / 2 - 5);

  ctx.restore();
}

function drawStationName(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#ddd';
  roundedRect(ctx, -70, -14, 140, 28, 4);
  ctx.fill();
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 1.2;
  roundedRect(ctx, -70, -14, 140, 28, 4);
  ctx.stroke();

  ctx.fillStyle = '#222';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CENTRAL STATION', 0, 1);

  ctx.restore();
}

function drawPlatformSurface(ctx: CanvasRenderingContext2D, plat: { x: number; y: number; w: number; h: number; angle: number }) {
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

  ctx.restore();
}

function drawShelters(ctx: CanvasRenderingContext2D, plat: { x: number; y: number; w: number; h: number; angle: number }) {
  ctx.save();
  ctx.translate(plat.x, plat.y);
  ctx.rotate(plat.angle);

  const shelterW = 80;
  const shelterH = 30;
  const sx1 = -plat.w / 2 + 80;
  const sx2 = plat.w / 2 - 80;

  for (const sx of [sx1, sx2]) {
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
    ctx.fillRect(sx - shelterW / 2 + 4, -shelterH / 2 - 5, 3, 5);
    ctx.fillRect(sx + shelterW / 2 - 7, -shelterH / 2 - 5, 3, 5);

    ctx.fillStyle = '#706050';
    ctx.fillRect(sx - shelterW / 2 - 1, -shelterH / 2 - 3, shelterW + 2, 4);
    ctx.strokeStyle = ANIME.OUTLINE_COLOR;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(sx - shelterW / 2 - 1, -shelterH / 2 - 3, shelterW + 2, 4);
  }

  ctx.restore();
}

function drawBenches(ctx: CanvasRenderingContext2D, plat: { x: number; y: number; w: number; h: number; angle: number }) {
  ctx.save();
  ctx.translate(plat.x, plat.y);
  ctx.rotate(plat.angle);

  for (const bx of [-plat.w / 2 + 30, -plat.w / 2 + 90, -plat.w / 2 + 150, plat.w / 2 - 30, plat.w / 2 - 90, plat.w / 2 - 150]) {
    drawBench(ctx, bx, -plat.h / 2 + 12);
  }
  for (const bx of [-plat.w / 2 + 60, -plat.w / 2 + 120, plat.w / 2 - 60, plat.w / 2 - 120]) {
    drawBench(ctx, bx, plat.h / 2 - 12);
  }

  ctx.restore();
}

function drawStationBuilding(ctx: CanvasRenderingContext2D, plat1Y: number, plat2Y: number, cx: number) {
  const topY = Math.min(plat1Y, plat2Y);
  const botY = Math.max(plat1Y, plat2Y);
  const buildingW = 140;
  const buildingH = (botY - topY) * 0.55;
  const buildingY = (topY + botY) / 2;
  const buildingX = cx;

  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(buildingX - buildingW / 2 + 4, buildingY - buildingH / 2 + 4, buildingW, buildingH);

  const bldgGrad = ctx.createLinearGradient(0, buildingY - buildingH / 2, 0, buildingY + buildingH / 2);
  bldgGrad.addColorStop(0, '#c8b8a0');
  bldgGrad.addColorStop(0.5, '#d8c8b0');
  bldgGrad.addColorStop(1, '#b8a890');
  ctx.fillStyle = bldgGrad;
  ctx.fillRect(buildingX - buildingW / 2, buildingY - buildingH / 2, buildingW, buildingH);

  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = ANIME.OUTLINE_WIDTH;
  ctx.strokeRect(buildingX - buildingW / 2, buildingY - buildingH / 2, buildingW, buildingH);

  for (let i = 0; i < 4; i++) {
    const winX = buildingX - buildingW / 2 + 15 + i * 32;
    const winY = buildingY - buildingH / 2 + 10;
    ctx.fillStyle = '#3a3530';
    ctx.fillRect(winX - 1, winY - 1, 14, 12);
    const glassGrad = ctx.createLinearGradient(winX, winY, winX, winY + 10);
    glassGrad.addColorStop(0, '#88c8e8');
    glassGrad.addColorStop(1, '#4488a8');
    ctx.fillStyle = glassGrad;
    ctx.fillRect(winX, winY, 12, 10);
  }

  ctx.fillStyle = '#706050';
  ctx.fillRect(buildingX - buildingW / 2 - 1, buildingY - buildingH / 2 - 4, buildingW + 2, 6);
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 0.8;
  ctx.strokeRect(buildingX - buildingW / 2 - 1, buildingY - buildingH / 2 - 4, buildingW + 2, 6);

  const doorW = 20;
  const doorH = 14;
  ctx.fillStyle = '#5a4a3a';
  ctx.fillRect(buildingX - doorW / 2, buildingY + buildingH / 2 - doorH, doorW, doorH);
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 0.8;
  ctx.strokeRect(buildingX - doorW / 2, buildingY + buildingH / 2 - doorH, doorW, doorH);

  ctx.fillStyle = '#88c8e8';
  ctx.fillRect(buildingX - doorW / 2 + 2, buildingY + buildingH / 2 - doorH + 2, doorW / 2 - 3, doorH - 4);
  ctx.fillRect(buildingX + 1, buildingY + buildingH / 2 - doorH + 2, doorW / 2 - 3, doorH - 4);
}

export function drawPlatforms(s: SceneState) {
  const { ctx } = s;

  if (PLATFORMS.length < 2) return;

  const plat1 = PLATFORMS[0];
  const plat2 = PLATFORMS[1];
  const stationCx = plat1.x;

  drawStationBuilding(ctx, plat1.y, plat2.y, stationCx);

  drawStationName(ctx, stationCx, (plat1.y + plat2.y) / 2 - 24);

  drawCommonDepartureBoard(ctx, stationCx, (plat1.y + plat2.y) / 2 + 4, s.time);

  drawPlatformSurface(ctx, plat1);
  drawShelters(ctx, plat1);
  drawBenches(ctx, plat1);

  ctx.save();
  ctx.translate(plat1.x, plat1.y);
  ctx.rotate(plat1.angle);
  drawVendingMachine(ctx, -plat1.w / 2 + 15, -plat1.h / 2 + 18);
  drawVendingMachine(ctx, plat1.w / 2 - 15, -plat1.h / 2 + 18);
  drawTrashBin(ctx, -plat1.w / 2 + 50, plat1.h / 2 - 10);
  drawTrashBin(ctx, plat1.w / 2 - 50, plat1.h / 2 - 10);
  drawPlatformSign(ctx, -plat1.w / 2 + 8, 0, '1');
  drawPlatformSign(ctx, plat1.w / 2 - 8, 0, '1');
  drawClock(ctx, -plat1.w / 2 + 30, -plat1.h / 2 - 5);
  ctx.restore();

  drawPlatformSurface(ctx, plat2);
  drawShelters(ctx, plat2);
  drawBenches(ctx, plat2);

  ctx.save();
  ctx.translate(plat2.x, plat2.y);
  ctx.rotate(plat2.angle);
  drawVendingMachine(ctx, -plat2.w / 2 + 15, plat2.h / 2 - 18);
  drawVendingMachine(ctx, plat2.w / 2 - 15, plat2.h / 2 - 18);
  drawTrashBin(ctx, -plat2.w / 2 + 50, -plat2.h / 2 + 10);
  drawTrashBin(ctx, plat2.w / 2 - 50, -plat2.h / 2 + 10);
  drawPlatformSign(ctx, -plat2.w / 2 + 8, 0, '2');
  drawPlatformSign(ctx, plat2.w / 2 - 8, 0, '2');
  drawClock(ctx, plat2.w / 2 - 30, plat2.h / 2 + 5);
  ctx.restore();
}
