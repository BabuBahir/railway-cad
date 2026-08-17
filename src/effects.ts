import type { SceneState } from './types';
import { ANIME, WORLD } from './config';

let paperCanvas: HTMLCanvasElement | null = null;

function getPaperTexture(W: number, H: number): HTMLCanvasElement {
  if (paperCanvas && paperCanvas.width === W && paperCanvas.height === H) return paperCanvas;
  paperCanvas = document.createElement('canvas');
  paperCanvas.width = W;
  paperCanvas.height = H;
  const pctx = paperCanvas.getContext('2d')!;
  const imageData = pctx.createImageData(W, H);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const v = Math.random() * 35;
    imageData.data[i] = v;
    imageData.data[i + 1] = v;
    imageData.data[i + 2] = v;
    imageData.data[i + 3] = 255;
  }
  pctx.putImageData(imageData, 0, 0);
  return paperCanvas;
}

export function drawPaperTexture(s: SceneState) {
  const { ctx } = s;
  const paper = getPaperTexture(WORLD.WIDTH, WORLD.HEIGHT);
  ctx.save();
  ctx.globalAlpha = ANIME.PAPER_OPACITY;
  ctx.globalCompositeOperation = 'overlay';
  ctx.drawImage(paper, 0, 0);
  ctx.restore();
}

export function drawVignette(s: SceneState) {
  const { ctx } = s;
  const cx = WORLD.WIDTH / 2;
  const cy = WORLD.HEIGHT / 2;
  const grad = ctx.createRadialGradient(cx, cy, 200, cx, cy, WORLD.WIDTH * 0.6);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.7, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(20, 15, 10, 0.2)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, WORLD.WIDTH, WORLD.HEIGHT);
}

let scanlineCanvas: HTMLCanvasElement | null = null;

function getScanlineTexture(W: number, H: number): HTMLCanvasElement {
  if (scanlineCanvas && scanlineCanvas.width === W && scanlineCanvas.height === H) return scanlineCanvas;
  scanlineCanvas = document.createElement('canvas');
  scanlineCanvas.width = W;
  scanlineCanvas.height = H;
  const sctx = scanlineCanvas.getContext('2d')!;

  sctx.clearRect(0, 0, W, H);

  for (let y = 0; y < H; y += 3) {
    sctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    sctx.fillRect(0, y, W, 1);
  }

  return scanlineCanvas;
}

export function drawScanlines(s: SceneState) {
  const { ctx } = s;
  const scanlines = getScanlineTexture(WORLD.WIDTH, WORLD.HEIGHT);
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.drawImage(scanlines, 0, 0);
  ctx.restore();
}

export function drawCRTEffect(s: SceneState) {
  const { ctx } = s;
  const cx = WORLD.WIDTH / 2;
  const cy = WORLD.HEIGHT / 2;

  const grad = ctx.createRadialGradient(cx, cy, WORLD.WIDTH * 0.25, cx, cy, WORLD.WIDTH * 0.65);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(0.6, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, WORLD.WIDTH, WORLD.HEIGHT);

  const hueGrad = ctx.createLinearGradient(0, 0, WORLD.WIDTH, 0);
  hueGrad.addColorStop(0, 'rgba(100, 0, 0, 0.03)');
  hueGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
  hueGrad.addColorStop(1, 'rgba(0, 0, 100, 0.03)');
  ctx.fillStyle = hueGrad;
  ctx.fillRect(0, 0, WORLD.WIDTH, WORLD.HEIGHT);
}

export function applyPixelation(ctx: CanvasRenderingContext2D, w: number, h: number, scale: number) {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = Math.floor(w / scale);
  tempCanvas.height = Math.floor(h / scale);
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.imageSmoothingEnabled = false;
  tempCtx.drawImage(ctx.canvas, 0, 0, tempCanvas.width, tempCanvas.height);

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(tempCanvas, 0, 0, w, h);
  ctx.imageSmoothingEnabled = true;
}
