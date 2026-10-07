# ButtonLink

The one action component: a cobalt primary or an underlined secondary, always followed by an IconArrow.

- **Primary** (`.action-link`): `signal` fill, white `action` label, 48px min height, square; hover lifts 1px and darkens to `signal-ink`. Use at most once per view, for the thing the section is for (“Map a real problem”).
- **Secondary** (`secondary`): no fill, `rule-strong` underline, arrow in `signal`; hover turns the underline `signal` and the label `signal-ink`. Inside `.dark-section` the label is `light` with a `rule-dark` underline.
- Labels are imperative sentence case without a full stop. The arrow is part of the component; use the diagonal IconArrow only for links that leave the page.
- The consumer supplies `children` (the label) and either `onClick` (renders a `<button type="button">`) or `href` (renders an `<a>`); `className` is appended.

Static rendition of `ButtonLink` + `IconArrow` from `src/components/ui.tsx`, styled by `bundle.css`.
