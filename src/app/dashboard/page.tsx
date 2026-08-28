"use client";

import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarCheck2,
  CircleDollarSign,
  Coins,
  FilePlus2,
  FileText,
  History,
  Plus,
  UsersRound,
  WalletCards,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import NotificationsMenu from "@/components/dashboard/NotificationsMenu";
import { useVuiorSession } from "@/hooks/useVuiorSession";
import { type Bill, useVuiorData } from "@/hooks/useVuiorData";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function daysUntil(value: string) {
  const due = new Date(value);
  if (Number.isNaN(due.getTime())) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - today.getTime()) / 86400000);
}

function BillIcon({ bill }: { bill: Bill }) {
  const palette = bill.category.toLowerCase().includes("internet")
    ? "bg-[#f2eaff] text-[#8849ef]"
    : bill.category.toLowerCase().includes("water")
      ? "bg-[#e8f3ff] text-[#2c82ef]"
      : bill.category.toLowerCase().includes("insurance")
        ? "bg-[#e9f9f1] text-[#00a96b]"
        : "bg-[#fff3df] text-[#f59e0b]";
  return <span className={`grid h-9 w-9 place-items-center rounded-full ${palette}`}><FileText size={17} /></span>;
}

export default function DashboardPage() {
  const { user } = useVuiorSession();
  const { activeBills, transactions, walletBalance } = useVuiorData(user?.id);
  const upcoming = [...activeBills].sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate));
  const unpaidTotal = activeBills.reduce((sum, bill) => sum + bill.amount, 0);
  const credits = Number(user?.availableCredits ?? 0);
  const successfulPayments = transactions.filter((item) => ["success", "successful", "completed", "paid"].includes(item.status.toLowerCase()));
  const firstName = user?.firstName || "there";

  const stats = [
    { title: "Available Balance", value: money.format(walletBalance), note: "Your Vuior wallet", icon: WalletCards },
    { title: "Total Unpaid Bills", value: money.format(unpaidTotal), note: `${activeBills.length} active bill${activeBills.length === 1 ? "" : "s"}`, icon: FileText },
    { title: "Available Credits", value: credits.toLocaleString(), note: "Ready to redeem", icon: Coins },
    { title: "Payments This Month", value: String(successfulPayments.length), note: successfulPayments.length ? "Completed successfully" : "No payments yet", icon: CalendarCheck2 },
  ];

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1530px] p-5 sm:p-7 lg:p-8">
        <div className="flex items-start justify-between gap-4"><div><h1 className="text-[27px] font-bold tracking-[-0.035em] text-[#0d1b42] sm:text-[30px]">Dashboard</h1><p className="mt-1.5 text-[13px] text-[#596885]">Welcome back, {firstName}. Track your bills, payments, credits, and savings in one place.</p></div><NotificationsMenu userId={user?.id} /></div>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ title, value, note, icon: Icon }) => (
            <article key={title} className="flex min-h-[136px] items-center gap-4 rounded-xl border border-[#e2e8e6] bg-white p-5 shadow-[0_7px_24px_rgba(25,55,47,0.045)]">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#eaf8f2] text-[#00a96b]"><Icon size={27} strokeWidth={1.8} /></span>
              <div><p className="text-[12px] text-[#53637f]">{title}</p><strong className="mt-2 block text-[25px] tracking-[-0.035em]">{value}</strong><p className="mt-2 text-[11px] text-[#61708a]">{note}</p></div>
            </article>
          ))}
        </section>

        <section className="mt-5 rounded-xl border border-[#e2e8e6] bg-white p-5 shadow-[0_7px_24px_rgba(25,55,47,0.035)]">
          <h2 className="text-[16px] font-bold">Quick Actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[{ label: "Add Funds", href: "/dashboard/credits?wallet=add", icon: Plus }, { label: "Pay Bills", href: "/dashboard/pay", icon: CircleDollarSign }, { label: "Create Bill", href: "/dashboard/bills?addBill=1", icon: FilePlus2 }, { label: "Transactions", href: "/dashboard/credits", icon: History }].map(({ label, href, icon: Icon }) => (
              <Link key={label} href={href} className="flex h-[74px] items-center justify-center gap-5 rounded-lg border border-[#dfe6e4] text-[13px] font-semibold transition hover:border-[#00a96b] hover:bg-[#f5fcf9]"><Icon className="text-[#00a96b]" size={27} />{label}</Link>
            ))}
          </div>
        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.05fr_1.12fr_.85fr]">
          <section className="rounded-xl border border-[#e2e8e6] bg-white p-5 shadow-[0_7px_24px_rgba(25,55,47,0.035)]">
            <div className="flex items-center justify-between"><h2 className="text-[15px] font-bold">Upcoming Bills</h2><Link className="text-[12px] font-semibold text-[#00a96b]" href="/dashboard/bills">View all</Link></div>
            <div className="mt-3 divide-y divide-[#edf1ef]">
              {upcoming.slice(0, 4).map((bill) => { const days = daysUntil(bill.dueDate); return (
                <div key={bill.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3.5"><BillIcon bill={bill} /><div className="min-w-0"><p className="truncate text-[12px] font-semibold">{bill.name}</p><p className="mt-1 text-[10px] text-[#758199]">{days < 0 ? `${Math.abs(days)} days overdue` : days === 0 ? "Due today" : `Due in ${days} days`}</p></div><div className="text-right"><p className="text-[12px] font-semibold">{money.format(bill.amount)}</p><span className={`mt-1 inline-block rounded px-2 py-1 text-[9px] ${days <= 3 ? "bg-[#fff1e5] text-[#e87912]" : "bg-[#e9f8f1] text-[#009a61]"}`}>{days <= 3 ? "Due soon" : "Upcoming"}</span></div></div>
              ); })}
              {!upcoming.length ? <Empty message="No upcoming bills. Add your first bill to begin." /> : null}
            </div>
            {upcoming.length ? <Link href="/dashboard/bills" className="ml-auto mt-4 flex h-9 w-fit items-center justify-center rounded-md bg-[#00a96b] px-6 text-[11px] font-semibold text-white">Pay bills</Link> : null}
          </section>

          <section className="rounded-xl border border-[#e2e8e6] bg-white p-5 shadow-[0_7px_24px_rgba(25,55,47,0.035)]">
            <div className="flex items-center justify-between"><h2 className="text-[15px] font-bold">Recent Transactions</h2><span className="text-[12px] font-semibold text-[#00a96b]">Latest activity</span></div>
            <div className="mt-3 divide-y divide-[#edf1ef]">
              {transactions.slice(0, 5).map((item) => { const incoming = item.type.toLowerCase().includes("fund") || item.amount < 0; const ok = ["success", "successful", "completed", "paid"].includes(item.status.toLowerCase()); return (
                <div key={item.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3.5"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#eaf8f2] text-[#00a96b]">{incoming ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}</span><div className="min-w-0"><p className="truncate text-[11px] font-semibold">{item.label}</p><p className="mt-1 text-[9px] text-[#78849a]">{item.date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</p></div><div className="text-right"><p className="text-[11px] font-semibold">{incoming ? "+" : "-"}{money.format(Math.abs(item.amount))}</p><span className={`mt-1 inline-block rounded px-2 py-1 text-[9px] ${ok ? "bg-[#e9f8f1] text-[#009a61]" : "bg-[#ffe9e9] text-[#e04444]"}`}>{ok ? "Success" : item.status}</span></div></div>
              ); })}
              {!transactions.length ? <Empty message="Your completed payments will appear here." /> : null}
            </div>
          </section>

          <section className="rounded-xl border border-[#e2e8e6] bg-white p-5 shadow-[0_7px_24px_rgba(25,55,47,0.035)]"><h2 className="text-[14px] font-bold">Referral & Credits</h2><div className="mt-5 flex items-center gap-4"><span className="grid h-14 w-14 place-items-center rounded-full bg-[#eaf8f2] text-[#00a96b]"><UsersRound size={27}/></span><div className="min-w-0 flex-1"><p className="text-[9px] text-[#65728a]">Your Referral Code</p><div className="mt-2 truncate rounded-md bg-[#eaf8f2] px-4 py-2 text-[15px] font-bold text-[#00a96b]">{user?.referralCode || `VUIOR-${(user?.firstName || "USER").toUpperCase()}`}</div></div></div><div className="mt-5 flex items-end justify-between"><div><p className="text-[9px] text-[#65728a]">Total Referral Bonus</p><strong className="mt-1 block text-[16px] text-[#00a96b]">{money.format(Number(user?.referralBonus ?? 0))}</strong></div><Link href="/dashboard/referrals" className="flex h-9 items-center rounded-md border border-[#00a96b] px-5 text-[10px] font-semibold text-[#00a96b]">Share code</Link></div></section>
        </div>
      </div>
    </DashboardShell>
  );
}

function Empty({ message }: { message: string }) {
  return <div className="flex min-h-[150px] flex-col items-center justify-center text-center"><FileText className="mb-3 text-[#c8d3cf]" size={30} /><p className="max-w-[220px] text-[11px] leading-5 text-[#7a879c]">{message}</p></div>;
}
