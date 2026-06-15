import { render, screen, fireEvent } from "@testing-library/react";
import AddToPortfolio from "../components/AddToPortfolio";
import type { CoinDetail } from "../types";

const coin: CoinDetail = {
  id: "bitcoin",
  name: "Bitcoin",
  symbol: "btc",
  image: { large: "https://example.com/btc.png" },
  market_cap_rank: 1,
  description: { en: "" },
  market_data: {
    current_price: { usd: 50000 },
    price_change_percentage_24h: 2.5,
    market_cap: { usd: 1_000_000_000_000 },
    total_supply: 21_000_000,
    max_supply: 21_000_000,
  },
};

test("shows Add button by default", () => {
  render(<AddToPortfolio coin={coin} onAdd={() => {}} />);
  expect(screen.getByRole("button", { name: /add bitcoin/i })).toBeInTheDocument();
});

test("opens input form when Add button is clicked", () => {
  render(<AddToPortfolio coin={coin} onAdd={() => {}} />);
  fireEvent.click(screen.getByRole("button", { name: /add bitcoin/i }));
  expect(screen.getByPlaceholderText("Amount")).toBeInTheDocument();
});

test("calls onAdd with correct amount", () => {
  const onAdd = vi.fn();
  render(<AddToPortfolio coin={coin} onAdd={onAdd} />);
  fireEvent.click(screen.getByRole("button", { name: /add bitcoin/i }));
  fireEvent.change(screen.getByPlaceholderText("Amount"), { target: { value: "1.5" } });
  fireEvent.click(screen.getByRole("button", { name: /^add$/i }));
  expect(onAdd).toHaveBeenCalledWith(1.5);
});

test("does not call onAdd with zero amount", () => {
  const onAdd = vi.fn();
  render(<AddToPortfolio coin={coin} onAdd={onAdd} />);
  fireEvent.click(screen.getByRole("button", { name: /add bitcoin/i }));
  fireEvent.change(screen.getByPlaceholderText("Amount"), { target: { value: "0" } });
  fireEvent.click(screen.getByRole("button", { name: /^add$/i }));
  expect(onAdd).not.toHaveBeenCalled();
});

test("does not call onAdd with negative amount", () => {
  const onAdd = vi.fn();
  render(<AddToPortfolio coin={coin} onAdd={onAdd} />);
  fireEvent.click(screen.getByRole("button", { name: /add bitcoin/i }));
  fireEvent.change(screen.getByPlaceholderText("Amount"), { target: { value: "-5" } });
  fireEvent.click(screen.getByRole("button", { name: /^add$/i }));
  expect(onAdd).not.toHaveBeenCalled();
});

test("does not call onAdd with empty input", () => {
  const onAdd = vi.fn();
  render(<AddToPortfolio coin={coin} onAdd={onAdd} />);
  fireEvent.click(screen.getByRole("button", { name: /add bitcoin/i }));
  fireEvent.click(screen.getByRole("button", { name: /^add$/i }));
  expect(onAdd).not.toHaveBeenCalled();
});

test("closes form and resets input after successful add", () => {
  render(<AddToPortfolio coin={coin} onAdd={() => {}} />);
  fireEvent.click(screen.getByRole("button", { name: /add bitcoin/i }));
  fireEvent.change(screen.getByPlaceholderText("Amount"), { target: { value: "1" } });
  fireEvent.click(screen.getByRole("button", { name: /^add$/i }));
  expect(screen.queryByPlaceholderText("Amount")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /add bitcoin/i })).toBeInTheDocument();
});

test("closes form when Cancel is clicked without calling onAdd", () => {
  const onAdd = vi.fn();
  render(<AddToPortfolio coin={coin} onAdd={onAdd} />);
  fireEvent.click(screen.getByRole("button", { name: /add bitcoin/i }));
  fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
  expect(screen.queryByPlaceholderText("Amount")).not.toBeInTheDocument();
  expect(onAdd).not.toHaveBeenCalled();
});

test("shows current holding when provided", () => {
  render(<AddToPortfolio coin={coin} holding={1.5} onAdd={() => {}} />);
  expect(screen.getByText(/current holding: 1\.5 btc/i)).toBeInTheDocument();
});

test("does not show holding section when not provided", () => {
  render(<AddToPortfolio coin={coin} onAdd={() => {}} />);
  expect(screen.queryByText(/current holding/i)).not.toBeInTheDocument();
});
