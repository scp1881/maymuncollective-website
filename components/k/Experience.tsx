"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { motionOn } from "./motion";

/**
 * The page's scroll choreography, after the reference:
 *
 * - ScrollSmoother (smooth 1.5) over #smooth-content. Fixed chrome (header,
 *   menu, grid, cursor, preloader) lives outside it in the layout.
 * - Every `.section` gets `.animated` once, when its top reaches
 *   `data-start` (default "top 60%"), which releases its `.rv` reveals and
 *   `.draw` lines (see globals.css). `[data-anim]` elements work the same way
 *   on their own trigger. The hero is released when the preloader finishes.
 * - The section in the middle of the viewport sets html[data-header] (the
 *   header logo shows on the first three screens only) and html[data-grid]
 *   (sections marked data-grid="false" hide the background grid), and is
 *   announced to the bottom menu as a `k:section` event.
 * - As the hero scrolls out, its logo lifts and fades (scrubbed).
 * - In-page links scroll through the smoother and move focus to the target.
 * - Sections off screen get `.is-off`, which pauses their looping CSS
 *   animations (ring, equaliser, vinyl, ticker) until they come back.
 *
 * Without html.motion (reduced motion) there is no smoother and no scrub; the
 * classes are still set, but the CSS gives them nothing to animate.
 */
export default function Experience() {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    // Phones show and hide their address bar while scrolling; that resize
    // must not re-measure every trigger mid-scroll.
    ScrollTrigger.config({ ignoreMobileResize: true });
    const root = document.documentElement;
    const motion = motionOn();
    const home = pathname === "/";

    root.dataset.header = "shown";
    root.dataset.grid = "on";

    const smoother = motion
      ? ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 1.5,
          effects: false,
          smoothTouch: false,
        })
      : null;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".section");
      sections.forEach((section, i) => {
        if (section.id !== "top") {
          ScrollTrigger.create({
            trigger: section,
            start: section.dataset.start ?? "top 60%",
            once: true,
            onEnter: () => section.classList.add("animated"),
          });
        }
        ScrollTrigger.create({
          trigger: section,
          // A section takes over when its top reaches mid-screen, or later if
          // it says so (data-active-start), e.g. Channels waits until Music
          // has mostly scrolled away before the grid fades.
          start: section.dataset.activeStart ?? "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (!self.isActive) return;
            root.dataset.grid = section.dataset.grid === "false" ? "off" : "on";
            root.dataset.header = home && i > 2 ? "hidden" : "shown";
            window.dispatchEvent(new CustomEvent("k:section", { detail: section.id }));
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-anim]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: el.dataset.start ?? "top 75%",
          once: true,
          onEnter: () => el.classList.add("animated"),
        });
      });

      const hero = document.getElementById("top");
      if (hero && motion) {
        const logo = hero.querySelector(".hero-logo");
        const water = hero.querySelector(".k-water");
        const scrub = { trigger: hero, start: "top top", end: "bottom 25%", scrub: 0.1 };
        if (logo) gsap.fromTo(logo, { opacity: 1, yPercent: 0 }, { opacity: 0, yPercent: -60, ease: "none", scrollTrigger: scrub });
        if (water) gsap.fromTo(water, { autoAlpha: 1 }, { autoAlpha: 0, ease: "none", immediateRender: false, scrollTrigger: scrub });
      }
    });

    // Pause looping animations in sections that are off screen.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("is-off", !e.isIntersecting)),
      { rootMargin: "10% 0px" },
    );
    document.querySelectorAll("#smooth-content section, #smooth-content footer").forEach((el) => io.observe(el));

    // Release the hero once the preloader has gone (or at once if skipped).
    const releaseHero = () => document.getElementById("top")?.classList.add("animated");
    if (root.classList.contains("page-loaded")) releaseHero();
    else window.addEventListener("k:loaded", releaseHero, { once: true });

    const scrollToEl = (el: HTMLElement, instant = false) => {
      if (smoother) smoother.scrollTo(el, !instant, "top top");
      else el.scrollIntoView({ behavior: motion && !instant ? "smooth" : "auto" });
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      const href = a?.getAttribute("href");
      if (!href) return;
      const hash = href.startsWith("#") ? href : home && href.startsWith("/#") ? href.slice(1) : null;
      if (!hash || hash === "#") return;
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;
      e.preventDefault();
      scrollToEl(el);
      history.pushState(null, "", hash === "#top" || hash === "#content" ? window.location.pathname : hash);
    };
    document.addEventListener("click", onClick);

    // Arriving with a hash (e.g. from /gallery to /#music): go there once
    // the page is ready.
    const initialHash = () => {
      if (!window.location.hash) return;
      const el = document.querySelector<HTMLElement>(window.location.hash);
      if (el) requestAnimationFrame(() => scrollToEl(el, true));
    };
    if (root.classList.contains("page-loaded")) initialHash();
    else window.addEventListener("k:loaded", initialHash, { once: true });

    // Layout settles as fonts and images arrive.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      io.disconnect();
      document.removeEventListener("click", onClick);
      window.removeEventListener("k:loaded", releaseHero);
      window.removeEventListener("k:loaded", initialHash);
      window.removeEventListener("load", refresh);
      ctx.revert();
      smoother?.kill();
    };
  }, [pathname]);

  return null;
}
