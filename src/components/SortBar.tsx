const SORT_OPTIONS = [
  { label: "Market Cap", value: "market_cap" },
  { label: "Price (low)", value: "price_asc" },
  { label: "Price (high)", value: "price_desc" },
  { label: "Volume (low)", value: "volume_asc" },
  { label: "Volume (high)", value: "volume_desc" },
];

type SortBarProps = {
  sortBy: string;
  onChange: (value: string) => void;
};

export default function SortBar({ sortBy, onChange }: SortBarProps) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {SORT_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
            sortBy === option.value
              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
              : "bg-[#0b1628] text-slate-400 hover:text-white border border-[#1a2840] hover:border-[#2a3f5f]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
