import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import DOMPurify from "dompurify";
import type { CoinDetail, ChartData } from "../types";
import { useFavorites } from "../useFavorites";
import { usePortfolio } from "../usePortfolio";

const RANGES = [
  { label: "1D", days: 1 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
];

function formatYAxis(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  if (value >= 1) return `$${value.toFixed(2)}`;
  return `$${value.toFixed(4)}`;
}

function CoinDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [chartData, setChartData] = useState<{ date: string; price: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [days, setDays] = useState(7);
  const [chartLoading, setChartLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [showPortfolioInput, setShowPortfolioInput] = useState(false);

  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToPortfolio } = usePortfolio();

  useEffect(() => {
    if (!id) return;

    const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
    const headers: HeadersInit = API_KEY ? { "x-cg-demo-api-key": API_KEY } : {};

    const fetchData = async () => {
      try {
        const [coinRes, chartRes] = await Promise.all([
          fetch(`https://api.coingecko.com/api/v3/coins/${id}`, { headers }),
          fetch(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
            { headers },
          ),
        ]);

        if (!coinRes.ok) throw new Error("Coin not found");
        if (!chartRes.ok) throw new Error("Failed to load chart data");

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
        setChartLoading(false);
      }
    };

    fetchData();
  }, [id, days]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
          </svg>
        </div>
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          Go back
        </button>
      </div>
    );

  if (!coin) return null;

  const isPositive = coin.market_data.price_change_percentage_24h >= 0;
  const favorited = isFavorite(coin.id);

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

      <div className="bg-[#0b1628] border border-[#1a2840] rounded-xl p-5 mb-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-white font-semibold text-sm">Price Chart</h2>
          <div className="flex gap-1">
            {RANGES.map(({ label, days: d }) => (
              <button
                key={d}
                onClick={() => {
                  setDays(d);
                  setChartLoading(true);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  days === d
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                    : "bg-[#0d1e38] text-slate-400 hover:text-white border border-[#1a2840]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {chartLoading ? (
          <div className="flex justify-center items-center h-[260px]">
            <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 5, right: 0, bottom: 0, left: 5 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2840" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "#475569", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: "#475569", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatYAxis}
                width={60}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0d1e38",
                  border: "1px solid #1a2840",
                  borderRadius: "10px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  padding: "10px 14px",
                }}
                labelStyle={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}
                itemStyle={{ color: "#60a5fa", fontWeight: "600", fontSize: "13px" }}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, "Price"]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#priceGradient)"
                dot={false}
                activeDot={{ r: 4, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {coin.description.en && (
        <div className="bg-[#0b1628] border border-[#1a2840] rounded-xl p-5 mb-5">
          <h2 className="text-white font-semibold text-sm mb-3">About {coin.name}</h2>
          <p
            className="text-slate-400 text-sm leading-relaxed line-clamp-5"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(coin.description.en),
            }}
          />
        </div>
      )}

      <div className="bg-[#0b1628] border border-[#1a2840] rounded-xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4">Add to Portfolio</h2>
        {showPortfolioInput ? (
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-[#0d1e38] border border-[#1a2840] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
            />
            <button
              onClick={() => {
                if (!amount || !coin) return;
                addToPortfolio({
                  id: coin.id,
                  name: coin.name,
                  symbol: coin.symbol,
                  amount: parseFloat(amount),
                  image: coin.image.large,
                });
                setAmount("");
                setShowPortfolioInput(false);
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setShowPortfolioInput(false)}
              className="text-slate-400 hover:text-white px-3 py-2.5 text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowPortfolioInput(true)}
            className="flex items-center gap-2 bg-[#0d1e38] hover:bg-[#122540] border border-[#1a2840] hover:border-[#2a3f5f] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add {coin.name}
          </button>
        )}
      </div>
    </div>
  );
}

export default CoinDetailPage;
