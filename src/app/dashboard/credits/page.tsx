"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Copy,
  Gift,
  Send,
  Share2,
  Sparkles,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import WalletModal, {
  type WalletAction,
} from "@/components/credits/WalletModal";
import TransactionDetailsModal from "@/components/transactions/TransactionDetailsModal";
import { useVuiorSession } from "@/hooks/useVuiorSession";
import { type Transaction, useVuiorData } from "@/hooks/useVuiorData";

type Filter = "All" | "Earned" | "Redeemed" | "Referral";
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const tiers = [
  ["1 – 3 days early", "Pay 1–3 days before due date", "+2%"],
  ["4 – 7 days early", "Pay 4–7 days before due date", "+5%"],
  ["8 – 14 days early", "Pay 8–14 days before due date", "+10%"],
  ["15+ days early", "Pay 15 or more days before due date", "+15%"],
];

function creditKind(type: string, amount: number) {
  const value = type.toLowerCase();
  if (value.includes("referral")) return "Referral";
  if (amount < 0 || value.includes("sent") || value.includes("redeem"))
    return "Redeemed";
  return "Earned";
}

export default function CreditsPage() {
  const { user } = useVuiorSession();
  const { bills, transactions } = useVuiorData(user?.id);
  const [filter, setFilter] = useState<Filter>("All");
  const [copied, setCopied] = useState(false);
  const [walletAction, setWalletAction] = useState<WalletAction | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    const action = new URLSearchParams(window.location.search).get("wallet");
    if (action === "add" || action === "send") {
      window.history.replaceState({}, "", window.location.pathname);
      const timer = window.setTimeout(() => setWalletAction(action), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);
  const credits = Number(user?.availableCredits ?? 0);
  const thisMonth = new Date();
  const creditRows = useMemo(
    () =>
      transactions
        .filter((item) => item.credits !== 0)
        .map((item) => {
          const kind = creditKind(item.type, item.credits);
          return {
            ...item,
            kind,
            title:
              kind === "Referral"
                ? "Referral Bonus"
                : kind === "Redeemed"
                  ? "Credit Redemption"
                  : item.type.toLowerCase().includes("early")
                    ? "Early Payment Reward"
                    : "Bill Payment Reward",
          };
        }),
    [transactions],
  );
  const monthRows = creditRows.filter(
    (row) =>
      row.date.getMonth() === thisMonth.getMonth() &&
      row.date.getFullYear() === thisMonth.getFullYear(),
  );
  const earned = monthRows
    .filter((row) => row.credits > 0)
    .reduce((sum, row) => sum + row.credits, 0);
  const redeemed = Math.abs(
    monthRows
      .filter((row) => row.credits < 0)
      .reduce((sum, row) => sum + row.credits, 0),
  );
  const referral =
    creditRows
      .filter((row) => row.kind === "Referral")
      .reduce((sum, row) => sum + Math.max(0, row.credits), 0) ||
    Number(user?.referralBonus ?? 0);
  const visible =
    filter === "All"
      ? creditRows
      : creditRows.filter((row) => row.kind === filter);
  const referralCode =
    user?.referralCode || `VUIOR-${(user?.firstName || "USER").toUpperCase()}`;

  async function copyReferral() {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  async function shareReferral() {
    const text = `Join me on Vuior with referral code ${referralCode}`;
    if (navigator.share) await navigator.share({ title: "Join Vuior", text });
    else await navigator.clipboard.writeText(text);
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-382.5 p-5 sm:p-7 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[29px] font-bold tracking-[-.035em]">
              Credits
            </h1>
            <p className="mt-1 text-[13px] text-[#596885]">
              Track your earned credits, rewards, and redemption activity.
            </p>
          </div>
          <div className="flex gap-2 sm:mr-16">
            <button
              onClick={() => setWalletAction("send")}
              className="flex h-10 items-center gap-2 rounded-md border border-[#009b67] px-4 text-[10px] font-semibold text-[#009b67]"
            >
              <Send size={15} /> Send credits
            </button>
            <button
              onClick={() => setWalletAction("add")}
              className="flex h-10 items-center gap-2 rounded-md bg-[#009b67] px-4 text-[10px] font-semibold text-white"
            >
              <WalletCards size={15} /> Add funds
            </button>
          </div>
        </div>
        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            [
              "Available Credits",
              credits.toLocaleString(),
              `≈ ${money.format(credits / 100)} value`,
              CircleDollarSign,
            ],
            [
              "Credits Earned This Month",
              `+${earned.toLocaleString()}`,
              "From eligible payments",
              Sparkles,
            ],
            [
              "Redeemed This Month",
              `-${redeemed.toLocaleString()}`,
              "Applied to bill payments",
              Gift,
            ],
            [
              "Referral Bonus",
              `+${referral.toLocaleString()}`,
              "Total earned",
              UsersRound,
            ],
          ].map(([label, value, note, Icon]) => {
            const I = Icon as typeof Gift;
            return (
              <article
                key={String(label)}
                className="flex min-h-27.5 items-center rounded-xl border border-[#e1e8e5] bg-white p-5 shadow-[0_7px_24px_rgba(25,55,47,.035)]"
              >
                <div className="flex-1">
                  <p className="text-[11px] font-medium">{label as string}</p>
                  <strong className="mt-2 block text-[23px]">
                    {value as string}
                  </strong>
                  <p className="mt-2 text-[10px] text-[#00a36a]">
                    {note as string}
                  </p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#edf8f4] text-[#009b67]">
                  <I size={23} />
                </span>
              </article>
            );
          })}
        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_385px]">
          <div className="min-w-0 space-y-5">
            <section className="overflow-hidden rounded-xl border border-[#e1e8e5] bg-white shadow-[0_7px_24px_rgba(25,55,47,.035)]">
              <div className="flex flex-col gap-4 border-b border-[#e7ecea] p-5 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-[15px] font-bold">Credits History</h2>
                <div className="flex overflow-hidden rounded-md border border-[#dfe6e4]">
                  {(["All", "Earned", "Redeemed", "Referral"] as Filter[]).map(
                    (item) => (
                      <button
                        onClick={() => setFilter(item)}
                        key={item}
                        className={`h-9 px-4 text-[10px] font-semibold ${filter === item ? "bg-[#eef9f5] text-[#009b67] ring-1 ring-inset ring-[#00a96b]" : "text-[#44516c]"}`}
                      >
                        {item}
                      </button>
                    ),
                  )}
                </div>
              </div>
              <div>
                <div className="divide-y divide-[#ebefed] lg:hidden">
                  {visible.slice(0, 7).map((row) => (
                    <article
                      key={row.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedTransaction(row)}
                      onKeyDown={(event) =>
                        (event.key === "Enter" || event.key === " ") &&
                        setSelectedTransaction(row)
                      }
                      className="cursor-pointer p-4 hover:bg-[#f7fbf9]"
                    >
                      <div className="flex items-start gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#eef8f4] text-[#00a36a]">
                          {row.kind === "Referral" ? (
                            <UsersRound size={16} />
                          ) : row.kind === "Redeemed" ? (
                            <Gift size={16} />
                          ) : (
                            <CalendarDays size={16} />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[11px] font-semibold">
                            {row.title}
                          </p>
                          <p className="mt-1 truncate text-[9px] text-[#718097]">
                            {row.reference || row.label}
                          </p>
                        </div>
                        <p
                          className={`text-[13px] font-bold ${row.credits > 0 ? "text-[#009b67]" : "text-[#14203e]"}`}
                        >
                          {row.credits > 0 ? "+" : ""}
                          {row.credits.toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between pl-12">
                        <div>
                          <p className="text-[10px] text-[#53617a]">
                            {row.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="mt-1 text-[9px] text-[#8a95a6]">
                            {row.date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-[#eef8f4] px-2 py-1 text-[9px] text-[#008e61]">
                            {row.kind}
                          </span>
                          <span className="text-[9px] text-[#008e61]">
                            Completed
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-185 border-collapse text-left">
                    <thead className="bg-[#f8faf9] text-[9px] text-[#53617a]">
                      <tr>
                        {[
                          "Source",
                          "Date",
                          "Credits",
                          "Type",
                          "Status",
                          "Action",
                        ].map((h) => (
                          <th className="px-5 py-3 font-semibold" key={h}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebefed]">
                      {visible.slice(0, 7).map((row) => (
                        <tr
                          key={row.id}
                          onClick={() => setSelectedTransaction(row)}
                          className="cursor-pointer text-[10px] hover:bg-[#f7fbf9]"
                        >
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#eef8f4] text-[#00a36a]">
                                {row.kind === "Referral" ? (
                                  <UsersRound size={15} />
                                ) : row.kind === "Redeemed" ? (
                                  <Gift size={15} />
                                ) : (
                                  <CalendarDays size={15} />
                                )}
                              </span>
                              <div>
                                <b>{row.title}</b>
                                <p className="mt-1 text-[9px] text-[#718097]">
                                  {row.reference || row.label}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-[#53617a]">
                            {row.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                            <small className="mt-1 block">
                              {row.date.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </small>
                          </td>
                          <td
                            className={`px-5 py-3 font-semibold ${row.credits > 0 ? "text-[#009b67]" : "text-[#14203e]"}`}
                          >
                            {row.credits > 0 ? "+" : ""}
                            {row.credits.toFixed(2)}
                          </td>
                          <td className="px-5 py-3">
                            <span className="rounded bg-[#eef8f4] px-2 py-1 text-[9px] text-[#008e61]">
                              {row.kind}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-[#008e61]">
                            Completed
                          </td>
                          <td className="px-5 py-3 text-[#008e61]">
                            View details
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!visible.length && (
                  <div className="grid min-h-62.5 place-items-center p-6 text-center">
                    <div>
                      <Sparkles className="mx-auto text-[#b9cbc5]" />
                      <p className="mt-3 text-[12px] font-semibold">
                        No credit activity yet
                      </p>
                      <p className="mt-1 text-[10px] text-[#718097]">
                        Pay an eligible bill early to earn your first credits.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center gap-3 border-t border-[#e7ecea] py-3">
                <button
                  aria-label="Previous page"
                  className="grid h-8 w-8 place-items-center text-[#8a95a7]"
                >
                  <ChevronLeft size={14} />
                </button>
                <button className="grid h-8 w-8 place-items-center rounded bg-[#009b67] text-[10px] text-white">
                  1
                </button>
                <button className="grid h-8 w-8 place-items-center rounded border border-[#dfe6e4] text-[10px]">
                  2
                </button>
                <button
                  aria-label="Next page"
                  className="grid h-8 w-8 place-items-center rounded border border-[#dfe6e4]"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </section>
            <section className="rounded-xl border border-[#e1e8e5] bg-white p-5 shadow-[0_7px_24px_rgba(25,55,47,.035)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[14px] font-bold">Credits Overview</h2>
                  <p className="mt-1 text-[9px] text-[#65728a]">
                    Credits earned over time
                  </p>
                </div>
                <span className="rounded-md border border-[#dfe6e4] px-3 py-2 text-[9px]">
                  This Month
                </span>
              </div>
              <svg
                viewBox="0 0 720 150"
                className="mt-4 h-38.75 w-full"
                role="img"
                aria-label="Credits earned chart"
              >
                <defs>
                  <linearGradient id="creditFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#00a36a" stopOpacity=".18" />
                    <stop offset="1" stopColor="#00a36a" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[25, 70, 115].map((y) => (
                  <line
                    key={y}
                    x1="30"
                    x2="705"
                    y1={y}
                    y2={y}
                    stroke="#e8eeeb"
                  />
                ))}
                <path
                  d="M30 132 C85 118 105 105 155 96 S235 82 275 65 S350 45 395 38 S475 30 520 36 S620 50 705 20 L705 140 L30 140Z"
                  fill="url(#creditFill)"
                />
                <path
                  d="M30 132 C85 118 105 105 155 96 S235 82 275 65 S350 45 395 38 S475 30 520 36 S620 50 705 20"
                  fill="none"
                  stroke="#009b67"
                  strokeWidth="2"
                />
              </svg>
            </section>
          </div>
          <aside className="space-y-5">
            <section className="rounded-xl border border-[#e1e8e5] bg-white p-5">
              <h2 className="text-[14px] font-bold">
                How to earn more credits
              </h2>
              <div className="mt-2 divide-y divide-[#ebefed]">
                {tiers.map(([title, note, reward]) => (
                  <div className="flex items-center gap-3 py-3" key={title}>
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef8f4] text-[#00a36a]">
                      <CalendarDays size={19} />
                    </span>
                    <div className="flex-1">
                      <b className="text-[10px]">{title}</b>
                      <p className="mt-1 text-[9px] text-[#65728a]">{note}</p>
                    </div>
                    <strong className="text-[15px] text-[#009b67]">
                      {reward}
                    </strong>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-xl border border-[#e1e8e5] bg-white p-5">
              <h2 className="text-[14px] font-bold">Referral & Rewards</h2>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#eef8f4] text-[#00a36a]">
                  <UsersRound size={24} />
                </span>
                <p className="text-[10px] leading-4">
                  Invite friends and earn credits when they pay their first
                  bill.
                </p>
              </div>
              <label className="mt-4 block text-[10px] text-[#65728a]">
                Your referral code
              </label>
              <button
                onClick={copyReferral}
                className="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-[#dfe6e4] px-4 text-[12px] font-semibold"
              >
                <span>{copied ? "Copied!" : referralCode}</span>
                <Copy size={15} />
              </button>
              <div className="mt-3 flex justify-between text-[10px]">
                <span className="text-[#65728a]">Bonus earned</span>
                <b className="text-[#009b67]">
                  +{referral.toLocaleString()} credits
                </b>
              </div>
              <button
                onClick={shareReferral}
                className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#009b67] text-[10px] font-semibold text-white"
              >
                <Share2 size={15} /> Share referral code
              </button>
            </section>
            <section className="rounded-xl border border-[#e1e8e5] bg-white p-5">
              <h2 className="text-[14px] font-bold">Use your credits</h2>
              <p className="mt-1 text-[10px] text-[#65728a]">
                Apply your credits to reduce your bill payments.
              </p>
              <div className="mt-3 space-y-3 text-[10px]">
                <p className="flex gap-3">
                  <UserRound size={16} className="text-[#00a36a]" /> Apply to
                  eligible bills
                </p>
                <p className="flex gap-3">
                  <Sparkles size={16} className="text-[#00a36a]" /> No minimum
                  credit balance
                </p>
              </div>
              <Link
                href="/dashboard/bills"
                className="mt-4 flex h-10 items-center justify-center rounded-md bg-[#009b67] text-[10px] font-semibold text-white"
              >
                Apply credits
              </Link>
            </section>
          </aside>
        </div>
      </div>
      {walletAction && user?.id ? (
        <WalletModal
          initialAction={walletAction}
          userId={user.id}
          available={credits}
          onClose={() => setWalletAction(null)}
        />
      ) : null}
      {selectedTransaction ? (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          bills={bills}
          onClose={() => setSelectedTransaction(null)}
        />
      ) : null}
    </DashboardShell>
  );
}
