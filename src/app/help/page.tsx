"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, CircleHelp, CreditCard, FileText, Headphones, Search, ShieldCheck, Sparkles } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";

const topics = ["All Topics", "Getting Started", "Bills & Payments", "Credits & Rewards", "Account & Security", "Other"] as const;
type Topic = typeof topics[number];
const faqs = [
  ["What is Vuior?", "Vuior is a smart way to pay your bills, earn rewards, and stay on top of your finances. You can pay for utilities, internet, TV, and more—all in one secure platform.", "Getting Started"],
  ["How do I create an account on Vuior?", "Choose Create free account, enter your details, and verify the one-time code sent to your email.", "Getting Started"],
  ["How do I fund my Vuior wallet?", "Open your wallet or choose Add Funds on the dashboard, enter an amount, and complete the secure payment flow.", "Bills & Payments"],
  ["What types of bills can I pay?", "You can manage utilities, internet, phone, insurance, subscriptions, housing, education, and other recurring bills.", "Bills & Payments"],
  ["How do I earn credits?", "Credits are applied after an eligible early bill payment is verified. Paying 15 or more days early can earn up to 15%.", "Credits & Rewards"],
  ["How does the referral program work?", "Share your unique code. When your friend joins and becomes an eligible verified bill payer, you both receive referral credits.", "Credits & Rewards"],
  ["Can I schedule my bill payments?", "Yes. Enable autopay for an active bill or choose a future payment date during the payment flow.", "Bills & Payments"],
  ["What happens if a payment fails?", "You will be notified immediately and can retry the payment or update your payment method.", "Bills & Payments"],
  ["How do I contact customer support?", "Use the Contact support button below or email info@vuior.com. The support team is available Monday–Friday, 9am–6pm EST.", "Other"],
  ["Is Vuior available on mobile?", "Yes. The Vuior mobile app provides bills, payments, credits, referrals, account, and support features on the go.", "Other"],
  ["How do I delete my account?", "Contact support from your registered email. We will verify your request before securely closing the account.", "Account & Security"],
] as const;

export default function HelpPage() {
  const [topic, setTopic] = useState<Topic>("All Topics");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(0);
  const filtered = useMemo(() => faqs.filter(([question, answer, category]) => (topic === "All Topics" || category === topic) && `${question} ${answer}`.toLowerCase().includes(search.toLowerCase())), [topic, search]);

  return <DashboardShell><div className="bg-white">
    <section className="relative overflow-hidden border-b border-[#edf1ef] bg-linear-to-r from-white via-white to-[#f0faf6] px-5 py-10 sm:px-10 lg:px-12 lg:py-12">
      <div className="max-w-[1040px]"><p className="text-[12px] font-semibold text-[#009b67]">FAQ</p><h1 className="mt-3 text-[34px] font-bold tracking-[-.04em] sm:text-[38px]">Frequently asked questions</h1><p className="mt-4 max-w-[430px] text-[14px] leading-7 text-[#596885]">Find answers to the most common questions about using Vuior.</p><label className="mt-8 flex h-12 max-w-[550px] items-center gap-3 rounded-lg border border-[#dfe6e4] bg-white px-4 shadow-[0_8px_24px_rgba(25,55,47,.05)]"><Search size={18} className="text-[#63728d]"/><input value={search} onChange={e => setSearch(e.target.value)} className="min-w-0 flex-1 bg-transparent text-[12px] outline-none" placeholder="Search for answers..."/></label></div>
      <div className="pointer-events-none absolute right-[7%] top-8 hidden h-44 w-72 lg:block"><div className="absolute left-0 top-14 h-20 w-44 rounded-2xl border border-[#bce7d6] bg-white shadow-sm"/><div className="absolute right-0 top-8 h-28 w-40 rounded-2xl border border-[#bce7d6] bg-white shadow-sm"/><div className="absolute left-20 top-0 grid h-24 w-24 place-items-center rounded-full bg-linear-to-br from-[#00b97b] to-[#007c59] text-6xl font-bold text-white shadow-xl">?</div><div className="absolute bottom-0 right-0 grid h-14 w-14 place-items-center rounded-full bg-[#298b72] text-white">•••</div></div>
    </section>
    <div className="mx-auto max-w-[1150px] px-5 py-8 lg:px-8">
      <div className="flex gap-3 overflow-x-auto pb-2">{topics.map(item => <button key={item} onClick={() => setTopic(item)} className={`h-10 shrink-0 rounded-lg border px-5 text-[11px] font-semibold ${topic === item ? "border-[#00a36a] bg-[#f2fbf7] text-[#008c60]" : "border-[#dfe6e4] bg-white text-[#26334f]"}`}>{item}</button>)}</div>
      <div className="mt-7 grid gap-5 lg:grid-cols-[275px_minmax(0,1fr)]">
        <aside className="h-fit rounded-xl border border-[#dfe6e4] bg-white p-5"><h2 className="text-[14px] font-bold">Popular topics</h2><div className="mt-4 divide-y divide-[#edf1ef]">{[[CircleHelp, "How does Vuior work?"], [CreditCard, "How do I pay a bill?"], [Sparkles, "How do credits and rewards work?"], [ShieldCheck, "Is my payment secure?"], [FileText, "How do I enable Autopay?"]].map(([Icon, label]) => {const I=Icon as typeof CircleHelp; return <button key={String(label)} onClick={() => setSearch(String(label).replace("does Vuior work", "Vuior"))} className="flex w-full items-center gap-3 py-4 text-left"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#eef8f4] text-[#009b67]"><I size={15}/></span><span className="flex-1 text-[10px]">{String(label)}</span><ChevronRight size={14}/></button>})}</div><button onClick={() => {setTopic("All Topics");setSearch("")}} className="mt-4 text-[10px] font-semibold text-[#009b67]">View all topics →</button></aside>
        <section className="overflow-hidden rounded-xl border border-[#dfe6e4] bg-white">{filtered.map((item) => {const originalIndex=faqs.indexOf(item); const isOpen=open===originalIndex; return <div key={item[0]} className="border-b border-[#e8eeeb] last:border-0"><button onClick={() => setOpen(isOpen ? -1 : originalIndex)} className="flex min-h-14 w-full items-center justify-between gap-4 px-6 py-4 text-left"><span className={`text-[13px] font-semibold ${isOpen ? "text-[#009b67]" : "text-[#101c3c]"}`}>{item[0]}</span><ChevronDown size={17} className={`shrink-0 transition ${isOpen ? "rotate-180" : ""}`}/></button>{isOpen && <p className="px-6 pb-6 text-[11px] leading-6 text-[#596885]">{item[1]}</p>}</div>})}{!filtered.length && <div className="grid min-h-64 place-items-center p-8 text-center"><div><Search className="mx-auto text-[#b7c5c0]"/><p className="mt-3 text-[12px] font-semibold">No matching answers</p><button onClick={() => {setSearch("");setTopic("All Topics")}} className="mt-2 text-[10px] text-[#009b67]">Clear filters</button></div></div>}</section>
      </div>
      <section className="mt-12 flex flex-col gap-5 rounded-xl border border-[#d6ebe3] bg-linear-to-r from-[#f4fbf8] to-[#fbfefd] p-5 sm:flex-row sm:items-center"><span className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#009b67] shadow-sm"><Headphones size={25}/></span><div className="flex-1"><h2 className="text-[14px] font-bold">Can’t find what you’re looking for?</h2><p className="mt-1 text-[11px] text-[#66738b]">Our support team is here to help you.</p></div><Link href="/contact" className="flex h-11 items-center justify-center rounded-md bg-[#009b67] px-7 text-[11px] font-semibold text-white">Contact support <span className="ml-3">→</span></Link></section>
    </div>
    <footer className="mt-8 border-t border-[#e7ecea] bg-white py-9 text-[#596885]"><div className="mx-auto grid max-w-[1100px] gap-7 px-7 sm:grid-cols-4"><div><b className="text-[#111d3d]">VUIOR</b><p className="mt-3 text-[10px] leading-5">Pay your bills early and earn credits for a smarter financial life.</p></div><div><b className="text-[11px] text-[#111d3d]">Product</b><p className="mt-3 text-[10px] leading-6">How it works<br/>Bills<br/>Rewards<br/>Bill providers</p></div><div><b className="text-[11px] text-[#111d3d]">Support</b><p className="mt-3 text-[10px] leading-6">Help center<br/>FAQs<br/>Contact support</p></div><div><b className="text-[11px] text-[#111d3d]">Legal</b><p className="mt-3 text-[10px] leading-6">Privacy policy<br/>Terms of service<br/>Cookie policy</p></div></div><p className="mt-8 text-center text-[9px]">© 2026 Vuior. All rights reserved.</p></footer>
  </div></DashboardShell>;
}
