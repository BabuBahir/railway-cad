# AGENTS.md - Railway Track CAD

## Project Overview
Animated top-down view of a railway yard with 5 tracks, multiple independent trains, a merged central station with common departure board, coastal promenade with coconut trees and sea. Pure HTML5 Canvas 2D rendering. Built with TypeScript + Vite. Retro pixel aesthetic with CRT effects.

## Architecture
- `src/main.ts` - Entry point, render loop, auto-fit camera (fills width, no blank edges)
- `src/types.ts` - Shared TypeScript interfaces (SceneState, TrainState, TrackDef, Passenger, etc.)
- `src/config.ts` - Track layout geometry, train definitions with physics, platform config, coastal config
- `src/track.ts` - Rail rendering, sleepers, ballast, catenary wires for electrified tracks, arc-length parameterized positioning
- `src/trains.ts` - Physics state machine, multiple independent trains, signal system, passengers, collision safety, pantograph sparks
- `src/station.ts` - Merged station with common departure board, shelters, benches, clocks, vending machines
- `src/ground.ts` - Ballast gravel texture, grass edges, coastal area (sea, beach, coconut trees, benches), yard boundary fence
- `src/effects.ts` - Paper texture overlay, vignette, CRT scanlines, CRT color fringing

## Running
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npx tsc --noEmit` - Type check

## Interaction
- Camera auto-fits to viewport width, no pan/zoom
- Trains run automatically on their assigned tracks

## Track Layout (5 tracks — ALL continuous, NO intersections)
| ID | Name | Color | y position | Electrified |
|----|------|-------|------------|-------------|
| 0 | Express | Teal | MY-280 (420) | Yes |
| 1 | Yellow | Orange | MY-140 (560) | No |
| 2 | Regional | Blue | MY+90 (790) | No |
| 3 | Main | Red | MY+190 (890) | No |
| 4 | Siding 1 | Blue | MY+300 (1000) | No |

All tracks run left-to-right with gentle S-curves. No tracks cross. All tracks are continuous (trains loop).

## Yard Boundary
- Dashed fence line at MY+380 (1080) separating railway yard from coastal promenade
- Metal posts at 60px intervals

## Coastal Area
- Grass transition zone above sandy beach
- Sandy beach with noise texture
- Blue sea with animated wave lines
- Coconut trees spaced along the beach
- Public benches on the sand

## Central Station (Merged)
- Located at x=MX, between tracks 1 (top) and 2 (bottom)
- **Platform 1** (arrival): y=MY-95 (605), serves track 1 (yellow train)
- **Platform 2** (departure): y=MY+45 (745), serves track 2 (regional train)
- Unified station building between platforms with windows, roof, entrance door
- Common departure/arrival board showing all 5 trains with TIME, TRAIN, DEST, PLT columns
- Station name sign: "CENTRAL STATION"
- Each platform has: 2 shelters, 10 benches, vending machines, trash bins, clocks, yellow safety lines

## Trains
| Train | Track | Cars | Max Speed | Color | Type | Stops? | Direction |
|-------|-------|------|-----------|-------|------|--------|-----------|
| Bullet | 0 (Express) | 6 | 1.8 | White/blue | Electric | No | Right |
| Yellow | 1 (Yellow) | 4 | 0.5 | Orange | Steam | Yes (Platform 1) | Right |
| Regional | 2 (Regional) | 5 | 0.7 | Red/silver | Steam | Yes (Platform 2) | Left |
| Express | 3 (Main) | 5 | 0.8 | Cream/brown | Steam | No | Right |
| Local | 4 (Siding 1) | 3 | 0.5 | Blue/white | Steam | No | Right |

## Bullet Train (Electric)
- Streamlined nose (tapered front car, rounded tail car)
- Diamond-frame pantograph on lead car with contact shoe at wire height
- Short random sparks at pantograph contact point (not continuous)
- No steam puffs (electric propulsion)
- Enhanced speed lines (longer, more visible)
- Runs on electrified track 0 with catenary poles + wires
- Faster acceleration/deceleration (0.005/0.006)

## Regional Train (Right to Left)
- 5-car red/silver steam train
- Runs from right to left (direction: -1)
- Stops at Platform 2 (departure platform) on track 2

## Catenary System (Electrified Track 0)
- Grey metal poles at regular intervals along the track
- Horizontal arm extending from each pole
- Overhead wire running between poles (slight sag curve)
- Second wire (contact wire) below the messenger wire

## Physics & Signal Rules
- **All 5 tracks are continuous** — trains loop around, no buffer stops
- **Each track carries exactly one train** — zero collision risk by design
- **Arc-length parameterized movement** — precomputed cumulative distance table with binary search for uniform speed + uniform car spacing
- **Realistic acceleration/deceleration**:
  - Acceleration: ~0.002 px/frame²
  - Deceleration: ~0.003 px/frame²
  - Bullet train: 0.005/0.006
- **Platform stop cycle** (tracks 1 and 2):
  1. Train cruises, approaches stopProgress
  2. Decelerates smoothly to stop at platform
  3. Signal = RED, passengers spawn
  4. Waits 6–7 seconds (360–420 frames at 60fps)
  5. Signal turns GREEN, passengers dismiss
  6. Train accelerates back to cruising, continues in same direction
- **Cruising speeds** — steam trains max at 0.8, bullet at 1.8
- **Speed lines** only appear when train is moving (not stopped)
- **Steam puffs** scale with speed — electric trains produce none
- **Signal rendering** — post with red/green light drawn near stop point
- **Collision safety** — proximity check enforces minimum distance between trains on same track and across all tracks

## Platform & Passengers
- **Two side platforms** at merged central station (each 700×55px):
  - Platform 1 (arrival, top): serves yellow train on track 1
  - Platform 2 (departure, bottom): serves regional train on track 2
- Each platform has: 2 shelters, 10 benches, vending machines, trash bins, clocks
- **Common departure board** — single LED-style display showing all train departures
- **10 tiny passengers** spawn when a stopping train arrives at platform
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
Tracks MUST NEVER cross each other at any point. All tracks run horizontally with gentle S-curves in unique y-bands across the full x-range. No branching, no switches, no junctions.
