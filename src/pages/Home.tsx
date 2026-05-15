import { useState, useEffect } from "react";
import type { Coin } from "../types";
import CoinCard from "../components/CoinCard";
import SearchBar from "../components/SearchBar";
import { useFavorites } from "../useFavorites";

function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { favorites } = useFavorites();

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&x_cg_demo_api_key=${API_KEY}`,
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

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Crypto Tracker</h1>
        <p className="text-slate-400">Top 50 cryptocurrencies by market cap</p>
      </div>

      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {favorites.length > 0 && (
        <div className="mb-6">
          <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-3">
            ★ Favorites
          </h2>
          <div className="flex flex-col gap-2">
            {coins
              .filter((c) => favorites.includes(c.id))
              .map((coin) => (
                <CoinCard key={coin.id} coin={coin} />
              ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center mt-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && <p className="text-red-400 text-center mt-10">{error}</p>}

      <div className="flex flex-col gap-3">
        {filteredCoins.map((coin) => (
          <CoinCard key={coin.id} coin={coin} />
        ))}
      </div>
    </div>
  );
}

export default Home;
