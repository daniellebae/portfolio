// a red korean-style seal (dojang) that switches the bio's language
const RED = '#c4342d'
export default function Stamp({ text, hint, label, onClick }) {
  const hangul = /[가-힣]/.test(text)
  return (
    <button className="stamp" onClick={onClick} aria-label={label}>
      <span className="stamp-hint">{hint}</span>
      <svg key={text} viewBox="0 0 100 100" className="stamp-seal" aria-hidden="true">
        <defs>
          <filter id="stamp-worn">
            <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="5" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -9 0 0 0 6" result="m" />
            <feComposite in="SourceGraphic" in2="m" operator="in" />
          </filter>
        </defs>
        <g filter="url(#stamp-worn)">
          <rect x="4" y="4" width="92" height="92" rx="5" fill={RED} />
          <rect x="15" y="15" width="70" height="70" rx="2" fill="#fff" />
          <text transform="translate(50 52) scale(1 1.5)" textAnchor="middle" dominantBaseline="central"
            fontSize={hangul ? 30 : text.length > 4 ? 24 : 29} fontWeight="700" textLength={text.length > 4 ? 64 : 60} lengthAdjust="spacingAndGlyphs"
            fill={RED} stroke={RED} strokeWidth="1.6" strokeLinejoin="round"
            fontFamily={hangul ? "'Nanum Gothic Coding','Apple SD Gothic Neo','Malgun Gothic',sans-serif" : "'Arial Rounded MT Bold','Helvetica Rounded','Arial Black',sans-serif"}>
            {text}
          </text>
        </g>
      </svg>
    </button>
  )
}
