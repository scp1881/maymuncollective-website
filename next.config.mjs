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
    // Trim the widths the optimizer is allowed to generate. Each distinct width
    // is optimized on demand for whichever visitor asks for it first, and that
    // visitor waits for it — so unreachable widths are pure first-visit cost.
    // The widest the design ever renders an image is the 1024px lightbox, so
    // 2048 already covers a 2× display; the default list also includes 3840,
    // which nothing here can request but which is by far the slowest to encode.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // If you point gallery `src` values at images hosted on another domain, add
    // that hostname here so next/image is allowed to optimize it. Local images
    // placed in /public need no entry.
    // Example:
    // remotePatterns: [{ protocol: "https", hostname: "images.example.com" }],
    remotePatterns: [],
  },

  async headers() {
    return [
      {
        // Files in /public are served with `max-age=0` by default, so the
        // self-hosted fonts would be revalidated on every navigation. Their
        // contents only change when scripts/build-fonts.py is re-run, and that
        // is a deliberate act, so they are safe to pin hard. (Assets under
        // /_next/static already get this automatically via content hashing.)
        source: "/fonts/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // The hero film and its posters, ~1 MB of it for whichever orientation
        // a visitor gets. Without this they carry `max-age=0` like everything
        // else in /public and are revalidated on every navigation.
        //
        // Their filenames are stable, so pinning them would normally strand
        // anyone holding an old cut — components/HeroVideo appends `?v=<CUT>`
        // to every one of these URLs for exactly that reason. Bump CUT when the
        // encodes change and the URL changes with it. Nothing else links here,
        // so an unversioned request pinning an old file is not a path the site
        // can take.
        source: "/video/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Same reasoning, but a shorter window: the wordmark has a stable
        // filename, so a year of immutability would make replacing it awkward.
        source: "/logo-wordmark.svg",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
