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
    <dialog
      ref={dialog}
      aria-labelledby="payment-title"
      onCancel={(event) => { event.preventDefault(); if (!processing) onClose(); }}
      className="fixed inset-0 m-auto max-h-[94dvh] w-[calc(100%_-_1.5rem)] max-w-[580px] overflow-hidden rounded-2xl bg-white p-0 text-[#152b26] shadow-2xl backdrop:bg-[#071c18]/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex max-h-[94dvh] flex-col">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[#e7eeea] px-5 py-5 sm:px-7">
          <div>
            <h2 id="payment-title" className="text-[23px] font-semibold tracking-tight">Review &amp; pay</h2>
            <p className="mt-1 text-sm text-[#65728a]">{bills.length} bill{bills.length === 1 ? "" : "s"} selected. Choose a payment method to continue.</p>
          </div>
          <button autoFocus disabled={processing} onClick={onClose} aria-label="Close order summary" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f1f5f3] transition hover:bg-[#e6eeea] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008c5e] disabled:opacity-40">
            <X size={18} />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
          <section aria-labelledby="selected-bills-title">
            <div className="flex items-center justify-between gap-3">
              <h3 id="selected-bills-title" className="text-sm font-semibold">Selected bills</h3>
              <span className="text-sm font-semibold tabular-nums">{money.format(subtotal)}</span>
            </div>
            <div className="mt-3 max-h-40 divide-y divide-[#e7eeea] overflow-y-auto rounded-xl border border-[#e7eeea] bg-[#f8faf9] px-4">
              {bills.map((bill) => (
                <div key={bill.id} className="flex items-center gap-3 py-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-[#009b67]"><FileText size={17} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-medium">{bill.name}</p>
                    <p className="mt-0.5 text-xs text-[#65728a]">{bill.category}</p>
                  </div>
                  <span className="shrink-0 text-sm font-medium tabular-nums">{money.format(bill.amount)}</span>
                </div>
              ))}
            </div>
          </section>

          <fieldset disabled={processing}>
            <legend className="mb-3 text-sm font-semibold">How would you like to pay?</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["card", "credits"] as const).map((value) => {
                const disabled = value === "credits" && creditPaymentUnavailable;
                return (
                  <label key={value} className={`flex items-start gap-3 rounded-xl border p-4 transition focus-within:ring-2 focus-within:ring-[#009b67] focus-within:ring-offset-2 ${method === value ? "border-[#009b67] bg-[#f0faf5] ring-1 ring-[#009b67]" : "border-[#dfe7e2]"} ${disabled ? "cursor-not-allowed bg-[#f8faf9] text-[#77847e]" : "cursor-pointer hover:border-[#009b67]"}`}>
                    <input type="radio" name="payment-method" value={value} checked={method === value} disabled={disabled} onChange={() => setMethod(value)} className="mt-1 h-4 w-4 shrink-0 accent-[#009b67]" />
                    <span className="min-w-0">
                      <span className="mb-2 block text-[#4e6a5b]">{value === "card" ? <CreditCard size={21} /> : <WalletCards size={21} />}</span>
                      <span className="block text-sm font-semibold">{value === "card" ? "Credit or debit card" : "Vuior credits"}</span>
                      <span className="mt-1 block text-xs leading-5 text-[#65728a]">{value === "card" ? "Pay securely with Stripe" : `${money.format(available)} available`}</span>
                      {disabled && <span className="mt-1 block text-xs leading-5">{bills.length > 25 ? "Select up to 25 bills to use credits" : "Not enough credits for these bills"}</span>}
                    </span>
                  </label>
                );
              })}
            </div>

            {method === "card" && available > 0 && maxCredits > 0 && (
              <div className="mt-4 rounded-xl border border-[#e4ebe6] p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="checkbox" checked={applyCredits} onChange={(event) => { setApplyCredits(event.target.checked); setCreditAmount(maxCredits.toFixed(2)); }} className="mt-0.5 h-4 w-4 shrink-0 accent-[#009b67]" />
                  <span><span className="block text-sm font-medium">Use credits to reduce your card payment</span><span className="mt-1 block text-xs text-[#65728a]">You have {money.format(available)} in credits.</span></span>
                </label>
                {applyCredits && (
                  <div className="mt-4 border-t border-[#e7eeea] pt-4">
                    <label htmlFor="payment-credits" className="block text-xs font-medium">Amount to apply</label>
                    <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#ceddd4] bg-white px-3 focus-within:border-[#009b67] focus-within:ring-1 focus-within:ring-[#009b67]">
                      <span className="text-sm text-[#65728a]">$</span>
                      <input id="payment-credits" type="number" min="0.01" max={maxCredits} step="0.01" inputMode="decimal" value={creditAmount} onChange={(event) => setCreditAmount(event.target.value)} aria-invalid={invalidCredits} aria-describedby={invalidCredits ? "credit-error" : "credit-help"} className="h-11 w-full min-w-0 bg-transparent text-sm outline-none" />
                      <button type="button" onClick={() => setCreditAmount(maxCredits.toFixed(2))} className="shrink-0 rounded px-2 py-2 text-xs font-semibold text-[#008c5e] hover:bg-[#f0faf5]">Use max</button>
                    </div>
                    <p id="credit-help" className="mt-2 text-xs leading-5 text-[#65728a]">Apply up to {money.format(maxCredits)}. At least $0.50 of the bill must be paid by card.</p>
                    {invalidCredits && <p id="credit-error" role="alert" className="mt-2 text-xs text-red-700">Enter an amount from $0.01 to {money.format(maxCredits)}, with at most two decimal places.</p>}
                  </div>
                )}
              </div>
            )}
          </fieldset>

          <section aria-labelledby="payment-breakdown-title" className="border-t border-[#e7eeea] pt-5">
            <h3 id="payment-breakdown-title" className="mb-3 text-sm font-semibold">Payment breakdown</h3>
            <dl className="space-y-2.5 text-sm tabular-nums">
              <div className="flex justify-between gap-3"><dt className="text-[#65728a]">Bill subtotal</dt><dd>{money.format(subtotal)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-[#65728a]">{method === "card" ? "Card processing fee (3%)" : "Processing fee"}</dt><dd>{money.format(fee)}</dd></div>
              {discount > 0 && <div className="flex justify-between gap-3 text-[#008c5e]"><dt>Credits applied</dt><dd>−{money.format(discount)}</dd></div>}
            </dl>
            {rewards > 0 && <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#f0f8f3] p-3 text-[#39704e]"><Sparkles size={16} className="mt-0.5 shrink-0" /><p className="text-xs leading-5">Earn up to <strong>{money.format(rewards)} in credits</strong> after approval. This reward is separate from today&apos;s payment.</p></div>}
          </section>
          {unavailable && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">These bills are no longer available. Close this summary and select your bills again.</p>}
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm leading-5 text-red-700">{error}</p>}
        </div>

        <footer className="shrink-0 border-t border-[#dfe8e2] bg-white px-5 py-4 shadow-[0_-8px_24px_rgba(21,43,38,0.04)] sm:px-7 sm:py-5">
          <div className="mb-4 flex items-center justify-between gap-4" aria-live="polite" aria-atomic="true">
            <div><p className="text-sm font-semibold">{method === "card" ? "Total to pay by card" : "Total to pay with credits"}</p><p className="mt-0.5 text-xs text-[#65728a]">{method === "card" ? "Includes processing fee" : "Deducted from your credit balance"}</p></div>
            <p className="text-[28px] font-bold tracking-tight tabular-nums">{money.format(total)}</p>
          </div>
          <button
            disabled={processing || unavailable || invalidCredits || (method === "credits" && creditPaymentUnavailable)}
            onClick={pay}
            className="flex min-h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-[#008f5b] px-4 py-3 text-base font-bold text-white shadow-[0_5px_14px_rgba(0,143,91,0.22)] transition hover:bg-[#007849] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008f5b] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {processing ? <><LoaderCircle size={20} className="animate-spin" /> Processing…</> : <>{method === "card" ? <CreditCard size={20} /> : <WalletCards size={20} />} {method === "card" ? `Continue to pay ${money.format(total)}` : `Pay ${money.format(total)} with credits`}</>}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-[#65728a]"><ShieldCheck size={14} className="shrink-0" />{method === "card" ? "Next: enter your card details securely on Stripe" : "Your payment will be submitted for review"}</p>
        </footer>
      </div>
    </dialog>
  );
}
