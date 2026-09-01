import type { Config } from "tailwindcss";

/**
 * Design tokens live here (colors, fonts, spacing rhythm).
 * To rebrand the site, edit the `colors` and `fontFamily` values below.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Off-black / off-white base + a single vivid signal accent.
        ink: "#0a0a0a", // near-black background
        surface: "#141414", // slightly raised panels
        bone: "#f5f3ef", // warm off-white (primary text)
        muted: "#8f8b83", // secondary text
        line: "#262626", // hairline borders
        accent: "#a855f7", // single accent — swap this one value to re-theme
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
