/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/chrono-acu',
  assetPrefix: '/chrono-acu/',
}

module.exports = nextConfig
