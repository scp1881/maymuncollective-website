import About from "@/components/k/About";
import Contact from "@/components/k/Contact";
import Footer from "@/components/k/Footer";
import Hero from "@/components/k/Hero";
import Members from "@/components/k/Members";
import Music from "@/components/k/Music";
import Statement from "@/components/k/Statement";

// The single-page scroll, in the reference's order: hero, statement (the
// Gallery stop), about + vinyl, members, music, contact, footer.
export default function Home() {
  return (
    <>
      <main id="content" tabIndex={-1} className="outline-none">
        <Hero />
        <Statement />
        <About />
        <Members />
        <Music />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
