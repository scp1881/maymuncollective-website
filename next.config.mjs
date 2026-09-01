/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve AVIF where supported (typically 20–30% smaller than WebP at the
    // same visual quality), falling back to WebP and then the original.
    formats: ["image/avif", "image/webp"],
    // Keep optimized variants cached for 30 days instead of the 60s default, so
    // repeat requests don't re-run the optimizer. Swapping an image under a NEW
    // filename (the pattern used here) busts this automatically.
    minimumCacheTTL: 2592000,
    // If you point gallery `src` values at images hosted on another domain, add
    // that hostname here so next/image is allowed to optimize it. Local images
    // placed in /public need no entry.
    // Example:
    // remotePatterns: [{ protocol: "https", hostname: "images.example.com" }],
    remotePatterns: [],
  },
};

export default nextConfig;
