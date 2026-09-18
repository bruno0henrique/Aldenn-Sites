import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/demonstracao-noiva",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
