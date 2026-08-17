import type { SceneState, Point } from './types';
import { TRACKS, COLORS, ANIME } from './config';

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

export function getAllTrackPoints(): Point[][] {
  return TRACKS.map(track => {
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
}

function getAngle(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

export function getTrackPosition(trackPoints: Point[], progress: number): { x: number; y: number; angle: number } {
  const totalLen = trackPoints.length - 1;
  const idx = Math.max(0, Math.min(totalLen - 1, progress * totalLen));
  const i = Math.floor(idx);
  const t = idx - i;
  const p1 = trackPoints[i];
  const p2 = trackPoints[Math.min(i + 1, totalLen)];
  const x = lerp(p1.x, p2.x, t);
  const y = lerp(p1.y, p2.y, t);
  const angle = getAngle(p1, p2);
  return { x, y, angle };
}

const trackLengths: number[] = [];

export function getTrackLength(trackId: number): number {
  if (trackLengths[trackId] !== undefined) return trackLengths[trackId];
  const allPoints = getAllTrackPoints();
  const points = allPoints[trackId];
  if (!points || points.length < 2) return 0;
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    len += Math.sqrt(dx * dx + dy * dy);
  }
  trackLengths[trackId] = len;
  return len;
}

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

function drawSwitchIndicator(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = '#c03030';
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#ff4040';
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBufferStop(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (points.length < 2) return;
  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  const angle = Math.atan2(last.y - prev.y, last.x - prev.x);

  ctx.save();
  ctx.translate(last.x, last.y);
  ctx.rotate(angle);

  ctx.fillStyle = '#4a4a4a';
  ctx.fillRect(-3, -16, 6, 32);
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-3, -16, 6, 32);

  ctx.fillStyle = '#333';
  ctx.fillRect(-9, -13, 18, 26);
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-9, -13, 18, 26);

  ctx.fillStyle = '#555';
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

export function drawAllTracks(s: SceneState) {
  const allTrackPoints = getAllTrackPoints();

  for (const points of allTrackPoints) {
    drawBallast(s.ctx, points);
  }
  for (const points of allTrackPoints) {
    drawSleepers(s.ctx, points);
  }
  for (const points of allTrackPoints) {
    drawRails(s.ctx, points);
  }
  for (const points of allTrackPoints) {
    drawRailOutlines(s.ctx, points);
  }

  for (let i = 0; i < TRACKS.length; i++) {
    if (TRACKS[i].terminating) {
      drawBufferStop(s.ctx, allTrackPoints[i]);
    }
  }

  const switchPositions = [
    { x: 660, y: 652, angle: -0.15 },
  ];
  for (const sw of switchPositions) {
    drawSwitchIndicator(s.ctx, sw.x, sw.y, sw.angle);
  }
}
