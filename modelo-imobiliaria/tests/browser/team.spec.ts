import { test, expect } from "@playwright/test";

test("team preview opens a dedicated page; keys and private notes persist independently of public listings", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demonstracao-imobiliaria/?skip=opening");
  await page.getByRole("button", { name: "Entrar / perfil", exact: true }).click();
  await page.getByRole("link", { name: "Conhecer a área da equipe", exact: true }).click();
  await expect(page).toHaveURL(/\/equipe\/$/);
  await expect(page.locator(".team-item")).toHaveCount(6);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.locator('.team-item[href*="27236"]').click();
  await expect(page.locator(".team-facts")).toContainText("390 m²");
  await page.getByLabel("Situação da chave", { exact: true }).selectOption("Retirada para visita");
  await page.getByLabel("Imobiliária com a chave", { exact: true }).fill("Imobiliária de exemplo B");
  await page.getByLabel("Local / responsável pela chave", { exact: true }).fill("Equipe de visitas");
  await page.getByLabel("Identificação / cópias da chave", { exact: true }).fill("Chave 12 · duas cópias");
  await page.getByRole("button", { name: "Salvar informações", exact: true }).click();
  await expect(page.getByText("Informações salvas.", { exact: true })).toBeVisible();
  await page.getByLabel("Nova anotação", { exact: true }).fill("Conferir iluminação da varanda antes da visita.");
  await page.getByRole("button", { name: "Adicionar anotação", exact: true }).click();
  await page.reload();
  await expect(page.getByLabel("Imobiliária com a chave", { exact: true })).toHaveValue("Imobiliária de exemplo B");
  await expect(page.locator(".team-notes")).toContainText("Conferir iluminação da varanda");
  await expect(page.locator(".team-summary")).toContainText("Chaves em visita");
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.getByRole("link", { name: "Ver anúncio", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Casa no Vivant Urbanova");
  await expect(page.getByText("Imobiliária de exemplo B", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Conferir iluminação da varanda antes da visita.", { exact: true })).toHaveCount(0);
});

test("original listing can be edited without duplication; edits survive F5 in public detail and catalog", async ({ page }) => {
  await page.goto("/demonstracao-imobiliaria/equipe/?ref=27236");
  await page.getByRole("link", { name: "Editar dados", exact: true }).click();
  await expect(page.getByLabel("Título", { exact: true })).toHaveValue("Casa no Vivant Urbanova");
  await page.getByLabel("Título", { exact: true }).fill("Casa Vivant com varanda integrada");
  await page.getByRole("checkbox", { name: "Conferi os dados, valores e fotografias" }).check();
  await page.getByRole("button", { name: "Salvar alterações", exact: true }).click();
  await expect(page.locator(".editor-success")).toContainText("Detalhes atualizados.");
  await page.getByRole("link", { name: "Ver anúncio", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Casa Vivant com varanda integrada");
  await page.reload(); await expect(page.getByRole("heading", { level: 1 })).toHaveText("Casa Vivant com varanda integrada");
  await page.goto("/demonstracao-imobiliaria/?skip=opening#imoveis");
  await expect(page.locator(".property-card")).toHaveCount(6);
  await expect(page.locator(".property-card h3")).toContainText(["Casa Vivant com varanda integrada"]);
  await page.goto("/demonstracao-imobiliaria/equipe/?ref=27236");
  await expect(page.locator(".team-property-overview h2")).toHaveText("Casa Vivant com varanda integrada");
});

test("developments can be added, edited and offered in the property editor after reload", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/demonstracao-imobiliaria/equipe/");
  await page.getByRole("button", { name: "Empreendimentos", exact: true }).click();
  await page.getByRole("button", { name: "Novo empreendimento", exact: true }).click();
  await page.getByLabel("Nome do empreendimento", { exact: true }).fill("Residencial Horizonte");
  await page.getByLabel("Cidade do empreendimento", { exact: true }).fill("Taubaté");
  await page.getByLabel("Bairro do empreendimento", { exact: true }).fill("Centro");
  await page.getByRole("button", { name: "Salvar empreendimento", exact: true }).click();
  const card = page.locator(".team-development-list article").filter({ hasText: "Residencial Horizonte" });
  await expect(card).toContainText("0 imóveis vinculados");
  await card.getByRole("button", { name: "Editar empreendimento" }).click();
  await page.getByLabel("Sobre o empreendimento", { exact: true }).fill("Espaços integrados e jardim central.");
  await page.getByRole("button", { name: "Salvar empreendimento", exact: true }).click();
  await page.reload(); await page.getByRole("button", { name: "Empreendimentos", exact: true }).click();
  await expect(card).toContainText("jardim central");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("link", { name: "Cadastrar imóvel", exact: true }).click();
  await expect(page.locator('#team-developments option[value="Residencial Horizonte"]')).toHaveCount(1);
  await expect(page.getByLabel("Condomínio / empreendimento", { exact: true })).toHaveAttribute("list", "team-developments");
});
