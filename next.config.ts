import type { NextConfig } from "next";
const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.usadosbr.com",
        pathname: "/media/gallery/**",
      },
    ],
  },
};
export default config;
