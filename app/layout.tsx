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
  title: 'BloomersTV - Go Live on Lens Protocol',
  description: 'Game Streaming platform for Bloomers'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <WrappersWithOnlyPwa>{children}</WrappersWithOnlyPwa>
      </body>
    </html>
  )
}
