import Link from 'next/link'
import Layout from '../../components/Layout'
import Reveal from '../../components/Reveal'
import Img from '../../components/Img'
import { campaigns } from '../../data/content'
export default function Campaigns() {
  return (
    <Layout title="my campaigns">
      <section className="wrap">
        <Reveal><h2 className="h2">marketing projects i’ve worked on so far.</h2>
          <p className="p mb-10">my work over the past three(ish) years. click on any campaign to learn more about it.</p></Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {campaigns.map((c, i) => <Reveal key={c.slug} delay={i * 90}>
            <Link href={`/campaigns/${c.slug}`} className="card block h-full group">
              <Img src={c.image} alt={c.title} className="w-full mb-5" style={{ aspectRatio: '1/1' }} />
              <p className="eyebrow" style={{ marginBottom: 8 }}>{c.org}</p><h3 className="text-base font-normal mb-2">{c.title}</h3>
              <p className="text-xs mb-3" style={{ color: '#6b6b6b' }}>{c.type}</p><p className="text-sm leading-7" style={{ color: '#333' }}>{c.blurb}</p>
              <span className="more">view campaign →</span>
            </Link></Reveal>)}
        </div>
      </section>
    </Layout>
  )
}
