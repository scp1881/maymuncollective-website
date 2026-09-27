/**
 * Whether the page is animating. Decided once, before first paint, by the
 * boot script in app/layout.tsx: motion is on unless the visitor's system
 * asks for reduced motion. `?motion=on` / `?motion=off` overrides that for
 * the rest of the browser session (for demos and testing); every animation
 * in the CSS and the components keys off the resulting html.motion class.
 */
export const motionOn = () => typeof document !== "undefined" && document.documentElement.classList.contains("motion");

/** A precise pointer that can hover (mouse or trackpad), with motion on. */
export const finePointer = () => motionOn() && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
