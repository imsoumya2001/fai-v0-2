/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['api.runware.ai', 'storage.googleapis.com', 'fal.media'],
    unoptimized: true,
  },
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    RUNWARE_API_KEY: process.env.RUNWARE_API_KEY,
    FAL_API_KEY: process.env.FAL_API_KEY,
  },
}

export default nextConfig
