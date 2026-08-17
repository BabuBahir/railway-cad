# AGENTS.md - Railway Track CAD

## Project Overview
Animated top-down view of a railway yard with 6 tracks (5 continuous, 1 terminating), multiple independent trains, and a station platform. Pure HTML5 Canvas 2D rendering. Built with TypeScript + Vite. Retro pixel aesthetic with CRT effects.

## Architecture
- `src/main.ts` - Entry point, render loop, auto-fit camera (fills width, no blank edges)
- `src/types.ts` - Shared TypeScript interfaces (SceneState, TrainState, TrackDef, Passenger, etc.)
- `src/config.ts` - Track layout geometry, train definitions with physics, platform config, passenger palettes
- `src/track.ts` - Rail rendering, sleepers, ballast, buffer stops, catenary wires for electrified tracks
- `src/trains.ts` - Physics state machine, multiple independent trains, signal system, passengers, collision safety
- `src/station.ts` - Detailed island platform: shelters, benches, clock, signs, vending machines, departure board
- `src/ground.ts` - Ballast gravel ground texture, grass edges
- `src/effects.ts` - Paper texture overlay, vignette, CRT scanlines, CRT color fringing

## Running
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npx tsc --noEmit` - Type check

## Interaction
- Camera auto-fits to viewport width, no pan/zoom
- Trains run automatically on their assigned tracks

## Track Layout (6 tracks — NO intersections)
1. **Main line** (red, continuous) - runs left-to-right, gentle S-curve
2. **Siding 1** (blue, continuous) - parallel below main line
3. **Siding 2** (green, continuous) - further below
4. **Station spur** (orange, terminating) - branches from main line upward, ends at buffer stop
5. **Freight line** (purple, continuous) - horizontal below siding 2, gentle S-curve
6. **Express line** (teal, continuous, electrified) - above main line with catenary poles + wires

All 6 tracks are horizontal with gentle curves. No tracks cross each other at any point. The spur branches from the main line via a switch (not a crossing).

## Trains
| Train | Track | Cars | Max Speed | Color | Type |
|-------|-------|------|-----------|-------|------|
| Express | Main | 5 | 0.8 px/frame | Cream/brown | Steam |
| Freight | Freight | 8 | 0.3 px/frame | Dark green | Steam |
| Local | Siding 1 | 3 | 0.5 px/frame | Blue/white | Steam |
| Shunter | Siding 2 | 1 | 0.15 px/frame | Red | Steam |
| Station | Spur | 4 | 0.5 px/frame | Orange | Steam |
| **Bullet** | Express | 6 | 1.2 px/frame | White/blue | **Electric** |

## Bullet Train (Electric)
- Streamlined nose (tapered front car, rounded tail car)
- Pantograph drawn on lead car (red triangle)
- No steam puffs (electric propulsion)
- Enhanced speed lines (longer, more visible)
- Runs on electrified track with catenary poles + overhead wires
- Faster acceleration/deceleration (0.004/0.005 vs 0.002/0.003)

## Catenary System (Electrified Track)
- Grey metal poles at regular intervals along the track
- Horizontal arm extending from each pole
- Overhead wire running between poles (slight sag curve)
- Second wire (contact wire) below the messenger wire
- Only drawn on tracks with `electrified: true` in config

## Physics & Signal Rules
- **One terminating track** (track 3 spur) has a buffer stop at its end. All other 5 tracks are continuous (trains loop).
- **Each track carries exactly one train** — zero collision risk by design.
- **Realistic acceleration/deceleration** — trains don't instant-speed. They ramp up/down smoothly:
  - Acceleration: ~0.002 px/frame² (takes ~200 frames to reach cruising)
  - Deceleration: ~0.003 px/frame² (stops within ~150 frames)
  - Bullet train: 0.004/0.005 (faster ramp)
- **Platform stop cycle** on the terminating spur:
  1. Train enters spur, decelerates approaching platform
  2. Stops at platform, signal = RED
  3. Waits 5–8 seconds (300–480 frames at 60fps)
  4. Signal turns GREEN
  5. Train accelerates, reverses back along spur to junction
  6. Re-enters spur from junction, repeats cycle
- **Cruising speeds are realistic** — steam trains max at 0.8, bullet at 1.2
- **Speed lines** only appear when train is moving (not stopped)
- **Steam puffs** scale with speed — electric trains produce none
- **Signal rendering** — post with red/green light drawn near platform on spur track
- **Collision safety** — belt-and-suspenders proximity check enforces minimum distance between trains on same track and across all tracks

## Platform & Passengers
- **Island platform** between spur track and main line (480×58px), detailed with:
  - 2 shelters with roofs and support posts
  - 10 benches (6 top edge, 4 bottom edge)
  - 2 vending machines, 2 trash bins
  - Station sign, analog clock, platform number markers
  - Yellow safety lines along both edges
- **Departure board** — LED-style display on platform showing next 3 train times, names, and destinations (blinking time indicator)
- **10 tiny passengers** spawn when spur train arrives at platform
- **Seated passengers** on benches (4–6 per spawn cycle)
- Passengers walk toward train doors, wait, then walk away when signal turns green
- Top-down rendering: colored body, head circle, hat rectangle, shadow ellipse

## Visual Effects
- **Paper texture** — subtle noise overlay for aged look
- **Vignette** — dark edges fading toward center
- **CRT scanlines** — horizontal lines simulating old CRT display
- **CRT color fringing** — subtle red/blue tint at left/right edges
- **CRT vignette** — extra darkening at edges for tube-screen effect

## No-Intersection Rule
Tracks MUST NEVER cross each other at any point. All tracks run horizontally with gentle S-curves. The spur branches from the main line via a switch (acceptable junction), but no track passes over or through another track's path. If adding new tracks, ensure they occupy unique y-bands across the full x-range.
