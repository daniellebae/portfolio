import Layout from '../components/Layout'
import Reveal from '../components/Reveal'
import { site } from '../data/content'
export default function Resume() {
  return (
    <Layout title="resume">
      <section className="wrap">
        <Reveal><h2 className="h2">the short version of my story.</h2>
          <p className="p mb-10">a quick look at where i’ve been and what i’ve built.</p>
          <div className="flex flex-wrap gap-3 mb-12">
            <a className="btn solid" href={site.resume} target="_blank" rel="noreferrer">open in new tab</a>
            <a className="btn" href={site.resume} download="Danielle-Resume.pdf">download pdf</a></div></Reveal>
        <Reveal delay={100}><iframe src={`${site.resume}#view=FitH`} title="danielle's resume" className="w-full rounded-2xl" style={{ height: '80vh', border: '1px solid var(--line)' }} /></Reveal>
      </section>
    </Layout>
  )
}
