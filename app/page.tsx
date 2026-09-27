import Nav from "@/components/Nav";
import SkipLink from "@/components/SkipLink";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Music from "@/components/Music";
import Members from "@/components/Members";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <SkipLink />
      <Nav />
      {/* tabIndex -1 so the skip link can move focus here; without it the
          browser scrolls to <main> but focus stays where it was. */}
      <main id="main" tabIndex={-1}>
        <Hero />
        <Gallery />
        <Music />
        <Members />
        <Contact />
      </main>
    </>
  );
}
