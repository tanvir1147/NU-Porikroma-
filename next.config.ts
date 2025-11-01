import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // Re-enable Next.js hot reloading for Turbopack
  reactStrictMode: true,
  // Removed webpack custom configuration that disabled hot reloading
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;