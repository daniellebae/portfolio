import Head from 'next/head'
import Nav from './Nav'
// shared shell for the tab pages
export default function Layout({ title, description, children }) {
  return (
    <>
      <Head>
        <title>{title ? `${title} | danielle` : 'danielle | portfolio'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {description && <meta name="description" content={description} />}
      </Head>
      <Nav />
      <main className="page">{children}</main>
      <footer className="text-center text-[11px]" style={{ color: '#8a8a8a', padding: '40px 0 60px' }}>© {new Date().getFullYear()} danielle</footer>
    </>
  )
}
