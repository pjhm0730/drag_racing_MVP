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
- Restored wheel/touch vertical scrolling for the landscape Lobby when browser UI or small device height reduces the available viewport.
- Removed the landscape body overflow lock and kept overflow hidden scoped to the Race screen, so Lobby can receive wheel/touch scroll.
- Changed compact Lobby grid rows to keep a real minimum row height, which creates scrollable overflow instead of clipping card contents on very short landscape screens.
- Reduced compact Lobby card height, spacing, badges, preview artwork, nickname inputs, and buttons for landscape use.
- Added 10 user-provided real car photo assets as `assets/cars/car-01.webp` through `assets/cars/car-10.webp`.
- Cropped the provided source screenshots to vehicle-focused transparent WebP assets for Lobby cards and Race canvas rendering.
- Updated `CAR_DEFS` to manage each car's `id`, real model name, image path, and accent color.
- Changed Lobby behavior so all 10 cars are always visible; the 2/4/6/8/10 control now limits the maximum selected race cars.
- Added max-selection locking so unselected cars show `마감` after the chosen limit is reached, while selected cars can still be deselected.
- Fixed selected-car tracking to compute from all 10 cars, so non-contiguous choices such as Car #1, #2, #3, and #5 correctly carry into Launch and Race.
- Removed the Race screen right-side dashboard/progress list/status panel; Race now renders as a canvas-first full-screen view.
- Converted the Race header to a small overlay so the canvas can occupy essentially the full viewport.
- Reduced race car render size by roughly 15-25% and scaled exhaust/boost trails with lane height.
- Race canvas now draws the loaded WebP car photos first and keeps dependency-free vector drawings as image-load fallback.
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
- Lobby always shows all 10 car cards
- Maximum selected race cars can be set to 2, 4, 6, 8, or 10
- Selection limit lock state for unselected cars after max selection is reached
- Stable car identity colors based on fixed car number
- Nickname editing and per-player/random-all nickname generation
- Responsive drag race canvas with 2 to 10 lanes
- Compact mobile landscape race layout for 100dvw x 100dvh
- Mobile landscape Lobby layout that fits 10 compact car cards as 5 columns x 2 rows
- Mobile landscape Lobby grid can scroll by wheel/touch when the viewport is shorter than the fully fitted layout
- Canvas-only Race screen without the previous right-side dashboard
- Real car photo asset system managed by `CAR_DEFS`
- Lobby photo previews with SVG fallback
- Race canvas car photo rendering with vector fallback
- `assets/cars/car-01.webp` through `assets/cars/car-10.webp`
- Reaction delay, acceleration, nitro, surge pulses, lane progress, finish ranking
- Moving road stripes, track markers, speed lines, exhaust trails, boost glow, and checkered finish line
- Result screen showing winner and today's drink buyer as last place

## Verification

- JavaScript syntax checked with `node --check src/app.js`.
- Static HTTP smoke test returned `200 text/html` for `index.html`.
- Browser flow tested for 2, 4, 6, and 10 cars through Lobby, Launch, Race, and Result.
- Mobile landscape viewport `852 x 393` tested with 10 cars: Lobby cards fit as 5 columns x 2 rows, all 10 car images loaded, and vertical overflow was `0`.
- Max-select test at `852 x 393`: with max set to 4, selected Car #1, #2, #3, and #5; unselected cars locked, Car #6 click was blocked, and Launch showed exactly 4 selected cars.
- Short mobile landscape viewport `852 x 320` tested with 10 cars: Lobby remained 5 columns x 2 rows and player-grid wheel scroll moved from `scrollTop 0` to `scrollTop 58`.
- Mobile landscape viewport `852 x 393` tested for Race: canvas occupied the full viewport area, right dashboard DOM was absent, and vertical overflow was `0`.
- Race visual check confirmed selected car photos render on canvas during countdown.
- Result flow retested with 4 selected cars: Result screen showed 4 ranking rows and today's drink buyer.
- Boost rendering path remains implemented through canvas trail, glow, pulse, and `BOOST!` label effects.
- Repo asset scan found 10 committed WebP car assets under `assets/cars/`.
- UI scan and browser checks found no visible pick-order text such as `선택 순서`, `1번 선택`, or `그리드`.
- Browser console error check returned no errors.
- HTML/CSS/JS are dependency-free and designed for direct browser opening.

## Known Follow-ups

- Tune race pacing after real mobile landscape testing.
- Add sound and visual countdown effects.
- Add result share image or QR-friendly result view.
- Add real multiplayer only if office usage needs multiple phones.
