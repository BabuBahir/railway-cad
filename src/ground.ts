import type { SceneState } from './types';
import { WORLD, COLORS, COASTAL, YARD_BOUNDARY_Y, ANIME, ROAD } from './config';

let groundCanvas: HTMLCanvasElement | null = null;

function getGroundTexture(W: number, H: number): HTMLCanvasElement {
  if (groundCanvas && groundCanvas.width === W && groundCanvas.height === H) return groundCanvas;
  groundCanvas = document.createElement('canvas');
  groundCanvas.width = W;
  groundCanvas.height = H;
  const gctx = groundCanvas.getContext('2d')!;

  gctx.fillStyle = COLORS.BALLAST;
  gctx.fillRect(0, 0, W, H);

  const imageData = gctx.getImageData(0, 0, W, H);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 20;
    imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + noise));
    imageData.data[i + 1] = Math.max(0, Math.min(255, imageData.data[i + 1] + noise));
    imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] + noise));
  }
  gctx.putImageData(imageData, 0, 0);

  gctx.strokeStyle = 'rgba(80, 75, 70, 0.1)';
  gctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 8) {
    for (let y = 0; y < H; y += 8) {
      if (Math.random() < 0.3) {
        gctx.beginPath();
        gctx.arc(x + Math.random() * 4, y + Math.random() * 4, 0.5 + Math.random(), 0, Math.PI * 2);
        gctx.stroke();
      }
    }
  }

  return groundCanvas;
}

export function drawGround(s: SceneState) {
  const { ctx } = s;
  const tex = getGroundTexture(WORLD.WIDTH, WORLD.HEIGHT);
  ctx.drawImage(tex, 0, 0);

  const grad = ctx.createRadialGradient(WORLD.WIDTH / 2, WORLD.HEIGHT / 2, 100, WORLD.WIDTH / 2, WORLD.HEIGHT / 2, WORLD.WIDTH * 0.7);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.7, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(30, 25, 20, 0.3)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, WORLD.WIDTH, WORLD.HEIGHT);
}

export function drawGrassEdges(s: SceneState) {
  const { ctx } = s;
  const W = WORLD.WIDTH;
  const H = WORLD.HEIGHT;
  const edgeW = 60;

  const edges = [
    { x: 0, y: 0, w: edgeW, h: H, side: 'left' as const },
    { x: W - edgeW, y: 0, w: edgeW, h: H, side: 'right' as const },
    { x: 0, y: 0, w: W, h: edgeW, side: 'top' as const },
  ];

  for (const edge of edges) {
    let grad: CanvasGradient;
    if (edge.side === 'left') {
      grad = ctx.createLinearGradient(edge.x, 0, edge.x + edge.w, 0);
    } else if (edge.side === 'right') {
      grad = ctx.createLinearGradient(edge.x + edge.w, 0, edge.x, 0);
    } else {
      grad = ctx.createLinearGradient(0, edge.y, 0, edge.y + edge.h);
    }
    grad.addColorStop(0, 'rgba(74, 124, 50, 0.5)');
    grad.addColorStop(1, 'rgba(74, 124, 50, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(edge.x, edge.y, edge.w, edge.h);
  }
}

function drawCoconutTree(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
  ctx.save();
  ctx.translate(x, y);

  const windLean = Math.sin(time * 0.02 + x * 0.015) * 1.5;
  const windTopX = windLean;

  ctx.fillStyle = '#5a3a1a';
  ctx.beginPath();
  ctx.moveTo(-3, 0);
  ctx.lineTo(-1.5 + windTopX * 0.3, -20);
  ctx.lineTo(windTopX * 0.6, -30);
  ctx.lineTo(1.5 + windTopX, -40);
  ctx.lineTo(3 + windTopX * 0.6, -30);
  ctx.lineTo(1.5 + windTopX * 0.3, -20);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 0.8;
  ctx.stroke();

  ctx.save();
  ctx.translate(windTopX, -40);

  for (let i = 0; i < 5; i++) {
    const baseAngle = -0.8 + i * 0.4;
    const windSway = Math.sin(time * 0.04 + x * 0.01 + i * 0.7) * 0.08;
    const angle = baseAngle + windSway;

    ctx.save();
    ctx.rotate(angle);

    const frondSway = Math.sin(time * 0.035 + x * 0.012 + i) * 2;

    ctx.fillStyle = '#2a6a2a';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(10, -8 + frondSway, 28, -2 + frondSway * 1.5);
    ctx.quadraticCurveTo(10, 2 + frondSway * 0.5, 0, 0);
    ctx.fill();
    ctx.strokeStyle = ANIME.OUTLINE_COLOR;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(10, -8 + frondSway, 28, -2 + frondSway * 1.5);
    ctx.stroke();

    ctx.restore();
  }

  ctx.fillStyle = '#8a6a2a';
  ctx.beginPath();
  ctx.arc(-3, -2, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(2, -3, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  ctx.restore();
}

function drawPublicBench(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);

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

interface RoadCar {
  x: number;
  lane: number;
  speed: number;
  color: string;
}

const roadCars: RoadCar[] = [];
const CAR_COLORS = ['#cc3333', '#3366cc', '#33aa44', '#ddaa22', '#8844aa', '#222222', '#ffffff', '#ee6600'];
let lastCarSpawn = 0;

function updateRoadCars(time: number) {
  if (time - lastCarSpawn > 50 + Math.floor(Math.sin(time * 0.01) * 30)) {
    const lane = Math.random() < 0.5 ? 0 : 1;
    const dir = lane === 0 ? 1 : -1;
    const startX = dir === 1 ? -20 : WORLD.WIDTH + 20;
    const speed = (1.2 + Math.random() * 1.0) * dir;
    roadCars.push({
      x: startX,
      lane,
      speed,
      color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)],
    });
    lastCarSpawn = time;
  }

  for (let i = roadCars.length - 1; i >= 0; i--) {
    roadCars[i].x += roadCars[i].speed;
    if (roadCars[i].x < -40 || roadCars[i].x > WORLD.WIDTH + 40) {
      roadCars.splice(i, 1);
    }
  }
}

function drawRoadCars(ctx: CanvasRenderingContext2D) {
  for (const car of roadCars) {
    const laneY = car.lane === 0 ? ROAD.Y + 8 : ROAD.Y + ROAD.HEIGHT - 8;
    const carW = 14;
    const carH = 6;

    ctx.fillStyle = car.color;
    ctx.fillRect(car.x - carW / 2, laneY - carH / 2, carW, carH);
    ctx.strokeStyle = ANIME.OUTLINE_COLOR;
    ctx.lineWidth = 0.6;
    ctx.strokeRect(car.x - carW / 2, laneY - carH / 2, carW, carH);

    ctx.fillStyle = 'rgba(180, 220, 255, 0.6)';
    ctx.fillRect(car.x - carW / 2 + (car.speed > 0 ? carW - 4 : 2), laneY - carH / 2 + 1, 3, carH - 2);
  }
}

function drawRoadSurface(ctx: CanvasRenderingContext2D, W: number) {
  const y = ROAD.Y;
  const h = ROAD.HEIGHT;

  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(0, y, W, h);

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.setLineDash([12, 8]);
  ctx.beginPath();
  ctx.moveTo(0, y + h / 2);
  ctx.lineTo(W, y + h / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#ddd';
  ctx.fillRect(0, y, W, 1);
  ctx.fillRect(0, y + h - 1, W, 1);
}

function drawStationSign(ctx: CanvasRenderingContext2D, x: number, time: number) {
  const y = ROAD.Y;
  const signW = 120;
  const signH = 22;
  const poleH = 35;

  ctx.fillStyle = '#555';
  ctx.fillRect(x - 2, y - poleH, 4, poleH);
  ctx.fillRect(x + 18, y - poleH, 4, poleH);

  ctx.fillStyle = '#2255aa';
  ctx.fillRect(x - signW / 2, y - poleH - signH, signW, signH);
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 1;
  ctx.strokeRect(x - signW / 2, y - poleH - signH, signW, signH);

  const textBlink = Math.sin(time * 0.05) > -0.3;
  if (textBlink) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('WELCOME TO STATION', x, y - poleH - signH / 2);
  }

  ctx.fillStyle = '#eebb00';
  ctx.fillRect(x - 12, y - 4, 24, 8);
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 0.6;
  ctx.strokeRect(x - 12, y - 4, 24, 8);
  ctx.fillStyle = '#222';
  ctx.font = 'bold 5px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ENTRY', x, y);
}

export function drawRoad(s: SceneState) {
  const { ctx } = s;
  const W = WORLD.WIDTH;

  drawRoadSurface(ctx, W);
  updateRoadCars(s.time);
  drawRoadCars(ctx);
  drawStationSign(ctx, ROAD.SIGN_X, s.time);
}

function drawPixelatedFoam(ctx: CanvasRenderingContext2D, W: number, waterY: number, time: number) {
  for (let x = 0; x < W; x += 3) {
    const waveOffset = Math.sin((x + time * 4) * 0.03) * 4 + Math.sin((x + time * 2.5) * 0.07) * 2;
    const foamHeight = 2 + Math.abs(Math.sin((x + time * 3) * 0.05)) * 5;
    const alpha = 0.3 + Math.sin((x + time * 5) * 0.08) * 0.15;

    if (Math.random() < 0.6) {
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(x, waterY + waveOffset - foamHeight / 2, 3, foamHeight);
    }

    if (Math.random() < 0.3) {
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
      ctx.fillRect(x, waterY + waveOffset - foamHeight - 1, 2, 1);
    }
  }
}

function drawSeaWaves(ctx: CanvasRenderingContext2D, W: number, waterY: number, time: number) {
  const numWaves = 10;

  for (let i = 0; i < numWaves; i++) {
    const waveY = waterY + 15 + i * 22;
    const depth01 = i / numWaves;
    const alpha = 0.25 - depth01 * 0.15;
    const thickness = 3.5 - depth01 * 1.5;
    const speed = 4.0 - depth01 * 1.5;
    const freq1 = 0.012 + depth01 * 0.003;
    const freq2 = 0.035 + depth01 * 0.005;

    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = thickness;
    ctx.beginPath();
    for (let x = 0; x < W; x += 2) {
      const y1 = Math.sin((x + time * speed + i * 50) * freq1) * 5;
      const y2 = Math.sin((x + time * speed * 0.7 + i * 30) * freq2) * 2.5;
      const y = waveY + y1 + y2;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    if (i < 3) {
      for (let x = 0; x < W; x += 6) {
        const y1 = Math.sin((x + time * speed + i * 50) * freq1) * 5;
        const y2 = Math.sin((x + time * speed * 0.7 + i * 30) * freq2) * 2.5;
        const dy = Math.cos((x + time * speed + i * 50) * freq1) * freq1 * 5;
        if (Math.abs(dy) > 0.02 && Math.random() < 0.4) {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
          ctx.fillRect(x, waveY + y1 + y2 - 1, 4, 2);
        }
      }
    }
  }
}

function drawWetSand(ctx: CanvasRenderingContext2D, W: number, sandY: number, waterY: number, time: number) {
  const wetSandH = waterY - sandY;
  for (let x = 0; x < W; x += 3) {
    const waveReach = Math.sin((x + time * 4) * 0.03) * 6 + Math.sin((x + time * 2.5) * 0.07) * 3;
    const h = Math.max(0, wetSandH * 0.5 + waveReach);
    if (h > 2) {
      ctx.fillStyle = 'rgba(140, 120, 90, 0.25)';
      ctx.fillRect(x, waterY - h, 3, h);
    }
  }
}

export function drawCoastalArea(s: SceneState) {
  const { ctx } = s;
  const W = WORLD.WIDTH;
  const sandY = COASTAL.SAND_Y;
  const waterY = COASTAL.WATER_Y;

  const grassGrad = ctx.createLinearGradient(0, sandY - 30, 0, sandY);
  grassGrad.addColorStop(0, 'rgba(74, 124, 50, 0)');
  grassGrad.addColorStop(1, 'rgba(74, 124, 50, 0.6)');
  ctx.fillStyle = grassGrad;
  ctx.fillRect(0, sandY - 30, W, 30);

  const sandGrad = ctx.createLinearGradient(0, sandY, 0, waterY);
  sandGrad.addColorStop(0, COLORS.SAND);
  sandGrad.addColorStop(1, COLORS.SAND_DARK);
  ctx.fillStyle = sandGrad;
  ctx.fillRect(0, sandY, W, waterY - sandY);

  const imageData = ctx.getImageData(0, sandY, W, Math.min(waterY - sandY, 60));
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 12;
    imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + noise));
    imageData.data[i + 1] = Math.max(0, Math.min(255, imageData.data[i + 1] + noise));
    imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, sandY);

  const seaGrad = ctx.createLinearGradient(0, waterY, 0, WORLD.HEIGHT);
  seaGrad.addColorStop(0, COLORS.SEA_LIGHT);
  seaGrad.addColorStop(0.3, COLORS.SEA);
  seaGrad.addColorStop(0.7, '#1a5a7a');
  seaGrad.addColorStop(1, '#0a3a5a');
  ctx.fillStyle = seaGrad;
  ctx.fillRect(0, waterY, W, WORLD.HEIGHT - waterY);

  for (let band = 0; band < 8; band++) {
    const bandY = waterY + band * 35;
    const bandH = 35;
    const bright = band % 2 === 0 ? 0.04 : -0.02;
    ctx.fillStyle = `rgba(255, 255, 255, ${bright > 0 ? bright : 0})`;
    if (bright > 0) {
      ctx.fillRect(0, bandY, W, bandH);
    } else {
      ctx.fillStyle = `rgba(0, 0, 30, ${Math.abs(bright)})`;
      ctx.fillRect(0, bandY, W, bandH);
    }
  }

  drawWetSand(ctx, W, sandY, waterY, s.time);
  drawPixelatedFoam(ctx, W, waterY, s.time);
  drawSeaWaves(ctx, W, waterY, s.time);

  const treeStartX = 100;
  const treeSpacing = COASTAL.TREE_SPACING;
  for (let x = treeStartX; x < W; x += treeSpacing) {
    drawCoconutTree(ctx, x + Math.sin(x) * 15, sandY - 5 + Math.cos(x * 0.7) * 5, s.time);
  }

  const benchStartX = 160;
  const benchSpacing = COASTAL.BENCH_SPACING;
  for (let x = benchStartX; x < W; x += benchSpacing) {
    drawPublicBench(ctx, x, sandY + 18);
  }
}

export function drawYardBoundary(s: SceneState) {
  const { ctx } = s;
  const W = WORLD.WIDTH;
  const y = YARD_BOUNDARY_Y;

  ctx.strokeStyle = '#888';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 4]);
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(W, y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#666';
  const postSpacing = 60;
  for (let x = 20; x < W; x += postSpacing) {
    ctx.fillRect(x - 1.5, y - 8, 3, 16);
    ctx.strokeStyle = ANIME.OUTLINE_COLOR;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x - 1.5, y - 8, 3, 16);
  }

  const fenceGrad = ctx.createLinearGradient(0, y - 10, 0, y + 10);
  fenceGrad.addColorStop(0, 'rgba(100, 100, 100, 0.15)');
  fenceGrad.addColorStop(0.5, 'rgba(100, 100, 100, 0.08)');
  fenceGrad.addColorStop(1, 'rgba(100, 100, 100, 0.15)');
  ctx.fillStyle = fenceGrad;
  ctx.fillRect(0, y - 10, W, 20);
}
