type CreditBill = {
  status?: unknown;
  amount?: unknown;
  dueDate?: unknown;
  due_date?: unknown;
  earlyPaymentReward?: unknown;
};
export function billCreditInfo(bill: CreditBill, now = new Date()) {
  const status = String(bill.status || "active").trim().toLowerCase();
  const reward = bill.earlyPaymentReward as { credits?: unknown; status?: unknown } | null | undefined;
  const saved = Number(reward?.credits || 0);
  const recorded = Number.isFinite(saved) ? Math.max(0, saved) : 0;
  if (["paid", "completed", "in review"].includes(status)) {
    const pending = reward?.status === "pending";
    return {
      amount: reward?.status === "granted" || pending ? recorded : 0,
      label: pending || status === "in review" ? "Credits after approval" : "Credits earned",
      description: pending ? "These credits will be added after the bill is marked as paid."
        : reward?.status === "granted" ? "These credits have been added to your balance."
        : "No early-payment credits are recorded for this bill.",
    };
  }
  const due = new Date(String(bill.dueDate || bill.due_date || ""));
  const days = Math.max(0, Math.ceil((due.getTime() - now.getTime()) / 86400000));
  const percentage = days >= 15 ? 15 : days >= 8 ? 10 : days >= 4 ? 5 : days >= 1 ? 2 : 0;
  const amount = Number(bill.amount || 0);
  return {
    amount: Number.isFinite(amount) ? Number((Math.max(0, amount) * percentage / 100).toFixed(2)) : 0,
    label: "Estimated credits if paid now",
    description: "Eligible early-payment credits are confirmed at payment and added after approval.",
  };
}
