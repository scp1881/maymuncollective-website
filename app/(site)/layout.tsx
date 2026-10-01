import BottomMenu from "@/components/k/BottomMenu";
import Experience from "@/components/k/Experience";
import Header from "@/components/k/Header";
import Preloader from "@/components/k/Preloader";
import { BackgroundGrid, Cursor } from "@/components/k/Chrome";
import { ui } from "@/content/site";

/** The public site's chrome, shared by the homepage and /gallery. */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a className="k-skip" href="#content">
        {ui.skipLink}
      </a>
      <Preloader />
      <BackgroundGrid />
      <Cursor />
      <Header />
      <BottomMenu />
      <div id="smooth-wrapper">
        <div id="smooth-content">{children}</div>
      </div>
      <Experience />
    </>
  );
}
