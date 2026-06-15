import { renderHook, waitFor, act } from "@testing-library/react";
import { useCoins } from "../hooks/useCoins";
import * as api from "../api";

vi.mock("../api");

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

test("returns coins on successful fetch", async () => {
  const coins = [{ id: "bitcoin", name: "Bitcoin" }] as any;
  vi.mocked(api.fetchCoins).mockResolvedValue(coins);
  const { result } = renderHook(() => useCoins());
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.coins).toEqual(coins);
  expect(result.current.error).toBe("");
});

test("starts in loading state", () => {
  vi.mocked(api.fetchCoins).mockResolvedValue([]);
  const { result } = renderHook(() => useCoins());
  expect(result.current.loading).toBe(true);
});

test("sets error when response fails", async () => {
  vi.mocked(api.fetchCoins).mockRejectedValue(new Error("Network error"));
  const { result } = renderHook(() => useCoins());
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.error).toBe("Failed to load coins. Please try again.");
  expect(result.current.coins).toEqual([]);
});

test("retry clears error and re-fetches", async () => {
  vi.mocked(api.fetchCoins)
    .mockRejectedValueOnce(new Error("fail"))
    .mockResolvedValueOnce([{ id: "bitcoin" }] as any);
  const { result } = renderHook(() => useCoins());
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.error).not.toBe("");
  act(() => { result.current.retry(); });
  await waitFor(() => expect(result.current.coins).toHaveLength(1));
  expect(result.current.error).toBe("");
});

test("loadMore appends coins from next page", async () => {
  const page1 = Array.from({ length: 50 }, (_, i) => ({ id: `coin-${i}` })) as any;
  const page2 = [{ id: "ethereum" }] as any;
  vi.mocked(api.fetchCoins).mockResolvedValueOnce(page1).mockResolvedValueOnce(page2);
  const { result } = renderHook(() => useCoins());
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.hasMore).toBe(true);
  act(() => { result.current.loadMore(); });
  await waitFor(() => expect(result.current.loadingMore).toBe(false));
  expect(result.current.coins).toHaveLength(51);
  expect(result.current.coins[50].id).toBe("ethereum");
});

test("hasMore is false when page returns fewer than 50 coins", async () => {
  vi.mocked(api.fetchCoins).mockResolvedValue(new Array(30).fill({ id: "x" }) as any);
  const { result } = renderHook(() => useCoins());
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.hasMore).toBe(false);
});

test("re-fetches after 60 seconds", async () => {
  vi.useFakeTimers();
  vi.mocked(api.fetchCoins).mockResolvedValue([]);
  renderHook(() => useCoins());
  await vi.advanceTimersByTimeAsync(100);
  expect(api.fetchCoins).toHaveBeenCalledTimes(1);
  await vi.advanceTimersByTimeAsync(60_000);
  expect(api.fetchCoins).toHaveBeenCalledTimes(2);
});
