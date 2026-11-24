import { useCallback, useEffect, useRef, useState } from 'react'
import { loadGlowRunner } from '../lib/glowRunner'
import { typeDelay } from '../lib/typing'

const LINES = ['hi!', "you're still here?", 'click on me :)']
const GAME_LINE = ['another fun fact about me is that i love smiskis :) feel free to stick around and play the smiski game']

// types each line with the same choppy rhythm as the hero, backspaces, then types the next
function useTyping(LINES, start) {
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

// a red name seal (dojang) reading 배시원: 배 down the right column, 시원 down the left
function NameSeal() {
  const RED = '#c4342d', font = "'Nanum Gothic Coding','Apple SD Gothic Neo','Malgun Gothic',sans-serif"
  const ch = (t, x, y, sy) => (
    <text transform={`translate(${x} ${y}) scale(1 ${sy})`} textAnchor="middle" dominantBaseline="central" fontSize="27" fontWeight="700"
      fill={RED} stroke={RED} strokeWidth="1.4" strokeLinejoin="round" fontFamily={font}>{t}</text>
  )
  return (
    <svg viewBox="0 0 100 100" className="name-seal" aria-hidden="true">
      <defs>
        <filter id="seal-worn">
          <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="11" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -9 0 0 0 6" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" />
        </filter>
      </defs>
      <g filter="url(#seal-worn)">
        <rect x="4" y="4" width="92" height="92" rx="5" fill={RED} />
        <rect x="15" y="15" width="70" height="70" rx="2" fill="#fff" />
        <rect x="49.2" y="19" width="1.6" height="62" fill={RED} />
        {ch('배', 67, 50, 2)}
        {ch('시', 33, 33, 1.05)}
        {ch('원', 33, 67, 1.05)}
      </g>
    </svg>
  )
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
  const line = useTyping(GAME_LINE, true)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6" style={{ background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(18px)' }}
      role="dialog" aria-modal="true" aria-label="glow runner game" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-3xl bg-white rounded-3xl p-6 md:p-10" style={{ border: '1px solid var(--line)', boxShadow: '0 30px 80px rgba(0,0,0,.08)' }}>
        <div className="flex justify-between items-start mb-6">
          <div className="pr-6"><p className="game-line" aria-label={GAME_LINE[0]}><span aria-hidden="true">{line}<span className="caret" /></span></p><h2 className="text-2xl font-normal">glow runner</h2></div>
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
  const [seen, setSeen] = useState(false)
  const btn = useRef(null)
  const text = useTyping(LINES, seen)

  useEffect(() => { loadGlowRunner().catch(() => {}) }, []) // warm up the game in the background
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold: 0.6 })
    btn.current && io.observe(btn.current); return () => io.disconnect()
  }, [])

  const close = useCallback(() => { setOpen(false); btn.current && btn.current.focus({ preventScroll: true }) }, [])

  return (
    <div data-no-decrypt>
      <button ref={btn} onClick={() => setOpen(true)} className="egg" aria-label="hi! you're still here? click on me to play a little game">
        <span className="egg-line" aria-hidden="true">{text}<span className="caret" /></span>
        <NameSeal />
      </button>
      {open && <GameModal onClose={close} />}
    </div>
  )
}
