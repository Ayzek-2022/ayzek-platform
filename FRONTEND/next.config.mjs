/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.ayzek.tr',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
