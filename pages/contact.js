import Layout from '../components/Layout'
import Reveal from '../components/Reveal'
import Contact from '../components/Contact'
import { site } from '../data/content'
export default function ContactPage() {
  return (
    <Layout title="contact">
      <section className="wrap">
        <Reveal><h2 className="h2">feel free to reach out!</h2>
          <p className="p mb-8">or write to <a className="underline" href={`mailto:${site.email}`}>{site.email}</a></p><Contact /></Reveal>
      </section>
    </Layout>
  )
}
