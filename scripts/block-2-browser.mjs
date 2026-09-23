import { chromium } from "file:///C:/Users/felype.souza/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.argv[2] || "http://127.0.0.1:3006";
const out = "output/playwright/block-2";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  reducedMotion: "reduce",
});
const passed = [],
  errors = [],
  requests = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("request", (r) =>
  requests.push({ url: r.url(), type: r.resourceType() }),
);
const check = (name, value) => {
  assert.ok(value, name);
  passed.push(name);
  console.log("PASS", name);
};
const cards = page.locator(".inventory-results .vehicle-card");
const count = () => cards.count();
const go = async (query = "") => {
  await page.goto(base + "/estoque" + query, { waitUntil: "networkidle" });
  await page.getByRole("searchbox", { name: "Buscar veículo" }).waitFor();
};
const price = async () => cards.locator("strong").allTextContents();
const numeric = (list) =>
  list.map((s) => Number(s.replace(/[^\d,]/g, "").replace(",", ".")));
try {
  await go();
  check("18 real vehicles, default price fallback", (await count()) === 18);
  check(
    "Cards retain lazy images and fixed ratio",
    await cards.evaluateAll((elements) =>
      elements.every(
        (card) =>
          card.querySelector("img")?.loading === "lazy" &&
          getComputedStyle(card.querySelector(".card-image")).aspectRatio !==
            "auto",
      ),
    ),
  );
  check(
    "Load more hidden below 24 items",
    (await page
      .getByRole("button", { name: "Carregar mais veículos" })
      .count()) === 0,
  );
  const defaultPrices = numeric(await price());
  check(
    "Default price order numeric ascending",
    defaultPrices.every((v, i) => !i || v >= defaultPrices[i - 1]),
  );
  check(
    "All six sorts exposed",
    (await page
      .getByRole("combobox", { name: "Ordenar veículos", exact: true })
      .locator("option")
      .count()) === 6,
  );
  const search = page.getByRole("searchbox", { name: "Buscar veículo" });
  const historyLength = await page.evaluate(() => history.length);
  for (const query of [
    "jetta",
    "Volkswagen",
    "hr-v",
    "hrv",
    "2023",
    "nivus highline",
  ]) {
    await search.fill(query);
    await page.waitForTimeout(350);
    check(
      "Search " + query,
      (await count()) > 0 &&
        new URL(page.url()).searchParams.get("q") === query,
    );
  }
  check(
    "Typing replaces history",
    (await page.evaluate(() => history.length)) === historyLength,
  );
  await page.getByRole("button", { name: "Todos", exact: true }).click();
  await page.evaluate(() => scrollTo({ top: 350, behavior: "instant" }));
  const y = await page.evaluate(() => scrollY);
  await page
    .getByRole("combobox", { name: "Ordenar veículos", exact: true })
    .selectOption("price-desc");
  check(
    "Discrete sort pushes history",
    (await page.evaluate(() => history.length)) === historyLength + 2,
  );
  check(
    "Filter does not reset scroll",
    Math.abs((await page.evaluate(() => scrollY)) - y) < 2,
  );
  const desc = numeric(await price());
  check(
    "Descending price order",
    desc.every((v, i) => !i || v <= desc[i - 1]),
  );
  await page.goBack();
  check(
    "Back restores sort",
    (await page
      .getByRole("combobox", { name: "Ordenar veículos", exact: true })
      .inputValue()) === "recommended",
  );
  await page.goForward();
  check(
    "Forward restores sort",
    (await page
      .getByRole("combobox", { name: "Ordenar veículos", exact: true })
      .inputValue()) === "price-desc",
  );
  await go();
  await search.fill("hrv");
  await page.getByRole("button", { name: "SUV", exact: true }).click();
  await page.waitForTimeout(400);
  check(
    "Pending search plus discrete chip survives debounce",
    new URL(page.url()).searchParams.get("q") === "hrv" &&
      new URL(page.url()).searchParams.get("body") === "suv",
  );
  await page.goBack();
  await page.waitForTimeout(400);
  check(
    "Back restores search before chip without stale timer",
    (await search.inputValue()) === "hrv" &&
      !new URL(page.url()).searchParams.has("body"),
  );
  await go("?sort=price-asc&maxPrice=140000&body=suv&q=nivus");
  check(
    "Shared URL hydrates query and filters",
    (await search.inputValue()) === "nivus" && (await count()) > 0,
  );
  await page.reload({ waitUntil: "networkidle" });
  check("Reload retains query", (await search.inputValue()) === "nivus");
  await go("?maxPrice=1");
  check(
    "Empty state",
    (await count()) === 0 &&
      (await page
        .getByRole("heading", {
          name: "Nenhum veículo corresponde a esses filtros.",
        })
        .isVisible()),
  );
  const whatsapp = page.getByRole("link", {
    name: "Falar com a M3 pelo WhatsApp",
  });
  check(
    "Empty state has contact link (not submitted)",
    (await whatsapp.getAttribute("href")).startsWith(
      "https://wa.me/5511930055771",
    ),
  );
  await page.getByRole("button", { name: /Ampliar até/ }).click();
  check("Price recovery reveals real stock", (await count()) > 0);
  await go();
  await page.getByRole("button", { name: "Filtros (0)", exact: true }).click();
  await page
    .getByRole("combobox", { name: "Marca", exact: true })
    .selectOption("Honda");
  check(
    "Brand narrows catalog",
    (await count()) > 0 &&
      (await cards.allTextContents()).every((t) => t.includes("Honda")),
  );
  check(
    "Single-value model hidden",
    (await page
      .getByRole("combobox", { name: "Modelo", exact: true })
      .count()) === 0,
  );
  await page
    .getByRole("combobox", { name: "Marca", exact: true })
    .selectOption("Volkswagen");
  check(
    "Model depends on selected brand",
    (await page
      .getByRole("combobox", { name: "Modelo", exact: true })
      .locator("option")
      .count()) > 2,
  );
  check(
    "Configuration hidden without known variety",
    (await page
      .getByRole("combobox", { name: "Configuração", exact: true })
      .count()) === 0,
  );
  const slider = page.getByRole("slider", {
    name: "Preço mínimo",
    exact: true,
  });
  await slider.focus();
  const before = Number(await slider.inputValue());
  await page.keyboard.press("ArrowRight");
  check(
    "Price slider supports keyboard",
    Number(await slider.inputValue()) === before + 1,
  );
  await go();
  for (const label of [
    "Até R$ 50 mil",
    "Até R$ 70 mil",
    "Até R$ 100 mil",
    "SUV",
    "Sedan",
    "Hatch",
    "Automático",
  ]) {
    const chip = page.getByRole("button", { name: label, exact: true });
    if (await chip.count()) {
      await chip.click();
      check("Chip " + label + " has matches", (await count()) > 0);
      await page.getByRole("button", { name: "Todos", exact: true }).click();
    }
  }
  await page.setViewportSize({ width: 375, height: 844 });
  await go();
  const trigger = page.getByRole("button", {
    name: "Filtrar (0)",
    exact: true,
  });
  await trigger.click();
  const modal = page.getByRole("dialog", { name: "Filtrar veículos" });
  check("Mobile dialog open", await modal.isVisible());
  check(
    "Background scroll locked",
    (await page.evaluate(() => document.body.style.overflow)) === "hidden",
  );
  for (let i = 0; i < 18; i++) {
    await page.keyboard.press("Tab");
    assert.ok(
      await page.evaluate(() =>
        document.querySelector("dialog").contains(document.activeElement),
      ),
      "Focus escaped dialog",
    );
  }
  passed.push("Tab focus remains inside modal");
  await modal.getByRole("button", { name: /Ver 18 veículos/ }).focus();
  await page.keyboard.press("Tab");
  check(
    "Tab wraps in drawer",
    (await page.evaluate(() =>
      document.activeElement.getAttribute("aria-label"),
    )) === "Fechar painel",
  );
  await page.keyboard.press("Escape");
  check(
    "Escape closes drawer and restores trigger",
    !(await modal.isVisible()) &&
      (await trigger.evaluate((e) => e === document.activeElement)),
  );
  await trigger.click();
  await modal
    .getByRole("combobox", { name: "Marca", exact: true })
    .selectOption("Honda");
  await modal.getByRole("button", { name: /Ver \d+ veículos/ }).click();
  check(
    "Mobile filter count",
    await page
      .getByRole("button", { name: "Filtrar (1)", exact: true })
      .isVisible(),
  );
  await page.getByRole("button", { name: "Ordenar", exact: true }).click();
  const sortModal = page.getByRole("dialog", { name: "Ordenar veículos" });
  await sortModal
    .getByRole("combobox", { name: "Ordenar veículos", exact: true })
    .selectOption("year-desc");
  await sortModal.getByRole("button", { name: /Ver \d+ veículos/ }).click();
  check(
    "Mobile sort URL",
    new URL(page.url()).searchParams.get("sort") === "year-desc",
  );
  await page.getByRole("button", { name: "Filtrar (1)", exact: true }).click();
  await modal.getByRole("button", { name: "Limpar", exact: true }).click();
  check(
    "Clear updates drawer count",
    await modal
      .getByRole("button", { name: "Ver 18 veículos", exact: true })
      .isVisible(),
  );
  await page.keyboard.press("Escape");
  const start = requests.length;
  await search.fill("nivus");
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: "Todos", exact: true }).click();
  check(
    "Filtering triggers no external data requests",
    requests
      .slice(start)
      .filter(
        (r) =>
          new URL(r.url).origin !== new URL(base).origin ||
          new URL(r.url).pathname.startsWith("/api/"),
      ).length === 0,
  );
  await page.evaluate(() =>
    scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await page.waitForTimeout(200);
  check(
    "Fixed controls do not cover the footer",
    !(await page
      .getByRole("button", { name: "Filtrar (0)", exact: true })
      .isVisible()),
  );
  check("No browser errors", errors.length === 0);
} finally {
  await writeFile(
    `${out}/interaction-report.json`,
    JSON.stringify(
      {
        passed,
        errors,
        dataRequests: requests.filter((r) => ["fetch", "xhr"].includes(r.type)),
        note: "Local Next Link prefetch requests are retained; filtering uses local data and makes no external/API request.",
      },
      null,
      2,
    ),
  );
  await browser.close();
}
