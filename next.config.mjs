/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // If you point gallery/member `src` values at images hosted on another
    // domain, add that hostname here so next/image is allowed to optimize it.
    // Local images placed in /public need no entry.
    // Example:
    // remotePatterns: [{ protocol: "https", hostname: "images.example.com" }],
    remotePatterns: [],
  },
};

export default nextConfig;
