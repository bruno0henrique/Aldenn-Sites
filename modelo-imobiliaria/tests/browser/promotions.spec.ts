import { test, expect } from "@playwright/test";
import { defaultFilters } from "../../lib/property";
import { createPromotion, promotionStorageKey } from "../../lib/promotions";

test.beforeEach(async ({ page }) => { await page.addInitScript(() => { if (localStorage.getItem("aldenn-imoveis-demo-boosts-v1") === null) localStorage.setItem("aldenn-imoveis-demo-boosts-v1", "[]"); }); });
test("Enter sends a color search once; Shift+Enter retains newline and Ver todas retains color", async ({ page }) => {
  let requests = 0;
  await page.route("**/api/imobiliaria/busca", (route) => { requests++; return route.fulfill({ contentType: "application/x-ndjson", body: JSON.stringify({ type: "complete", message: "Casas de tons brancos.", filters: { ...defaultFilters, type: "Casa", color: "branca" }, count: 3 }) + "\n" }); });
  await page.goto("/demonstracao-imobiliaria/?skip=opening#imoveis");
  await page.getByRole("button", { name: "Busca inteligente", exact: true }).click();
  const query = page.getByLabel("O que você procura?");
  await query.fill("casa cor branca"); await query.press("Shift+Enter");
  expect(requests).toBe(0); await expect(query).toHaveValue("casa cor branca\n");
  await query.press("Enter"); await expect(page.locator(".ai-match")).toHaveCount(3); expect(requests).toBe(1);
  await page.getByRole("link", { name: "Ver todas 3" }).click(); await expect(page).toHaveURL(/color=branca/);
  await expect(page.locator(".property-card")).toHaveCount(3); await page.reload(); await expect(page.locator(".property-card")).toHaveCount(3);
  await page.getByRole("button", { name: "Filtros", exact: true }).click(); await expect(page.getByLabel("Cor / tom", { exact: true })).toHaveValue("branca");
});
test("promotion dialog is usable from 320 to 1440, shows prices and stores only demo campaign", async ({ page }) => {
  let posts = 0; page.on("request", (request) => { if (request.method() === "POST") posts++; });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/demonstracao-imobiliaria/?skip=opening#imoveis");
    if (width < 701) await page.getByRole("button", { name: "Abrir menu" }).click();
    await page.getByRole("button", { name: "Promover", exact: true }).click();
    const modal = page.getByRole("dialog", { name: "Promover imóvel" }); await expect(modal).toBeVisible();
    await expect(modal).toContainText(/R\$\s*49/); await expect(modal).toContainText(/R\$\s*149/); await expect(modal).toContainText(/R\$\s*299/);
    expect(await modal.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    await page.getByLabel("Imóvel para promover").selectOption("26556");
    await page.getByRole("radio", { name: /Até alugar/ }).check();
    await page.getByRole("button", { name: /Simular promoção|Atualizar boost simulado/ }).click();
    await expect(page.getByRole("status")).toContainText("Promoção ativada");
    await page.getByRole("button", { name: "Ver os destaques" }).click();
    await expect(page.locator(".property-card").first()).toContainText("Casablanca");
    await expect(page.locator(".is-promoted")).toHaveCount(1);
    await page.reload(); await expect(page.locator(".property-card").first()).toContainText("Casablanca");
    expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([promotionStorageKey]);
    if (width < 701) await page.getByRole("button", { name: "Abrir menu" }).click();
    await page.getByRole("button", { name: "Promover", exact: true }).click();
    await page.getByRole("button", { name: "Encerrar boost 26556" }).click(); await page.keyboard.press("Escape");
    await expect(page.locator(".is-promoted")).toHaveCount(0);
  }
  expect(posts).toBe(0);
});
test("four boosts cap at three and all filters constrain promotion priority", async ({ page }) => {
  const campaigns = ["27236", "13027", "21457", "26556"].map((reference, index) => createPromotion(reference, "week", Date.now() - 100 + index));
  await page.addInitScript(({ key, campaigns }) => localStorage.setItem(key, JSON.stringify(campaigns)), { key: promotionStorageKey, campaigns });
  await page.goto("/demonstracao-imobiliaria/?skip=opening#imoveis");
  await expect(page.locator(".is-promoted")).toHaveCount(3); await expect(page.locator(".property-card").first()).toContainText("Casablanca");
  await page.getByLabel("Localização", { exact: true }).fill("Jacareí"); await expect(page.locator(".property-card")).toHaveCount(1); await expect(page.locator(".is-promoted")).toContainText("Santanna");
  await page.getByRole("group", { name: "Modo de busca" }).getByRole("button", { name: "Comprar", exact: true }).click(); await expect(page.locator(".property-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Limpar filtros", exact: true }).click();
  await page.getByLabel("Tipo de imóvel", { exact: true }).selectOption("Apartamento"); await expect(page.locator(".property-card")).toHaveCount(2); await expect(page.locator(".property-card").first()).toContainText("Casablanca");
});
