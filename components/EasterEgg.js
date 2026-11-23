import { useCallback, useEffect, useRef, useState } from 'react'
import { loadGlowRunner } from '../lib/glowRunner'
import { typeDelay } from '../lib/typing'

const LINES = ['hi!', "you're still here?", 'click on me :)']

// types each line with the same choppy rhythm as the hero, backspaces, then types the next
function useBubble(start) {
  const [line, setLine] = useState(0); const [n, setN] = useState(0); const [erasing, setErasing] = useState(false)
  useEffect(() => {
    if (!start) return
    const text = LINES[line]; let t
    if (!erasing) {
      if (n < text.length) t = setTimeout(() => setN(n + 1), n === 0 ? 500 : typeDelay(text, n))
      else if (line < LINES.length - 1) t = setTimeout(() => setErasing(true), 1300)
    } else if (n > 0) t = setTimeout(() => setN(n - 1), 34)
    else { setErasing(false); setLine(line + 1) }
    return () => clearTimeout(t)
  }, [start, line, n, erasing])
  return LINES[line].slice(0, n)
}

// the little pixel buddy, drawn from the game's own sprite data
function Buddy({ ready }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ready) return
    const { frames, palette } = window.GLOW_SPRITES
    const ctx = ref.current.getContext('2d')
    const draw = blink => {
      ctx.clearRect(0, 0, 16, 19)
      frames.run1.forEach((row, j) => [...row].forEach((ch, i) => {
        const c = palette[blink && ch === 'k' ? 'g' : ch]
        if (c) { ctx.fillStyle = c; ctx.fillRect(i, j, 1, 1) }
      }))
    }
    draw(false)
    let t1, t2
    const loop = () => { t1 = setTimeout(() => { draw(true); t2 = setTimeout(() => { draw(false); loop() }, 140) }, 2200 + Math.random() * 2600) }
    loop()
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [ready])
  return <canvas ref={ref} width={16} height={19} className="buddy" aria-hidden="true" />
}

function GameModal({ onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    let game = null, alive = true
    loadGlowRunner().then(() => {
      if (!alive || !ref.current) return
      game = window.GlowRunner.mount(ref.current)
      ref.current.focus({ preventScroll: true })
    })
    const k = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    const overflow = document.body.style.overflow; document.body.style.overflow = 'hidden'
    return () => { alive = false; game && game.destroy(); window.removeEventListener('keydown', k); document.body.style.overflow = overflow }
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6" style={{ background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(18px)' }}
      role="dialog" aria-modal="true" aria-label="glow runner game" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-3xl bg-white rounded-3xl p-6 md:p-10" style={{ border: '1px solid var(--line)', boxShadow: '0 30px 80px rgba(0,0,0,.08)' }}>
        <div className="flex justify-between items-start mb-6">
          <div><p className="eyebrow">you found me!</p><h2 className="text-2xl font-normal">glow runner</h2></div>
          <button className="btn" onClick={onClose}>close</button>
        </div>
        <canvas ref={ref} />
        <p className="text-center text-[11px] mt-5" style={{ color: '#8a8a8a' }}>space / ↑ jump · ↓ duck (swipe down on mobile) · a new friend every round</p>
      </div>
    </div>
  )
}

export default function EasterEgg() {
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const [seen, setSeen] = useState(false)
  const btn = useRef(null)
  const text = useBubble(seen)

  useEffect(() => { loadGlowRunner().then(() => setReady(true)).catch(() => {}) }, [])
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold: 0.6 })
    btn.current && io.observe(btn.current); return () => io.disconnect()
  }, [])

  const close = useCallback(() => { setOpen(false); btn.current && btn.current.focus({ preventScroll: true }) }, [])

  return (
    <div data-no-decrypt>
      <button ref={btn} onClick={() => setOpen(true)} className="egg" aria-label="hi! you're still here? click on me to play a little game">
        <span className="egg-bubble" aria-hidden="true">{text}<span className="caret" /></span>
        <Buddy ready={ready} />
      </button>
      {open && <GameModal onClose={close} />}
    </div>
  )
}
