/** @type {import('next').NextConfig} */

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development',
  disable: false,
  workboxOptions: {
    disableDevLogs: true
  }
  // ... other options you like
})

const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'cdn.stamp.fyi']
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  }
}

module.exports = withPWA(nextConfig)
// module.exports = nextConfig
