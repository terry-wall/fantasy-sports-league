/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    SPORTS_API_KEY: process.env.SPORTS_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
  },
}

module.exports = nextConfig
