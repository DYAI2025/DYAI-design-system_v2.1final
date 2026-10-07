# Footer

The site footer: wordmark, the one-line statement, route links, and a mono meta row with provenance and back-to-top.

- Ground `paper-2` with a `rule` top hairline; three columns (.5fr / 1fr / 1.4fr), stacked under 680px.
- Statement in `statement` type (`ink-2`, max 280px); links 13px `muted`, hover `signal-ink`.
- Meta row: `meta-sm` mono uppercase in `quiet` over a `rule` hairline — copyright and domain, the honesty line (“No customer evidence is implied.”), and “↑ Back to top” in `ink-2`. Note `quiet` on `paper-2` is 4.12:1.
- Props: `navigate(route)`; all copy comes from i18n.

Static rendition of `Footer` from `src/components/Footer.tsx` at desktop width.
