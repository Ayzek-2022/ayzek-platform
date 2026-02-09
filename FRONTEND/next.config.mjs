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
      {
        protocol: 'https',
        hostname: '*.r2.dev',
        pathname: '/**',
      },
    ],
    // 👇 İŞTE ÇÖZÜM BU SATIRDA!
    // Bu satır sayesinde "Motor bozuk" hatası (500) gelmeyecek, resim direkt açılacak.
    unoptimized: true, 
  },
}

export default nextConfig
