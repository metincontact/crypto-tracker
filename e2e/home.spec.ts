import { test, expect } from "@playwright/test";

const mockCoins = [
  { id: "bitcoin", name: "Bitcoin", symbol: "btc", image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png", current_price: 50000, price_change_percentage_24h: 2.5, market_cap: 1e12, market_cap_rank: 1, total_volume: 3e10 },
  { id: "ethereum", name: "Ethereum", symbol: "eth", image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png", current_price: 3000, price_change_percentage_24h: -1.5, market_cap: 5e11, market_cap_rank: 2, total_volume: 2e10 },
];

test.beforeEach(async ({ page }) => {
  await page.route("**/api.coingecko.com/**markets**", (route) => {
    route.fulfill({ json: mockCoins });
  });
});

test("shows page heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Crypto Tracker")).toBeVisible();
});

test("displays coin list after load", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Bitcoin")).toBeVisible();
  await expect(page.getByText("Ethereum")).toBeVisible();
});

test("search filters coin list", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Bitcoin")).toBeVisible();
  await page.getByPlaceholder("Search coins...").fill("bit");
  await expect(page.getByText("Bitcoin")).toBeVisible();
  await expect(page.getByText("Ethereum")).not.toBeVisible();
});

test("shows empty state when search has no match", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Bitcoin")).toBeVisible();
  await page.getByPlaceholder("Search coins...").fill("xyz123");
  await expect(page.getByText(/no coins found/i)).toBeVisible();
});

test("navigates to coin detail on card click", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Bitcoin")).toBeVisible();
  await page.getByRole("link", { name: /bitcoin/i }).first().click();
  await expect(page).toHaveURL(/\/coin\/bitcoin/);
});

test("shows 404 for unknown route", async ({ page }) => {
  await page.goto("/unknown-page");
  await expect(page.getByText("404")).toBeVisible();
});
