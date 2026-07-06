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

- Fixed Lobby car photo fitting so all 10 real vehicle images render fully inside the compact card preview area without cropping or aspect-ratio distortion.
- Kept the mobile landscape Lobby at a stable `5 x 2` card grid while tuning preview padding, image max-height, and `object-fit: contain`.
- Strengthened normal boost visuals with longer rear flames, clearer orange speed streaks, stronger glow, more dust particles, and higher-contrast `BOOST!` labels.
- Strengthened super boost visuals with screen shake, larger aura, longer cyan/yellow trails, stronger flame glow, and distinct `SUPER BOOST!` / `COMEBACK BOOST!` labels.
- Improved the drag strip background with extra asphalt speckles, rubber/skid marks, road-edge markers, grass markers, guardrails, START, and checkered FINISH detail.
- Added finish-state handling so finished cars stop speed, wheel-spin, vibration, and boost state instead of continuing to shake or slide.
- Added finish-line feedback with `FINISH!`, rank badges, checkered flash blocks, and short yellow flash effects while the rest of the race continues.
- Retuned race pacing after the stronger effects so browser-tested races still finish around the 8-10 second target range.
- Made the mobile landscape Lobby fit 10 car cards in a fixed `5 x 2` compact grid inside `100dvh`.
- Restored wheel/touch vertical scrolling for the landscape Lobby when browser UI or small device height reduces the available viewport.
- Removed the landscape body overflow lock and kept overflow hidden scoped to the Race screen, so Lobby can receive wheel/touch scroll.
- Changed compact Lobby grid rows to keep a real minimum row height, which creates scrollable overflow instead of clipping card contents on very short landscape screens.
- Reduced compact Lobby card height, spacing, badges, preview artwork, and fixed vehicle-name labels for landscape use.
- Added 10 user-provided real car photo assets as `assets/cars/car-01.webp` through `assets/cars/car-10.webp`.
- Cropped the provided source screenshots to vehicle-focused transparent WebP assets for Lobby cards and Race canvas rendering.
- Updated `CAR_DEFS` to manage each car's `id`, real model name, image path, and accent color.
- Changed Lobby behavior so all 10 cars are always visible; the 2/4/6/8/10 control now limits the maximum selected race cars.
- Added max-selection locking so unselected cars show `마감` after the chosen limit is reached, while selected cars can still be deselected.
- Fixed selected-car tracking to compute from all 10 cars, so non-contiguous choices such as `#1`, `#2`, `#3`, and `#5` correctly carry into Launch and Race.
- Removed the Race screen right-side dashboard/progress list/status panel; Race now renders as a canvas-first full-screen view.
- Converted the Race header to a small overlay so the canvas can occupy essentially the full viewport.
- Reduced race car render size by roughly 15-25% and scaled exhaust/boost trails with lane height.
- Race canvas now draws the loaded WebP car photos first and keeps dependency-free vector drawings as image-load fallback.
- Added `flipInRace` vehicle metadata and a `drawCarImage(..., flipX)` canvas helper so Race-only car photos face the right-side FINISH direction.
- Re-audited all `assets/cars/car-01.webp` through `assets/cars/car-10.webp` for Race direction; Car #4 Sorento now uses `flipInRace: false`, while the other race photos keep `flipInRace: true`.
- Adjusted boost/exhaust origin to the left rear of the right-facing car image.
- Aligned Race car number badges toward the front/right side of the right-facing car sprites.
- Replaced the dark abstract Race background with a 2D asphalt drag strip: road texture, white lane dividers, guardrails, grass edges, START line, and checkered FINISH line.
- Added speed-based vehicle motion effects: small vertical vibration, fore/aft shake, wheel spin arc lines, road dust particles, and rear motion streaks.
- Retuned race pacing so cars accelerate visibly within the first 1-2 seconds after GO and typical race results land around 8-10 seconds.
- Added event-style race variance with launch quality, mid-race surge, short boost burst, and brief slowdown/recovery windows for more overtaking chances.
- Removed Lobby nickname inputs, per-card random buttons, and the top name-reroll button; car cards now show fixed real vehicle names from `CAR_DEFS`.
- Unified Launch, Race, and Result display names around real vehicle names only, with `#1` style numbers kept as compact badges.
- Added the super boost system: each race picks 1 car 70% of the time or 2 cars 30% of the time.
- Added `early` super boost and `late` comeback boost events with stronger speed advantage, glow, flame/trail, motion streaks, and `SUPER BOOST!` / `COMEBACK BOOST!` canvas labels.
- Updated Race, Launch, and Result labels to prioritize actual vehicle names such as `싼타페`, `그랜저`, and `맥라렌 720S` instead of `Car #1` / `1번 자동차` style names.
- Simplified the visible numbering system so users see compact fixed car numbers: `#1` through `#10`.
- Kept `selectedOrder` only as internal selection tracking for lane assignment; pick order is no longer shown in Lobby, Launch, Canvas, or Result.
- Reworded UI labels away from pick-order language and toward fixed vehicle names plus compact `#5` style badges.
- Reworked the Race screen for mobile landscape with a compact `100dvw x 100dvh` layout.
- Made the race canvas resize to the stage size and device pixel ratio instead of relying on a fixed CSS canvas size.
- Tuned lane height and canvas layout so 2 to 10 cars fit in landscape view.
- Added moving road grid, road stripes, track markers, speed lines, exhaust trails, stronger boost glow, `BOOST!` canvas label, surge pulses, improved car rendering, headlights, tires, shadows, and a checkered finish line.
- Confirmed the last-place car remains the drink buyer.
- This status file tracks updates through the fixed vehicle-name Lobby and super boost race system; changes are committed and pushed to GitHub on `main`.

## Implemented

- Home, Lobby, Launch, Race, Result screen flow
- Local mock lobby for 2 to 10 players
- Player card click/touch selection and deselection
- Single visible car number badge system using fixed `#1` through `#10`
- Selection tracking is internal only; the UI does not show pick order
- Lobby always shows all 10 car cards
- Maximum selected race cars can be set to 2, 4, 6, 8, or 10
- Selection limit lock state for unselected cars after max selection is reached
- Stable car identity colors based on fixed car number
- Fixed real vehicle names from `CAR_DEFS`; no nickname editing or random-name generation
- Responsive drag race canvas with 2 to 10 lanes
- Compact mobile landscape race layout for 100dvw x 100dvh
- Mobile landscape Lobby layout that fits 10 compact car cards as 5 columns x 2 rows
- Mobile landscape Lobby grid can scroll by wheel/touch when the viewport is shorter than the fully fitted layout
- Canvas-only Race screen without the previous right-side dashboard
- Real car photo asset system managed by `CAR_DEFS`
- Race-only car image flipping with `flipInRace`
- Lobby photo previews with SVG fallback
- Race canvas car photo rendering with vector fallback
- Asphalt road-style Race background with guardrails, grass, lane dividers, START, and checkered FINISH
- Actual vehicle model names displayed in Launch, Race lane labels, and Result
- `assets/cars/car-01.webp` through `assets/cars/car-10.webp`
- Reaction delay, acceleration, nitro, surge pulses, lane progress, finish ranking
- Moving road stripes, track markers, speed lines, exhaust trails, boost glow, road dust, motion streaks, wheel spin arcs, and checkered finish line
- Stronger normal boost rendering with visible flame, dust, speed streaks, glow, and `BOOST!` canvas label
- Distinct super boost rendering with screen shake, aura, long trails, stronger glow, and early/comeback labels
- Finish-line effects that stop finished racer motion and show `FINISH!`, rank badge, flash, and checkered blocks
- Race variance events: launch quality, mid-race surge, short burst, slowdown/recovery, and 1-2 super boost cars per race
- Super boost racer state fields: `superBoostType`, `superBoostStart`, `superBoostEnd`, `superBoostMultiplier`, and `isSuperBoosting`
- Result screen showing winner and today's drink buyer as last place

## Verification

- JavaScript syntax checked with `node --check src/app.js`.
- Latest JavaScript syntax check passed after Lobby image-fit, boost, finish, and background polish.
- `git diff --check` passed with only expected CRLF working-copy warnings.
- Browser verification completed through the in-app browser at mobile landscape `852 x 393`.
- Browser Lobby check at `852 x 393` confirmed 10 cards render as `5 x 2`, all 10 `.car-photo` images are complete, every image stays within its preview box, vertical overflow is `0`, and nickname/random controls remain absent.
- Browser Race checks for 2, 4, 6, and 10 selected cars reached Result successfully with the correct ranking row count and drink-buyer display.
- Browser timing retest at `852 x 393`: 2-car race finished from `8.14s` to `8.54s`, 4-car race from `8.31s` to `9.10s`, 6-car race from `8.08s` to `9.34s`, and 10-car race from `8.03s` to `10.07s`.
- Browser canvas checks confirmed normal `BOOST!` labels, stronger orange rear flames/streaks, visible super boost aura/trails/labels, and finish-line `FINISH!` rank flashes.
- Browser Race canvas checks confirmed `852 x 393` canvas size, Race vertical overflow `0`, no right-side dashboard, and no console errors.
- Latest JavaScript syntax check passed after fixed vehicle-name Lobby and super boost changes.
- Local VM smoke test confirmed Lobby HTML no longer contains `<input>`, `data-player-name`, `data-reroll`, or `random-all`, and that car cards render the fixed `.car-name` element.
- Local VM smoke test confirmed selected racers no longer carry a user-editable `name` field.
- Local VM tests for 2, 6, and 10 selected cars confirmed each race creates 1-2 super boost cars and includes the requested super boost state fields.
- Local race-loop simulation for 2, 6, and 10 selected cars produced finishes around the 8-10 second target range, with some tail results slightly above 10 seconds depending on variance.
- Browser verification is now available and was completed against `http://127.0.0.1:5174/index.html`.
- Static HTTP smoke test returned `200 text/html` for `index.html`.
- Browser flow tested for 2, 4, 6, and 10 cars through Lobby, Launch, Race, and Result.
- Browser Race checks retested for 2 selected cars, 5 selected cars, and 10 selected cars at mobile landscape `852 x 393`.
- Race visual check confirmed car photos face right toward FINISH and remain centered inside their lanes.
- Race direction recheck confirmed Car #4 Sorento faces right toward FINISH after changing its Race-only `flipInRace` value.
- Boost visual check confirmed flame/trail renders from the left rear of the right-facing car.
- Final mobile landscape `852 x 393` Race visual check confirmed 10 cars fit inside the canvas with no vertical overflow.
- Final mobile visual check confirmed the car number badge stays aligned with the right-facing sprites.
- Browser timing retest at `852 x 393`: 4-car race finished from `8.43s` to `9.11s`, 6-car race from `8.01s` to `9.59s`, and 10-car race from `8.03s` to `9.84s`.
- Browser visual retest confirmed boost flame, dust particles, and motion streaks render behind the cars on the left side.
- Browser checks confirmed Launch labels no longer show old `Car #` / `1번 자동차` style names.
- Mobile landscape viewport `852 x 393` tested with 10 cars: Lobby cards fit as 5 columns x 2 rows, all 10 car images loaded, and vertical overflow was `0`.
- Max-select test at `852 x 393`: with max set to 4, selected `#1`, `#2`, `#3`, and `#5`; unselected cars locked, `#6` click was blocked, and Launch showed exactly 4 selected cars.
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

- Add sound and visual countdown effects.
- Add result share image or QR-friendly result view.
- Add real multiplayer only if office usage needs multiple phones.
