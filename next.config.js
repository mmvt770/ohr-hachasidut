/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_AIRTABLE_BASE_ID: process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID,
    NEXT_PUBLIC_AIRTABLE_API_KEY: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
  },
}

module.exports = nextConfig
