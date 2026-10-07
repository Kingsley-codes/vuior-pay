export const BILL_FREQUENCIES = ["one-time", "weekly", "biweekly", "monthly", "quarterly", "six months", "yearly"] as const;
export function normalizeBillFrequency(value?: string | null): string {
  const frequency = String(value || "one-time").trim().toLowerCase();
  return frequency === "quaterly" ? "quarterly" : BILL_FREQUENCIES.includes(frequency as typeof BILL_FREQUENCIES[number]) ? frequency : "one-time";
}
export function frequencyLabel(value?: string | null): string {
  const frequency = normalizeBillFrequency(value);
  return frequency.charAt(0).toUpperCase() + frequency.slice(1);
}
export function validAutopayFrequency(autoPay: boolean, frequency: string): boolean {
  return BILL_FREQUENCIES.includes(frequency as typeof BILL_FREQUENCIES[number]) && (!autoPay || frequency !== "one-time");
}
