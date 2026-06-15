import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import CoinDetail from "../pages/CoinDetail";
import * as api from "../api";
import type { CoinDetail as CoinDetailType, ChartData } from "../types";

vi.mock("../api");
vi.mock("dompurify", () => ({ default: { sanitize: (html: string) => html } }));
vi.mock("../components/CoinChart", () => ({
  default: () => <div data-testid="coin-chart" />,
}));

const mockCoin: CoinDetailType = {
  id: "bitcoin",
  name: "Bitcoin",
  symbol: "btc",
  image: { large: "https://example.com/btc.png" },
  market_cap_rank: 1,
  description: { en: "Bitcoin is a cryptocurrency." },
  market_data: {
    current_price: { usd: 50000 },
    price_change_percentage_24h: 2.5,
    market_cap: { usd: 1_000_000_000_000 },
    total_supply: 21_000_000,
    max_supply: 21_000_000,
  },
};

const mockChart: ChartData = { prices: [[1_000_000_000, 50000]] };

const renderDetail = () =>
  render(
    <MemoryRouter initialEntries={["/coin/bitcoin"]}>
      <Routes>
        <Route path="/coin/:id" element={<CoinDetail />} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  localStorage.clear();
  vi.mocked(api.fetchCoin).mockResolvedValue(mockCoin);
  vi.mocked(api.fetchChart).mockResolvedValue(mockChart);
});

test("shows loading spinner initially", () => {
  renderDetail();
  expect(document.querySelector(".animate-spin")).toBeInTheDocument();
});

test("renders coin name and price after fetch", async () => {
  renderDetail();
  await waitFor(() => screen.getByText("Bitcoin"));
  expect(screen.getByText("$50,000")).toBeInTheDocument();
});

test("renders coin rank and symbol", async () => {
  renderDetail();
  await waitFor(() => screen.getByText("Bitcoin"));
  expect(screen.getByText("Rank #1")).toBeInTheDocument();
  expect(screen.getByText("btc")).toBeInTheDocument();
});

test("renders chart component", async () => {
  renderDetail();
  await waitFor(() => screen.getByTestId("coin-chart"));
});

test("renders coin description", async () => {
  renderDetail();
  await waitFor(() => screen.getByText(/bitcoin is a cryptocurrency/i));
});

test("shows error and go back button on fetch failure", async () => {
  vi.mocked(api.fetchCoin).mockRejectedValue(new Error("Not found"));
  renderDetail();
  await waitFor(() => screen.getByText(/failed to load/i));
  expect(screen.getByRole("button", { name: /go back/i })).toBeInTheDocument();
});

test("can toggle favorite", async () => {
  renderDetail();
  await waitFor(() => screen.getByText("Bitcoin"));
  const favBtn = screen.getByRole("button", { name: /add to favorites/i });
  fireEvent.click(favBtn);
  expect(screen.getByRole("button", { name: /remove from favorites/i })).toBeInTheDocument();
});

test("shows 24h change correctly", async () => {
  renderDetail();
  await waitFor(() => screen.getByText("+2.50%"));
});
