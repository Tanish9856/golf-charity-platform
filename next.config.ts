import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // We remove the eslint object that was causing the orange warning
};

export default nextConfig;