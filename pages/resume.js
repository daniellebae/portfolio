import { useState } from 'react'
import Layout from '../components/Layout'
import Reveal from '../components/Reveal'
import Stamp from '../components/Stamp'
import { resumes, resumeLinks } from '../data/resume'

// the resume, embedded as the page itself: the paper melts into the background.
// a red stamp switches between the one-page and full versions.
export default function Resume() {
  const [which, setWhich] = useState('short')
  const r = resumes[which], full = which === 'full'
  return (
    <Layout title="resume">
      <section className="wrap">
        <Reveal>
          <div className="flex items-start justify-between gap-6">
            <div><h2 className="h2">resume</h2>
              <p className="p mb-8">a quick look at what i’ve done over the years.</p></div>
            <Stamp text={full ? 'SHORT' : 'FULL'} hint={full ? 'one page' : 'see more'}
              label={full ? 'show the one-page resume' : 'show the full resume'} onClick={() => setWhich(full ? 'short' : 'full')} />
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-10">
            <a className="btn solid" href={r.pdf} download={r.download}>download pdf</a>
            <span className="text-xs" style={{ color: '#6b6b6b' }}>
              {resumeLinks.map(([k, href], i) => <span key={k}>{i > 0 && ' · '}<a className="underline" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{k}</a></span>)}
            </span>
          </div>
        </Reveal>
        <div key={which} className="resume-pages lang-fade">
          {r.pages.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt={i === 0 ? `danielle bae’s ${full ? 'full' : 'one-page'} resume${r.pages.length > 1 ? `, page ${i + 1} of ${r.pages.length}` : ''}` : `page ${i + 1} of ${r.pages.length}`}
              className="resume-page" loading={i === 0 ? 'eager' : 'lazy'} />
          ))}
          <div className="sr-only">{r.text}</div>
        </div>
      </section>
    </Layout>
  )
}
