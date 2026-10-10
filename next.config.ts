import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Photos uploaded from the admin panel are stored in Vercel Blob
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    serverActions: {
      // Admin photo uploads (photos are shrunk in the browser first, usually ~200 KB)
      bodySizeLimit: "4mb",
    },
  },
  // Browsers ask for /favicon.ico automatically — serve the logo icon
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon.svg" }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
