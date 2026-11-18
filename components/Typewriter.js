import { useEffect, useState } from 'react'
const TEXT = "hi! i'm danielle. welcome to my world :)"
export default function Typewriter() {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n >= TEXT.length) return
    // choppy: uneven delays, longer beats after punctuation, the odd hesitation
    let d = 70 + Math.random() * 150
    if (Math.random() < 0.12) d += 220
    if ('!.'.includes(TEXT[n - 1])) d += 350
    const t = setTimeout(() => setN(n + 1), n === 0 ? 900 : d)
    return () => clearTimeout(t)
  }, [n])
  return (
    <h1 aria-label={TEXT} className="text-[clamp(26px,3.6vw,40px)] leading-snug font-light" style={{ minHeight: '3.4em' }}>
      <span aria-hidden="true">{TEXT.slice(0, n)}<span className="caret" /></span>
    </h1>
  )
}
