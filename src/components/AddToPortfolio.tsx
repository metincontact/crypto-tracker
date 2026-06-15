import { useState } from "react";
import type { CoinDetail } from "../types";

type AddToPortfolioProps = {
  coin: CoinDetail;
  holding?: number;
  onAdd: (amount: number) => void;
};

export default function AddToPortfolio({ coin, holding, onAdd }: AddToPortfolioProps) {
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return;
    onAdd(parsed);
    setAmount("");
    setOpen(false);
  };

  return (
    <div className="bg-[#0b1628] border border-[#1a2840] rounded-xl p-5">
      <h2 className="text-white font-semibold text-sm mb-4">Add to Portfolio</h2>
      {open ? (
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-[#0d1e38] border border-[#1a2840] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            Add
          </button>
          <button
            onClick={() => setOpen(false)}
            className="text-slate-400 hover:text-white px-3 py-2.5 text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-[#0d1e38] hover:bg-[#122540] border border-[#1a2840] hover:border-[#2a3f5f] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
        >
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add {coin.name}
        </button>
      )}
      {holding !== undefined && holding > 0 && (
        <p className="text-slate-500 text-xs mt-3">
          Current holding: {holding} {coin.symbol.toUpperCase()}
        </p>
      )}
    </div>
  );
}
