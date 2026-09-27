import type { Bill, Transaction } from "../hooks/useVuiorData";

export const billCategories = [
  "Utilities",
  "Transportation",
  "Internet & Phone",
  "Loans",
  "Education",
  "Subscriptions",
  "Insurance",
  "Business",
  "Housing",
  "Credit Card",
  "Healthcare",
  "Custom",
];
export const creditCategories = [
  "Credits Earned",
  "Credits Sent",
  "Credits Received",
  "Credits Purchased",
  "Credits Added",
  "Referral Credits Received",
  "Promo Credits Received",
];
export const periods = [
  "This month",
  "Last month",
  "Today",
  "This week",
  "Last week",
  "Custom",
] as const;
export type Period = (typeof periods)[number];
export const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replaceAll("_", " ")
    .replaceAll("recieved", "received");
export const displayName = (value: string) =>
  normalize(value).replace(/\b\w/g, (letter) => letter.toUpperCase());

export function transactionStatus(status: string): string {
  const value = normalize(status);
  if (["completed", "success", "succeeded", "paid", "redeemed"].includes(value))
    return "Completed";
  if (["pending", "processing"].includes(value)) return "Pending";
  if (["failed", "declined"].includes(value)) return "Failed";
  return "Pending";
}

export function transactionPaymentMethod(item: Transaction): string {
  const method = normalize(item.paymentMethod || "");
  if (["stripe", "card", "credit card", "debit card"].includes(method))
    return "stripe";
  if (["credit", "credits", "vuior credits"].includes(method)) return "credits";
  return method;
}

export function transactionKind(item: Transaction): "credit" | "bill" {
  // Rewards also carry bill IDs, and bill payments may debit credits.
  const category = normalize(item.category);
  if (category === "credit transactions") return "credit";
  if (category === "bill transactions") return "bill";
  return /credit|referral|reward|promo|wallet|top up/.test(
    normalize(item.type),
  ) && !/bill.*pay/.test(normalize(item.type))
    ? "credit"
    : "bill";
}

export function categoriesForTransaction(
  item: Transaction,
  bills: Bill[],
): string[] {
  if (transactionKind(item) === "credit") return [displayName(item.type)];
  const linked = bills.filter(
    (bill) =>
      item.billIds.includes(bill.id) ||
      item.billPublicIds.includes(bill.billId),
  );
  const categories = linked.map((bill) => bill.category);
  if (!["bill transactions", "payment", ""].includes(normalize(item.category)))
    categories.push(item.category);
  return [...new Set(categories.length ? categories : ["Uncategorized"])];
}

export function periodBounds(
  period: Period,
  from = "",
  to = "",
  now = new Date(),
): [Date, Date] | null {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  if (period === "Custom") {
    if (!from || !to) return null;
    const first = new Date(`${from}T00:00:00`);
    const last = new Date(`${to}T00:00:00`);
    if (Number.isNaN(+first) || Number.isNaN(+last) || first > last)
      return null;
    last.setDate(last.getDate() + 1);
    return [first, last];
  }
  if (period === "Today") end.setDate(end.getDate() + 1);
  else if (period === "This month" || period === "Last month") {
    start.setDate(1);
    if (period === "Last month") start.setMonth(start.getMonth() - 1);
    end.setFullYear(start.getFullYear(), start.getMonth() + 1, 1);
  } else {
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    if (period === "Last week") start.setDate(start.getDate() - 7);
    end.setTime(+start);
    end.setDate(end.getDate() + 7);
  }
  return [start, end];
}

export type TransactionFilters = {
  type: string;
  category: string;
  status: string;
  search: string;
  period: Period;
  from: string;
  to: string;
  paymentMethod?: string;
};
export function filterTransactions(
  transactions: Transaction[],
  bills: Bill[],
  filters: TransactionFilters,
  now = new Date(),
) {
  const bounds = periodBounds(filters.period, filters.from, filters.to, now);
  if (!bounds) return [];
  const query = filters.search.trim().toLowerCase();
  return transactions
    .filter((item) => {
      const categories = categoriesForTransaction(item, bills);
      const billNames = query
        ? bills
            .filter(
              (bill) =>
                item.billIds.includes(bill.id) ||
                item.billPublicIds.includes(bill.billId),
            )
            .map((bill) => bill.name)
        : [];
      const categoryMatches =
        filters.category === "All" ||
        categories.some((category) =>
          filters.type === "bill" && filters.category === "Custom"
            ? category !== "Uncategorized" &&
              !billCategories
                .slice(0, -1)
                .some((standard) => normalize(standard) === normalize(category))
            : normalize(category) === normalize(filters.category),
        );
      return (
        (filters.type === "all" || transactionKind(item) === filters.type) &&
        categoryMatches &&
        (filters.type === "credit" ||
          filters.status === "All" ||
          normalize(transactionStatus(item.status)) ===
            normalize(filters.status)) &&
        (filters.type !== "bill" ||
          !filters.paymentMethod ||
          filters.paymentMethod === "All" ||
          transactionPaymentMethod(item) === filters.paymentMethod) &&
        item.date >= bounds[0] &&
        item.date < bounds[1] &&
        (!query ||
          [
            item.label,
            item.transactionId,
            item.paymentId,
            item.reference,
            item.type,
            ...billNames,
            ...categories,
            ...item.billIds,
            ...item.billPublicIds,
          ].some((value) => value?.toLowerCase().includes(query)))
      );
    })
    .sort((a, b) => +b.date - +a.date || a.id.localeCompare(b.id));
}
