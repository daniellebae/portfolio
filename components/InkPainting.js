import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/decrypt'

// an ink-wash (sumukhwa) mountain landscape, drawn procedurally in very light warm greys
// so the bio on top stays easy to read. it splashes in like watercolor the first time
// the section scrolls into view.

const W = 1440, H = 900
const INK = '#6f6f64'
const f = n => Math.round(n * 10) / 10

function rng(seed) { // deterministic, so server and browser draw the same painting
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function bez(p0, p1, p2, p3, t) {
  const u = 1 - t
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
}

function build() {
  const r = rng(1751), R = (a, b) => a + r() * (b - a)
  const out = { far: '', domes: [], humps: [], mists: [], pines: [], drops: [] }

  // far ridge line
  const a1 = R(0, 6), a2 = R(0, 6)
  let d = `M0 ${H}`
  for (let x = 0; x <= W; x += 30) d += ` L${x} ${f(300 + 40 * Math.sin(x / 170 + a1) + 22 * Math.sin(x / 61 + a2))}`
  out.far = d + ` L${W} ${H} Z`

  // big bald rock peaks with vertical brush streaks down their faces
  ;[[1000, 230, 380], [640, 150, 250], [1330, 140, 230]].forEach(([cx, hw, h], k) => {
    const base = 540, top = base - h
    const path = `M${cx - hw} ${base} C${cx - hw * 0.95} ${f(top + h * 0.35)} ${f(cx - hw * 0.55)} ${top} ${cx} ${top} C${f(cx + hw * 0.55)} ${top} ${cx + hw * 0.95} ${f(top + h * 0.35)} ${cx + hw} ${base} Z`
    const streaks = []
    const n = k === 0 ? 34 : 16
    for (let i = 0; i < n; i++) {
      const x = cx - hw * 0.9 + (i / (n - 1)) * hw * 1.8 + R(-6, 6)
      const yTop = base - h * Math.sqrt(Math.max(0, 1 - ((x - cx) / hw) ** 2)) + R(4, 18)
      const len = R(60, 260)
      streaks.push({ d: `M${f(x)} ${f(yTop)} Q${f(x + (x - cx) * 0.08)} ${f(yTop + len / 2)} ${f(x + (x - cx) * 0.05)} ${f(yTop + len)}`, w: f(R(1.2, 4.5)), o: f(R(0.08, 0.24) * 100) / 100 })
    }
    out.domes.push({ path, streaks, id: `dome${k}` })
  })

  // rows of rounded hills: dark ink on top, dissolving into mist at the base, dotted with moss
  const rows = [
    { y: 420, n: 8, h: [90, 150], w: [110, 170], o: 0.5 },
    { y: 510, n: 9, h: [70, 120], w: [100, 150], o: 0.6 },
    { y: 610, n: 10, h: [60, 105], w: [90, 140], o: 0.62 },
    { y: 720, n: 9, h: [50, 90], w: [80, 130], o: 0.5 },
  ]
  rows.forEach((row, ri) => {
    for (let i = 0; i < row.n; i++) {
      const cx = (i + R(0.1, 0.9)) * (W / row.n), hw = R(...row.w), h = R(...row.h)
      const base = row.y + R(-20, 20), top = base - h
      const o = row.o * (0.5 + 0.5 * (cx / W)) // a little lighter on the left, where the text sits
      const pts = [cx - hw, cx - hw * 0.7, cx - hw * 0.35, cx]
      const ys = [base, top + h * 0.15, top, top]
      const right = [cx, cx + hw * 0.35, cx + hw * 0.7, cx + hw]
      const ysr = [top, top, top + h * 0.15, base]
      const path = `M${f(pts[0])} ${f(ys[0])} C${f(pts[1])} ${f(ys[1])} ${f(pts[2])} ${f(ys[2])} ${f(pts[3])} ${f(ys[3])} C${f(right[1])} ${f(ysr[1])} ${f(right[2])} ${f(ysr[2])} ${f(right[3])} ${f(ysr[3])} Z`
      const dots = []
      const nd = (R(5, 11)) | 0
      for (let j = 0; j < nd; j++) {
        const t = R(0.05, 0.95), left = t < 0.5, tt = left ? t * 2 : (t - 0.5) * 2
        const X = left ? bez(...pts, tt) : bez(...right, tt), Y = left ? bez(...ys, tt) : bez(...ysr, tt)
        dots.push({ x: f(X + R(-4, 4)), y: f(Y + R(2, 16)), rx: f(R(3, 5.5)), ry: f(R(1.5, 2.4)), a: f(R(-20, 20)) })
      }
      out.humps.push({ path, top: `M${f(pts[0] + hw * 0.25)} ${f(bez(...ys, 0.25))} C${f(pts[2])} ${f(top)} ${f(right[1])} ${f(top)} ${f(right[3] - hw * 0.25)} ${f(bez(...ysr, 0.75))}`, dots, o: f(o * 100) / 100, row: ri })
    }
    for (let m = 0; m < 3; m++) out.mists.push({ row: ri, cx: f(R(0, W)), cy: f(row.y + R(0, 30)), rx: f(R(260, 480)), ry: f(R(30, 55)) })
  })

  // pines in the lower right
  for (let i = 0; i < 9; i++) {
    const x = R(1020, 1420), base = R(800, 900), h = R(110, 220), lean = R(-30, 30)
    const tx = x + lean, ty = base - h
    const clusters = []
    for (let c = 0; c < 5; c++) {
      const t = 0.45 + c * 0.13
      clusters.push({ x: f(x + lean * t + R(-14, 14)), y: f(base - h * t), rx: f(R(22, 42) * (1.15 - t * 0.5)), ry: f(R(6, 10)) })
    }
    out.pines.push({ trunk: `M${f(x)} ${f(base)} Q${f(x + lean * 0.2)} ${f(base - h / 2)} ${f(tx)} ${f(ty)}`, clusters })
  }

  // a few splattered drops of ink
  for (let i = 0; i < 16; i++) out.drops.push({ x: f(R(820, 1420)), y: f(R(40, 300)), r: f(R(1.5, 6)) })
  return out
}

const ART = build()
// the splash: watercolor blooms that grow outward to reveal the painting
const BLOOMS = [
  { cx: 1050, cy: 330, r: 820, delay: 0 },
  { cx: 1330, cy: 760, r: 560, delay: 140 },
  { cx: 420, cy: 420, r: 640, delay: 240 },
  { cx: 760, cy: 800, r: 560, delay: 380 },
  { cx: 120, cy: 120, r: 480, delay: 480 },
]

export default function InkPainting() {
  const svg = useRef(null)
  const blooms = useRef([])

  useEffect(() => {
    const els = blooms.current
    const finish = () => els.forEach((c, i) => c && c.setAttribute('r', BLOOMS[i].r))
    if (prefersReducedMotion()) { finish(); return }
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now(), DUR = 1700
      const step = t => {
        let busy = false
        els.forEach((c, i) => {
          const p = Math.min(1, Math.max(0, (t - start - BLOOMS[i].delay) / DUR))
          if (p < 1) busy = true
          c && c.setAttribute('r', (BLOOMS[i].r * (1 - Math.pow(1 - p, 3))).toFixed(1))
        })
        if (busy) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, { threshold: 0.2 })
    io.observe(svg.current)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [])

  const rowEls = ri => (
    <g key={`row${ri}`}>
      {ART.humps.filter(h => h.row === ri).map((h, i) => (
        <g key={i} opacity={h.o}>
          <path d={h.path} fill="url(#ink-ridge)" />
          <path d={h.top} fill="none" stroke={INK} strokeOpacity=".35" strokeWidth="2.5" strokeLinecap="round" />
          {h.dots.map((d, j) => <ellipse key={j} cx={d.x} cy={d.y} rx={d.rx} ry={d.ry} transform={`rotate(${d.a} ${d.x} ${d.y})`} fill={INK} fillOpacity=".45" />)}
        </g>
      ))}
      {ART.mists.filter(m => m.row === ri).map((m, i) => <ellipse key={`m${i}`} cx={m.cx} cy={m.cy} rx={m.rx} ry={m.ry} fill="#fafafa" fillOpacity=".9" filter="url(#ink-mist)" />)}
    </g>
  )

  return (
    <svg ref={svg} className="ink-painting" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <filter id="ink-wc" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="3" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="14" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="0.7" />
        </filter>
        <filter id="ink-mist" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="16" /></filter>
        <filter id="ink-far" x="-5%" y="-20%" width="110%" height="140%"><feGaussianBlur stdDeviation="3" /></filter>
        <filter id="ink-splash" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="9" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="110" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="ink-grain">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="2" />
          <feColorMatrix values="0 0 0 0 .44  0 0 0 0 .44  0 0 0 0 .4  0 0 0 .07 0" />
        </filter>
        <linearGradient id="ink-ridge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={INK} stopOpacity=".5" />
          <stop offset=".45" stopColor={INK} stopOpacity=".2" />
          <stop offset="1" stopColor={INK} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ink-dome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={INK} stopOpacity=".42" />
          <stop offset=".6" stopColor={INK} stopOpacity=".2" />
          <stop offset="1" stopColor={INK} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ink-read" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fafafa" stopOpacity=".75" />
          <stop offset=".55" stopColor="#fafafa" stopOpacity="0" />
        </linearGradient>
        {ART.domes.map(dm => <clipPath key={dm.id} id={`ink-${dm.id}`}><path d={dm.path} /></clipPath>)}
        <mask id="ink-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <rect width={W} height={H} fill="#000" />
          <g filter="url(#ink-splash)" fill="#fff">
            {BLOOMS.map((b, i) => <circle key={i} ref={el => { blooms.current[i] = el }} cx={b.cx} cy={b.cy} r="0" />)}
          </g>
        </mask>
      </defs>

      <g mask="url(#ink-reveal)">
        <g filter="url(#ink-wc)">
          <path d={ART.far} fill={INK} fillOpacity=".1" filter="url(#ink-far)" />
          {ART.domes.map(dm => (
            <g key={dm.id}>
              <path d={dm.path} fill="url(#ink-dome)" />
              <g clipPath={`url(#ink-${dm.id})`}>
                {dm.streaks.map((s, i) => <path key={i} d={s.d} stroke={INK} strokeOpacity={s.o} strokeWidth={s.w} strokeLinecap="round" fill="none" />)}
              </g>
            </g>
          ))}
          {[0, 1, 2, 3].map(rowEls)}
          {ART.pines.map((p, i) => (
            <g key={i} opacity=".55">
              <path d={p.trunk} stroke={INK} strokeOpacity=".7" strokeWidth="3" fill="none" strokeLinecap="round" />
              {p.clusters.map((c, j) => <ellipse key={j} cx={c.x} cy={c.y} rx={c.rx} ry={c.ry} fill={INK} fillOpacity=".5" />)}
            </g>
          ))}
          <g transform="translate(1185 742)" opacity=".5">
            <path d="M-64 0 Q-34 -5 -20 -28 L20 -28 Q34 -5 64 0 Q0 -9 -64 0 Z" fill={INK} fillOpacity=".55" />
            <rect x="-36" y="0" width="72" height="22" fill={INK} fillOpacity=".18" />
          </g>
          {ART.drops.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={INK} fillOpacity=".3" />)}
        </g>
        <rect width={W} height={H} filter="url(#ink-grain)" />
      </g>
      <rect width={W} height={H} fill="url(#ink-read)" />
    </svg>
  )
}
