import { render, screen, fireEvent } from "@testing-library/react";
import SortBar from "../components/SortBar";

test("renders all sort option buttons", () => {
  render(<SortBar sortBy="market_cap" onChange={() => {}} />);
  expect(screen.getByRole("button", { name: "Market Cap" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Price (low)" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Price (high)" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Volume (low)" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Volume (high)" })).toBeInTheDocument();
});

test("calls onChange with correct value when button is clicked", () => {
  const onChange = vi.fn();
  render(<SortBar sortBy="market_cap" onChange={onChange} />);
  fireEvent.click(screen.getByRole("button", { name: "Price (low)" }));
  expect(onChange).toHaveBeenCalledWith("price_asc");
});

test("calls onChange with correct value for each button", () => {
  const onChange = vi.fn();
  render(<SortBar sortBy="market_cap" onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: "Price (high)" }));
  expect(onChange).toHaveBeenCalledWith("price_desc");

  fireEvent.click(screen.getByRole("button", { name: "Volume (low)" }));
  expect(onChange).toHaveBeenCalledWith("volume_asc");

  fireEvent.click(screen.getByRole("button", { name: "Volume (high)" }));
  expect(onChange).toHaveBeenCalledWith("volume_desc");

  fireEvent.click(screen.getByRole("button", { name: "Market Cap" }));
  expect(onChange).toHaveBeenCalledWith("market_cap");
});

test("active button has blue background", () => {
  render(<SortBar sortBy="price_asc" onChange={() => {}} />);
  const active = screen.getByRole("button", { name: "Price (low)" });
  expect(active.className).toContain("bg-blue-600");
});

test("inactive buttons do not have blue background", () => {
  render(<SortBar sortBy="market_cap" onChange={() => {}} />);
  const inactive = screen.getByRole("button", { name: "Price (low)" });
  expect(inactive.className).not.toContain("bg-blue-600");
});
