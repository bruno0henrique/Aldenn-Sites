const ALLOWED_PROJECT_ID = "prj_71WVeaHZOX71NTKImubStZU34NHv";
const ALLOWED_PROJECT_NAME = "aldenn-sites";

const currentProjectId = process.env.VERCEL_PROJECT_ID?.trim();

if (!currentProjectId) {
  process.exit(0);
}

if (currentProjectId !== ALLOWED_PROJECT_ID) {
  console.error(
    [
      "Publicacao bloqueada: a Belleland nao pode ser implantada neste projeto Vercel.",
      `Projeto recebido: ${currentProjectId}`,
      `Projeto permitido: ${ALLOWED_PROJECT_NAME} (${ALLOWED_PROJECT_ID})`,
      "O dominio aldenn.com.br pertence exclusivamente ao site institucional da Aldenn.",
    ].join("\n"),
  );
  process.exit(1);
}

console.log(`Projeto Vercel confirmado: ${ALLOWED_PROJECT_NAME}.`);
