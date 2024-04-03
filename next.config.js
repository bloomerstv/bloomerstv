/** @type {import('next').NextConfig} */
// const webpack = require('webpack')

const withPWA = require('@ducanh2912/next-pwa').default({
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
  }
}

module.exports = withPWA(nextConfig)
// module.exports = nextConfig
