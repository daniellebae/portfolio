/*
 * Glow Runner — a tiny night-time endless runner.
 * No dependencies. Needs sprites.js loaded first.
 *
 * Usage:
 *   <canvas data-glow-runner></canvas>          (auto-mounts)
 *   or: const game = GlowRunner.mount(canvasEl); game.destroy();
 */
(function (global) {
  'use strict';

  var W = 800, H = 240, GROUND = 208, S = 3;   // logical size, floor line, pixel scale
  var PLAYER_X = 64;
  var GRAVITY = 2600, JUMP_V = -820, CUT_V = -380;
  var START_SPEED = 360, MAX_SPEED = 900, ACCEL = 9;
  var INK = '#4b5a4c', SOFT = '#a3aba4', LINE = '#e3e6e3';   // light theme colours
  var PLAYER_FRAMES = ['run1', 'run2', 'jump', 'dead'], DUCK_FRAMES = ['duck1', 'duck2'];
  var FONT = 'bold 14px ui-monospace, Menlo, Consolas, monospace';
  var HI_KEY = 'glowRunnerHi';

  function buildSprite(rows, palette) {
    var h = rows.length, w = rows[0].length;
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var x = c.getContext('2d');
    var mask = new Uint8Array(w * h);
    for (var j = 0; j < h; j++) {
      for (var i = 0; i < w; i++) {
        var col = palette[rows[j][i]];
        if (col) { x.fillStyle = col; x.fillRect(i, j, 1, 1); mask[j * w + i] = 1; }
      }
    }
    return { canvas: c, mask: mask, w: w, h: h, pw: w * S, ph: h * S };
  }

  function overlay(rows, patch) {
    return rows.map(function (r, j) {
      return j < patch.length ? patch[j] + r.slice(patch[j].length) : r;
    });
  }

  // returns { palette, frames } with a character variant applied to the base art
  function applyVariant(data, v) {
    v = v || {};
    var palette = {}, frames = {}, k;
    for (k in data.palette) palette[k] = data.palette[k];
    for (k in (v.palette || {})) palette[k] = v.palette[k];
    for (k in data.frames) frames[k] = data.frames[k];
    if (v.head) PLAYER_FRAMES.forEach(function (f) { if (frames[f]) frames[f] = overlay(frames[f], v.head); });
    if (v.duckHead) DUCK_FRAMES.forEach(function (f) { if (frames[f]) frames[f] = overlay(frames[f], v.duckHead); });
    return { palette: palette, frames: frames };
  }

  function opaque(s, fx, fy) {
    var i = fx | 0, j = fy | 0;
    return i >= 0 && j >= 0 && i < s.w && j < s.h && s.mask[j * s.w + i] === 1;
  }

  // pixel-perfect collision (sampled every 2px, which also gives a little forgiveness)
  function collide(a, ax, ay, b, bx, by) {
    var x0 = Math.max(ax, bx), x1 = Math.min(ax + a.pw, bx + b.pw);
    var y0 = Math.max(ay, by), y1 = Math.min(ay + a.ph, by + b.ph);
    if (x0 >= x1 || y0 >= y1) return false;
    for (var y = y0 + 1; y < y1; y += 2) {
      for (var x = x0 + 1; x < x1; x += 2) {
        if (opaque(a, (x - ax) / S, (y - ay) / S) && opaque(b, (x - bx) / S, (y - by) / S)) return true;
      }
    }
    return false;
  }

  function loadHi() { try { return +localStorage.getItem(HI_KEY) || 0; } catch (e) { return 0; } }
  function saveHi(v) { try { localStorage.setItem(HI_KEY, String(v)); } catch (e) {} }
  function pad(n) { return ('00000' + n).slice(-5); }
  function rand(a, b) { return a + Math.random() * (b - a); }

  function mount(canvas, opts) {
    opts = opts || {};
    var data = opts.sprites || global.GLOW_SPRITES;
    if (!data) throw new Error('GlowRunner: load sprites.js before game.js');

    var variants = (data.variants && data.variants.length) ? data.variants : [{ name: 'Glowbie' }];
    var cache = {}, spr, GLOW, DUST, round = 0;
    function useVariant(i) {
      var v = variants[i % variants.length];
      if (!cache[i]) {
        var art = applyVariant(data, v), set = {};
        Object.keys(art.frames).forEach(function (k) { set[k] = buildSprite(art.frames[k], art.palette); });
        cache[i] = { spr: set, glow: art.palette.g || '#b8ff9e', dust: art.palette.s || '#86e070' };
      }
      spr = cache[i].spr; GLOW = cache[i].glow; DUST = cache[i].dust;
    }
    function variantName(i) { return variants[i % variants.length].name; }
    useVariant(0);
    var bg = canvas.getAttribute('data-bg') || opts.background || '#ffffff';

    // ---- canvas setup (crisp on HiDPI, scales with CSS width) ----
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    if (!canvas.style.width) canvas.style.width = '100%';
    canvas.style.aspectRatio = W + ' / ' + H;
    canvas.style.touchAction = 'none';
    canvas.style.outline = 'none';
    canvas.style.cursor = 'pointer';
    if (!canvas.hasAttribute('tabindex')) canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Glow Runner game. Click or press space to play. Space or up to jump, down to duck.');
    var ctx = canvas.getContext('2d');

    var clouds = [];
    for (var i = 0; i < 5; i++) clouds.push({ x: rand(0, W), y: rand(30, 120), w: (rand(4, 8) | 0) * 6 });

    // ---- game state ----
    var state = 'ready';          // ready | running | paused | over
    var time = 0, last = 0, raf = 0;
    var speed, dist, score, hi = loadHi(), nextSpawn, obstacles, particles, flash, overAt, trailT, scroll = 0;
    var p = { y: GROUND, vy: 0, onGround: true, ducking: false, dead: false };
    var input = { jump: false, down: false };

    function reset() {
      speed = START_SPEED; dist = 0; score = 0; nextSpawn = 500;
      obstacles = []; particles = []; flash = 0; trailT = 0;
      p.y = GROUND; p.vy = 0; p.onGround = true; p.ducking = false; p.dead = false;
    }
    reset();

    function start() {
      if (state === 'over') { round++; useVariant(round); }   // new character every round
      reset(); state = 'running'; jump();
    }

    function jump() {
      if (p.onGround && !p.ducking) { p.vy = JUMP_V; p.onGround = false; }
    }

    function press() {
      input.jump = true;
      if (state === 'ready') start();
      else if (state === 'paused') state = 'running';
      else if (state === 'over') { if (time - overAt > 0.5) start(); }
      else jump();
    }

    function pause() { if (state === 'running') { state = 'paused'; input.jump = input.down = false; } }

    // ---- obstacles ----
    function spawn() {
      var pool = ['plant', 'plant', 'books', 'cat'];
      if (score > 250) pool.push('moth', 'moth');
      var kind = pool[(Math.random() * pool.length) | 0];
      if (kind === 'moth') {
        var heights = [GROUND - 34, GROUND - 68, GROUND - 112]; // jump over / duck under / walk under
        obstacles.push({ kind: 'moth', x: W + 10, y: heights[(Math.random() * 3) | 0], fly: true });
        return;
      }
      var count = (kind === 'plant' && speed > 500 && Math.random() < 0.35) ? 2 : 1;
      for (var n = 0; n < count; n++) {
        var s = spr[kind];
        obstacles.push({ kind: kind, x: W + 10 + n * (s.pw + 2), y: GROUND - s.ph });
      }
    }

    function sprFor(o) {
      if (o.kind === 'moth') return ((time * 8) | 0) % 2 ? spr.moth1 : spr.moth2;
      return spr[o.kind];
    }

    function playerSprite() {
      if (p.dead) return spr.dead;
      if (!p.onGround) return spr.jump;
      var f = ((time * speed / 36) | 0) % 2;
      if (state !== 'running') f = 0;
      if (p.ducking) return f ? spr.duck2 : spr.duck1;
      return f ? spr.run2 : spr.run1;
    }

    function burst(x, y, n, spread) {
      for (var i = 0; i < n; i++) {
        particles.push({ x: x, y: y, vx: rand(-spread, spread), vy: rand(-spread, spread * 0.3), life: rand(0.4, 0.9) });
      }
    }

    // ---- update ----
    function update(dt) {
      time += dt;
      if (state !== 'running') { updateParticles(dt, 0); return; }

      speed = Math.min(MAX_SPEED, speed + ACCEL * dt);
      var dx = speed * dt;
      dist += dx; scroll += dx;

      p.ducking = input.down && p.onGround;
      if (!p.onGround) {
        if (!input.jump && p.vy < CUT_V) p.vy = CUT_V;      // short hop when released early
        p.vy += GRAVITY * (input.down ? 3 : 1) * dt;          // hold down to fast-fall
        p.y += p.vy * dt;
        if (p.y >= GROUND) { p.y = GROUND; p.vy = 0; p.onGround = true; burst(PLAYER_X + 24, GROUND, 6, 60); }
      }

      nextSpawn -= dx;
      if (nextSpawn <= 0) { spawn(); nextSpawn = speed * 0.6 + 150 + Math.random() * speed * 0.9; }

      var ps = playerSprite(), px = PLAYER_X, py = p.y - ps.ph;
      for (var i = obstacles.length - 1; i >= 0; i--) {
        var o = obstacles[i];
        o.x -= o.fly ? dx * 1.12 : dx;
        var os = sprFor(o);
        if (o.x + os.pw < -10) { obstacles.splice(i, 1); continue; }
        if (collide(ps, px, py, os, o.x, o.y)) return die();
      }

      var ns = Math.floor(dist * 0.025);
      if (Math.floor(ns / 100) > Math.floor(score / 100)) flash = 1.2;
      score = ns;
      flash = Math.max(0, flash - dt);

      trailT -= dt;
      if (trailT <= 0) {
        trailT = 0.07;
        particles.push({ x: px + 10, y: py + rand(10, ps.ph - 6), vx: rand(-40, -10), vy: rand(-20, 10), life: rand(0.3, 0.6) });
      }
      updateParticles(dt, dx);
    }

    function updateParticles(dt, dx) {
      for (var i = particles.length - 1; i >= 0; i--) {
        var q = particles[i];
        q.life -= dt;
        if (q.life <= 0) { particles.splice(i, 1); continue; }
        q.x += q.vx * dt - dx * 0.4; q.y += q.vy * dt;
      }
    }

    function die() {
      p.dead = true; state = 'over'; overAt = time;
      input.jump = input.down = false;
      var ps = spr.dead;
      burst(PLAYER_X + ps.pw / 2, p.y - ps.ph / 2, 24, 160);
      if (score > hi) { hi = score; saveHi(hi); }
    }

    // ---- draw ----
    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;

      if (bg === 'transparent') ctx.clearRect(0, 0, W, H);
      else { ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H); }

      // pixel clouds (slow parallax)
      ctx.fillStyle = '#eef0ee';
      for (var i = 0; i < clouds.length; i++) {
        var c = clouds[i];
        var x = (((c.x - scroll * 0.08) % (W + 80)) + W + 80) % (W + 80) - 80;
        ctx.fillRect(x | 0, c.y, c.w, 6);
        ctx.fillRect((x + 6) | 0, c.y - 6, c.w - 18, 6);
      }

      // floor
      ctx.fillStyle = LINE; ctx.fillRect(0, GROUND, W, 2);
      for (var b = 0; b < 12; b++) {
        var fx = ((b * 90 - scroll) % 1080 + 1080) % 1080 - 60;
        ctx.fillRect(fx | 0, GROUND + 10 + (b % 3) * 9, (b % 2 ? 6 : 24), 2);
      }

      // obstacles
      for (var k = 0; k < obstacles.length; k++) {
        var o = obstacles[k], os = sprFor(o);
        ctx.drawImage(os.canvas, o.x | 0, o.y | 0, os.pw, os.ph);
      }

      // glow dust
      ctx.fillStyle = DUST;
      for (var q = 0; q < particles.length; q++) {
        ctx.globalAlpha = Math.min(1, particles[q].life * 2);
        ctx.fillRect(particles[q].x | 0, particles[q].y | 0, 3, 3);
      }
      ctx.globalAlpha = 1;

      // player (with soft pulsing glow)
      var ps = playerSprite();
      ctx.save();
      ctx.shadowColor = GLOW;
      ctx.shadowBlur = (p.dead ? 3 : 10 + Math.sin(time * 3) * 4) * dpr;
      ctx.drawImage(ps.canvas, PLAYER_X, (p.y - ps.ph) | 0, ps.pw, ps.ph);
      ctx.restore();

      // HUD
      ctx.font = FONT; ctx.textBaseline = 'top'; ctx.textAlign = 'right';
      var blink = flash > 0 && ((flash * 6) | 0) % 2 === 0;
      ctx.fillStyle = SOFT;
      ctx.fillText('HI ' + pad(hi), W - 96, 14);
      ctx.textAlign = 'left';
      ctx.fillText(variantName(round), 16, 14);
      ctx.textAlign = 'right';
      ctx.fillStyle = blink ? SOFT : INK;
      ctx.fillText(pad(blink ? Math.floor(score / 100) * 100 : score), W - 16, 14);

      // overlays
      ctx.textAlign = 'center';
      if (state === 'ready') banner('GLOW RUNNER', 'meet ' + variantName(round) + ' · click / tap / space to play');
      else if (state === 'paused') banner('PAUSED', 'click or press space to resume');
      else if (state === 'over') banner('LIGHTS OUT', 'score ' + score + ' · next up: ' + variantName(round + 1));
    }

    function banner(title, sub) {
      ctx.fillStyle = INK; ctx.font = 'bold 22px ui-monospace, Menlo, Consolas, monospace';
      ctx.fillText(title, W / 2, 80);
      ctx.fillStyle = SOFT; ctx.font = FONT;
      ctx.fillText(sub, W / 2, 110);
    }

    function loop(t) {
      raf = requestAnimationFrame(loop);
      var dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      update(dt);
      draw();
    }

    // ---- input ----
    var JUMP_KEYS = { Space: 1, ArrowUp: 1, KeyW: 1 }, DOWN_KEYS = { ArrowDown: 1, KeyS: 1 };
    function onKeyDown(e) {
      if (JUMP_KEYS[e.code]) { e.preventDefault(); if (!e.repeat) press(); }
      else if (DOWN_KEYS[e.code]) { e.preventDefault(); input.down = true; }
      else if (e.code === 'Escape' || e.code === 'KeyP') pause();
    }
    function onKeyUp(e) {
      if (JUMP_KEYS[e.code]) input.jump = false;
      else if (DOWN_KEYS[e.code]) input.down = false;
    }
    var touchY = null;
    function onPointerDown(e) {
      e.preventDefault();
      canvas.focus({ preventScroll: true });
      touchY = e.clientY;
      press();
    }
    function onPointerMove(e) {   // swipe down on touch screens to duck
      if (touchY !== null && e.pointerType !== 'mouse' && e.clientY - touchY > 25) input.down = true;
    }
    function onPointerUp() { touchY = null; input.jump = false; input.down = false; }
    function onVisibility() { if (document.hidden) pause(); }

    canvas.addEventListener('keydown', onKeyDown);
    canvas.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('blur', pause);
    document.addEventListener('visibilitychange', onVisibility);

    raf = requestAnimationFrame(loop);

    return {
      start: function () { canvas.focus({ preventScroll: true }); start(); },
      pause: pause,
      get score() { return score; },
      get state() { return state; },
      get character() { return variantName(round); },
      destroy: function () {
        cancelAnimationFrame(raf);
        canvas.removeEventListener('keydown', onKeyDown);
        canvas.removeEventListener('keyup', onKeyUp);
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerup', onPointerUp);
        canvas.removeEventListener('pointercancel', onPointerUp);
        canvas.removeEventListener('blur', pause);
        document.removeEventListener('visibilitychange', onVisibility);
      }
    };
  }

  global.GlowRunner = { mount: mount, applyVariant: applyVariant };

  function autoMount() {
    var els = document.querySelectorAll('canvas[data-glow-runner]');
    for (var i = 0; i < els.length; i++) {
      if (!els[i].__glowRunner) els[i].__glowRunner = mount(els[i]);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoMount);
  else autoMount();
})(window);
