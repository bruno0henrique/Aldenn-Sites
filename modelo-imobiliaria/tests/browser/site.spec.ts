import { test, expect } from "@playwright/test";

const path = "/demonstracao-imobiliaria";
test.beforeEach(async ({ page }) => { await page.addInitScript(() => { if (localStorage.getItem("aldenn-imoveis-demo-boosts-v1") === null) localStorage.setItem("aldenn-imoveis-demo-boosts-v1", "[]"); }); });
test("mobile filter options fit and touch controls remain comfortable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 360, 390, 430, 540, 600, 700]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${path}/?skip=opening#imoveis`);
    await expect(page.locator(".filters-primary")).toHaveCount(0);
    await page.evaluate(() => document.fonts.ready);
    const controls = await page.locator(".filters-primary select, .sort-label select").evaluateAll((elements) => elements.map((element) => {
      const select = element as HTMLSelectElement;
      const style = getComputedStyle(select);
      const context = document.createElement("canvas").getContext("2d")!;
      context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      return {
        longest: Math.max(...Array.from(select.options, (option) => context.measureText(option.text).width)),
        available: select.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - 24,
        height: select.getBoundingClientRect().height,
        font: parseFloat(style.fontSize),
      };
    }));
    for (const control of controls) {
      expect(control.longest).toBeLessThanOrEqual(control.available);
      expect(control.height).toBeGreaterThanOrEqual(44);
      expect(control.font).toBeGreaterThanOrEqual(16);
    }
    await page.getByRole("button", { name: "Filtros", exact: true }).click(); await page.locator(".more-search-filters summary").click();
    await expect(page.getByLabel("Preço máximo (R$)", { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("dialog", { name: "Filtros de imóveis" }).getByRole("button", { name: "Fechar", exact: true }).click();
  }
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(`${path}/imovel/apartamento-splendor-garden-venda/`);
  await page.getByRole("button", { name: "Ampliar foto 1 de Apartamento no Splendor Garden" }).click();
  const dialog = page.getByRole("dialog");
  expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await expect(dialog.getByText("1 / 8", { exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Solicitar contato", exact: true }).click();
  expect(await page.getByRole("dialog").evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.getByLabel("Seu nome", { exact: true }).fill("Teste mobile");
  await page.keyboard.press("Escape");
  await expect(page.getByLabel("Juros efetivos (% a.a.)", { exact: true })).toBeVisible();
});
test("catalog filters, empty state, URL reload and header navigation", async ({ page }) => {
  await page.goto(`${path}/`);
  await expect(page.locator(".property-card")).toHaveCount(6);
  await page.getByRole("group", { name: "Modo de busca" }).getByRole("button", { name: "Comprar", exact: true }).click();
  await expect(page.locator(".property-card")).toHaveCount(4);
  await page.getByLabel("Tipo de imóvel", { exact: true }).selectOption("Apartamento");
  await expect(page.locator(".property-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".property-card")).toHaveCount(1);
  await page.getByLabel("Localização", { exact: true }).fill("Curitiba");
  await expect(page.getByText("Nenhum imóvel desta seleção corresponde aos filtros.")).toBeVisible();
  await page.getByRole("button", { name: "Ver todos os imóveis", exact: true }).click();
  await expect(page.locator(".property-card")).toHaveCount(6);
  await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Alugar", exact: true }).click();
  await expect(page.locator(".property-card")).toHaveCount(2);
  await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Comprar", exact: true }).click();
  await expect(page.locator(".property-card")).toHaveCount(4);
});
test("combined price filters, sorting and browser back", async ({ page }) => {
  await page.goto(`${path}/?purpose=venda#imoveis`);
  await page.getByRole("button", { name: "Filtros", exact: true }).click(); await page.locator(".more-search-filters summary").click();
  await page.getByLabel("Preço mínimo (R$)", { exact: true }).fill("2950000");
  await page.getByLabel("Preço máximo (R$)", { exact: true }).fill("2980000");
  await expect(page.locator(".property-card")).toHaveCount(2);
  await page.getByRole("dialog", { name: "Filtros de imóveis" }).getByRole("button", { name: "Fechar", exact: true }).click(); await page.getByLabel("Ordenar imóveis").selectOption("highest");
  await expect(page.locator(".property-card h3").first()).toHaveText("Casa no Alphaville II");
  await page.getByLabel("Ordenar imóveis").selectOption("lowest");
  await expect(page.locator(".property-card h3").first()).toHaveText("Casa no Vivant Urbanova");
  await page.goBack();
  await expect(page.locator(".property-card h3").first()).toHaveText("Casa no Alphaville II");
});
test("gallery keyboard navigation, focus return and local photos", async ({ page }) => {
  await page.goto(`${path}/`);
  await page.locator(".property-card").first().click();
  await expect(page).toHaveURL(new RegExp(`${path}/imovel/casa-vivant-urbanova/?$`));
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Casa no Vivant Urbanova");
  const opener = page.getByRole("button", { name: "Ampliar foto 1 de Casa no Vivant Urbanova" });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.getByRole("button", { name: "Próxima foto" }).click();
  await expect(dialog.getByText("2 / 8", { exact: true })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByText("3 / 8", { exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
  await expect(page.locator(".gallery-main img")).not.toHaveJSProperty("naturalWidth", 0);
});
test("contact validation and WhatsApp previews never send or persist personal data", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => { if (!["GET", "HEAD"].includes(request.method())) requests.push(request.url()); });
  await page.goto(`${path}/imovel/casa-vivant-urbanova/`);
  await expect(page.locator(".contact-buttons button").first()).toHaveText("Conversar pelo WhatsApp");
  await expect(page.locator(".contact-buttons button").last()).toHaveText("Solicitar contato");
  await page.getByRole("button", { name: "Solicitar contato", exact: true }).click();
  await page.getByRole("button", { name: "Simular solicitação" }).click();
  await expect(page.getByRole("heading", { name: "Simulação concluída." })).toHaveCount(0);
  await page.getByLabel("Seu nome", { exact: true }).fill("Pessoa de Teste");
  await page.getByLabel("Telefone / WhatsApp", { exact: true }).fill("(11) 99999-9999");
  await page.getByRole("button", { name: "Simular solicitação" }).click();
  await expect(page.getByRole("heading", { name: "Simulação concluída." })).toBeVisible();
  await page.getByRole("button", { name: "Voltar aos imóveis", exact: true }).click();
  await page.getByRole("button", { name: "Conversar pelo WhatsApp", exact: true }).click();
  await expect(page.getByRole("dialog").getByText(/Não há envio ao WhatsApp/)).toBeVisible();
  expect(requests).toEqual([]);
  const storage = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
  expect(storage).toEqual({ local: { "aldenn-imoveis-demo-boosts-v1": "[]" }, session: {} });
});
test("financing uses zero interest, full entry and rejects empty or impossible input", async ({ page }) => {
  await page.goto(`${path}/imovel/casa-vivant-urbanova/`);
  await expect(page.getByTestId("payment")).not.toHaveText("R$ 0,00");
  await page.getByLabel("Juros efetivos (% a.a.)", { exact: true }).fill("0");
  await page.getByLabel("Prazo (meses)", { exact: true }).fill("100");
  await page.getByLabel("Entrada (R$)", { exact: true }).fill("950000");
  await expect(page.getByTestId("payment")).toHaveText(/20\.000,00/);
  await page.getByLabel("Entrada (R$)", { exact: true }).fill("2950000");
  await expect(page.getByTestId("payment")).toHaveText(/0,00/);
  await page.getByLabel("Entrada (R$)", { exact: true }).fill("3000000");
  await expect(page.locator(".financing").getByRole("alert")).toHaveText(/entrada deve ficar/);
  await page.getByLabel("Entrada (R$)", { exact: true }).fill("");
  await expect(page.locator(".financing").getByRole("alert")).toHaveText("Preencha os valores da simulação.");
});
test("all six direct detail pages load with photos and rentals omit financing", async ({ page }) => {
  for (const slug of ["casa-vivant-urbanova", "sobrado-residencial-jaguary", "casa-alphaville-ii", "apartamento-splendor-garden-venda", "casa-villa-de-santanna", "apartamento-casablanca-aquarius"]) {
    const response = await page.goto(`${path}/imovel/${slug}/`);
    expect(response?.status()).toBe(200);
    await expect(page.locator(".gallery-main img")).toBeVisible();
    await expect(page.locator(".gallery-main img")).not.toHaveJSProperty("naturalWidth", 0);
    await expect(page.getByText("Vídeo 3D em preparação", { exact: true })).toBeVisible();
    await expect(page.locator(".property-video video")).toHaveCount(0);
    const rental = slug === "casa-villa-de-santanna" || slug === "apartamento-casablanca-aquarius";
    await expect(page.locator(".financing")).toHaveCount(rental ? 0 : 1);
    if (rental) await expect(page.getByText("Total mensal informado", { exact: true })).toBeVisible();
  }
});
test("320-1920 px layouts and reduced motion stay usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["", "/imovel/casa-vivant-urbanova"]) {
      await page.goto(`${path}${route}/`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await expect(page.locator("body")).not.toHaveCSS("visibility", "hidden");
      if (!route) {
        await page.getByLabel("Localização da busca", { exact: true }).click();
        await expect(page.getByRole("listbox", { name: "Sugestões de localização" })).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        await page.getByLabel("Localização da busca", { exact: true }).press("Escape");
      }
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${path}/`);
  await expect(page.locator(".brand-intro")).not.toBeVisible();
  await expect(page.getByLabel("Localização da busca", { exact: true })).toHaveCSS("font-size", "16px");
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await page.getByRole("navigation").getByRole("link", { name: "Alugar", exact: true }).click();
  await expect(page.locator(".property-card")).toHaveCount(2);
});
test("bedrooms limit the maximum and suggestions work by keyboard", async ({ page }) => {
  await page.goto(`${path}/?skip=opening`);
  await page.getByLabel("Dormitórios", { exact: true }).selectOption("2");
  await expect(page.locator(".property-card")).toHaveCount(0);
  await page.getByLabel("Dormitórios", { exact: true }).selectOption("3");
  await expect(page.locator(".property-card")).toHaveCount(3);
  await page.getByLabel("Dormitórios", { exact: true }).selectOption("4");
  await expect(page.locator(".property-card")).toHaveCount(5);
  await page.getByLabel("Dormitórios", { exact: true }).selectOption("");
  await page.getByLabel("Localização da busca", { exact: true }).fill("jacarei");
  await page.getByLabel("Localização da busca", { exact: true }).press("ArrowDown");
  await page.getByLabel("Localização da busca", { exact: true }).press("Enter");
  await expect(page.getByLabel("Localização da busca", { exact: true })).toHaveValue("Jacareí");
  await page.getByRole("group", { name: "Finalidade da busca" }).getByRole("button", { name: "Alugar" }).click();
  await page.getByRole("button", { name: "Encontrar imóvel" }).click();
  await expect(page.locator(".property-card")).toHaveCount(1);
});
test("CEP and street lookup resolve to the neighborhood and handle invalid or unavailable service", async ({ page }) => {
  const address = { cep: "12246-000", logradouro: "Rua de Testes", bairro: "Jardim Aquarius", localidade: "São José dos Campos", uf: "SP" };
  await page.route("https://viacep.com.br/ws/**", async (route) => {
    const url = route.request().url();
    if (url.includes("99999999")) return route.fulfill({ json: { erro: true } });
    if (url.includes("88888888")) return route.abort();
    return route.fulfill({ json: url.includes("/SP/") ? [address] : address });
  });
  await page.goto(`${path}/?skip=opening`);
  await page.getByRole("group", { name: "Finalidade da busca" }).getByRole("button", { name: "Alugar" }).click();
  await page.getByLabel("Localização da busca", { exact: true }).fill("12246-000");
  await expect(page.getByRole("option", { name: /Rua de Testes/ })).toBeVisible();
  await page.getByRole("button", { name: "Encontrar imóvel" }).click();
  await expect(page.locator(".property-card")).toHaveCount(1);
  await expect(page.locator(".property-card h3")).toHaveText("Apartamento no Casablanca");
  await page.getByRole("button", { name: "Limpar localização da busca" }).click();
  await page.getByLabel("Localização da busca", { exact: true }).fill("Rua de Testes");
  await expect(page.getByRole("option", { name: /Rua de Testes/ })).toBeVisible();
  await page.getByRole("option", { name: /Rua de Testes/ }).click();
  await page.getByRole("button", { name: "Encontrar imóvel" }).click();
  await expect(page.locator(".property-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Limpar localização da busca" }).click();
  await page.getByLabel("Localização da busca", { exact: true }).fill("99999-999");
  await expect(page.getByRole("status")).toHaveText(/CEP não encontrado/);
  await page.getByLabel("Localização da busca", { exact: true }).fill("88888-888");
  await expect(page.getByRole("status")).toHaveText(/Consulta de endereços indisponível/);
  await page.getByLabel("Localização da busca", { exact: true }).fill("123");
  await expect(page.getByRole("status")).toHaveText(/8 números/);
});
test("all rendered property images use local illustrative galleries", async ({ page }) => {
  await page.goto(`${path}/?skip=opening`);
  await expect(page.locator(".hero-image")).toHaveAttribute("src", /\/media\/illustrative\//);
  for (const image of await page.locator(".card-photo img").all()) await expect(image).toHaveAttribute("src", /\/media\/illustrative\//);
  await page.goto(`${path}/imovel/apartamento-splendor-garden-venda/`);
  await expect(page.locator(".source-note")).toContainText("Modelo demonstrativo");
  await expect(page.locator(".gallery-main img")).toHaveAttribute("src", /\/media\/illustrative\//);
});

test("complete search combines dependent fields, ranges, URL reload and empty results", async ({ page }) => {
  await page.goto(`${path}/?skip=opening`);
  await page.getByRole("button", { name: "Pesquisa completa", exact: true }).click(); await page.locator(".more-search-filters summary").click();
  await expect(page.getByRole("dialog", { name: "Filtros de imóveis" })).toBeVisible();
  await page.getByLabel("Cidade", { exact: true }).selectOption("São José dos Campos");
  await page.getByLabel("Bairro", { exact: true }).selectOption("Jardim das Indústrias");
  await page.getByLabel("Condomínio / empreendimento", { exact: true }).selectOption("Splendor Garden");
  await page.getByLabel("Suítes", { exact: true }).selectOption("1");
  await page.getByLabel("Vagas de garagem", { exact: true }).selectOption("2");
  await page.getByLabel("Diferencial", { exact: true }).selectOption("academia");
  await page.getByLabel("Área mínima (m²)", { exact: true }).fill("100");
  await page.getByLabel("Área máxima (m²)", { exact: true }).fill("100");
  await expect(page.locator(".property-card")).toHaveCount(1);
  await expect(page.locator(".property-card h3")).toHaveText("Apartamento no Splendor Garden");
  await page.reload();
  await expect(page.locator(".property-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Filtros", exact: true }).click(); await page.locator(".more-search-filters summary").click();
  await expect(page.getByLabel("Cidade", { exact: true })).toHaveValue("São José dos Campos");
  await page.getByLabel("Área máxima (m²)", { exact: true }).fill("90");
  await expect(page.locator(".advanced-search").getByRole("alert")).toContainText("mínimo deve ser menor");
  await expect(page.locator(".property-card")).toHaveCount(0);
  await page.getByLabel("Área máxima (m²)", { exact: true }).fill("100");
  await page.getByLabel("Banheiros", { exact: true }).selectOption("7");
  await expect(page.locator(".property-card")).toHaveCount(0);
  await page.getByLabel("Cidade", { exact: true }).selectOption("Jacareí");
  await expect(page.getByLabel("Bairro", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Condomínio / empreendimento", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Bairro", { exact: true }).locator("option")).toHaveCount(2);
  if (await page.getByRole("dialog", { name: "Filtros de imóveis" }).isVisible()) await page.keyboard.press("Escape"); await page.getByRole("button", { name: "Limpar filtros", exact: true }).click();
  await expect(page.locator(".property-card")).toHaveCount(6);
});

test("hero separates text from photos and floating WhatsApp opens a simulated conversation", async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${path}/?skip=opening`);
    const title = await page.locator("#hero-title").boundingBox();
    const photo = await page.locator(".hero-art").boundingBox();
    expect(title && photo).toBeTruthy();
    if (width > 700) expect(title!.x + title!.width).toBeLessThanOrEqual(photo!.x);
    else expect(title!.y + title!.height).toBeLessThan(photo!.y);
    const badge = await page.locator(".card-photo").first().evaluate((element) => getComputedStyle(element, "::after").content);
    expect(badge).not.toContain("Imagem ilustrativa");
    await page.getByRole("button", { name: "Pesquisa completa", exact: true }).click(); await page.locator(".more-search-filters summary").click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByLabel("Cidade", { exact: true })).toBeVisible();
    await page.getByRole("dialog", { name: "Filtros de imóveis" }).getByRole("button", { name: "Fechar", exact: true }).click();
  }
  const requests: string[] = [];
  page.on("request", (request) => { if (!["GET", "HEAD"].includes(request.method())) requests.push(request.url()); });
  await page.getByRole("button", { name: "Conversar pelo WhatsApp, atendimento demonstrativo", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Prévia do WhatsApp" })).toBeVisible();
  await expect(page.getByRole("dialog").getByText(/Não há envio ao WhatsApp/)).toBeVisible();
  expect(requests).toEqual([]);
  await page.getByRole("button", { name: "Fechar", exact: true }).click();
  await expect(page.getByRole("button", { name: "Conversar pelo WhatsApp, atendimento demonstrativo", exact: true })).toBeFocused();
});
test("brief decorative entrance clears and mobile hero search works", async ({ page, browser }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${path}/`);
  await expect(page.locator(".brand-intro")).toHaveCSS("pointer-events", "none");
  await expect(page.locator(".brand-intro")).not.toBeVisible({ timeout: 4000 });
  await expect(page.locator(".filters-primary")).toHaveCount(0);
  await page.getByLabel("Localização da busca", { exact: true }).fill("Aquarius");
  await page.getByRole("group", { name: "Finalidade da busca" }).getByRole("button", { name: "Alugar" }).click();
  await page.getByRole("button", { name: "Encontrar imóvel" }).click();
  await expect(page.locator(".property-card")).toHaveCount(1);
  await expect(page.locator(".property-card h3")).toHaveText("Apartamento no Casablanca");
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const plain = await noJs.newPage();
  await plain.goto(`${process.env.DEMO_TEST_URL ?? "http://127.0.0.1:5175"}${path}/`);
  await expect(plain.locator(".brand-intro")).not.toBeVisible();
  await expect(plain.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(plain.locator(".property-card")).toHaveCount(6);
  await noJs.close();
});
