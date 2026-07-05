# PROJECT_STATUS

## Current State

- Project folder: `C:\Users\USER\Documents\drag_racing`
- Project name: `drag_racing`
- Current version is a local static MVP, not a real multiplayer game.
- The app can run by opening `index.html` directly, or by serving the folder with a static server.

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
- Reaction delay, acceleration, nitro, surge pulses, lane progress, finish ranking
- Moving road stripes, track markers, speed lines, exhaust trails, boost glow, and checkered finish line
- Result screen showing winner and today's drink buyer as last place

## Verification

- JavaScript syntax checked with `node --check src/app.js`.
- Static HTTP smoke test returned `200 text/html` for `index.html`.
- Browser flow tested for 2, 6, and 10 cars through Lobby, Launch, Race, and Result.
- Mobile landscape viewport `852 x 393` tested with 10 cars: race layout stayed within `100dvw x 100dvh`, vertical overflow was `0`, all HUD rows fit, and old pick-order labels were absent.
- Mid-race boost HUD state confirmed with `BOOST` visible during a 10-car race.
- Browser console error check returned no errors.
- HTML/CSS/JS are dependency-free and designed for direct browser opening.

## Known Follow-ups

- Tune race pacing after real mobile landscape testing.
- Add sound and visual countdown effects.
- Add result share image or QR-friendly result view.
- Add real multiplayer only if office usage needs multiple phones.
