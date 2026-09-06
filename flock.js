/* Original JIN diagonal raven choreography, retained for user-triggered replay. */
(function () {
  'use strict';
  var stop = function () {};
  window.stopJinFlock = function () { stop(); };
  window.playJinFlock = function (canvas) {
    stop();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.hidden = false;
    var birds = [], flockStart = 0, flockEnd = 0, flockRaf = 0, flockFinished = false;
    function seededRandom(seed) {
      return function () {
        seed |= 0;
        seed = seed + 0x6D2B79F5 | 0;
        var value = Math.imul(seed ^ seed >>> 15, 1 | seed);
        value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
        return ((value ^ value >>> 14) >>> 0) / 4294967296;
      };
    }

    function pointOnCurve(bird, t) {
      var one = 1 - t;
      return {
        x: one * one * one * bird.sx + 3 * one * one * t * bird.c1x + 3 * one * t * t * bird.c2x + t * t * t * bird.ex,
        y: one * one * one * bird.sy + 3 * one * one * t * bird.c1y + 3 * one * t * t * bird.c2y + t * t * t * bird.ey
      };
    }

    function tangentOnCurve(bird, t) {
      var one = 1 - t;
      return {
        x: 3 * one * one * (bird.c1x - bird.sx) + 6 * one * t * (bird.c2x - bird.c1x) + 3 * t * t * (bird.ex - bird.c2x),
        y: 3 * one * one * (bird.c1y - bird.sy) + 6 * one * t * (bird.c2y - bird.c1y) + 3 * t * t * (bird.ey - bird.c2y)
      };
    }

    function drawCrow(bird, x, y, angle, elapsed) {
      var flap = Math.sin(elapsed * bird.flap + bird.phase);
      var spread = 0.5 + (flap + 1) * 0.25;
      var bend = 0.13 + (1 - flap) * 0.12;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(bird.size, bird.size);
      ctx.globalAlpha = bird.opacity;
      ctx.fillStyle = bird.tint;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.48)';
      ctx.shadowBlur = bird.shadow;

      /* A hand-drawn vector silhouette: body, hooked beak, split tail, and feathered wings. */
      ctx.beginPath();
      ctx.ellipse(0, 0, 0.52, 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0.42, -0.04, 0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0.52, -0.09);
      ctx.lineTo(0.82, -0.015);
      ctx.lineTo(0.5, 0.055);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-0.38, -0.09);
      ctx.lineTo(-0.84, -0.3);
      ctx.lineTo(-0.66, -0.02);
      ctx.lineTo(-0.92, 0.25);
      ctx.lineTo(-0.36, 0.1);
      ctx.closePath();
      ctx.fill();

      /* Wing tips stay irregular, so the flock reads as bodies in space rather than copied icons. */
      ctx.beginPath();
      ctx.moveTo(0.12, -0.04);
      ctx.bezierCurveTo(-0.08, -0.23, -0.27, -spread, -0.82, -spread - bend);
      ctx.lineTo(-0.98, -spread * 0.76);
      ctx.lineTo(-0.83, -spread * 0.34);
      ctx.lineTo(-1.07, -spread * 0.13);
      ctx.bezierCurveTo(-0.62, -0.25, -0.31, -0.08, -0.05, 0.015);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0.1, 0.04);
      ctx.bezierCurveTo(-0.1, 0.23, -0.3, spread, -0.83, spread + bend);
      ctx.lineTo(-1.04, spread * 0.72);
      ctx.lineTo(-0.82, spread * 0.31);
      ctx.lineTo(-1.02, spread * 0.08);
      ctx.bezierCurveTo(-0.6, 0.26, -0.28, 0.08, -0.04, -0.015);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function buildFlock() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var width = canvas.clientWidth;
      var height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var random = seededRandom(width < 600 ? 2601 : width < 1000 ? 2602 : 2603);
      var count = width < 600 ? 132 : width < 1000 ? 168 : 210;
      birds = [];
      flockEnd = 0;

      for (var i = 0; i < count; i++) {
        var group = i % 9;
        var entry = i % 3;
        var depth = 0.12 + random() * 0.88;
        var delay = group * 28 + random() * 340;
        var duration = 970 + (1 - depth) * 180 + random() * 160;
        var foreground = i % 17 === 0 ? 1.72 : (i % 6 === 0 ? 1.24 : 1);
        var sx;
        var sy;
        var c1x;
        var c1y;
        var c2x;
        var c2y;
        var ex;
        var ey;
        var slope = 0.48 + random() * 0.3;
        var travel;
        var overshoot;
        var dx;
        var dy;
        var bend;

        // Three ingress corridors, then one shared diagonal vector. Each ray
        // exits where it naturally meets the upper or left viewport edge.
        if (entry === 0) {
          // Bottom: middle-to-right launch points keep the diagonal legible.
          sx = width * (0.12 + random() * 1.1);
          sy = height * (1.02 + random() * 0.3);
        } else if (entry === 1) {
          // Right: enter below the top margin so the path crosses the Hero.
          sx = width * (1.02 + random() * 0.34) + group * 8;
          sy = height * (0.26 + random() * 0.7);
        } else {
          // Bottom-right: the dense, long-running diagonal core.
          sx = width * (1.01 + random() * 0.33) + group * 10;
          sy = height * (0.8 + random() * 0.56);
        }

        // Travel up-left until the line reaches the top or left boundary, then
        // continue just beyond it. This creates adjacent exits rather than a
        // single magnetic corner.
        travel = Math.min(sx, sy / slope);
        overshoot = width * (0.06 + random() * 0.14);
        ex = sx - travel - overshoot;
        ey = sy - slope * (travel + overshoot);
        dx = ex - sx;
        dy = ey - sy;
        bend = (random() - 0.5) * height * 0.14;
        c1x = sx + dx * (0.24 + random() * 0.09) + bend * 0.34;
        c1y = sy + dy * (0.24 + random() * 0.09) - bend * 0.56;
        c2x = sx + dx * (0.68 + random() * 0.1) - bend * 0.16;
        c2y = sy + dy * (0.68 + random() * 0.1) + bend * 0.36;
        var bird = {
          sx: sx,
          sy: sy,
          c1x: c1x,
          c1y: c1y,
          c2x: c2x,
          c2y: c2y,
          ex: ex,
          ey: ey,
          delay: delay,
          duration: duration,
          depth: depth,
          size: (width < 600 ? 9 + depth * 38 : 12 + depth * 50) * foreground,
          opacity: Math.min(0.96, (0.2 + depth * 0.71) * (foreground > 1 ? 1.08 : 1)),
          tint: depth > 0.68 ? '#05030A' : depth > 0.4 ? '#140C20' : '#38264D',
          shadow: foreground > 1 ? 8 : 2 + depth * 3,
          flap: 0.019 + random() * 0.015,
          phase: random() * Math.PI * 2,
          drift: 5 + random() * 15
        };
        birds.push(bird);
        flockEnd = Math.max(flockEnd, delay + duration);
      }
      birds.sort(function (a, b) { return a.depth - b.depth; });
    }

    function drawFlock(now) {
      var elapsed = now - flockStart;
      var width = canvas.clientWidth;
      var height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);

      for (var i = 0; i < birds.length; i++) {
        var bird = birds[i];
        var raw = (elapsed - bird.delay) / bird.duration;
        if (raw < 0 || raw > 1) continue;
        var t = raw * raw * (3 - 2 * raw);
        var point = pointOnCurve(bird, t);
        var tangent = tangentOnCurve(bird, t);
        point.x += Math.cos(raw * Math.PI * 2 + bird.phase) * bird.drift;
        point.y += Math.sin(raw * Math.PI * 2.5 + bird.phase) * bird.drift;
        drawCrow(bird, point.x, point.y, Math.atan2(tangent.y, tangent.x), elapsed);
      }
      ctx.globalAlpha = 1;

      if (elapsed < flockEnd + 80) {
        flockRaf = requestAnimationFrame(drawFlock);
      } else {
        flockFinished = true;
        ctx.clearRect(0, 0, width, height);
        canvas.hidden = true;
      }
    }

    buildFlock();
    flockStart = performance.now();
    flockRaf = requestAnimationFrame(drawFlock);


    stop = function () {
      cancelAnimationFrame(flockRaf);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.hidden = true;
    };
  };
  window.addEventListener('resize', function () { stop(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); });
})();

