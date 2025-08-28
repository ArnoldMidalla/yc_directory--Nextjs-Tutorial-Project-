import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  /* config options here */
  // experimental: {
  //   ppr: "incremental",
  // },
  // position: "bottom-right",
};