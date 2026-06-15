import type { Coin, CoinDetail, ChartData } from "./types";

const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
const BASE = "https://api.coingecko.com/api/v3";

function headers(): HeadersInit {
  return API_KEY ? { "x-cg-demo-api-key": API_KEY } : {};
}

export async function fetchCoins(page = 1): Promise<Coin[]> {
  const res = await fetch(
    `${BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}`,
    { headers: headers() },
  );
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export async function fetchCoin(id: string, signal?: AbortSignal): Promise<CoinDetail> {
  const res = await fetch(`${BASE}/coins/${id}`, { headers: headers(), signal });
  if (!res.ok) throw new Error("Coin not found");
  return res.json();
}

export async function fetchChart(id: string, days: number, signal?: AbortSignal): Promise<ChartData> {
  const res = await fetch(
    `${BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
    { headers: headers(), signal },
  );
  if (!res.ok) throw new Error("Failed to load chart data");
  return res.json();
}
