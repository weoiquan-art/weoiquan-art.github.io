/* GSAP core owns the short intro; the page and anchors work without it. */
(function () {
  'use strict';
  const root = document.documentElement;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const controls = document.querySelector('.motion-controls');
  const replay = document.getElementById('replay-intro');
  const flock = document.getElementById('replay-flock');
  const skip = document.getElementById('skip-intro');
  const trace = document.getElementById('brush-trace');
  const night = document.getElementById('night-raven');
  const hero = document.getElementById('hero-raven');
  const heroCharacters = [...document.querySelectorAll('.hero-sera')];
  const gsap = window.gsap;
  const revealTargets = '.hero-sera, .wordmark-type, .studio-type, .site-header, .hero-topline, .hero-bottom';
  let timeline;
  let running = false;
  let cancelled = false;
  let safety;
  document.getElementById('year').textContent = new Date().getFullYear();

  function finish() {
    const skipFocused = document.activeElement === skip;
    cancelled = true;
    running = false;
    if (timeline) timeline.kill();
    clearTimeout(window.introSafety);
    clearTimeout(safety);
    root.classList.remove('intro-pending', 'intro-running', 'page-entering');
    if (gsap) gsap.set(revealTargets, { clearProps: 'all' });
    document.getElementById('intro').style.opacity = '';
    if (skipFocused) replay.focus({ preventScroll: true });
  }

  function playIntro() {
    if (motion.matches || !gsap || !night.naturalWidth || !hero.naturalWidth) return finish();
    window.stopJinFlock?.();
    if (timeline) timeline.kill();
    clearTimeout(window.introSafety);
    root.classList.remove('intro-expired', 'intro-pending', 'page-entering');
    root.classList.add('intro-running');
    running = true;
    cancelled = false;
    const length = trace.getTotalLength();
    gsap.set(trace, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set('.intro', { opacity: 1 });
    gsap.set('.intro-bird', { opacity: 0, scale: .975 });
    gsap.set('.intro-wash', { scale: 0 });
    gsap.set(revealTargets, { opacity: 0, y: 14 });
    gsap.set('.hero-sera-homeworld', { x: 26 });
    gsap.set('.hero-sera-chibi', { x: -12, scale: .94 });
    // Spatial reveal follows neck -> breast -> hook, rather than fading in a finished J.
    timeline = gsap.timeline({ onComplete: finish });
    timeline.to('.intro-bird', { opacity: 1, scale: 1, duration: .28, ease: 'power2.out' }, 0)
      .to(trace, { strokeDashoffset: 0, duration: .72, ease: 'power1.inOut' }, .30)
      .to('.intro-wash', { scale: 1, duration: .50, ease: 'power2.inOut' }, 1.06)
      .call(() => root.classList.add('page-entering'), [], 1.30)
      .to('.intro', { opacity: 0, duration: .28 }, 1.42)
      .to('.hero-sera-homeworld', { opacity: .86, x: 0, y: 0, duration: .58, ease: 'power3.out' }, 1.40)
      .to('.hero-sera-chibi', { opacity: .96, x: 0, y: 0, scale: 1, duration: .46, ease: 'back.out(1.3)' }, 1.49)
      .to('.wordmark-type', { opacity: 1, y: 0, duration: .50, ease: 'power3.out' }, 1.44)
      .to('.studio-type', { opacity: 1, y: 0, duration: .36 }, 1.55)
      .to('.site-header, .hero-topline, .hero-bottom', { opacity: 1, y: 0, duration: .35, stagger: .035 }, 1.62);
    clearTimeout(safety);
    safety = setTimeout(finish, 3000);
  }

  skip.addEventListener('click', finish);
  replay.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    playIntro();
  });
  flock.addEventListener('click', () => { finish(); window.playJinFlock?.(document.getElementById('crow-canvas')); });
  // Navigation always takes priority over the brand sequence.
  ['wheel', 'touchstart', 'keydown'].forEach(type => window.addEventListener(type, () => {
    if (running || root.classList.contains('intro-pending')) finish();
  }, { passive: true }));
  document.addEventListener('visibilitychange', () => { if (document.hidden) finish(); });
  motion.addEventListener('change', () => {
    controls.hidden = motion.matches || !gsap;
    if (motion.matches) { finish(); window.stopJinFlock?.(); }
  });
  controls.hidden = motion.matches || !gsap;
  if (motion.matches || !gsap || !root.classList.contains('intro-pending')) return finish();

  // Bound loading so a slow image cannot become an indefinite splash screen.
  Promise.race([
    Promise.all([night.decode(), hero.decode(), ...heroCharacters.map(image => image.decode())]).then(() => true).catch(() => false),
    new Promise(resolve => setTimeout(() => resolve(false), 1200))
  ]).then(ready => {
    if (ready && !cancelled && !root.classList.contains('intro-expired')) playIntro();
    else finish();
  });
})();
