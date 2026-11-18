import Head from 'next/head'
import { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Reveal from '../components/Reveal'
import Typewriter from '../components/Typewriter'
import Contact from '../components/Contact'
import EasterEgg from '../components/EasterEgg'
import { site, gallery, campaigns, writings } from '../data/content'

function Img({ src, alt, className = '', style }) {
  const [bad, setBad] = useState(false)
  if (!src || bad) return <div className={`ph ${className}`} style={style}>photo goes here</div>
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} onError={() => setBad(true)} className={className} style={{ objectFit: 'cover', borderRadius: 20, ...style }} />
}

export default function Home() {
  const [y, setY] = useState(0)
  useEffect(() => { const f = () => setY(window.scrollY); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f) }, [])
  const heroFade = Math.max(0, 1 - y / 520) // hero softly recedes as you scroll, like apple.com
  return (
    <>
      <Head>
        <title>danielle | portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Marketing director, photographer and writer." />
      </Head>
      <Nav />
      <main>
        <section id="top" className="section" style={{ paddingTop: 140 }}>
          <div className="wrap grid md:grid-cols-2 gap-12 items-center w-full" style={{ opacity: heroFade, transform: `scale(${0.96 + heroFade * 0.04})`, transition: 'opacity .1s linear' }}>
            <div><Typewriter />
              <a href="#resume" className="btn mt-8">scroll to explore ↓</a></div>
            <Img src={site.portrait} alt="portrait of danielle" className="w-full" style={{ aspectRatio: '3/4', maxWidth: 270, justifySelf: 'end', objectPosition: '60% 50%' }} />
          </div>
        </section>

        <section id="resume" className="section"><div className="wrap w-full">
          <Reveal><p className="eyebrow">01 · resume</p><h2 className="h2">the short version of my story.</h2>
            <p className="p mb-10">a quick look at where i’ve been and what i’ve built.</p>
            <div className="flex flex-wrap gap-3">
              <a className="btn solid" href={site.resume} target="_blank" rel="noreferrer">view resume</a>
              <a className="btn" href={site.resume} download="Danielle-Resume.pdf">download pdf</a></div></Reveal>
        </div></section>

        <section id="gallery" className="section" style={{ background: 'var(--soft)' }}><div className="wrap w-full">
          <Reveal><p className="eyebrow">02 · gallery</p><h2 className="h2">through my lens.</h2></Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-4">
            {gallery.map((g, i) => <Reveal key={i} delay={(i % 3) * 90}><Img src={g.src} alt={g.title} className="w-full" style={{ aspectRatio: '4/5' }} /></Reveal>)}
          </div></div></section>

        <section id="campaigns" className="section"><div className="wrap w-full">
          <Reveal><p className="eyebrow">03 · my campaigns</p><h2 className="h2">socials + graphics for RSOs.</h2>
            <p className="p mb-10">work from my time as a marketing director.</p></Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {campaigns.map((c, i) => <Reveal key={i} delay={i * 90}><article className="card">
              <Img src={c.image} alt={c.title} className="w-full mb-5" style={{ aspectRatio: '1/1' }} />
              <p className="eyebrow" style={{ marginBottom: 8 }}>{c.org}</p><h3 className="text-base font-normal mb-2">{c.title}</h3>
              <p className="text-xs mb-3" style={{ color: '#6b6b6b' }}>{c.type}</p><p className="text-sm leading-7" style={{ color: '#333' }}>{c.blurb}</p></article></Reveal>)}
          </div></div></section>

        <section id="about" className="section" style={{ background: 'var(--soft)' }}><div className="wrap w-full grid md:grid-cols-2 gap-12 items-center">
          <Reveal><p className="eyebrow">04 · about me</p><h2 className="h2">{site.aboutTitle}</h2>
            {site.about.map((t, i) => <p key={i} className="p mb-4">{t}</p>)}</Reveal>
          <Reveal delay={120}><dl>{site.facts.map(([k, v]) => <div key={k} className="flex justify-between gap-6 py-4 text-sm" style={{ borderTop: '1px solid #e6e6e6' }}><dt style={{ color: '#6b6b6b' }}>{k}</dt><dd>{v}</dd></div>)}</dl></Reveal>
        </div></section>

        <section id="writing" className="section"><div className="wrap w-full">
          <Reveal><p className="eyebrow">05 · written works</p><h2 className="h2">articles, poems, and such.</h2></Reveal>
          <ul className="mt-6">{writings.map((w, i) => <Reveal key={i} delay={i * 70}><li>
            <a href={w.link} className="grid md:grid-cols-[110px_1fr_60px] gap-2 md:gap-6 py-6 group" style={{ borderTop: '1px solid var(--line)' }}>
              <span className="text-xs" style={{ color: '#6b6b6b' }}>{w.kind}</span>
              <span><span className="text-base font-normal group-hover:underline">{w.title}</span><span className="block text-sm mt-1" style={{ color: '#6b6b6b' }}>{w.blurb}</span></span>
              <span className="text-xs md:text-right" style={{ color: '#6b6b6b' }}>{w.date}</span></a></li></Reveal>)}</ul>
        </div></section>

        <section id="contact" className="section" style={{ background: 'var(--soft)' }}><div className="wrap w-full">
          <Reveal><p className="eyebrow">06 · contact me</p><h2 className="h2">let’s make something together.</h2>
            <p className="p mb-8">or write to <a className="underline" href={`mailto:${site.email}`}>{site.email}</a></p><Contact /></Reveal>
        </div></section>
      </main>
      <footer style={{ padding: '120px 0 100px' }}><Reveal><EasterEgg /></Reveal>
        <p className="text-center text-[11px] mt-10" style={{ color: '#8a8a8a' }}>© {new Date().getFullYear()} danielle</p></footer>
    </>
  )
}
