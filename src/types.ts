export interface SceneState {
  W: number;
  H: number;
  time: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

export interface Cloud {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  opacity: number;
}

export interface Building {
  x: number;
  w: number;
  h: number;
  roofH: number;
  type: 'house' | 'minka' | 'pagoda' | 'torii' | 'barn';
  color: string;
  roofColor: string;
}

export interface GrassBlade {
  x: number;
  h: number;
  lean: number;
  phase: number;
  color: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  type: 'dust' | 'firefly' | 'seed';
}

export interface SteamPuff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
}

export interface Butterfly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  color: string;
  size: number;
}

export interface RicePaddy {
  x: number;
  y: number;
  w: number;
  h: number;
  stalks: { dx: number; h: number; phase: number }[];
}

export interface TreeData {
  x: number;
  scale: number;
  isHero?: boolean;
}
