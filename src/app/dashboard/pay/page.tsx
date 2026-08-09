"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, Check, CheckCircle2, ChevronRight, CircleDollarSign, CreditCard, FileText, Plus, ShieldCheck, Sparkles, WalletCards, X } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useVuiorSession } from "@/hooks/useVuiorSession";
import { useVuiorData } from "@/hooks/useVuiorData";
import { billReward, checkoutUrl, createBillsCheckout, payBillsWithCredits } from "@/services/payments";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
function daysUntil(value: string) { const date = new Date(value); const today = new Date(); today.setHours(0,0,0,0); date.setHours(0,0,0,0); return Math.max(0, Math.ceil((date.getTime() - today.getTime()) / 86400000)); }

export default function PayPage() {
  const { user } = useVuiorSession();
  const { bills } = useVuiorData(user?.id);
  const [tab, setTab] = useState<"due" | "paid">("due");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [checkout, setCheckout] = useState(false);
  const [applyCredits, setApplyCredits] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const visible = useMemo(() => bills.filter(bill => tab === "due" ? ["active", "upcoming"].includes(bill.status.toLowerCase()) && daysUntil(bill.dueDate) <= 30 : ["paid", "completed"].includes(bill.status.toLowerCase())).sort((a,b) => +new Date(a.dueDate) - +new Date(b.dueDate)), [bills, tab]);
  const selectedBills = bills.filter(bill => selected.has(bill.id));
  const subtotal = selectedBills.reduce((sum,bill) => sum + bill.amount, 0);
  const rewards = selectedBills.reduce((sum,bill) => sum + billReward(bill), 0);
  const available = Number(user?.availableCredits ?? 0);
  const maxPartialCredits = Math.min(available, Math.max(0, subtotal - .5));
  const creditsForCard = applyCredits ? Math.min(maxPartialCredits, Math.max(0, Number(creditAmount) || 0)) : 0;
  const cardCharge = Math.max(0, subtotal - creditsForCard);

  function toggle(id: string) { setSelected(current => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; }); }
  function selectAll() { setSelected(current => visible.every(b => current.has(b.id)) ? new Set() : new Set(visible.map(b => b.id))); }

  async function payCredits() {
    if (!user?.id || !selectedBills.length || available < subtotal) return;
    setCheckout(false); setProcessing(true); setResult(null);
    try { const response = await payBillsWithCredits(user.id, selectedBills); setSelected(new Set()); setResult({ ok: true, message: `Payment submitted for review. ${money.format(response.reward)} in early-payment credits will be added after approval.` }); }
    catch (error) { setResult({ ok: false, message: error instanceof Error ? error.message : "Payment could not be completed." }); }
    finally { setProcessing(false); }
  }

  async function payCard() {
    if (!user?.id || !selectedBills.length) return;
    setProcessing(true); setResult(null);
    try { const response = await createBillsCheckout({ userId: user.id, bills: selectedBills, creditsApplied: creditsForCard, savings: rewards, customerId: user.stripeCustomerId }); window.location.assign(checkoutUrl(response)); }
    catch (error) { setCheckout(false); setResult({ ok: false, message: error instanceof Error ? error.message : "Checkout could not be started." }); setProcessing(false); }
  }

  return <DashboardShell><div className="mx-auto max-w-[1320px] p-5 sm:p-7 lg:p-8">
    <div><h1 className="text-[29px] font-bold tracking-[-.035em]">Pay</h1><p className="mt-1 text-[13px] text-[#596885]">Pay your bills early and earn credits.</p></div>
    {result && <div className={`mt-5 flex items-center gap-3 rounded-lg border p-4 text-[11px] ${result.ok ? "border-[#bfe8d6] bg-[#effaf5] text-[#08764f]" : "border-[#fecaca] bg-[#fff1f2] text-[#b4233b]"}`}><CheckCircle2 size={18}/><span>{result.message}</span><button onClick={() => setResult(null)} className="ml-auto"><X size={15}/></button></div>}
    <section className="mt-6 overflow-hidden rounded-xl bg-linear-to-r from-[#06453a] to-[#032f29] p-6 text-white shadow-[0_12px_32px_rgba(4,58,47,.15)]"><div className="grid items-center gap-5 md:grid-cols-[1fr_auto]"><div><p className="text-[9px] uppercase tracking-[.18em] text-[#b6d7cc]">Available credits</p><strong className="mt-2 block text-[32px]">{money.format(available)}</strong><p className="mt-2 flex items-center gap-2 text-[10px] text-[#62ddb4]"><i className="h-2 w-2 rounded-full bg-[#45e8ae]"/> Ready to use</p></div><div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4"><p className="flex items-center gap-2 text-[12px] font-semibold"><Sparkles size={17} className="text-[#55deb0]"/> Pay early. Save more.</p><p className="mt-2 text-[10px] text-[#b6d7cc]">Pay bills up to 15 days early and earn up to 15%.</p></div></div></section>

    <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="overflow-hidden rounded-xl border border-[#e1e8e5] bg-white shadow-[0_8px_28px_rgba(25,55,47,.04)]"><div className="flex items-center justify-between p-5"><h2 className="text-[15px] font-bold">My Bills</h2><Link href="/dashboard/bills/add-bills" className="flex items-center gap-2 text-[10px] font-semibold text-[#009b67]"><Plus size={16}/> Add bill</Link></div><div className="grid grid-cols-2 border-b border-[#e7ecea]">{[["due","Due Soon"],["paid","Paid"]].map(([value,label]) => <button onClick={() => {setTab(value as "due"|"paid");setSelected(new Set())}} key={value} className={`h-12 border-b-2 text-[11px] font-semibold ${tab === value ? "border-[#009b67] text-[#009b67]" : "border-transparent text-[#718097]"}`}>{label} <span className="ml-1 rounded-full bg-[#eef3f1] px-2 py-0.5 text-[9px]">{bills.filter(b => value === "due" ? ["active","upcoming"].includes(b.status.toLowerCase()) : ["paid","completed"].includes(b.status.toLowerCase())).length}</span></button>)}</div>
        {tab === "due" && visible.length > 0 && <button onClick={selectAll} className="flex h-11 w-full items-center gap-3 border-b border-[#edf1ef] px-5 text-[10px] text-[#596885]"><span className={`grid h-4 w-4 place-items-center rounded border ${visible.every(b => selected.has(b.id)) ? "border-[#009b67] bg-[#009b67] text-white" : "border-[#bfc9c5]"}`}>{visible.every(b => selected.has(b.id)) && <Check size={11}/>}</span>{visible.every(b => selected.has(b.id)) ? "Deselect all" : "Select all"}</button>}
        <div className="divide-y divide-[#edf1ef]">{visible.map(bill => <button disabled={tab === "paid"} onClick={() => toggle(bill.id)} key={bill.id} className={`grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-4 text-left sm:grid-cols-[auto_auto_1fr_auto_auto] sm:px-5 ${selected.has(bill.id) ? "bg-[#f1faf6]" : "hover:bg-[#fbfdfc]"}`}><span className={`grid h-5 w-5 place-items-center rounded border ${selected.has(bill.id) ? "border-[#009b67] bg-[#009b67] text-white" : tab === "paid" ? "border-[#bde3d3] bg-[#eaf8f2] text-[#009b67]" : "border-[#cbd4d1]"}`}><Check size={12}/></span><span className="hidden h-10 w-10 place-items-center rounded-full bg-[#eef8f4] text-[#009b67] sm:grid"><FileText size={17}/></span><span className="min-w-0"><b className="block truncate text-[11px]">{bill.name}</b><small className="mt-1 block truncate text-[9px] text-[#718097]">{bill.category} · Due in {daysUntil(bill.dueDate)} days</small></span><span className="text-right"><b className="block text-[11px]">{money.format(bill.amount)}</b><small className="mt-1 block whitespace-nowrap text-[9px] text-[#009b67]">{tab === "paid" ? "Paid" : `Earn ${money.format(billReward(bill))}`}</small></span><ChevronRight size={14} className="hidden text-[#aab5b1] sm:block"/></button>)}</div>{!visible.length && <div className="grid min-h-64 place-items-center p-8 text-center"><div><CalendarDays size={30} className="mx-auto text-[#bdc9c5]"/><p className="mt-3 text-[11px] font-semibold">No {tab === "due" ? "bills due soon" : "paid bills"}</p><Link href="/dashboard/bills/add-bills" className="mt-3 inline-block text-[10px] text-[#009b67]">Add a bill</Link></div></div>}
      </section>
      <aside className="h-fit rounded-xl border border-[#e1e8e5] bg-white p-5 shadow-[0_8px_28px_rgba(25,55,47,.04)]"><h2 className="text-[14px] font-bold">Order Summary</h2>{selectedBills.length ? <><div className="mt-4 space-y-3">{selectedBills.map(bill => <div key={bill.id} className="flex justify-between text-[10px]"><span className="text-[#596885]">{bill.name}</span><b>{money.format(bill.amount)}</b></div>)}</div><div className="mt-4 border-t border-[#edf1ef] pt-4"><p className="flex justify-between text-[10px] text-[#009b67]"><span>Credits you’ll earn</span><b>{money.format(rewards)}</b></p><p className="mt-3 flex justify-between text-[14px] font-bold"><span>Total</span><span>{money.format(subtotal)}</span></p></div><button onClick={() => {setCheckout(true);setApplyCredits(false);setCreditAmount("")}} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#009b67] text-[11px] font-semibold text-white"><CircleDollarSign size={17}/> Pay · {money.format(subtotal)}</button></> : <div className="grid min-h-[210px] place-items-center text-center"><div><WalletCards size={30} className="mx-auto text-[#bdc9c5]"/><p className="mt-3 text-[10px] leading-5 text-[#718097]">Select one or more active bills to see your payment summary.</p></div></div>}<div className="mt-4 flex gap-2 rounded-lg bg-[#f4faf7] p-3 text-[9px] leading-4 text-[#527064]"><ShieldCheck size={16} className="shrink-0 text-[#009b67]"/> Secure checkout and encrypted payments.</div></aside>
    </div>
    {checkout && <div className="fixed inset-0 z-50 grid place-items-center bg-[#07142d]/55 p-4"><div className="w-full max-w-[520px] rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><h2 className="text-[20px] font-bold">Choose how to pay</h2><p className="mt-1 text-[11px] text-[#65728a]">{selectedBills.length} bill{selectedBills.length === 1 ? "" : "s"} · {money.format(subtotal)} total</p></div><button onClick={() => setCheckout(false)} className="grid h-8 w-8 place-items-center rounded-full bg-[#f1f4f3]"><X size={17}/></button></div><div className="mt-4 rounded-lg bg-[#effaf5] p-3 text-[10px] text-[#08764f]">Earn {money.format(rewards)} in credits after payment approval.</div>{available >= subtotal && <button disabled={processing} onClick={payCredits} className="mt-4 flex w-full items-center gap-3 rounded-xl border border-[#dfe6e4] p-4 text-left"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf8f2] text-[#009b67]"><WalletCards size={20}/></span><span className="flex-1"><b className="block text-[12px]">Vuior credits</b><small className="text-[9px] text-[#718097]">Balance: {money.format(available)}</small></span><ChevronRight size={16}/></button>}<div className="mt-3 rounded-xl border border-[#dfe6e4] p-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef4ff] text-[#3776d2]"><CreditCard size={20}/></span><span><b className="block text-[12px]">Credit or debit card</b><small className="text-[9px] text-[#718097]">Secure web checkout powered by Stripe</small></span></div>{available > 0 && maxPartialCredits > 0 && <div className="mt-4 border-t border-[#edf1ef] pt-4"><label className="flex items-center justify-between text-[10px]"><span><b>Apply Vuior credits</b><small className="mt-1 block text-[#718097]">Available: {money.format(available)}</small></span><input type="checkbox" checked={applyCredits} onChange={e => {setApplyCredits(e.target.checked); if(e.target.checked) setCreditAmount(maxPartialCredits.toFixed(2))}} className="auth-checkbox"/></label>{applyCredits && <div className="mt-3 flex h-10 items-center rounded-lg border border-[#dfe6e4] px-3"><span>$</span><input value={creditAmount} onChange={e => setCreditAmount(e.target.value.replace(/[^0-9.]/g,""))} className="min-w-0 flex-1 px-2 text-[11px] outline-none"/><button onClick={() => setCreditAmount(maxPartialCredits.toFixed(2))} className="text-[9px] font-semibold text-[#009b67]">Use max</button></div>}</div>}<button disabled={processing} onClick={payCard} className="mt-4 h-11 w-full rounded-lg bg-[#101828] text-[11px] font-semibold text-white disabled:opacity-60">{processing ? "Starting checkout…" : `Continue · ${money.format(cardCharge)}`}</button></div>{available < subtotal && <p className="mt-3 text-center text-[9px] text-[#8a95a7]">Your credit balance is {money.format(subtotal - available)} short of this total.</p>}</div></div>}
  </div></DashboardShell>;
}
