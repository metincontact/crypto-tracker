import { fetchCoins, fetchCoin, fetchChart } from "../api";

function mockFetch(data: unknown, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(data) }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

test("fetchCoins returns parsed JSON on success", async () => {
  const coins = [{ id: "bitcoin", name: "Bitcoin" }];
  mockFetch(coins);
  await expect(fetchCoins()).resolves.toEqual(coins);
});

test("fetchCoins throws on non-ok response", async () => {
  mockFetch({}, false);
  await expect(fetchCoins()).rejects.toThrow("Failed to fetch");
});

test("fetchCoins passes page number in URL", async () => {
  const fetchSpy = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
  vi.stubGlobal("fetch", fetchSpy);
  await fetchCoins(3);
  expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining("page=3"), expect.anything());
});

test("fetchCoin returns coin detail on success", async () => {
  const detail = { id: "bitcoin", name: "Bitcoin" };
  mockFetch(detail);
  await expect(fetchCoin("bitcoin")).resolves.toEqual(detail);
});

test("fetchCoin throws on non-ok response", async () => {
  mockFetch({}, false);
  await expect(fetchCoin("bitcoin")).rejects.toThrow("Coin not found");
});

test("fetchCoin passes AbortSignal to fetch", async () => {
  const fetchSpy = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
  vi.stubGlobal("fetch", fetchSpy);
  const controller = new AbortController();
  await fetchCoin("bitcoin", controller.signal);
  expect(fetchSpy).toHaveBeenCalledWith(
    expect.stringContaining("bitcoin"),
    expect.objectContaining({ signal: controller.signal }),
  );
});

test("fetchChart returns chart data on success", async () => {
  const chart = { prices: [[1234567890, 50000]] };
  mockFetch(chart);
  await expect(fetchChart("bitcoin", 7)).resolves.toEqual(chart);
});

test("fetchChart throws on non-ok response", async () => {
  mockFetch({}, false);
  await expect(fetchChart("bitcoin", 7)).rejects.toThrow("Failed to load chart data");
});

test("fetchChart passes days param in URL", async () => {
  const fetchSpy = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ prices: [] }) });
  vi.stubGlobal("fetch", fetchSpy);
  await fetchChart("bitcoin", 30);
  expect(fetchSpy).toHaveBeenCalledWith(
    expect.stringContaining("days=30"),
    expect.anything(),
  );
});
