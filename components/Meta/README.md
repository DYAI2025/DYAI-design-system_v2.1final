# Meta

Semantic metadata: a short UPPERCASE mono label that names state, category or provenance.

- `meta` type (Geist Mono 12px, 500, tracking .06em, uppercase) in `quiet`; a `<b>` inside lifts the value to `ink` at 600. In `.dark-section`: `light-muted`, with `<b>` in `light`.
- Join parts with ` · `; use an em dash for a qualifying clause. Write it in sentence words; the class uppercases.
- Use it for labels, never for sentences of explanation. Add `block-label` for a block-level label with 14px below.
- Props: `children`, optional `className`, and `as` = `span` (default), `div` or `p`.
- Note: `quiet` on `paper` is 4.47:1 — slightly under AA at this size (see Accessibility notes).

Static rendition of `Meta` from `src/components/ui.tsx`.
