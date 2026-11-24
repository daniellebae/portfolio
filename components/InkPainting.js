import { useEffect, useRef, useState } from 'react'

// the ink-wash painting behind the about section: pinned behind the bio while you read,
// softened so the text stays easy to read. it fades in gently once loaded.
const SRC = '/images/painting.webp'

export default function InkPainting() {
  const box = useRef(null)
  const [src, setSrc] = useState(null), [on, setOn] = useState(false)
  useEffect(() => {
    // start loading a little before the section arrives
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const img = new Image(); img.src = SRC
      img.decode().catch(() => {}).then(() => { setSrc(SRC); requestAnimationFrame(() => setOn(true)) })
    }, { rootMargin: '1200px 0px' })
    io.observe(box.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={box} className="ink-sticky" aria-hidden="true">
      <div className={`ink-bg ${on ? 'in' : ''}`} style={src ? { backgroundImage: `url(${src})` } : undefined} />
    </div>
  )
}
