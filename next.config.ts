import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config: Configuration) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components': path.resolve(__dirname, 'src/components'),
    };
    return config;
  },
};

export default nextConfig;
