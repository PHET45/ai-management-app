// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
}

module.exports = nextConfig