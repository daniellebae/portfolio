import { useEffect, useState } from 'react'
// the \n is where the line breaks: the greeting always shows as exactly 2 lines
const TEXT = "hi! i'm danielle.\nwelcome to my world :)"
export default function Typewriter() {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n >= TEXT.length) return
    // choppy: uneven delays, longer beats after punctuation, the odd hesitation
    let d = 50 + Math.random() * 110
    if (Math.random() < 0.12) d += 160
    if ('!.'.includes(TEXT[n - 1])) d += 260
    const t = setTimeout(() => setN(n + 1), n === 0 ? 700 : d)
    return () => clearTimeout(t)
  }, [n])
  return (
    // the container lets the font shrink with the column so the longer line never wraps
    <div style={{ containerType: 'inline-size' }}>
      <h1 aria-label={TEXT.replace('\n', ' ')} className="typewriter leading-snug font-light" style={{ minHeight: '2.75em', whiteSpace: 'pre' }}>
        <span aria-hidden="true">{TEXT.slice(0, n)}<span className="caret" /></span>
      </h1>
    </div>
  )
}
