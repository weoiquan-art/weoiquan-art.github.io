# Deployment — JIN Studio

- Repository: https://github.com/weoiquan-art/weoiquan-art.github.io
- Production branch: main, root directory.
- URL: https://weoiquan-art.github.io/
- Static source is the deploy artifact; no npm build is required.
- JavaScript syntax, asset paths, browser behavior and whitespace checks run before publishing.
- Push reviewed source to main without force, then inspect the GitHub Pages workflow for that exact commit and confirm the live HTML/assets.
- Browser access to the production domain has a saved deny policy in this environment. Do not bypass it; report local visual QA and production workflow/HTTP verification separately.
- Rollback: revert the release commit(s), then push through the same route.

## Third-party assets
GSAP 3.15.0 core is vendored from the version-pinned npm distribution; its license header is preserved.
Bodoni Moda regular is self-hosted from Google Fonts with OFL.txt alongside it.
No runtime CDN dependency, API key, analytics or backend is required.
