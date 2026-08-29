/* JIN Personal Site — main.js
   Progressive enhancement only: content is fully readable without JS.
   1. Hero canvas: glyph particles assemble the word "JIN" (mouse parallax).
   2. Scroll-reveal via IntersectionObserver (one-shot).
   Both respect prefers-reduced-motion. */

(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Hero canvas ---------- */
  var canvas = document.getElementById('hero-canvas');
  if (!canvas || reducedMotion) return; // reduced-motion: CSS already hides canvas
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var GLYPHS = '01{};</>#*+';
  var SETTLE_MS = 2600; // intro + float window, then the loop stops
  var particles = [];
  var mouse = { x: 0.5, y: 0.5 };
  var running = false;
  var rafId = 0;
  var startTime = 0;

  function buildParticles() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Sample target points from the word "JIN" drawn offscreen.
    // Wide screens: ghost word sits in the right half, clear of the copy.
    // Narrow screens: smaller, fainter, behind the display title only.
    var off = document.createElement('canvas');
    var wide = w >= 768;
    var fontSize = wide ? Math.min(w * 0.2, h * 0.55) : Math.min(w * 0.28, h * 0.36);
    off.width = w; off.height = h;
    var octx = off.getContext('2d');
    if (!octx) return;
    octx.font = '700 ' + fontSize + 'px Fraunces, Georgia, serif';
    octx.textAlign = wide ? 'left' : 'center';
    octx.textBaseline = 'middle';
    octx.fillStyle = '#000';
    if (wide) {
      octx.fillText('JIN', w * 0.52, h * 0.42);
    } else {
      octx.fillText('JIN', w / 2, h * 0.3);
    }

    var data = octx.getImageData(0, 0, w, h).data;
    var step = Math.max(7, Math.round(fontSize / 30));
    particles = [];
    for (var y = 0; y < h; y += step) {
      for (var x = 0; x < w; x += step) {
        if (data[(y * w + x) * 4 + 3] > 128 && Math.random() < 0.7) {
          particles.push({
            tx: x, ty: y,
            x: Math.random() * w,
            y: Math.random() * h,
            delay: Math.random() * 700,
            glyph: GLYPHS[(Math.random() * GLYPHS.length) | 0],
            accent: Math.random() < 0.08,
            phase: Math.random() * Math.PI * 2,
            size: step * 0.9
          });
        }
      }
    }
    // Hard cap for performance on dense screens
    while (particles.length > 420) {
      particles.splice((Math.random() * particles.length) | 0, 1);
    }
    startTime = performance.now();
  }

  function draw(now) {
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    var px = (mouse.x - 0.5) * 14;
    var py = (mouse.y - 0.5) * 10;
    ctx.font = '500 ' + '10px ui-monospace, Menlo, monospace';
    var settled = now - startTime > SETTLE_MS;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var t = Math.min(1, Math.max(0, (now - startTime - p.delay) / 1100));
      var e = 1 - Math.pow(1 - t, 3); // ease-out cubic
      var fx = p.x + (p.tx - p.x) * e;
      var fy = p.y + (p.ty - p.y) * e;
      if (t >= 1) { // gentle idle float once settled
        fx = p.tx + Math.sin(now / 1400 + p.phase) * 1.6;
        fy = p.ty + Math.cos(now / 1700 + p.phase) * 1.6;
      }
      ctx.globalAlpha = t < 1 ? 0.12 + e * 0.16 : 0.3;
      ctx.fillStyle = p.accent ? '#B4441C' : '#16130E';
      ctx.fillText(p.glyph, fx + px, fy + py);
    }
    ctx.globalAlpha = 1;

    if (running) {
      if (settled) { stop(); } // zero idle CPU after the intro; redraw on demand
      else rafId = requestAnimationFrame(draw);
    }
  }

  function paint() { draw(performance.now()); }
  var paintIdle = 0;
  function paintSoon() {
    if (running) return; // loop is already painting
    clearTimeout(paintIdle);
    paint();
    paintIdle = setTimeout(paint, 160); // brief tail so parallax eases out
  }

  function start() {
    if (running) return;
    running = true;
    startTime = performance.now();
    rafId = requestAnimationFrame(draw);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { buildParticles(); paintSoon(); }, 150);
  });

  canvas.parentElement.addEventListener('pointermove', function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = (e.clientY - rect.top) / rect.height;
    paintSoon();
  });

  // Only animate while hero is on screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        startTime = Math.min(startTime, performance.now() - SETTLE_MS); // don't replay on scroll-back
        paintSoon();
      } else {
        stop();
      }
    }, { threshold: 0.05 }).observe(canvas);
  }

  buildParticles();
  start();
})();
