import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
const links = [['/resume', 'resume'], ['/gallery', 'gallery'], ['/campaigns', 'my campaigns'], ['/#about', 'about me'], ['/writing', 'written works'], ['/contact', 'contact']]
export default function Nav() {
  const { pathname } = useRouter(); const [open, setOpen] = useState(false)
  const isActive = href => href === '/#about' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')
  return (
    <header className="fixed top-0 inset-x-0 z-40" style={{ background: 'rgba(255,255,255,.82)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap flex items-center justify-between" style={{ height: 56 }}>
        <Link href="/" className="text-sm font-normal">danielle</Link>
        <button className="md:hidden text-sm min-h-[44px] px-2" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'close' : 'menu'}</button>
        <nav className={`${open ? 'flex' : 'hidden'} md:flex absolute md:static top-14 inset-x-0 flex-col md:flex-row gap-1 md:gap-7 bg-white md:bg-transparent p-6 md:p-0 border-b md:border-0`}>
          {links.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={isActive(href) ? 'page' : undefined}
              className="text-[13px] py-2 md:py-0" style={{ color: isActive(href) ? '#111' : '#7a7a7a' }}>{label}</Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
