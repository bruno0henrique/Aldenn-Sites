import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  allowedDevOrigins: ["127.0.0.1"],
  basePath: "/demonstracao-imobiliaria",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
