# LanguageSwitch

The EN / DE toggle in the header (and in the mobile menu).

- Two buttons in Geist Mono at `text-meta` (12px): idle `quiet`, the current language `ink` with a 1px `signal` underline. State is `aria-pressed`, the group has `role="group"` and an `aria-label`; each button carries its `lang`.
- Switching language announces “Language: English” / “Sprache: Deutsch” through a polite live region.
- No props in the source: it reads and dispatches the locale from the experience context. A consumer supplies the current locale and an `onChange`.

Static rendition of `LanguageSwitch` from `src/components/Header.tsx`.
