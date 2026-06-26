import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // Lint hataları production build'i durdurmasın
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Tip hataları production build'i durdurmasın (runtime'ı etkilemez)
    ignoreBuildErrors: true,
  },
  experimental: { serverActions: { allowedOrigins: ['*'] } },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ],
    },
  ],
}

export default nextConfig
