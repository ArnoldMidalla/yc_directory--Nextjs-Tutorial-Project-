// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "images.unsplash.com",
//       },
//     ],
//   },
//   /* other config options */
//   // experimental: {
//   //   ppr: "incremental",
//   // },
// };

// export default nextConfig;

//allow from all
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // 🚨 allows production builds to succeed even if there are type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // 🚨 allows production builds to succeed even if there are lint errors
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allow all hosts
      },
    ],
  },
};

export default nextConfig;
