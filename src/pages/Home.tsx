import { useState, useEffect, useMemo } from "react";
import type { Coin } from "../types";
import CoinCard from "../components/CoinCard";
import SearchBar from "../components/SearchBar";
import Portfolio from "../components/Portfolio";
import { useFavorites } from "../useFavorites";
import { usePortfolio } from "../usePortfolio";

const SORT_OPTIONS = [
  { label: "Market Cap", value: "market_cap" },
  { label: "Price (low)", value: "price_asc" },
  { label: "Price (high)", value: "price_desc" },
  { label: "Volume (low)", value: "volume_asc" },
  { label: "Volume (high)", value: "volume_desc" },
];

function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("market_cap");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { favorites } = useFavorites();
  const { portfolio, removeFromPortfolio } = usePortfolio();

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1",
          { headers: API_KEY ? { "x-cg-demo-api-key": API_KEY } : {} },
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCoins(data);
      } catch {
        setError("Failed to load coins. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  const prices = useMemo(() => {
    const map: Record<string, number> = {};
    coins.forEach((c) => {
      map[c.id] = c.current_price;
    });
    return map;
  }, [coins]);

  const favoriteCoins = useMemo(
    () => coins.filter((c) => favorites.includes(c.id)),
    [coins, favorites],
  );

  const filteredCoins = useMemo(
    () =>
      coins
        .filter(
          (coin) =>
            !favorites.includes(coin.id) &&
            (coin.name.toLowerCase().includes(search.toLowerCase()) ||
              coin.symbol.toLowerCase().includes(search.toLowerCase())),
        )
        .sort((a, b) => {
          if (sortBy === "price_asc") return a.current_price - b.current_price;
          if (sortBy === "price_desc") return b.current_price - a.current_price;
          if (sortBy === "volume_desc") return b.total_volume - a.total_volume;
          if (sortBy === "volume_asc") return a.total_volume - b.total_volume;
          return b.market_cap - a.market_cap;
        }),
    [coins, favorites, search, sortBy],
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Crypto Tracker
          </span>
        </h1>
        <p className="text-slate-500 text-sm">
          Top 50 cryptocurrencies by market cap
        </p>
      </div>

      <Portfolio
        portfolio={portfolio}
        prices={prices}
        onRemove={removeFromPortfolio}
      />

      <div className={`flex flex-col sm:flex-row sm:items-center gap-4 ${portfolio.length > 0 ? "mt-8" : ""} mb-5`}>
        <SearchBar value={search} onChange={setSearch} />
        <div className="flex gap-1.5 flex-wrap">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                sortBy === option.value
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                  : "bg-[#0b1628] text-slate-400 hover:text-white border border-[#1a2840] hover:border-[#2a3f5f]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {favoriteCoins.length > 0 && (
        <div className="mb-5">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="text-yellow-500/80">★</span> Favorites
          </p>
          <div className="flex flex-col gap-2">
            {favoriteCoins.map((coin) => (
              <CoinCard key={coin.id} coin={coin} />
            ))}
          </div>
        </div>
      )}

      {favoriteCoins.length > 0 && filteredCoins.length > 0 && (
        <div className="border-t border-[#1a2840] mb-5" />
      )}

      {loading && (
        <div className="flex justify-center mt-24">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center gap-3 mt-16 text-center">
          <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
            </svg>
          </div>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="flex flex-col gap-2">
            {filteredCoins.map((coin) => (
              <CoinCard key={coin.id} coin={coin} />
            ))}
          </div>
          {filteredCoins.length === 0 && search && (
            <div className="text-center py-16">
              <p className="text-slate-500 text-sm">No coins found for &ldquo;{search}&rdquo;</p>
            </div>
          )}
          {filteredCoins.length > 0 && (
            <p className="text-slate-700 text-xs text-center mt-6">
              Showing {filteredCoins.length} coin{filteredCoins.length !== 1 ? "s" : ""}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
