/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async redirects() {
    return [{
      source: "/en/materials/vegan-leather/vinyl",
      destination: "/en/materials/vegan-leather/skai",
      permanent: true
    }];
  },
  images: {
    ...(process.env.NEXT_PUBLIC_SITE_KEY === "china" && process.env.NEXT_PUBLIC_CHINA_MEDIA_URL ? {
      loader: "custom",
      loaderFile: "./src/lib/china-image-loader.ts",
      deviceSizes: [640, 768, 1280, 1920],
      imageSizes: [32, 48, 96, 160, 320],
    } : {}),
    // Sites serves the original static assets without a Next image optimizer binding.
    unoptimized: process.env.SITES_PREVIEW === "1",
    minimumCacheTTL: 300,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname: "stitch-video-assets.s3.amazonaws.com"
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io"
      }
    ]
  }
};

export default nextConfig;
