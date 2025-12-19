/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        unoptimized: true, // For static export compatibility if needed, but useful for avoiding optimization issues in some container envs
    }
};

export default nextConfig;
