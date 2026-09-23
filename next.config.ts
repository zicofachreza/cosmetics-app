import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'down-id.img.susercontent.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'assets.unileversolutions.com',
                pathname: '/**',
            },
        ],
    },
}

export default nextConfig
