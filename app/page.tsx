import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Music from "@/components/Music";
import Members from "@/components/Members";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// The single-page scroll. Section order here is the order on the page.
export default function Home() {
  return (
    <>
      <Nav />
      <main id="content" tabIndex={-1} className="outline-none">
        <Hero />
        <Gallery />
        <Music />
        <Members />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
