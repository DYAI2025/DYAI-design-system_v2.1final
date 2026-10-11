/* Destill QA — end-to-end interaction in a real Chromium.
   Drives the demo journey with real clicks and asserts state changes.
   Usage: CHROME_PATH=... node qa/e2e.mjs */
import puppeteer from "puppeteer-core";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = process.env.CHROME_PATH;
if (!CHROME) { console.error("Set CHROME_PATH"); process.exit(2); }

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu", "--no-zygote"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

let failures = 0;
function check(name, cond) {
  console.log((cond ? "PASS" : "FAIL"), name);
  if (!cond) failures++;
}
const view = () => page.evaluate(() => document.querySelector("#stage [data-view]")?.dataset.view);
const click = (sel) => page.click(sel);
const waitView = async (v, ms = 12000) => {
  try {
    await page.waitForFunction(
      (want) => document.querySelector("#stage [data-view]")?.dataset.view === want,
      { timeout: ms }, v);
    return true;
  } catch { return false; }
};

await page.goto("file://" + join(root, "index.html") + "#/welcome", { waitUntil: "load" });
check("boots to welcome", (await view()) === "welcome");

await click("#demo-start");
check("demo start -> source", (await view()) === "source");
check("mode chip says synthetic", await page.evaluate(() =>
  document.getElementById("mode-chip").textContent.includes("SYNTHETIC")));

await page.type("#intent", "Keep only the strong claims");
await click("#analyze");
check("analyze -> processing", (await view()) === "processing");

await click("#cancel");
check("cancel -> cancelled", (await view()) === "cancelled");

await click("#resume");
check("resume -> processing", (await view()) === "processing");
check("processing completes -> understanding", await waitView("understanding"));

/* seek via evidence chip */
await click('.evidence [data-seek="58"]');
const t1 = await page.evaluate(() => document.getElementById("tl-now").textContent);
check("evidence chip seeks to 00:58", t1 === "00:58");

/* keyboard seek on the slider */
await page.focus("#tl");
await page.keyboard.press("ArrowRight");
const t2 = await page.evaluate(() => document.getElementById("tl-now").textContent);
check("arrow key advances playhead", t2 === "01:03");

await click("#to-refine");
check("refine view", (await view()) === "refine");
const before = await page.evaluate(() => document.getElementById("out-sec").textContent);
check("default outcome 02:58", before === "02:58");

/* flip the tangent back to KEEP */
await page.click('.seg-row[data-seg="s4"] [data-v="keep"]');
const after = await page.evaluate(() => document.getElementById("out-sec").textContent);
check("decision recomputes outcome to 03:34", after === "03:34");
check("timeline segment un-dropped", await page.evaluate(() =>
  document.querySelector('.tl-seg[data-decision="drop"][data-role="aside"]') === null));

/* flip it back to DROP, then go to result */
await page.click('.seg-row[data-seg="s4"] [data-v="drop"]');
await click("#to-result");
check("result concept view", (await view()) === "result");
check("prompt contains removal", await page.evaluate(() =>
  document.getElementById("prompt").textContent.includes("Remove 01:36–02:12")));

await click("#copy-prompt");
await new Promise(r => setTimeout(r, 300));
check("copy feedback shows", await page.evaluate(() =>
  document.getElementById("copy-prompt").textContent.includes("Copied")));

/* blocked render path */
await click("#back-refine");
check("back to refine", (await view()) === "refine");
await click("#export-mp4");
check("export -> blocked-render", (await view()) === "blocked-render");
await click("#to-result");
check("blocked -> result concept", (await view()) === "result");

/* rail navigation back to understand */
await page.click('.rail-step[data-step="1"]');
check("rail returns to understanding", (await view()) === "understanding");

/* real-file error paths: nothing is uploaded, nothing is inferred */
await page.goto("file://" + join(root, "index.html") + "#/welcome", { waitUntil: "load" });
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
const txt = join(tmpdir(), "destill-notes.txt");
const bad = join(tmpdir(), "destill-broken.mp4");
writeFileSync(txt, "hello");
writeFileSync(bad, "not a real bitstream");
const fileInput = await page.$("input[type=file]");
await fileInput.uploadFile(txt);
await new Promise(r => setTimeout(r, 250));
check("non-video rejected with honest notice", await page.evaluate(() =>
  document.body.textContent.includes("not a video")));
await fileInput.uploadFile(bad);
await page.waitForFunction(() => document.body.textContent.includes("could not be decoded"), { timeout: 5000 })
  .then(() => check("undecodable file -> honest error", true))
  .catch(() => check("undecodable file -> honest error", false));

/* reduced motion collapses transitions */
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
const dur = await page.evaluate(() => getComputedStyle(document.querySelector(".btn")).transitionDuration);
check("reduced motion collapses transitions (" + dur + ")", !dur.includes("0.14"));

await browser.close();
console.log(failures === 0 ? "E2E CLEAN" : "E2E FAILURES " + failures);
process.exit(failures ? 1 : 0);
