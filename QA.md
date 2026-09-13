# JIN Studio verification — 2026-09-06

## Unreleased connected-worlds review — 2026-09-13

- Local previews at 375, 768 and 1440px show the new Worlds and Selected work sections without horizontal overflow. Mobile navigation shows Worlds and Contact; wider navigation also shows Work and Practice.
- The Hero link reaches `#worlds`; JIN with Phoebe points to `https://www.instagram.com/jin082714/`. Practice rows no longer imply a link.
- No browser warnings or errors were observed in these previews. JavaScript syntax, local asset references and `git diff --check` passed.
- Instagram resolved the new handle but showed an age-restricted sign-in screen to a logged-out viewer. Public visibility of that account needs JIN's review.
- This is local review only; the production GitHub Pages site has not been changed or visually rechecked.

## Local checks
- Perched-raven update: inspected desktop and 375px mobile composition with toes wrapping over the rod and claws below. Mouse moved to opposite sides; head rotation and pupil translation changed in the expected direction while body transform stayed none. Leaving the Hero cleared the head transform. Local coarse/reduced-motion fixtures stayed still; missing GSAP rendered the original full image. Normal preview console had no errors. main.js and flock.js are byte-for-byte unchanged by this update.
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

