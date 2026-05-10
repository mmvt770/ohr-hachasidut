import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="he" dir="rtl">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta charSet="utf-8" />
        <meta name="description" content="מערכת ניהול תוכן - אור החסידות" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
