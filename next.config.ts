import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {

  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "viganium.co",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "cdn.example.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.freepik.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
