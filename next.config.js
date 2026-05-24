/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,  // 👈 This disables image optimization and fixes 400 errors
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig