type PaymentRecord = {
  category?: unknown;
  type?: unknown;
  status?: unknown;
  subtotal?: unknown;
  totalAmount?: unknown;
  amount?: unknown;
  credits?: unknown;
  creditsApplied?: unknown;
  creditApplied?: unknown;
  paymentMethod?: unknown;
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
    const purchased = type === "creditspurchased";
    if (!purchased && category === "credittransactions") continue;
    if (!purchased && category !== "billtransactions" && !["billpayment", "billspayment", "autopay"].includes(type)) continue;
    if (!["completed", "success", "succeeded", "paid"].includes(normalize(payment.status))) continue;
    const value = payment.date ?? payment.createdAt ?? payment.paidAt;
    const date = value && typeof value === "object" && "toDate" in value
      ? (value as { toDate: () => Date }).toDate()
      : new Date((value ?? NaN) as string | number);
    if (date.getUTCFullYear() !== year) continue;
    if (!purchased && ["credits", "credit", "vuiorcredits"].includes(normalize(payment.paymentMethod))) continue;
    const amount = Number(purchased
      ? payment.amount ?? payment.credits ?? 0
      : payment.subtotal ?? payment.totalAmount ?? payment.amount ?? 0);
    const credits = purchased ? 0 : Number(payment.creditsApplied ?? payment.creditApplied ?? 0);
    if (!Number.isFinite(amount) || !Number.isFinite(credits) || credits < 0) continue;
    // Count purchases once; spending wallet credits never qualifies again.
    const qualifying = purchased ? Math.max(0, amount) : Math.max(0,
      Math.abs(amount) - (payment.subtotal != null || payment.totalAmount != null ? credits : 0));
    cents += Math.round(qualifying * 100);
  }
  return cents / 100;
}
