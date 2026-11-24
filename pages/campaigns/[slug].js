import { useState } from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout'
import Reveal from '../../components/Reveal'
import Img from '../../components/Img'
import Lightbox from '../../components/Lightbox'
import PrevNext from '../../components/PrevNext'
import { campaigns } from '../../data/content'

export default function Campaign({ slug }) {
  const i = campaigns.findIndex(c => c.slug === slug), c = campaigns[i]
  const [open, setOpen] = useState(null)
  const graphics = c.graphics || []
  return (
    <Layout title={c.title} description={c.blurb}>
      <article className="wrap">
        <Link href="/campaigns" className="text-xs underline inline-block mb-10 min-h-[44px]">← all campaigns</Link>
        <Reveal><p className="eyebrow">{[c.org, c.type, c.date].filter(Boolean).join(' · ')}</p>
          <h2 className="h2">{c.title}</h2>
          <p className="p mb-12" style={{ maxWidth: '60ch' }}>{c.blurb}</p></Reveal>
        <Reveal delay={80}><Img src={c.image} alt={c.title} className="w-full mb-16" style={{ aspectRatio: '16/9' }} /></Reveal>
        <div className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-12 mb-16">
          <Reveal>{(c.details || []).map((p, k) => <p key={k} className="p mb-5" style={{ maxWidth: '62ch' }}>{p}</p>)}</Reveal>
          <Reveal delay={100}><dl className="text-sm">
            {c.role && <div className="py-4" style={{ borderTop: '1px solid var(--line)' }}><dt className="text-xs mb-1" style={{ color: '#6b6b6b' }}>my role</dt><dd>{c.role}</dd></div>}
            {!!(c.results || []).length && <div className="py-4" style={{ borderTop: '1px solid var(--line)' }}><dt className="text-xs mb-2" style={{ color: '#6b6b6b' }}>results</dt>
              <dd><ul className="grid gap-2">{c.results.map((r, k) => <li key={k}>{r}</li>)}</ul></dd></div>}
          </dl></Reveal>
        </div>
        {!!graphics.length && <>
          <Reveal><p className="eyebrow">the graphics</p></Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {graphics.map((g, k) => <Reveal key={k} delay={(k % 3) * 80}>
              <button className="block w-full text-left zoomable" onClick={() => g.src && setOpen(k)} aria-label={`enlarge ${g.caption || 'graphic'}`}>
                <Img src={g.src} alt={g.caption || c.title} className="w-full" style={{ aspectRatio: '4/5' }} />
                {g.caption && <span className="block text-xs mt-3" style={{ color: '#6b6b6b' }}>{g.caption}</span>}
              </button></Reveal>)}
          </div></>}
        <PrevNext list={campaigns} i={i} base="/campaigns" />
      </article>
      {open !== null && <Lightbox items={graphics} index={open} onClose={() => setOpen(null)} />}
    </Layout>
  )
}
export function getStaticPaths() { return { paths: campaigns.map(c => ({ params: { slug: c.slug } })), fallback: false } }
export function getStaticProps({ params }) { return { props: { slug: params.slug } } }
