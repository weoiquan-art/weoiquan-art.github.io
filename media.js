/* The welcome film is optional: its still remains useful without JavaScript. */
(function () {
  'use strict';

  const media = document.querySelector('.world-media-sera');
  if (!media) return;

  const video = media.querySelector('.world-film-video');
  const toggle = media.querySelector('.world-film-toggle');
  const error = media.querySelector('.world-film-error');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const gsap = window.gsap;
  let inView = false;
  let manuallyPaused = false;
  let revealed = false;
  let firstFrameShown = false;

  function updateToggle() {
    toggle.textContent = video.paused ? 'Play film' : 'Pause film';
  }

  function playInView() {
    if (inView && !document.hidden && !reducedMotion.matches && !manuallyPaused && !video.error) {
      video.play().catch(updateToggle);
    }
  }

  function updateMotion() {
    toggle.hidden = reducedMotion.matches || !!video.error;
    if (reducedMotion.matches) {
      video.pause();
      video.currentTime = 0;
    } else {
      playInView();
    }
  }

  // Native controls remain if this script does not run.
  video.controls = false;
  video.addEventListener('play', updateToggle);
  video.addEventListener('pause', updateToggle);
  video.addEventListener('playing', () => {
    if (firstFrameShown || reducedMotion.matches) return;
    firstFrameShown = true;
    if (gsap) gsap.fromTo(video, { opacity: 0 }, { opacity: 1, duration: .4, ease: 'power1.out', clearProps: 'opacity' });
  });
  video.addEventListener('error', () => {
    video.pause();
    video.hidden = true;
    toggle.hidden = true;
    error.hidden = false;
  });

  toggle.addEventListener('click', () => {
    if (video.paused) {
      manuallyPaused = false;
      video.play().catch(updateToggle);
    } else {
      manuallyPaused = true;
      video.pause();
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      if (inView) {
        if (!revealed && !reducedMotion.matches && gsap) {
          revealed = true;
          gsap.fromTo(media.querySelector('.world-film'),
            { opacity: .6, y: 18 },
            { opacity: 1, y: 0, duration: .65, ease: 'power2.out', clearProps: 'opacity,transform' });
        }
        playInView();
      } else {
        video.pause();
      }
    }, { threshold: .2 });
    observer.observe(media);
  } else {
    inView = true;
    playInView();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else playInView();
  });
  reducedMotion.addEventListener('change', updateMotion);
  updateToggle();
  updateMotion();
})();
