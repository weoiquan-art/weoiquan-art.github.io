# JIN Studio — design and motion

## Approved direction
Warm-white editorial showcase. A realistic iridescent raven replaces J; large Bodoni Moda I and N sit behind it, with a small tracked STUDIO label. The raven is quiet, free and sharp-eyed. Its black feathers carry restrained blue, teal and violet.

Paper #f6f5f1; ink #161a18; secondary text #62675f; muted green #eaece5. Bodoni Moda is self-hosted for the wordmark, Georgia for editorial text, system sans-serif for utility copy. Fine rules and open rows organize the content.

## Assets
- Current settled Hero: assets/raven-perched.png. Two curled feet grasp a slim charcoal metal rod; tail drops behind the rod. It preserves the iridescent raven and white J, with a new lower-body stance.
- raven.css and raven.js use the same raster for registered body/head display layers, plus a small SVG eye. Pointer motion rotates only the head (up to 4.4 degrees) and moves the pupil; feet, body and perch stay fixed. Sparse blinks happen only on eligible pointer devices while the Hero is visible. Reduced motion, coarse pointers, hidden tabs and leaving the Hero stop the behavior. No permanent animation-frame loop is used.
- The entry artwork and main.js timeline remain unchanged. The new settled stance appears after the existing white wash.
- assets/raven-white-ink.png: user-selected v3 RGB original. CSS crops only the lower Jin signature, boosts brightness slightly to neutralize the near-white field, then multiplies it onto paper.
- assets/raven-night.png: generated dark plate without the J, for the intro. It is an interpreted variant, not an exactly registered pixel layer.
- The moving white stroke is native SVG with tapered geometry, bristle gaps and a small displacement texture. It approximates the reference brush; it is not an extracted raster mask.
- The rejected checkerboard generation has no alpha channel and is not used.
- Original assets/jin-raven-mark.svg remains as the small favicon and historical vector mark.

## Entrance, seconds after assets are ready
| Time | Visible event |
| --- | --- |
| 0–0.28 | The upright raven emerges alone on near-black |
| 0.30–1.02 | White ink reveals from neck to breast and leftward hook |
| 1.06–1.56 | Warm-white wash expands from the ink area |
| 1.44–2.04 | I / N, STUDIO, navigation and supporting text enter |

GSAP 3.15.0 core drives one timeline. No ScrollTrigger, scroll hijacking, infinite ticker or Lenis is needed. The existing seeded Canvas flock keeps its original bird geometry, count, depth and diagonal trajectories, now in flock.js and started by Release the ravens. It clears and stops after each run; resize, hidden tab and reduced motion stop it.

## Resilience and input
No JavaScript means a complete static site. Reduced motion skips the entrance. Image decode waits at most 1.2 seconds. A head-script safety release clears a missing main script after 4.5 seconds; the running animation has a 3-second watchdog. Keyboard, wheel, touch, Skip intro and hidden-tab events release the intro. Hash navigation skips it. Replay is explicit.

## Responsive intent
375px: compressed horizontal raven / IN composition, stacked content, direct Studio and contact navigation, touch-sized links.
768px: wider shared composition with editorial rows.
1440px: large overlapping wordmark, wide gutters and two-column section headings.
Do not use desktop overflow clipping as a substitute for fixing a mobile text wrap. Crop the signature relative to image coordinates, not the overall Hero height.

## Known limits
The artwork remains raster; no true transparent or vector logo master was produced. The intro and settled raven differ slightly in feather detail, bridged by the white wash. No field Core Web Vitals or physical-device GPU benchmarks have been collected.
