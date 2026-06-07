import { render, screen, fireEvent } from "@testing-library/react";
import Portfolio from "../components/Portfolio";
import type { PortfolioItem } from "../types";

const items: PortfolioItem[] = [
  { id: "bitcoin", name: "Bitcoin", symbol: "btc", amount: 2, image: "" },
  { id: "ethereum", name: "Ethereum", symbol: "eth", amount: 10, image: "" },
];

const prices: Record<string, number> = {
  bitcoin: 50000,
  ethereum: 3000,
};

test("renders nothing when portfolio is empty", () => {
  const { container } = render(
    <Portfolio portfolio={[]} prices={{}} onRemove={() => {}} />,
  );
  expect(container.firstChild).toBeNull();
});

test("renders each portfolio item", () => {
  render(<Portfolio portfolio={items} prices={prices} onRemove={() => {}} />);
  expect(screen.getByText("Bitcoin")).toBeInTheDocument();
  expect(screen.getByText("Ethereum")).toBeInTheDocument();
});

test("displays correct total value", () => {
  render(<Portfolio portfolio={items} prices={prices} onRemove={() => {}} />);
  const totalEl = screen.getByText((_, el) => el?.textContent === "$130,000");
  expect(totalEl).toBeInTheDocument();
});

test("calls onRemove with correct id when remove button clicked", () => {
  const onRemove = vi.fn();
  render(<Portfolio portfolio={items} prices={prices} onRemove={onRemove} />);
  const buttons = screen.getAllByRole("button");
  fireEvent.click(buttons[0]);
  expect(onRemove).toHaveBeenCalledWith("bitcoin");
});

test("shows zero value when price is missing", () => {
  render(<Portfolio portfolio={items} prices={{}} onRemove={() => {}} />);
  const zeroEls = screen.getAllByText((_, el) => el?.textContent === "$0");
  expect(zeroEls.length).toBeGreaterThan(0);
});
