import { useNavigate } from "react-router-dom";
import type { Coin } from "../types";

type CoinCardProps = {
  coin: Coin;
};

function CoinCard({ coin }: CoinCardProps) {
  const navigate = useNavigate();
  const change = coin.price_change_percentage_24h ?? 0;
  const isPositive = change >= 0;

  return (
    <div
      onClick={() => navigate(`/coin/${coin.id}`)}
      className="group relative bg-[#0b1628] border border-[#1a2840] rounded-xl p-4 flex items-center gap-4 hover:border-[#2a3f5f] hover:bg-[#0d1e38] transition-all duration-200 cursor-pointer overflow-hidden"
    >
      <div
        className={`absolute inset-y-0 left-0 w-[3px] transition-opacity duration-200 group-hover:opacity-100 opacity-60 ${isPositive ? "bg-emerald-500" : "bg-red-500"}`}
      />

      <span className="text-slate-600 text-xs w-6 text-center shrink-0">
        {coin.market_cap_rank}
      </span>

      <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">{coin.name}</p>
        <p className="text-slate-500 text-xs uppercase tracking-wide">{coin.symbol}</p>
      </div>

      <div className="hidden md:block text-right shrink-0">
        <p className="text-slate-500 text-xs mb-0.5">Market Cap</p>
        <p className="text-slate-400 text-xs font-medium">
          ${(coin.market_cap / 1e9).toFixed(2)}B
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-white font-semibold text-sm">
          ${coin.current_price.toLocaleString()}
        </p>
        <span
          className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-md mt-0.5 ${
            isPositive
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {isPositive ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

export default CoinCard;
