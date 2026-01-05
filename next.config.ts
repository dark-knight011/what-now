import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Enable Turbopack (Next.js 16 default) - empty config acknowledges PWA webpack usage
  turbopack: {},
};

export default withPWA(nextConfig);

