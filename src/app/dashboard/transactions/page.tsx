"use client";
import PageSizeSelect from "@/components/ui/PageSizeSelect";
import { monthlyComparison } from "@/utils/monthlyComparison";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleX,
  Clock3,
  FileText,
  Search,
  Send,
  SlidersHorizontal,
  WalletCards,
  MoreVertical,
  Flag,
  UsersRound,
} from "lucide-react";
import NotificationsMenu from "@/components/dashboard/NotificationsMenu";
import CollapsibleGuideSection from "@/components/dashboard/CollapsibleGuideSection";
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
  billsForTransaction,
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
  transactionReportUrl,
  type TransactionFilters,
} from "@/utils/transactions";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const compactMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

const defaults: TransactionFilters = {
  type: "all",
  category: [],
  provider: [],
  status: [],
  search: "",
  period: "This week",
  from: "",
  to: "",
};
const tabs = [
  {
    value: "all",
    label: "All transactions",
    mobileLabel: "All",
    icon: ArrowLeftRight,
  },
  {
    value: "bill",
    label: "Bill transactions",
    mobileLabel: "Bills",
    icon: FileText,
  },
  {
    value: "credit",
    label: "Credit transactions",
    mobileLabel: "Credits",
    icon: ArrowLeftRight,
  },
] as const;

function MultiSelectFilter({
  label,
  value,
  onChange,
  options,
  allLabel,
  searchable = false,
  icon: Icon = SlidersHorizontal,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: { value: string; label: string }[];
  allLabel: string;
  searchable?: boolean;
  icon?: typeof SlidersHorizontal;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: MouseEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const selectedLabel = value.length ? `${value.length} selected` : allLabel;
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div ref={container} className="relative min-w-0">
      <span className="mb-1.5 block text-base font-medium text-[#53637f]">
        {label}
      </span>
      <button
        type="button"
        aria-label={`${label}: ${selectedLabel}`}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-full items-center gap-2 rounded-lg border border-[#dfe5e7] bg-white px-3 text-left text-base text-[#344260] outline-none transition hover:border-[#bacbc3] focus:border-[#00a96b] focus:ring-2 focus:ring-[#00a96b]/10"
      >
        <Icon size={15} className="shrink-0 text-[#7b879b]" />
        <span className="min-w-0 flex-1 truncate">{selectedLabel}</span>
        <ChevronDown size={14} className="shrink-0 text-[#7b879b]" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 max-h-72 w-full min-w-52 overflow-hidden rounded-lg border border-[#dfe5e7] bg-white shadow-lg">
          {searchable && (
            <label className="flex h-10 items-center gap-2 border-b border-[#edf1ef] px-3 text-[#7b879b]">
              <Search size={14} />
              <input
                autoFocus
                aria-label={`Search ${label.toLowerCase()}`}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="min-w-0 flex-1 bg-transparent text-base text-[#344260] outline-none placeholder:text-[#8a95a6]"
              />
            </label>
          )}
          <div className="max-h-56 overflow-y-auto p-1.5">
            <button
              type="button"
              onClick={() => onChange([])}
              className="flex w-full items-center rounded-md px-2.5 py-2 text-left text-base font-medium text-[#009b67] hover:bg-[#f0faf5]"
            >
              Clear selection · {allLabel}
            </button>
            {filteredOptions.map((option) => {
              const checked = value.includes(option.value);
              return (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-base text-[#344260] hover:bg-[#f6f9f7]"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      onChange(
                        checked
                          ? value.filter((item) => item !== option.value)
                          : [...value, option.value],
                      )
                    }
                    className="accent-[#00a96b]"
                  />
                  <span className="truncate">{option.label}</span>
                </label>
              );
            })}
            {!filteredOptions.length && (
              <p className="px-2.5 py-3 text-base text-[#718097]">
                No matching {label.toLowerCase()}.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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
      <span className="mb-1.5 block text-base font-medium text-[#53637f]">
        {label}
      </span>
      <Icon
        size={15}
        className="pointer-events-none absolute left-3 top-[44px] text-[#7b879b]"
      />
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-lg border border-[#dfe5e7] bg-white pl-9 pr-9 text-base text-[#344260] outline-none transition hover:border-[#bacbc3] focus:border-[#00a96b] focus:ring-2 focus:ring-[#00a96b]/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-[44px] text-[#7b879b]"
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
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-base font-medium ${color}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

function creditAmount(item: Transaction) {
  const value = item.amount;
  const signed = normalize(item.type).includes("sent")
    ? -Math.abs(value)
    : value;
  return `${signed > 0 ? "+" : ""}${signed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function TransactionsPage() {
  const { user } = useVuiorSession();
  const { bills, transactions, loading } = useVuiorData(user?.id, {
    includeDeletedBills: true,
  });
  const [filters, setFilters] = useState<TransactionFilters>(defaults);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [walletAction, setWalletAction] = useState<WalletAction | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [actionsFor, setActionsFor] = useState<string | null>(null);
  const [guide, setGuide] = useState<number | null>(null);
  const availableCredits = Number(user?.availableCredits ?? 0);

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
  function selectTab(type: "all" | "bill" | "credit") {
    updateFilters({
      type,
      category: [],
      provider: [],
      status: [],
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
  const providerOptions = useMemo(
    () =>
      [
        ...new Set(
          [
            ...transactions.flatMap((item) => [
              item.provider,
              ...billsForTransaction(item, bills).map((bill) => bill.name),
            ]),
          ].filter((value): value is string => Boolean(value?.trim())),
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [transactions, bills],
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
  // Monthly summaries retain non-date filters; table dates remain independent.
  const now = new Date();
  const thisMonth = filterTransactions(
    transactions,
    bills,
    { ...filters, period: "This month" },
    now,
  );
  const lastMonth = filterTransactions(
    transactions,
    bills,
    { ...filters, period: "Last month" },
    now,
  );
  const stats = [
    {
      label: "Total transactions",
      value: thisMonth.length,
      previous: lastMonth.length,
      icon: ArrowLeftRight,
      tone: "bg-[#eaf8f2] text-[#00a96b]",
    },
    {
      label: "Completed",
      value: thisMonth.filter(
        (item) => transactionStatus(item.status) === "Completed",
      ).length,
      previous: lastMonth.filter(
        (item) => transactionStatus(item.status) === "Completed",
      ).length,
      icon: CheckCircle2,
      tone: "bg-[#eaf8f2] text-[#00a96b]",
    },
    {
      label: "Pending",
      value: thisMonth.filter(
        (item) => transactionStatus(item.status) === "Pending",
      ).length,
      previous: lastMonth.filter(
        (item) => transactionStatus(item.status) === "Pending",
      ).length,
      icon: Clock3,
      tone: "bg-[#fff7e5] text-[#c49431]",
    },
    {
      label: "Failed",
      value: thisMonth.filter(
        (item) => transactionStatus(item.status) === "Failed",
      ).length,
      previous: lastMonth.filter(
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
      .reduce((sum, item) => sum + Math.max(0, item.amount), 0) ||
    Number(user?.referralBonus ?? 0);
  const hasFilters =
    filters.search ||
    filters.category.length > 0 ||
    filters.provider.length > 0 ||
    filters.status.length > 0 ||
    filters.period !== "This week";

  function description(item: Transaction) {
    const billTransaction = transactionKind(item) === "bill";
    if (billTransaction) {
      const linked = billsForTransaction(item, bills);
      if (linked.length) {
        return (
          <span className="block min-w-0">
            <span className="block truncate" title={linked[0].name}>
              {linked[0].name}
            </span>
            {linked.length > 1 && (
              <span className="mt-1 block text-base font-normal text-[#718097]">
                +{linked.length - 1} more
              </span>
            )}
          </span>
        );
      }
    }
    return displayName(item.label) === "Bill Payment" && !billTransaction
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

  if (loading) return <TransactionsSkeleton />;
  const exactBalance = money.format(availableCredits);
  const useCompactBalance = Math.abs(availableCredits) >= 1_000_000;
  return (
    <>
      <div className="mx-auto max-w-[1530px] p-5 sm:p-7 lg:p-8">
        <section aria-labelledby="transactions-page-title" className="min-w-0 rounded-2xl border border-[#164e41] bg-linear-to-br from-[#084b3e] via-[#073e35] to-[#052e2b] text-white shadow-[0_12px_32px_rgba(5,46,38,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6 p-5 sm:p-7">
            <div className="min-w-0 flex-[1_1_240px]">
              <h1 id="transactions-page-title" className="text-[30px] font-bold tracking-[-0.035em] sm:text-[32px]">
                Transactions
              </h1>
              <p className="mt-2 max-w-md text-base leading-6 text-[#bdd9ce]">
                Your payments and credit activity, all in one place.
              </p>
            </div>
            <div
              aria-label="Available credit balance"
              className="flex w-full min-w-0 flex-wrap items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-4 sm:w-auto sm:gap-4 sm:px-5"
            >
              <div className="w-full min-w-0 basis-full border-b border-white/10 pb-4 sm:w-auto sm:basis-auto sm:border-r sm:border-b-0 sm:pr-5 sm:pb-0">
                <div className="flex items-center gap-2 text-[#bdd9ce]">
                  <WalletCards size={18} className="shrink-0" aria-hidden="true" />
                  <p className="whitespace-nowrap text-base">
                    Available credits
                  </p>
                </div>
                <p title={exactBalance} className="mt-2 whitespace-nowrap text-[28px] font-semibold leading-tight tracking-[-0.02em] text-white tabular-nums sm:text-[30px]">
                  {useCompactBalance ? compactMoney.format(availableCredits) : exactBalance}
                </p>
                {useCompactBalance && (
                  <p className="mt-1 text-base leading-6 text-[#bdd9ce] tabular-nums [overflow-wrap:anywhere]">
                    {exactBalance}
                  </p>
                )}
              </div>
              <div className="grid min-w-0 flex-1 grid-cols-2 gap-2 sm:flex sm:flex-none">
                <button
                  type="button"
                  onClick={() => setWalletAction("send")}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 text-base font-semibold text-white transition hover:border-[#b6f4d4]/40 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b6f4d4] sm:px-4"
                >
                  <Send size={15} className="shrink-0" />
                  Send credits
                </button>
                <button
                  type="button"
                  onClick={() => setWalletAction("add")}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#b6f4d4] px-3 text-base font-semibold text-[#083e2f] transition hover:bg-[#d0fbe3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b6f4d4] sm:px-4"
                >
                  <WalletCards size={15} className="shrink-0" />
                  Add funds
                </button>
              </div>
              <NotificationsMenu userId={user?.id} variant="dark" />
            </div>
          </div>
          <CollapsibleGuideSection title="Credits & rewards guides">
            <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] 2xl:items-center">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold">Make more of your credits</h2>
                <p className="mt-2 max-w-lg text-base leading-6 text-[#bdd9ce]">
                  Earn rewards, invite friends, and put your credits towards your next bill.
                </p>
              </div>
              <div className="grid min-w-0 gap-3 lg:grid-cols-3">
                {[
                  { label: "How to earn credits", description: "Discover rewards for paying early.", icon: ArrowUpRight, guide: 0 },
                  { label: "Referral & rewards", description: "Share Vuior with your friends.", icon: UsersRound, guide: 1 },
                  { label: "Use your credits", description: "Put your balance towards a bill.", icon: WalletCards, guide: 2 },
                ].map(({ label, description, icon: Icon, guide }) => (
                  <button
                    key={guide}
                    type="button"
                    onClick={() => setGuide(guide)}
                    className="group flex min-w-0 items-start gap-3 rounded-xl border border-white/15 bg-white/5 p-4 text-left transition hover:border-[#b6f4d4]/40 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b6f4d4]"
                  >
                    <Icon size={20} className="mt-0.5 shrink-0 text-[#b6f4d4]" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-semibold text-white">{label}</span>
                      <span className="mt-1 block text-base leading-6 text-[#bdd9ce]">{description}</span>
                    </span>
                    <ArrowUpRight size={18} className="mt-0.5 shrink-0 text-[#a1c7b6] transition group-hover:text-[#b6f4d4]" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </CollapsibleGuideSection>
        </section>

        <section
          aria-label="Transaction statistics"
          className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4 2xl:grid-cols-4"
        >
          {stats.map(({ label, value, previous, icon: Icon, tone }) => (
            <article
              key={label}
              className="flex min-h-[124px] items-center gap-3 rounded-xl border border-[#e2e8e6] bg-white p-4 shadow-[0_7px_24px_rgba(25,55,47,0.04)] sm:gap-4 sm:p-5"
            >
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-full sm:h-14 sm:w-14 ${tone}`}
              >
                <Icon size={25} strokeWidth={1.7} />
              </span>
              <div>
                <p className="text-lg text-[#53637f]">{label}</p>
                <strong className="mt-1.5 block text-[27px] leading-none tracking-tight">
                  {value.toLocaleString()}
                </strong>
                <p className="mt-2 text-base text-[#61708a]">
                  {monthlyComparison(value, previous)}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-[#e2e8e6] bg-white shadow-[0_7px_24px_rgba(25,55,47,0.04)]">
          <div
            role="tablist"
            aria-label="Transactions"
            className="grid grid-cols-3 border-b border-[#e7ecea] px-2 sm:flex sm:px-5"
          >
            {tabs.map(({ value, label, mobileLabel, icon: Icon }, index) => (
              <button
                key={value}
                id={`${value}-tab`}
                role="tab"
                aria-label={label}
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
                          ? tabs[tabs.length - 1]
                          : tabs[
                              (index +
                                (event.key === "ArrowRight" ? 1 : -1) +
                                tabs.length) %
                                tabs.length
                            ];
                    selectTab(next.value);
                    document.getElementById(`${next.value}-tab`)?.focus();
                  }
                }}
                className={`flex h-14 min-w-0 items-center justify-center gap-1.5 whitespace-nowrap border-b-2 px-1 text-base font-semibold transition sm:h-16 sm:gap-2 sm:px-5 sm:text-lg ${filters.type === value ? "border-[#00a96b] text-[#009b67]" : "border-transparent text-[#65728a] hover:text-[#344260]"}`}
              >
                <Icon size={17} className="shrink-0" />
                <span className="sm:hidden">{mobileLabel}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
          <div
            id="transaction-panel"
            role="tabpanel"
            aria-labelledby={`${filters.type}-tab`}
          >
            <div className="space-y-3 border-b border-[#e7ecea] p-4 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    updateFilters({ search: filters.search });
                  }}
                  className="col-span-full min-w-0"
                >
                  <label htmlFor="transaction-search" className="mb-1.5 block text-base font-medium text-[#53637f]">
                    Search
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#dfe5e7] bg-white px-3 text-[#75829a] transition focus-within:border-[#00a96b] focus-within:ring-2 focus-within:ring-[#00a96b]/10">
                      <Search size={17} className="shrink-0" />
                      <input
                        id="transaction-search"
                        aria-label="Search transactions"
                        value={filters.search}
                        onChange={(event) =>
                          updateFilters({ search: event.target.value })
                        }
                        placeholder="Search transactions..."
                        className="min-w-0 flex-1 bg-transparent text-base text-[#344260] outline-none placeholder:text-[#8a95a6]"
                      />
                    </div>
                    <button type="submit" className="h-11 shrink-0 rounded-lg bg-[#009b67] px-5 text-base font-semibold text-white transition hover:bg-[#008455] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009b67]">Search</button>
                  </div>
                </form>
                <MultiSelectFilter
                  label={filters.type === "credit" ? "Credit type" : "Category"}
                  value={filters.category}
                  onChange={(category) => updateFilters({ category })}
                  allLabel={
                    filters.type === "credit"
                      ? "All credit types"
                      : "All categories"
                  }
                  options={[
                    ...(filters.type === "credit"
                      ? creditTypes
                      : filters.type === "bill"
                        ? [...billCategories, "Uncategorized"]
                        : [...billCategories, "Uncategorized", ...creditTypes]),
                  ].map((value) => ({ value, label: value }))}
                />
                <MultiSelectFilter
                  label="Provider"
                  value={filters.provider}
                  onChange={(provider) => updateFilters({ provider })}
                  allLabel="All providers"
                  searchable
                  options={providerOptions.map((value) => ({
                    value,
                    label: value,
                  }))}
                />
                <FilterSelect
                  label="Date range"
                  value={filters.period}
                  onChange={(period) =>
                    updateFilters({
                      period: period as TransactionFilters["period"],
                    })
                  }
                  icon={CalendarDays}
                  options={periods.map((value) => ({ value, label: value }))}
                />
                <MultiSelectFilter
                  label="Status"
                  value={filters.status}
                  onChange={(status) => updateFilters({ status })}
                  allLabel="All statuses"
                  icon={CheckCircle2}
                  options={["Completed", "Pending", "Failed", "Canceled"].map(
                    (value) => ({ value, label: value }),
                  )}
                />
              </div>
              {filters.period === "Custom" && (
                <div className="flex flex-wrap items-end gap-3 rounded-lg bg-[#f8faf9] p-3">
                  <label className="text-base text-[#596885]">
                    From
                    <input
                      type="date"
                      value={filters.from}
                      max={filters.to || undefined}
                      onChange={(event) =>
                        updateFilters({ from: event.target.value })
                      }
                      className="mt-1 block h-10 rounded-md border border-[#dfe5e7] bg-white px-3 text-base"
                    />
                  </label>
                  <label className="text-base text-[#596885]">
                    To
                    <input
                      type="date"
                      value={filters.to}
                      min={filters.from || undefined}
                      onChange={(event) =>
                        updateFilters({ to: event.target.value })
                      }
                      className="mt-1 block h-10 rounded-md border border-[#dfe5e7] bg-white px-3 text-base"
                    />
                  </label>
                  {!validPeriod && (
                    <p
                      role="status"
                      className="pb-3 text-base text-[#a67617]"
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
                    className="text-base font-semibold text-[#009b67] hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="text-[17px] w-full min-w-[1080px] text-left">
                <thead className="border-b border-[#e9eeec] bg-[#f8faf9] text-lg text-[#64718a]">
                  <tr>
                    {[
                      "Transaction ID",
                      "Transaction",
                      filters.type === "credit" ? "Credit type" : "Category",
                      ...(filters.type === "all" ? ["Type"] : []),
                      "Date",
                      "Amount",
                      "Status",
                    ].map((heading, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={`px-5 py-3.5 font-semibold ${heading === "Amount" || heading === "Credits" ? "text-right" : ""}`}
                      >
                        {heading || <span className="sr-only">Details</span>}
                      </th>
                    ))}
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-right font-semibold"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e9eeec]">
                  {visible.map((item) => {
                    const billTransaction = transactionKind(item) === "bill";
                    const outgoing =
                      normalize(item.type).includes("sent") || item.amount < 0;
                    const Icon = billTransaction
                      ? FileText
                      : outgoing
                        ? ArrowUpRight
                        : ArrowDownLeft;
                    const title = description(item);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedTransaction(item)}
                        className="group cursor-pointer text-[17px] transition hover:bg-[#f4faf7] focus-within:bg-[#f4faf7]"
                      >
                        <td
                          className="whitespace-nowrap px-5 py-4 font-mono text-[17px] text-[#53637f]"
                          title={item.transactionId}
                        >
                          {item.transactionId}
                        </td>

                        <td className="max-w-[300px] px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eef8f4] text-[#00a96b]">
                              <Icon size={18} />
                            </span>
                            <div className="min-w-0 flex-1">
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedTransaction(item);
                                }}
                                aria-label={`View transaction ${item.transactionId}`}
                                className="block max-w-full truncate text-left font-semibold text-[#26344c] outline-offset-4"
                              >
                                {title}
                              </button>
                            </div>
                          </div>
                        </td>

                        <td className="max-w-48 px-5 py-4 leading-6 text-[#64718a]">
                          {categoriesForTransaction(item, bills).join(", ")}
                        </td>
                        {filters.type === "all" && (
                          <td className="px-5 py-4 text-[#64718a]">
                            {billTransaction ? "Bill" : "Credit"}
                          </td>
                        )}
                        <td className="whitespace-nowrap px-5 py-4 text-[#53637f]">
                          {item.date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          <p className="mt-1 text-[17px] text-[#8a95a6]">
                            {item.date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </td>
                        <td
                          className={`whitespace-nowrap px-5 py-4 text-right text-[17px] font-semibold tabular-nums ${!billTransaction && !outgoing ? "text-[#009b67]" : "text-[#26344c]"}`}
                        >
                          {billTransaction
                            ? money.format(item.amount)
                            : creditAmount(item)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={item.status} />
                        </td>

                        <td
                          className="relative px-4 py-4 text-right"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <button
                            type="button"
                            aria-label={`Actions for transaction ${item.transactionId}`}
                            aria-expanded={actionsFor === item.id}
                            onClick={() =>
                              setActionsFor(
                                actionsFor === item.id ? null : item.id,
                              )
                            }
                            className="grid h-8 w-8 ml-auto place-items-center rounded-md hover:bg-[#eef8f4]"
                          >
                            <MoreVertical size={17} />
                          </button>
                          {actionsFor === item.id && (
                            <div className="absolute right-3 top-12 z-20 min-w-32 rounded-lg border border-[#e2e8e6] bg-white p-1 text-left shadow-xl">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedTransaction(item);
                                  setActionsFor(null);
                                }}
                                className="block w-full rounded-md px-3 py-2 text-left text-[17px] hover:bg-[#f4faf7]"
                              >
                                View
                              </button>
                              <a
                                href={transactionReportUrl(item)}
                                onClick={() => setActionsFor(null)}
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-[17px] hover:bg-[#f4faf7]"
                              >
                                <Flag size={13} />
                                Report
                              </a>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#e9eeec] lg:hidden">
              {visible.map((item) => {
                const billTransaction = transactionKind(item) === "bill";
                const title = description(item);
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedTransaction(item)}
                    className="block w-full p-4 text-left transition hover:bg-[#f4faf7]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eef8f4] text-[#00a96b]">
                        {billTransaction ? (
                          <FileText size={18} />
                        ) : (
                          <ArrowLeftRight size={18} />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold">
                          {title}
                        </p>
                        <p className="mt-1 truncate text-base text-[#7b879b]">
                          {categoriesForTransaction(item, bills).join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-semibold tabular-nums">
                          {billTransaction
                            ? money.format(item.amount)
                            : `${creditAmount(item)} credits`}
                        </p>
                        <div className="mt-2">
                          <StatusBadge status={item.status} />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-col gap-2 rounded-lg bg-[#f8faf9] px-3 py-2.5 text-base text-[#718097] sm:flex-row sm:items-center sm:justify-between">
                      <span>
                        {item.date.toLocaleDateString("en-US", {
                          dateStyle: "medium",
                        })}
                        {billTransaction ? ` / ${method(item)}` : ""}
                      </span>
                      <span className="min-w-0">
                        <span className="mr-2 font-sans text-base uppercase text-[#8a95a6]">
                          Transaction ID
                        </span>
                        <span className="break-all font-mono text-[#53637f]">
                          {item.transactionId}
                        </span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {!visible.length && (
              <div className="grid min-h-[300px] place-items-center p-8 text-center">
                <div>
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#f0f6f3] text-[#9ab5a8]">
                    <Search size={24} strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">
                    No{" "}
                    {filters.type === "all"
                      ? ""
                      : filters.type === "bill"
                        ? "bill"
                        : "credit"}{" "}
                    transactions found
                  </h3>
                  <p className="mt-2 text-base text-[#7b879b]">
                    Try a different period or adjust your filters.
                  </p>
                </div>
              </div>
            )}
            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e7ecea] px-5 py-4">
              <p aria-live="polite" className="text-base text-[#7b879b]">
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
                className="flex flex-wrap items-center gap-2"
              >
                <PageSizeSelect
                  value={pageSize}
                  onChange={(value) => {
                    setPage(1);
                    setPageSize(value);
                  }}
                />
                <button
                  aria-label="Previous page"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                  className="grid h-8 w-8 place-items-center rounded-md border border-[#dfe6e4] text-[#64718a] transition hover:bg-[#f0faf5] disabled:opacity-35"
                >
                  <ChevronLeft size={15} />
                </button>
                <span className="px-2 text-base text-[#64718a]">
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
    </>
  );
}
