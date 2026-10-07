// DYAI Studio — component props, transcribed from dyai-p3 src/components/*.tsx and src/data/model.ts.
// Documentation only: the components ship as static previews styled by bundle.css, not as a JS bundle.
import type { ReactNode } from "react";

export type Locale = "EN" | "DE";
export type Route = "/" | "/organisations" | "/individuals" | "/work" | "/lab" | "/approach";
export type TraceState =
  | "broken" | "missing" | "system" | "branch" | "practice"
  | "reduced" | "bounded" | "reusable" | "behaviour" | "loop";

/** Primary or secondary action; renders <a> with href, else <button type="button">. Always followed by IconArrow. */
export interface ButtonLinkProps {
  children: ReactNode;
  onClick?: () => void;
  /** Underlined secondary style instead of the cobalt fill. Default false. */
  secondary?: boolean;
  className?: string;
  href?: string;
}

/** 17px stroke arrow; diagonal for links that leave the page. */
export interface IconArrowProps {
  diagonal?: boolean;
}

/** The three-bar brand mark (CSS, currentColor). No props. */
export interface MarkProps {}

/** Augmentation Trace glyph, 48 × 16. */
export interface TraceMarkProps {
  state: TraceState | "resolved";
  /** With state "broken", draws the resolved geometry. */
  resolved?: boolean;
}

/** Chapter eyebrow: TraceMark + "AUGMENTATION TRACE / <state label>". */
export interface TraceProps {
  state: TraceState;
  /** Colours for .dark-section (graphite). */
  inverse?: boolean;
  resolved?: boolean;
  id?: string;
}

/** Uppercase mono metadata label. */
export interface MetaProps {
  children: ReactNode;
  className?: string;
  as?: "span" | "div" | "p";
}

/** Sticky site header. Labels come from the i18n table. */
export interface HeaderProps {
  route: Route;
  navigate: (r: Route) => void;
}

/** Site footer. */
export interface FooterProps {
  navigate: (r: Route) => void;
}

/** EN / DE toggle; reads and sets the locale from the experience context (no props in the source). */
export interface LanguageSwitchProps {}

/** CSS-only primitives (no React wrapper in the source): .text-button(.--light), .mini-signal(.--on), .signal-line, .scenario-dot, .status-dot. */
export interface TextButtonProps {}
export interface SignalsProps {}
