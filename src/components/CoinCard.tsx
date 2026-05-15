import { useNavigate } from "react-router-dom";
import type { Coin } from "../types";

type CoinCardProps = {
  coin: Coin;
};

function CoinCard({ coin }: CoinCardProps) {
  const navigate = useNavigate();
  const isPositive = (coin.price_change_percentage_24h ?? 0) >= 0;

  return (
    <div
      onClick={() => navigate(`/coin/${coin.id}`)}
      className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4 hover:border-blue-500 transition-colors cursor-pointer"
    >
      <span className="text-slate-500 text-sm w-6">{coin.market_cap_rank}</span>

      <img src={coin.image} alt={coin.name} className="w-8 h-8" />

      <div className="flex-1">
        <p className="text-white font-semibold">{coin.name}</p>
        <p className="text-slate-400 text-sm uppercase">{coin.symbol}</p>
      </div>

      <div className="text-right">
        <p className="text-white font-semibold">
          ${coin.current_price.toLocaleString()}
        </p>
        <p
          className={`text-sm font-medium ${isPositive ? "text-green-400" : "text-red-400"}`}
        >
          {isPositive ? "+" : ""}
          {coin.price_change_percentage_24h?.toFixed(2) ?? "0.00"}%
        </p>
      </div>

      <div className="text-right hidden md:block">
        <p className="text-slate-400 text-xs">Market Cap</p>
        <p className="text-slate-300 text-sm">
          ${(coin.market_cap / 1e9).toFixed(2)}B
        </p>
      </div>
    </div>
  );
}

export default CoinCard;
