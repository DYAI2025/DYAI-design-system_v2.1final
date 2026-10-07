# Trace

The chapter eyebrow: the Augmentation Trace glyph plus “AUGMENTATION TRACE / <state>”, replacing numbered section labels.

- **TraceMark** is one 48 × 16 SVG whose geometry shows the relationship's current condition: `broken` → `missing` → `system` → `branch` → `practice` → `reduced` → `bounded` → `reusable` → `behaviour` → `loop`, plus `resolved` (broken, once the hero is completed). Strokes 1.3px, round caps, `currentColor`.
- Idle marks are `ink-2`; `resolved`, `system`, `reduced` and `loop` are `signal`. Inverse (`trace--inverse`, on graphite): marks `light-2`, `loop`/`missing` in `signal`, label `light-muted` with the name in `light`.
- Label in `trace-label` type: the name in `ink`, ` / `, then the state in `quiet`. State strings come from the i18n table (`t.trace.states`) and exist in EN and DE.
- It is not decoration: pick the state that matches what the chapter argues. One Trace per chapter, above the title.
- Props — Trace: `state` (TraceState), `inverse?`, `resolved?`, `id?`. TraceMark: `state` (TraceState | "resolved"), `resolved?`.

Static rendition of `Trace` and `TraceMark` from `src/components/ui.tsx` with the English labels from `src/i18n/en.ts`.
