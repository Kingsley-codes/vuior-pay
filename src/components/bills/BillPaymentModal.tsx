"use client";
import EarlyPaymentNote from "@/components/EarlyPaymentNote";

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
  const [saveCard, setSaveCard] = useState(false);
  const [applyCredits, setApplyCredits] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [amounts, setAmounts] = useState<Record<string, string>>(() => Object.fromEntries(bills.map((bill) => [bill.id, bill.amount.toFixed(2)])));
  const billAmounts = Object.fromEntries(bills.map((bill) => [bill.id, Number(amounts[bill.id])]));
  const invalidAmounts = bills.some((bill) => !amounts[bill.id] || !Number.isFinite(billAmounts[bill.id]) || billAmounts[bill.id] <= 0 || billAmounts[bill.id] > bill.amount || round(billAmounts[bill.id]) !== billAmounts[bill.id]);
  const subtotal = round(bills.reduce((sum, bill) => sum + (Number.isFinite(billAmounts[bill.id]) ? billAmounts[bill.id] : 0), 0));
  const available = Math.max(0, Number(user.availableCredits) || 0);
  const fee = method === "card" ? round(subtotal * 0.03) : 0;
  const maxCredits = round(Math.min(available, Math.max(0, subtotal - 0.5)));
  const enteredCredits = Number(creditAmount);
  const invalidCredits = method === "card" && applyCredits && (!creditAmount || !Number.isFinite(enteredCredits) || enteredCredits <= 0 || enteredCredits > maxCredits || round(enteredCredits) !== enteredCredits);
  const discount = method === "card" && applyCredits && !invalidCredits ? enteredCredits : 0;
  const total = round(subtotal + fee - discount);
  const cardTooSmall = method === "card" && total < 0.5;
  const rewards = round(bills.reduce((sum, bill) => sum + billReward({ ...bill, amount: billAmounts[bill.id] || 0 }), 0));
  const unavailable = bills.length !== expectedBillCount || !bills.length || bills.length > 25 || bills.some((bill) => !Number.isFinite(bill.amount) || bill.amount <= 0);
  const creditPaymentUnavailable = available < subtotal || bills.length > 25;

  useEffect(() => {
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, []);

  async function pay() {
    if (submitting.current || unavailable || invalidAmounts || invalidCredits || cardTooSmall || (method === "credits" && creditPaymentUnavailable)) return;
    submitting.current = true;
    setProcessing(true);
    setError("");
    try {
      if (method === "credits") {
        requestId.current ??= crypto.randomUUID().replaceAll("-", "");
        await payBillsWithCredits(user.id, bills, requestId.current, billAmounts);
        onPaid("Payment submitted for review. Eligible early-payment credits will be added after approval.");
      } else {
        const response = await createBillsCheckout({ userId: user.id, bills, billAmounts, creditsApplied: discount, savings: rewards, customerId: user.stripeCustomerId, saveCard });
        window.location.assign(checkoutUrl(response));
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Payment could not be started. Please try again.");
      submitting.current = false;
      setProcessing(false);
    }
  }

  const blocked = processing || unavailable || invalidAmounts || invalidCredits || cardTooSmall || (method === "credits" && creditPaymentUnavailable);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="payment-title"
      aria-describedby="payment-description"
      onCancel={(event) => { event.preventDefault(); if (!processing) onClose(); }}
      className="fixed inset-0 m-auto h-dvh max-h-dvh w-full max-w-[1120px] overflow-hidden border-0 bg-[#f6f9f7] p-0 text-[#152b26] shadow-2xl backdrop:bg-[#071c18]/60 backdrop:backdrop-blur-sm sm:h-auto sm:max-h-[92dvh] sm:w-[calc(100%_-_3rem)] sm:rounded-2xl"
    >
      <div className="flex h-full max-h-dvh flex-col sm:max-h-[92dvh]">
        <header className="flex shrink-0 items-start justify-between gap-5 border-b border-[#e1e9e4] bg-white px-5 py-5 sm:px-8 sm:py-6">
          <div>
            <h2 id="payment-title" className="text-2xl font-semibold tracking-tight text-[#142b25]">Review your payment</h2>
            <p id="payment-description" className="mt-1.5 text-base leading-6 text-[#65728a]">Review {bills.length === 1 ? "your bill" : `your ${bills.length} bills`} and choose how to pay.</p>
          </div>
          <button autoFocus type="button" disabled={processing} onClick={onClose} aria-label="Close order summary" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f3f6f4] text-[#65728a] transition hover:bg-[#e6eeea] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008c5e] disabled:opacity-40">
            <X size={20} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-8">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0 space-y-6">
              <section aria-labelledby="selected-bills-title" className="rounded-xl border border-[#e1e9e4] bg-white">
                <div className="border-b border-[#edf1ee] px-5 py-5 sm:px-6">
                  <div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#edf7f1] text-[#008c5e]"><FileText size={17} /></span><h3 id="selected-bills-title" className="text-lg font-semibold">Selected bills</h3><span className="ml-auto rounded-full bg-[#f1f5f3] px-2.5 py-1 text-sm font-medium text-[#65728a]">{bills.length}</span></div>
                  <p className="mt-3 text-sm leading-6 text-[#65728a]">Choose how much to pay toward each bill.</p>
                </div>
                <div className="divide-y divide-[#edf1ee] px-5 sm:px-6">
                  {bills.map((bill) => (
                    <div key={bill.id} className="grid min-w-0 gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_150px] sm:items-center">
                      <div className="min-w-0">
                        <p className="break-words text-base font-semibold text-[#203c32]">{bill.name}</p>
                        <p className="mt-1 text-sm text-[#65728a]">{bill.category}</p>
                        <p className="mt-2 text-sm text-[#65728a]">Bill total <span className="ml-1 font-medium tabular-nums text-[#344c42]">{money.format(bill.amount)}</span></p>
                      </div>
                      <label className="min-w-0">
                        <span className="mb-1.5 block text-sm font-medium text-[#53675b]">You pay</span>
                        <span className="flex h-11 items-center gap-2 rounded-lg border border-[#ceddd4] bg-white px-3 focus-within:border-[#009b67] focus-within:ring-2 focus-within:ring-[#009b67]/10">
                          <span className="text-base text-[#829087]">$</span>
                          <input
                            aria-label={`Amount to pay for ${bill.name}`}
                            disabled={processing}
                            type="number" inputMode="decimal" min="0.01" max={bill.amount} step="0.01"
                            value={amounts[bill.id] ?? ""}
                            onChange={(event) => { requestId.current = null; setAmounts((previous) => ({ ...previous, [bill.id]: event.target.value })); }}
                            className="h-full w-full min-w-0 bg-transparent text-base font-medium tabular-nums outline-none"
                          />
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </section>

              <section aria-labelledby="payment-method-title" className="rounded-xl border border-[#e1e9e4] bg-white p-5 sm:p-6">
                <h3 id="payment-method-title" className="text-lg font-semibold">Payment method</h3>
                <fieldset disabled={processing} className="mt-4">
                  <legend className="sr-only">Choose how to pay</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(["card", "credits"] as const).map((value) => {
                      const disabled = value === "credits" && creditPaymentUnavailable;
                      const active = method === value;
                      return (
                        <label key={value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition focus-within:ring-2 focus-within:ring-[#009b67] focus-within:ring-offset-2 ${active ? "border-[#009b67] bg-[#f0faf5]" : "border-[#dfe7e2] hover:border-[#a3cbb6]"} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}>
                          <input type="radio" name="payment-method" value={value} checked={active} disabled={disabled} onChange={() => setMethod(value)} className="mt-1 h-4 w-4 shrink-0 accent-[#009b67]" />
                          <span className="min-w-0">
                            <span className="mb-3 block text-[#52745f]">{value === "card" ? <CreditCard size={22} /> : <WalletCards size={22} />}</span>
                            <span className="block text-base font-semibold">{value === "card" ? "Debit or credit card" : "Vuior credits"}</span>
                            <span className="mt-1 block text-sm leading-5 text-[#65728a]">{value === "card" ? "Secure checkout with Stripe" : `${money.format(available)} available`}</span>
                            {disabled && <span className="mt-2 block text-sm text-[#65728a]">Insufficient credits</span>}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {method === "card" && (
                    <div className="mt-5 divide-y divide-[#edf1ee] border-t border-[#edf1ee]">
                      {available > 0 && maxCredits > 0 && (
                        <div className="py-5">
                          <label className="flex cursor-pointer items-start gap-3">
                            <input type="checkbox" checked={applyCredits} onChange={(event) => { setApplyCredits(event.target.checked); setCreditAmount(maxCredits.toFixed(2)); }} className="mt-1 h-4 w-4 shrink-0 accent-[#009b67]" />
                            <span><span className="block text-base font-medium">Apply Vuior credits</span><span className="mt-1 block text-sm leading-5 text-[#65728a]">Use your balance to reduce this card payment.</span></span>
                          </label>
                          {applyCredits && (
                            <div className="mt-4 rounded-lg bg-[#f6f9f7] p-4">
                              <label htmlFor="payment-credits" className="block text-sm font-medium">Credits to apply</label>
                              <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#ceddd4] bg-white px-3 focus-within:border-[#009b67] focus-within:ring-2 focus-within:ring-[#009b67]/10">
                                <span className="text-base text-[#65728a]">$</span>
                                <input id="payment-credits" type="number" min="0.01" max={maxCredits} step="0.01" inputMode="decimal" value={creditAmount} onChange={(event) => setCreditAmount(event.target.value)} aria-invalid={invalidCredits} aria-describedby={invalidCredits ? "credit-error" : "credit-help"} className="h-11 w-full min-w-0 bg-transparent text-base outline-none" />
                                <button type="button" onClick={() => setCreditAmount(maxCredits.toFixed(2))} className="shrink-0 rounded px-2 py-2 text-sm font-semibold text-[#008c5e] hover:bg-[#f0faf5]">Use max</button>
                              </div>
                              <p id="credit-help" className="mt-2 text-sm leading-5 text-[#65728a]">Up to {money.format(maxCredits)} available. At least $0.50 of the bill must be paid by card.</p>
                              {invalidCredits && <p id="credit-error" role="alert" className="mt-2 text-sm leading-5 text-red-700">Enter an amount from $0.01 to {money.format(maxCredits)}, with at most two decimal places.</p>}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="pt-5">
                        <label className="flex cursor-pointer items-start gap-3">
                          <input type="checkbox" checked={saveCard} onChange={event => setSaveCard(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#009b67]" />
                          <span><span className="block text-base font-medium">Save card for future payments</span><span className="mt-1 block text-sm leading-5 text-[#65728a]">Stored securely by Stripe.</span></span>
                        </label>
                        {saveCard && <p className="mt-3 pl-7 text-sm leading-6 text-[#65728a]">Your default card may be charged on scheduled dates for bills with autopay enabled, including processing fees. Manage cards in Payment methods.</p>}
                      </div>
                    </div>
                  )}
                </fieldset>
              </section>
            </div>

            <aside aria-labelledby="order-summary-title" className="min-w-0 lg:sticky lg:top-0">
              <div className="rounded-xl border border-[#d8e5dc] bg-white p-5 shadow-[0_4px_16px_rgba(21,43,38,0.03)] sm:p-6">
                <h3 id="order-summary-title" className="text-lg font-semibold">Order summary</h3>
                <dl className="mt-6 space-y-3 text-sm tabular-nums">
                  <div className="flex justify-between gap-3"><dt className="text-[#65728a]">Bill subtotal</dt><dd className="font-medium">{money.format(subtotal)}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-[#65728a]">{method === "card" ? "Processing fee (3%)" : "Processing fee"}</dt><dd className="font-medium">{money.format(fee)}</dd></div>
                  {discount > 0 && <div className="flex justify-between gap-3 text-[#008c5e]"><dt>Credits applied</dt><dd className="font-medium">-{money.format(discount)}</dd></div>}
                </dl>
                <div className="mt-5 border-t border-[#e7eeea] pt-5" aria-live="polite" aria-atomic="true">
                  <p className="text-sm font-medium text-[#65728a]">{method === "card" ? "Total to pay by card" : "Total to pay with credits"}</p>
                  <p className="mt-2 break-words text-[32px] font-semibold leading-tight tracking-tight tabular-nums text-[#142b25]">{money.format(total)}</p>
                  {method === "credits" && !creditPaymentUnavailable && <p className="mt-2 text-sm text-[#65728a]">Balance after payment: {money.format(available - subtotal)}</p>}
                </div>
                <div className="mt-5 space-y-3">
                  {cardTooSmall && <p role="alert" className="text-sm leading-5 text-red-700">Card payments must be at least $0.50. Increase the amount or use credits.</p>}
                  {invalidAmounts && <p role="alert" className="text-sm leading-5 text-red-700">Enter a valid amount for each bill, up to its total and with at most two decimal places.</p>}
                  {unavailable && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm leading-5 text-red-700">These bills are no longer available. Close this summary and select your bills again.</p>}
                  {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm leading-5 text-red-700">{error}</p>}
                </div>
                <button
                  type="button" disabled={blocked} onClick={pay}
                  className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#008f5b] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#007849] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008f5b] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processing ? <><LoaderCircle size={19} className="animate-spin" /> Processing...</> : <>{method === "card" ? <CreditCard size={19} /> : <WalletCards size={19} />}{method === "card" ? "Continue to checkout" : "Pay with credits"}</>}
                </button>
                <p className="mt-3 flex items-start justify-center gap-1.5 text-center text-sm leading-5 text-[#65728a]"><ShieldCheck size={15} className="mt-0.5 shrink-0" />{method === "card" ? "Secure card payment with Stripe" : "Submitted for review after payment"}</p>
              </div>
              {rewards > 0 && <div className="mt-4 flex items-start gap-3 rounded-xl bg-[#eaf6ee] p-4 text-[#39704e]"><Sparkles size={20} className="mt-0.5 shrink-0" /><div><p className="text-sm font-semibold">Early-payment reward</p><p className="mt-1 text-sm leading-6">Earn up to {money.format(rewards)} in credits after approval.</p></div></div>}
              <EarlyPaymentNote className="px-1 text-[#65728a]" />
            </aside>
          </div>
        </div>
      </div>
    </dialog>
  );
}
