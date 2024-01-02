import { Metadata } from 'next'
import { Html, Head, Main, NextScript } from 'next/document'

export const metadata: Metadata = {
  title: 'Kirma',
  description: 'Best Teeth App in the world',
  icons: { apple: './images/teeth.png', icon: './images/teeth.png' },
  manifest: './manifest.json',
  applicationName: 'Teeth',
}

export default function Document() {
  return (
    <Html lang='en'>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
