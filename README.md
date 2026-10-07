DYAI Studio designs the augmentation layer between human intent, context, AI, tools, workflows and evidence — so that AI capability becomes usable human capability. The interface reads like an editorial working document: warm paper, graphite ink, hairline rules, square corners and **one cobalt signal** that only ever means something.

## Content fundamentals

- **Write theses, not slogans.** Short declarative sentences, often in pairs that turn on one word: “The AI did not change. The relationship did.” · “AI capability alone is not augmentation. The designed relationship is.”
- **Headings are sentences and end with a full stop**: “Capability is not yet a way of working.” · “Start with the work. Build the system around it.” Option titles (scenarios, layers) are sentence case without a full stop: “Prepare a complex decision”, “Human control”.
- **Metadata is UPPERCASE mono, joined with ` · `**: “RELATIONSHIP · BROKEN”, “LLM · OPTIONAL”, “ONE PROBLEM · ONE SYSTEM”. Set it in `meta` or `trace-label`, never in the sans.
- **Say what is not proven.** Label simulations and illustrations plainly: “ILLUSTRATIVE SITUATIONS — NOT MEASURED CUSTOMER CASES”, “A design-decision prototype · No customer evidence is implied.” Never imply customers, metrics or registrations that are not verified (the ® was removed from the wordmark for that reason).
- **Keep the human responsible in the copy.** AI “synthesises”, “challenges”, “transforms”; the human “decides”, “owns”, “confirms”. An LLM is named as optional where it is optional.
- British spelling (organisations, synthesise, behaviour), em dashes with spaces, the arrows `→ ↑ ↓` as glyphs in text. No exclamation marks, no emoji, no superlatives.
- Every string exists in **English and German** with the same structure (DE: “Aus KI-Fähigkeit menschliche Fähigkeit machen.”, “Fähigkeit ist noch keine Arbeitsweise.”). The language switch shows `EN` / `DE` in mono.

## Visual foundations

### Colour

- Light chapters sit on `paper`; recess with `paper-2` (footer, inherited-context boxes) and `paper-3` (tracks, fills). Chapters alternate with **dark sections** on `graphite` (raised: `graphite-2`). Dark sections are a section style, not a theme.
- Text on paper: `ink` for headings and primary copy, `ink-2` for navigation and secondary copy, `muted` for intros and inactive options, `quiet` for mono metadata. On graphite: `light`, `light-2`, `light-muted`; emphasis words in `signal-soft`.
- **`signal` is semantic only**: active relationship, selected path, current system state, a connection being established, evidence state, meaningful focus, the primary action. Never decorative, never a second accent. Its text form is `signal-ink` (hover, active nav item, badges); a selected wash is `signal-tint`.
- `warn-ink` is the only warning colour (an added, unnecessary capability; complexity; errors). Pair it with a dashed border or a word — colour never carries the warning alone.
- Hairlines: `rule` on paper, `rule-strong` for underlines and input edges, `rule-dark` on graphite. Text selection is white on `signal` (inverted to `ink` on white inside dark sections).

### Type

- Two families from Google Fonts: **Geist** (`sans`, weights 300–800) and **Geist Mono** (`mono`, 400–600). Load `https://fonts.googleapis.com/css2?family=Geist:wght@300..800&family=Geist+Mono:wght@400..600&display=swap`.
- Display styles are fluid `clamp()` values in code; the type tokens record their desktop caps: `brand-word` (134px, line-height .78, tracking −.1em, 650), `hero-title` (5.3rem, .98, −.045em, 540), `chapter-title` (4.1rem, 1.02, −.04em, 500). Large type always tracks negative; `text-wrap: balance` on titles.
- Body is `body` 17px / 1.6 (16px under 680px); intros `intro`; compact copy `small` and `statement`; actions `action`; navigation `nav`.
- Metadata is mono, medium weight, UPPERCASE, positively tracked: `meta` and `trace-label` at 12px, `meta-sm` at 11px. Important metadata is 12–13px. **Nothing is set below 11px.**

### Layout and spacing

- Content sits in `.page-shell`: `shell` (1376px) wide minus a `gutter` of clamp(20px, 4vw, 56px) each side. The sticky header is `header-h` (72px), compacting to `header-h-compact` (56px) after scrolling.
- Chapters breathe: vertical padding clamp(104px, 11vw, 176px), 84px under 680px. Spacing is written as literal pixel values per component; there is no spacing scale to extend.
- Breakpoints: 1120px (tighter nav), 900px (pinning off, single columns), 820px, 680px (mobile: sequential layouts, menu toggle, stacked footer).

### Borders, radii, depth

- Square corners everywhere (`border-radius: 0`); only dots and status points are round (50%). The focus outline has a 1px radius.
- Structure comes from 1px hairlines and surface steps, not shadows. The two exceptions are functional: the problem-mapping side panel (`-30px 0 80px` at 18% black) and the open mobile menu (`0 16px 28px` at 8%).
- A static paper grain (SVG noise at 2.8% opacity, multiply) sits behind the page.

### Interaction and motion

- Hover is a colour change to `signal-ink` / an underline turning `signal`, at .18s `ease`; primary actions also lift 1px. Larger state changes use `ease-out`.
- Focus: `outline: 2px solid` `signal`, offset 4px, on every interactive element.
- Motion explains state (GSAP ScrollTrigger: pinned diagnosis, scrubbed reveals, assembling timelines). `prefers-reduced-motion` renders every complete state without animation.

### Imagery

- No photography or illustration. Systems are drawn as diagrams: 1–1.5px strokes in `ink-2`/`rule-strong`, square junctions and dots, the active route in `signal`.

## Iconography

- No icon font and no emoji. Icons are inline SVG, `stroke: currentColor`, 1.3–1.5px, round caps and joins.
- **IconArrow** (17px): a straight arrow after every action label, or a diagonal arrow for outward links; coloured `signal` in secondary actions.
- **TraceMark** (48 × 16): the Augmentation Trace glyph whose geometry shows the chapter's state — broken, missing, system, branch, practice, reduced, bounded, reusable, behaviour, loop, and resolved. Idle in `ink-2`; resolved, system, reduced and loop in `signal`.
- **Brand mark**: three bars of 2px, 100% / 68% / 36% long, rotated −45° in a 16px box — built in CSS (`.brand-mark`), not a file. Set it beside `DYAI` in `wordmark`. There is no logo file; do not redraw it as an image.

## Components

The shared primitives live in `components/bundle.css` (the source's own `base.css` and `header.css`): `.action-link` (ButtonLink), `.text-button`, `.meta`, `.trace` + TraceMark, `.wordmark` + `.brand-mark`, the signal dots, `.language-switch`, `.site-header`, `.site-footer`. Load it after the tokens and the Geist fonts; dark variants apply inside any `.dark-section`. The previews are static renditions of the React components in `src/components/`; `components/index.d.ts` documents their props.

## Accessibility notes

Measured on the source values (WCAG 2): `ink` 15.9:1, `muted` 5.85:1 and `signal-ink` 6.28:1 on `paper`; white on `signal` 5.72:1; `light-muted` 6.73:1 on `graphite`. Kept exact but below the floor:

| Pair | Ratio | Where it matters |
| --- | --- | --- |
| `quiet` on `paper` / `paper-2` / `paper-3` | 4.47 / 4.12 / 3.82 | 11–12px mono metadata; AA needs 4.5:1 |
| `rule-strong` on `paper` | 1.82 | sole edge of text inputs; needs 3:1 |
| `signal` on `graphite-2` | 2.81 | focus ring on raised dark panels; needs 3:1 |

## Not synced

Taken from `dyai-p3` 3.1.0 (upload `dyai-studio-blue.zip`). Not carried into tokens: literal surfaces written outside `:root` (`#f9f8f3` composer result, `#fbfaf6` inputs, `#f3f2ec` and `#e9e8e1` Visual Command Lab, header backdrop `rgb(245 244 239 / 96%)`, dialog backdrop `rgb(13 16 14 / 55%)`, map grid lines `rgb(24 30 27 / 3.5%)`, warn wash `rgb(138 74 42 / 4%)`, white `#fff`) and the two shadows above. Fonts are hosted by Google, so no font files are stored. No image assets exist in the repository. Components were not built as a live React bundle (the repo is an application, not a component library; its build was not run): ButtonLink, TextButton, Wordmark, Meta, Trace, Signals, LanguageSwitch, Header and Footer are static previews; chapter components (Hero, Gap, AugmentationMap, Audiences, Process, Composer, Evidence, Lab, VisualCommandLab, Principles, FinalCta), the route pages and ProblemMapper are not included.
