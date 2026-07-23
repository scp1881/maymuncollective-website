import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Music from "@/components/Music";
import Members from "@/components/Members";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Gallery />
        <Music />
        <Members />
        <Contact />
      </main>
    </>
  );
}
