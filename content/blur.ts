/**
 * ─────────────────────────────────────────────────────────────────────────
 *  BLUR PLACEHOLDERS — tiny inlined previews for the gallery images
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  Each value is a 12px-wide JPEG encoded as a data URI (~300 bytes). next/image
 *  paints it, upscaled and blurred, in the tile's exact footprint while the real
 *  image downloads — so the grid fills in with a soft impression of each photo
 *  instead of flashing empty grey boxes. That is the difference between a first
 *  visit that reads as "loading" and one that reads as "broken".
 *
 *  Keyed by the image's public path so `content/site.ts` stays free of base64
 *  noise and remains editable by hand.
 *
 *  ── Adding or swapping an image ──
 *  A missing entry is not an error: the tile simply renders without a
 *  placeholder. To generate one for a new file:
 *
 *    npx sharp-cli -i public/images/gallery/NEW.jpg -o /dev/stdout \
 *      resize 12 12 --fit inside -- jpeg --quality 45 | base64 -w0
 *
 *  or, with the `sharp` package installed:
 *
 *    node -e "require('sharp')('public/images/gallery/NEW.jpg') \
 *      .resize(12,12,{fit:'inside'}).jpeg({quality:45}).toBuffer() \
 *      .then(b=>console.log('data:image/jpeg;base64,'+b.toString('base64')))"
 */
export const blurDataURLs: Record<string, string> = {
  "/images/gallery/01-portrait.jpg":
    "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAMAAgDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAQG/8QAHBAAAQUAAwAAAAAAAAAAAAAAAQACAwQREjFh/8QAFAEBAAAAAAAAAAAAAAAAAAAAAv/EABgRAQEAAwAAAAAAAAAAAAAAAAEAETFR/9oADAMBAAIRAxEAPwDLxUHSVXTBzdA3ifEUIJ3tE8nJKOi//9k=",
  "/images/gallery/02-studio.PNG":
    "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAJAAwDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABQT/xAAiEAABAwMDBQAAAAAAAAAAAAABAgMEAAUSESFzMTRCUbL/xAAUAQEAAAAAAAAAAAAAAAAAAAAC/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhEDEQA/AA5UWROWXRGeKUJw1w89idqXtcN0RSJBxWFEYkHVI9UhH7i4c6qkb6uci/o0Dj//2Q==",
  "/images/gallery/03-newartwork.jpg":
    "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAMAAkDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABAL/xAAjEAABAwMCBwAAAAAAAAAAAAACAQMRAAQhBRITFEFRUnGR/8QAFAEBAAAAAAAAAAAAAAAAAAAAA//EABYRAQEBAAAAAAAAAAAAAAAAAAABIf/aAAwDAQACEQMRAD8Am6FCvkAHC2keJ6ZhKXyw9i+0PWGwZu2yAUklhZ94pfHc8qHLSP/Z",
  "/images/gallery/04-live.JPG":
    "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAMAAwDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAUG/8QAHhAAAgICAgMAAAAAAAAAAAAAAQIDEQAhBFEFEjH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAQADAQEAAAAAAAAAAAAAAAEAAhEDIf/aAAwDAQACEQMRAD8AxqtSj2N7xaTTxKF4yAp92t7wKmlPfeU/GxpLxyXWyGobI1Qwr+GyzgtnByf/2Q==",
  "/images/gallery/05-backstage.jpeg":
    "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAMAAgDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAEG/8QAHxAAAgICAgMAAAAAAAAAAAAAAQIDEQAEBRITIUFh/8QAFAEBAAAAAAAAAAAAAAAAAAAAAf/EABcRAQEBAQAAAAAAAAAAAAAAAAEAAhH/2gAMAwEAAhEDEQA/AJxu7oaqy97YLUaAVD5+XjM3BErRxhixBHURfuzjAyE9W//Z",
  "/images/gallery/06-crew.JPG":
    "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAFAAwDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAIG/8QAGxAAAgMBAQEAAAAAAAAAAAAAAQIAAxESBCH/xAAVAQEBAAAAAAAAAAAAAAAAAAABAv/EABcRAAMBAAAAAAAAAAAAAAAAAAABIRH/2gAMAwEAAhEDEQA/AM6VrpDKKkfgbrjdk2+Sh36VCgIB5B+CIlZATp//2Q==",
};

/**
 * Returns the props that turn on next/image's blur-up placeholder for a given
 * source, or an empty object when there is no preview for it. Spread onto
 * <Image />: `{...blurProps(src)}`.
 */
export function blurProps(src: string) {
  const blurDataURL = blurDataURLs[src];
  return blurDataURL ? ({ placeholder: "blur", blurDataURL } as const) : {};
}
