"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, CreditCard, Mail, Send, ShieldCheck, WalletCards, XCircle } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useVuiorSession } from "@/hooks/useVuiorSession";
import { checkoutUrl, createCreditsCheckout, sendCredits } from "@/services/payments";

type Tab = "add" | "send";
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function WalletPage() {
  const { user } = useVuiorSession();
  const [tab, setTab] = useState<Tab>(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("tab") === "send" ? "send" : "add");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const numeric = Number(amount);

  async function submit(event: FormEvent) {
    event.preventDefault(); setResult(null);
    if (!user?.id || numeric <= 0) return setResult({ ok: false, message: "Enter a valid amount." });
    if (tab === "send" && numeric > Number(user.availableCredits ?? 0)) return setResult({ ok: false, message: "This amount exceeds your available credits." });
    if (tab === "send" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setResult({ ok: false, message: "Enter the verified email on the recipient’s Vuior account." });
    setLoading(true);
    try {
      if (tab === "add") {
        const checkout = await createCreditsCheckout(user.id, numeric);
        window.location.assign(checkoutUrl(checkout));
      } else {
        const response = await sendCredits(user.id, email.trim().toLowerCase(), numeric);
        setAmount(""); setEmail(""); setResult({ ok: true, message: response.message || "Credits sent successfully." });
      }
    } catch (error) { setResult({ ok: false, message: error instanceof Error ? error.message : "Unable to complete this request." }); }
    finally { setLoading(false); }
  }

  return <DashboardShell><div className="mx-auto max-w-[980px] p-5 sm:p-8 lg:p-10">
    <Link href="/dashboard/credits" className="flex items-center gap-2 text-[11px] font-semibold text-[#596885]"><ArrowLeft size={16}/> Back to credits</Link>
    <div className="mt-6"><h1 className="text-[29px] font-bold tracking-[-.035em]">Wallet</h1><p className="mt-2 text-[12px] text-[#65728a]">Add funds securely or send credits to another Vuior user.</p></div>
    <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
      <form onSubmit={submit} className="overflow-hidden rounded-xl border border-[#e1e8e5] bg-white shadow-[0_8px_28px_rgba(25,55,47,.05)]">
        <div className="grid grid-cols-2 bg-[#f4f7f6] p-1.5">{(["add", "send"] as Tab[]).map(item => <button type="button" onClick={() => {setTab(item);setResult(null)}} key={item} className={`h-11 rounded-lg text-[12px] font-semibold ${tab === item ? "bg-white text-[#009b67] shadow-sm" : "text-[#718097]"}`}>{item === "add" ? "Add Funds" : "Send Credits"}</button>)}</div>
        <div className="p-5 sm:p-8"><span className="grid h-12 w-12 place-items-center rounded-xl bg-[#eaf8f2] text-[#009b67]">{tab === "add" ? <WalletCards size={23}/> : <Send size={22}/>}</span><h2 className="mt-4 text-[20px] font-bold">{tab === "add" ? "Add money to your wallet" : "Send credits"}</h2><p className="mt-1 text-[11px] text-[#65728a]">{tab === "add" ? "Fund your wallet to pay bills early and earn more credits." : "Transfer credits instantly using a recipient’s verified email."}</p>
          <label className="mt-6 block text-[10px] font-bold uppercase tracking-wider text-[#44516b]">Amount</label><div className="mt-2 flex h-16 items-center rounded-xl border border-[#dfe6e4] bg-[#fafcfb] px-4"><span className="text-[25px] text-[#8792a4]">$</span><input value={amount} onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} inputMode="decimal" placeholder="0.00" className="min-w-0 flex-1 bg-transparent px-2 text-[29px] outline-none"/></div>
          <div className="mt-3 grid grid-cols-4 gap-2">{(tab === "add" ? [25,50,100,250] : [10,20,50,100]).map(value => <button type="button" onClick={() => setAmount(String(value))} key={value} className={`h-9 rounded-lg border text-[10px] font-semibold ${numeric === value ? "border-[#00a36a] bg-[#eef9f5] text-[#009b67]" : "border-[#dfe6e4]"}`}>{money.format(value)}</button>)}</div>
          {tab === "send" && <><label className="mt-6 block text-[10px] font-bold uppercase tracking-wider text-[#44516b]">Recipient email</label><div className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-[#dfe6e4] px-4"><Mail size={17} className="text-[#8b96a7]"/><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="min-w-0 flex-1 text-[12px] outline-none"/></div><p className="mt-3 rounded-lg border border-[#cceadd] bg-[#f1faf6] p-3 text-[10px] leading-5 text-[#38705d]">Transfers are instant and non-reversible. Confirm the recipient email before sending.</p></>}
          {result && <div className={`mt-5 flex gap-3 rounded-lg border p-3 text-[11px] ${result.ok ? "border-[#bde6d4] bg-[#effaf5] text-[#08764f]" : "border-[#fecaca] bg-[#fff1f2] text-[#b4233b]"}`}>{result.ok ? <CheckCircle2 size={17}/> : <XCircle size={17}/>}<span>{result.message}</span></div>}
          <button disabled={loading || numeric <= 0} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#009b67] text-[12px] font-semibold text-white disabled:opacity-50">{loading ? "Please wait…" : tab === "add" ? `Continue to checkout · ${money.format(numeric || 0)}` : `Send ${money.format(numeric || 0)}`} {tab === "add" ? <CreditCard size={17}/> : <Send size={16}/>}</button>
        </div>
      </form>
      <aside className="h-fit space-y-5"><section className="rounded-xl bg-[#063c33] p-5 text-white"><p className="text-[10px] text-[#bcd9d0]">Available credits</p><strong className="mt-2 block text-[27px]">{money.format(Number(user?.availableCredits ?? 0))}</strong><p className="mt-2 text-[9px] text-[#68ddb5]">Ready to use</p></section><section className="rounded-xl border border-[#dfe6e4] bg-white p-5"><ShieldCheck size={24} className="text-[#00a36a]"/><h3 className="mt-3 text-[12px] font-bold">Secure & encrypted</h3><p className="mt-2 text-[10px] leading-5 text-[#65728a]">Card checkout is securely hosted by Stripe. Vuior never stores your full card details.</p></section></aside>
    </div>
  </div></DashboardShell>;
}
