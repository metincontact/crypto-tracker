import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CoinCard from "../components/CoinCard";
import type { Coin } from "../types";

const coin: Coin = {
  id: "bitcoin",
  name: "Bitcoin",
  symbol: "btc",
  image: "https://example.com/btc.png",
  current_price: 50000,
  price_change_percentage_24h: 2.5,
  market_cap: 1_000_000_000_000,
  market_cap_rank: 1,
  total_volume: 30_000_000_000,
};

const renderCard = (c = coin) =>
  render(
    <MemoryRouter>
      <CoinCard coin={c} />
    </MemoryRouter>,
  );

test("renders coin name and symbol", () => {
  renderCard();
  expect(screen.getByText("Bitcoin")).toBeInTheDocument();
  expect(screen.getByText("btc")).toBeInTheDocument();
});

test("renders market cap rank", () => {
  renderCard();
  expect(screen.getByText("#1")).toBeInTheDocument();
});

test("renders formatted price", () => {
  renderCard();
  expect(screen.getByText("$50,000")).toBeInTheDocument();
});

test("renders positive change with up arrow and green color", () => {
  renderCard();
  const badge = screen.getByText(/2\.50%/);
  expect(badge.textContent).toContain("▲");
  expect(badge.className).toContain("emerald");
});

test("renders negative change with down arrow and red color", () => {
  renderCard({ ...coin, price_change_percentage_24h: -3.2 });
  const badge = screen.getByText(/3\.20%/);
  expect(badge.textContent).toContain("▼");
  expect(badge.className).toContain("red");
});

test("defaults to 0 change when price_change_percentage_24h is null", () => {
  renderCard({ ...coin, price_change_percentage_24h: null as unknown as number });
  expect(screen.getByText("Bitcoin")).toBeInTheDocument();
  const badge = screen.getByText(/0\.00%/);
  expect(badge.className).toContain("emerald");
});

test("links to coin detail page", () => {
  renderCard();
  expect(screen.getByRole("link")).toHaveAttribute("href", "/coin/bitcoin");
});
