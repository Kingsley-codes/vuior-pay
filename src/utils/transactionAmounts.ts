type PaymentRecord = {
  category?: unknown;
  type?: unknown;
  paymentMethod?: unknown;
  stripePaymentIntentId?: unknown;
  amount?: unknown;
  amountCharged?: unknown;
  credits?: unknown;
  totalAmount?: unknown;
  amountPaid?: unknown;
  creditsApplied?: unknown;
  creditApplied?: unknown;
  discountApplied?: unknown;
};

const normalize = (value: unknown) =>
  String(value || "").toLowerCase().replace(/[\s_-]/g, "");

// Read-only display values: keep the persisted Stripe charge intact for refunds.
export function transactionAmounts(data: PaymentRecord) {
  const category = normalize(data.category);
  const billPayment = category === "billtransactions" ||
    (category !== "credittransactions" && /bill.*pay|autopay/.test(normalize(data.type)));
  const stripe = Boolean(data.stripePaymentIntentId) ||
    ["stripe", "card", "creditcard", "debitcard"].includes(normalize(data.paymentMethod));
  const creditsApplied = Number(data.creditsApplied ?? data.creditApplied ?? data.discountApplied ?? 0);
  const amount = Number(data.amount ?? data.credits ?? data.totalAmount ?? data.amountPaid ?? 0);
  if (!billPayment || !stripe || !Number.isFinite(creditsApplied) || creditsApplied <= 0) {
    return { amount, amountCharged: undefined };
  }
  const amountCharged = Number(data.amountCharged ?? data.amount ?? data.amountPaid ?? 0);
  return {
    amount: (Math.round(amountCharged * 100) + Math.round(creditsApplied * 100)) / 100,
    amountCharged,
  };
}
