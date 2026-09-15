import type { Metadata } from "next";

// A diagnostic page, not part of the site: keep it out of search results and
// out of any share preview.
export const metadata: Metadata = {
  title: "Hero film check",
  robots: { index: false, follow: false },
};

export default function VideoCheckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
