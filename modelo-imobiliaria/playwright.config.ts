import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser", fullyParallel: true, workers: 2,
  use: { baseURL: process.env.DEMO_TEST_URL ?? "http://127.0.0.1:5175", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.DEMO_TEST_URL ? undefined : { command: "npm run preview", url: "http://127.0.0.1:5175/demonstracao-imobiliaria/", reuseExistingServer: true },
});
