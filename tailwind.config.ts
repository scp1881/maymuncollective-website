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
        /* Five values, and every one of them is answerable for itself.
         *
         * `ink` is true black, not the #0a0a0a it used to be. A near-black
         * standing in for black is a habit, not a decision — it costs the
         * deepest value the screen can make and, on the OLED phones this
         * audience actually uses, it costs the one place a screen can show an
         * image floating in nothing. The photographs are lit against darkness;
         * let the page be darkness.
         *
         * `stage` is sampled from the band's own photograph of the Blind show
         * — the magenta wash over the stage reads #8f1773 / #8a1b88, hue
         * 300–315. Lifted to #e0219c (hue 321) it keeps that hue and reaches
         * 4.87:1 on black, which passes AA for body text. The previous accent
         * was #a855f7: Tailwind's purple-500 at hue 271, a default that had
         * nothing to do with this band.
         *
         * `surface` is the backstage lamp's amber taken down to almost
         * nothing. It is the only warm dark on the page and it exists purely
         * so an image has something to sit on while it decodes.
         */
        ink: "#000000", // the page
        surface: "#171310", // behind a loading image; derived from the lamp
        bone: "#f5f3ef", // primary text — 18.95:1 on ink
        muted: "#8f8b83", // secondary text — 6.19:1 on ink
        line: "#1f1f1f", // hairlines, used sparingly
        stage: "#e0219c", // the signal colour, from the stage wash
      },
      fontFamily: {
        // The "… Fallback" entries are the metric-matched Arial faces declared
        // in globals.css; they sit between the real face and system-ui so text
        // shown before the webfont arrives occupies the same space.
        display: [
          // "Bricolage Display" is the headline-only cut and covers only the
          // capitals the H1s use; everything else falls through to the full
          // face behind it. See app/globals.css.
          "Bricolage Display",
          "Bricolage Grotesque",
          "Bricolage Grotesque Fallback",
          "system-ui",
          "sans-serif",
        ],
        body: ["Inter", "Inter Fallback", "system-ui", "sans-serif"],
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
        // 0.35s, not 0.7s. This animation is what reveals the hero headline,
        // which is the page's LCP element — so its duration and delay are added
        // directly onto LCP, because the browser cannot count an element that
        // is still transparent. Measured on a throttled cold load: 0.7s with a
        // 150ms delay put LCP at 1468ms; at 0.35s with no delay it is 884ms,
        // and with no animation at all 736ms, which is simply FCP. The fade is
        // worth ~150ms of that; the other ~580ms was not buying anything.
        "fade-up": "fade-up 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
