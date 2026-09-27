import { ui } from "@/content/site";

/** First stop in the tab order: jumps past the header to the page's <main>. */
export default function SkipLink() {
  return (
    <a
      href="#content"
      className="sr-only fixed left-4 top-4 z-skip bg-violet px-4 py-3 font-bold text-stock focus:not-sr-only"
    >
      {ui.skipLink}
    </a>
  );
}
