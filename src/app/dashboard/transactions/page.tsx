"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  CircleX,
  Clock3,
  CreditCard,
  FileText,
  Search,
  Send,
  SlidersHorizontal,
  WalletCards,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import NotificationsMenu from "@/components/dashboard/NotificationsMenu";
import { TransactionsSkeleton } from "@/components/dashboard/DashboardSkeletons";
import WalletModal, {
  type WalletAction,
} from "@/components/credits/WalletModal";
import CreditGuideModal from "@/components/transactions/CreditGuideModal";
import TransactionDetailsModal from "@/components/transactions/TransactionDetailsModal";
import { useVuiorSession } from "@/hooks/useVuiorSession";
import { type Transaction, useVuiorData } from "@/hooks/useVuiorData";
import {
  billCategories,
  categoriesForTransaction,
  creditCategories,
  displayName,
  filterTransactions,
  normalize,
  periodBounds,
  periods,
  transactionKind,
  transactionPaymentMethod,
  transactionStatus,
  type TransactionFilters,
} from "@/utils/transactions";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const pageSize = 20;
const defaults: TransactionFilters = {
  type: "bill",
  category: "All",
  status: "All",
  paymentMethod: "All",
  search: "",
  period: "This week",
  from: "",
  to: "",
};
const tabs = [
  { value: "bill", label: "Bill transactions", icon: FileText },
  { value: "credit", label: "Credit transactions", icon: ArrowLeftRight },
] as const;

function FilterSelect({
  label,
  value,
  onChange,
  options,
  icon: Icon = SlidersHorizontal,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  icon?: typeof SlidersHorizontal;
}) {
  return (
    <div className="relative min-w-0">
      <Icon
        size={15}
        className="pointer-events-none absolute left-3 top-3.5 text-[#7b879b]"
      />
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-lg border border-[#dfe5e7] bg-white pl-9 pr-9 text-[12px] text-[#344260] outline-none transition hover:border-[#bacbc3] focus:border-[#00a96b] focus:ring-2 focus:ring-[#00a96b]/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-3.5 text-[#7b879b]"
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label = transactionStatus(status);
  const color =
    label === "Completed"
      ? "bg-[#eaf8f1] text-[#008e61]"
      : label === "Failed"
        ? "bg-[#fff0ef] text-[#cc4840]"
        : "bg-[#fff7e5] text-[#a67617]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${color}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

function creditAmount(item: Transaction) {
  const value = item.credits || item.amount;
  const signed = normalize(item.type).includes("sent")
    ? -Math.abs(value)
    : value;
  return `${signed > 0 ? "+" : ""}${signed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function TransactionsPage() {
  const { user } = useVuiorSession();
  const { bills, transactions, loading } = useVuiorData(user?.id);
  const [filters, setFilters] = useState<TransactionFilters>(defaults);
  const [page, setPage] = useState(1);
  const [walletAction, setWalletAction] = useState<WalletAction | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [guide, setGuide] = useState<number | null>(null);
  const isBill = filters.type === "bill";

  useEffect(() => {
    const action = new URLSearchParams(window.location.search).get("wallet");
    if (action === "add" || action === "send") {
      window.history.replaceState({}, "", window.location.pathname);
      const timer = window.setTimeout(() => setWalletAction(action), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  function updateFilters(change: Partial<TransactionFilters>) {
    setFilters((current) => ({ ...current, ...change }));
    setPage(1);
  }
  function selectTab(type: "bill" | "credit") {
    updateFilters({
      type,
      category: "All",
      status: "All",
      paymentMethod: "All",
    });
  }
  const creditTypes = useMemo(
    () => [
      ...new Set([
        ...creditCategories,
        ...transactions
          .filter((item) => transactionKind(item) === "credit")
          .map((item) => displayName(item.type)),
      ]),
    ],
    [transactions],
  );
  const filtered = useMemo(
    () => filterTransactions(transactions, bills, filters),
    [transactions, bills, filters],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const stats = [
    {
      label: "Total transactions",
      value: filtered.length,
      icon: ArrowLeftRight,
      tone: "bg-[#eaf8f2] text-[#00a96b]",
    },
    {
      label: "Completed",
      value: filtered.filter(
        (item) => transactionStatus(item.status) === "Completed",
      ).length,
      icon: CheckCircle2,
      tone: "bg-[#eaf8f2] text-[#00a96b]",
    },
    {
      label: "Pending",
      value: filtered.filter(
        (item) => transactionStatus(item.status) === "Pending",
      ).length,
      icon: Clock3,
      tone: "bg-[#fff7e5] text-[#c49431]",
    },
    {
      label: "Failed",
      value: filtered.filter(
        (item) => transactionStatus(item.status) === "Failed",
      ).length,
      icon: CircleX,
      tone: "bg-[#fff0ef] text-[#d66b61]",
    },
  ];
  const validPeriod = periodBounds(filters.period, filters.from, filters.to);
  const referral =
    transactions
      .filter((item) => normalize(item.type).includes("referral"))
      .reduce((sum, item) => sum + Math.max(0, item.credits), 0) ||
    Number(user?.referralBonus ?? 0);
  const hasFilters =
    filters.search ||
    filters.category !== "All" ||
    filters.status !== "All" ||
    filters.paymentMethod !== "All" ||
    filters.period !== "This week";

  function description(item: Transaction) {
    if (isBill) {
      const linked = bills.filter(
        (bill) =>
          item.billIds.includes(bill.id) ||
          item.billPublicIds.includes(bill.billId),
      );
      if (linked.length) return linked.map((bill) => bill.name).join(", ");
    }
    return displayName(item.label) === "Bill Payment" && !isBill
      ? displayName(item.type)
      : item.label;
  }
  function method(item: Transaction) {
    const value = transactionPaymentMethod(item);
    return value === "stripe"
      ? "Stripe"
      : value === "credits"
        ? "Credits"
        : "Not recorded";
  }

  if (loading)
    return (
      <DashboardShell>
        <TransactionsSkeleton />
      </DashboardShell>
    );
  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1530px] p-5 sm:p-7 lg:p-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[29px] font-bold tracking-[-0.035em]">
              Transactions
            </h1>
            <p className="mt-1.5 text-[13px] text-[#596885]">
              Your payments and credit activity, all in one place.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setWalletAction("send")}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-[#00a96b] bg-white px-4 text-[12px] font-semibold text-[#009b67] transition hover:bg-[#f0faf5] sm:flex-none"
            >
              <Send size={16} />
              Send credits
            </button>
            <button
              onClick={() => setWalletAction("add")}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#00a96b] px-5 text-[12px] font-semibold text-white transition hover:bg-[#008e5a] sm:flex-none"
            >
              <WalletCards size={17} />
              Add funds
            </button>
            <NotificationsMenu userId={user?.id} />
          </div>
        </header>

        <section
          aria-label="Transaction statistics"
          className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4"
        >
          {stats.map(({ label, value, icon: Icon, tone }) => (
            <article
              key={label}
              className="flex min-h-[124px] flex-col justify-center gap-3 rounded-xl border border-[#e2e8e6] bg-white p-4 shadow-[0_7px_24px_rgba(25,55,47,0.04)] sm:flex-row sm:items-center sm:justify-start sm:gap-4 sm:p-5"
            >
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-full sm:h-14 sm:w-14 ${tone}`}
              >
                <Icon size={25} strokeWidth={1.7} />
              </span>
              <div>
                <p className="text-[12px] text-[#53637f]">{label}</p>
                <strong className="mt-1.5 block text-[27px] leading-none tracking-tight">
                  {value.toLocaleString()}
                </strong>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-[#e2e8e6] bg-white shadow-[0_7px_24px_rgba(25,55,47,0.04)]">
          <div
            role="tablist"
            aria-label="Transactions"
            className="flex border-b border-[#e7ecea] px-3 sm:px-5"
          >
            {tabs.map(({ value, label, icon: Icon }, index) => (
              <button
                key={value}
                id={`${value}-tab`}
                role="tab"
                aria-selected={filters.type === value}
                aria-controls="transaction-panel"
                tabIndex={filters.type === value ? 0 : -1}
                onClick={() => selectTab(value)}
                onKeyDown={(event) => {
                  if (
                    ["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                      event.key,
                    )
                  ) {
                    event.preventDefault();
                    const next =
                      event.key === "Home"
                        ? tabs[0]
                        : event.key === "End"
                          ? tabs[1]
                          : tabs[1 - index];
                    selectTab(next.value);
                    document.getElementById(`${next.value}-tab`)?.focus();
                  }
                }}
                className={`flex h-16 items-center justify-center gap-2 border-b-2 px-3 text-[12px] font-semibold transition sm:px-5 sm:text-[13px] ${filters.type === value ? "border-[#00a96b] text-[#009b67]" : "border-transparent text-[#65728a] hover:text-[#344260]"}`}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </div>
          <div
            id="transaction-panel"
            role="tabpanel"
            aria-labelledby={`${filters.type}-tab`}
          >
            <div className="space-y-3 border-b border-[#e7ecea] p-4 sm:p-5">
              <div
                className={`grid gap-3 sm:grid-cols-2 ${isBill ? "xl:grid-cols-[minmax(210px,1.4fr)_minmax(150px,1fr)_minmax(140px,.85fr)_minmax(135px,.8fr)_minmax(135px,.8fr)]" : "xl:grid-cols-[minmax(260px,1fr)_240px_180px]"}`}
              >
                <label className="flex h-11 min-w-0 items-center gap-2 rounded-lg border border-[#dfe5e7] px-3 text-[#75829a] transition focus-within:border-[#00a96b] focus-within:ring-2 focus-within:ring-[#00a96b]/10">
                  <Search size={17} className="shrink-0" />
                  <input
                    aria-label="Search transactions"
                    value={filters.search}
                    onChange={(event) =>
                      updateFilters({ search: event.target.value })
                    }
                    placeholder="Search transactions..."
                    className="min-w-0 flex-1 bg-transparent text-[12px] text-[#344260] outline-none placeholder:text-[#8a95a6]"
                  />
                </label>
                <FilterSelect
                  label={isBill ? "Category" : "Credit type"}
                  value={filters.category}
                  onChange={(category) => updateFilters({ category })}
                  options={[
                    {
                      value: "All",
                      label: isBill ? "All categories" : "All credit types",
                    },
                    ...(isBill
                      ? [...billCategories, "Uncategorized"]
                      : creditTypes
                    ).map((value) => ({ value, label: value })),
                  ]}
                />
                {isBill && (
                  <FilterSelect
                    label="Payment method"
                    value={filters.paymentMethod || "All"}
                    onChange={(paymentMethod) =>
                      updateFilters({ paymentMethod })
                    }
                    icon={CreditCard}
                    options={[
                      { value: "All", label: "All methods" },
                      { value: "stripe", label: "Stripe" },
                      { value: "credits", label: "Credits" },
                    ]}
                  />
                )}
                <FilterSelect
                  label="Period"
                  value={filters.period}
                  onChange={(period) =>
                    updateFilters({
                      period: period as TransactionFilters["period"],
                    })
                  }
                  icon={CalendarDays}
                  options={periods.map((value) => ({ value, label: value }))}
                />
                {isBill && (
                  <FilterSelect
                    label="Status"
                    value={filters.status}
                    onChange={(status) => updateFilters({ status })}
                    icon={CheckCircle2}
                    options={[
                      { value: "All", label: "All statuses" },
                      ...["Completed", "Pending", "Failed"].map((value) => ({
                        value,
                        label: value,
                      })),
                    ]}
                  />
                )}
              </div>
              {filters.period === "Custom" && (
                <div className="flex flex-wrap items-end gap-3 rounded-lg bg-[#f8faf9] p-3">
                  <label className="text-[11px] text-[#596885]">
                    From
                    <input
                      type="date"
                      value={filters.from}
                      max={filters.to || undefined}
                      onChange={(event) =>
                        updateFilters({ from: event.target.value })
                      }
                      className="mt-1 block h-10 rounded-md border border-[#dfe5e7] bg-white px-3 text-[12px]"
                    />
                  </label>
                  <label className="text-[11px] text-[#596885]">
                    To
                    <input
                      type="date"
                      value={filters.to}
                      min={filters.from || undefined}
                      onChange={(event) =>
                        updateFilters({ to: event.target.value })
                      }
                      className="mt-1 block h-10 rounded-md border border-[#dfe5e7] bg-white px-3 text-[12px]"
                    />
                  </label>
                  {!validPeriod && (
                    <p
                      role="status"
                      className="pb-3 text-[11px] text-[#a67617]"
                    >
                      Choose a valid start and end date.
                    </p>
                  )}
                </div>
              )}
              {hasFilters && (
                <div className="flex justify-end">
                  <button
                    onClick={() =>
                      updateFilters({ ...defaults, type: filters.type })
                    }
                    className="text-[11px] font-semibold text-[#009b67] hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[860px] text-left">
                <thead className="border-b border-[#e9eeec] bg-[#f8faf9] text-[11px] text-[#64718a]">
                  <tr>
                    {[
                      "Transaction",
                      isBill ? "Category" : "Credit type",
                      ...(isBill ? ["Payment method"] : []),
                      "Date",
                      isBill ? "Amount" : "Credits",
                      "Status",
                      "",
                    ].map((heading, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={`px-5 py-3.5 font-medium ${heading === "Amount" || heading === "Credits" ? "text-right" : ""}`}
                      >
                        {heading || <span className="sr-only">Details</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e9eeec]">
                  {visible.map((item) => {
                    const outgoing =
                      normalize(item.type).includes("sent") || item.credits < 0;
                    const Icon = isBill
                      ? FileText
                      : outgoing
                        ? ArrowUpRight
                        : ArrowDownLeft;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedTransaction(item)}
                        className="group cursor-pointer text-[12px] transition hover:bg-[#f4faf7] focus-within:bg-[#f4faf7]"
                      >
                        <td className="max-w-[300px] px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eef8f4] text-[#00a96b]">
                              <Icon size={18} />
                            </span>
                            <div className="min-w-0">
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedTransaction(item);
                                }}
                                aria-label={`View transaction ${item.transactionId}`}
                                className="block max-w-full truncate text-left font-semibold text-[#26344c] outline-offset-4"
                              >
                                {description(item)}
                              </button>
                              <p
                                className="mt-1 truncate font-mono text-[10px] text-[#8a95a6]"
                                title={item.transactionId}
                              >
                                {item.transactionId}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="max-w-48 px-5 py-4 leading-5 text-[#64718a]">
                          {categoriesForTransaction(item, bills).join(", ")}
                        </td>
                        {isBill && (
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-2 text-[#53637f]">
                              {method(item) === "Credits" ? (
                                <WalletCards
                                  size={15}
                                  className="text-[#8a95a6]"
                                />
                              ) : (
                                <CreditCard
                                  size={15}
                                  className="text-[#8a95a6]"
                                />
                              )}
                              {method(item)}
                            </span>
                          </td>
                        )}
                        <td className="whitespace-nowrap px-5 py-4 text-[#53637f]">
                          {item.date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          <p className="mt-1 text-[10px] text-[#8a95a6]">
                            {item.date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </td>
                        <td
                          className={`whitespace-nowrap px-5 py-4 text-right text-[13px] font-semibold tabular-nums ${!isBill && !outgoing ? "text-[#009b67]" : "text-[#26344c]"}`}
                        >
                          {isBill
                            ? money.format(item.amount)
                            : creditAmount(item)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="py-4 pr-4 text-[#a3afa9]">
                          <ChevronRight
                            size={16}
                            className="transition group-hover:translate-x-0.5 group-hover:text-[#009b67]"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#e9eeec] lg:hidden">
              {visible.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedTransaction(item)}
                  className="block w-full p-4 text-left transition hover:bg-[#f4faf7]"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eef8f4] text-[#00a96b]">
                      {isBill ? (
                        <FileText size={18} />
                      ) : (
                        <ArrowLeftRight size={18} />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-semibold">
                        {description(item)}
                      </p>
                      <p className="mt-1 truncate text-[10px] text-[#7b879b]">
                        {categoriesForTransaction(item, bills).join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-semibold tabular-nums">
                        {isBill
                          ? money.format(item.amount)
                          : `${creditAmount(item)} credits`}
                      </p>
                      <div className="mt-2">
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between gap-3 rounded-lg bg-[#f8faf9] px-3 py-2.5 text-[10px] text-[#718097]">
                    <span>
                      {item.date.toLocaleDateString("en-US", {
                        dateStyle: "medium",
                      })}
                      {isBill ? ` / ${method(item)}` : ""}
                    </span>
                    <span className="truncate font-mono">
                      {item.transactionId}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {!visible.length && (
              <div className="grid min-h-[300px] place-items-center p-8 text-center">
                <div>
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#f0f6f3] text-[#9ab5a8]">
                    <Search size={24} strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-4 text-[14px] font-semibold">
                    No {isBill ? "bill" : "credit"} transactions found
                  </h3>
                  <p className="mt-2 text-[12px] text-[#7b879b]">
                    Try a different period or adjust your filters.
                  </p>
                </div>
              </div>
            )}
            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e7ecea] px-5 py-4">
              <p aria-live="polite" className="text-[11px] text-[#7b879b]">
                Showing{" "}
                <span className="font-medium text-[#344260]">
                  {filtered.length
                    ? `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filtered.length)}`
                    : "0"}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[#344260]">
                  {filtered.length}
                </span>{" "}
                transactions
              </p>
              <nav
                aria-label="Transaction pagination"
                className="flex items-center gap-2"
              >
                <button
                  aria-label="Previous page"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                  className="grid h-8 w-8 place-items-center rounded-md border border-[#dfe6e4] text-[#64718a] transition hover:bg-[#f0faf5] disabled:opacity-35"
                >
                  <ChevronLeft size={15} />
                </button>
                <span className="px-2 text-[11px] text-[#64718a]">
                  Page <strong className="text-[#344260]">{currentPage}</strong>{" "}
                  of {pageCount}
                </span>
                <button
                  aria-label="Next page"
                  disabled={currentPage === pageCount}
                  onClick={() => setPage(currentPage + 1)}
                  className="grid h-8 w-8 place-items-center rounded-md border border-[#dfe6e4] text-[#64718a] transition hover:bg-[#f0faf5] disabled:opacity-35"
                >
                  <ChevronRight size={15} />
                </button>
              </nav>
            </footer>
          </div>
        </section>

        <section className="mt-5 flex flex-col gap-4 rounded-xl border border-[#bfe9d8] bg-linear-to-r from-[#f3fbf7] to-[#fbfefd] p-5 xl:flex-row xl:items-center">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-[5px] border-[#a9e3cd] bg-white text-[#00a96b]">
            <CircleDollarSign size={23} />
          </span>
          <div className="flex-1">
            <h2 className="text-[14px] font-bold">Make more of your credits</h2>
            <p className="mt-1 text-[11px] text-[#64718a]">
              Earn rewards, invite friends, and put your credits towards your
              next bill.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "How to earn credits",
              "Referral & rewards",
              "Use your credits",
            ].map((label, index) => (
              <button
                key={label}
                onClick={() => setGuide(index)}
                className={`h-10 rounded-md border px-4 text-[11px] font-semibold transition hover:bg-[#eef8f4] ${index === 0 ? "border-[#00a96b] text-[#009b67]" : "border-[#d5e5df] bg-white text-[#274b43]"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      </div>
      {walletAction && user?.id && (
        <WalletModal
          initialAction={walletAction}
          userId={user.id}
          available={Number(user.availableCredits ?? 0)}
          onClose={() => setWalletAction(null)}
        />
      )}
      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          bills={bills}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
      {guide !== null && (
        <CreditGuideModal
          guide={guide}
          referralCode={
            user?.referralCode ||
            `VUIOR-${(user?.firstName || "USER").toUpperCase()}`
          }
          referral={referral}
          onClose={() => setGuide(null)}
        />
      )}
    </DashboardShell>
  );
}
