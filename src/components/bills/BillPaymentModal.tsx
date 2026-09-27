"use client";

import { useEffect, useRef, useState } from "react";
import { CreditCard, FileText, LoaderCircle, ShieldCheck, Sparkles, WalletCards, X } from "lucide-react";
import type { Bill } from "@/hooks/useVuiorData";
import type { VuiorUser } from "@/hooks/useVuiorSession";
import { billReward, checkoutUrl, createBillsCheckout, payBillsWithCredits } from "@/services/payments";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const round = (value: number) => Math.round(value * 100) / 100;

export default function BillPaymentModal({ bills, expectedBillCount, user, onClose, onPaid }: {
  bills: Bill[];
  expectedBillCount: number;
  user: VuiorUser;
  onClose: () => void;
  onPaid: (message: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const submitting = useRef(false);
  const requestId = useRef<string | null>(null);
  const [method, setMethod] = useState<"card" | "credits">("card");
  const [applyCredits, setApplyCredits] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const subtotal = round(bills.reduce((sum, bill) => sum + bill.amount, 0));
  const available = Math.max(0, Number(user.availableCredits) || 0);
  const fee = method === "card" ? round(subtotal * 0.03) : 0;
  const maxCredits = round(Math.min(available, Math.max(0, subtotal - 0.5)));
  const enteredCredits = Number(creditAmount);
  const invalidCredits = method === "card" && applyCredits && (!creditAmount || !Number.isFinite(enteredCredits) || enteredCredits <= 0 || enteredCredits > maxCredits || round(enteredCredits) !== enteredCredits);
  const discount = method === "card" && applyCredits && !invalidCredits ? enteredCredits : 0;
  const total = round(subtotal + fee - discount);
  const rewards = round(bills.reduce((sum, bill) => sum + billReward(bill), 0));
  const unavailable = bills.length !== expectedBillCount || !bills.length || bills.some((bill) => !Number.isFinite(bill.amount) || bill.amount <= 0);
  const creditPaymentUnavailable = available < subtotal || bills.length > 25;

  useEffect(() => {
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, []);

  async function pay() {
    if (submitting.current || unavailable || invalidCredits || (method === "credits" && creditPaymentUnavailable)) return;
    submitting.current = true;
    setProcessing(true);
    setError("");
    try {
      if (method === "credits") {
        requestId.current ??= crypto.randomUUID().replaceAll("-", "");
        await payBillsWithCredits(user.id, bills, requestId.current);
        onPaid("Payment submitted for review. Eligible early-payment credits will be added after approval.");
      } else {
        const response = await createBillsCheckout({ userId: user.id, bills, creditsApplied: discount, savings: rewards, customerId: user.stripeCustomerId });
        window.location.assign(checkoutUrl(response));
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Payment could not be started. Please try again.");
      submitting.current = false;
      setProcessing(false);
    }
  }

  return (
    <dialog ref={dialog} aria-labelledby="payment-title" onCancel={(event) => { event.preventDefault(); if (!processing) onClose(); }} className="fixed inset-0 m-auto max-h-[92dvh] w-[calc(100%_-_2rem)] max-w-[720px] overflow-y-auto rounded-2xl bg-white p-0 text-[#152b26] shadow-2xl backdrop:bg-[#071c18]/60 backdrop:backdrop-blur-sm">
      <div className="flex items-start justify-between border-b border-[#e7eeea] p-5 sm:p-6">
        <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#008c5e]">Bill payment</p><h2 id="payment-title" className="mt-1 text-2xl font-semibold tracking-tight">Order summary</h2><p className="mt-1 text-xs text-[#65728a]">Review your bills and choose how you’d like to pay.</p></div>
        <button autoFocus disabled={processing} onClick={onClose} aria-label="Close order summary" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f1f5f3] hover:bg-[#e6eeea] disabled:opacity-40"><X size={18} /></button>
      </div>
      <div className="grid sm:grid-cols-2">
        <section className="bg-[#f7faf8] p-5 sm:p-6" aria-label="Selected bills">
          <h3 className="text-sm font-semibold">Your bills <span className="ml-2 rounded-full bg-[#e4eee8] px-2 py-0.5 text-xs">{bills.length}</span></h3>
          <div className="mt-3 max-h-56 divide-y divide-[#e2eae5] overflow-y-auto">
            {bills.map((bill) => <div key={bill.id} className="flex items-center gap-3 py-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#e2eae5] bg-white text-[#009b67]"><FileText size={16} /></span><div className="min-w-0 flex-1"><p className="break-words text-xs font-medium">{bill.name}</p><p className="mt-1 text-[10px] text-[#65728a]">{bill.category}</p></div><span className="text-xs font-semibold">{money.format(bill.amount)}</span></div>)}
          </div>
          <dl className="mt-4 space-y-3 border-t border-[#dde7e1] pt-4 text-xs"><div className="flex justify-between"><dt>Bill subtotal</dt><dd>{money.format(subtotal)}</dd></div>{method === "card" && <div className="flex justify-between text-[#65728a]"><dt>Card processing fee (3%)</dt><dd>{money.format(fee)}</dd></div>}{discount > 0 && <div className="flex justify-between text-[#008c5e]"><dt>Credits applied</dt><dd>−{money.format(discount)}</dd></div>}<div className="flex justify-between border-t border-[#dde7e1] pt-4 text-lg font-semibold"><dt>Total</dt><dd>{money.format(total)}</dd></div></dl>
          {rewards > 0 && <div className="mt-5 rounded-xl border border-[#d6eade] bg-[#edf8f1] p-3 text-[#25714d]"><p className="flex items-center gap-2 text-xs font-semibold"><Sparkles size={15} /> Up to {money.format(rewards)} in rewards</p><p className="mt-1.5 text-[11px] leading-5">Eligible early-payment credits are added after approval.</p></div>}
        </section>
        <section className="p-5 sm:p-6" aria-label="Payment method">
          <fieldset disabled={processing}><legend className="mb-3 text-sm font-semibold">Payment method</legend>
            {(["card", "credits"] as const).map((value) => <label key={value} className={`mb-3 flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${method === value ? "border-[#009b67] bg-[#f0faf5] ring-1 ring-[#009b67]" : "border-[#dfe7e2] hover:border-[#a6c9b6]"} ${value === "credits" && creditPaymentUnavailable ? "opacity-55" : ""}`}><input type="radio" name="payment-method" value={value} checked={method === value} disabled={value === "credits" && creditPaymentUnavailable} onChange={() => setMethod(value)} className="accent-[#009b67]" />{value === "card" ? <CreditCard size={19} /> : <WalletCards size={19} />}<span><span className="block text-xs font-semibold">{value === "card" ? "Credit or debit card" : "Vuior credits"}</span><span className="mt-1 block text-[10px] text-[#65728a]">{value === "card" ? "Secure checkout with Stripe" : `${money.format(available)} available${available < subtotal ? " · Insufficient balance" : ""}`}</span></span></label>)}
            {method === "card" && <div className="mt-4 rounded-xl border border-[#e4ebe6] p-3.5"><label className="flex items-center justify-between gap-2 text-xs font-medium"><span>Apply credits for a discount</span><input type="checkbox" checked={applyCredits} disabled={maxCredits <= 0} onChange={(event) => { setApplyCredits(event.target.checked); setCreditAmount(maxCredits.toFixed(2)); }} className="h-4 w-4 accent-[#009b67]" /></label><p className="mt-2 text-[10px] leading-4 text-[#65728a]">{money.format(available)} available. Keep at least $0.50 of the bill payable by card.</p>{applyCredits && <><label htmlFor="payment-credits" className="mt-3 block text-[11px] text-[#65728a]">Credits to apply</label><div className="mt-1 flex items-center gap-2 rounded-lg border border-[#ceddd4] bg-white px-3"><span className="text-xs">$</span><input id="payment-credits" type="number" min="0.01" max={maxCredits} step="0.01" inputMode="decimal" value={creditAmount} onChange={(event) => setCreditAmount(event.target.value)} aria-invalid={invalidCredits} aria-describedby={invalidCredits ? "credit-error" : undefined} className="h-10 w-full min-w-0 bg-transparent text-sm outline-none" /><button type="button" onClick={() => setCreditAmount(maxCredits.toFixed(2))} className="shrink-0 text-[11px] font-semibold text-[#008c5e]">Use max</button></div>{invalidCredits && <p id="credit-error" className="mt-2 text-[11px] text-red-700">Enter an amount from $0.01 to {money.format(maxCredits)}, with at most two decimal places.</p>}</>}</div>}
          </fieldset>
          {unavailable && <p role="alert" className="mt-4 text-xs text-red-700">These bills are no longer available. Close this summary and select your bills again.</p>}
          {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-xs leading-5 text-red-700">{error}</p>}
          <button disabled={processing || unavailable || invalidCredits || (method === "credits" && creditPaymentUnavailable)} onClick={pay} className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#009b67] px-3 text-xs font-semibold text-white transition hover:bg-[#007e54] disabled:cursor-not-allowed disabled:opacity-50">{processing ? <><LoaderCircle size={16} className="animate-spin" /> Processing…</> : method === "card" ? `Continue to card payment · ${money.format(total)}` : `Pay ${money.format(total)} with credits`}</button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-[#65728a]"><ShieldCheck size={14} /> {method === "card" ? "You’ll complete payment securely on Stripe" : "Your payment will be submitted for review"}</p>
        </section>
      </div>
    </dialog>
  );
}
