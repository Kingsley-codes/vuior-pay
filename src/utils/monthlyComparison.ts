export function isInMonth(value: Date, month: Date): boolean {
  return (
    value.getFullYear() === month.getFullYear() &&
    value.getMonth() === month.getMonth()
  );
}

export function monthlyComparison(current: number, previous: number): string {
  if (current === previous) return "No change vs last month";
  if (previous === 0) return `+${current.toLocaleString()} vs last month (0)`;

  const percent = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format((Math.abs(current - previous) / previous) * 100);
  return `${percent}% ${current > previous ? "more" : "fewer"} vs last month`;
}
