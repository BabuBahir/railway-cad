import type { SceneState } from './types';
import { LAYOUT } from './config';
import { drawSky, drawSun, drawClouds, drawBirds } from './sky';
import { drawHills, drawDistantTrees, drawRicePaddies, drawGround, drawPath } from './landscape';
import { drawVillage, drawStoneWall, drawPoles } from './village';
import { drawTracks, drawTrain } from './train';
import { drawHeroTree, drawTree, drawGrass, drawParticles, drawBamboo } from './nature';
import { drawVignette, drawSunRays } from './effects';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d')!;
document.querySelector('#app')!.appendChild(canvas);

const state: SceneState = {
  W: 0,
  H: 0,
  time: 0,
  canvas,
  ctx,
};

function resize() {
  state.W = window.innerWidth;
  state.H = window.innerHeight;
  canvas.width = state.W;
  canvas.height = state.H;
}
resize();
window.addEventListener('resize', resize);

function render() {
  state.time++;
  const { W, H } = state;
  ctx.clearRect(0, 0, W, H);

  const trackY = H * LAYOUT.TRACK_Y_RATIO;
  const groundY = H * LAYOUT.GROUND_Y_RATIO;

  drawSky(state);
  drawSun(state);
  drawSunRays(state);
  drawClouds(state);
  drawBirds(state);

  drawHills(state);
  drawDistantTrees(state, H * 0.56, '#3a5a28', 40, 18);
  drawDistantTrees(state, H * 0.59, '#4a6b35', 35, 15);

  drawRicePaddies(state);

  drawVillage(state, groundY);
  drawStoneWall(state, groundY);
  drawPoles(state, groundY);
  drawBamboo(state, groundY);

  drawTracks(state, trackY);
  drawTrain(state, trackY);

  drawGround(state, groundY);
  drawPath(state, groundY);
  drawGrass(state, groundY);

  drawHeroTree(state, groundY);
  drawTree(state, W * 0.14, groundY, 0.85);
  drawTree(state, W * 0.86, groundY, 1.1);
  drawTree(state, W * 0.95, groundY, 1.0);
  drawTree(state, W * 0.99, groundY + 5, 0.7);

  drawParticles(state);
  drawVignette(state);

  requestAnimationFrame(render);
}

render();
