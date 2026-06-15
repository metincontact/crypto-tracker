import { test, expect } from "@playwright/test";

const mockCoin = {
  id: "bitcoin",
  name: "Bitcoin",
  symbol: "btc",
  image: { large: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
  market_cap_rank: 1,
  description: { en: "Bitcoin is a decentralized cryptocurrency." },
  market_data: {
    current_price: { usd: 50000 },
    price_change_percentage_24h: 2.5,
    market_cap: { usd: 1_000_000_000_000 },
    total_supply: 21_000_000,
    max_supply: 21_000_000,
  },
};

const mockChart = { prices: [[1_700_000_000_000, 50000], [1_700_003_600_000, 51000]] };

test.beforeEach(async ({ page }) => {
  await page.route("**/api.coingecko.com/**/bitcoin**", (route) => {
    if (route.request().url().includes("market_chart")) {
      route.fulfill({ json: mockChart });
    } else {
      route.fulfill({ json: mockCoin });
    }
  });
});

test("displays coin name and price", async ({ page }) => {
  await page.goto("/coin/bitcoin");
  await expect(page.getByText("Bitcoin")).toBeVisible();
  await expect(page.getByText("$50,000")).toBeVisible();
});

test("displays coin rank", async ({ page }) => {
  await page.goto("/coin/bitcoin");
  await expect(page.getByText("Rank #1")).toBeVisible();
});

test("displays coin description", async ({ page }) => {
  await page.goto("/coin/bitcoin");
  await expect(page.getByText(/bitcoin is a decentralized/i)).toBeVisible();
});

test("can toggle favorite", async ({ page }) => {
  await page.goto("/coin/bitcoin");
  await expect(page.getByLabel("Add to favorites")).toBeVisible();
  await page.getByLabel("Add to favorites").click();
  await expect(page.getByLabel("Remove from favorites")).toBeVisible();
});

test("back button navigates to home", async ({ page }) => {
  await page.goto("/coin/bitcoin");
  await page.getByRole("button", { name: /back/i }).click();
  await expect(page).toHaveURL("/");
});

test("chart range buttons are visible", async ({ page }) => {
  await page.goto("/coin/bitcoin");
  await expect(page.getByRole("button", { name: "1D" })).toBeVisible();
  await expect(page.getByRole("button", { name: "7D" })).toBeVisible();
  await expect(page.getByRole("button", { name: "30D" })).toBeVisible();
});
