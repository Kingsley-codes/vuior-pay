export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export default function PageSizeSelect({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-slate-500">
      <span className="hidden sm:inline">Rows</span>
      <select
        aria-label="Rows per page"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
      >
        {PAGE_SIZE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option} per page
          </option>
        ))}
      </select>
    </label>
  );
}
