import type { NextConfig } from "next";

const repo = "ovk-snab";
const isPages = process.env.PAGES === "true" || process.env.GITHUB_ACTIONS === "true";
const basePath = isPages ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
