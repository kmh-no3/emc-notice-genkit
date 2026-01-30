import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages では /emc-notice-genkit で配信するため本番のみ basePath を設定
  // ローカル開発 (npm run dev) では basePath なしで http://localhost:3000/ でアクセス可能
  basePath: process.env.NODE_ENV === "production" ? "/emc-notice-genkit" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/emc-notice-genkit" : "",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
