import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../pages/Home";
import * as api from "../api";
import type { Coin } from "../types";

vi.mock("../api");

beforeEach(() => {
  localStorage.clear();
});

const mockCoins: Coin[] = [
  { id: "bitcoin", name: "Bitcoin", symbol: "btc", image: "", current_price: 50000, price_change_percentage_24h: 2.5, market_cap: 1e12, market_cap_rank: 1, total_volume: 3e10 },
  { id: "ethereum", name: "Ethereum", symbol: "eth", image: "", current_price: 3000, price_change_percentage_24h: -1.5, market_cap: 5e11, market_cap_rank: 2, total_volume: 2e10 },
];

const renderHome = () => render(<MemoryRouter><Home /></MemoryRouter>);

test("shows loading spinner initially", () => {
  vi.mocked(api.fetchCoins).mockResolvedValue(mockCoins);
  renderHome();
  expect(document.querySelector(".animate-spin")).toBeInTheDocument();
});

test("renders coin list after successful fetch", async () => {
  vi.mocked(api.fetchCoins).mockResolvedValue(mockCoins);
  renderHome();
  await waitFor(() => screen.getByText("Bitcoin"));
  expect(screen.getByText("Ethereum")).toBeInTheDocument();
});

test("filters coins by search query", async () => {
  vi.mocked(api.fetchCoins).mockResolvedValue(mockCoins);
  renderHome();
  await waitFor(() => screen.getByText("Bitcoin"));
  fireEvent.change(screen.getByPlaceholderText("Search coins..."), { target: { value: "bit" } });
  expect(screen.getByText("Bitcoin")).toBeInTheDocument();
  expect(screen.queryByText("Ethereum")).not.toBeInTheDocument();
});

test("shows no results message when search has no match", async () => {
  vi.mocked(api.fetchCoins).mockResolvedValue(mockCoins);
  renderHome();
  await waitFor(() => screen.getByText("Bitcoin"));
  fireEvent.change(screen.getByPlaceholderText("Search coins..."), { target: { value: "xyz" } });
  expect(screen.getByText(/no coins found/i)).toBeInTheDocument();
});

test("shows error message on fetch failure", async () => {
  vi.mocked(api.fetchCoins).mockRejectedValue(new Error("Network error"));
  renderHome();
  await waitFor(() => screen.getByText(/failed to load/i));
});

test("shows retry button and retries on click", async () => {
  vi.mocked(api.fetchCoins)
    .mockRejectedValueOnce(new Error("Network error"))
    .mockResolvedValueOnce(mockCoins);
  renderHome();
  await waitFor(() => screen.getByRole("button", { name: /try again/i }));
  fireEvent.click(screen.getByRole("button", { name: /try again/i }));
  await waitFor(() => screen.getByText("Bitcoin"));
});

test("renders page heading", async () => {
  vi.mocked(api.fetchCoins).mockResolvedValue(mockCoins);
  renderHome();
  expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
});
