import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  outputFileTracingIncludes: {
    '/cart': ['./data/**/*'],
    '/stacks/[slug]': ['./data/**/*'],
    '/api/**': ['./data/**/*'],
  },
};

export default nextConfig;
