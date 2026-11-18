import { useEffect, useState } from 'react'
import { poemDirectory } from '../data/content'
export default function EasterEgg() {
  const [open, setOpen] = useState(false); const [i, setI] = useState(null)
  useEffect(() => { const k = e => e.key === 'Escape' && (i !== null ? setI(null) : setOpen(false)); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [i])
  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="made with love by danielle. open poem directory" className="group relative mx-auto block" style={{ width: 168, height: 156 }}>
        <svg viewBox="0 0 32 29" className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105" aria-hidden="true">
          <path d="M23.6 0c-3.4 0-5.7 1.9-7.6 4.2C14.1 1.9 11.8 0 8.4 0 3.7 0 0 3.800 0 8.600c0 9.200 11.3 15.3 16 20.4 4.700-5.100 16-11.200 16-20.400C32 3.800 28.300 0 23.6 0z" fill="#fff" stroke="#111" strokeWidth=".7" />
        </svg>
        <span className="relative text-[11px] leading-snug px-8 block" style={{ paddingTop: 54 }}>made with <span aria-hidden="true">♥</span><br />by danielle</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(18px)' }} role="dialog" aria-modal="true" aria-label="poem directory">
          <div className="w-full max-w-xl max-h-[80vh] overflow-auto bg-white rounded-3xl p-8 md:p-12" style={{ border: '1px solid var(--line)', boxShadow: '0 30px 80px rgba(0,0,0,.08)' }}>
            <div className="flex justify-between items-start mb-8">
              <div><p className="eyebrow">for you</p><h2 className="text-2xl font-normal">poems i love</h2></div>
              <button className="btn" onClick={() => { setOpen(false); setI(null) }}>close</button>
            </div>
            {i === null ? (
              <ul>{poemDirectory.map((p, n) => (
                <li key={n}><button onClick={() => setI(n)} className="w-full text-left py-4 min-h-[44px] flex justify-between gap-4 text-sm" style={{ borderTop: '1px solid var(--line)' }}><span>{p.title}</span><span style={{ color: '#6b6b6b' }}>{p.author}</span></button></li>
              ))}</ul>
            ) : (
              <div>
                <button className="text-xs mb-6 underline min-h-[44px]" onClick={() => setI(null)}>← all poems</button>
                <h3 className="text-lg font-normal">{poemDirectory[i].title}</h3>
                <p className="text-xs mb-6" style={{ color: '#6b6b6b' }}>{poemDirectory[i].author}</p>
                <p className="text-sm leading-8 whitespace-pre-line">{poemDirectory[i].text}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
