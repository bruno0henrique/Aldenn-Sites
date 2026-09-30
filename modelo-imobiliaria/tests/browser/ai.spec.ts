import { test, expect } from "@playwright/test";
import { defaultFilters } from "../../lib/property";

test("AI search shows streamed summary, real cards and opens all results with persistent filters", async ({ page }) => {
  await page.route("**/api/imobiliaria/busca", async (route) => {
    expect(route.request().postDataJSON().query).toContain("Aquarius");
    await route.fulfill({ contentType: "application/x-ndjson", body: [
      { type: "delta", text: "Vou buscar " }, { type: "delta", text: "aluguel no Aquarius." },
      { type: "complete", message: "Vou buscar aluguel no Aquarius.", filters: { ...defaultFilters, purpose: "locacao", location: "Aquarius", minSuites: "2" }, count: 1 },
    ].map((item) => JSON.stringify(item)).join("\n") + "\n" });
  });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/demonstracao-imobiliaria/?skip=opening#imoveis");
    await page.getByRole("button", { name: "Busca com IA", exact: true }).click();
    await expect(page.locator(".filters-primary")).toHaveCount(0);
    await expect(page.locator(".property-grid")).toHaveCount(0);
    await page.getByLabel("O que você procura?").fill("Alugar no Aquarius com pelo menos duas suítes");
    await page.getByRole("button", { name: "Buscar com IA", exact: true }).click();
    await expect(page.locator(".ai-response")).toContainText("Vou buscar aluguel no Aquarius.");
    await expect(page.locator(".ai-match")).toHaveCount(1);
    await expect(page.locator(".ai-match")).toContainText("Casablanca");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("link", { name: "Ver tudo 1" }).click();
    await expect(page).toHaveURL(/minSuites=2/);
    await expect(page.locator(".property-card")).toHaveCount(1);
    await page.reload(); await expect(page.locator(".property-card")).toHaveCount(1);
    await page.getByRole("button", { name: "Filtros", exact: true }).click();
    await expect(page.getByLabel("Mínimo de suítes", { exact: true })).toHaveValue("2");
  }
});
test("AI errors allow manual search, no fabricated suggestions", async ({ page }) => {
  await page.route("**/api/imobiliaria/busca", (route) => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ message: "Temporariamente indisponível." }) }));
  await page.goto("/demonstracao-imobiliaria/?skip=opening#imoveis");
  await page.getByRole("button", { name: "Busca com IA", exact: true }).click();
  await page.getByLabel("O que você procura?").fill("Uma casa em Urbanova");
  await page.getByRole("button", { name: "Buscar com IA", exact: true }).click();
  await expect(page.locator(".ai-error")).toContainText("indisponível");
  await expect(page.locator(".ai-match")).toHaveCount(0);
  await page.getByRole("button", { name: "Ajustar na pesquisa completa" }).click();
  await expect(page.getByLabel("Cidade", { exact: true })).toBeVisible();
});
test("AI feature spelling and multiple criteria remain visible after opening the filtered catalog", async ({ page }) => {
  await page.goto("/demonstracao-imobiliaria/?feature=Piscina%7CElevador#imoveis");
  await expect(page.locator(".property-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Filtros", exact: true }).click();
  await expect(page.getByLabel("Diferencial", { exact: true })).toHaveValue("Piscina|Elevador");
  await expect(page.getByLabel("Diferencial", { exact: true }).locator("option:checked")).toHaveText("Piscina, Elevador");
});
test("Ver tudo exits AI even when its destination is the current URL, and replaces previous criteria", async ({ page }) => {
  let wanted = { ...defaultFilters, purpose: "venda" };
  await page.route("**/api/imobiliaria/busca", (route) => route.fulfill({ contentType: "application/x-ndjson", body: JSON.stringify({ type: "complete", message: "Vou organizar os imóveis pedidos.", filters: wanted, count: wanted.purpose ? 4 : 6 }) + "\n" }));
  for (const [initial, expected] of [["purpose=venda", 4], ["", 6], ["purpose=locacao&city=Jacare%C3%AD&maxPrice=10000", 4]] as const) {
    wanted = { ...defaultFilters, purpose: expected === 4 ? "venda" : "" };
    await page.goto(`/demonstracao-imobiliaria/?${initial}#imoveis`);
    await page.getByRole("button", { name: "Busca com IA", exact: true }).click();
    await page.getByLabel("O que você procura?").fill("Quero ver os imóveis disponíveis");
    await page.getByRole("button", { name: "Buscar com IA", exact: true }).click();
    await page.getByRole("link", { name: `Ver tudo ${expected}` }).click();
    await expect(page.locator(".ai-search")).toHaveCount(0);
    await expect(page.locator(".property-card")).toHaveCount(expected);
    expect(new URL(page.url()).searchParams.get("city")).toBeNull();
    expect(new URL(page.url()).searchParams.get("maxPrice")).toBeNull();
    await page.reload();
    await expect(page.locator(".property-card")).toHaveCount(expected);
  }
});
