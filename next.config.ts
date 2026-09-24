import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Tree-shake icon and animation barrels so a section only ships what it imports.
    optimizePackageImports: ['lucide-react', 'motion'],
  },
};

export default nextConfig;
