import { useEffect, useState } from 'react'
import { typeDelay } from '../lib/typing'
// the \n is where the line breaks: the greeting always shows as exactly 2 lines
const TEXT = "hi!\nwelcome to my world :)"
export default function Typewriter() {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n >= TEXT.length) return
    const t = setTimeout(() => setN(n + 1), n === 0 ? 700 : typeDelay(TEXT, n))
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
