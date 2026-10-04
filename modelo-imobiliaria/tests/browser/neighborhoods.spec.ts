import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => { await page.addInitScript(() => { if (localStorage.getItem("aldenn-imoveis-demo-boosts-v1") === null) localStorage.setItem("aldenn-imoveis-demo-boosts-v1", "[]"); }); });
test("neighborhood cards open a reloadable regional page and apply search filters", async ({ page }) => {
  await page.goto("/demonstracao-imobiliaria/?skip=opening#bairros");
  const card = page.locator(".neighborhood-card").filter({ hasText: "Urbanova" });
  await expect(card).toBeVisible(); await card.click();
  await expect(page.getByRole("heading", { name: "Urbanova", exact: true })).toBeVisible();
  await expect(page.locator(".neighborhood-list .property-card")).toHaveCount(2); const count = 2;
  await page.reload(); await expect(page.locator(".property-card")).toHaveCount(count);
  for (const width of [320, 390, 768, 1440]) { await page.setViewportSize({ width, height: 900 }); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); }
  await page.getByRole("link", { name: "Comprar nesta região" }).click();
  await expect(page).toHaveURL(/neighborhood=Urbanova.*purpose=venda/); await expect(page.locator(".property-card")).toHaveCount(count);
  await page.goto("/demonstracao-imobiliaria/bairro/?city=Desconhecida&neighborhood=Teste");
  await expect(page.getByText("Este bairro ainda não faz parte da seleção.")).toBeVisible();
});
test("editor login opens and publication requires a fresh review", async ({ page }) => {
  await page.goto("/demonstracao-imobiliaria/equipe/cadastro/");
  await page.getByRole("button", { name: "Entrar no perfil", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Entrar no perfil" })).toBeVisible();
  await page.keyboard.press("Escape"); await page.getByRole("link", { name: "Equipe", exact: true }).click();
  await page.getByRole("link", { name: "Cadastrar imóvel", exact: true }).click();
  await expect(page.getByLabel("Finalidade", { exact: true })).toHaveValue("");
  await expect(page.locator(".editor-steps")).toHaveCount(0);
  const publish = page.getByRole("button", { name: "Publicar imóvel" });
  await expect(publish).toBeDisabled();
  await page.getByRole("checkbox", { name: "Conferi os dados, valores e fotografias" }).check();
  await expect(publish).toBeEnabled(); await page.getByLabel("Cidade", { exact: true }).fill("Taubaté"); await expect(publish).toBeDisabled();
});
