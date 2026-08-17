export interface SceneState {
  W: number;
  H: number;
  time: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  camera: Camera;
}

export interface Camera {
  zoom: number;
  offsetX: number;
  offsetY: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface TrackDef {
  id: number;
  color: string;
  segments: Point[][];
  electrified?: boolean;
}

export interface TrainDef {
  id: number;
  trackId: number;
  numCars: number;
  bodyColor: string;
  stripeColor: string;
  maxSpeed: number;
  acceleration: number;
  deceleration: number;
  direction: 1 | -1;
  initialProgress: number;
  bodyW: number;
  bodyH: number;
  stopProgress?: number;
  stopDuration?: number;
  electric?: boolean;
}

export interface TrainState {
  def: TrainDef;
  x: number;
  y: number;
  angle: number;
  progress: number;
  currentSpeed: number;
  phase: 'cruising' | 'slowing' | 'stopped';
  stopTimer: number;
  signal: 'red' | 'green';
  activeTrackId: number;
  activeDirection: 1 | -1;
  steamPuffs: SteamPuff[];
  speedLines: SpeedLine[];
  sparks: Spark[];
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

export interface SpeedLine {
  x: number;
  y: number;
  len: number;
  alpha: number;
}

export interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export interface PlatformDef {
  x: number;
  y: number;
  w: number;
  h: number;
  angle: number;
}

export interface Passenger {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  color: string;
  hatColor: string;
  state: 'walking_to_train' | 'waiting' | 'walking_away' | 'done';
  seated?: boolean;
}
