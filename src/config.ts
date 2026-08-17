import type { Building, TreeData } from './types';

export const LAYOUT = {
  TRACK_Y_RATIO: 0.72,
  GROUND_Y_RATIO: 0.76,
  RICE_PADDY_Y_RATIO: 0.62,
  HILL_BASE_Y_RATIO: 0.52,
} as const;

export const TRAIN = {
  SPEED: 0.5,
  BODY_W: 75,
  BODY_H: 38,
  CARRIAGE_GAP: 14,
  NUM_CARRIAGES: 5,
} as const;

export const SKY = {
  TOP: '#e8d5e0',
  MID_HIGH: '#f0b8a0',
  MID: '#f5c89c',
  LOW: '#f7e4c8',
  HORIZON: '#ffe8d0',
} as const;

export const SUN = {
  COLOR: '#fff5d4',
  GLOW_INNER: 'rgba(255, 220, 150, 0.85)',
  GLOW_MID: 'rgba(255, 180, 100, 0.35)',
  GLOW_OUTER: 'rgba(255, 140, 70, 0.08)',
} as const;

export const HILLS = [
  { baseY: 0.52, amplitude: 0.12, color: '#6a8a5a', freq: 0.003, offset: 0 },
  { baseY: 0.55, amplitude: 0.10, color: '#5a7a4a', freq: 0.004, offset: 100 },
  { baseY: 0.58, amplitude: 0.08, color: '#4a6b3a', freq: 0.005, offset: 200 },
  { baseY: 0.61, amplitude: 0.06, color: '#3d5e2e', freq: 0.006, offset: 300 },
] as const;

export const VILLAGE_GROUND_OFFSET = -15;

export const CLOUD_COLORS = {
  top: '#fff0e0',
  bottom: '#f5c89c',
} as const;

export const PARTICLE_COLORS = {
  dust: [255, 220, 140],
  firefly: [200, 255, 120],
  seed: [255, 255, 240],
} as const;

export const NATURE = {
  GRASS_COUNT: 250,
  FLOWER_COUNT: 40,
  MAX_PARTICLES: 80,
} as const;

export const TREE_DEFS: readonly TreeData[] = [
  { x: 0.05, scale: 1.4, isHero: true },
  { x: 0.14, scale: 0.85 },
  { x: 0.86, scale: 1.1 },
  { x: 0.95, scale: 1.0 },
  { x: 0.99, scale: 0.7 },
] as const;

export const BUILDINGS: readonly Building[] = [
  { x: 0.08, w: 55, h: 45, roofH: 28, type: 'minka', color: '#f0e4d0', roofColor: '#6b4c2a' },
  { x: 0.16, w: 45, h: 38, roofH: 24, type: 'house', color: '#ede0d0', roofColor: '#5a3d20' },
  { x: 0.24, w: 35, h: 85, roofH: 32, type: 'pagoda', color: '#f0e4d8', roofColor: '#4a3520' },
  { x: 0.32, w: 50, h: 42, roofH: 26, type: 'minka', color: '#f2e2cc', roofColor: '#6b4c2a' },
  { x: 0.42, w: 65, h: 48, roofH: 30, type: 'barn', color: '#e8d4b8', roofColor: '#5a3d20' },
  { x: 0.55, w: 40, h: 35, roofH: 22, type: 'house', color: '#ede0d0', roofColor: '#4a3520' },
  { x: 0.62, w: 30, h: 70, roofH: 26, type: 'pagoda', color: '#d4c4b0', roofColor: '#5a3d20' },
  { x: 0.78, w: 50, h: 40, roofH: 26, type: 'minka', color: '#f2e2cc', roofColor: '#6b4c2a' },
  { x: 0.88, w: 48, h: 44, roofH: 24, type: 'house', color: '#f5e6d3', roofColor: '#4a3520' },
] as const;
