import { useState, useMemo } from "react";
import type { Coin } from "../types";
import CoinCard from "../components/CoinCard";
import SearchBar from "../components/SearchBar";
import Portfolio from "../components/Portfolio";
import SortBar from "../components/SortBar";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import { useFavorites } from "../hooks/useFavorites";
import { usePortfolio } from "../hooks/usePortfolio";
import { useCoins } from "../hooks/useCoins";

function sortCoins(list: Coin[], sortBy: string): Coin[] {
  return [...list].sort((a, b) => {
    if (sortBy === "price_asc") return a.current_price - b.current_price;
    if (sortBy === "price_desc") return b.current_price - a.current_price;
    if (sortBy === "volume_desc") return b.total_volume - a.total_volume;
    if (sortBy === "volume_asc") return a.total_volume - b.total_volume;
    return b.market_cap - a.market_cap;
  });
}

function matchesSearch(coin: Coin, query: string): boolean {
  const q = query.toLowerCase();
  return coin.name.toLowerCase().includes(q) || coin.symbol.toLowerCase().includes(q);
}

function Home() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("market_cap");

  const { coins, loading, loadingMore, error, retry, loadMore, hasMore } = useCoins();
  const { favorites } = useFavorites();
  const { portfolio, removeFromPortfolio } = usePortfolio();

  const prices = useMemo(() => {
    const map: Record<string, number> = {};
    coins.forEach((c) => { map[c.id] = c.current_price; });
    return map;
  }, [coins]);

  const favoriteCoins = useMemo(
    () => sortCoins(coins.filter((c) => favorites.includes(c.id) && matchesSearch(c, search)), sortBy),
    [coins, favorites, search, sortBy],
  );

  const filteredCoins = useMemo(
    () => sortCoins(coins.filter((c) => !favorites.includes(c.id) && matchesSearch(c, search)), sortBy),
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
          Top {coins.length > 50 ? coins.length : 50} cryptocurrencies by market cap
        </p>
      </div>

      <Portfolio portfolio={portfolio} prices={prices} onRemove={removeFromPortfolio} />

      <div className={`flex flex-col sm:flex-row sm:items-center gap-4 ${portfolio.length > 0 ? "mt-8" : ""} mb-5`}>
        <SearchBar value={search} onChange={setSearch} />
        <SortBar sortBy={sortBy} onChange={setSortBy} />
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

      {loading && <Spinner />}
      {error && <ErrorMessage message={error} onRetry={retry} />}

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
          {hasMore && !search && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 bg-[#0b1628] hover:bg-[#0d1e38] border border-[#1a2840] hover:border-[#2a3f5f] text-slate-400 hover:text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
