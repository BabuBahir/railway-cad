import type { SceneState, Point } from './types';
import { TRACKS, COLORS, ANIME, WORLD } from './config';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getCatmullRomPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

export function getTrackPoints(segment: Point[], resolution: number = 8): Point[] {
  if (segment.length < 2) return segment;
  const points: Point[] = [];
  const pts = [
    segment[0],
    ...segment,
    segment[segment.length - 1],
  ];
  for (let i = 1; i < pts.length - 2; i++) {
    for (let j = 0; j < resolution; j++) {
      const t = j / resolution;
      points.push(getCatmullRomPoint(pts[i - 1], pts[i], pts[i + 1], pts[i + 2], t));
    }
  }
  points.push(pts[pts.length - 2]);
  return points;
}

let cachedAllTrackPoints: Point[][] | null = null;

export function getAllTrackPoints(): Point[][] {
  if (cachedAllTrackPoints) return cachedAllTrackPoints;
  cachedAllTrackPoints = TRACKS.map(track => {
    const allPoints: Point[] = [];
    for (const seg of track.segments) {
      const pts = getTrackPoints(seg);
      if (allPoints.length > 0) {
        pts.shift();
      }
      allPoints.push(...pts);
    }
    return allPoints;
  });
  return cachedAllTrackPoints;
}

function getAngle(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

const cumulativeDistances: number[][] = [];
const arcLengths: number[] = [];

function buildArcLengthTable(trackId: number, points: Point[]): number[] {
  if (cumulativeDistances[trackId]) return cumulativeDistances[trackId];
  const dists: number[] = [0];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    total += Math.sqrt(dx * dx + dy * dy);
    dists.push(total);
  }
  cumulativeDistances[trackId] = dists;
  arcLengths[trackId] = total;
  return dists;
}

export function getTrackPosition(trackPoints: Point[], progress: number, trackId?: number): { x: number; y: number; angle: number } {
  const totalLen = trackPoints.length - 1;
  if (totalLen < 1) return { x: 0, y: 0, angle: 0 };

  let dists: number[];
  let totalDist: number;

  if (trackId !== undefined) {
    dists = buildArcLengthTable(trackId, trackPoints);
    totalDist = arcLengths[trackId]!;
  } else {
    const tempDists: number[] = [0];
    let t = 0;
    for (let i = 1; i < trackPoints.length; i++) {
      const dx = trackPoints[i].x - trackPoints[i - 1].x;
      const dy = trackPoints[i].y - trackPoints[i - 1].y;
      t += Math.sqrt(dx * dx + dy * dy);
      tempDists.push(t);
    }
    dists = tempDists;
    totalDist = t;
  }

  if (totalDist === 0) return { x: trackPoints[0].x, y: trackPoints[0].y, angle: 0 };

  const targetDist = Math.max(0, Math.min(1, progress)) * totalDist;

  let lo = 0;
  let hi = trackPoints.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (dists[mid] <= targetDist) lo = mid;
    else hi = mid;
  }

  const segLen = dists[hi] - dists[lo];
  const t = segLen > 0 ? (targetDist - dists[lo]) / segLen : 0;

  const p1 = trackPoints[lo];
  const p2 = trackPoints[hi];
  const x = lerp(p1.x, p2.x, t);
  const y = lerp(p1.y, p2.y, t);
  const angle = getAngle(p1, p2);
  return { x, y, angle };
}

export function getTrackLength(trackId: number): number {
  if (arcLengths[trackId] !== undefined) return arcLengths[trackId];
  const allPoints = getAllTrackPoints();
  const points = allPoints[trackId];
  if (!points || points.length < 2) return 0;
  buildArcLengthTable(trackId, points);
  return arcLengths[trackId]!;
}

let trackCanvas: HTMLCanvasElement | null = null;

function drawBallast(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (points.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y - 16);
  for (const p of points) {
    ctx.lineTo(p.x, p.y - 16);
  }
  for (let i = points.length - 1; i >= 0; i--) {
    ctx.lineTo(points[i].x, points[i].y + 16);
  }
  ctx.closePath();
  ctx.fillStyle = COLORS.BALLAST;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y - 12);
  for (const p of points) {
    ctx.lineTo(p.x, p.y - 12);
  }
  for (let i = points.length - 1; i >= 0; i--) {
    ctx.lineTo(points[i].x, points[i].y + 12);
  }
  ctx.closePath();
  ctx.fillStyle = COLORS.BALLAST_LIGHT;
  ctx.fill();
}

function drawSleepers(ctx: CanvasRenderingContext2D, points: Point[]) {
  ctx.strokeStyle = COLORS.SLEEPER;
  ctx.lineWidth = 3;
  const spacing = 12;
  let accum = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    accum += Math.sqrt(dx * dx + dy * dy);
    if (accum >= spacing) {
      accum -= spacing;
      const angle = getAngle(points[i - 1], points[i]);
      const cos = Math.cos(angle + Math.PI / 2);
      const sin = Math.sin(angle + Math.PI / 2);
      const px = points[i].x;
      const py = points[i].y;
      ctx.beginPath();
      ctx.moveTo(px - cos * 12, py - sin * 12);
      ctx.lineTo(px + cos * 12, py + sin * 12);
      ctx.stroke();
    }
  }
}

function drawRails(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (points.length < 2) return;

  for (const offset of [-4, 4]) {
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const angle = i < points.length - 1
        ? getAngle(points[i], points[i + 1])
        : getAngle(points[i - 1], points[i]);
      const cos = Math.cos(angle + Math.PI / 2);
      const sin = Math.sin(angle + Math.PI / 2);
      const x = points[i].x + cos * offset;
      const y = points[i].y + sin * offset;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = COLORS.RAIL;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.strokeStyle = COLORS.RAIL_DARK;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
}

function drawRailOutlines(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (points.length < 2) return;

  for (const offset of [-6, 6]) {
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const angle = i < points.length - 1
        ? getAngle(points[i], points[i + 1])
        : getAngle(points[i - 1], points[i]);
      const cos = Math.cos(angle + Math.PI / 2);
      const sin = Math.sin(angle + Math.PI / 2);
      const x = points[i].x + cos * offset;
      const y = points[i].y + sin * offset;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = ANIME.OUTLINE_COLOR;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
}

function drawCatenary(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (points.length < 2) return;

  const poleSpacing = 80;

  ctx.strokeStyle = COLORS.CATENARY;
  ctx.lineWidth = 1;
  ctx.setLineDash([]);

  const polePositions: { x: number; y: number; angle: number }[] = [];
  let accumForPoles = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    accumForPoles += Math.sqrt(dx * dx + dy * dy);
    if (accumForPoles >= poleSpacing) {
      accumForPoles -= poleSpacing;
      const angle = getAngle(points[i - 1], points[i]);
      polePositions.push({ x: points[i].x, y: points[i].y, angle });
    }
  }

  for (const pole of polePositions) {
    ctx.save();
    ctx.translate(pole.x, pole.y);
    ctx.rotate(pole.angle);

    ctx.fillStyle = '#6a6a6a';
    ctx.fillRect(-1.5, -30, 3, 30);
    ctx.strokeStyle = ANIME.OUTLINE_COLOR;
    ctx.lineWidth = 0.6;
    ctx.strokeRect(-1.5, -30, 3, 30);

    ctx.fillRect(-1.5, -30, 12, 2);
    ctx.strokeRect(-1.5, -30, 12, 2);

    ctx.beginPath();
    ctx.arc(10, -30, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#8a8a8a';
    ctx.fill();
    ctx.strokeStyle = ANIME.OUTLINE_COLOR;
    ctx.lineWidth = 0.6;
    ctx.stroke();

    ctx.restore();
  }

  if (polePositions.length >= 2) {
    ctx.beginPath();
    ctx.moveTo(polePositions[0].x, polePositions[0].y - 28);
    for (let i = 1; i < polePositions.length; i++) {
      const prev = polePositions[i - 1];
      const curr = polePositions[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2 + 3;
      ctx.quadraticCurveTo(prev.x, prev.y - 28, midX, midY - 28);
      ctx.quadraticCurveTo(curr.x, curr.y - 28, curr.x, curr.y - 28);
    }
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(polePositions[0].x + 10, polePositions[0].y - 30);
    for (let i = 1; i < polePositions.length; i++) {
      const prev = polePositions[i - 1];
      const curr = polePositions[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2 + 2;
      ctx.quadraticCurveTo(prev.x + 10, prev.y - 30, midX, midY - 30);
      ctx.quadraticCurveTo(curr.x + 10, curr.y - 30, curr.x + 10, curr.y - 30);
    }
    ctx.strokeStyle = '#777';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
}

function buildTrackCache(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = WORLD.WIDTH;
  c.height = WORLD.HEIGHT;
  const tctx = c.getContext('2d')!;

  const allTrackPoints = getAllTrackPoints();

  for (const points of allTrackPoints) {
    drawBallast(tctx, points);
  }
  for (const points of allTrackPoints) {
    drawSleepers(tctx, points);
  }
  for (let i = 0; i < TRACKS.length; i++) {
    drawRails(tctx, allTrackPoints[i]);
  }
  for (let i = 0; i < TRACKS.length; i++) {
    drawRailOutlines(tctx, allTrackPoints[i]);
  }
  for (let i = 0; i < TRACKS.length; i++) {
    if (TRACKS[i].electrified) {
      drawCatenary(tctx, allTrackPoints[i]);
    }
  }

  return c;
}

export function drawAllTracks(s: SceneState) {
  if (!trackCanvas) {
    trackCanvas = buildTrackCache();
  }
  s.ctx.drawImage(trackCanvas, 0, 0);
}
