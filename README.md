# Drag Racing Drink Bet

Office-friendly drag racing drink bet game prototype.

## Run

Open `index.html` directly in a browser, or serve the folder with any static server.

```powershell
python -m http.server 5173
```

Then open `http://127.0.0.1:5173/`.

## Current Scope

- Home, lobby, launch, race, and result screens
- 2 to 10 local players
- Player cards selected by click or touch
- Fixed visible car numbers: `Car #1` through `Car #10`
- Internal pick tracking without showing pick order to players
- Stable car identity colors by car number
- Responsive canvas-based drag racing track
- Simulated reaction, acceleration, nitro, surge pulses, finish times, ranking
- Mobile landscape race layout and boosted speed effects
- Last-place drink buyer result

## Next Work

- Tune race feel on real mobile landscape devices
- Add sound effects and countdown audio
- Add share/export result image
- Add multiplayer or host-controlled mode if needed
