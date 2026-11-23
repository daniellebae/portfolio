import { useEffect, useRef, useState } from 'react'
import { decrypt } from '../lib/decrypt'
const links = [['resume','resume'],['gallery','gallery'],['campaigns','my campaigns'],['about','about me'],['writing','written works'],['contact','contact']]
export default function Nav() {
  const [active, setActive] = useState(''); const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => decrypt(ref.current), [])
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    links.forEach(([id]) => { const el = document.getElementById(id); el && io.observe(el) }); return () => io.disconnect()
  }, [])
  return (
    <header ref={ref} data-decrypt-early className="fixed top-0 inset-x-0 z-40" style={{ background: 'rgba(255,255,255,.82)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap flex items-center justify-between" style={{ height: 56 }}>
        <a href="#top" className="text-sm font-normal">danielle</a>
        <button className="md:hidden text-sm min-h-[44px] px-2" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'close' : 'menu'}</button>
        <nav className={`${open ? 'flex' : 'hidden'} md:flex absolute md:static top-14 inset-x-0 flex-col md:flex-row gap-1 md:gap-7 bg-white md:bg-transparent p-6 md:p-0 border-b md:border-0`}>
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="text-[13px] py-2 md:py-0" style={{ color: active === id ? '#111' : '#7a7a7a' }}>{label}</a>
          ))}
        </nav>
      </div>
    </header>
  )
}
