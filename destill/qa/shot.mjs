/* Destill QA — real renders.
   Usage: CHROME_PATH=/path/to/chromium node qa/shot.mjs
   (plus LD_LIBRARY_PATH / FONTCONFIG_PATH when the binary needs them) */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "docs", "shots");
mkdirSync(out, { recursive: true });

const CHROME = process.env.CHROME_PATH;
if (!CHROME) { console.error("Set CHROME_PATH to a Chromium binary."); process.exit(2); }

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage",
    "--disable-gpu", "--no-zygote", "--font-render-hinting=none", "--force-color-profile=srgb"]
});

const page = await browser.newPage();
const url = (h) => "file://" + join(root, "index.html") + h;

async function state(name, hash, w, h, dsf = 1) {
  await page.setViewport({ width: w, height: h, deviceScaleFactor: dsf });
  await page.goto(url(hash), { waitUntil: "load" });
  await new Promise(r => setTimeout(r, 350));
  await page.screenshot({ path: join(out, name + ".png"), fullPage: true });
  console.log("shot", name);
}

/* full states — desktop 1440x900 */
await state("desktop-welcome", "#/welcome", 1440, 900);
await state("desktop-source", "#/source?mode=demo", 1440, 900);
await state("desktop-understanding", "#/understanding?mode=demo", 1440, 900);
await state("desktop-refine", "#/refine?mode=demo", 1440, 900);
await state("desktop-result", "#/result?mode=demo", 1440, 900);
await state("desktop-blocked-render", "#/blocked-render?mode=demo", 1440, 900);

/* other viewports */
await state("laptop-1280", "#/refine?mode=demo", 1280, 800);
await state("mobile-welcome", "#/welcome", 390, 844);
await state("mobile-refine", "#/refine?mode=demo", 390, 844);
await state("narrow-320", "#/understanding?mode=demo", 320, 700);

/* material details at 2x from the refine view */
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(url("#/refine?mode=demo"), { waitUntil: "load" });
await new Promise(r => setTimeout(r, 350));
async function clip(sel, name, pad = 26) {
  const h = await page.$(sel);
  if (!h) { console.log("missing", sel); return; }
  const b = await h.boundingBox();
  await page.screenshot({
    path: join(out, name + "@2x.png"),
    clip: { x: Math.max(0, b.x - pad), y: Math.max(0, b.y - pad), width: b.width + pad * 2, height: b.height + pad * 2 }
  });
  console.log("detail", name);
}
await clip(".timeline", "detail-timeline");
await clip(".seg--decide", "detail-segmented");
await clip("#to-result", "detail-primary-button");
await page.goto(url("#/welcome"), { waitUntil: "load" });
await new Promise(r => setTimeout(r, 300));
await clip("#dropzone", "detail-well");

/* foundations board */
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto("file://" + join(root, "spec", "foundations.html"), { waitUntil: "load" });
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: join(out, "foundations-board.png"), fullPage: true });
console.log("shot foundations-board");

await browser.close();
console.log("done");
