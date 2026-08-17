import type { SceneState, TrainState, Passenger } from './types';
import { TRAINS, ANIME, SIGNAL_PROGRESS, PLATFORMS, PASSENGER_COLORS, PASSENGER_HAT_COLORS, PASSENGER_SHIRT_COLORS } from './config';
import { getAllTrackPoints, getTrackPosition, getTrackLength } from './track';

const trainStates: TrainState[] = [];
let trainsInit = false;

const passengers: Passenger[] = [];
const SPUR_TRAIN_ID = 4;
const PASSENGER_COUNT = 10;
const PASSENGER_SPEED = 0.4;

function initTrains() {
  if (trainsInit) return;
  trainsInit = true;
  const allTrackPoints = getAllTrackPoints();
  for (const def of TRAINS) {
    const trackPoints = allTrackPoints[def.trackId];
    if (!trackPoints) continue;
    const startPos = getTrackPosition(trackPoints, def.initialProgress);
    const isTerminating = def.stopProgress !== undefined;

    trainStates.push({
      def,
      x: startPos.x,
      y: startPos.y,
      angle: startPos.angle,
      progress: def.initialProgress,
      currentSpeed: isTerminating ? 0 : def.maxSpeed,
      phase: isTerminating ? 'approaching' : 'cruising',
      stopTimer: 0,
      signal: 'green',
      activeTrackId: def.trackId,
      activeDirection: def.direction,
      steamPuffs: [],
      speedLines: [],
    });
  }
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawBulletCarTopDown(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  angle: number,
  w: number,
  h: number,
  bodyColor: string,
  stripeColor: string,
  isLead: boolean,
  isTail: boolean,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath();
  if (isLead) {
    ctx.moveTo(-w / 2, -h / 2);
    ctx.lineTo(w / 2 - 8, -h / 2);
    ctx.quadraticCurveTo(w / 2 + 10, -h / 2 + 2, w / 2 + 14, 0);
    ctx.quadraticCurveTo(w / 2 + 10, h / 2 - 2, w / 2 - 8, h / 2);
    ctx.lineTo(-w / 2, h / 2);
    ctx.closePath();
  } else if (isTail) {
    ctx.moveTo(-w / 2, -h / 2);
    ctx.lineTo(w / 2, -h / 2);
    ctx.lineTo(w / 2, h / 2);
    ctx.lineTo(-w / 2, h / 2);
    ctx.quadraticCurveTo(-w / 2 - 10, h / 2 - 2, -w / 2 - 14, 0);
    ctx.quadraticCurveTo(-w / 2 - 10, -h / 2 + 2, -w / 2, -h / 2);
    ctx.closePath();
  } else {
    ctx.rect(-w / 2, -h / 2, w, h);
  }
  ctx.fill();

  const bodyGrad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  bodyGrad.addColorStop(0, bodyColor);
  bodyGrad.addColorStop(1, shadeColor(bodyColor, -20));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  if (isLead) {
    ctx.moveTo(-w / 2, -h / 2);
    ctx.lineTo(w / 2 - 8, -h / 2);
    ctx.quadraticCurveTo(w / 2 + 10, -h / 2 + 2, w / 2 + 14, 0);
    ctx.quadraticCurveTo(w / 2 + 10, h / 2 - 2, w / 2 - 8, h / 2);
    ctx.lineTo(-w / 2, h / 2);
    ctx.closePath();
  } else if (isTail) {
    ctx.moveTo(-w / 2, -h / 2);
    ctx.lineTo(w / 2, -h / 2);
    ctx.lineTo(w / 2, h / 2);
    ctx.lineTo(-w / 2, h / 2);
    ctx.quadraticCurveTo(-w / 2 - 10, h / 2 - 2, -w / 2 - 14, 0);
    ctx.quadraticCurveTo(-w / 2 - 10, -h / 2 + 2, -w / 2, -h / 2);
    ctx.closePath();
  } else {
    ctx.rect(-w / 2, -h / 2, w, h);
  }
  ctx.fill();

  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = ANIME.OUTLINE_WIDTH;
  ctx.beginPath();
  if (isLead) {
    ctx.moveTo(-w / 2, -h / 2);
    ctx.lineTo(w / 2 - 8, -h / 2);
    ctx.quadraticCurveTo(w / 2 + 10, -h / 2 + 2, w / 2 + 14, 0);
    ctx.quadraticCurveTo(w / 2 + 10, h / 2 - 2, w / 2 - 8, h / 2);
    ctx.lineTo(-w / 2, h / 2);
    ctx.closePath();
  } else if (isTail) {
    ctx.moveTo(-w / 2, -h / 2);
    ctx.lineTo(w / 2, -h / 2);
    ctx.lineTo(w / 2, h / 2);
    ctx.lineTo(-w / 2, h / 2);
    ctx.quadraticCurveTo(-w / 2 - 10, h / 2 - 2, -w / 2 - 14, 0);
    ctx.quadraticCurveTo(-w / 2 - 10, -h / 2 + 2, -w / 2, -h / 2);
    ctx.closePath();
  } else {
    ctx.rect(-w / 2, -h / 2, w, h);
  }
  ctx.stroke();

  ctx.fillStyle = stripeColor;
  const stripeStart = isLead ? -w / 2 : -w / 2;
  const stripeEnd = isLead ? w / 2 - 8 : isTail ? w / 2 : w / 2;
  ctx.fillRect(stripeStart + 3, -h / 2 + 2, stripeEnd - stripeStart - 6, 3);

  const numWin = Math.floor(w / 12);
  const winW = 6;
  const winH = h * 0.28;
  const winSpacing = (w - 16) / (numWin + 1);
  for (let i = 1; i <= numWin; i++) {
    const wx = -w / 2 + 8 + winSpacing * i - winW / 2;
    ctx.fillStyle = '#2a2a30';
    ctx.fillRect(wx - 1, -winH / 2 - 1, winW + 2, winH + 2);
    const glassGrad = ctx.createLinearGradient(wx, -winH / 2, wx, winH / 2);
    glassGrad.addColorStop(0, '#6ab8d8');
    glassGrad.addColorStop(0.5, '#88c8e0');
    glassGrad.addColorStop(1, '#cceeff');
    ctx.fillStyle = glassGrad;
    ctx.fillRect(wx, -winH / 2, winW, winH);
  }

  ctx.fillStyle = '#444';
  roundedRect(ctx, -w / 2, -h / 2 - 2, w, 3, 1);
  ctx.fill();
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 0.8;
  roundedRect(ctx, -w / 2, -h / 2 - 2, w, 3, 1);
  ctx.stroke();

  if (isLead) {
    ctx.fillStyle = '#ffee88';
    ctx.beginPath();
    ctx.arc(w / 2 + 14, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = ANIME.OUTLINE_COLOR;
    ctx.lineWidth = 1;
    ctx.stroke();

    const hlGlow = ctx.createRadialGradient(w / 2 + 14, 0, 0, w / 2 + 14, 0, 18);
    hlGlow.addColorStop(0, 'rgba(255, 240, 150, 0.4)');
    hlGlow.addColorStop(1, 'rgba(255, 240, 150, 0)');
    ctx.fillStyle = hlGlow;
    ctx.beginPath();
    ctx.arc(w / 2 + 14, 0, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#cc2020';
    ctx.beginPath();
    ctx.moveTo(2, -h / 2 - 6);
    ctx.lineTo(8, -h / 2 - 6);
    ctx.lineTo(10, -h / 2 - 12);
    ctx.lineTo(0, -h / 2 - 12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = ANIME.OUTLINE_COLOR;
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }

  ctx.restore();
}

function drawCarTopDown(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  angle: number,
  w: number,
  h: number,
  bodyColor: string,
  stripeColor: string,
  isLead: boolean,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  roundedRect(ctx, -w / 2 + 3, -h / 2 + 3, w, h, 3);
  ctx.fill();

  const bodyGrad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  bodyGrad.addColorStop(0, bodyColor);
  bodyGrad.addColorStop(1, shadeColor(bodyColor, -20));
  ctx.fillStyle = bodyGrad;
  roundedRect(ctx, -w / 2, -h / 2, w, h, 3);
  ctx.fill();

  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = ANIME.OUTLINE_WIDTH;
  roundedRect(ctx, -w / 2, -h / 2, w, h, 3);
  ctx.stroke();

  ctx.fillStyle = stripeColor;
  ctx.fillRect(-w / 2 + 3, -1.5, w - 6, 3);

  const numWin = Math.floor(w / 14);
  const winW = 7;
  const winH = h * 0.32;
  const winSpacing = (w - 14) / (numWin + 1);
  for (let i = 1; i <= numWin; i++) {
    const wx = -w / 2 + 6 + winSpacing * i - winW / 2;
    ctx.fillStyle = '#3a3530';
    ctx.fillRect(wx - 1, -winH / 2 - 1, winW + 2, winH + 2);
    const glassGrad = ctx.createLinearGradient(wx, -winH / 2, wx, winH / 2);
    glassGrad.addColorStop(0, '#8ec8d8');
    glassGrad.addColorStop(0.5, '#a8d8e0');
    glassGrad.addColorStop(1, '#ddeeff');
    ctx.fillStyle = glassGrad;
    ctx.fillRect(wx, -winH / 2, winW, winH);
  }

  ctx.fillStyle = '#555';
  roundedRect(ctx, -w / 2, -h / 2 - 2, w, 3, 1);
  ctx.fill();
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 0.8;
  roundedRect(ctx, -w / 2, -h / 2 - 2, w, 3, 1);
  ctx.stroke();

  if (isLead) {
    ctx.fillStyle = '#ffee88';
    ctx.beginPath();
    ctx.arc(w / 2 + 3, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = ANIME.OUTLINE_COLOR;
    ctx.lineWidth = 1;
    ctx.stroke();

    const hlGlow = ctx.createRadialGradient(w / 2 + 3, 0, 0, w / 2 + 3, 0, 15);
    hlGlow.addColorStop(0, 'rgba(255, 240, 150, 0.4)');
    hlGlow.addColorStop(1, 'rgba(255, 240, 150, 0)');
    ctx.fillStyle = hlGlow;
    ctx.beginPath();
    ctx.arc(w / 2 + 3, 0, 15, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function shadeColor(color: string, percent: number) {
  const num = parseInt(color.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + percent));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + percent));
  const b = Math.max(0, Math.min(255, (num & 0xff) + percent));
  return `rgb(${r},${g},${b})`;
}

function spawnPassengers(train: TrainState) {
  const plat = PLATFORMS[0];
  if (!plat) return;

  const allTrackPoints = getAllTrackPoints();
  const trackPoints = allTrackPoints[train.activeTrackId];
  if (!trackPoints) return;

  const cosA = Math.cos(plat.angle);
  const sinA = Math.sin(plat.angle);

  for (let i = 0; i < PASSENGER_COUNT; i++) {
    const offsetAlongPlatform = (Math.random() - 0.5) * (plat.w - 40);

    const startX = plat.x + cosA * offsetAlongPlatform - sinA * (plat.h / 2 + 8 + Math.random() * 12);
    const startY = plat.y + sinA * offsetAlongPlatform + cosA * (plat.h / 2 + 8 + Math.random() * 12);

    const targetX = plat.x + cosA * offsetAlongPlatform - sinA * (plat.h / 2 + 3);
    const targetY = plat.y + sinA * offsetAlongPlatform + cosA * (plat.h / 2 + 3);

    passengers.push({
      x: startX,
      y: startY,
      targetX,
      targetY,
      speed: PASSENGER_SPEED * (0.7 + Math.random() * 0.6),
      color: PASSENGER_SHIRT_COLORS[Math.floor(Math.random() * PASSENGER_SHIRT_COLORS.length)],
      hatColor: PASSENGER_HAT_COLORS[Math.floor(Math.random() * PASSENGER_HAT_COLORS.length)],
      state: 'walking_to_train',
    });
  }

  const seatedCount = 4 + Math.floor(Math.random() * 3);
  for (let i = 0; i < seatedCount; i++) {
    const benchX = plat.x + cosA * (-plat.w / 2 + 40 + i * (plat.w - 80) / (seatedCount))
      - sinA * (-plat.h / 2 + 8);
    const benchY = plat.y + sinA * (-plat.w / 2 + 40 + i * (plat.w - 80) / (seatedCount))
      + cosA * (-plat.h / 2 + 8);

    passengers.push({
      x: benchX,
      y: benchY,
      targetX: benchX,
      targetY: benchY,
      speed: 0,
      color: PASSENGER_SHIRT_COLORS[Math.floor(Math.random() * PASSENGER_SHIRT_COLORS.length)],
      hatColor: PASSENGER_HAT_COLORS[Math.floor(Math.random() * PASSENGER_HAT_COLORS.length)],
      state: 'waiting',
      seated: true,
    });
  }
}

function dismissPassengers() {
  const plat = PLATFORMS[0];
  if (!plat) return;

  const cosA = Math.cos(plat.angle);
  const sinA = Math.sin(plat.angle);

  for (const p of passengers) {
    if (p.state === 'waiting' || p.state === 'walking_to_train') {
      const offsetAcross = (Math.random() - 0.3) * (plat.h - 16);
      p.targetX = plat.x + cosA * ((p.x - plat.x) * cosA + (p.y - plat.y) * sinA) - sinA * offsetAcross;
      p.targetY = plat.y + sinA * ((p.x - plat.x) * cosA + (p.y - plat.y) * sinA) + cosA * offsetAcross;
      p.state = 'walking_away';
      p.seated = false;
    }
  }
}

function updatePassengers() {
  for (let i = passengers.length - 1; i >= 0; i--) {
    const p = passengers[i];
    if (p.seated) continue;
    const dx = p.targetX - p.x;
    const dy = p.targetY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 1.5) {
      if (p.state === 'walking_to_train') {
        p.state = 'waiting';
      } else if (p.state === 'walking_away') {
        p.state = 'done';
      }
    } else {
      p.x += (dx / dist) * p.speed;
      p.y += (dy / dist) * p.speed;
    }

    if (p.state === 'done') {
      passengers.splice(i, 1);
    }
  }
}

function drawPassengers(ctx: CanvasRenderingContext2D) {
  for (const p of passengers) {
    ctx.save();
    ctx.translate(p.x, p.y);

    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.ellipse(1, 3, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    if (p.seated) {
      ctx.fillStyle = p.color;
      ctx.fillRect(-2.5, -1, 5, 5);

      ctx.fillStyle = p.hatColor;
      ctx.beginPath();
      ctx.arc(0, -3, 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = p.hatColor;
      ctx.fillRect(-2.8, -5, 5.6, 2);
    } else {
      ctx.fillStyle = p.color;
      ctx.fillRect(-2.5, -2, 5, 7);

      const skinTone = PASSENGER_COLORS[Math.floor(p.x * 7 % PASSENGER_COLORS.length)];
      ctx.fillStyle = skinTone;
      ctx.beginPath();
      ctx.arc(0, -4, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = p.hatColor;
      ctx.fillRect(-3, -6, 6, 2);
    }

    ctx.restore();
  }
}

function updateTrainPhysics(train: TrainState) {
  const def = train.def;
  const trackLen = getTrackLength(train.activeTrackId);

  switch (train.phase) {
    case 'cruising': {
      train.currentSpeed = def.maxSpeed;
      train.progress += (train.currentSpeed * train.activeDirection) / trackLen;
      if (train.progress > 1) train.progress -= 1;
      if (train.progress < 0) train.progress += 1;
      break;
    }

    case 'approaching': {
      const distToStop = def.stopProgress! - train.progress;

      if (distToStop <= 0.002) {
        train.progress = def.stopProgress!;
        train.currentSpeed = 0;
        train.phase = 'stopped';
        train.signal = 'red';
        train.stopTimer = def.stopDuration!;
        if (train.def.id === SPUR_TRAIN_ID) {
          spawnPassengers(train);
        }
        break;
      }

      const brakingDist = (train.currentSpeed * train.currentSpeed) / (2 * def.deceleration) / trackLen;

      if (brakingDist >= distToStop) {
        train.currentSpeed = Math.max(0, train.currentSpeed - def.deceleration);
        if (train.currentSpeed <= 0) {
          train.progress = def.stopProgress!;
          train.phase = 'stopped';
          train.signal = 'red';
          train.stopTimer = def.stopDuration!;
          if (train.def.id === SPUR_TRAIN_ID) {
            spawnPassengers(train);
          }
          break;
        }
        train.phase = 'stopping';
      } else {
        train.currentSpeed = Math.min(def.maxSpeed, train.currentSpeed + def.acceleration);
      }

      train.progress += (train.currentSpeed * train.activeDirection) / trackLen;
      break;
    }

    case 'stopping': {
      train.currentSpeed = Math.max(0, train.currentSpeed - def.deceleration);
      if (train.currentSpeed <= 0) {
        train.progress = def.stopProgress!;
        train.currentSpeed = 0;
        train.phase = 'stopped';
        train.signal = 'red';
        train.stopTimer = def.stopDuration!;
        if (train.def.id === SPUR_TRAIN_ID) {
          spawnPassengers(train);
        }
        break;
      }
      train.progress += (train.currentSpeed * train.activeDirection) / trackLen;
      if (train.progress >= def.stopProgress!) {
        train.progress = def.stopProgress!;
        train.currentSpeed = 0;
        train.phase = 'stopped';
        train.signal = 'red';
        train.stopTimer = def.stopDuration!;
        if (train.def.id === SPUR_TRAIN_ID) {
          spawnPassengers(train);
        }
      }
      break;
    }

    case 'stopped': {
      train.stopTimer--;
      if (train.stopTimer <= 0) {
        train.signal = 'green';
        train.phase = 'departing';
        train.activeDirection = (def.direction === 1 ? -1 : 1) as 1 | -1;
        if (train.def.id === SPUR_TRAIN_ID) {
          dismissPassengers();
        }
      }
      break;
    }

    case 'departing': {
      train.currentSpeed = Math.min(def.maxSpeed, train.currentSpeed + def.acceleration);
      train.progress += (train.currentSpeed * train.activeDirection) / trackLen;

      if (train.progress <= 0) {
        train.progress = 0;
        train.currentSpeed = 0;
        train.phase = 'approaching';
        train.activeDirection = def.direction;
      }
      break;
    }
  }

  const allTrackPoints = getAllTrackPoints();
  const trackPoints = allTrackPoints[train.activeTrackId];
  if (trackPoints) {
    const clampedProgress = Math.max(0, Math.min(1, train.progress));
    const pos = getTrackPosition(trackPoints, clampedProgress);
    train.x = pos.x;
    train.y = pos.y;
    train.angle = pos.angle;
  }
}

function enforceCollisionSafety() {
  const trackTrains: Map<number, TrainState[]> = new Map();
  for (const t of trainStates) {
    const list = trackTrains.get(t.activeTrackId) || [];
    list.push(t);
    trackTrains.set(t.activeTrackId, list);
  }

  for (const [, trains] of trackTrains) {
    if (trains.length < 2) continue;
    for (let i = 0; i < trains.length; i++) {
      for (let j = i + 1; j < trains.length; j++) {
        const a = trains[i];
        const b = trains[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = (a.def.bodyW + b.def.bodyW) * 0.6;
        if (dist < minDist) {
          if (a.progress > b.progress) {
            a.currentSpeed = Math.min(a.currentSpeed, b.currentSpeed);
          } else {
            b.currentSpeed = Math.min(b.currentSpeed, a.currentSpeed);
          }
        }
      }
    }
  }

  for (let i = 0; i < trainStates.length; i++) {
    for (let j = i + 1; j < trainStates.length; j++) {
      const a = trainStates[i];
      const b = trainStates[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = (a.def.bodyW + b.def.bodyW) * 0.55;
      if (dist < minDist) {
        if (a.currentSpeed > b.currentSpeed) {
          a.currentSpeed = b.currentSpeed * 0.9;
        } else if (b.currentSpeed > a.currentSpeed) {
          b.currentSpeed = a.currentSpeed * 0.9;
        }
      }
    }
  }
}

function updateSteam(s: SceneState, train: TrainState) {
  if (train.def.electric) return;
  const { ctx } = s;

  if (train.currentSpeed > 0.1) {
    const interval = Math.max(4, Math.floor(6 / train.currentSpeed));
    if (s.time % interval === 0) {
      train.steamPuffs.push({
        x: train.x + (Math.random() - 0.5) * 6,
        y: train.y + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.2 - Math.random() * 0.15,
        size: 3 + Math.random() * 4,
        life: 0,
        maxLife: 60 + Math.random() * 40,
      });
    }
  }

  for (let i = train.steamPuffs.length - 1; i >= 0; i--) {
    const p = train.steamPuffs[i];
    p.x += p.vx;
    p.y += p.vy;
    p.size += 0.1;
    p.life++;
    if (p.life > p.maxLife) { train.steamPuffs.splice(i, 1); continue; }
    const lifeRatio = p.life / p.maxLife;
    const alpha = Math.sin(lifeRatio * Math.PI) * 0.25;
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    grad.addColorStop(0, `rgba(200, 200, 210, ${alpha})`);
    grad.addColorStop(1, 'rgba(180, 180, 190, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function updateSpeedLines(train: TrainState) {
  const dir = train.activeDirection;
  const speedMult = train.def.electric ? 1.5 : 1;

  if (train.currentSpeed > 0.2) {
    const maxLines = Math.floor(train.currentSpeed * 8 * speedMult);
    while (train.speedLines.length < maxLines) {
      train.speedLines.push({
        x: train.x - dir * 10 - (Math.random() - 0.5) * 20,
        y: train.y - 8 + Math.random() * 16,
        len: 8 + Math.random() * 18,
        alpha: 0.2 + Math.random() * 0.15,
      });
    }
  }

  for (let i = train.speedLines.length - 1; i >= 0; i--) {
    const line = train.speedLines[i];
    line.x -= dir * train.currentSpeed * 0.8;
    line.alpha -= 0.008;
    if (line.alpha <= 0) {
      train.speedLines.splice(i, 1);
    }
  }
}

function drawSignal(ctx: CanvasRenderingContext2D, x: number, y: number, color: 'red' | 'green') {
  ctx.save();

  ctx.fillStyle = '#444';
  ctx.fillRect(x - 1.5, y - 38, 3, 38);

  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(x, y - 42, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = ANIME.OUTLINE_COLOR;
  ctx.lineWidth = 1;
  ctx.stroke();

  const lightColor = color === 'red' ? '#ff2020' : '#20ff20';
  ctx.fillStyle = lightColor;
  ctx.beginPath();
  ctx.arc(x, y - 42, 5, 0, Math.PI * 2);
  ctx.fill();

  const glow = ctx.createRadialGradient(x, y - 42, 0, x, y - 42, 18);
  if (color === 'red') {
    glow.addColorStop(0, 'rgba(255, 30, 30, 0.35)');
    glow.addColorStop(1, 'rgba(255, 30, 30, 0)');
  } else {
    glow.addColorStop(0, 'rgba(30, 255, 30, 0.35)');
    glow.addColorStop(1, 'rgba(30, 255, 30, 0)');
  }
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y - 42, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawTrains(s: SceneState) {
  initTrains();
  const allTrackPoints = getAllTrackPoints();
  const { ctx } = s;

  for (const train of trainStates) {
    updateTrainPhysics(train);
  }

  enforceCollisionSafety();

  const spurTrain = trainStates.find(t => t.def.stopProgress !== undefined);
  if (spurTrain) {
    const spurPoints = allTrackPoints[spurTrain.activeTrackId];
    if (spurPoints) {
      const sigPos = getTrackPosition(spurPoints, SIGNAL_PROGRESS);
      drawSignal(ctx, sigPos.x, sigPos.y - 18, spurTrain.signal);
    }
  }

  for (const train of trainStates) {
    const isElectric = train.def.electric;

    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    for (let i = 0; i < train.def.numCars; i++) {
      const carIdx = train.activeDirection === 1 ? i : train.def.numCars - 1 - i;
      const carX = train.x - carIdx * (train.def.bodyW + 10) * Math.cos(train.angle) * train.activeDirection;
      const carY = train.y - carIdx * (train.def.bodyW + 10) * Math.sin(train.angle) * train.activeDirection;
      ctx.beginPath();
      ctx.ellipse(carX + 3, carY + 3, train.def.bodyW / 2, train.def.bodyH / 2, train.angle, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < train.def.numCars; i++) {
      const carIdx = train.activeDirection === 1 ? i : train.def.numCars - 1 - i;
      const carX = train.x - carIdx * (train.def.bodyW + 10) * Math.cos(train.angle) * train.activeDirection;
      const carY = train.y - carIdx * (train.def.bodyW + 10) * Math.sin(train.angle) * train.activeDirection;

      if (isElectric) {
        const isLead = i === 0;
        const isTail = i === train.def.numCars - 1;
        const drawLead = train.activeDirection === 1 ? isLead : isTail;
        const drawTail = train.activeDirection === 1 ? isTail : isLead;
        drawBulletCarTopDown(ctx, carX, carY, train.angle, train.def.bodyW, train.def.bodyH, train.def.bodyColor, train.def.stripeColor, drawLead, drawTail);
      } else {
        drawCarTopDown(ctx, carX, carY, train.angle, train.def.bodyW, train.def.bodyH, train.def.bodyColor, train.def.stripeColor, i === 0);
      }
    }

    updateSteam(s, train);

    if (train.currentSpeed > 0.2) {
      const lineAlpha = isElectric ? 0.12 : 0.15;
      ctx.strokeStyle = `rgba(80, 60, 40, ${lineAlpha})`;
      ctx.lineWidth = 1.5;
      for (const line of train.speedLines) {
        ctx.globalAlpha = line.alpha;
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x - Math.cos(train.angle) * line.len, line.y - Math.sin(train.angle) * line.len);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    updateSpeedLines(train);
  }

  updatePassengers();
  drawPassengers(ctx);
}
