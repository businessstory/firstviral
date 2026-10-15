import type { NextConfig } from "next";

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.instagram.com https://va.vercel-scripts.com https://*.clarity.ms",
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "font-src 'self' https://cdn.jsdelivr.net",
  "img-src 'self' data: https:",
  "frame-src https://player.vimeo.com https://www.instagram.com https://www.youtube.com https://www.youtube-nocookie.com",
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://tquiqlubzmfjoynwowhh.supabase.co https://*.clarity.ms",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.vimeocdn.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // 무료 자료실 캐러셀 프롬프트: 한글 파일 이름으로 바로 다운로드되게 한다
        source: "/free-resources/carousel-prompt.txt",
        headers: [
          { key: "Content-Disposition", value: "attachment; filename=\"carousel-prompt.txt\"; filename*=UTF-8''%EC%9D%B8%EC%8A%A4%ED%83%80%EA%B7%B8%EB%9E%A8_%EC%BA%90%EB%9F%AC%EC%85%80_%EB%AC%B4%EB%A3%8C_%ED%94%84%EB%A1%AC%ED%94%84%ED%8A%B8.txt" },
        ],
      },
      {
        source: "/free-resources/claude-topic-prompt.txt",
        headers: [
          { key: "Content-Disposition", value: "attachment; filename=\"claude-topic-prompt.txt\"; filename*=UTF-8''%ED%81%B4%EB%A1%9C%EB%93%9C_%EC%9D%B8%EC%8A%A4%ED%83%80_%EC%A3%BC%EC%A0%9C%EC%B6%94%EC%B2%9C_%ED%94%84%EB%A1%AC%ED%94%84%ED%8A%B8.txt" },
        ],
      },
    ];
  },
};

export default nextConfig;
