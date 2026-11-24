import { useState } from 'react'
import Layout from '../components/Layout'
import Reveal from '../components/Reveal'
import Img from '../components/Img'
import Lightbox from '../components/Lightbox'
import { gallery } from '../data/content'
export default function Gallery() {
  const [open, setOpen] = useState(null)
  return (
    <Layout title="gallery">
      <section className="wrap">
        <Reveal><h2 className="h2">through my lens.</h2></Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-4">
          {gallery.map((g, i) => <Reveal key={i} delay={(i % 3) * 90}>
            <button className="block w-full zoomable" onClick={() => g.src && setOpen(i)} aria-label={`enlarge ${g.title}`}>
              <Img src={g.src} alt={g.title} className="w-full" style={{ aspectRatio: '4/5' }} /></button></Reveal>)}
        </div>
      </section>
      {open !== null && <Lightbox items={gallery.map(g => ({ src: g.src, caption: g.title }))} index={open} onClose={() => setOpen(null)} />}
    </Layout>
  )
}
