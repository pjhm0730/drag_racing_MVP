# PROJECT_STATUS

## Current State

- Project folder: `C:\Users\USER\Documents\drag_racing`
- Project name: `drag_racing`
- GitHub repository: `https://github.com/pjhm0730/drag_racing_MVP`
- Current branch: `main`
- Latest pushed commit: see the GitHub `main` branch history.
- Current version is a local static MVP, not a real multiplayer game.
- The app can run by opening `index.html` directly, or by serving the folder with a static server.

## Latest Update - 2026-07-06

- Made the mobile landscape Lobby fit 10 car cards in a fixed `5 x 2` compact grid inside `100dvh`.
- Reduced compact Lobby card height, spacing, badges, preview artwork, nickname inputs, and buttons for landscape use.
- Removed the Race screen right-side dashboard/progress list/status panel; Race now renders as a canvas-first full-screen view.
- Converted the Race header to a small overlay so the canvas can occupy essentially the full viewport.
- Reduced race car render size by roughly 15-25% and scaled exhaust/boost trails with lane height.
- Added `CAR_DEFS` as the single configuration point for 10 generic car shapes and labels.
- Added distinct dependency-free vehicle drawings for SUV, Sedan, Large Sedan, Compact SUV, Compact, Sports Sedan, Luxury Sedan, Coupe, Boxy SUV, and Hatchback.
- Reused the same car definitions for Lobby SVG previews and Race canvas rendering.
- Verified no real brand marks or downloaded vehicle images were added.
- Simplified the visible numbering system so users only see fixed car numbers: `Car #1` through `Car #10`.
- Kept `selectedOrder` only as internal selection tracking for lane assignment; pick order is no longer shown in Lobby, Launch, Canvas, or Result.
- Reworded UI labels away from pick-order language and toward car identity language such as `Car #5` and `5번 자동차`.
- Reworked the Race screen for mobile landscape with a compact `100dvw x 100dvh` layout.
- Made the race canvas resize to the stage size and device pixel ratio instead of relying on a fixed CSS canvas size.
- Tuned lane height and canvas layout so 2 to 10 cars fit in landscape view.
- Added moving road grid, road stripes, track markers, speed lines, exhaust trails, stronger boost glow, `BOOST!` canvas label, surge pulses, improved car rendering, headlights, tires, shadows, and a checkered finish line.
- Confirmed the last-place car remains the drink buyer.
- Changes were committed and pushed to GitHub on `main`.

## Implemented

- Home, Lobby, Launch, Race, Result screen flow
- Local mock lobby for 2 to 10 players
- Player card click/touch selection and deselection
- Single visible car number system using fixed `Car #1` through `Car #10`
- Selection tracking is internal only; the UI does not show pick order
- Stable car identity colors based on fixed car number
- Nickname editing and per-player/random-all nickname generation
- Responsive drag race canvas with 2 to 10 lanes
- Compact mobile landscape race layout for 100dvw x 100dvh
- Mobile landscape Lobby layout that fits 10 compact car cards as 5 columns x 2 rows
- Canvas-only Race screen without the previous right-side dashboard
- Generic car type system managed by `CAR_DEFS`
- Distinct SVG Lobby previews and canvas race shapes per car type
- Reaction delay, acceleration, nitro, surge pulses, lane progress, finish ranking
- Moving road stripes, track markers, speed lines, exhaust trails, boost glow, and checkered finish line
- Result screen showing winner and today's drink buyer as last place

## Verification

- JavaScript syntax checked with `node --check src/app.js`.
- Static HTTP smoke test returned `200 text/html` for `index.html`.
- Browser flow tested for 2, 4, 6, and 10 cars through Lobby, Launch, Race, and Result.
- Mobile landscape viewport `852 x 393` tested with 10 cars: Lobby cards fit as 5 columns x 2 rows, all cards stayed inside the viewport, and vertical overflow was `0`.
- Mobile landscape viewport `852 x 393` tested for Race: canvas occupied the full viewport area, right dashboard DOM was absent, and vertical overflow was `0`.
- Boost rendering path remains implemented through canvas trail, glow, pulse, and `BOOST!` label effects.
- Repo scan found no brand names, brand-mark files, or downloaded image assets for cars.
- Browser console error check returned no errors.
- HTML/CSS/JS are dependency-free and designed for direct browser opening.

## Known Follow-ups

- Tune race pacing after real mobile landscape testing.
- Add sound and visual countdown effects.
- Add result share image or QR-friendly result view.
- Add real multiplayer only if office usage needs multiple phones.
