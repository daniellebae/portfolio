/*
 * Procedural ink-wash (sumukhwa) landscape painter.
 * Draws an original mountain scene in the style of Joseon "true-view" landscapes:
 * a rain-darkened rock face, layered ridges dotted with moss, mist bands,
 * pines, willows and tiled roofs. Paints dark ink on a transparent canvas;
 * the site lightens it when displaying.
 * Run `node scripts/ink-wash/render.js` to regenerate public/images/ink-wash.webp.
 */
function paintInkWash(canvas, seed) {
  const W = canvas.width, H = canvas.height
  const ctx = canvas.getContext('2d')
  let s = seed | 0
  const r = () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
  const R = (a, b) => a + r() * (b - a)
  const ink = a => `rgba(24,24,20,${a})`
  const lerp = (a, b, t) => a + (b - a) * t

  // ---------- noise ----------
  function noise1() {
    const N = 1024, v = Array.from({ length: N }, () => r() * 2 - 1)
    return x => { const i = Math.floor(x), f = x - i, t = f * f * (3 - 2 * f); return lerp(v[((i % N) + N) % N], v[(((i + 1) % N) + N) % N], t) }
  }
  const nz = noise1()
  const fbm = (x, oct = 5) => { let sum = 0, a = 1, f = 1, n = 0; for (let o = 0; o < oct; o++) { sum += a * nz(x * f + o * 37.1); n += a; a *= 0.5; f *= 2.13 } return sum / n }

  // ---------- primitives ----------
  function profilePts(fn, x0, x1, step = 4) { const p = []; for (let x = x0; x <= x1; x += step) p.push([x, fn(x)]); return p }
  function polyPath(pts, bottom) {
    ctx.beginPath(); ctx.moveTo(pts[0][0], bottom)
    pts.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(pts[pts.length - 1][0], bottom); ctx.closePath()
  }
  function knockout(pts, bottom, a = 1, blur = 0) {
    const top = Math.min(...pts.map(p => p[1]))
    ctx.save(); ctx.globalCompositeOperation = 'destination-out'; if (blur) ctx.filter = `blur(${blur}px)`
    const g = ctx.createLinearGradient(0, top, 0, bottom)
    g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(0.55, `rgba(0,0,0,${a * 0.85})`); g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g; polyPath(pts, bottom); ctx.fill(); ctx.restore()
  }
  // brush: dabs along a path, tapered, with dry-brush gaps
  function stroke(pts, w0, w1, a, dry = 0.15, jit = 0.6) {
    const L = [0]
    for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
    const total = L[L.length - 1]; if (total < 1) return
    const step = Math.max(0.8, Math.min(w0, w1) * 0.3)
    let k = 0
    ctx.fillStyle = ink(1)
    for (let d = 0; d <= total; d += step) {
      while (k < L.length - 2 && L[k + 1] < d) k++
      const seg = (d - L[k]) / Math.max(1e-6, L[k + 1] - L[k])
      const x = lerp(pts[k][0], pts[k + 1][0], seg), y = lerp(pts[k][1], pts[k + 1][1], seg)
      const t = d / total, taper = Math.sqrt(Math.min(1, t * 7, (1 - t) * 4))
      if (r() < dry * (0.5 + t)) continue
      const w = Math.max(0.6, lerp(w0, w1, t) * taper * R(0.8, 1.1))
      ctx.globalAlpha = a * R(0.45, 1)
      ctx.beginPath(); ctx.ellipse(x + R(-jit, jit), y + R(-jit, jit), w / 2, w / 2 * R(0.6, 1), R(0, 3.14), 0, 6.283); ctx.fill()
    }
    ctx.globalAlpha = 1
  }
  function line(x0, y0, x1, y1, w, a) { ctx.strokeStyle = ink(a); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke() }
  // moss dot (mijeom): a short horizontal dab
  function dot(x, y, size, a) {
    ctx.fillStyle = ink(a)
    const rx = size * R(0.9, 1.6), ry = size * R(0.4, 0.65), ang = R(-0.35, 0.25)
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, ang, 0, 6.283); ctx.fill()
    if (r() < 0.5) { ctx.beginPath(); ctx.ellipse(x + rx * 0.6, y + R(-1, 1), rx * 0.6, ry * 0.8, ang, 0, 6.283); ctx.fill() }
  }
  function ridgeFn(cx, hw, base, h, rough, sc, sharp, off) {
    const skew = R(-0.35, 0.35), b1 = R(-0.6, 0.6), b1h = R(0.15, 0.4), b2 = R(-0.7, 0.7), b2h = R(0.1, 0.3)
    return x => {
      let t = (x - cx) / hw
      if (Math.abs(t) >= 1) return base
      const ts = t < 0 ? t * (1 - skew) : t * (1 + skew)
      let env = Math.pow(Math.max(0, 1 - ts * ts), sharp) * 0.8
      env += b1h * Math.exp(-(((t - b1) / 0.22) ** 2)) + b2h * Math.exp(-(((t - b2) / 0.15) ** 2))
      env *= Math.pow(1 - t * t, 0.35)
      const crag = fbm(x / sc + off) * 0.6 + (Math.abs(fbm(x / (sc * 0.35) + off * 2)) - 0.25) * 0.5
      return base - h * env - crag * h * rough * env
    }
  }

  // a ridge with a dark ink band along its crest, rows of moss dots and a dry-brush outline
  function texturedRidge(cx, hw, base, h, o = {}) {
    const { rough = 0.18, sc = 140, sharp = 0.75, band = 0.32, dots = 4, wash = 0.3, outline = 0.6 } = o
    const fn = ridgeFn(cx, hw, base, h, rough, sc, sharp, R(0, 100))
    const pts = profilePts(fn, cx - hw, cx + hw, 4)
    knockout(pts, base + 400, 1)
    knockout(pts, base + 400, 0.6, 18)
    ctx.save(); polyPath(pts, base + 400); ctx.clip()
    // crest wash, hugging the ridge line
    ctx.filter = 'blur(14px)'; ctx.strokeStyle = ink(wash); ctx.lineWidth = h * band
    ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y + h * band * 0.45) : ctx.moveTo(x, y + h * band * 0.45)); ctx.stroke()
    ctx.filter = 'blur(4px)'; ctx.strokeStyle = ink(wash * 0.9); ctx.lineWidth = h * band * 0.35
    ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y + 6) : ctx.moveTo(x, y + 6)); ctx.stroke()
    ctx.filter = 'none'
    // texture strokes: short slanted contours down the slopes
    const nT = Math.round(hw / 14)
    for (let i = 0; i < nT; i++) {
      const x = R(cx - hw * 0.95, cx + hw * 0.95), y = fn(x) + R(4, h * 0.25), dir = x < cx ? -1 : 1
      const len = R(14, 40)
      stroke([[x, y], [x + dir * len * 0.3, y + len * 0.5], [x + dir * len * 0.4, y + len]], R(1.5, 3), 1, R(0.12, 0.3), 0.35)
    }
    // rows of moss dots following the crest
    for (let k = 0; k < dots; k++) {
      const off = 10 + k * R(18, 30)
      for (let x = cx - hw * 0.92; x < cx + hw * 0.92; x += R(9, 17)) {
        if (r() < 0.35 + k * 0.1) continue
        dot(x + R(-3, 3), fn(x) + off + R(-4, 4), R(2.2, 4.2), R(0.35, 0.8) * (1 - k * 0.15))
      }
    }
    ctx.restore()
    stroke(pts, 4, 2.5, outline, 0.3, 0.8)
    // small trees silhouetted along the crest
    if (o.trees) for (let x = cx - hw * 0.85; x < cx + hw * 0.85; x += R(10, 26)) {
      if (r() < 0.45) continue
      const ry = R(5, 12), y = fn(x) - ry * 0.4
      ctx.fillStyle = ink(R(0.35, 0.65)); ctx.beginPath(); ctx.ellipse(x, y, R(3, 6), ry, R(-0.15, 0.15), 0, 6.283); ctx.fill()
      line(x, y + ry * 0.6, x, y + ry * 1.6, 1.4, 0.4)
    }
    return fn
  }

  // ---------- trees & buildings ----------
  function pineCluster(cx, cy, rx, ry, a) {
    ctx.save(); ctx.filter = 'blur(3px)'; ctx.fillStyle = ink(a * 0.55)
    ctx.beginPath(); ctx.ellipse(cx, cy, rx * 0.8, ry * 0.65, R(-0.1, 0.1), 0, 6.283); ctx.fill(); ctx.restore()
    const n = Math.round(rx * 1.6)
    for (let i = 0; i < n; i++) {
      const px = cx + R(-rx, rx), spread = 1 - Math.abs(px - cx) / rx, py = cy + R(-ry, ry) * spread
      const len = R(5, 13), ang = R(-0.45, 0.45) + (r() < 0.5 ? 0 : Math.PI)
      line(px, py, px + Math.cos(ang) * len, py + Math.sin(ang) * len * 0.5 - R(0, 3), R(1.2, 2.4), a * R(0.35, 0.9))
    }
  }
  function pine(x, base, h, a = 0.75) {
    const lean = R(-0.15, 0.15) * h, pts = []
    for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push([x + lean * t * t + fbm(t * 3 + x) * h * 0.08, base - h * t]) }
    stroke(pts, h * 0.05 + 3, 2.5, a * 0.7, 0.1, 0.5)
    const n = Math.round(R(6, 9))
    for (let i = 0; i < n; i++) {
      const t = 0.3 + (i / n) * 0.68, p = pts[Math.round(t * 8)]
      const side = i % 2 ? 1 : -1, rx = h * R(0.2, 0.36) * (1.25 - t * 0.6), cxp = p[0] + side * rx * R(0.2, 0.6)
      line(p[0], p[1], cxp, p[1] - R(2, 8), 2, a * 0.5)
      pineCluster(cxp, p[1] - R(2, 8), rx, R(6, 11), a)
    }
    pineCluster(pts[8][0], pts[8][1], h * 0.1, 7, a)
  }
  function willow(x, base, h, a = 0.35) {
    const top = [x + R(-20, 20), base - h]
    stroke([[x, base], [x + R(-8, 8), base - h * 0.5], top], 8, 3, a * 1.4, 0.1)
    for (let i = 0; i < 46; i++) {
      const sx = top[0] + R(-h * 0.35, h * 0.35), sy = top[1] + R(-h * 0.1, h * 0.25), len = R(h * 0.35, h * 0.8), dir = sx < top[0] ? -1 : 1
      const pts = []; for (let j = 0; j <= 10; j++) { const t = j / 10; pts.push([sx + dir * Math.sin(t * 1.4) * len * 0.18, sy - h * 0.06 * Math.sin(t * 3) + t * len]) }
      stroke(pts, 1.6, 0.8, a * R(0.4, 0.9), 0.35, 0.3)
    }
  }
  function leafyTree(x, base, h, a = 0.4) {
    stroke([[x, base], [x + R(-6, 6), base - h * 0.6]], 5, 2, a, 0.1)
    for (let i = 0; i < 70; i++) {
      const ang = R(0, 6.28), rad = Math.sqrt(r()) * h * 0.38
      ctx.fillStyle = ink(a * R(0.3, 0.8)); ctx.beginPath()
      ctx.arc(x + Math.cos(ang) * rad * 1.2, base - h * 0.65 + Math.sin(ang) * rad * 0.8, R(2, 4.5), 0, 6.283); ctx.fill()
    }
  }
  function roof(x, y, w, h, a = 0.6) {
    const e = w * 0.13
    const p = new Path2D(`M${x - w / 2 - e} ${y + h * 0.18} Q${x - w / 2} ${y} ${x - w * 0.3} ${y - h} L${x + w * 0.3} ${y - h} Q${x + w / 2} ${y} ${x + w / 2 + e} ${y + h * 0.18} Q${x} ${y - h * 0.12} ${x - w / 2 - e} ${y + h * 0.18} Z`)
    ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = '#000'
    ctx.fill(p); ctx.fillRect(x - w * 0.36, y, w * 0.72, h * 0.9); ctx.restore()
    ctx.fillStyle = ink(a * 0.3); ctx.fill(p)
    for (let i = 0; i < 14; i++) { const tx = x - w * 0.32 + (i / 13) * w * 0.64; line(tx, y - h * 0.95, tx + (tx - x) * 0.25, y - h * 0.05, 1, a * 0.35) }
    ctx.strokeStyle = ink(a); ctx.lineWidth = 2.2; ctx.stroke(p)
    line(x - w * 0.31, y - h, x + w * 0.31, y - h, 4.5, a)
    for (let i = 0; i < 4; i++) { const px = x - w * 0.32 + (i / 3) * w * 0.64; line(px, y + 2, px, y + h * 0.85, 1.6, a * 0.55) }
    line(x - w * 0.36, y + h * 0.85, x + w * 0.36, y + h * 0.85, 1.4, a * 0.4)
  }
  function mist(cx, cy, rx, ry, a) {
    ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.filter = `blur(${Math.round(ry * 0.6)}px)`
    ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 6.283); ctx.fill(); ctx.restore()
  }

  // ================= composition =================
  ctx.clearRect(0, 0, W, H)

  // far range
  {
    const off = R(0, 50)
    const fn = x => 600 - 80 * Math.pow(Math.max(0, Math.sin((x / W) * Math.PI * 1.3 + 0.4)), 1.5) - fbm(x / 160 + off) * 60
    const pts = profilePts(fn, 0, W, 6)
    ctx.save(); ctx.filter = 'blur(5px)'
    const g = ctx.createLinearGradient(0, 480, 0, 820); g.addColorStop(0, ink(0.16)); g.addColorStop(1, ink(0))
    ctx.fillStyle = g; polyPath(pts, 900); ctx.fill(); ctx.restore()
    stroke(pts.filter((_, i) => i % 2 === 0), 2.5, 1.5, 0.12, 0.45, 0.6)
  }

  // left and right ridge clusters (behind the main rock)
  texturedRidge(300, 300, 860, 400, { sc: 110, rough: 0.28, dots: 4, wash: 0.24, sharp: 1.1 })
  texturedRidge(640, 280, 900, 360, { sc: 100, rough: 0.3, dots: 4, wash: 0.26, sharp: 1.2, trees: true })
  texturedRidge(2180, 320, 880, 430, { sc: 120, rough: 0.26, dots: 4, wash: 0.24, sharp: 1.1 })
  texturedRidge(1930, 240, 930, 330, { sc: 90, rough: 0.3, dots: 4, wash: 0.26, sharp: 1.3, trees: true })
  mist(1200, 820, 900, 70, 0.55)

  // the main rain-darkened rock face
  {
    const cx = 1240, hw = 340, base = 980, h = 800
    const fn = ridgeFn(cx, hw, base, h, 0.07, 170, 0.5, R(0, 100))
    const pts = profilePts(fn, cx - hw, cx + hw, 3)
    knockout(pts, base + 200, 1)
    ctx.save(); polyPath(pts, base + 200); ctx.clip()
    for (let pass = 0; pass < 3; pass++) {
      const g = ctx.createLinearGradient(0, base - h, 0, base)
      g.addColorStop(0, ink(0.32)); g.addColorStop(0.55, ink(0.18)); g.addColorStop(1, ink(0.02))
      ctx.filter = `blur(${2 + pass * 3}px)`; ctx.fillStyle = g
      ctx.save(); ctx.translate(R(-6, 6), R(-6, 6)); polyPath(pts, base + 200); ctx.fill(); ctx.restore()
    }
    ctx.filter = 'none'
    // the sweeping vertical strokes that give the wet rock its weight
    for (let i = 0; i < 150; i++) {
      const x0 = R(cx - hw * 0.95, cx + hw * 0.95), y0 = fn(x0) + R(-4, 50)
      const len = (base - y0) * R(0.3, 0.95), drift = (x0 - cx) * R(0.12, 0.3)
      const pts2 = []; for (let j = 0; j <= 12; j++) { const t = j / 12; pts2.push([x0 + drift * Math.pow(t, 1.4) + fbm(x0 + t * 2) * 6, y0 + len * t]) }
      const dark = r() < 0.25
      stroke(pts2, dark ? R(4, 8) : R(7, 20), 2, dark ? R(0.25, 0.45) : R(0.08, 0.2), 0.3, 1)
    }
    // pale wet streaks where light catches the rock
    ctx.globalCompositeOperation = 'destination-out'
    for (let i = 0; i < 22; i++) {
      const x0 = R(cx - hw * 0.8, cx + hw * 0.8), y0 = fn(x0) + R(30, 160), len = R(120, 380), drift = (x0 - cx) * 0.2
      stroke([[x0, y0], [x0 + drift * 0.5, y0 + len * 0.5], [x0 + drift, y0 + len]], R(5, 14), 2, R(0.12, 0.3), 0.4)
    }
    ctx.globalCompositeOperation = 'source-over'
    ctx.restore()
    stroke(pts, 6, 3, 0.55, 0.25, 1)
    // crags along the base of the rock
    for (let i = 0; i < 40; i++) dot(R(cx - hw, cx + hw), base - R(20, 160), R(2.5, 4.5), R(0.3, 0.7))
  }

  // a dark rounded boulder to the right of the main rock
  {
    const cx = 1640, hw = 170, base = 760, h = 330
    const fn = ridgeFn(cx, hw, base, h, 0.06, 90, 0.6, R(0, 100))
    const pts = profilePts(fn, cx - hw, cx + hw, 3)
    knockout(pts, base + 100, 1)
    ctx.save(); polyPath(pts, base + 100); ctx.clip()
    const g = ctx.createLinearGradient(0, base - h, 0, base); g.addColorStop(0, ink(0.6)); g.addColorStop(0.5, ink(0.35)); g.addColorStop(1, ink(0.05))
    ctx.filter = 'blur(3px)'; ctx.fillStyle = g; polyPath(pts, base + 100); ctx.fill(); ctx.filter = 'none'
    for (let i = 0; i < 40; i++) { const x0 = R(cx - hw * 0.9, cx + hw * 0.9), y0 = fn(x0); stroke([[x0, y0], [x0 + (x0 - cx) * 0.15, y0 + R(60, 200)]], R(5, 12), 2, R(0.15, 0.3), 0.3) }
    ctx.restore()
    stroke(pts, 5, 3, 0.6, 0.2)
  }

  // mid ridges in front of the rock, the mist settling between them
  mist(1200, 960, 1300, 80, 0.75)
  texturedRidge(1780, 300, 1030, 290, { sc: 80, rough: 0.32, dots: 5, wash: 0.3, sharp: 1.2, trees: true })
  texturedRidge(980, 260, 1050, 250, { sc: 70, rough: 0.32, dots: 5, wash: 0.28, sharp: 1.3, trees: true })
  texturedRidge(600, 300, 1070, 240, { sc: 80, rough: 0.3, dots: 5, wash: 0.26, sharp: 1.2 })
  texturedRidge(160, 260, 1080, 220, { sc: 70, rough: 0.3, dots: 4, wash: 0.22, sharp: 1.2, trees: true })
  mist(700, 1080, 900, 70, 0.8)

  // foreground hill on the right with a pine grove and roofs
  const hill = texturedRidge(1900, 640, 1400, 300, { sc: 110, rough: 0.25, sharp: 1.0, dots: 3, wash: 0.22, outline: 0.45 })
  roof(1640, 1190, 230, 62, 0.55)
  roof(2060, 1130, 170, 50, 0.5)
  const pines = []
  for (let i = 0; i < 22; i++) { const x = R(1330, 2400); pines.push([x, hill(x) + R(5, 70), R(150, 340)]) }
  pines.sort((a, b) => a[1] - b[1]).forEach(([x, y, h]) => pine(x, y, h, R(0.55, 0.85)))
  // lower left: willows and leafy trees in the mist
  mist(500, 1300, 700, 90, 0.7)
  willow(640, 1310, 220, 0.45)
  willow(860, 1330, 170, 0.38)
  leafyTree(420, 1330, 180, 0.5)
  leafyTree(1060, 1330, 140, 0.45)
  leafyTree(1180, 1320, 110, 0.4)

  // soften the bottom edge and give the paper some grain
  {
    ctx.save(); ctx.globalCompositeOperation = 'destination-out'
    const g = ctx.createLinearGradient(0, H * 0.86, 0, H); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)')
    ctx.fillStyle = g; ctx.fillRect(0, H * 0.86, W, H * 0.14)
    for (let i = 0; i < 14000; i++) { ctx.fillStyle = `rgba(0,0,0,${R(0.05, 0.25)})`; ctx.fillRect(R(0, W), R(0, H), R(1, 2.5), R(1, 2.5)) }
    ctx.restore()
  }
}
if (typeof module !== 'undefined') module.exports = paintInkWash
