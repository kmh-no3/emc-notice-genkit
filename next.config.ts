import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/emc-notice-genkit',
  images: { unoptimized: true },
};

export default nextConfig;
