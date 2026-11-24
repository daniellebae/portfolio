import Link from 'next/link'
import Layout from '../../components/Layout'
import Reveal from '../../components/Reveal'
import { writings } from '../../data/content'
export default function Writing() {
  return (
    <Layout title="written works">
      <section className="wrap">
        <Reveal><h2 className="h2">articles, poems, and such.</h2>
          <p className="p mb-6">click any piece to read it in full.</p></Reveal>
        <ul className="mt-6">{writings.map((w, i) => <Reveal key={w.slug} delay={i * 70}><li>
          <Link href={`/writing/${w.slug}`} className="grid md:grid-cols-[110px_1fr_60px] gap-2 md:gap-6 py-6 group" style={{ borderTop: '1px solid var(--line)' }}>
            <span className="text-xs" style={{ color: '#6b6b6b' }}>{w.kind}</span>
            <span><span className="text-base font-normal group-hover:underline">{w.title}</span><span className="block text-sm mt-1" style={{ color: '#6b6b6b' }}>{w.blurb}</span></span>
            <span className="text-xs md:text-right" style={{ color: '#6b6b6b' }}>{w.date}</span></Link></li></Reveal>)}</ul>
      </section>
    </Layout>
  )
}
