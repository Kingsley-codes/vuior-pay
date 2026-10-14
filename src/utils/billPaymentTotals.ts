type PaymentRecord = {
  category?: unknown;
  type?: unknown;
  status?: unknown;
  subtotal?: unknown;
  totalAmount?: unknown;
  amount?: unknown;
  date?: unknown;
  createdAt?: unknown;
  paidAt?: unknown;
};

const normalize = (value: unknown) =>
  String(value || "").trim().toLowerCase().replace(/[\s_-]/g, "");

export function yearlyReferralQualifyingSpend(
  payments: PaymentRecord[],
  year = new Date().getUTCFullYear(),
) {
  let cents = 0;
  for (const payment of payments) {
    const category = normalize(payment.category);
    const type = normalize(payment.type);
    if (type === "creditspurchased" || category === "credittransactions") continue;
    if (category !== "billtransactions" && !["billpayment", "billspayment", "autopay"].includes(type)) continue;
    if (!["completed", "success", "succeeded", "paid"].includes(normalize(payment.status))) continue;
    const value = payment.date ?? payment.createdAt ?? payment.paidAt;
    const date = value && typeof value === "object" && "toDate" in value
      ? (value as { toDate: () => Date }).toDate()
      : new Date((value ?? NaN) as string | number);
    if (date.getUTCFullYear() !== year) continue;
    // Transaction totals reflect the actual payment allocation, including credits
    // applied and excluding fees, rather than the linked bill's face value.
    const amount = Number(payment.subtotal ?? payment.totalAmount ?? payment.amount ?? 0);
    if (Number.isFinite(amount)) cents += Math.round(Math.abs(amount) * 100);
  }
  return cents / 100;
}
