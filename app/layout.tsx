import './globals.css'
import type { Metadata } from 'next'
import WrappersWithOnlyPwa from '../components/wrappers/WrappersWithOnlyPwa'

declare global {
  interface Navigator {
    standalone?: boolean
  }
}

export const metadata: Metadata = {
  manifest: '/manifest.json', // we are accessing our manifest file here
  title: 'BloomersTV',
  description: 'Game Streaming platform for Bloomers of Lens.',
  openGraph: {
    title: 'BloomersTV',
    description: 'Game Streaming platform for Bloomers of Lens.',
    type: 'profile',
    siteName: 'BloomersTV',
    url: 'https://bloomers.tv',
    images: [
      // logo image
      {
        url: 'https://bloomers.tv/logo.png',
        width: 512,
        height: 512,
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
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <WrappersWithOnlyPwa>{children}</WrappersWithOnlyPwa>
      </body>
    </html>
  )
}
