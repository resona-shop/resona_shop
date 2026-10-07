import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Gives unmatched URLs a 404 page that can set its own <title>.
    globalNotFound: true,
  },
  images: {
    // Next.js 16 默认禁止优化解析到私有 IP 的远程图片（SSRF 防护）。
    // 开发环境下如果图片域名被解析到内网 IP（如代理/VPN/DNS 场景），可临时开启。
    // 生产环境请勿开启。
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
