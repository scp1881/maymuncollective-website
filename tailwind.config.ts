import type { Config } from "tailwindcss";

/**
 * Design tokens for the markup. The same values exist as CSS custom properties
 * in app/globals.css, which the print effects and the motion read; DESIGN.md
 * documents both. Change a value in all three places or none.
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
        stock: "#0D0F1C", // the page — a navy-black card
        raised: "#161A30", // player placeholder, menu sheet
        ink: "#E6E9F5", // primary text — 15.7:1 on stock
        "ink-soft": "#A9B0CD", // secondary text — 8.9:1 on stock
        violet: "#9B5CFF", // the second ink — 4.9:1 on stock
        "violet-soft": "#C4A5FF", // violet as small text / focus — 9.2:1
      },
      fontFamily: {
        // "Archivo Fallback" is the metric-matched Arial declared in
        // globals.css, so text drawn before the webfont arrives takes the
        // same space.
        sans: ["Archivo", "Archivo Fallback", "system-ui", "sans-serif"],
      },
      fontSize: {
        small: ["15px", { lineHeight: "1.4" }],
        body: ["17px", { lineHeight: "1.55" }],
        lede: ["21px", { lineHeight: "1.4" }],
        title: ["clamp(28px, 3.2vw, 44px)", { lineHeight: "1.02" }],
        display: ["clamp(72px, 12vw, 184px)", { lineHeight: "0.86" }],
      },
      spacing: {
        gutter: "var(--gutter)",
        section: "var(--section)",
      },
      maxWidth: {
        page: "1536px",
      },
      borderRadius: {
        // Print: nothing is rounded.
        DEFAULT: "0",
      },
      zIndex: {
        plate: "10",
        nav: "40",
        sheet: "60",
        lightbox: "100",
        skip: "1000",
      },
      transitionDuration: {
        press: "120ms",
        quick: "240ms",
        settle: "600ms",
        sweep: "1100ms",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(.16, 1, .3, 1)",
        "in-out": "cubic-bezier(.65, 0, .35, 1)",
        exit: "cubic-bezier(.4, 0, 1, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
