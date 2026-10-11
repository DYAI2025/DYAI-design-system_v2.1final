/* Destill QA — flatness test: render with every shadow removed. */
import puppeteer from "puppeteer-core";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true,
  args: ["--no-sandbox","--disable-dev-shm-usage","--disable-gpu","--no-zygote"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.evaluateOnNewDocument(() => {
  const s = document.createElement("style");
  s.textContent = "*,*::before,*::after{box-shadow:none!important;text-shadow:none!important}";
  document.addEventListener("DOMContentLoaded", () => document.head.appendChild(s));
});
for (const [h, n] of [["#/welcome", "flat-welcome"], ["#/refine?mode=demo", "flat-refine"]]) {
  await page.goto("file://" + join(root, "index.html") + h, { waitUntil: "load" });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: join(root, "docs", "shots", n + ".png"), fullPage: true });
  console.log("shot", n);
}
await browser.close();
