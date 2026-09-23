import { chromium } from "file:///C:/Users/felype.souza/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { mkdir, writeFile } from "node:fs/promises";
const phase = process.argv[2] || "after";
const base = process.argv[3] || "http://127.0.0.1:3006";
const out = `output/playwright/block-2/${phase}`;
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  channel: "msedge",
  headless: true,
  args: ["--disable-gpu"],
});
let page;
const rows = [],
  errors = [];

try {
  for (const width of [375, 768, 1280, 1920]) {
    for (const route of ["/", "/estoque"]) {
      page = await browser.newPage({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      page.on("pageerror", (e) => errors.push(e.message));
      const response = await page.goto(base + route, {
        waitUntil: "networkidle",
        timeout: 90000,
      });
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (const img of document.images) img.loading = "eager";
        await Promise.all(
          [...document.images].map((i) => i.decode().catch(() => {})),
        );
      });
      await page.addStyleTag({
        content:
          "*{animation:none!important;transition:none!important;caret-color:transparent!important}",
      });
      await page.evaluate(() => scrollTo(0, 0));
      const name = route === "/" ? "home" : "stock";
      await page.screenshot({
        path: `${out}/${name}-${width}.png`,
        fullPage: true,
      });
      const metrics = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        broken: [...document.images]
          .filter((i) => !i.naturalWidth)
          .map((i) => i.src),
        columns: document.querySelector(".inventory-layout .vehicle-grid")
          ? getComputedStyle(
              document.querySelector(".inventory-layout .vehicle-grid"),
            ).gridTemplateColumns
          : null,
      }));
      for (const selector of route === "/estoque"
        ? ["header", ".inventory-heading", "footer"]
        : []) {
        await page.locator(selector).screenshot({
          path: `${out}/${name}-${width}-${selector.replace(".", "")}.png`,
        });
      }
      if (phase === "after" && route === "/estoque") {
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        await page.waitForTimeout(150);
        if (width < 810) {
          await page
            .getByRole("button", { name: "Filtrar (0)", exact: true })
            .click();
          await page.screenshot({ path: `${out}/drawer-${width}.png` });
          await page.keyboard.press("Escape");
        } else {
          await page
            .getByRole("button", { name: "Filtros (0)", exact: true })
            .click();
          await page
            .locator("#conteudo")
            .screenshot({ path: `${out}/advanced-${width}.png` });
        }
      }
      rows.push({ route, width, status: response.status(), ...metrics });
      console.log(phase, width, route);
      await page.close();
    }
  }
} finally {
  await writeFile(
    `${out}/report.json`,
    JSON.stringify({ rows, errors }, null, 2),
  );
  await browser.close();
}
