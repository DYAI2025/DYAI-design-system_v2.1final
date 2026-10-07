# Signals

Small square and round markers that show state next to a label: the visual vocabulary of “on / off / active”.

- `.mini-signal`: 8px square, 1px `currentColor` outline when off; `.mini-signal--on` fills it with `signal`.
- `.signal-line`: a 44 × 2px `signal` bar for an established connection or the current step.
- `.scenario-dot`: 8px square with a `rule-strong` border; filled `signal` when its parent is `.is-active` or `[aria-pressed="true"]`.
- `.status-dot`: 8px `signal` circle — the only round marker, for live status.
- Always pair a marker with a word (a `meta` label); the marker alone never carries the meaning. Squares are the default; round is reserved for status.
- The consumer supplies the element with the class and the adjacent label; there is no React wrapper.

Static rendition of the signal rules in `src/styles/base.css`.
