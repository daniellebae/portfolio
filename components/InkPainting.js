import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/decrypt'

// the ink-wash painting behind the about section (pre-rendered by scripts/ink-wash).
// it stays pinned behind the bio while you read, and paints itself in the first time
// you arrive: fat drops of water fall, land, and bloom outward, wet edges and all.
const SRC = '/images/ink-wash.webp'
const STRENGTH = 0.3            // how dark the painting shows (0–1)
const LAND = 300, SPREAD = 1500 // ms: drop falling, bloom spreading

const ease = p => 1 - Math.pow(1 - p, 3)
const clamp = p => Math.max(0, Math.min(1, p))

function blobPath(ctx, d, rad) {
  ctx.moveTo(d.x + rad * d.shape(0), d.y)
  for (let i = 1; i <= 40; i++) {
    const a = (i / 40) * Math.PI * 2, k = rad * d.shape(a)
    ctx.lineTo(d.x + Math.cos(a) * k, d.y + Math.sin(a) * k)
  }
  ctx.closePath()
}

export default function InkPainting() {
  const box = useRef(null), cv = useRef(null)

  useEffect(() => {
    const canvas = cv.current, ctx = canvas.getContext('2d')
    const img = new Image()
    let loaded = false, visible = false, started = false, done = false, raf = 0
    let dpr = 1, W = 0, H = 0, ix = 0, iy = 0, iw = 0, ih = 0, drops = []

    function layout() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const b = canvas.getBoundingClientRect()
      W = canvas.width = Math.max(1, Math.round(b.width * dpr))
      H = canvas.height = Math.max(1, Math.round(b.height * dpr))
      if (!loaded) return
      const s = Math.max(W / img.width, H / img.height) // cover, keeping the main rock in view
      iw = img.width * s; ih = img.height * s; ix = (W - iw) * 0.62; iy = (H - ih) * 0.4
    }

    function paint() { ctx.globalAlpha = STRENGTH; ctx.drawImage(img, ix, iy, iw, ih); ctx.globalAlpha = 1 }
    // keep the left side, where the bio sits, extra light
    function readable() {
      ctx.save(); ctx.globalCompositeOperation = 'destination-out'
      const g = ctx.createLinearGradient(0, 0, W, 0)
      if (W / dpr >= 768) { g.addColorStop(0, 'rgba(0,0,0,.6)'); g.addColorStop(0.6, 'rgba(0,0,0,0)') }
      else { g.addColorStop(0, 'rgba(0,0,0,.35)'); g.addColorStop(1, 'rgba(0,0,0,.35)') }
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore()
    }
    function full() { ctx.clearRect(0, 0, W, H); paint(); readable() }

    function plan() {
      const wide = W / dpr >= 768, cols = wide ? 4 : 2, rows = wide ? 3 : 4
      const cw = W / cols, ch = H / rows, cells = []
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) cells.push([i, j])
      // start near the main rock and spread outward, with a little randomness
      cells.sort((a, b) => Math.hypot(a[0] - cols * 0.6, a[1] - rows * 0.35) - Math.hypot(b[0] - cols * 0.6, b[1] - rows * 0.35) + (Math.random() - 0.5) * 1.2)
      const mk = (x, y, R, t0) => {
        const ph = [Math.random() * 6, Math.random() * 6, Math.random() * 6]
        return { x, y, R, t0, dr: (14 + Math.random() * 12) * dpr, shape: a => 1 + 0.07 * Math.sin(3 * a + ph[0]) + 0.05 * Math.sin(5 * a + ph[1]) + 0.03 * Math.sin(9 * a + ph[2]) }
      }
      drops = cells.map(([i, j], n) => mk((i + 0.5 + (Math.random() - 0.5) * 0.3) * cw, (j + 0.5 + (Math.random() - 0.5) * 0.3) * ch, Math.hypot(cw, ch) * 0.82, n * 120 + Math.random() * 60))
      for (let k = 0; k < 5; k++) drops.push(mk(Math.random() * W, Math.random() * H, Math.hypot(cw, ch) * (0.25 + Math.random() * 0.15), 200 + Math.random() * 1200))
    }

    function drawDrop(d, e) {
      const q = (e - d.t0) / LAND
      if (q < 0) return
      let x = d.x, y = d.y, rx = d.dr, ry = d.dr, alpha = 1
      if (q < 1) { // falling: stretched, accelerating
        const f = q * q; y = d.y - (1 - f) * 70 * dpr; rx = d.dr * (0.6 + 0.4 * f); ry = d.dr * (1.4 - 0.4 * f); alpha = 0.3 + 0.7 * q
      } else { // landed: squashes, spreads thin and fades into the bloom
        const g = clamp((e - d.t0 - LAND) / (SPREAD * 0.45))
        if (g >= 1) return
        rx = d.dr * (1.15 + g * 1.6); ry = d.dr * (0.85 + g * 1.2); alpha = 1 - g
      }
      ctx.save(); ctx.globalAlpha = alpha
      const gr = ctx.createRadialGradient(x - rx * 0.3, y - ry * 0.35, 1, x, y, Math.max(rx, ry))
      gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(0.35, 'rgba(225,230,224,.55)'); gr.addColorStop(0.85, 'rgba(120,128,118,.28)'); gr.addColorStop(1, 'rgba(70,76,68,.45)')
      ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = 'rgba(60,66,58,.35)'; ctx.lineWidth = 1.2 * dpr; ctx.stroke()
      ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.ellipse(x - rx * 0.35, y - ry * 0.4, rx * 0.22, ry * 0.14, -0.5, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    }

    function frame(t0) {
      const step = t => {
        const e = t - t0
        ctx.clearRect(0, 0, W, H)
        ctx.save(); ctx.beginPath()
        let any = false, busy = false
        drops.forEach(d => {
          const p = clamp((e - d.t0 - LAND) / SPREAD)
          if (p < 1 || e < d.t0 + LAND + SPREAD * 0.45) busy = true
          if (p > 0) { any = true; blobPath(ctx, d, d.R * ease(p)) }
        })
        if (any) { ctx.clip(); paint() }
        ctx.restore()
        readable()
        // the darker wet edge of each spreading bloom
        drops.forEach(d => {
          const p = clamp((e - d.t0 - LAND) / SPREAD)
          if (p <= 0 || p >= 1) return
          ctx.save(); ctx.globalAlpha = 0.1 * (1 - p) * (1 - p); ctx.strokeStyle = 'rgb(70,70,62)'; ctx.lineWidth = (1 + 1.5 * (1 - p)) * dpr
          ctx.beginPath(); blobPath(ctx, d, d.R * ease(p)); ctx.stroke(); ctx.restore()
        })
        drops.forEach(d => drawDrop(d, e))
        if (busy) raf = requestAnimationFrame(step)
        else { done = true; full() }
      }
      raf = requestAnimationFrame(step)
    }

    function maybeStart() {
      if (started || !loaded || !visible) return
      started = true; layout()
      if (prefersReducedMotion()) { done = true; full(); return }
      plan(); frame(performance.now())
    }

    // fetch + decode well before the section arrives, so there's no hitch on the way in
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      near.disconnect(); img.src = SRC
      img.decode().catch(() => {}).then(() => { loaded = img.naturalWidth > 0; maybeStart() })
    }, { rootMargin: '1500px 0px' })
    const seen = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      seen.disconnect(); visible = true; maybeStart()
    }, { rootMargin: '0px 0px -35% 0px' })
    near.observe(box.current); seen.observe(box.current)

    const onResize = () => { if (!started) return; layout(); if (done) full() }
    window.addEventListener('resize', onResize)
    return () => { near.disconnect(); seen.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  return <div ref={box} className="ink-sticky" aria-hidden="true"><canvas ref={cv} /></div>
}
