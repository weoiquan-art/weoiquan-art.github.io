# JIN Studio — design and motion

## Current draft direction · 2026-09-24

JIN approved rebuilding the **homepage** around [Viscose Carousel](https://github.com/Yousuf-developer/Viscose-carousel). A sparse warm-white stage holds a large circular path whose center sits beyond the left edge. One landscape card faces the visitor; neighboring cards remain partly visible above and below, joined by soft colored seams. Left and right metadata track the active chapter, and a six-item vertical index marks its place. The ring moves from a centered opening circle to its off-screen resting position once; card hover swells the front and dims its neighbors. Chapter changes rotate and settle around the arc.

This site uses JIN's real artwork, writing, film and locally vendored GSAP. Its lightweight Canvas 2D cards and connectors are an original approximation of the reference's behavior; the reference uses a WebGL shader and physical elastic effects. No reference images, commercial font, source code or shader are imported. The site stays static for GitHub Pages.

## Information and art

| Chapter | World | Visual and honest state |
| --- | --- | --- |
| JIN with Phoebe | Q | Supplied chibi Sera illustration; the picture shows only Sera |
| Three small hellos | Q | Typographic pending state for the Phoebe, Nuonuo and chibi Sera welcome film |
| Social stories | Q | Chibi Sera artwork and the real Instagram destination |
| Sera | Adult | Supplied adult character art |
| The greeting | Adult | Actual adult Sera film poster in the card and full 9:16 film in the panel |
| Worldbuilding | Adult | Adult character art; an ongoing direction, not a claimed delivered film |

The white stage, dark green Sera cards and warm peach Q cards separate the two worlds. Georgia supplies the editorial headings; system sans-serif supplies navigation. The raven survives as a small existing favicon, while the previous large raven entrance is superseded by this approved direction.

## Interaction and fallback

- Scroll wheel, vertical or horizontal drag, six index buttons, previous/next controls and arrow keys select chapters. Clicking the centered card or its visible action opens the respective native `dialog`; Escape and Close dismiss it.
- The Sera panel contains the actual 720×1280 greeting, fitted entirely with `object-fit: contain`. The dark blurred poster fills the side space, keeping her face, wave and the water channel visible. Playback is muted, loops inline while the panel is visible, supports a pause button, and pauses when closed or offscreen. The first and last poses have a visible motion reset.
- Reduced motion skips the ring entrance and rotations and keeps the Sera poster instead of autoplay. Without JavaScript or Canvas support, a two-world page stays readable with real links and an accurate Q-film pending state.
- Canvas draws only on input, image load, resize or a short GSAP transition; no permanent animation-frame loop. Device pixel ratio is capped at 1.5, card images decode asynchronously, and the video has `preload="none"` until the Sera panel is viewed.

## Responsive intent and review gate

Desktop uses the centered landscape card with metadata at each side and the chapter index on the right. Tablet narrows the metadata while keeping the ring. At 375px, metadata drops below the card and the chapter index shifts above it. The Sera panel stacks text and the uncropped portrait film on narrow screens. These are implemented rules; browser visual checks at exact 375px and 768px remain to be completed before release. The old `worlds-concept.html` is retained as an earlier independent study, not the release candidate.
