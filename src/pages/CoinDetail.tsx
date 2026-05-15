import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { CoinDetail, ChartData } from "../types";
import { useFavorites } from "../useFavorites";

function CoinDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [chartData, setChartData] = useState<{ date: string; price: number }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
    const fetchData = async () => {
      try {
        const [coinRes, chartRes] = await Promise.all([
          fetch(
            `https://api.coingecko.com/api/v3/coins/${id}?x_cg_demo_api_key=${API_KEY}`,
          ),
          fetch(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7&x_cg_demo_api_key=${API_KEY}`,
          ),
        ]);

        if (!coinRes.ok) throw new Error("Coin not found");

        const coinData: CoinDetail = await coinRes.json();
        const chart: ChartData = await chartRes.json();

        const formatted = chart.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price: parseFloat(price.toFixed(2)),
        }));

        setCoin(coinData);
        setChartData(formatted);
      } catch {
        setError("Failed to load coin data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="text-blue-400 hover:underline"
        >
          Go back
        </button>
      </div>
    );

  if (!coin) return null;

  const isPositive = coin.market_data.price_change_percentage_24h >= 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate("/")}
        className="text-slate-400 hover:text-white mb-6 inline-block transition-colors"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <img src={coin.image.large} alt={coin.name} className="w-16 h-16" />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">{coin.name}</h1>
          <p className="text-slate-400 uppercase">
            {coin.symbol} · Rank #{coin.market_cap_rank}
          </p>
        </div>
        <button
          onClick={() => toggleFavorite(coin.id)}
          className={`text-2xl transition-colors ${
            isFavorite(coin.id)
              ? "text-yellow-400"
              : "text-slate-600 hover:text-yellow-400"
          }`}
        >
          ★
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Price</p>
          <p className="text-white font-bold text-xl">
            ${coin.market_data.current_price.usd.toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">24h Change</p>
          <p
            className={`font-bold text-xl ${isPositive ? "text-green-400" : "text-red-400"}`}
          >
            {isPositive ? "+" : ""}
            {coin.market_data.price_change_percentage_24h.toFixed(2)}%
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Market Cap</p>
          <p className="text-white font-bold text-xl">
            ${(coin.market_data.market_cap.usd / 1e9).toFixed(2)}B
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
        <h2 className="text-white font-semibold mb-4">7-Day Price Chart</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "none",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#94a3b8" }}
              itemStyle={{ color: "#60a5fa" }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Description */}
      {coin.description.en && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-3">About {coin.name}</h2>
          <p
            className="text-slate-400 text-sm leading-relaxed line-clamp-6"
            dangerouslySetInnerHTML={{ __html: coin.description.en }}
          />
        </div>
      )}
    </div>
  );
}

export default CoinDetailPage;
