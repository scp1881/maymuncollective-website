import { ui } from "@/content/site";

/** First stop in the tab order: jumps past the header to the page's <main>. */
export default function SkipLink() {
  return (
    <a
      href="#content"
      className="sr-only z-skip bg-violet px-4 py-3 font-bold text-stock focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      {ui.skipLink}
    </a>
  );
}
