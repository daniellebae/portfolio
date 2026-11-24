import { useState } from 'react'
export default function Img({ src, alt, className = '', style }) {
  const [bad, setBad] = useState(false)
  if (!src || bad) return <div className={`ph ${className}`} style={style}>photo goes here</div>
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} onError={() => setBad(true)} className={className} style={{ objectFit: 'cover', borderRadius: 20, ...style }} />
}
