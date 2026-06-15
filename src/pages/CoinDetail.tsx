import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import type { CoinDetail, ChartData } from "../types";
import { fetchCoin, fetchChart } from "../api";
import { useFavorites } from "../hooks/useFavorites";
import { usePortfolio } from "../hooks/usePortfolio";
import CoinChart from "../components/CoinChart";
import AddToPortfolio from "../components/AddToPortfolio";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

function CoinDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [chartData, setChartData] = useState<{ date: string; price: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [days, setDays] = useState(7);
  const [chartLoading, setChartLoading] = useState(false);

  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToPortfolio, portfolio } = usePortfolio();

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const [coinData, chart] = await Promise.all([
          fetchCoin(id, controller.signal),
          fetchChart(id, days, controller.signal),
        ]) as [CoinDetail, ChartData];

        const formatted = chart.prices.map(([timestamp, price]) => ({
          date:
            days === 1
              ? new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : new Date(timestamp).toLocaleDateString(),
          price,
        }));

        setCoin(coinData);
        setChartData(formatted);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Failed to load coin data.");
      } finally {
        setLoading(false);
        setChartLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [id, days]);

  if (loading) return <Spinner fullScreen />;
  if (error) return <ErrorMessage message={error} onBack={() => navigate("/")} fullScreen />;
  if (!coin) return null;

  const isPositive = coin.market_data.price_change_percentage_24h >= 0;
  const favorited = isFavorite(coin.id);
  const holding = portfolio.find((p) => p.id === coin.id)?.amount;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-white text-sm mb-8 transition-colors group"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="flex items-center gap-4 mb-8">
        <img src={coin.image.large} alt={coin.name} className="w-14 h-14 rounded-full" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{coin.name}</h1>
            <span className="text-xs font-semibold text-slate-500 uppercase bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md">
              {coin.symbol}
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">Rank #{coin.market_cap_rank}</p>
        </div>
        <button
          onClick={() => toggleFavorite(coin.id)}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-150 ${
            favorited
              ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-400"
              : "bg-[#0b1628] border-[#1a2840] text-slate-600 hover:border-yellow-500/40 hover:text-yellow-400"
          }`}
        >
          {favorited ? "★" : "☆"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#0b1628] border border-[#1a2840] rounded-xl p-4">
          <p className="text-slate-500 text-xs mb-2">Price</p>
          <p className="text-white font-bold text-lg leading-tight">
            ${coin.market_data.current_price.usd.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#0b1628] border border-[#1a2840] rounded-xl p-4">
          <p className="text-slate-500 text-xs mb-2">24h Change</p>
          <p className={`font-bold text-lg leading-tight ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
            {isPositive ? "+" : ""}{coin.market_data.price_change_percentage_24h.toFixed(2)}%
          </p>
        </div>
        <div className="bg-[#0b1628] border border-[#1a2840] rounded-xl p-4">
          <p className="text-slate-500 text-xs mb-2">Market Cap</p>
          <p className="text-white font-bold text-lg leading-tight">
            ${(coin.market_data.market_cap.usd / 1e9).toFixed(2)}B
          </p>
        </div>
      </div>

      <CoinChart
        data={chartData}
        days={days}
        loading={chartLoading}
        onChangeRange={(d) => { setDays(d); setChartLoading(true); }}
      />

      {coin.description.en && (
        <div className="bg-[#0b1628] border border-[#1a2840] rounded-xl p-5 mb-5">
          <h2 className="text-white font-semibold text-sm mb-3">About {coin.name}</h2>
          <p
            className="text-slate-400 text-sm leading-relaxed line-clamp-5"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(coin.description.en) }}
          />
        </div>
      )}

      <AddToPortfolio
        coin={coin}
        holding={holding}
        onAdd={(amount) =>
          addToPortfolio({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            amount,
            image: coin.image.large,
          })
        }
      />
    </div>
  );
}

export default CoinDetailPage;
