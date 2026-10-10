/* Destill QA — dump console/page errors for a URL. Usage: node qa/console.mjs <url> */
import puppeteer from "puppeteer-core";
const CHROME = process.env.CHROME_PATH;
if (!CHROME) { console.error("Set CHROME_PATH"); process.exit(2); }
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu", "--no-zygote"] });
const page = await browser.newPage();
page.on("console", m => console.log("CONSOLE", m.type(), m.text()));
page.on("pageerror", e => console.log("PAGEERROR", e.message));
await page.goto(process.argv[2], { waitUntil: "load" });
await new Promise(r => setTimeout(r, 400));
console.log("stage children:", await page.evaluate(() => document.getElementById("stage")?.children.length));
await browser.close();
