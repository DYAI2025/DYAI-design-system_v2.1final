/* Destill QA — WCAG contrast, computed from the live tokens.css values.
   Run: npm run contrast */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(root, "css", "tokens.css"), "utf8");

const val = (name) => {
  const m = css.match(new RegExp("--" + name + ":\\s*(#[0-9a-fA-F]{6})"));
  if (!m) { console.error("token missing:", name); process.exit(2); }
  return m[1];
};

function lum(hex) {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function ratio(a, b) {
  const l1 = lum(a), l2 = lum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const pairs = [
  // [fg, bg, min, label]
  ["ink", "pearl", 4.5, "body/headings on page ground"],
  ["ink", "raised", 4.5, "headings on raised card"],
  ["ink-2", "pearl", 4.5, "secondary copy on ground"],
  ["ink-2", "raised", 4.5, "secondary copy on card"],
  ["ink-3", "pearl", 4.5, "muted mono metadata on ground"],
  ["ink-3", "raised", 4.5, "muted mono metadata on card"],
  ["ink-3", "recessed", 4.5, "muted metadata in wells"],
  ["accent-ink", "pearl", 4.5, "cobalt text on ground"],
  ["accent-ink", "raised", 4.5, "cobalt text on card"],
  ["accent-ink", "accent-surface", 4.5, "cobalt text on cobalt wash"],
  ["warn", "warn-surface", 4.5, "warn text on warn wash"],
  ["ok", "ok-surface", 4.5, "ok text on ok wash"],
  ["danger", "danger-surface", 4.5, "danger text on danger wash"],
  ["#FFFFFF", "accent", 4.5, "white on cobalt primary button"],
  ["#FFFFFF", "#2E4FB6", 4.5, "white on pressed cobalt"],
  ["ink-faint", "pearl", 3.0, "placeholders/decorative (large or non-text only)"]
];

let fail = 0;
for (const [fg, bg, min, label] of pairs) {
  const fgv = fg.startsWith("#") ? fg : val(fg);
  const bgv = bg.startsWith("#") ? bg : val(bg);
  const r = ratio(fgv, bgv);
  const pass = r >= min;
  if (!pass) fail++;
  console.log((pass ? "PASS" : "FAIL"), r.toFixed(2) + ":1", fg, "on", bg, "—", label);
}
process.exit(fail ? 1 : 0);
