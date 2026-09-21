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
