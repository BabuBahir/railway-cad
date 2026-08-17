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
      { x: 0, y: MY - 50 },
      { x: MX * 0.4, y: MY - 60 },
      { x: MX * 0.8, y: MY - 40 },
      { x: MX * 1.2, y: MY - 30 },
      { x: MX * 1.6, y: MY - 45 },
      { x: WORLD.WIDTH, y: MY - 35 },
    ]],
  },
  {
    id: 1,
    color: '#3060a0',
    terminating: false,
    segments: [[
      { x: 0, y: MY + 110 },
      { x: MX * 0.4, y: MY + 100 },
      { x: MX * 0.8, y: MY + 115 },
      { x: MX * 1.2, y: MY + 105 },
      { x: MX * 1.6, y: MY + 100 },
      { x: WORLD.WIDTH, y: MY + 110 },
    ]],
  },
  {
    id: 2,
    color: '#2a7a3a',
    terminating: false,
    segments: [[
      { x: 0, y: MY + 260 },
      { x: MX * 0.4, y: MY + 250 },
      { x: MX * 0.8, y: MY + 265 },
      { x: MX * 1.2, y: MY + 255 },
      { x: MX * 1.6, y: MY + 250 },
      { x: WORLD.WIDTH, y: MY + 260 },
    ]],
  },
  {
    id: 3,
    color: '#a06020',
    terminating: true,
    segments: [[
      { x: MX * 0.55, y: MY - 48 },
      { x: MX * 0.7, y: MY - 78 },
      { x: MX * 0.85, y: MY - 108 },
      { x: MX * 1.0, y: MY - 130 },
      { x: MX * 1.15, y: MY - 142 },
      { x: MX * 1.25, y: MY - 145 },
    ]],
  },
  {
    id: 4,
    color: '#704080',
    terminating: false,
    segments: [[
      { x: MX * 0.1, y: MY + 245 },
      { x: MX * 0.3, y: MY + 195 },
      { x: MX * 0.55, y: MY + 135 },
      { x: MX * 0.8, y: MY + 85 },
      { x: MX * 1.1, y: MY + 45 },
      { x: MX * 1.4, y: MY + 15 },
      { x: MX * 1.7, y: MY },
      { x: WORLD.WIDTH, y: MY - 10 },
    ]],
  },
  {
    id: 5,
    color: '#3080a0',
    terminating: false,
    segments: [[
      { x: 0, y: MY - 210 },
      { x: MX * 0.4, y: MY - 220 },
      { x: MX * 0.8, y: MY - 200 },
      { x: MX * 1.2, y: MY - 215 },
      { x: MX * 1.6, y: MY - 225 },
      { x: WORLD.WIDTH, y: MY - 210 },
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
    numCars: 5,
    bodyColor: '#f0f0f0',
    stripeColor: '#c02020',
    maxSpeed: 0.7,
    acceleration: 0.002,
    deceleration: 0.003,
    direction: 1,
    initialProgress: 0.9,
    bodyW: 72,
    bodyH: 36,
  },
];

export const PLATFORMS: readonly PlatformDef[] = [
  { x: MX * 1.08, y: MY - 120, w: 160, h: 30, angle: -0.1 },
];

export const SIGNAL_PROGRESS = 0.62;
