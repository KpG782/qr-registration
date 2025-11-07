import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to silence the warning
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Exclude better-sqlite3 from client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "better-sqlite3": false,
      };
    }
    return config;
  },
};

export default nextConfig;
