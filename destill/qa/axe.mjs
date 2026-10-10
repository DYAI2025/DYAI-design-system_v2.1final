/* Destill QA — axe-core in a real Chromium.
   Usage: CHROME_PATH=... node qa/axe.mjs */
import puppeteer from "puppeteer-core";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const axeSrc = readFileSync(join(root, "node_modules", "axe-core", "axe.min.js"), "utf8");

const CHROME = process.env.CHROME_PATH;
if (!CHROME) { console.error("Set CHROME_PATH"); process.exit(2); }

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu", "--no-zygote"] });

const states = ["#/welcome", "#/source?mode=demo", "#/understanding?mode=demo",
  "#/refine?mode=demo", "#/result?mode=demo", "#/blocked-render?mode=demo"];

let total = 0;
for (const h of states) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("file://" + join(root, "index.html") + h, { waitUntil: "load" });
  await new Promise(r => setTimeout(r, 300));
  await page.evaluate(axeSrc);
  const res = await page.evaluate(async () => {
    const r = await window.axe.run(document, { resultTypes: ["violations"] });
    return r.violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length,
      sample: v.nodes[0] ? v.nodes[0].target.join(" ") : "" }));
  });
  console.log("== " + h);
  if (!res.length) console.log("   no violations");
  res.forEach(v => { total++; console.log("  ", v.impact, v.id, "x" + v.n, v.sample); });
  await page.close();
}
await browser.close();
console.log(total === 0 ? "AXE CLEAN" : "AXE ISSUES " + total);
