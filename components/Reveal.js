import { useEffect, useRef, useState } from 'react'
import { decrypt } from '../lib/decrypt'
export default function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null); const [on, setOn] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { threshold: 0.15 })
    ref.current && io.observe(ref.current); return () => io.disconnect()
  }, [])
  // titles inside decrypt as the block fades in (body text just fades)
  useEffect(() => {
    if (!on) return
    let cancels = []
    const t = setTimeout(() => { cancels = [...ref.current.querySelectorAll('h2')].map(el => decrypt(el)) }, delay)
    return () => { clearTimeout(t); cancels.forEach(c => c()) }
  }, [on, delay])
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${on ? 'in' : ''} ${className}`}>{children}</div>
}
