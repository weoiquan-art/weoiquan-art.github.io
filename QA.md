# JIN Studio verification — 2026-09-06

## Local checks
- JavaScript syntax: node --check main.js and flock.js passed.
- git diff --check passed.
- Browser visual inspection at actual 375, 768 and 1440px widths: no horizontal document overflow. Fixed mobile I/N wrapping and original raster signature escaping its crop before release.
- Desktop and mobile Hero inspected; mobile contact navigation and desktop Skip intro exercised. Skip returns focus to Replay ink when the skip button had focus.
- Flock replay starts the original Canvas drawing and returns to hidden after completion. The frame loop stops.
- Local-only QA fixtures verified missing GSAP, missing image, no scripts and missing main.js. All return a readable page; missing main.js releases via the 4.5-second head watchdog.
- Reduced-motion logic verified using a local-only matchMedia stub: no intro and no motion controls. This was not an operating-system preference override.
- Timeline inspection at 0.98 seconds: white J nearly complete and site still hidden. Normal playback reaches the static page after approximately 2.04 seconds, excluding bounded asset loading.
- No warnings or errors observed in the normal preview console.
- Assets use local URLs; existing contact destinations and certificate files retained.

## Limits
- No physical-device performance benchmark or field Core Web Vitals collected.
- The static logo remains RGB raster, not an alpha/vector master. Intro brush is a native SVG interpretation; dark and white plates are not pixel-identical.
- Production visual browser access is restricted by the environment's saved policy. Release verification uses the exact GitHub Pages workflow and live HTTP content/assets separately from local browser QA.
- QA fixtures remain in the local work directory and are not shipped.
