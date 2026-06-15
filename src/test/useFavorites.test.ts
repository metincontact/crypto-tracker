import { renderHook, act } from "@testing-library/react";
import { useFavorites } from "../hooks/useFavorites";

beforeEach(() => {
  localStorage.clear();
});

test("starts empty when localStorage is empty", () => {
  const { result } = renderHook(() => useFavorites());
  expect(result.current.favorites).toEqual([]);
});

test("adds a coin to favorites on toggle", () => {
  const { result } = renderHook(() => useFavorites());
  act(() => result.current.toggleFavorite("bitcoin"));
  expect(result.current.favorites).toContain("bitcoin");
  expect(result.current.isFavorite("bitcoin")).toBe(true);
});

test("removes a coin on second toggle", () => {
  const { result } = renderHook(() => useFavorites());
  act(() => result.current.toggleFavorite("bitcoin"));
  act(() => result.current.toggleFavorite("bitcoin"));
  expect(result.current.favorites).not.toContain("bitcoin");
});

test("persists favorites to localStorage", () => {
  const { result } = renderHook(() => useFavorites());
  act(() => result.current.toggleFavorite("ethereum"));
  const stored = JSON.parse(localStorage.getItem("favorites") ?? "[]");
  expect(stored).toContain("ethereum");
});

test("loads existing favorites from localStorage", () => {
  localStorage.setItem("favorites", JSON.stringify(["bitcoin", "ethereum"]));
  const { result } = renderHook(() => useFavorites());
  expect(result.current.favorites).toEqual(["bitcoin", "ethereum"]);
});

test("returns empty array on corrupted localStorage data", () => {
  localStorage.setItem("favorites", "not-valid-json{{{");
  const { result } = renderHook(() => useFavorites());
  expect(result.current.favorites).toEqual([]);
});
