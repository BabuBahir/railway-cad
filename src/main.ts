import type { SceneState, Camera } from './types';
import { WORLD } from './config';
import { drawGround, drawGrassEdges } from './ground';
import { drawAllTracks } from './track';
import { drawTrains } from './trains';
import { drawPlatforms } from './station';
import { drawPaperTexture, drawVignette } from './effects';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d')!;
document.querySelector('#app')!.appendChild(canvas);

const camera: Camera = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
};

const state: SceneState = {
  W: 0,
  H: 0,
  time: 0,
  canvas,
  ctx,
  camera,
};

function resize() {
  state.W = window.innerWidth;
  state.H = window.innerHeight;
  canvas.width = state.W;
  canvas.height = state.H;

  const scaleX = state.W / WORLD.WIDTH;
  const scaleY = state.H / WORLD.HEIGHT;
  camera.zoom = Math.min(scaleX, scaleY);
  camera.offsetX = (WORLD.WIDTH - state.W / camera.zoom) / 2;
  camera.offsetY = (WORLD.HEIGHT - state.H / camera.zoom) / 2;
}
resize();
window.addEventListener('resize', resize);

function render() {
  state.time++;
  const { ctx } = state;
  ctx.clearRect(0, 0, state.W, state.H);

  ctx.save();
  ctx.scale(camera.zoom, camera.zoom);
  ctx.translate(-camera.offsetX, -camera.offsetY);

  drawGround(state);
  drawGrassEdges(state);
  drawAllTracks(state);
  drawPlatforms(state);
  drawTrains(state);
  drawPaperTexture(state);
  drawVignette(state);

  ctx.restore();

  requestAnimationFrame(render);
}

render();
