import { chromium } from "playwright";

const pages = ["/", "/261", "/363", "/48", "/39", "/361"];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

for (const p of pages) {
  await page.goto(`http://localhost:3000${p}`, { waitUntil: "load" });
  await page.waitForTimeout(400);
  const name = p === "/" ? "home" : p.replace("/", "");
  await page.screenshot({
    path: `/private/tmp/claude-501/-Users-marcus-Desktop---------landingpage/2e67207b-48d9-465b-8d77-a865cf139d90/scratchpad/${name}.png`,
    fullPage: true,
  });
}

await browser.close();
console.log("done");
