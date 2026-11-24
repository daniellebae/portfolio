import Link from 'next/link'
import Layout from '../../components/Layout'
import Reveal from '../../components/Reveal'
import PrevNext from '../../components/PrevNext'
import { writings } from '../../data/content'

export default function Piece({ slug }) {
  const i = writings.findIndex(w => w.slug === slug), w = writings[i]
  const poem = w.kind === 'poem'
  const blocks = (w.body || '').split(/\n\s*\n/)
  return (
    <Layout title={w.title} description={w.blurb}>
      <article className="wrap">
        <Link href="/writing" className="text-xs underline inline-block mb-10 min-h-[44px]">← all written works</Link>
        <div style={{ maxWidth: '64ch' }}>
          <Reveal><p className="eyebrow">{[w.kind, w.publication, w.date].filter(Boolean).join(' · ')}</p>
            <h2 className="h2">{w.title}</h2>
            {w.blurb && <p className="text-sm mb-12" style={{ color: '#6b6b6b' }}>{w.blurb}</p>}</Reveal>
          <Reveal delay={80}><div className={poem ? 'poem' : 'prose'}>
            {blocks.map((b, k) => <p key={k}>{b}</p>)}
          </div>
            {w.link && <a className="btn mt-10" href={w.link} target="_blank" rel="noreferrer">read the original ↗</a>}</Reveal>
        </div>
        <PrevNext list={writings} i={i} base="/writing" />
      </article>
    </Layout>
  )
}
export function getStaticPaths() { return { paths: writings.map(w => ({ params: { slug: w.slug } })), fallback: false } }
export function getStaticProps({ params }) { return { props: { slug: params.slug } } }
