# DESTILL — SCULPTED LIGHT

> **DESIGN PROPOSAL — PRODUCT OWNER REVIEW REQUIRED.**
> UI design and prototype only. No analysis engine, no renderer, no uploads
> exist in this build; every place one is missing says so plainly.

Destill is a local-first AI video-editing companion: select a video on this
device, understand its message and structure as time-linked evidence, decide
KEEP / CHANGE / DROP per segment, and later receive a rendered cut. This
directory is the design proposal for that product — a runnable HTML prototype,
a material foundations board, machine-readable tokens, renders and a QA trail.

It lives beside, not inside, the DYAI Studio system at the repository root.
Root tokens (`tokens.css`, `tokens.json`) are untouched.

---

## 1 · Design rationale

The product is a quiet instrument, so the material is quiet too: one continuous
pearl surface (`#EEF1F6`) out of which controls emerge (raised) or are carved
(recessed), lit by a single diffuse source at the upper-left. Convex objects
crest at the upper-left and seat a soft contact shadow at the lower-right;
concave wells shade the upper-left inner wall and lighten the lower-right;
pressing a raised control collapses it into a shallow inset, because that is
what pressing a physical key does. Restraint is the rule: no glass, no glow, no
puffiness — shadow alphas stay between 0.25 and 0.34, offsets under 8px, and
flat supporting planes give the sculpted objects room.

What is carried over from the DYAI house style is its honesty discipline, not
its editorial look: semantic single accent (muted cobalt `#3559CB`), mono
uppercase metadata, nothing set below 11px, simulations labelled plainly, and
the human left in charge (“Decide the cut”, keep/change/drop verdicts).

## 2 · Composition and user flow

One stage, one rail, one primary action per state.

- **Stage (left)** carries the current state: Welcome → Source → Processing →
  Understanding → Refine → Result, with Cancelled / Blocked / Error as honest
  side exits.
- **Rail (right)** carries the journey (Source · Understand · Refine · Destill
  as a recessed step track), a permanent “What is real here” panel, and the
  live outcome while refining. It is a status instrument, not a navigation
  sidebar of equal destinations.
- **Analyze ≠ Destill.** Analyze understands content (demo path only; blocked
  for real files in this build). Destill renders — visibly not connected; the
  Result state is a labelled concept plus a copyable English CapCut EditPilot
  prompt generated from the actual decisions.

Flow logic (mirrored 1:1 in `js/logic.js` → `TRANSITIONS`):
welcome → source → processing → understanding → refine → result, with
source → blocked-analyze (real file), refine → blocked-render (export),
processing → cancelled → processing.

## 3 · Deliverables

| Requested | Status | Where |
| --- | --- | --- |
| HTML prototype | **Delivered** | `index.html`, `css/`, `js/` — open `index.html` directly; zero remote dependencies |
| Material foundations board | **Delivered** | `spec/foundations.html` |
| Design tokens (machine) | **Delivered** | `tokens/destill.tokens.json` (W3C DTCG; Figma-importable) |
| Figma editable artifact | **NOT AVAILABLE** — no Figma tool in this environment | Substitute: `docs/figma-blueprint.md` (pages, component sets, variants, auto-layout, prototype links) + the tokens JSON |
| Desktop & mobile screenshots | **Delivered, real renders** | `docs/shots/` (Chromium 153 headless) |
| Four enlarged material details | **Delivered** | `docs/shots/*@2x.png` |
| QA report | **Delivered** | §8 below |
| Change ledger | **Delivered** | §9 below |

## 4 · Token specification (exact)

Source of truth: `css/tokens.css`; DTCG mirror: `tokens/destill.tokens.json`;
visual board: `spec/foundations.html`. Summary:

- **Colour** pearl `#EEF1F6` · porcelain `#F8FAFC` · raised `#F2F5F9` ·
  recessed `#E8EDF3` · ink `#151922` · ink-2 `#4D5566` · ink-3 `#5B6478` ·
  accent `#3559CB` · accent-ink `#2A47A8` · accent-surface `#E6ECFF`;
  semantic ok/warn/danger with washes.
- **Radius (nested, ordered)** shell 32 > card 28 > well 22 > control 18 >
  chip 12 > pill full. Checked by `npm run tokens`.
- **Raised lg** `7 8 17 rgba(154,168,188,.25)` + `−7 −7 17 rgba(255,255,255,.93)`
  + rim `inset 0 1 0 rgba(255,255,255,.62)`.
- **Raised sm** `3 4 9 rgba(154,168,188,.30)` + `−3 −3 9 rgba(255,255,255,.90)`.
- **Inset** `inset 4 4 9 rgba(154,168,188,.34)` + `inset −4 −4 9 rgba(255,255,255,.90)`;
  **inset sm** 3/3/7 @ .30 & .88; **inset deep** 6 7 14 @ .34 & −5 −5 12 @ .86.
- **Primary** `5 6 14 rgba(53,89,203,.30)` + `−5 −5 14 rgba(255,255,255,.92)` +
  `inset 0 1 0 rgba(255,255,255,.32)`; pressed swaps to cobalt inset.
- **Thumb** `2 3 6 rgba(154,168,188,.42)` + `−2 −2 5 white .9` + halo
  `0 0 0 5 rgba(53,89,203,.14)`.
- **Curvature gradients** 145°: raise `#F9FBFD→#F2F5F9→#EDF1F7`; recess
  `#E4EAF1→#E8EDF3→#EDF1F6`; accent `#4A6BD8→#3559CB→#2E4FB6`.
- **Type** system SF Pro stack; display clamp(36–44)/1.08/−2.8%; section 22/−2%;
  body 16/1.6; label 13; meta mono 12 upper +8%; meta-sm 11; timestamps
  `tabular-nums`. **Motion** press 140ms, state 260ms,
  `cubic-bezier(.32,.72,.28,1)`; reduced-motion collapses both.
- **Focus** 2px `--accent` outline, 3px offset, everywhere.

## 5 · Screenshots (real renders)

Captured with headless Chromium 153 at `file://`; font in these renders is the
sandbox fallback (Open Sans), **not** SF Pro. `docs/shots/`:
`desktop-welcome/source/understanding/refine/result/blocked-render` (1440×900),
`laptop-1280`, `mobile-welcome`, `mobile-refine` (390×844), `narrow-320`,
`foundations-board`, `flat-welcome`, `flat-refine`.

## 6 · Four enlarged material comparisons (2×)

- `detail-well@2x` — recessed source well: upper-left inner shade, lit
  lower-right wall, concentric 22px corners; medallion seated with crest +
  contact shadow.
- `detail-primary-button@2x` — cobalt convex: crest, seat, top sheen.
- `detail-segmented@2x` — raised active segment separated from its recessed
  track by its own shadow and rim.
- `detail-timeline@2x` — recessed track; keep/change raised tints; dropped
  segments hatched *and* inset; pearl thumb with accent core and halo.

## 7 · State inventory

**Functional (verified here):** file picker intake; non-video rejection;
undecodable-file error; demo start; intent capture; analyze→processing with
cancel and resume; understanding with evidence chips seeking the playhead;
keyboard slider (arrows/Home/End); refine decisions recomputing runtime and
timeline; result concept with rationale and clipboard copy; blocked-render and
blocked-analyze recovery; rail back-navigation; hash deep links; reduced
motion. (23 e2e assertions, §8.)

**Synthetic (always labelled with warn bands):** demo source, processing
stages, understanding, evidence, outcomes, result frames.

**Blocked (truthful, styled):** analysis for real files; MP4 export; both offer
the nearest real action.

**Not tested here (needs a human/other OS):** real-file metadata + preview with
a decodable video; drag-and-drop gesture; SF Pro rendering; screen-reader
walkthrough; physical touch targets; 200% browser text zoom; forced-colors
render (CSS shipped).

## 8 · QA report

| Check | Result | Evidence |
| --- | --- | --- |
| Unit tests (`npm test`) | **PASS** 8/8 | logic: time fmt, outcome math, transitions, prompt, data isolation |
| End-to-end (`npm run e2e`) | **PASS** 23/23 | real clicks through full journey incl. error paths & reduced motion |
| axe-core, 6 states | **PASS** 0 violations | after fixing 5 real findings (name mismatch, nested slider control, heading order, landmark labels, missing h1) |
| Contrast, 16 pairs | **PASS** | computed from tokens.css; e.g. ink/pearl 15.53, ink-3/recessed 5.04, white/accent 6.10 |
| Token integrity | **PASS** | every `var()` defined; radii ordered |
| Material test | **PASS** | convex/concave/pressed distinguishable in 2× crops |
| Lighting test | **PASS** | one upper-left source across all components (renders) |
| Corner test | **PASS** | nested radii concentric at 2× (crops) |
| Hierarchy test | **PASS** | one dominant primary per state (renders) |
| Flatness test | **PASS** | `flat-*.png`: tonal steps keep surfaces legible with all shadows off |
| Truth test | **PASS** | synthetic bands, blocked states, e2e assertions |
| Responsive 1440/1280/390/320 | **PASS** | renders inspected; content preserved |
| Originality | **PASS** | bespoke stage+rail composition, not a dashboard template |
| Keyboard access | **PASS** | focus rings, slider keys in e2e; SR walkthrough NOT_TESTED |
| SF Pro rendering | **NOT_TESTED** | sandbox lacks SF Pro; fallback verified instead |
| Real-video metadata/preview | **NOT_TESTED** | requires a human with a real file |
| 200% text zoom / forced colors | **NOT_TESTED** | CSS shipped, headless cannot represent faithfully |

## 9 · Product Change Ledger

| # | BEFORE | AFTER | OUTCOME | Action |
| --- | --- | --- | --- | --- |
| 1 | DYAI editorial system: square corners, hairlines, no shadows (marketing) | Sculpted-light app material: nested radii 32→12, compound raise/inset shadows | Tactile, app-grade affordances for a creative tool | ADD |
| 2 | House honesty conventions (labelled simulations, semantic single accent, ≥11px type, mono metadata) | Same conventions inside the new material | Truth discipline survives the style change | PRESERVE |
| 3 | Generic neumorphism defaults (gray puff, alpha .5+ shadows, glow) | Calibrated alphas .25–.34, offsets ≤8px, flat planes, no glow | Serene porcelain, not toy plastic | CHANGE |
| 4 | Equal-weight dashboard navigation | Journey step rail + status panel; one primary action per state | Next step always obvious | CHANGE |
| 5 | Implicit capability (buttons that pretend) | blocked-analyze / blocked-render / labelled synthetic bands | No misleading success states | ADD |
| 6 | — | EditPilot prompt generated from actual decisions, copyable | Bridge to the future production path | ADD |
| 7 | — | Decorative charts, settings panels, sidebars | Absent by design | REMOVE |

## 10 · Run it

```sh
open index.html                 # or serve the folder; no network needed
# deep links: index.html#/refine?mode=demo  etc.
```

Re-verify with the scripts in `qa/` (see `qa/README.md`).
