# Header

The sticky site header: wordmark, five centred route links, language switch and the “Map a problem” entry.

- Height `header-h` (72px), compacting to `header-h-compact` (56px) after 48px of scroll with `ease-out`; ground `paper` at 96% opacity with a `rule` bottom hairline. Intentionally conventional — never a glass pill.
- Links: `nav` type in `ink-2`; hover and `aria-current="page"` turn `signal-ink`, the current one gets a 1px `signal` underline.
- The CTA (“Map a problem” + IconArrow) opens the problem-mapping panel; it is separated by a `rule` left border, not boxed.
- ≤1120px: 12px links, tighter gaps. ≤680px: links, language switch and CTA move into a toggled menu (42px square toggle, two 1px bars), which drops below the header with the one functional shadow.
- Props: `route` (current Route) and `navigate(route)`; labels come from i18n.

Static rendition of `Header` from `src/components/Header.tsx` at desktop width.
