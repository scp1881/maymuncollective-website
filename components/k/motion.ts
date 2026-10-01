/**
 * Whether the page is animating. Decided once, before first paint, by the
 * boot script in app/layout.tsx: motion is on for every visitor (the system's
 * reduced-motion setting is not consulted, by the owner's choice, as on the
 * Kurate reference). `?motion=off` turns it off for the rest of the browser
 * session and `?motion=on` back on; every animation in the CSS and the
 * components keys off the resulting html.motion class.
 */
export const motionOn = () => typeof document !== "undefined" && document.documentElement.classList.contains("motion");

/** A precise pointer that can hover (mouse or trackpad), with motion on. */
export const finePointer = () => motionOn() && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
