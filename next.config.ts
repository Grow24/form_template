import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  reactStrictMode: true,
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
