# AGENTS.md - Ghibli Village Project

## Project Overview
2D Canvas animated scene of a Japanese countryside village with a train passing through at sunset. Rendered entirely with HTML5 Canvas 2D API. Built with TypeScript + Vite.

## Architecture
- `src/main.ts` - Entry point, render loop, canvas setup
- `src/config.ts` - Color palette, layout ratios, constants
- `src/types.ts` - Shared TypeScript interfaces
- `src/sky.ts` - Sky gradient, sun, clouds, birds
- `src/landscape.ts` - Rolling hills, rice paddies, ground, paths
- `src/village.ts` - Thatched-roof farmhouses, stone walls, utility poles
- `src/train.ts` - Country line train, tracks, steam effects
- `src/nature.ts` - Trees (hero camphor + others), bamboo, grass, flowers, fireflies, butterflies
- `src/effects.ts` - Vignette, sun rays, heat haze

## Current Goals

### 1. More Anime/Manga Style
Push the visual style further toward anime/manga aesthetics:
- Add **ink-like outlines** around buildings, trees, and train (thicker outer strokes, thinner inner detail lines)
- Use **cel-shading** style color blocks instead of smooth gradients where possible (hard shadow edges on buildings and trees)
- Add **speed lines** or motion blur on the train
- Use **halftone-style dot patterns** for distant shadows or shading
- Make clouds more stylized with bold rounded shapes (Ghibli cloud style)
- Add **komorebi** (light filtering through leaves) on the hero tree
- Consider adding a **paper texture overlay** to give a hand-drawn feel
- Use more **saturated, vibrant colors** typical of anime palettes

### 2. Camera Perspective Change: Ground Level -> Bird's Eye
Shift from the current ground-level view to a **bird's eye / elevated perspective**:
- Raise the horizon line significantly (currently at ~52%, move to ~35-40%)
- Show more ground area - rice paddies, village rooftops, garden plots
- Buildings should show **roof-first perspective** (more roof visible, less wall)
- The train track should curve through the scene rather than go straight across
- Add more depth layers: foreground treetops, middle village, background mountains
- Consider adding a winding river or stream through the village
- Rice paddies should appear as **rectangular water-filled plots** from above
- Show the village layout more clearly - paths between houses, garden plots, etc.
- The train should be seen from slightly above, showing the top of carriages
- Foreground elements should be treetops/branches framing the scene from above

## Running
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npx tsc --noEmit` - Type check
