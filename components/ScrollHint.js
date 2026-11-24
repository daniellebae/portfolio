// a quiet hint that "about me" continues below: a single ink brush stroke that draws
// itself downward and ends in a drop, with a small caption.
export default function ScrollHint() {
  return (
    <a href="#about" className="scroll-hint" aria-label="scroll down to about me">
      <span className="scroll-hint-label">about me</span>
      <svg viewBox="0 0 20 64" className="scroll-hint-ink" aria-hidden="true">
        <path d="M10 2 C11 16 8.5 30 10 44 C10.6 50 10 54 10 56" fill="none" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M10 53 C13 56 13.5 60 10 62 C6.5 60 7 56 10 53 Z" fill="#1a1a1a" />
      </svg>
    </a>
  )
}
