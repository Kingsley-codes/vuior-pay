export function isInMonth(value: Date, month: Date): boolean {
  return (
    value.getFullYear() === month.getFullYear() &&
    value.getMonth() === month.getMonth()
  );
}

export function monthlyComparison(current: number, previous: number): string {
  if (current === previous) return "0% vs last month";
  // A percentage change from zero has no defined value.
  if (previous === 0) return "New vs last month (0)";

  const percent = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format((Math.abs(current - previous) / previous) * 100);
  return `${current > previous ? "+" : "−"}${percent}% vs last month`;
}
