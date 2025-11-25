import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'psgc.gitlab.io',
      },
    ],
  },
};

export default nextConfig;
