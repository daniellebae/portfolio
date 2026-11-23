import { useEffect, useRef, useState } from 'react'
import { decrypt } from '../lib/decrypt'
export default function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null); const [on, setOn] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { threshold: 0.15 })
    ref.current && io.observe(ref.current); return () => io.disconnect()
  }, [])
  // text inside decrypts as the block fades in
  useEffect(() => {
    if (!on) return
    let cancel = () => {}
    const t = setTimeout(() => { cancel = decrypt(ref.current) }, delay)
    return () => { clearTimeout(t); cancel() }
  }, [on, delay])
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${on ? 'in' : ''} ${className}`}>{children}</div>
}
