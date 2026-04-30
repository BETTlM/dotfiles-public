import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./data/manifest.json", "./data/configs/**/*"],
  },
};

export default nextConfig;
