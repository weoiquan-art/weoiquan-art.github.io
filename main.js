/* JIN Personal Site v2 — main.js
   Progressive enhancement: the page is fully readable without JS.
   1. Terminal typing (hero identity block)
   2. Hero canvas: glyph particles assemble "JIN" (stops after settling)
   3. Lenis smooth scroll (CDN, guarded — falls back to native)
   4. Nav click → short wipe transition → instant jump → control returned
   All respect prefers-reduced-motion. */

(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Terminal typing ---------- */
  var term = document.getElementById('terminal');
  if (term) {
    var code = term.querySelector('code');
    var LINES = [
      { p: true,  t: 'whoami' },
      { p: false, t: 'jin — lee woei quan', dim: true },
      { p: true,  t: 'role' },
      { p: false, t: 'ai visual designer · creative technologist' },
      { p: true,  t: 'status' },
      { p: false, t: 'creating...' }
    ];
    function lineEl(line) {
      var span = document.createElement('span');
      var prompt = document.createElement('span');
      prompt.className = 't-prompt';
      prompt.textContent = line.p ? '> ' : '  ';
      span.appendChild(prompt);
      var text = document.createElement('span');
      if (line.dim) text.className = 't-dim';
      span.appendChild(text);
      code.appendChild(span);
      code.appendChild(document.createTextNode('\n'));
      return { el: span, text: text, full: line.t };
    }
    if (reducedMotion) {
      LINES.forEach(function (line) { lineEl(line).text.textContent = line.full; });
    } else {
      var li = 0, rendered = [];
      function renderAll() { rendered = LINES.map(lineEl); }
      function typeLine() {
        if (li >= LINES.length) return;
        var cur = rendered[li];
        var ci = 0;
        (function tick() {
          if (ci <= cur.full.length) {
            cur.text.textContent = cur.full.slice(0, ci);
            ci++;
            setTimeout(tick, 16 + Math.random() * 18);
          } else {
            li++;
            setTimeout(typeLine, li < LINES.length ? 220 : 0);
          }
        })();
      }
      // start when the hero has had a beat to paint
      renderAll();
      setTimeout(typeLine, 500);
    }
  }

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
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Lenis smooth scroll (guarded) ---------- */
  var lenis = null;
  if (!reducedMotion && typeof window.Lenis === 'function') {
    try {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 1 });
      (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);
    } catch (e) { lenis = null; }
  }

  function jumpTo(id) {
    var target = document.getElementById(id);
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { immediate: true, offset: -56 });
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 56, behavior: 'instant' });
  }

  /* ---------- Nav wipe transition ---------- */
  var wipe = document.querySelector('.wipe');
  var animating = false;
  document.querySelectorAll('a[data-nav]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = (link.getAttribute('href') || '').replace('#', '');
      if (!document.getElementById(id)) return;
      e.preventDefault();
      if (reducedMotion || !wipe) { jumpTo(id); return; }
      if (animating) return;
      animating = true;
      wipe.classList.remove('reveal');
      wipe.classList.add('cover');
      setTimeout(function () {
        jumpTo(id);
        wipe.classList.remove('cover');
        wipe.classList.add('reveal');
        setTimeout(function () {
          wipe.classList.remove('reveal');
          animating = false;
        }, 320);
      }, 280);
    });
  });

  /* ---------- Hero canvas ---------- */
  var canvas = document.getElementById('hero-canvas');
  if (!canvas || reducedMotion) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var GLYPHS = '01{};</>#*+';
  var SETTLE_MS = 2600;
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
      octx.fillText('JIN', w * 0.55, h * 0.45);
    } else {
      octx.fillText('JIN', w * 0.72, h * 0.16);
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
            phase: Math.random() * Math.PI * 2
          });
        }
      }
    }
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
    ctx.font = '500 10px ui-monospace, Menlo, monospace';
    var settled = now - startTime > SETTLE_MS;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var t = Math.min(1, Math.max(0, (now - startTime - p.delay) / 1100));
      var e = 1 - Math.pow(1 - t, 3);
      var fx = p.x + (p.tx - p.x) * e;
      var fy = p.y + (p.ty - p.y) * e;
      if (t >= 1) {
        fx = p.tx + Math.sin(now / 1400 + p.phase) * 1.6;
        fy = p.ty + Math.cos(now / 1700 + p.phase) * 1.6;
      }
      ctx.globalAlpha = t < 1 ? 0.12 + e * 0.16 : 0.3;
      ctx.fillStyle = p.accent ? '#B4441C' : '#16130E';
      ctx.fillText(p.glyph, fx + px, fy + py);
    }
    ctx.globalAlpha = 1;

    if (running) {
      if (settled) { stop(); }
      else rafId = requestAnimationFrame(draw);
    }
  }

  function paint() { draw(performance.now()); }
  var paintIdle = 0;
  function paintSoon() {
    if (running) return;
    clearTimeout(paintIdle);
    paint();
    paintIdle = setTimeout(paint, 160);
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

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        startTime = Math.min(startTime, performance.now() - SETTLE_MS);
        paintSoon();
      } else {
        stop();
      }
    }, { threshold: 0.05 }).observe(canvas);
  }

  buildParticles();
  start();
})();
