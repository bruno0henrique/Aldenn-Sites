import { test, expect } from "@playwright/test";
import { localPropertyKey } from "../../lib/local-properties";
test("mobile IA is centered below tabs; filters open and close without hiding the list", async ({ page }) => {
  for (const width of [320, 390, 700, 1440]) {
    await page.setViewportSize({ width, height: 850 });
    await page.goto("/demonstracao-imobiliaria/?skip=opening&purpose=locacao#imoveis");
    await expect(page.locator(".property-card")).toHaveCount(2);
    if (width <= 700) {
      await expect(page.getByLabel("Tipo de imóvel", { exact: true })).toHaveCount(0);
      const ai = await page.locator(".ai-tab").boundingBox(); const tabs = await page.locator(".catalog-tabs").boundingBox();
      expect(Math.abs(ai!.x + ai!.width / 2 - tabs!.x - tabs!.width / 2)).toBeLessThan(2);
    }
    await page.getByRole("button", { name: "Filtros", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Filtros de imóveis" }); await expect(dialog).toBeVisible();
    await dialog.getByLabel("Tipo de imóvel", { exact: true }).selectOption("Apartamento");
    await dialog.getByRole("button", { name: "Fechar", exact: true }).click();
    await expect(dialog).toHaveCount(0); await expect(page.locator(".property-card")).toHaveCount(1);
    await expect(page.locator(".property-card")).toBeVisible();
    await page.getByRole("button", { name: "Ver todos os imóveis", exact: true }).click(); await expect(page.locator(".property-card")).toHaveCount(6);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
test("hero code search is distinct from CEP and finds the matching reference", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 850 });
  await page.goto("/demonstracao-imobiliaria/?skip=opening");
  await page.getByRole("group", { name: "Finalidade da busca" }).getByRole("button", { name: "Código", exact: true }).click();
  await page.getByLabel("Código do imóvel na busca", { exact: true }).fill("24060");
  await page.getByRole("button", { name: "Encontrar imóvel", exact: true }).click();
  await expect(page).toHaveURL(/reference=24060/); await expect(page.locator(".property-card")).toHaveCount(1);
  await expect(page.locator(".property-card")).toContainText("Splendor Garden");
  await page.reload(); await expect(page.locator(".property-card")).toHaveCount(1);
});
test("more appends available entries; all resets an exhausted filtered selection", async ({ page }) => {
  const local = { reference: "LOCAL-00000000-0000-4000-8000-000000000001", slug: "cadastrado", title: "Casa cadastrada adicional", subtitle: "Espaço para viver", city: "Taubaté", neighborhood: "Centro", development: "", purpose: "venda", type: "Casa", price: 900000, builtArea: 180, landArea: null, condominium: null, iptu: null, bedrooms: 3, suites: 1, bathrooms: null, parking: 2, description: ["Descrição do imóvel"], features: [], amenities: [], colors: ["branca"], images: [{ path: "/media/illustrative/27236/01.webp", thumbnail: "/media/illustrative/27236/01.webp", width: 1400, height: 934 }], sourceUrl: "", consultedAt: new Date().toISOString() };
  await page.addInitScript(({ key, local }) => localStorage.setItem(key, JSON.stringify([local])), { key: localPropertyKey, local });
  await page.goto("/demonstracao-imobiliaria/?skip=opening#imoveis");
  await expect(page.locator(".property-card")).toHaveCount(6);
  await page.getByRole("button", { name: "Ver mais imóveis", exact: true }).click(); await expect(page.locator(".property-card")).toHaveCount(7);
  await expect(page.getByRole("button", { name: "Ver mais imóveis", exact: true })).toHaveCount(0);
});
test("initial Boost examples lead compatible results and can be ended without returning on reload", async ({ page }) => {
  await page.goto("/demonstracao-imobiliaria/?skip=opening#imoveis");
  await expect(page.locator(".is-promoted")).toHaveCount(3);
  await expect(page.locator(".property-card").nth(0)).toHaveClass(/is-promoted/);
  await page.getByRole("group", { name: "Modo de busca" }).getByRole("button", { name: "Alugar", exact: true }).click();
  await expect(page.locator(".is-promoted")).toHaveCount(1); await expect(page.locator(".property-card").first()).toContainText("Casablanca");
  await page.getByRole("button", { name: "Promover", exact: true }).click();
  await page.getByRole("button", { name: "Encerrar boost 26556" }).click(); await page.keyboard.press("Escape");
  await page.reload(); await expect(page.locator(".is-promoted")).toHaveCount(0);
});

test("simple filter tabs combine rent, minimum bedrooms and price; code bypasses old criteria", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 850 });
  await page.goto("/demonstracao-imobiliaria/?skip=opening#imoveis");
  await page.getByRole("button", { name: "Filtros", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Filtros de imóveis" });
  await expect(dialog.getByLabel("Área mínima (m²)")).not.toBeVisible();
  await dialog.getByLabel("Transação", { exact: true }).selectOption("locacao");
  await dialog.getByRole("button", { name: "4+", exact: true }).click();
  await dialog.getByLabel("Preço máximo (R$)", { exact: true }).fill("10000");
  await expect(dialog.getByRole("button", { name: "Buscar · 1 imóvel", exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "Código", exact: true }).click();
  await dialog.getByLabel("Código do imóvel", { exact: true }).fill("24060");
  await dialog.getByRole("button", { name: "Buscar · 1 imóvel", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator(".property-card")).toHaveCount(1);
  await expect(page.locator(".property-card")).toContainText("Splendor Garden");
  expect(new URL(page.url()).searchParams.get("purpose")).toBeNull();
  await page.reload(); await expect(page.locator(".property-card")).toHaveCount(1);
});
