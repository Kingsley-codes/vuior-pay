"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
  Sparkles,
  TrendingUp,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { db } from "@/auth/firebase";
import { useVuiorSession } from "@/hooks/useVuiorSession";
import { useVuiorData } from "@/hooks/useVuiorData";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
type Tab = "Upcoming" | "Scheduled" | "Paid" | "Overdue";

function dueDays(value: string) {
  const due = new Date(value);
  if (Number.isNaN(due.getTime())) return 0;
  const now = new Date(); now.setHours(0, 0, 0, 0); due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - now.getTime()) / 86400000);
}

function rewardFor(days: number) { return days >= 15 ? 15 : days >= 8 ? 10 : days >= 4 ? 5 : days >= 1 ? 2 : 0; }

export default function BillsPage() {
  const { user } = useVuiorSession();
  const { bills, activeBills } = useVuiorData(user?.id);
  const [tab, setTab] = useState<Tab>("Upcoming");
  const [category, setCategory] = useState("All Categories");
  const [frequency, setFrequency] = useState("All Frequencies");
  const [status, setStatus] = useState("All Statuses");
  const [search, setSearch] = useState("");

  const categories = ["All Categories", ...Array.from(new Set(bills.map((bill) => bill.category))).filter(Boolean)];
  const frequencies = ["All Frequencies", ...Array.from(new Set(bills.map((bill) => bill.frequency))).filter(Boolean)];
  const now = new Date();
  const dueThisMonth = activeBills.filter((bill) => { const d = new Date(bill.dueDate); return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth(); });

  const visibleBills = useMemo(() => bills.filter((bill) => {
    const billStatus = bill.status.toLowerCase();
    const days = dueDays(bill.dueDate);
    const matchesTab = tab === "Upcoming" ? ["active", "upcoming"].includes(billStatus) && days >= 0 : tab === "Scheduled" ? bill.autoPay && ["active", "upcoming"].includes(billStatus) : tab === "Paid" ? ["paid", "completed"].includes(billStatus) : days < 0 && !["paid", "completed"].includes(billStatus);
    return matchesTab && (category === "All Categories" || bill.category === category) && (frequency === "All Frequencies" || bill.frequency === frequency) && (status === "All Statuses" || billStatus === status.toLowerCase()) && `${bill.name} ${bill.category}`.toLowerCase().includes(search.toLowerCase());
  }).sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate)), [bills, category, frequency, search, status, tab]);

  async function toggleAutopay(id: string, enabled: boolean) {
    await updateDoc(doc(db, "bills", id), { autoPay: enabled });
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1530px] p-5 sm:p-7 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h1 className="text-[29px] font-bold tracking-[-0.035em]">Bills</h1><p className="mt-1.5 text-[13px] text-[#596885]">Manage your recurring bills, due dates, and early-payment rewards.</p></div><label className="flex h-11 w-full max-w-[390px] items-center rounded-lg border border-[#dfe5e7] bg-white px-4 text-[#75829a]"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search bills by name or category…" className="min-w-0 flex-1 bg-transparent text-[12px] outline-none" /><Search size={18} /></label></div>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Active Bills", String(activeBills.length), `Across ${new Set(activeBills.map((b) => b.category)).size} categories`, FileText],
            ["Due This Month", String(dueThisMonth.length), money.format(dueThisMonth.reduce((sum, b) => sum + b.amount, 0)), CalendarDays],
            ["Autopay Enabled", String(activeBills.filter((b) => b.autoPay).length), `Of ${activeBills.length} bills`, RefreshCcw],
            ["Available Credits", money.format(Number(user?.availableCredits ?? 0)), "Ready to redeem", Sparkles],
          ].map(([label, value, note, Icon]) => { const IconComponent = Icon as typeof FileText; return <article key={String(label)} className="flex min-h-[130px] items-center gap-4 rounded-xl border border-[#e2e8e6] bg-white p-5 shadow-[0_7px_24px_rgba(25,55,47,0.04)]"><span className="grid h-14 w-14 place-items-center rounded-full bg-[#eaf8f2] text-[#00a96b]"><IconComponent size={27} /></span><div><p className="text-[12px] text-[#53637f]">{label as string}</p><strong className="mt-1.5 block text-[25px]">{value as string}</strong><p className="mt-1.5 text-[11px] text-[#64718a]">{note as string}</p></div></article>; })}
        </section>

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_292px]">
          <div className="min-w-0 space-y-5">
            <section className="flex flex-col gap-4 rounded-xl border border-[#bfe9d8] bg-linear-to-r from-[#f3fbf7] to-[#fbfefd] p-4 sm:flex-row sm:items-center"><span className="grid h-12 w-12 place-items-center rounded-full border-[5px] border-[#a9e3cd] bg-white text-[#00a96b]"><CircleDollarSign size={23} /></span><div className="flex-1"><h2 className="text-[14px] font-bold">Earn credits when you pay early</h2><p className="mt-1 text-[11px] text-[#64718a]">Pay up to 15 days early and earn up to 15% in credits on eligible bills.</p></div><button className="h-10 rounded-md border border-[#00a96b] px-5 text-[11px] font-semibold text-[#00a96b]">How it works <ChevronRight className="ml-2 inline" size={14} /></button></section>

            <section className="overflow-hidden rounded-xl border border-[#e2e8e6] bg-white shadow-[0_7px_24px_rgba(25,55,47,0.04)]">
              <div className="flex overflow-x-auto border-b border-[#e7ecea] px-3 sm:px-5">{(["Upcoming", "Scheduled", "Paid", "Overdue"] as Tab[]).map((item) => <button key={item} onClick={() => setTab(item)} className={`h-14 shrink-0 border-b-2 px-4 text-[12px] font-semibold ${tab === item ? "border-[#00a96b] text-[#00a96b]" : "border-transparent text-[#344260]"}`}>{item}</button>)}</div>
              <div className="grid gap-3 border-b border-[#e7ecea] p-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]">
                <Filter value={category} onChange={setCategory} options={categories} />
                <Filter value={frequency} onChange={setFrequency} options={frequencies} />
                <Filter value={status} onChange={setStatus} options={["All Statuses", "Active", "Paid", "Completed"]} />
                <Link href="/dashboard/bills/add-bills" className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#00a96b] px-5 text-[11px] font-semibold text-white"><Plus size={17} /> Add Bill</Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] border-collapse text-left">
                  <thead className="bg-[#f7f9f8] text-[10px] text-[#34425d]"><tr>{["Bill & Category", "Due Date", "Amount", "Autopay", "Early-Pay Reward", "Status", "Actions"].map((head) => <th key={head} className="px-4 py-3.5 font-semibold">{head}</th>)}</tr></thead>
                  <tbody className="divide-y divide-[#e9eeec]">
                    {visibleBills.map((bill) => { const days = dueDays(bill.dueDate); const reward = rewardFor(days); return <tr key={bill.id} className="text-[11px] hover:bg-[#fbfdfc]"><td className="px-4 py-3"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#eef8f4] text-[#00a96b]"><FileText size={16} /></span><div><p className="font-semibold">{bill.name}</p><p className="mt-1 text-[9px] text-[#7b879b]">{bill.category}</p></div></div></td><td className="px-4 py-3"><p className="font-medium">{bill.dueDate ? new Date(bill.dueDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "—"}</p><p className={`mt-1 text-[9px] ${days < 0 ? "text-[#e04444]" : "text-[#7b879b]"}`}>{days < 0 ? `${Math.abs(days)} days overdue` : days === 0 ? "Due today" : `In ${days} days`}</p></td><td className="px-4 py-3 font-semibold">{money.format(bill.amount)}</td><td className="px-4 py-3"><button onClick={() => toggleAutopay(bill.id, !bill.autoPay)} aria-label={`Turn autopay ${bill.autoPay ? "off" : "on"}`} className={`relative h-5 w-9 rounded-full transition ${bill.autoPay ? "bg-[#00a96b]" : "bg-[#dfe5e8]"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${bill.autoPay ? "left-[18px]" : "left-0.5"}`} /></button><span className="ml-2 text-[9px]">{bill.autoPay ? "On" : "Off"}</span></td><td className="px-4 py-3">{reward ? <><p>Up to {money.format(bill.amount * reward / 100)}</p><p className="mt-1 text-[9px] text-[#00a96b]">({reward}%)</p></> : <span className="text-[#7b879b]">Not eligible</span>}</td><td className="px-4 py-3"><span className={`rounded px-2.5 py-1.5 text-[9px] capitalize ${days < 0 ? "bg-[#ffe9e9] text-[#db3d3d]" : "bg-[#e9f8f1] text-[#009a61]"}`}>{days < 0 ? "Overdue" : bill.status}</span></td><td className="px-4 py-3"><button className="h-8 rounded-md border border-[#bfe9d8] px-3 text-[9px] font-semibold text-[#00a96b]">Pay now</button></td></tr>; })}
                  </tbody>
                </table>
                {!visibleBills.length ? <div className="grid min-h-[250px] place-items-center p-8 text-center"><div><FileText className="mx-auto text-[#c8d3cf]" size={34} /><h3 className="mt-3 text-[13px] font-semibold">No {tab.toLowerCase()} bills</h3><p className="mt-2 text-[11px] text-[#7a879c]">Adjust your filters or add a new bill.</p><Link href="/dashboard/bills/add-bills" className="mx-auto mt-4 flex h-9 w-fit items-center rounded-md bg-[#00a96b] px-4 text-[10px] font-semibold text-white"><Plus className="mr-2" size={15} /> Add Bill</Link></div></div> : null}
              </div>
              <div className="flex items-center justify-between border-t border-[#e7ecea] px-4 py-3 text-[10px] text-[#718097]"><span>Showing {visibleBills.length} of {bills.length} bills</span><div className="flex items-center gap-2"><button className="grid h-8 w-8 place-items-center rounded border border-[#dfe5e7]"><ChevronLeft size={14} /></button><span className="grid h-8 w-8 place-items-center rounded bg-[#00a96b] text-white">1</span><button className="grid h-8 w-8 place-items-center rounded border border-[#dfe5e7]"><ChevronRight size={14} /></button></div></div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-xl border border-[#e2e8e6] bg-white p-5 shadow-[0_7px_24px_rgba(25,55,47,0.04)]"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#eaf8f2] text-[#00a96b]"><TrendingUp size={19} /></span><h2 className="text-[13px] font-bold">Maximize Your Savings</h2></div><p className="mt-4 text-[10px] leading-5 text-[#65728a]">Pay early and earn credits on eligible bills.</p><div className="mt-3 divide-y divide-[#edf1ef]">{[["1 – 3 days early", "+2%"], ["4 – 7 days early", "+5%"], ["8 – 14 days early", "+10%"], ["15+ days early", "+15%"]].map(([label, reward]) => <div key={label} className="flex items-center gap-3 py-3.5"><CalendarDays size={15} className="text-[#00a96b]" /><span className="flex-1 text-[10px] font-medium">{label}</span><strong className="text-[14px] text-[#00a96b]">{reward}</strong></div>)}</div></section>
            <section className="rounded-xl border border-[#e2e8e6] bg-white p-5 shadow-[0_7px_24px_rgba(25,55,47,0.04)]"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#eaf8f2] text-[#00a96b]"><RefreshCcw size={18} /></span><h2 className="text-[13px] font-bold">Autopay Made Simple</h2></div><p className="mt-4 text-[10px] leading-5 text-[#65728a]">Never miss a payment. Autopay pays your bills on the due date.</p><div className="mt-4 space-y-3 text-[10px] text-[#5f6d85]"><p className="flex gap-3"><ShieldCheck size={15} className="text-[#00a96b]" /> It&apos;s secure and convenient</p><p className="flex gap-3"><CircleDollarSign size={15} className="text-[#00a96b]" /> You&apos;ll still earn early-pay credits</p><p className="flex gap-3"><RefreshCcw size={15} className="text-[#00a96b]" /> Turn it on or off anytime</p></div></section>
          </aside>
        </div>
      </div>
    </DashboardShell>
  );
}

function Filter({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="relative"><select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full appearance-none rounded-md border border-[#dfe5e7] bg-white px-3 pr-8 text-[10px] text-[#34425d] outline-none focus:border-[#00a96b]">{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-3 text-[#718097]" /></label>;
}
