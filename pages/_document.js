import { Html, Head, Main, NextScript } from 'next/document'
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* hides text that decrypts on load until the effect starts, so it never flashes in plain first */}
        <script dangerouslySetInnerHTML={{ __html: "if(!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){var d=document.documentElement;d.classList.add('dc-pending');setTimeout(function(){d.classList.remove('dc-pending')},2500)}" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>
      <body><Main /><NextScript /></body>
    </Html>
  )
}
