/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname:"images.unsplash.com"
      },
      {
        hostname: 'files.edgestore.dev'
      },
      {
        hostname: '127.0.0.1'
      }
    ]
  }
}

module.exports = nextConfig
