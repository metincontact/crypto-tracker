import type { PortfolioItem } from "../usePortfolio";

type PortfolioProps = {
  portfolio: PortfolioItem[];
  prices: Record<string, number>;
  onRemove: (id: string) => void;
};

export default function Portfolio({
  portfolio,
  prices,
  onRemove,
}: PortfolioProps) {
  if (portfolio.length === 0) return null;

  const totalValue = portfolio.reduce((sum, item) => {
    return sum + (prices[item.id] ?? 0) * item.amount;
  }, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 mt-10">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white font-bold text-lg">My Portfolio</h2>
          <p className="text-green-400 font-bold text-lg">
            $
            {totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {portfolio.map((item) => {
            const value = (prices[item.id] ?? 0) * item.amount;
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-slate-700/50 rounded-xl p-3"
              >
                <img src={item.image} alt={item.name} className="w-8 h-8" />
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">
                    {item.name}
                  </p>
                  <p className="text-slate-400 text-xs">
                    {item.amount} {item.symbol.toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-semibold">
                    $
                    {value.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-slate-500 hover:text-red-400 transition-colors ml-2"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
