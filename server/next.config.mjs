/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;