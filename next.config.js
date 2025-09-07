/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "cdn.dribbble.com" },
      { protocol: "https", hostname: "mir-s3-cdn-cf.behance.net" },
    ],
  },
};

module.exports = nextConfig;