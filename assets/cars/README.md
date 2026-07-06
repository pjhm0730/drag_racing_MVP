# Car Image Assets

This folder contains the 10 WebP car images used by the static MVP.

The app reads these paths from `CAR_DEFS` in `src/app.js`:

- `car-01.webp` through `car-10.webp`

If these images are replaced later, keep the same filenames or update `CAR_DEFS`.
The canvas renderer still has dependency-free vector fallback drawings if an image fails to load.
