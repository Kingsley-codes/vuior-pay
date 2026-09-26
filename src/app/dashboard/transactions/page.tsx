"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, CheckCircle2, ChevronLeft, ChevronRight, CircleDollarSign, Clock3, Search, Send, WalletCards } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import NotificationsMenu from "@/components/dashboard/NotificationsMenu";
import { CreditsSkeleton } from "@/components/dashboard/DashboardSkeletons";
import WalletModal, { type WalletAction } from "@/components/credits/WalletModal";
import CreditGuideModal from "@/components/transactions/CreditGuideModal";
import TransactionDetailsModal from "@/components/transactions/TransactionDetailsModal";
import { useVuiorSession } from "@/hooks/useVuiorSession";
import { type Transaction, useVuiorData } from "@/hooks/useVuiorData";
import { billCategories, categoriesForTransaction, creditCategories, displayName, filterTransactions, normalize, periodBounds, periods, transactionKind, type TransactionFilters } from "@/utils/transactions";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const pageSize = 20;
const defaults: TransactionFilters = { type: "all", category: "All", status: "All", search: "", period: "Last week", from: "", to: "" };
const control = "h-10 w-full rounded-md border border-[#dfe6e4] bg-white px-3 text-[12px] outline-none focus:border-[#009b67] focus:ring-1 focus:ring-[#009b67] disabled:bg-[#f8faf9] disabled:text-[#8a95a6]";

export default function TransactionsPage() {
  const { user } = useVuiorSession();
  const { bills, transactions, loading } = useVuiorData(user?.id);
  const [filters, setFilters] = useState<TransactionFilters>(defaults);
  const [page, setPage] = useState(1);
  const [walletAction, setWalletAction] = useState<WalletAction | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [guide, setGuide] = useState<number | null>(null);
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
  const categories = useMemo(() => filters.type === "credit"
    ? [...new Set([...creditCategories, ...transactions.filter((item) => transactionKind(item) === "credit").map((item) => displayName(item.type))])]
    : [...billCategories, "Uncategorized"], [filters.type, transactions]);
  const statuses = [...new Set(["Completed", "Pending", "In Review", "Failed", "Cancelled", ...transactions.map((item) => displayName(item.status))])];
  const filtered = useMemo(() => filterTransactions(transactions, bills, filters), [transactions, bills, filters]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const completed = filtered.filter((item) => ["completed", "paid", "success", "succeeded"].includes(normalize(item.status))).length;
  const pending = filtered.filter((item) => ["pending", "in review", "processing"].includes(normalize(item.status))).length;
  const failed = filtered.filter((item) => ["failed", "cancelled", "canceled", "declined"].includes(normalize(item.status))).length;
  const validPeriod = periodBounds(filters.period, filters.from, filters.to);
  const referral = transactions.filter((item) => normalize(item.type).includes("referral")).reduce((sum, item) => sum + Math.max(0, item.credits), 0) || Number(user?.referralBonus ?? 0);

  if (loading) return <DashboardShell><CreditsSkeleton /></DashboardShell>;
  return <DashboardShell>
    <div className="mx-auto max-w-[1530px] p-5 sm:p-7 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div><h1 className="text-[29px] font-bold tracking-[-.035em]">Transactions</h1><p className="mt-1 text-[13px] text-[#596885]">Track all your bill payments and credit activity in one place.</p></div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => setWalletAction("send")} className="flex h-10 items-center gap-2 rounded-md border border-[#009b67] px-4 text-[11px] font-semibold text-[#009b67]"><Send size={15} />Send credits</button>
          <button onClick={() => setWalletAction("add")} className="flex h-10 items-center gap-2 rounded-md bg-[#009b67] px-4 text-[11px] font-semibold text-white"><WalletCards size={15} />Add funds</button>
          <NotificationsMenu userId={user?.id} />
        </div>
      </div>
      <section aria-label="Transaction statistics" className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[{ label: "Total transactions", value: filtered.length, icon: ArrowLeftRight }, { label: "Completed transactions", value: completed, icon: CheckCircle2 }, { label: "Pending / in review", value: pending, icon: Clock3 }, { label: "Failed / cancelled", value: failed, icon: CircleDollarSign }].map(({ label, value, icon: Icon }) => <article key={label} className="flex min-h-28 items-center rounded-xl border border-[#e1e8e5] bg-white p-5 shadow-[0_7px_24px_rgba(25,55,47,.035)]"><div className="flex-1"><p className="text-[11px] font-medium">{label}</p><strong className="mt-2 block text-[25px]">{value.toLocaleString()}</strong><p className="mt-2 text-[10px] text-[#65728a]">Current filters &middot; {filters.period}</p></div><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#edf8f4] text-[#009b67]"><Icon size={23} /></span></article>)}
      </section>
      <section className="mt-5 overflow-hidden rounded-xl border border-[#e1e8e5] bg-white shadow-[0_7px_24px_rgba(25,55,47,.035)]">
        <div className="space-y-4 border-b border-[#e7ecea] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-[15px] font-bold">Transaction history</h2><label className="flex h-10 items-center gap-2 rounded-md border border-[#dfe6e4] px-3 focus-within:border-[#009b67] sm:w-80"><Search size={16} className="text-[#718097]" /><input aria-label="Search transactions" value={filters.search} onChange={(event) => updateFilters({ search: event.target.value })} placeholder="Search IDs, descriptions or categories" className="min-w-0 flex-1 text-[12px] outline-none" /></label></div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-1.5 text-[11px] text-[#596885]"><span>Transaction type</span><select className={control} value={filters.type} onChange={(event) => updateFilters({ type: event.target.value, category: "All" })}><option value="all">All transactions</option><option value="credit">Credit transactions</option><option value="bill">Bill transactions</option></select></label>
            <label className="space-y-1.5 text-[11px] text-[#596885]"><span>Category</span><select className={control} disabled={filters.type === "all"} value={filters.category} onChange={(event) => updateFilters({ category: event.target.value })}><option value="All">{filters.type === "all" ? "Select a transaction type first" : "All categories"}</option>{filters.type !== "all" && categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className="space-y-1.5 text-[11px] text-[#596885]"><span>Period</span><select className={control} value={filters.period} onChange={(event) => updateFilters({ period: event.target.value as TransactionFilters["period"] })}>{periods.map((period) => <option key={period}>{period}</option>)}</select></label>
            <label className="space-y-1.5 text-[11px] text-[#596885]"><span>Status</span><select className={control} value={filters.status} onChange={(event) => updateFilters({ status: event.target.value })}><option value="All">All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          </div>
          {filters.period === "Custom" && <div className="flex flex-wrap items-end gap-3"><label className="space-y-1.5 text-[11px] text-[#596885]"><span>From</span><input type="date" className={control} value={filters.from} max={filters.to || undefined} onChange={(event) => updateFilters({ from: event.target.value })} /></label><label className="space-y-1.5 text-[11px] text-[#596885]"><span>To</span><input type="date" className={control} value={filters.to} min={filters.from || undefined} onChange={(event) => updateFilters({ to: event.target.value })} /></label>{!validPeriod && <p role="status" className="pb-3 text-[11px] text-[#9a6700]">Choose a valid start and end date.</p>}</div>}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#718097]"><span>{validPeriod ? `${validPeriod[0].toLocaleDateString()} - ${new Date(+validPeriod[1] - 1).toLocaleDateString()}` : "Custom period"} &middot; Weeks run Monday-Sunday</span><button className="font-semibold text-[#009b67]" onClick={() => updateFilters(defaults)}>Reset filters</button></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left"><thead className="bg-[#f8faf9] text-[11px] text-[#53617a]"><tr>{["Transaction", "Type", "Category", "Amount / credits", "Status", "Date", "Action"].map((heading) => <th key={heading} className="px-5 py-3 font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-[#edf1ef]">
            {visible.map((item) => {
              const kind = transactionKind(item);
              const creditValue = item.credits || item.amount;
              return <tr key={item.id} className="text-[12px] hover:bg-[#f7fbf9]"><td className="max-w-64 px-5 py-4"><p className="font-semibold">{item.label}</p><p className="mt-1 break-all text-[10px] text-[#718097]">{item.transactionId}</p></td><td className="px-5 py-4 text-[#53617a]">{kind === "bill" ? "Bill transaction" : "Credit transaction"}</td><td className="max-w-52 px-5 py-4 text-[#53617a]">{categoriesForTransaction(item, bills).join(", ")}</td><td className="whitespace-nowrap px-5 py-4 font-semibold">{kind === "bill" ? money.format(item.amount) : `${normalize(item.type).includes("sent") && creditValue > 0 ? "-" : creditValue > 0 ? "+" : ""}${creditValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} credits`}</td><td className="px-5 py-4"><span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] ${["completed", "paid", "success", "succeeded"].includes(normalize(item.status)) ? "bg-[#e9f8f1] text-[#008e61]" : ["failed", "cancelled", "canceled", "declined"].includes(normalize(item.status)) ? "bg-[#fff1f2] text-[#b4233b]" : "bg-[#fff6df] text-[#9a6700]"}`}>{displayName(item.status)}</span></td><td className="whitespace-nowrap px-5 py-4 text-[#53617a]">{item.date.toLocaleDateString("en-US", { dateStyle: "medium" })}<small className="mt-1 block text-[#718097]">{item.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small></td><td className="px-5 py-4"><button className="whitespace-nowrap font-semibold text-[#009b67]" aria-label={`View transaction ${item.transactionId}`} onClick={() => setSelectedTransaction(item)}>View details</button></td></tr>;
            })}
          </tbody></table>
        </div>
        {!visible.length && <div className="grid min-h-60 place-items-center p-6 text-center"><div><ArrowLeftRight className="mx-auto text-[#b9cbc5]" /><p className="mt-3 text-[13px] font-semibold">No transactions match these filters</p><p className="mt-1 text-[11px] text-[#718097]">Try another period, category, status, or search term.</p></div></div>}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e7ecea] px-5 py-4 text-[11px] text-[#65728a]"><span aria-live="polite">{filtered.length ? `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filtered.length)}` : "0"} of {filtered.length} transactions &middot; 20 per page</span><nav aria-label="Transaction pagination" className="flex items-center gap-3"><button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="grid h-8 w-8 place-items-center rounded border border-[#dfe6e4] disabled:opacity-40"><ChevronLeft size={15} /></button><span>Page {currentPage} of {pageCount}</span><button aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)} className="grid h-8 w-8 place-items-center rounded border border-[#dfe6e4] disabled:opacity-40"><ChevronRight size={15} /></button></nav></div>
      </section>
      <section className="mt-5 flex flex-col gap-4 rounded-xl border border-[#bfe9d8] bg-linear-to-r from-[#f3fbf7] to-[#fbfefd] p-5 xl:flex-row xl:items-center"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-[5px] border-[#a9e3cd] bg-white text-[#00a96b]"><CircleDollarSign size={23} /></span><div className="flex-1"><h2 className="text-[14px] font-bold">Make more of your credits</h2><p className="mt-1 text-[11px] text-[#64718a]">Earn rewards, invite friends, and apply credits to eligible bills.</p></div><div className="flex flex-wrap gap-2">{["How to earn credits", "Referral & rewards", "Use your credits"].map((label, index) => <button key={label} onClick={() => setGuide(index)} className="h-10 rounded-md border border-[#00a96b] bg-white px-4 text-[11px] font-semibold text-[#009b67]">{label}</button>)}</div></section>
    </div>
    {walletAction && user?.id && <WalletModal initialAction={walletAction} userId={user.id} available={Number(user.availableCredits ?? 0)} onClose={() => setWalletAction(null)} />}
    {selectedTransaction && <TransactionDetailsModal transaction={selectedTransaction} bills={bills} onClose={() => setSelectedTransaction(null)} />}
    {guide !== null && <CreditGuideModal guide={guide} referralCode={user?.referralCode || `VUIOR-${(user?.firstName || "USER").toUpperCase()}`} referral={referral} onClose={() => setGuide(null)} />}
  </DashboardShell>;
}
