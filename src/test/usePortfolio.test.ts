import { renderHook, act } from "@testing-library/react";
import { usePortfolio } from "../hooks/usePortfolio";
import type { PortfolioItem } from "../types";

const btc: PortfolioItem = {
  id: "bitcoin",
  name: "Bitcoin",
  symbol: "btc",
  amount: 1,
  image: "https://example.com/btc.png",
};

beforeEach(() => {
  localStorage.clear();
});

test("starts empty when localStorage is empty", () => {
  const { result } = renderHook(() => usePortfolio());
  expect(result.current.portfolio).toEqual([]);
});

test("adds a new item to portfolio", () => {
  const { result } = renderHook(() => usePortfolio());
  act(() => result.current.addToPortfolio(btc));
  expect(result.current.portfolio).toHaveLength(1);
  expect(result.current.portfolio[0].id).toBe("bitcoin");
});

test("accumulates amount when adding the same coin twice", () => {
  const { result } = renderHook(() => usePortfolio());
  act(() => result.current.addToPortfolio(btc));
  act(() => result.current.addToPortfolio({ ...btc, amount: 0.5 }));
  expect(result.current.portfolio[0].amount).toBe(1.5);
});

test("removes an item from portfolio", () => {
  const { result } = renderHook(() => usePortfolio());
  act(() => result.current.addToPortfolio(btc));
  act(() => result.current.removeFromPortfolio("bitcoin"));
  expect(result.current.portfolio).toHaveLength(0);
});

test("persists portfolio to localStorage", () => {
  const { result } = renderHook(() => usePortfolio());
  act(() => result.current.addToPortfolio(btc));
  const stored = JSON.parse(localStorage.getItem("portfolio") ?? "[]");
  expect(stored[0].id).toBe("bitcoin");
});

test("returns empty array on corrupted localStorage data", () => {
  localStorage.setItem("portfolio", "invalid-json{{");
  const { result } = renderHook(() => usePortfolio());
  expect(result.current.portfolio).toEqual([]);
});
