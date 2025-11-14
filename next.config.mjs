/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint:{
        ignoreDuringBuilds: true
    },
    compiler:{
        removeConsole:process.env.NODE_ENV === 'production'
    }
};

export default nextConfig;
