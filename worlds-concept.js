/* A two-world interpretation of an off-screen project arc; no scroll capture. */
(function () {
  'use strict';
  const gsap = window.gsap;
  const stage = document.querySelector('.concept-stage');
  if (!stage || !gsap) return; // Both worlds stay in their readable static order.

  const orbit = stage.querySelector('.concept-orbit');
  const cards = [...stage.querySelectorAll('.concept-card')];
  const shells = cards.map(card => card.querySelector('.concept-card-shell'));
  const copies = [...stage.querySelectorAll('.concept-copy')];
  const choices = [...stage.querySelectorAll('[data-go]')];
  const thread = stage.querySelector('.concept-thread');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let timeline;
  let touchStartX = null;
  let suppressClick = false;

  function position(index) {
    if (index === active) return { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };
    const direction = active === 0 ? 1 : -1;
    return { x: 52 * direction, y: orbit.clientHeight * .66 * direction,
      rotation: 11 * direction, scale: .82, opacity: .82 };
  }

  function setState() {
    stage.dataset.active = String(active);
    cards.forEach((card, index) => {
      card.setAttribute('aria-hidden', String(index !== active));
      card.style.zIndex = index === active ? '2' : '1';
    });
    copies.forEach((copy, index) => copy.classList.toggle('active', index === active));
    choices.forEach((choice, index) => choice.setAttribute('aria-pressed', String(index === active)));
  }

  function select(index) {
    if (index === active || index < 0 || index >= cards.length) return;
    if (timeline) timeline.kill();
    active = index;
    setState();

    if (reducedMotion.matches) {
      shells.forEach((shell, i) => gsap.set(shell, position(i)));
      gsap.set(thread, { opacity: 0, scaleY: 0 });
      return;
    }

    timeline = gsap.timeline();
    shells.forEach((shell, i) => timeline.to(shell,
      { ...position(i), duration: .78, ease: 'power3.inOut' }, 0));
    timeline.fromTo(thread, { opacity: 0, scaleY: 0 },
      { opacity: .48, scaleY: 1, duration: .33, ease: 'power2.out' }, .07)
      .to(thread, { opacity: 0, scaleY: .35, duration: .42, ease: 'power2.in' }, .36)
      .fromTo(copies[active], { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: .45, ease: 'power2.out', clearProps: 'opacity,transform' }, .23);
  }

  stage.classList.add('is-interactive');
  setState();
  shells.forEach((shell, index) => gsap.set(shell, position(index)));
  choices.forEach(choice => choice.addEventListener('click', () => select(Number(choice.dataset.go))));
  stage.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () =>
    select(Math.max(0, Math.min(cards.length - 1, active + Number(button.dataset.step))))));
  cards.forEach((card, index) => card.addEventListener('click', () => {
    if (suppressClick) { suppressClick = false; return; }
    select(index);
  }));
  orbit.addEventListener('keydown', event => {
    if (['ArrowDown', 'ArrowRight'].includes(event.key)) { event.preventDefault(); select(Math.min(cards.length - 1, active + 1)); }
    if (['ArrowUp', 'ArrowLeft'].includes(event.key)) { event.preventDefault(); select(Math.max(0, active - 1)); }
  });
  orbit.addEventListener('pointerdown', event => { touchStartX = event.clientX; suppressClick = false; });
  orbit.addEventListener('pointerup', event => {
    if (touchStartX === null) return;
    const delta = event.clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(delta) > 55) { suppressClick = true; select(delta < 0 ? 1 : 0); }
  });
  orbit.addEventListener('pointercancel', () => { touchStartX = null; });
  window.addEventListener('resize', () => {
    if (timeline) timeline.kill();
    shells.forEach((shell, index) => gsap.set(shell, position(index)));
    gsap.set(thread, { opacity: 0, scaleY: 0 });
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && timeline) timeline.kill();
    shells.forEach((shell, index) => gsap.set(shell, position(index)));
    gsap.set(thread, { opacity: 0, scaleY: 0 });
  });
})();
