# Destill — Figma build recipe

**Capability note:** this environment has no Figma authoring tool, so no `.fig`
artifact was produced. The runnable HTML prototype (`index.html`), the material
board (`spec/foundations.html`), the renders in `docs/shots/`, and
`tokens/destill.tokens.json` (W3C DTCG shape, importable with Tokens Studio or
the variables REST API) are the delivered substitute. The recipe below lets a
designer rebuild the system in Figma without re-deciding anything.

## Pages

1. **00 Foundations** — colour, radius, elevation, type, gradients. Import
   `tokens/destill.tokens.json` as variable collections `color`, `radius`,
   `shadow` (as effect styles), `typography` (as text styles).
2. **01 Material studies** — duplicate the four plates from
   `spec/foundations.html` §2 at 3× scale: Raised / Recessed / Pressed / Flat.
   Use real inner + outer shadow effects, never flattened fills.
3. **02 Components** — every component below as a component set with the named
   variants.
4. **03 Desktop 1440** — the eight app states at 1440×900.
5. **04 Mobile 390 / 320** — the same states stacked.
6. **05 Flows** — prototype connections per the state machine in
   `js/logic.js` (`TRANSITIONS`), including blocked and cancelled branches.

## Component sets and variants

| Set | Variants | Key properties |
| --- | --- | --- |
| `Button/Primary` | idle, hover, pressed, disabled, loading, focus | radius 18 (20 at lg), `shadow.primary`, pressed swaps to inset |
| `Button/Secondary` | idle, hover, pressed, disabled, focus | `shadow.raiseSm` + rim |
| `Medallion` | idle, hover, pressed, tone, ok, warn, danger | 44px (56 lg), full round |
| `Segmented` | item: idle / selected / hover; themes: neutral, decide | track `shadow.insetSm`; selected item `shadow.raiseSm` |
| `Input` | idle, focus, placeholder | `shadow.insetSm`, radius 18 |
| `Chip/Time` | idle, hover, pressed, disabled | radius 12, tabular numerals |
| `Well/Source` | empty (dropzone), filled (metadata + preview) | radius 22, `shadow.insetDeep` when empty |
| `Timeline` | with decisions keep/change/drop, thumb at 0…n | track `shadow.inset`; thumb `shadow.thumb` |
| `EvidenceCard` | default | radius 24, `shadow.raise` |
| `Processing` | stage done/now/todo, fill 0–100 | labelled SYNTHETIC |
| `Notice` | blocked, warn, danger | icon medallion + actions |
| `StepRail` | step 1–4 × idle/on/done/disabled | recessed track, raised active |

## Auto Layout and constraints

- Cards: vertical auto layout, padding 28–48, gap 14–30, hug height, fill width;
  resize contents by hug so 390 and 320 reflow like the CSS grid.
- Main frame: 2 columns (minmax 0,1fr / 344) collapsing to 1 column ≤1120 —
  model with two frame widths and component min widths, not with scaled copies.
- Nested radii rule: child radius = parent radius − padding step
  (32 → 28 → 22 → 18 → 12). Encode as four radius variables only; never free-type a radius.

## Prototype connections (mirror `logic.js`)

- welcome → source (file or demo)
- source → processing (demo) | blocked-analyze (real file)
- processing → understanding | cancelled → processing
- understanding → refine → result | blocked-render → result
- rail steps return to any reached state.

## Material detail board

Recreate at 200% zoom the four crops already rendered in `docs/shots/`
(`detail-well@2x`, `detail-primary-button@2x`, `detail-segmented@2x`,
`detail-timeline@2x`) and verify against them: crest upper-left, seat
lower-right, inset upper-left inner wall, pressed = shallow inset.
