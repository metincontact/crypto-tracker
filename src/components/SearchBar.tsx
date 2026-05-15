type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search coins..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-colors"
    />
  );
}

export default SearchBar;
