import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import Stamp from './Stamp'
import InkPainting from './InkPainting'
import { decrypt } from '../lib/decrypt'
import { site } from '../data/content'

export default function About() {
  const [lang, setLang] = useState('en')
  const t = site.about[lang]
  const title = useRef(null), first = useRef(true)

  // the title re-decrypts into the other language
  useEffect(() => {
    if (first.current) { first.current = false; return }
    return decrypt(title.current)
  }, [lang])

  return (
    <section id="about" className="about" lang={lang === 'ko' ? 'ko' : 'en'}>
      <InkPainting />
      <div className="about-inner"><div className="wrap w-full grid md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-12 md:gap-16 items-start">
        <Reveal>
          <div className="flex items-start justify-between gap-6 mb-8">
            <h2 ref={title} className="h2" style={{ marginBottom: 0 }}>{t.title}</h2>
            <Stamp text={t.stamp} hint={t.hint} label={t.switchLabel} onClick={() => setLang(lang === 'en' ? 'ko' : 'en')} />
          </div>
          <div key={lang} className="lang-fade">
            {t.body.map((p, i) => <p key={i} className="p about-p mb-5">{p}</p>)}
          </div>
        </Reveal>
        <Reveal delay={120} className="md:sticky md:top-28">
          <dl key={lang} className="lang-fade">{t.facts.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-6 py-4 text-sm" style={{ borderTop: '1px solid #e2e2de' }}>
              <dt style={{ color: '#6b6b6b' }}>{k}</dt><dd className="text-right">{v}</dd></div>
          ))}</dl>
        </Reveal>
      </div></div>
    </section>
  )
}
