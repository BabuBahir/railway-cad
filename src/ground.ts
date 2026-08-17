import type { SceneState } from './types';
import { WORLD, COLORS } from './config';

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
    { x: 0, y: 0, w: edgeW, h: H, side: 'left' },
    { x: W - edgeW, y: 0, w: edgeW, h: H, side: 'right' },
    { x: 0, y: 0, w: W, h: edgeW, side: 'top' },
    { x: 0, y: H - edgeW, w: W, h: edgeW, side: 'bottom' },
  ];

  for (const edge of edges) {
    let grad: CanvasGradient;
    if (edge.side === 'left') {
      grad = ctx.createLinearGradient(edge.x, 0, edge.x + edge.w, 0);
    } else if (edge.side === 'right') {
      grad = ctx.createLinearGradient(edge.x + edge.w, 0, edge.x, 0);
    } else if (edge.side === 'top') {
      grad = ctx.createLinearGradient(0, edge.y, 0, edge.y + edge.h);
    } else {
      grad = ctx.createLinearGradient(0, edge.y + edge.h, 0, edge.y);
    }
    grad.addColorStop(0, 'rgba(74, 124, 50, 0.5)');
    grad.addColorStop(1, 'rgba(74, 124, 50, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(edge.x, edge.y, edge.w, edge.h);
  }
}
