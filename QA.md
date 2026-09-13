# JIN Studio verification — 2026-09-06

## Unreleased portfolio-world review — 2026-09-13

- Local previews at 375×812, 768×900 and 1440×1000 show Portfolio and the capability line on entry with no positive horizontal overflow.
- Both transparent Sera assets load at all three widths. Chibi Sera and homeworld Sera remain visible as one right-side pair behind the JIN lettering; replay finishes with the intended static opacity and no console warnings or errors.
- At 375px the complete Hero ends at 645px after hash navigation, leaving the world transition visible in the first viewport. The normal root entry also shows the header, Portfolio, capabilities, primary message and CTA after the approved intro finishes.
- World sections stack at 768px and below; at 1440px they use two columns and measure about one viewport high. The Q-version and adult Sera sections remain visually distinct.
- The Hero link reaches `#worlds`; JIN with Phoebe and the contact social link point to `https://www.instagram.com/jin082714/`; the Google card points to the existing certificate PDF.
- No browser warnings or errors were observed. JavaScript syntax, local asset references and `git diff --check` passed.
- The two film areas are tested pending states. Actual video playback, crop, poster and file weight must be checked after JIN supplies the approved films.
- This is a draft-branch review; the production GitHub Pages site has not been changed.

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
