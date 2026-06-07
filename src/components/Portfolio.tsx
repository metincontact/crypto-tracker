import type { PortfolioItem } from "../types";

type PortfolioProps = {
  portfolio: PortfolioItem[];
  prices: Record<string, number>;
  onRemove: (id: string) => void;
};

export default function Portfolio({ portfolio, prices, onRemove }: PortfolioProps) {
  if (portfolio.length === 0) return null;

  const totalValue = portfolio.reduce(
    (sum, item) => sum + (prices[item.id] ?? 0) * item.amount,
    0,
  );

  return (
    <div className="bg-[#0b1628] border border-[#1a2840] rounded-2xl p-5 overflow-hidden">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-white font-bold text-base">My Portfolio</h2>
          <p className="text-slate-500 text-xs mt-0.5">{portfolio.length} asset{portfolio.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-500 text-xs mb-0.5">Total value</p>
          <p className="text-emerald-400 font-bold text-xl">
            ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {portfolio.map((item) => {
          const value = (prices[item.id] ?? 0) * item.amount;
          const pct = totalValue > 0 ? (value / totalValue) * 100 : 0;

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-[#0d1e38] rounded-xl p-3"
            >
              <img src={item.image} alt={item.name} className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                  <p className="text-white text-sm font-semibold ml-2 shrink-0">
                    ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-slate-500 text-xs shrink-0 w-10 text-right">
                    {pct.toFixed(1)}%
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-0.5">
                  {item.amount} {item.symbol.toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="text-slate-600 hover:text-red-400 transition-colors ml-1 shrink-0 p-1 rounded-lg hover:bg-red-500/10"
                aria-label={`Remove ${item.name} from portfolio`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
