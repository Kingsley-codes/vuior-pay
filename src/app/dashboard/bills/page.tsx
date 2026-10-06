"use client";

import { generatePublicId } from "@/utils/publicId";
import { useEffect, useMemo, useRef, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  FileText,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  TrendingUp,
  SlidersHorizontal,
  WalletCards,
} from "lucide-react";
import NotificationsMenu from "@/components/dashboard/NotificationsMenu";
import BillModal from "@/components/bills/BillModal";
import BillPaymentModal from "@/components/bills/BillPaymentModal";
import { db } from "@/services/firebase";
import { useVuiorSession } from "@/hooks/useVuiorSession";
import { useVuiorData } from "@/hooks/useVuiorData";
import type { Bill } from "@/hooks/useVuiorData";
import { BillsSkeleton } from "@/components/dashboard/DashboardSkeletons";
import { billCategories } from "@/utils/transactions";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
type Tab = "Upcoming" | "Overdue" | "Paid" | "In review" | "All bills";

function dueDays(value: string) {
  const due = new Date(value);
  if (Number.isNaN(due.getTime())) return 0;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - now.getTime()) / 86400000);
}

function rewardFor(days: number) {
  return days >= 15 ? 15 : days >= 8 ? 10 : days >= 4 ? 5 : days >= 1 ? 2 : 0;
}

function monthKey(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(value: string) {
  const [year, month] = value.split("-").map(Number);
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function displayStatus(bill: Bill) {
  const value = bill.status.trim().toLowerCase().replaceAll("_", " ");
  if (value === "in review")
    return { label: "In review", className: "bg-[#fff6df] text-[#9a6700]" };
  if (value === "overdue")
    return { label: "Overdue", className: "bg-[#ffe9e9] text-[#db3d3d]" };
  if (["paid", "completed"].includes(value))
    return { label: "Paid", className: "bg-[#e9f8f1] text-[#009a61]" };
  return { label: bill.status, className: "bg-[#e9f8f1] text-[#009a61]" };
}

export default function BillsPage() {
  const { user } = useVuiorSession();
  const { bills, loading } = useVuiorData(user?.id);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [checkoutIds, setCheckoutIds] = useState<string[] | null>(null);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [tab, setTab] = useState<Tab>("Upcoming");
  const [providers, setProviders] = useState<string[]>([]);
  const [category, setCategory] = useState("All Categories");
  const [selectedMonth, setSelectedMonth] = useState(() =>
    monthLabel(monthKey(new Date())),
  );
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{
    mode: "add" | "details";
    bill?: Bill;
  } | null>(null);
  const [infoModal, setInfoModal] = useState<"savings" | "autopay" | null>(
    null,
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("payment")) {
      const message =
        params.get("payment") === "success"
          ? "Checkout completed. Your payment status will update once confirmation is received."
          : "Checkout cancelled. No payment was completed in this checkout.";
      params.delete("payment");
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}${params.size ? `?${params}` : ""}`,
      );
      const timer = window.setTimeout(() => setPaymentMessage(message), 0);
      return () => window.clearTimeout(timer);
    }
    if (new URLSearchParams(window.location.search).get("addBill") === "1") {
      window.history.replaceState({}, "", window.location.pathname);
      const timer = window.setTimeout(() => setModal({ mode: "add" }), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const categories = ["All Categories", ...billCategories];
  const now = new Date();
  const currentMonth = monthKey(now);
  const normalizedStatus = (bill: Bill) =>
    bill.status.trim().toLowerCase().replaceAll("_", " ");
  const dueInCurrentMonth = (bill: Bill) =>
    monthKey(bill.dueDate) === currentMonth;
  const upcomingBills = bills.filter(
    (bill) => normalizedStatus(bill) === "active" && dueInCurrentMonth(bill),
  );
  const overdueBills = bills.filter(
    (bill) => normalizedStatus(bill) === "overdue",
  );
  const paidBills = bills.filter(
    (bill) => normalizedStatus(bill) === "paid" && dueInCurrentMonth(bill),
  );
  const reviewBills = bills.filter(
    (bill) => normalizedStatus(bill) === "in review" && dueInCurrentMonth(bill),
  );
  const providerOptions = useMemo(
    () =>
      [...new Set(bills.map((bill) => bill.name.trim()).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b),
      ),
    [bills],
  );

  const paidMonthOptions = useMemo(() => {
    const months = bills.map((bill) => monthKey(bill.dueDate)).filter(Boolean);
    return [
      "All Months",
      ...Array.from(new Set([...months, monthKey(new Date())]))
        .sort((a, b) => b.localeCompare(a))
        .map(monthLabel),
    ];
  }, [bills]);

  const visibleBills = useMemo(() => {
    return bills
      .filter((bill) => {
        const billStatus = normalizedStatus(bill);
        const matchesTab =
          tab === "Upcoming"
            ? billStatus === "active" && dueInCurrentMonth(bill)
            : tab === "Overdue"
              ? billStatus === "overdue"
              : tab === "Paid"
                ? billStatus === "paid" &&
                  (selectedMonth === "All Months" ||
                    monthLabel(monthKey(bill.dueDate)) === selectedMonth)
                : tab === "In review"
                  ? billStatus === "in review" && dueInCurrentMonth(bill)
                  : tab === "All bills" &&
                    monthKey(bill.dueDate) === currentMonth;
        return (
          matchesTab &&
          (category === "All Categories" || bill.category === category) &&
          (tab !== "Paid" ||
            selectedMonth === "All Months" ||
            monthLabel(monthKey(bill.dueDate)) === selectedMonth) &&
          ((tab !== "Paid" && tab !== "All bills") ||
            providers.length === 0 ||
            providers.includes(bill.name.trim())) &&
          `${bill.name} ${bill.category}`
            .toLowerCase()
            .includes(search.toLowerCase())
        );
      })
      .sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate));
  }, [bills, category, selectedMonth, search, tab, providers]);

  const payableBills = bills.filter(
    (bill) =>
      ["active", "upcoming", "overdue"].includes(
        bill.status.trim().toLowerCase(),
      ) &&
      Number.isFinite(bill.amount) &&
      bill.amount > 0,
  );
  const selectedBills = payableBills.filter((bill) => selected.has(bill.id));
  const selectableVisible = visibleBills.filter((bill) =>
    payableBills.some((item) => item.id === bill.id),
  );
  const allSelected =
    selectableVisible.length > 0 &&
    selectableVisible.every((bill) => selected.has(bill.id));
  function toggleBill(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function selectVisible() {
    setSelected((current) => {
      const next = new Set(current);
      selectableVisible.forEach((bill) => {
        if (allSelected) next.delete(bill.id);
        else next.add(bill.id);
      });
      return next;
    });
  }
  function selectionCheckbox(bill: Bill) {
    return (
      <input
        type="checkbox"
        aria-label={`Select ${bill.name} for payment`}
        checked={selectedBills.some((item) => item.id === bill.id)}
        disabled={!payableBills.some((item) => item.id === bill.id)}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        onChange={() => toggleBill(bill.id)}
        className="h-4 w-4 shrink-0 cursor-pointer rounded accent-[#009b67]"
      />
    );
  }

  async function toggleAutopay(id: string, enabled: boolean) {
    const bill = bills.find((item) => item.id === id);
    await updateDoc(doc(db, "bills", id), {
      autoPay: enabled,
      ...(enabled && !bill?.autopayId
        ? { autopayId: generatePublicId("VPA") }
        : {}),
    });
  }

  if (loading)
    return (
      
        <BillsSkeleton />
      
    );

  return (
    <>
      <div className="mx-auto max-w-[1530px] p-5 sm:p-7 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[29px] font-bold tracking-[-0.035em]">Bills</h1>
            <p className="mt-1.5 text-[13px] text-[#596885]">
              Manage your recurring bills, due dates, and early-payment rewards.
            </p>
          </div>
          <section
            aria-label="Available credits and bill actions"
            className="w-full rounded-xl border border-[#dfe8e3] bg-white p-4 shadow-[0_5px_18px_rgba(25,55,47,0.035)] sm:flex sm:w-auto sm:min-w-[440px] sm:items-center sm:justify-between sm:gap-5 sm:px-5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eaf8f2] text-[#009b67]">
                <WalletCards size={19} />
              </span>
              <div>
                <p className="text-[11px] text-[#64718a]">Available credits</p>
                <p className="mt-0.5 text-[21px] font-bold leading-none text-[#14203e] tabular-nums">
                  {money.format(Number(user?.availableCredits ?? 0))}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-3 sm:mt-0 sm:shrink-0">
              <button
                onClick={() => setModal({ mode: "add" })}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#00a96b] px-4 text-[11px] font-semibold text-white"
              >
                <Plus size={15} /> Add Bill
              </button>
              <NotificationsMenu userId={user?.id} />
            </div>
          </section>
        </div>

        {paymentMessage && (
          <div
            role="status"
            className="mt-5 flex items-start justify-between gap-4 rounded-xl border border-[#c6e6d5] bg-[#f0faf4] p-4 text-xs leading-5 text-[#236443]"
          >
            <p>{paymentMessage}</p>
            <button
              aria-label="Dismiss payment message"
              onClick={() => setPaymentMessage("")}
              className="font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}
        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            [
              "Upcoming Bills",
              String(upcomingBills.length),
              "Active, due this month",
              FileText,
            ],
            [
              "Overdue Bills",
              String(overdueBills.length),
              "All overdue bills",
              CalendarDays,
            ],
            [
              "Paid Bills",
              String(paidBills.length),
              "Paid, due this month",
              RefreshCcw,
            ],
            [
              "In Review Bills",
              String(reviewBills.length),
              "In review, due this month",
              ShieldCheck,
            ],
          ].map(([label, value, note, Icon]) => {
            const IconComponent = Icon as typeof FileText;
            return (
              <article
                key={String(label)}
                className="flex min-h-[130px] items-center gap-4 rounded-xl border border-[#e2e8e6] bg-white p-5 shadow-[0_7px_24px_rgba(25,55,47,0.04)]"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[#eaf8f2] text-[#00a96b]">
                  <IconComponent size={27} />
                </span>
                <div>
                  <p className="text-[12px] text-[#53637f]">
                    {label as string}
                  </p>
                  <strong className="mt-1.5 block text-[25px]">
                    {value as string}
                  </strong>
                  <p className="mt-1.5 text-[11px] text-[#64718a]">
                    {note as string}
                  </p>
                </div>
              </article>
            );
          })}
        </section>

        <div className="mt-6">
          <div className="min-w-0 space-y-5">
            <section className="overflow-hidden rounded-xl border border-[#e2e8e6] bg-white shadow-[0_7px_24px_rgba(25,55,47,0.04)]">
              <div
                role="tablist"
                className="flex items-center overflow-x-auto border-b border-[#e7ecea] px-3 sm:px-5"
              >
                {(
                  [
                    "Upcoming",
                    "Overdue",
                    "Paid",
                    "In review",
                    "All bills",
                  ] as Tab[]
                ).map((item) => (
                  <button
                    key={item}
                    onClick={() => setTab(item)}
                    className={`inline-flex h-14 shrink-0 items-center justify-center border-b-2 px-4 text-[12px] font-semibold leading-none ${tab === item ? "border-[#00a96b] text-[#00a96b]" : "border-transparent text-[#344260]"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 border-b border-[#e7ecea] p-4 sm:grid-cols-2 xl:grid-cols-[minmax(280px,1fr)_minmax(180px,0.45fr)_minmax(180px,0.45fr)_minmax(180px,0.45fr)]">
                <label className="flex h-10 min-w-0 items-center rounded-md border border-[#dfe5e7] bg-white px-3 text-[#75829a]">
                  <Search size={16} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search bills by name or category…"
                    className="ml-2 min-w-0 flex-1 bg-transparent text-[11px] outline-none"
                  />
                </label>
                <Filter
                  value={category}
                  onChange={setCategory}
                  options={categories}
                />
                {tab === "Paid" || tab === "All bills" ? (
                  <Filter
                    value={selectedMonth}
                    onChange={setSelectedMonth}
                    options={paidMonthOptions}
                  />
                ) : null}
                {(tab === "Paid" || tab === "All bills") && (
                  <MultiSelectFilter
                    label="Provider"
                    value={providers}
                    onChange={setProviders}
                    options={providerOptions}
                  />
                )}
              </div>

              {tab !== "Paid" && selectableVisible.length > 0 && (
                <div className="flex items-center justify-between gap-3 border-b border-[#e7ecea] bg-[#fbfdfc] px-4 py-3">
                  <label className="flex cursor-pointer items-center gap-3 text-xs text-[#53617a]">
                    <input
                      type="checkbox"
                      aria-label="Select all visible bills"
                      checked={allSelected}
                      ref={(element) => {
                        if (element)
                          element.indeterminate =
                            !allSelected &&
                            selectableVisible.some((bill) =>
                              selected.has(bill.id),
                            );
                      }}
                      onChange={selectVisible}
                      className="h-4 w-4 accent-[#009b67]"
                    />
                    Select all visible bills
                  </label>
                  <span className="text-[11px] text-[#718097]">
                    Select bills to pay together
                  </span>
                </div>
              )}
              {selectedBills.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#cee5d8] bg-[#edf8f2] px-4 py-4">
                  <div>
                    <p className="text-xs font-semibold text-[#175a3b]">
                      {selectedBills.length} bill
                      {selectedBills.length === 1 ? "" : "s"} selected{" "}
                      <span className="mx-2 text-[#b0cab9]">|</span>{" "}
                      {money.format(
                        selectedBills.reduce(
                          (sum, bill) => sum + bill.amount,
                          0,
                        ),
                      )}
                    </p>
                    <p className="mt-1 text-[10px] text-[#5a7c69]">
                      Selection includes bills across tabs and filters.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelected(new Set())}
                      className="text-xs font-medium text-[#526d5e]"
                    >
                      Clear selection
                    </button>
                    <button
                      onClick={() =>
                        setCheckoutIds(selectedBills.map((bill) => bill.id))
                      }
                      className="flex h-10 items-center gap-2 rounded-lg bg-[#009b67] px-4 text-xs font-semibold text-white hover:bg-[#007e54]"
                    >
                      Proceed to pay <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
              <div>
                <div className="divide-y divide-[#e9eeec] lg:hidden">
                  {visibleBills.map((bill) => {
                    const days = dueDays(bill.dueDate);
                    const reward = rewardFor(days);
                    const shownStatus = displayStatus(bill);
                    return (
                      <article
                        key={bill.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setModal({ mode: "details", bill })}
                        onKeyDown={(event) => {
                          if (
                            event.target === event.currentTarget &&
                            (event.key === "Enter" || event.key === " ")
                          ) {
                            event.preventDefault();
                            setModal({ mode: "details", bill });
                          }
                        }}
                        className={`cursor-pointer p-4 transition hover:bg-[#fbfdfc] ${selectedBills.some((item) => item.id === bill.id) ? "bg-[#f0faf5]" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          {tab !== "Paid" && selectionCheckbox(bill)}
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eef8f4] text-[#00a96b]">
                            <FileText size={17} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12px] font-semibold">
                              {bill.name}
                            </p>
                            <p className="mt-1 text-[10px] text-[#7b879b]">
                              {bill.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[12px] font-bold">
                              {money.format(bill.amount)}
                            </p>
                            <span
                              className={`mt-1.5 inline-block rounded px-2 py-1 text-[9px] capitalize ${shownStatus.className}`}
                            >
                              {shownStatus.label}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-[#f8faf9] p-3">
                          <div>
                            <p className="text-[9px] uppercase tracking-wide text-[#8a95a6]">
                              Due date
                            </p>
                            <p className="mt-1 text-[11px] font-medium">
                              {bill.dueDate
                                ? new Date(bill.dueDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )
                                : "—"}
                            </p>
                            {tab !== "Paid" ? (
                              <p
                                className={`mt-1 text-[9px] ${days < 0 ? "text-[#e04444]" : "text-[#7b879b]"}`}
                              >
                                {days < 0
                                  ? `${Math.abs(days)} days overdue`
                                  : days === 0
                                    ? "Due today"
                                    : `In ${days} days`}
                              </p>
                            ) : (
                              <p
                                className={`mt-1 text-[9px] ${shownStatus.label === "In review" ? "text-[#9a6700]" : "text-[#009a61]"}`}
                              >
                                {shownStatus.label === "In review"
                                  ? "Payment submitted for review"
                                  : "Payment completed"}
                              </p>
                            )}
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-wide text-[#8a95a6]">
                              Early-pay reward
                            </p>
                            {reward ? (
                              <>
                                <p className="mt-1 text-[11px] font-medium">
                                  Up to{" "}
                                  {money.format((bill.amount * reward) / 100)}
                                </p>
                                <p className="mt-1 text-[9px] text-[#00a96b]">
                                  {reward}% reward
                                </p>
                              </>
                            ) : (
                              <p className="mt-1 text-[10px] text-[#7b879b]">
                                Not eligible
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleAutopay(bill.id, !bill.autoPay);
                            }}
                            aria-label={`Turn autopay ${bill.autoPay ? "off" : "on"}`}
                            className="flex items-center gap-2 text-[10px] font-medium text-[#53617a]"
                          >
                            <span
                              className={`relative h-5 w-9 rounded-full transition ${bill.autoPay ? "bg-[#00a96b]" : "bg-[#dfe5e8]"}`}
                            >
                              <span
                                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${bill.autoPay ? "left-[18px]" : "left-0.5"}`}
                              />
                            </span>
                            Autopay {bill.autoPay ? "on" : "off"}
                          </button>
                          {tab !== "Paid" && (
                            <button
                              disabled={
                                !payableBills.some(
                                  (item) => item.id === bill.id,
                                )
                              }
                              onClick={(event) => {
                                event.stopPropagation();
                                setCheckoutIds([bill.id]);
                              }}
                              className="h-9 rounded-lg bg-[#009b67] px-4 text-[11px] font-semibold text-white hover:bg-[#007e54] disabled:opacity-50"
                            >
                              Pay now
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[820px] border-collapse text-left">
                    <thead className="bg-[#f7f9f8] text-[10px] text-[#34425d]">
                      <tr>
                        {tab !== "Paid" && (
                          <th className="w-12 px-4 py-3.5">
                            <span className="sr-only">Select bill</span>
                          </th>
                        )}
                        {[
                          "Provider & Category",
                          "Due Date",
                          "Amount",
                          "Autopay",
                          "Early-Pay Reward",
                          "Status",
                          ...(tab !== "Paid" ? ["Actions"] : []),
                        ].map((head) => (
                          <th key={head} className="px-4 py-3.5 font-semibold">
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e9eeec]">
                      {visibleBills.map((bill) => {
                        const days = dueDays(bill.dueDate);
                        const reward = rewardFor(days);
                        const shownStatus = displayStatus(bill);
                        return (
                          <tr
                            key={bill.id}
                            onClick={() => setModal({ mode: "details", bill })}
                            tabIndex={0}
                            onKeyDown={(event) => {
                              if (
                                event.target === event.currentTarget &&
                                (event.key === "Enter" || event.key === " ")
                              ) {
                                event.preventDefault();
                                setModal({ mode: "details", bill });
                              }
                            }}
                            className={`cursor-pointer text-[11px] hover:bg-[#f6fbf8] ${selectedBills.some((item) => item.id === bill.id) ? "bg-[#f0faf5]" : ""}`}
                          >
                            {tab !== "Paid" && (
                              <td
                                className="px-4 py-3"
                                onClick={(event) => event.stopPropagation()}
                              >
                                {selectionCheckbox(bill)}
                              </td>
                            )}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#eef8f4] text-[#00a96b]">
                                  <FileText size={16} />
                                </span>
                                <div>
                                  <p className="font-semibold">{bill.name}</p>
                                  <p className="mt-1 text-[9px] text-[#7b879b]">
                                    {bill.category}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-medium">
                                {bill.dueDate
                                  ? new Date(bill.dueDate).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "2-digit",
                                        year: "numeric",
                                      },
                                    )
                                  : "—"}
                              </p>
                              {tab !== "Paid" ? (
                                <p
                                  className={`mt-1 text-[9px] ${days < 0 ? "text-[#e04444]" : "text-[#7b879b]"}`}
                                >
                                  {days < 0
                                    ? `${Math.abs(days)} days overdue`
                                    : days === 0
                                      ? "Due today"
                                      : `In ${days} days`}
                                </p>
                              ) : (
                                <p
                                  className={`mt-1 text-[9px] ${shownStatus.label === "In review" ? "text-[#9a6700]" : "text-[#009a61]"}`}
                                >
                                  {shownStatus.label === "In review"
                                    ? "Payment submitted for review"
                                    : "Payment completed"}
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-3 font-semibold">
                              {money.format(bill.amount)}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleAutopay(bill.id, !bill.autoPay);
                                }}
                                aria-label={`Turn autopay ${bill.autoPay ? "off" : "on"}`}
                                className={`relative h-5 w-9 rounded-full transition ${bill.autoPay ? "bg-[#00a96b]" : "bg-[#dfe5e8]"}`}
                              >
                                <span
                                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${bill.autoPay ? "left-[18px]" : "left-0.5"}`}
                                />
                              </button>
                              <span className="ml-2 text-[9px]">
                                {bill.autoPay ? "On" : "Off"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {reward && tab !== "Paid" ? (
                                <>
                                  <p>
                                    Up to{" "}
                                    {money.format((bill.amount * reward) / 100)}
                                  </p>
                                  <p className="mt-1 text-[9px] text-[#00a96b]">
                                    ({reward}%)
                                  </p>
                                </>
                              ) : (
                                <span className="text-[#7b879b]">
                                  {tab === "Paid" ? "Recorded" : "Not eligible"}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`rounded px-2.5 py-1.5 text-[9px] capitalize ${shownStatus.className}`}
                              >
                                {shownStatus.label}
                              </span>
                            </td>
                            {tab !== "Paid" && (
                              <td className="px-4 py-3">
                                <button
                                  disabled={
                                    !payableBills.some(
                                      (item) => item.id === bill.id,
                                    )
                                  }
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setCheckoutIds([bill.id]);
                                  }}
                                  className="h-9 whitespace-nowrap rounded-lg bg-[#009b67] px-4 text-[11px] font-semibold text-white hover:bg-[#007e54] disabled:opacity-50"
                                >
                                  Pay now
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {!visibleBills.length ? (
                  <div className="grid min-h-[250px] place-items-center p-8 text-center">
                    <div>
                      <FileText className="mx-auto text-[#c8d3cf]" size={34} />
                      <h3 className="mt-3 text-[13px] font-semibold">
                        No {tab.toLowerCase()} bills
                      </h3>
                      <p className="mt-2 text-[11px] text-[#7a879c]">
                        Adjust your filters or add a new bill.
                      </p>
                      <button
                        onClick={() => setModal({ mode: "add" })}
                        className="mx-auto mt-4 flex h-9 w-fit items-center rounded-md bg-[#00a96b] px-4 text-[10px] font-semibold text-white"
                      >
                        <Plus className="mr-2" size={15} /> Add Bill
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="flex items-center justify-between border-t border-[#e7ecea] px-4 py-3 text-[10px] text-[#718097]">
                <span>
                  Showing {visibleBills.length} of {bills.length} bills
                </span>
                <div className="flex items-center gap-2">
                  <button className="grid h-8 w-8 place-items-center rounded border border-[#dfe5e7]">
                    <ChevronLeft size={14} />
                  </button>
                  <span className="grid h-8 w-8 place-items-center rounded bg-[#00a96b] text-white">
                    1
                  </span>
                  <button className="grid h-8 w-8 place-items-center rounded border border-[#dfe5e7]">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-4 rounded-xl border border-[#bfe9d8] bg-linear-to-r from-[#f3fbf7] to-[#fbfefd] p-4 sm:flex-row sm:items-center">
              <span className="grid h-12 w-12 place-items-center rounded-full border-[5px] border-[#a9e3cd] bg-white text-[#00a96b]">
                <CircleDollarSign size={23} />
              </span>
              <div className="flex-1">
                <h2 className="text-[14px] font-bold">
                  Earn credits when you pay early
                </h2>
                <p className="mt-1 text-[11px] text-[#64718a]">
                  Pay up to 15 days early and earn up to 15% in credits on
                  eligible bills.
                </p>
              </div>
              <button
                onClick={() => setInfoModal("savings")}
                className="h-10 rounded-md border border-[#00a96b] px-5 text-[11px] font-semibold text-[#00a96b]"
              >
                How it works <ChevronRight className="ml-2 inline" size={14} />
              </button>
              <button
                onClick={() => setInfoModal("autopay")}
                className="h-10 rounded-md border border-[#d5e5df] bg-white px-5 text-[11px] font-semibold text-[#274b43]"
              >
                Autopay guide
              </button>
            </section>
          </div>

          <aside className="hidden">
            <section className="rounded-xl border border-[#e2e8e6] bg-white p-5 shadow-[0_7px_24px_rgba(25,55,47,0.04)]">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eaf8f2] text-[#00a96b]">
                  <TrendingUp size={19} />
                </span>
                <h2 className="text-[13px] font-bold">Maximize Your Savings</h2>
              </div>
              <p className="mt-4 text-[10px] leading-5 text-[#65728a]">
                Pay early and earn credits on eligible bills.
              </p>
              <div className="mt-3 divide-y divide-[#edf1ef]">
                {[
                  ["1 – 3 days early", "+2%"],
                  ["4 – 7 days early", "+5%"],
                  ["8 – 14 days early", "+10%"],
                  ["15+ days early", "+15%"],
                ].map(([label, reward]) => (
                  <div key={label} className="flex items-center gap-3 py-3.5">
                    <CalendarDays size={15} className="text-[#00a96b]" />
                    <span className="flex-1 text-[10px] font-medium">
                      {label}
                    </span>
                    <strong className="text-[14px] text-[#00a96b]">
                      {reward}
                    </strong>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-xl border border-[#e2e8e6] bg-white p-5 shadow-[0_7px_24px_rgba(25,55,47,0.04)]">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eaf8f2] text-[#00a96b]">
                  <RefreshCcw size={18} />
                </span>
                <h2 className="text-[13px] font-bold">Autopay Made Simple</h2>
              </div>
              <p className="mt-4 text-[10px] leading-5 text-[#65728a]">
                Never miss a payment. Autopay pays your bills on the due date.
              </p>
              <div className="mt-4 space-y-3 text-[10px] text-[#5f6d85]">
                <p className="flex gap-3">
                  <ShieldCheck size={15} className="text-[#00a96b]" /> It&apos;s
                  secure and convenient
                </p>
                <p className="flex gap-3">
                  <CircleDollarSign size={15} className="text-[#00a96b]" />{" "}
                  You&apos;ll still earn early-pay credits
                </p>
                <p className="flex gap-3">
                  <RefreshCcw size={15} className="text-[#00a96b]" /> Turn it on
                  or off anytime
                </p>
              </div>
            </section>
          </aside>
        </div>
      </div>
      {checkoutIds && user && (
        <BillPaymentModal
          bills={payableBills.filter((bill) => checkoutIds.includes(bill.id))}
          expectedBillCount={checkoutIds.length}
          user={user}
          onClose={() => setCheckoutIds(null)}
          onPaid={(message) => {
            setSelected(
              (current) =>
                new Set([...current].filter((id) => !checkoutIds.includes(id))),
            );
            setCheckoutIds(null);
            setPaymentMessage(message);
            setTab("Paid");
          }}
        />
      )}
      {modal && user?.id ? (
        <BillModal
          initialMode={modal.mode}
          bill={modal.bill}
          userId={user.id}
          onClose={() => setModal(null)}
        />
      ) : null}
      {infoModal ? (
        <InfoModal kind={infoModal} onClose={() => setInfoModal(null)} />
      ) : null}
    </>
  );
}

function InfoModal({
  kind,
  onClose,
}: {
  kind: "savings" | "autopay";
  onClose: () => void;
}) {
  const isSavings = kind === "savings";
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#07142d]/55 p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="bills-info-title"
        className="w-full max-w-[460px] rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#009b67]">
              Bills guide
            </p>
            <h2 id="bills-info-title" className="mt-1 text-[20px] font-bold">
              {isSavings ? "Maximize Your Savings" : "Autopay Made Simple"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full bg-[#f1f4f3]​"
          >
            ×
          </button>
        </div>
        {isSavings ? (
          <>
            <p className="mt-4 text-[12px] leading-5 text-[#65728a]">
              Pay eligible bills before their due date to earn Vuior credits.
            </p>
            <div className="mt-4 divide-y divide-[#edf1ef]">
              {[
                ["1–3 days early", "+2%"],
                ["4–7 days early", "+5%"],
                ["8–14 days early", "+10%"],
                ["15+ days early", "+15%"],
              ].map(([label, reward]) => (
                <div
                  key={label}
                  className="flex justify-between py-3 text-[12px]"
                >
                  <span>{label}</span>
                  <strong className="text-[#009b67]">{reward}</strong>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 text-[12px] leading-5 text-[#65728a]">
              Enable autopay for an individual bill and Vuior will charge it on
              the due date using your saved payment method.
            </p>
            <ul className="mt-4 space-y-3 text-[12px] text-[#53617a]">
              <li>• Turn it on or off anytime from the bill list.</li>
              <li>
                • Your payment method and transaction remain securely recorded.
              </li>
              <li>• Eligible early-pay rewards still apply when available.</li>
            </ul>
          </>
        )}
        <button
          onClick={onClose}
          className="mt-6 h-10 w-full rounded-lg bg-[#009b67] text-[12px] font-semibold text-white"
        >
          Got it
        </button>
      </section>
    </div>
  );
}

function Filter({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-md border border-[#dfe5e7] bg-white px-3 pr-8 text-[10px] text-[#34425d] outline-none focus:border-[#00a96b]"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-3 text-[#718097]"
      />
    </label>
  );
}

function MultiSelectFilter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
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
  const filtered = options.filter((item) =>
    item.toLowerCase().includes(search.trim().toLowerCase()),
  );
  return (
    <div ref={container} className="relative min-w-0">
      <button
        type="button"
        aria-label={`${label}: ${value.length ? `${value.length} selected` : `All ${label.toLowerCase()}s`}`}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-full items-center gap-2 rounded-md border border-[#dfe5e7] bg-white px-3 text-left text-[10px] text-[#344260]"
      >
        <SlidersHorizontal size={14} className="shrink-0 text-[#7b879b]" />
        <span className="min-w-0 flex-1 truncate">
          {value.length
            ? `${value.length} selected`
            : `All ${label.toLowerCase()}s`}
        </span>
        <ChevronDown size={14} className="text-[#718097]" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 max-h-72 w-full min-w-52 overflow-hidden rounded-lg border border-[#dfe5e7] bg-white shadow-lg">
          <label className="flex h-10 items-center gap-2 border-b border-[#edf1ef] px-3 text-[#7b879b]">
            <Search size={14} />
            <input
              autoFocus
              aria-label={`Search ${label.toLowerCase()}`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="min-w-0 flex-1 bg-transparent text-[12px] outline-none"
            />
          </label>
          <div className="max-h-56 overflow-y-auto p-1.5">
            <button
              type="button"
              onClick={() => onChange([])}
              className="flex w-full rounded-md px-2.5 py-2 text-left text-[11px] font-medium text-[#009b67] hover:bg-[#f0faf5]"
            >
              Clear selection · All providers
            </button>
            {filtered.map((option) => {
              const checked = value.includes(option);
              return (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-[11px] text-[#344260] hover:bg-[#f6f9f7]"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      onChange(
                        checked
                          ? value.filter((item) => item !== option)
                          : [...value, option],
                      )
                    }
                    className="accent-[#00a96b]"
                  />
                  <span className="truncate">{option}</span>
                </label>
              );
            })}
            {!filtered.length && (
              <p className="px-2.5 py-3 text-[11px] text-[#718097]">
                No matching providers.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
