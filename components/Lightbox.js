import { useEffect, useState } from 'react'
// full-screen viewer for graphics and photos: arrows / swipe-free buttons, esc to close
export default function Lightbox({ items, index, onClose }) {
  const [i, setI] = useState(index)
  const shown = items.filter(x => x.src), cur = shown.indexOf(items[index])
  useEffect(() => setI(cur < 0 ? 0 : cur), [cur])
  useEffect(() => {
    const k = e => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') setI(n => (n + 1) % shown.length); if (e.key === 'ArrowLeft') setI(n => (n - 1 + shown.length) % shown.length) }
    window.addEventListener('keydown', k); const o = document.body.style.overflow; document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = o }
  }, [onClose, shown.length])
  const it = shown[i]; if (!it) return null
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6" style={{ background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(18px)' }} role="dialog" aria-modal="true" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <button className="btn absolute top-5 right-5" onClick={onClose}>close</button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={it.src} alt={it.caption || ''} style={{ maxWidth: '92vw', maxHeight: '78vh', borderRadius: 16, objectFit: 'contain' }} />
      <div className="flex items-center gap-6 mt-5 text-xs" style={{ color: '#6b6b6b' }}>
        {shown.length > 1 && <button className="btn" onClick={() => setI((i - 1 + shown.length) % shown.length)} aria-label="previous">←</button>}
        <span>{it.caption}</span>
        {shown.length > 1 && <button className="btn" onClick={() => setI((i + 1) % shown.length)} aria-label="next">→</button>}
      </div>
    </div>
  )
}
