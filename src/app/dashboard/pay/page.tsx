"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  FileText,
  Filter,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import NotificationsMenu from "@/components/dashboard/NotificationsMenu";
import TransactionDetailsModal from "@/components/transactions/TransactionDetailsModal";
import { useVuiorSession } from "@/hooks/useVuiorSession";
import {
  type Bill,
  type Transaction,
  useVuiorData,
} from "@/hooks/useVuiorData";
import {
  billReward,
  checkoutUrl,
  createBillsCheckout,
  payBillsWithCredits,
} from "@/services/payments";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const paidStatuses = ["in review", "paid", "completed"];
function normalized(value: string) {
  return value.trim().toLowerCase().replaceAll("_", " ");
}
function daysUntil(value: string) {
  const date = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return Math.ceil((date.getTime() - today.getTime()) / 86400000);
}
function billStatus(bill: Bill) {
  const value = normalized(bill.status);
  return value === "in review"
    ? { label: "In review", className: "bg-[#fff6df] text-[#9a6700]" }
    : paidStatuses.includes(value)
      ? { label: "Paid", className: "bg-[#e9f8f1] text-[#008e61]" }
      : { label: value || "Active", className: "bg-[#eef4ff] text-[#3768b2]" };
}

function BillDetails({
  bill,
  paymentId,
  onClose,
}: {
  bill: Bill;
  paymentId?: string;
  onClose: () => void;
}) {
  const status = billStatus(bill);
  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-[#07142d]/55 p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-[#e7ecea] p-6">
          <div>
            <h2 className="text-[20px] font-semibold">{bill.name}</h2>
            <p className="mt-1 text-[12px] text-[#65728a]">Paid bill details</p>
          </div>
          <button
            aria-label="Close bill details"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-[#f1f4f3]"
          >
            <X size={17} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between rounded-xl bg-[#f6faf8] p-5">
            <div>
              <p className="text-[11px] text-[#718097]">Amount</p>
              <p className="mt-1 text-[26px] font-semibold">
                {money.format(bill.amountPaid ?? bill.amount)}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1.5 text-[11px] ${status.className}`}
            >
              {status.label}
            </span>
          </div>
          <dl className="mt-5 divide-y divide-[#edf1ef]">
            {[
              ["Bill ID", bill.billId],
            ["Payment ID", paymentId || bill.paymentId || "Not recorded"],
              ["Category", bill.category],
              ["Payment method", bill.paidWith || "Not recorded"],
              [
                "Due date",
                bill.dueDate
                  ? new Date(bill.dueDate).toLocaleDateString("en-US", {
                      dateStyle: "medium",
                    })
                  : "Not recorded",
              ],
              [
                status.label === "In review" ? "Submitted" : "Paid",
                (bill.paymentSubmittedAt || bill.paidAt)?.toLocaleString(
                  "en-US",
                  { dateStyle: "medium", timeStyle: "short" },
                ) || "Not recorded",
              ],
              ["Account number", bill.accountNumber || "Not recorded"],
            ].map(([label, value]) => (
              <div
                key={label as string}
                className="grid gap-1 py-3 sm:grid-cols-[140px_1fr]"
              >
                <dt className="text-[12px] text-[#718097]">{label}</dt>
                <dd className="break-all text-[13px]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export default function PayPage() {
  const { user } = useVuiorSession();
  const { bills, transactions } = useVuiorData(user?.id);
  const [view, setView] = useState<"bills" | "transactions">("bills");
  const [billTab, setBillTab] = useState<"due" | "paid">("due");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [checkout, setCheckout] = useState(false);
  const [applyCredits, setApplyCredits] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  const visibleBills = useMemo(
    () =>
      bills
        .filter((bill) =>
          billTab === "due"
            ? ["active", "upcoming"].includes(normalized(bill.status)) &&
              daysUntil(bill.dueDate) <= 30
            : paidStatuses.includes(normalized(bill.status)),
        )
        .sort((a, b) => +new Date(b.dueDate) - +new Date(a.dueDate)),
    [bills, billTab],
  );
  const transactionTypes = useMemo(
    () => Array.from(new Set(transactions.map((item) => item.type))).sort(),
    [transactions],
  );
  const transactionStatuses = useMemo(
    () => Array.from(new Set(transactions.map((item) => item.status))).sort(),
    [transactions],
  );
  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return transactions.filter(
      (item) =>
        (typeFilter === "All" || item.type === typeFilter) &&
        (statusFilter === "All" || item.status === statusFilter) &&
        (!query ||
          [
            item.label,
            item.transactionId,
            item.paymentId,
            item.reference,
            item.category,
            ...item.billPublicIds,
          ]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(query))),
    );
  }, [transactions, search, typeFilter, statusFilter]);
  function paymentIdForBill(bill: Bill) {
    if (bill.paymentId) return bill.paymentId;
    return transactions.find((item) => item.billIds.includes(bill.id))
      ?.transactionId;
  }
  const selectedBills = bills.filter((bill) => selected.has(bill.id));
  const subtotal = selectedBills.reduce((sum, bill) => sum + bill.amount, 0);
  const rewards = selectedBills.reduce(
    (sum, bill) => sum + billReward(bill),
    0,
  );
  const available = Number(user?.availableCredits ?? 0);
  const maxPartialCredits = Math.min(available, Math.max(0, subtotal - 0.5));
  const creditsForCard = applyCredits
    ? Math.min(maxPartialCredits, Math.max(0, Number(creditAmount) || 0))
    : 0;
  const cardCharge = Math.max(0, subtotal - creditsForCard);
  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function selectAll() {
    setSelected((current) =>
      visibleBills.every((bill) => current.has(bill.id))
        ? new Set()
        : new Set(visibleBills.map((bill) => bill.id)),
    );
  }
  async function payCredits() {
    if (!user?.id || !selectedBills.length || available < subtotal) return;
    setCheckout(false);
    setProcessing(true);
    setResult(null);
    try {
      const response = await payBillsWithCredits(user.id, selectedBills);
      setSelected(new Set());
      setResult({
        ok: true,
        message: `Payment submitted for review. ${money.format(response.reward)} in early-payment credits will be added after approval.`,
      });
    } catch (error) {
      setResult({
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Payment could not be completed.",
      });
    } finally {
      setProcessing(false);
    }
  }
  async function payCard() {
    if (!user?.id || !selectedBills.length) return;
    setProcessing(true);
    setResult(null);
    try {
      const response = await createBillsCheckout({
        userId: user.id,
        bills: selectedBills,
        creditsApplied: creditsForCard,
        savings: rewards,
        customerId: user.stripeCustomerId,
      });
      window.location.assign(checkoutUrl(response));
    } catch (error) {
      setCheckout(false);
      setResult({
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Checkout could not be started.",
      });
      setProcessing(false);
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1530px] p-5 sm:p-7 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[29px] font-semibold tracking-[-.035em]">
              Pay Bills
            </h1>
            <p className="mt-1 text-[13px] text-[#596885]">
              Pay bills, follow review progress, and inspect every transaction.
            </p>
          </div>
          <div className="flex items-center gap-3">
          <Link
            href="/dashboard/bills?addBill=1"
            className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#009b67] px-4 text-[12px] font-medium text-white"
          >
            <Plus size={16} /> Add bill
          </Link>
          <NotificationsMenu userId={user?.id} />
          </div>
        </div>
        {result && (
          <div
            className={`mt-5 flex items-center gap-3 rounded-lg border p-4 text-[12px] ${result.ok ? "border-[#bfe8d6] bg-[#effaf5] text-[#08764f]" : "border-[#fecaca] bg-[#fff1f2] text-[#b4233b]"}`}
          >
            <CheckCircle2 size={18} />
            <span>{result.message}</span>
            <button onClick={() => setResult(null)} className="ml-auto">
              <X size={15} />
            </button>
          </div>
        )}
        <section className="mt-6 overflow-hidden rounded-xl bg-linear-to-r from-[#06453a] to-[#032f29] p-6 text-white">
          <div className="grid items-center gap-5 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[10px] uppercase tracking-[.18em] text-[#b6d7cc]">
                Available credits
              </p>
              <span className="mt-2 block text-[32px] font-semibold">
                {money.format(available)}
              </span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4">
              <p className="flex items-center gap-2 text-[13px] font-medium">
                <Sparkles size={17} className="text-[#55deb0]" /> Pay early.
                Save more.
              </p>
              <p className="mt-2 text-[11px] text-[#b6d7cc]">
                Earn up to 15% in credits on eligible early payments.
              </p>
            </div>
          </div>
        </section>
        <div className="mt-5 grid w-full grid-cols-2 rounded-lg border border-[#dfe6e4] bg-white p-1">
          {[
            ["bills", "Bills"],
            ["transactions", "Transaction history"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setView(value as typeof view)}
              className={`h-10 w-full rounded-md px-5 text-[12px] font-medium ${view === value ? "bg-[#063f35] text-white" : "text-[#53617a]"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {view === "bills" ? (
          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <section className="overflow-hidden rounded-xl border border-[#e1e8e5] bg-white">
              <div className="flex items-center justify-between p-5">
                <h2 className="text-[16px] font-semibold">My Bills</h2>
              </div>
              <div className="grid grid-cols-2 border-b border-[#e7ecea]">
                {[
                  ["due", "Due Soon"],
                  ["paid", "Paid & in review"],
                ].map(([value, label]) => (
                  <button
                    onClick={() => {
                      setBillTab(value as typeof billTab);
                      setSelected(new Set());
                    }}
                    key={value}
                    className={`h-12 border-b-2 text-[12px] font-medium ${billTab === value ? "border-[#009b67] text-[#009b67]" : "border-transparent text-[#718097]"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {billTab === "due" && visibleBills.length > 0 && (
                <button
                  onClick={selectAll}
                  className="flex h-11 w-full items-center gap-3 border-b border-[#edf1ef] px-5 text-[11px] text-[#596885]"
                >
                  <span
                    className={`grid h-4 w-4 place-items-center rounded border ${visibleBills.every((bill) => selected.has(bill.id)) ? "border-[#009b67] bg-[#009b67] text-white" : "border-[#bfc9c5]"}`}
                  >
                    {visibleBills.every((bill) => selected.has(bill.id)) && (
                      <Check size={11} />
                    )}
                  </span>
                  {visibleBills.every((bill) => selected.has(bill.id))
                    ? "Deselect all"
                    : "Select all"}
                </button>
              )}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[780px] text-left">
                  <thead className="bg-[#f8faf9] text-[11px] text-[#53617a]">
                    <tr>
                      {(billTab === "due"
                        ? [
                            "",
                            "Bill",
                            "Bill ID",
                            "Due date",
                            "Amount",
                            "Reward",
                          ]
                        : [
                            "Bill",
                            "Bill ID",
                            "Payment ID",
                            "Amount",
                            "Method",
                            "Status",
                          ]
                      ).map((heading) => (
                        <th key={heading} className="px-5 py-3 font-medium">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#edf1ef]">
                    {visibleBills.map((bill) => {
                      const status = billStatus(bill);
                      return (
                        <tr
                          key={bill.id}
                          onClick={() =>
                            billTab === "due"
                              ? toggle(bill.id)
                              : setSelectedBill(bill)
                          }
                          className={`cursor-pointer text-[13px] hover:bg-[#fbfdfc] ${selected.has(bill.id) ? "bg-[#f1faf6]" : ""}`}
                        >
                          {billTab === "due" && (
                            <td className="px-5 py-4">
                              <span
                                className={`grid h-5 w-5 place-items-center rounded border ${selected.has(bill.id) ? "border-[#009b67] bg-[#009b67] text-white" : "border-[#cbd4d1]"}`}
                              >
                                {selected.has(bill.id) && <Check size={12} />}
                              </span>
                            </td>
                          )}
                          <td className="px-5 py-4">
                            <span className="block">{bill.name}</span>
                            <small className="mt-1 block text-[11px] text-[#718097]">
                              {bill.category}
                            </small>
                          </td>
                          <td className="px-5 py-4 text-[#53617a]">
                            {bill.billId}
                          </td>
                          {billTab === "due" ? (
                            <>
                              <td className="px-5 py-4 text-[#53617a]">
                                {new Date(bill.dueDate).toLocaleDateString()}
                              </td>
                              <td className="px-5 py-4">
                                {money.format(bill.amount)}
                              </td>
                              <td className="px-5 py-4 text-[#009b67]">
                                {money.format(billReward(bill))}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-5 py-4 text-[#53617a]">
                              {paymentIdForBill(bill) || "Not recorded"}
                              </td>
                              <td className="px-5 py-4">
                                {money.format(bill.amountPaid ?? bill.amount)}
                              </td>
                              <td className="px-5 py-4 capitalize text-[#53617a]">
                                {bill.paidWith || "Not recorded"}
                              </td>
                              <td className="px-5 py-4">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[11px] ${status.className}`}
                                >
                                  {status.label}
                                </span>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="divide-y divide-[#edf1ef] md:hidden">
                {visibleBills.map((bill) => {
                  const status = billStatus(bill);
                  return (
                    <button
                      key={bill.id}
                      onClick={() =>
                        billTab === "due"
                          ? toggle(bill.id)
                          : setSelectedBill(bill)
                      }
                      className="flex w-full items-center gap-3 p-4 text-left"
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eef8f4] text-[#009b67]">
                        <FileText size={17} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px]">
                          {bill.name}
                        </span>
                        <small className="mt-1 block truncate text-[11px] text-[#718097]">
                          {bill.billId}
                        </small>
                      </span>
                      <span className="text-right">
                        <span className="block text-[13px]">
                          {money.format(bill.amount)}
                        </span>
                        {billTab === "paid" && (
                          <small
                            className={`mt-1 inline-block rounded px-2 py-1 text-[10px] ${status.className}`}
                          >
                            {status.label}
                          </small>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
              {!visibleBills.length && (
                <div className="grid min-h-64 place-items-center p-8 text-center">
                  <div>
                    <CalendarDays
                      size={30}
                      className="mx-auto text-[#bdc9c5]"
                    />
                    <p className="mt-3 text-[13px]">
                      No{" "}
                      {billTab === "due"
                        ? "bills due soon"
                        : "paid or in-review bills"}
                    </p>
                  </div>
                </div>
              )}
            </section>
            <aside className="h-fit rounded-xl border border-[#e1e8e5] bg-white p-5">
              <h2 className="text-[15px] font-semibold">Order Summary</h2>
              {selectedBills.length ? (
                <>
                  <div className="mt-4 space-y-3">
                    {selectedBills.map((bill) => (
                      <div
                        key={bill.id}
                        className="flex justify-between text-[12px]"
                      >
                        <span className="text-[#596885]">{bill.name}</span>
                        <span>{money.format(bill.amount)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-[#edf1ef] pt-4">
                    <p className="flex justify-between text-[12px] text-[#009b67]">
                      <span>Credits you’ll earn</span>
                      <span>{money.format(rewards)}</span>
                    </p>
                    <p className="mt-3 flex justify-between text-[16px]">
                      <span>Total</span>
                      <span>{money.format(subtotal)}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCheckout(true);
                      setApplyCredits(false);
                      setCreditAmount("");
                    }}
                    className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#009b67] text-[12px] font-medium text-white"
                  >
                    <CircleDollarSign size={17} /> Pay ·{" "}
                    {money.format(subtotal)}
                  </button>
                </>
              ) : (
                <div className="grid min-h-[210px] place-items-center text-center">
                  <div>
                    <WalletCards size={30} className="mx-auto text-[#bdc9c5]" />
                    <p className="mt-3 text-[11px] leading-5 text-[#718097]">
                      Select one or more due bills to see your payment summary.
                    </p>
                  </div>
                </div>
              )}
              <div className="mt-4 flex gap-2 rounded-lg bg-[#f4faf7] p-3 text-[10px] leading-4 text-[#527064]">
                <ShieldCheck size={16} className="shrink-0 text-[#009b67]" />{" "}
                Secure checkout and encrypted payments.
              </div>
            </aside>
          </div>
        ) : (
          <section className="mt-5 overflow-hidden rounded-xl border border-[#e1e8e5] bg-white">
            <div className="flex flex-col gap-4 border-b border-[#e7ecea] p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-[16px] font-semibold">
                  Transaction history
                </h2>
                <p className="mt-1 text-[11px] text-[#718097]">
                  All wallet, credit, referral, and bill-payment activity.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="flex h-10 min-w-[240px] items-center gap-2 rounded-md border border-[#dfe6e4] px-3">
                  <Search size={15} className="text-[#718097]" />
                  <input
                    aria-label="Search transactions"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search IDs or descriptions"
                    className="min-w-0 flex-1 text-[12px] outline-none"
                  />
                </label>
                <label className="flex h-10 items-center gap-2 rounded-md border border-[#dfe6e4] px-3">
                  <Filter size={14} />
                  <select
                    aria-label="Filter by transaction type"
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value)}
                    className="bg-transparent text-[12px] outline-none"
                  >
                    <option>All</option>
                    {transactionTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </label>
                <select
                  aria-label="Filter by status"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-10 rounded-md border border-[#dfe6e4] bg-white px-3 text-[12px] outline-none"
                >
                  <option>All</option>
                  {transactionStatuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-[#f8faf9] text-[11px] text-[#53617a]">
                  <tr>
                    {[
                      "Transaction ID",
                      "Description",
                      "Type",
                      "Amount",
                      "Method",
                      "Status",
                      "Date",
                    ].map((heading) => (
                      <th key={heading} className="px-5 py-3 font-medium">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf1ef]">
                  {filteredTransactions.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedTransaction(item)}
                      className="cursor-pointer text-[13px] hover:bg-[#f7fbf9]"
                    >
                      <td className="px-5 py-4 text-[#009b67]">
                        {item.transactionId}
                      </td>
                      <td className="px-5 py-4">{item.label}</td>
                      <td className="px-5 py-4 text-[#53617a]">{item.type}</td>
                      <td className="px-5 py-4">{money.format(item.amount)}</td>
                      <td className="px-5 py-4 capitalize text-[#53617a]">
                        {item.paymentMethod || "Not recorded"}
                      </td>
                      <td className="px-5 py-4">{item.status}</td>
                      <td className="px-5 py-4 text-[#53617a]">
                        {item.date.toLocaleDateString("en-US", {
                          dateStyle: "medium",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filteredTransactions.length && (
                <div className="grid min-h-64 place-items-center text-[13px] text-[#718097]">
                  No transactions match these filters.
                </div>
              )}
            </div>
          </section>
        )}
      </div>
      {selectedBill && (
        <BillDetails
          bill={selectedBill}
          paymentId={paymentIdForBill(selectedBill)}
          onClose={() => setSelectedBill(null)}
        />
      )}{" "}
      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          bills={bills}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
      {checkout && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#07142d]/55 p-4">
          <div className="w-full max-w-[520px] rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[20px] font-semibold">Choose how to pay</h2>
                <p className="mt-1 text-[12px] text-[#65728a]">
                  {selectedBills.length} bill
                  {selectedBills.length === 1 ? "" : "s"} ·{" "}
                  {money.format(subtotal)} total
                </p>
              </div>
              <button
                onClick={() => setCheckout(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#f1f4f3]"
              >
                <X size={17} />
              </button>
            </div>
            {available >= subtotal && (
              <button
                disabled={processing}
                onClick={payCredits}
                className="mt-4 flex w-full items-center gap-3 rounded-xl border border-[#dfe6e4] p-4 text-left"
              >
                <WalletCards size={20} className="text-[#009b67]" />
                <span className="flex-1">
                  <span className="block text-[13px]">Vuior credits</span>
                  <small className="text-[11px] text-[#718097]">
                    Balance: {money.format(available)}
                  </small>
                </span>
              </button>
            )}
            <div className="mt-3 rounded-xl border border-[#dfe6e4] p-4">
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-[#3776d2]" />
                <span>
                  <span className="block text-[13px]">
                    Credit or debit card
                  </span>
                  <small className="text-[11px] text-[#718097]">
                    Secure checkout powered by Stripe
                  </small>
                </span>
              </div>
              {available > 0 && maxPartialCredits > 0 && (
                <div className="mt-4 border-t border-[#edf1ef] pt-4">
                  <label className="flex items-center justify-between text-[12px]">
                    <span>Apply Vuior credits</span>
                    <input
                      type="checkbox"
                      checked={applyCredits}
                      onChange={(event) => {
                        setApplyCredits(event.target.checked);
                        if (event.target.checked)
                          setCreditAmount(maxPartialCredits.toFixed(2));
                      }}
                    />
                  </label>
                  {applyCredits && (
                    <div className="mt-3 flex h-10 items-center rounded-lg border border-[#dfe6e4] px-3">
                      <span>$</span>
                      <input
                        inputMode="decimal"
                        value={creditAmount}
                        onChange={(event) =>
                          setCreditAmount(
                            event.target.value.replace(/[^0-9.]/g, ""),
                          )
                        }
                        className="min-w-0 flex-1 px-2 text-[12px] outline-none"
                      />
                      <button
                        onClick={() =>
                          setCreditAmount(maxPartialCredits.toFixed(2))
                        }
                        className="text-[11px] text-[#009b67]"
                      >
                        Use max
                      </button>
                    </div>
                  )}
                </div>
              )}
              <button
                disabled={processing}
                onClick={payCard}
                className="mt-4 h-11 w-full rounded-lg bg-[#101828] text-[12px] font-medium text-white disabled:opacity-60"
              >
                {processing
                  ? "Starting checkout…"
                  : `Continue · ${money.format(cardCharge)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
