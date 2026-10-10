/* Destill QA — token integrity.
   1) every var(--x) referenced in css/ or *.html is defined in tokens.css
   2) radii are ordered shell > card > well > ctl > chip
   Run: npm run tokens */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokensCss = readFileSync(join(root, "css", "tokens.css"), "utf8");

const defined = new Set([...tokensCss.matchAll(/--([\w-]+)\s*:/g)].map(m => m[1]));

const files = [
  join(root, "css", "components.css"),
  join(root, "css", "app.css"),
  join(root, "index.html"),
  join(root, "spec", "foundations.html")
];

let missing = 0;
for (const f of files) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(/var\(--([\w-]+)/g)) {
    if (!defined.has(m[1])) { missing++; console.log("UNDEFINED var --" + m[1], "used in", f); }
  }
}

const px = (n) => { const m = tokensCss.match(new RegExp("--" + n + ":\\s*(\\d+)px")); return m ? +m[1] : NaN; };
const radii = ["r-shell", "r-card", "r-well", "r-ctl", "r-chip"].map(px);
const ordered = radii.every((v, i) => i === 0 || radii[i - 1] > v);
console.log("radii:", radii.join(" > "), ordered ? "ORDERED" : "OUT OF ORDER");
if (!ordered) missing++;

/* shadow values present and compound */
for (const s of ["sh-raise-lg", "sh-raise", "sh-raise-sm", "sh-inset", "sh-inset-sm", "sh-inset-deep"]) {
  if (!defined.has(s)) { missing++; console.log("UNDEFINED shadow", s); }
}
console.log(missing === 0 ? "TOKENS OK" : "TOKENS FAIL " + missing);
process.exit(missing ? 1 : 0);
