import type { TrackDef, TrainDef, PlatformDef } from './types';

export const ANIME = {
  OUTLINE_WIDTH: 2.0,
  OUTLINE_INNER: 1.0,
  OUTLINE_COLOR: 'rgba(30, 20, 15, 0.55)',
  PAPER_OPACITY: 0.04,
} as const;

export const COLORS = {
  BALLAST: '#5a5550',
  BALLAST_LIGHT: '#6a6560',
  SLEEPER: '#6b5545',
  RAIL: '#999',
  RAIL_DARK: '#777',
  PLATFORM: '#b0a898',
  PLATFORM_DARK: '#908878',
  GRASS: '#4a7c32',
  CATENARY: '#888',
  SEA: '#2a6a9a',
  SEA_LIGHT: '#3a8aba',
  SAND: '#d4c4a0',
  SAND_DARK: '#c0b090',
} as const;

export const WORLD = {
  WIDTH: 2400,
  HEIGHT: 1400,
} as const;

const MX = WORLD.WIDTH / 2;
const MY = WORLD.HEIGHT / 2;

export const YARD_BOUNDARY_Y = MY + 380;

export const COASTAL = {
  SAND_Y: MY + 420,
  WATER_Y: MY + 480,
  BENCH_SPACING: 120,
  TREE_SPACING: 160,
} as const;

export const SHIPS = [
  { x: 200, y: MY + 520, speed: 0.3, hullW: 40, hullH: 20, color: '#8b4513', dir: 1 },
  { x: 900, y: MY + 560, speed: 0.4, hullW: 72, hullH: 32, color: '#555555', dir: -1 },
  { x: 1500, y: MY + 540, speed: 0.35, hullW: 56, hullH: 24, color: '#cc3333', dir: 1 },
  { x: 600, y: MY + 580, speed: 0.25, hullW: 40, hullH: 20, color: '#2266aa', dir: -1 },
  { x: 1800, y: MY + 510, speed: 0.45, hullW: 48, hullH: 20, color: '#228844', dir: 1 },
] as const;

export const ROAD = {
  Y: 30,
  HEIGHT: 30,
  LANE_CENTER: 30,
  SIGN_X: MX,
} as const;

export const TRACKS: readonly TrackDef[] = [
  {
    id: 0,
    color: '#2080a0',
    electrified: true,
    segments: [[
      { x: -200, y: MY - 280 },
      { x: 0, y: MY - 285 },
      { x: MX * 0.4, y: MY - 275 },
      { x: MX * 0.8, y: MY - 290 },
      { x: MX * 1.2, y: MY - 280 },
      { x: MX * 1.6, y: MY - 285 },
      { x: WORLD.WIDTH + 200, y: MY - 280 },
    ]],
  },
  {
    id: 1,
    color: '#a06020',
    segments: [[
      { x: -200, y: MY - 140 },
      { x: 0, y: MY - 145 },
      { x: MX * 0.4, y: MY - 135 },
      { x: MX * 0.8, y: MY - 150 },
      { x: MX * 1.2, y: MY - 140 },
      { x: MX * 1.6, y: MY - 145 },
      { x: WORLD.WIDTH + 200, y: MY - 140 },
    ]],
  },
  {
    id: 2,
    color: '#3060a0',
    segments: [[
      { x: -200, y: MY + 90 },
      { x: 0, y: MY + 85 },
      { x: MX * 0.4, y: MY + 95 },
      { x: MX * 0.8, y: MY + 80 },
      { x: MX * 1.2, y: MY + 90 },
      { x: MX * 1.6, y: MY + 85 },
      { x: WORLD.WIDTH + 200, y: MY + 90 },
    ]],
  },
  {
    id: 3,
    color: '#8a3030',
    segments: [[
      { x: -200, y: MY + 190 },
      { x: 0, y: MY + 185 },
      { x: MX * 0.4, y: MY + 195 },
      { x: MX * 0.8, y: MY + 180 },
      { x: MX * 1.2, y: MY + 190 },
      { x: MX * 1.6, y: MY + 185 },
      { x: WORLD.WIDTH + 200, y: MY + 190 },
    ]],
  },
  {
    id: 4,
    color: '#3060a0',
    segments: [[
      { x: -200, y: MY + 300 },
      { x: 0, y: MY + 305 },
      { x: MX * 0.4, y: MY + 295 },
      { x: MX * 0.8, y: MY + 310 },
      { x: MX * 1.2, y: MY + 300 },
      { x: MX * 1.6, y: MY + 295 },
      { x: WORLD.WIDTH + 200, y: MY + 300 },
    ]],
  },
];

export const TRAINS: readonly TrainDef[] = [
  {
    id: 0,
    trackId: 0,
    numCars: 6,
    bodyColor: '#e8e8f0',
    stripeColor: '#1868a8',
    maxSpeed: 7.5,
    acceleration: 0.021,
    deceleration: 0.024,
    direction: 1,
    initialProgress: 0.9,
    bodyW: 85,
    bodyH: 32,
    electric: true,
  },
  {
    id: 1,
    trackId: 1,
    numCars: 4,
    bodyColor: '#f0a030',
    stripeColor: '#c07020',
    maxSpeed: 2.1,
    acceleration: 0.009,
    deceleration: 0.012,
    direction: 1,
    initialProgress: 0.1,
    bodyW: 70,
    bodyH: 35,
    stopProgress: 0.55,
    stopDuration: 360,
  },
  {
    id: 2,
    trackId: 2,
    numCars: 5,
    bodyColor: '#cc3030',
    stripeColor: '#c0c0c0',
    maxSpeed: 2.7,
    acceleration: 0.012,
    deceleration: 0.015,
    direction: -1,
    initialProgress: 0.9,
    bodyW: 72,
    bodyH: 35,
    stopProgress: 0.55,
    stopDuration: 420,
  },
  {
    id: 3,
    trackId: 3,
    numCars: 5,
    bodyColor: '#f5efe0',
    stripeColor: '#8b4513',
    maxSpeed: 3.3,
    acceleration: 0.009,
    deceleration: 0.012,
    direction: 1,
    initialProgress: 0.1,
    bodyW: 75,
    bodyH: 36,
  },
  {
    id: 4,
    trackId: 4,
    numCars: 3,
    bodyColor: '#e0e8f0',
    stripeColor: '#3060a0',
    maxSpeed: 2.1,
    acceleration: 0.009,
    deceleration: 0.012,
    direction: 1,
    initialProgress: 0.5,
    bodyW: 70,
    bodyH: 35,
  },
];

export const PLATFORMS: readonly PlatformDef[] = [
  { x: MX, y: MY - 95, w: 700, h: 55, angle: 0 },
  { x: MX, y: MY + 45, w: 700, h: 55, angle: 0 },
];

export const SIGNAL_PROGRESS = 0.45;

export const PASSENGER_COLORS = [
  '#e8c8a0', '#d4a574', '#c49060', '#f0d8b8',
  '#a08060', '#f5e0c8', '#deb898', '#c8a888',
] as const;

export const PASSENGER_HAT_COLORS = [
  '#2a4a8a', '#8a2a2a', '#2a8a3a', '#8a6a2a',
  '#4a2a6a', '#6a6a6a', '#1a1a4a', '#8a4a2a',
] as const;

export const PASSENGER_SHIRT_COLORS = [
  '#4488cc', '#cc4444', '#44aa44', '#cc8844',
  '#8844cc', '#888888', '#2266aa', '#aa4488',
  '#ffffff', '#333333', '#ffcc00', '#ff6600',
] as const;

export const TRAIN_NAMES = [
  'BULLET', 'YELLOW', 'REGIONAL', 'EXPRESS', 'LOCAL',
] as const;

export const TRAIN_DESTINATIONS = [
  'AIRPORT', 'WESTEND', 'SOUTHJCT', 'CENTRAL', 'HARBOUR',
] as const;
