import MasterWrappers from '../components/wrappers/MasterWrappers'
import './globals.css'
import type { Metadata } from 'next'
declare global {
  interface Navigator {
    standalone?: boolean
  }
}

export const metadata: Metadata = {
  manifest: '/manifest.json', // we are accessing our manifest file here
  title: 'BloomersTV',
  description: 'Live Streaming platform on Lens.',
  icons: [
    { rel: 'icon', url: 'https://bloomers.tv/icon.png' },
    { rel: 'apple-touch-icon', url: 'https://bloomers.tv/apple-icon.png' }
  ],
  openGraph: {
    title: 'BloomersTV',
    description: 'Live Streaming platform on Lens.',
    type: 'profile',
    siteName: 'BloomersTV',
    url: 'https://bloomers.tv',
    images: [
      // logo image
      {
        url: 'https://bloomers.tv/banner.png',
        width: 1200,
        height: 630,
        alt: 'BloomersTV Logo'
      }
    ]
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-W57EMMVS2J"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-W57EMMVS2J');
    `
          }}
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        {/* <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        /> */}
        {/* <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        /> */}
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <MasterWrappers>{children}</MasterWrappers>
      </body>
    </html>
  )
}

// Add this export to keep state alive
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const keepAlive = true
