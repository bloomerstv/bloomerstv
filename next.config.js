/** @type {import('next').NextConfig} */
// const webpack = require('webpack')

import nextPWA from '@ducanh2912/next-pwa'
const withPWA = nextPWA({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true
  }
  // ... other options you like
})

const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'cdn.stamp.fyi']
  },
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    config.externals.push('pino-pretty', 'lokijs', 'encoding')

    // Add this line to ignore the problematic modules
    // config.plugins.push(
    //   new webpack.IgnorePlugin({ resourceRegExp: /^@aws-sdk\/client-s3$/ })
    // )

    return config
  },
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination:
          'https://api.farcaster.xyz/miniapps/hosted-manifest/0198bc68-dbd1-08d1-c04d-cdc517eb062b',
        permanent: false
      }
    ]
  }
}

export default withPWA(nextConfig)
