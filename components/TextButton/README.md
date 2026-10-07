# TextButton

A quiet inline action for secondary controls inside a component (reset, remove, replay).

- `.text-button`: 13px `muted` label over a 1px `rule-strong` underline; hover turns both to `signal-ink` / `signal`.
- `.text-button--light` on `graphite`: `light-2` over `rule-dark`, white on hover.
- Never use it for the section's main action — that is ButtonLink. No icon.
- The consumer supplies a `<button type="button">` with this class and its label; there is no React wrapper in the source.

Static rendition of the `.text-button` rules in `src/styles/base.css`.
