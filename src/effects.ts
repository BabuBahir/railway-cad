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
