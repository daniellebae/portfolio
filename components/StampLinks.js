import Link from 'next/link'

// a row of worn red seals under the greeting, each one a door to a page.
// hovering (or focusing) a seal lifts it and names where it goes.
const RED = '#c4342d'
const L = { fill: 'none', stroke: RED, strokeWidth: 3.2, strokeLinecap: 'round', strokeLinejoin: 'round' }

const ICONS = {
  // a sheet of paper with lines of writing
  resume: <g {...L}><path d="M33 22 H58 L68 32 V78 H33 Z" /><path d="M58 22 V32 H68" /><path d="M39 42 H62 M39 50 H62 M39 58 H62 M39 66 H54" /></g>,
  // a camera
  gallery: <g {...L}><rect x="24" y="36" width="52" height="36" rx="5" /><path d="M38 36 L42 29 H58 L62 36" /><circle cx="50" cy="54" r="11" /><circle cx="50" cy="54" r="4.5" /><path d="M66 42 H70" /></g>,
  // a short speaker cone (megaphone) with sound waves
  campaigns: <g {...L}><path d="M27 45 H37 L60 31 V73 L37 59 H27 Z" /><path d="M39 60 L43 71 H49 L46 62" /><path d="M67 43 Q72 52 67 61" /><path d="M73 37 Q82 52 73 67" /></g>,
  // an open book
  writing: <g {...L}><path d="M50 35 C43 29 31 29 24 32 V71 C31 68 43 68 50 74 C57 68 69 68 76 71 V32 C69 29 57 29 50 35 Z" /><path d="M50 35 V74" /><path d="M30 41 C35 39 40 39 44 41 M30 49 C35 47 40 47 44 49 M56 41 C60 39 65 39 70 41 M56 49 C60 47 65 47 70 49" /></g>,
  // an old desk phone with a coiled cord
  contact: <g {...L}><path d="M29 35 C29 28 71 28 71 35 L67 41 C63 42 59 39 59 36 C54 34 46 34 41 36 C41 39 37 42 33 41 Z" /><path d="M37 48 H63 L69 72 H31 Z" /><circle cx="50" cy="60" r="5.5" /><path d="M29 37 C21 40 27 44 22 47 C17 50 25 53 20 56 C15 59 23 62 19 65 C16 68 22 71 31 70" strokeWidth="2.4" /></g>,
}

const STAMPS = [
  { href: '/resume', label: 'resume', icon: 'resume', tilt: -4 },
  { href: '/gallery', label: 'photo gallery', icon: 'gallery', tilt: 3 },
  { href: '/campaigns', label: 'my campaigns', icon: 'campaigns', tilt: -2 },
  { href: '#about', label: 'about me', icon: 'initials', tilt: 4 },
  { href: '/writing', label: 'written works', icon: 'writing', tilt: -3 },
  { href: '/contact', label: 'contact me', icon: 'contact', tilt: 2 },
]

function Seal({ icon, seed }) {
  const id = `worn-${icon}`
  return (
    <svg viewBox="0 0 100 100" className="seal-svg" aria-hidden="true">
      <defs>
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed={seed} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -9 0 0 0 6" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#${id})`}>
        <rect x="4" y="4" width="92" height="92" rx="5" fill={RED} />
        <rect x="13" y="13" width="74" height="74" rx="2" fill="#fff" />
        {icon === 'initials'
          ? <text transform="translate(50 52) scale(1 1.5)" textAnchor="middle" dominantBaseline="central" fontSize="32" fontWeight="700"
              textLength="52" lengthAdjust="spacingAndGlyphs" fill={RED} stroke={RED} strokeWidth="1.6" strokeLinejoin="round"
              fontFamily="'Arial Rounded MT Bold','Helvetica Rounded','Arial Black',sans-serif">DB</text>
          : ICONS[icon]}
      </g>
    </svg>
  )
}

export default function StampLinks() {
  return (
    <nav className="stamp-links" aria-label="explore">
      {STAMPS.map((s, i) => (
        <Link key={s.href} href={s.href} className="stamp-link" style={{ '--tilt': `${s.tilt}deg` }} aria-label={`go to ${s.label}`}>
          <Seal icon={s.icon} seed={i * 7 + 3} />
          <span className="stamp-tip" aria-hidden="true">{s.label}{s.href === '#about' ? ' ↓' : ' →'}</span>
        </Link>
      ))}
    </nav>
  )
}
