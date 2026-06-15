import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Spinner from "./Spinner";

const RANGES = [
  { label: "1D", days: 1 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
];

type CoinChartProps = {
  data: { date: string; price: number }[];
  days: number;
  loading: boolean;
  onChangeRange: (days: number) => void;
};

function formatYAxis(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  if (value >= 1) return `$${value.toFixed(2)}`;
  if (value >= 0.01) return `$${value.toFixed(4)}`;
  return `$${value.toFixed(8)}`;
}

export default function CoinChart({ data, days, loading, onChangeRange }: CoinChartProps) {
  return (
    <div className="bg-[#0b1628] border border-[#1a2840] rounded-xl p-5 mb-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-white font-semibold text-sm">Price Chart</h2>
        <div className="flex gap-1">
          {RANGES.map(({ label, days: d }) => (
            <button
              key={d}
              onClick={() => onChangeRange(d)}
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

      {loading ? (
        <div className="flex justify-center items-center h-[260px]">
          <Spinner size="sm" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 5, right: 0, bottom: 0, left: 5 }}>
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
              formatter={(value) => {
                const n = Number(value);
                const formatted =
                  n >= 0.01
                    ? n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })
                    : n.toFixed(8);
                return [`$${formatted}`, "Price"];
              }}
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
  );
}
