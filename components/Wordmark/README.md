# Wordmark

The DYAI identity: the three-bar brand mark followed by **DYAI** and a small mono suffix.

- `.wordmark` (header) and `.footer-brand` (footer) share one style: `wordmark` type (19px, 700, tracking −.07em) in `ink`; the suffix is 11px Geist Mono at .1em, sitting on the baseline.
- `.brand-mark` (the `Mark` component): three 2px bars, 100% / 68% / 36% long, rotated −45° in a 16px box, drawn in `currentColor`. It is CSS, not an image — never replace it with a redrawn file.
- The suffix reads “STUDIO” in header and footer. No ® (registration not verified).
- On graphite the source does not place the wordmark; the dark row here only shows it recoloured to `light` via `color`.
- The consumer supplies the link target and an `aria-label` (“DYAI Studio — home”).

Static rendition of `Mark` (`src/components/ui.tsx`) and the wordmark markup in `Header.tsx` / `Footer.tsx`.
