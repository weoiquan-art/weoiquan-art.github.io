/* Only the head follows the pointer. Feet, perch and body never move. */
(function () {
  'use strict';
  const stage = document.querySelector('.raven-perched');
  const section = document.querySelector('.hero');
  const head = document.querySelector('.raven-head');
  const pupil = document.querySelector('.raven-pupil');
  const lid = document.querySelector('.raven-eyelid');
  const image = document.getElementById('hero-raven');
  const gsap = window.gsap;
  const eligible = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  if (!stage || !gsap) return;
  let inView = false;
  let frame = 0;
  let blinkTimer = 0;
  let blink;
  let pointer;
  const clamp = value => Math.max(-1, Math.min(1, value));
  const available = () => eligible.matches && inView && !document.hidden &&
    !document.documentElement.classList.contains('intro-running') &&
    !document.documentElement.classList.contains('intro-pending');

  function settle() {
    cancelAnimationFrame(frame);
    frame = 0;
    clearTimeout(blinkTimer);
    blinkTimer = 0;
    if (blink) blink.kill();
    gsap.killTweensOf([head, pupil, lid]);
    // A changed motion preference is an immediate reset, not another animation.
    if (!eligible.matches || document.hidden || !inView) {
      gsap.set([head, pupil], { clearProps: 'transform' });
    } else {
      gsap.to(head, { x: 0, y: 0, rotation: 0, duration: .55, overwrite: true });
      gsap.to(pupil, { x: 0, y: 0, duration: .35, overwrite: true });
    }
    gsap.set(lid, { scaleY: 0 });
  }

  function scheduleBlink() {
    clearTimeout(blinkTimer);
    blinkTimer = 0;
    if (!available()) return;
    blinkTimer = setTimeout(() => {
      blinkTimer = 0;
      if (!available()) return;
      blink = gsap.timeline({ onComplete: scheduleBlink })
        .to(lid, { scaleY: 1, duration: .065, transformOrigin: '50% 50%' })
        .to(lid, { scaleY: 0, duration: .13, delay: .035 });
    }, 5200 + Math.random() * 3200);
  }

  function track() {
    frame = 0;
    if (!available()) return;
    const rect = stage.getBoundingClientRect();
    const eyeX = rect.left + rect.width * 471 / 1024;
    const eyeY = rect.top + rect.width * 154 / 1024;
    const x = clamp((pointer.x - eyeX) / (innerWidth * .42));
    const y = clamp((pointer.y - eyeY) / (innerHeight * .42));
    gsap.to(head, { rotation: y * 3.2 + x * 1.2, x: x * 1.4, y: y * .7,
      duration: .42, ease: 'power2.out', overwrite: true });
    gsap.to(pupil, { x: x * 3.0, y: y * 2.2,
      duration: .20, ease: 'power2.out', overwrite: true });
    if (!blinkTimer && !blink?.isActive()) scheduleBlink();
  }

  window.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !available()) return;
    pointer = { x: event.clientX, y: event.clientY };
    if (!frame) frame = requestAnimationFrame(track);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', settle);
  window.addEventListener('blur', settle);
  window.addEventListener('resize', settle, { passive: true });
  document.addEventListener('visibilitychange', () => { settle(); if (!document.hidden) scheduleBlink(); });
  eligible.addEventListener('change', () => { settle(); scheduleBlink(); });

  const observer = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    if (inView) scheduleBlink(); else settle();
  }, { threshold: .12 });
  observer.observe(section);
  // Replays must not inherit a head pose from the previous mouse position.
  new MutationObserver(() => {
    if (!available()) settle(); else scheduleBlink();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  image.decode().then(() => {
    stage.classList.add('gaze-ready');
    gsap.set(lid, { scaleY: 0, transformOrigin: '50% 50%' });
    scheduleBlink();
  }).catch(() => {});
})();
