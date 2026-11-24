import Link from 'next/link'
export default function PrevNext({ list, i, base }) {
  const prev = list[i - 1], next = list[i + 1]
  return (
    <nav className="grid grid-cols-2 gap-4 mt-20 pt-8" style={{ borderTop: '1px solid var(--line)' }} aria-label="more">
      <div>{prev && <Link href={`${base}/${prev.slug}`} className="text-sm group"><span className="block text-xs mb-1" style={{ color: '#6b6b6b' }}>← previous</span><span className="group-hover:underline">{prev.title}</span></Link>}</div>
      <div className="text-right">{next && <Link href={`${base}/${next.slug}`} className="text-sm group"><span className="block text-xs mb-1" style={{ color: '#6b6b6b' }}>next →</span><span className="group-hover:underline">{next.title}</span></Link>}</div>
    </nav>
  )
}
