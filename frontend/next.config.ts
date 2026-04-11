import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    viewTransition: true,
  },
  allowedDevOrigins: [
    'http://localhost:4000/',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ],
};

export default nextConfig;
