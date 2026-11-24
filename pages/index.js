import Head from 'next/head'
import { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Reveal from '../components/Reveal'
import Typewriter from '../components/Typewriter'
import EasterEgg from '../components/EasterEgg'
import About from '../components/About'
import SinceBirth from '../components/SinceBirth'
import Img from '../components/Img'
import StampLinks from '../components/StampLinks'
import ScrollHint from '../components/ScrollHint'
import { site } from '../data/content'

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
        <section id="top" className="section relative" style={{ paddingTop: 140 }}>
          <div className="wrap grid md:grid-cols-2 gap-12 items-center w-full" style={{ opacity: heroFade, transform: `scale(${0.96 + heroFade * 0.04})`, transition: 'opacity .1s linear' }}>
            <div><Typewriter />
              <StampLinks /></div>
            <Img src={site.portrait} alt="portrait of danielle" className="w-full" style={{ aspectRatio: '3/4', maxWidth: 270, justifySelf: 'end', objectPosition: '60% 50%' }} />
          </div>
          <ScrollHint />
        </section>
        <About />
      </main>
      <footer style={{ padding: '120px 0 100px' }}><Reveal><SinceBirth /><EasterEgg /></Reveal>
        <p className="text-center text-[11px] mt-10" style={{ color: '#8a8a8a' }}>© {new Date().getFullYear()} danielle</p></footer>
    </>
  )
}
