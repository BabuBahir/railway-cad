# AGENTS.md - Railway Track CAD

## Project Overview
Animated top-down view of a railway yard with 6 tracks (5 continuous, 1 terminating), multiple independent trains, and a station platform. Pure HTML5 Canvas 2D rendering. Built with TypeScript + Vite.

## Architecture
- `src/main.ts` - Entry point, render loop, auto-fit camera
- `src/types.ts` - Shared TypeScript interfaces (SceneState, TrainState, TrackDef, etc.)
- `src/config.ts` - Track layout geometry, train definitions with physics, color palette
- `src/track.ts` - Rail rendering, sleepers, ballast, buffer stops, Catmull-Rom interpolation
- `src/trains.ts` - Physics state machine, multiple independent trains, signal system
- `src/station.ts` - Station platform, shelter, signs
- `src/ground.ts` - Ballast gravel ground texture, grass edges
- `src/effects.ts` - Paper texture overlay, vignette

## Running
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npx tsc --noEmit` - Type check

## Interaction
- Camera auto-fits to viewport, no pan/zoom
- Trains run automatically on their assigned tracks

## Track Layout (6 tracks)
1. **Main line** (red, continuous) - runs left-to-right, gentle S-curve
2. **Siding 1** (blue, continuous) - parallel below main line
3. **Siding 2** (green, continuous) - further below
4. **Station spur** (orange, terminating) - branches from main line upward, ends at buffer stop
5. **Cross track** (purple, continuous) - diagonal from bottom-left to top-right
6. **Express line** (teal, continuous) - above main line

## Trains
| Train | Track | Cars | Max Speed | Color |
|-------|-------|------|-----------|-------|
| Express | Main | 5 | 0.8 px/frame | Cream/brown |
| Freight | Cross | 8 | 0.3 px/frame | Dark green |
| Local | Siding 1 | 3 | 0.5 px/frame | Blue/white |
| Shunter | Siding 2 | 1 | 0.15 px/frame | Red |
| Station | Spur | 4 | 0.5 px/frame | Orange |
| Express 2 | Express | 5 | 0.7 px/frame | White/red |

## Physics & Signal Rules
- **One terminating track** (track 3 spur) has a buffer stop at its end. All other 5 tracks are continuous (trains loop).
- **Each track carries exactly one train** — zero collision risk by design.
- **Realistic acceleration/deceleration** — trains don't instant-speed. They ramp up/down smoothly:
  - Acceleration: ~0.002 px/frame² (takes ~200 frames to reach cruising)
  - Deceleration: ~0.003 px/frame² (stops within ~150 frames)
- **Platform stop cycle** on the terminating spur:
  1. Train enters spur, decelerates approaching platform
  2. Stops at platform, signal = RED
  3. Waits 5–8 seconds (300–480 frames at 60fps)
  4. Signal turns GREEN
  5. Train accelerates, reverses back along spur to junction
  6. Re-enters spur from junction, repeats cycle
- **Cruising speeds are realistic** — no train exceeds 0.8 px/frame
- **Speed lines** only appear when train is moving (not stopped)
- **Steam puffs** scale with speed — faster = more puffs, stopped = none
- **Signal rendering** — post with red/green light drawn near platform on spur track
