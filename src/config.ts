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
} as const;

export const WORLD = {
  WIDTH: 2400,
  HEIGHT: 1400,
} as const;

const MX = WORLD.WIDTH / 2;
const MY = WORLD.HEIGHT / 2;

export const TRACKS: readonly TrackDef[] = [
  {
    id: 0,
    color: '#8a3030',
    terminating: false,
    segments: [[
      { x: -200, y: MY - 45 },
      { x: 0, y: MY - 50 },
      { x: MX * 0.4, y: MY - 60 },
      { x: MX * 0.8, y: MY - 40 },
      { x: MX * 1.2, y: MY - 30 },
      { x: MX * 1.6, y: MY - 45 },
      { x: WORLD.WIDTH, y: MY - 35 },
      { x: WORLD.WIDTH + 200, y: MY - 30 },
    ]],
  },
  {
    id: 1,
    color: '#3060a0',
    terminating: false,
    segments: [[
      { x: -200, y: MY + 105 },
      { x: 0, y: MY + 110 },
      { x: MX * 0.4, y: MY + 100 },
      { x: MX * 0.8, y: MY + 115 },
      { x: MX * 1.2, y: MY + 105 },
      { x: MX * 1.6, y: MY + 100 },
      { x: WORLD.WIDTH, y: MY + 110 },
      { x: WORLD.WIDTH + 200, y: MY + 115 },
    ]],
  },
  {
    id: 2,
    color: '#2a7a3a',
    terminating: false,
    segments: [[
      { x: -200, y: MY + 255 },
      { x: 0, y: MY + 260 },
      { x: MX * 0.4, y: MY + 250 },
      { x: MX * 0.8, y: MY + 265 },
      { x: MX * 1.2, y: MY + 255 },
      { x: MX * 1.6, y: MY + 250 },
      { x: WORLD.WIDTH, y: MY + 260 },
      { x: WORLD.WIDTH + 200, y: MY + 255 },
    ]],
  },
  {
    id: 3,
    color: '#a06020',
    terminating: true,
    segments: [[
      { x: MX * 0.55, y: MY - 50 },
      { x: MX * 0.65, y: MY - 85 },
      { x: MX * 0.78, y: MY - 115 },
      { x: MX * 0.92, y: MY - 138 },
      { x: MX * 1.08, y: MY - 148 },
      { x: MX * 1.2, y: MY - 150 },
    ]],
  },
  {
    id: 4,
    color: '#704080',
    terminating: false,
    segments: [[
      { x: -200, y: MY + 410 },
      { x: 0, y: MY + 415 },
      { x: MX * 0.4, y: MY + 405 },
      { x: MX * 0.8, y: MY + 420 },
      { x: MX * 1.2, y: MY + 410 },
      { x: MX * 1.6, y: MY + 405 },
      { x: WORLD.WIDTH, y: MY + 415 },
      { x: WORLD.WIDTH + 200, y: MY + 410 },
    ]],
  },
  {
    id: 5,
    color: '#2080a0',
    terminating: false,
    electrified: true,
    segments: [[
      { x: -200, y: MY - 205 },
      { x: 0, y: MY - 210 },
      { x: MX * 0.4, y: MY - 220 },
      { x: MX * 0.8, y: MY - 200 },
      { x: MX * 1.2, y: MY - 215 },
      { x: MX * 1.6, y: MY - 225 },
      { x: WORLD.WIDTH, y: MY - 210 },
      { x: WORLD.WIDTH + 200, y: MY - 215 },
    ]],
  },
];

export const TRAINS: readonly TrainDef[] = [
  {
    id: 0,
    trackId: 0,
    numCars: 5,
    bodyColor: '#f5efe0',
    stripeColor: '#8b4513',
    maxSpeed: 0.8,
    acceleration: 0.002,
    deceleration: 0.003,
    direction: 1,
    initialProgress: 0.1,
    bodyW: 75,
    bodyH: 36,
  },
  {
    id: 1,
    trackId: 4,
    numCars: 8,
    bodyColor: '#2a4a2a',
    stripeColor: '#1a3a1a',
    maxSpeed: 0.3,
    acceleration: 0.001,
    deceleration: 0.002,
    direction: 1,
    initialProgress: 0.3,
    bodyW: 65,
    bodyH: 34,
  },
  {
    id: 2,
    trackId: 1,
    numCars: 3,
    bodyColor: '#e0e8f0',
    stripeColor: '#3060a0',
    maxSpeed: 0.5,
    acceleration: 0.002,
    deceleration: 0.003,
    direction: 1,
    initialProgress: 0.5,
    bodyW: 70,
    bodyH: 35,
  },
  {
    id: 3,
    trackId: 2,
    numCars: 1,
    bodyColor: '#c03030',
    stripeColor: '#801818',
    maxSpeed: 0.15,
    acceleration: 0.001,
    deceleration: 0.001,
    direction: 1,
    initialProgress: 0.7,
    bodyW: 55,
    bodyH: 32,
  },
  {
    id: 4,
    trackId: 3,
    numCars: 4,
    bodyColor: '#f0a030',
    stripeColor: '#c07020',
    maxSpeed: 0.5,
    acceleration: 0.002,
    deceleration: 0.003,
    direction: 1,
    initialProgress: 0.0,
    bodyW: 70,
    bodyH: 35,
    stopProgress: 0.78,
    stopDuration: 360,
  },
  {
    id: 5,
    trackId: 5,
    numCars: 6,
    bodyColor: '#e8e8f0',
    stripeColor: '#1868a8',
    maxSpeed: 1.2,
    acceleration: 0.004,
    deceleration: 0.005,
    direction: 1,
    initialProgress: 0.9,
    bodyW: 85,
    bodyH: 32,
    electric: true,
  },
];

export const PLATFORMS: readonly PlatformDef[] = [
  { x: MX * 1.08, y: MY - 105, w: 480, h: 58, angle: -0.08 },
];

export const SIGNAL_PROGRESS = 0.62;

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
  'EXPRESS', 'FREIGHT', 'LOCAL', 'SHUNTER', 'SPUR', 'BULLET',
] as const;

export const TRAIN_DESTINATIONS = [
  'CENTRAL', 'NORTHGATE', 'HARBOUR', 'WESTEND', 'AIRPORT', 'EASTPARK',
] as const;
