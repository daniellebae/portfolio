import { useState } from 'react'
import { site } from '../data/content'
export default function Contact() {
  const [s, setS] = useState('idle')
  async function submit(e) {
    e.preventDefault(); setS('sending')
    const { NEXT_PUBLIC_SERVICE_ID: sv, NEXT_PUBLIC_TEMPLATE_ID: tp, NEXT_PUBLIC_USER_ID: u } = process.env
    try {
      if (!sv) throw new Error('not configured')
      const emailjs = (await import('@emailjs/browser')).default
      await emailjs.sendForm(sv, tp, e.target, u); setS('sent'); e.target.reset()
    } catch { setS('error') }
  }
  return (
    <form onSubmit={submit} className="grid gap-4 max-w-md">
      <input className="input" name="name" placeholder="your name" required aria-label="your name" />
      <input className="input" name="email" type="email" placeholder="your email" required aria-label="your email" />
      <textarea className="input" name="message" rows={5} placeholder="say hi" required aria-label="message" />
      <div className="flex items-center gap-4">
        <button className="btn solid" disabled={s === 'sending'}>{s === 'sending' ? 'sending…' : 'send message'}</button>
        <span role="status" className="text-xs" style={{ color: '#6b6b6b' }}>
          {s === 'sent' && 'thank you! i’ll reply soon.'}
          {s === 'error' && <>couldn’t send. email me at <a className="underline" href={`mailto:${site.email}`}>{site.email}</a></>}
        </span>
      </div>
    </form>
  )
}
