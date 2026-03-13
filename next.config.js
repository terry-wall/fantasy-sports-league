/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Set default environment variables to prevent startup issues
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || `http://localhost:${process.env.PORT || 3000}`,
  },
  // Increase build timeout
  staticPageGenerationTimeout: 60,
}

module.exports = nextConfig