import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'gasagency.com.au',
  //       port: '',
  //       pathname: '/account123/**',
  //       search: '',
  //     },
  //   ],
  // },

  // TODO REMOVE THE SETTINGS BELOW IN PRODUCTION
  typescript: {
    ignoreBuildErrors: true, // Disables TypeScript checks during build
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  //! END OF REMOVAL
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  images: {
    domains: ["gasagency.com.au", "lh3.googleusercontent.com"],
  },
};

export default nextConfig;
