"use client";
import EarlyPaymentNote from "@/components/EarlyPaymentNote";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Coins,
  FilePlus2,
  Info,
  LifeBuoy,
  Sparkles,
  WalletCards,
} from "lucide-react";
import NotificationsMenu from "@/components/dashboard/NotificationsMenu";
import { useVuiorSession } from "@/hooks/useVuiorSession";

const tiers = [
  { days: "1–3 days early", rate: 2 },
  { days: "4–7 days early", rate: 5 },
  { days: "8–14 days early", rate: 10 },
  { days: "15+ days early", rate: 15 },
];

const steps = [
  {
    icon: FilePlus2,
    title: "Add your bill",
    description: "Enter your provider, bill amount, and due date. Attach your bill document and check that the details are correct.",
  },
  {
    icon: CalendarDays,
    title: "Pay before it’s due",
    description: "Choose an eligible bill and review your payment. The earlier you pay, the higher your potential credit reward.",
  },
  {
    icon: Coins,
    title: "Earn and use credits",
    description: "Once your payment is approved, eligible credits join your available balance. Use them toward another bill payment.",
  },
];

const faqs = [
  {
    question: "When will my credits be available?",
    answer: "Your early-payment reward is confirmed at payment and added after your bill payment is approved and marked as Paid. While a payment is In review, its pending reward is not yet available to spend. You can check your bill status in Bills and your credit activity in Transactions.",
  },
  {
    question: "Do I earn credits if I pay on or after the due date?",
    answer: "The early-payment reward applies when you pay before the due date. Payments made on the due date or later do not earn early-payment credits. Review the estimated credits on your bill and at checkout before paying.",
  },
  {
    question: "How can I use the credits I earn?",
    answer: "Open an eligible bill and choose your payment method. You can apply available credits to reduce a card payment, or pay entirely with Vuior credits when your balance covers the bill. When combining credits with a card, at least $0.50 of the bill must be paid by card. Any processing fee is shown at checkout.",
  },
  {
    question: "Is the reward taken off today’s payment?",
    answer: "Your new early-payment reward is separate from the payment you are making. It becomes available after approval for use on a future payment. Credits already in your available balance can be applied at checkout.",
  },
];

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const primaryLink = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#00a96b] px-5 text-[13px] font-semibold text-white transition hover:bg-[#008e5a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00a96b]";

export default function HowItWorksPage() {
  const { user } = useVuiorSession();
  const [amount, setAmount] = useState("100");
  const [selectedTier, setSelectedTier] = useState(3);
  const numericAmount = Number(amount);
  const invalidAmount = amount !== "" && (!Number.isFinite(numericAmount) || numericAmount <= 0);
  const reward = !invalidAmount && amount !== ""
    ? Math.round(numericAmount * tiers[selectedTier].rate) / 100
    : 0;

  return (
    <div className="mx-auto max-w-[1320px] p-5 sm:p-7 lg:p-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[29px] font-bold tracking-[-0.035em]">How it works</h1>
          <p className="mt-1.5 text-[13px] text-[#596885]">A little planning. More rewarding bill payments.</p>
        </div>
        <NotificationsMenu userId={user?.id} />
      </header>

      <section className="relative mt-7 overflow-hidden rounded-3xl bg-linear-to-br from-[#043d33] via-[#075847] to-[#08765c] p-6 text-white sm:p-9">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border-[55px] border-white/5" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-[#c9f5e5]">
              <Sparkles size={14} aria-hidden="true" /> Make early payments count
            </span>
            <h2 className="mt-5 max-w-xl text-[30px] font-bold leading-tight tracking-[-0.035em] sm:text-[38px]">Pay your bills early.<br />Get rewarded in credits.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#c7e4dc]">Bring your bills together, pay ahead of their due dates, and earn credits you can put toward future bill payments.</p>
            <Link href="/dashboard/bills?addBill=1" className={`${primaryLink} mt-6`}>Add a bill <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-[#a4f1ce]"><Coins size={24} aria-hidden="true" /></span>
            <p className="mt-5 text-sm text-[#c7e4dc]">Earn up to</p>
            <p className="mt-1 text-6xl font-bold tracking-tight">15<span className="text-4xl">%</span></p>
            <p className="mt-2 text-sm font-medium">of your eligible bill amount in credits</p>
            <p className="mt-5 border-t border-white/15 pt-4 text-xs leading-6 text-[#c7e4dc]">Pay 15 or more days early for the highest early-payment tier. Credits are added after approval.</p>
          </div>
        </div>
        <EarlyPaymentNote className="text-[#c7e4dc]" />
      </section>

      <section aria-labelledby="steps-heading" className="mt-9">
        <h2 id="steps-heading" className="text-xl font-bold tracking-tight">From bill to reward in three steps</h2>
        <p className="mt-1.5 text-[13px] text-[#65728a]">Here’s how your next payment can work harder for you.</p>
        <ol className="mt-5 grid gap-4 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <li key={title} className="rounded-2xl border border-[#e1e8e5] bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#eaf8f2] text-[#009b67]"><Icon size={21} aria-hidden="true" /></span>
                <span className="text-xs font-semibold tracking-widest text-[#65728a]">0{index + 1}</span>
              </div>
              <h3 className="mt-5 text-base font-bold">{title}</h3>
              <p className="mt-2 text-[13px] leading-6 text-[#65728a]">{description}</p>
            </li>
          ))}
        </ol>
        <EarlyPaymentNote className="text-[#65728a]" />
      </section>

      <section aria-labelledby="rewards-heading" className="mt-9 grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-[#e1e8e5] bg-white p-5 sm:p-6">
          <h2 id="rewards-heading" className="text-xl font-bold tracking-tight">Earlier payments, more credits</h2>
          <p className="mt-2 text-[13px] leading-6 text-[#65728a]">Your reward tier depends on how far ahead of the due date you pay an eligible bill.</p>
          <div className="mt-5 overflow-hidden rounded-xl border border-[#e1e8e5]">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Early-payment credit reward tiers</caption>
              <thead className="bg-[#f7faf8] text-xs text-[#65728a]"><tr><th scope="col" className="px-4 py-3 font-medium">When you pay</th><th scope="col" className="px-4 py-3 text-right font-medium">Credits earned</th></tr></thead>
              <tbody className="divide-y divide-[#edf1ef]">
                {tiers.map((tier) => (
                  <tr key={tier.rate} className={tier.rate === 15 ? "bg-[#eef8f4]" : ""}>
                    <th scope="row" className="px-4 py-4 font-medium"><span className="inline-flex items-center gap-2"><CalendarDays size={16} className="shrink-0 text-[#009b67]" aria-hidden="true" />{tier.days}</span></th>
                    <td className="px-4 py-4 text-right font-bold text-[#009b67]">{tier.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-[#65728a]"><Info size={15} className="mt-1 shrink-0" aria-hidden="true" />Payments on or after the due date earn no early-payment credits.</p>
        </div>

        <div className="rounded-2xl border border-[#d7e9df] bg-[#f0f8f4] p-5 sm:p-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#087057]"><Sparkles size={15} aria-hidden="true" /> TRY AN EXAMPLE</span>
          <h2 className="mt-3 text-xl font-bold tracking-tight">See what you could earn</h2>
          <p className="mt-2 text-[13px] leading-6 text-[#65728a]">Adjust the amount and payment timing to explore the tiers.</p>
          <label htmlFor="example-amount" className="mt-5 block text-xs font-semibold">Bill amount</label>
          <div className="mt-2 flex h-12 items-center gap-3 rounded-lg border border-[#d7e3dd] bg-white px-4 focus-within:ring-2 focus-within:ring-[#009b67]">
            <span aria-hidden="true" className="text-[#65728a]">$</span>
            <input id="example-amount" type="number" min="0.01" step="0.01" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} aria-invalid={invalidAmount} aria-describedby={invalidAmount ? "example-error" : undefined} className="h-full w-full min-w-0 bg-transparent text-sm outline-none" />
          </div>
          {invalidAmount && <p id="example-error" role="alert" className="mt-2 text-xs text-red-700">Enter a bill amount greater than zero.</p>}
          <fieldset className="mt-5">
            <legend className="text-xs font-semibold">How early would you pay?</legend>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {tiers.map((tier, index) => (
                <label key={tier.rate} className={`relative cursor-pointer rounded-lg border px-2 py-3 text-center text-xs transition focus-within:ring-2 focus-within:ring-[#009b67] focus-within:ring-offset-2 ${selectedTier === index ? "border-[#065d53] bg-[#065d53] text-white" : "border-[#d7e3dd] bg-white text-[#53617a] hover:border-[#009b67]"}`}>
                  <input type="radio" name="example-timing" value={index} checked={selectedTier === index} onChange={() => setSelectedTier(index)} className="sr-only" />
                  {tier.days}
                </label>
              ))}
            </div>
          </fieldset>
          <div aria-live="polite" aria-atomic="true" className="mt-6 flex flex-wrap items-end justify-between gap-3 border-t border-[#d7e3dd] pt-5">
            <div><p className="text-xs text-[#53617a]">Estimated credits after approval</p><p className="mt-2 text-4xl font-bold tracking-tight text-[#065d53]">{money.format(reward)}</p></div>
            <span className="rounded-full bg-[#dff1e7] px-3 py-1.5 text-xs font-semibold text-[#087057]">{tiers[selectedTier].rate}% reward</span>
          </div>
          <p className="mt-4 text-xs leading-6 text-[#65728a]">For illustration only. Your eligible reward is confirmed at payment. This reward is separate from today’s payment and does not include processing fees.</p>
          <EarlyPaymentNote className="text-[#65728a]" />
        </div>
      </section>

      <section className="mt-5 flex flex-col gap-5 rounded-2xl border border-[#e1e8e5] bg-white p-5 sm:flex-row sm:items-start sm:p-6">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#eaf8f2] text-[#009b67]"><WalletCards size={22} aria-hidden="true" /></span>
        <div className="flex-1">
          <h2 className="text-base font-bold">Your reward has a journey</h2>
          <p className="mt-2 text-[13px] leading-6 text-[#65728a]">Submit your payment → Bill is in review → Payment is approved → Credits are available.</p>
          <p className="mt-2 flex items-start gap-2 text-xs leading-6 text-[#53617a]"><CheckCircle2 size={16} className="mt-1 shrink-0 text-[#009b67]" aria-hidden="true" />Your payment date determines your reward tier, even while approval is pending.</p>
          <EarlyPaymentNote className="text-[#65728a]" />
        </div>
        <Link href="/dashboard/transactions" className="inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold text-[#087057] hover:underline">View transactions <ArrowRight size={15} aria-hidden="true" /></Link>
      </section>

      <section aria-labelledby="questions-heading" className="mt-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="questions-heading" className="text-xl font-bold tracking-tight">A few things to know</h2>
          <Link href="/help" className="inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold text-[#087057] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00a96b]">
            View all FAQs <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-5 divide-y divide-[#e1e8e5] overflow-hidden rounded-2xl border border-[#e1e8e5] bg-white px-5 sm:px-6">
          {faqs.map(({ question, answer }) => (
            <details key={question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold marker:content-none [&::-webkit-details-marker]:hidden">{question}<ChevronDown size={17} className="shrink-0 text-[#65728a] transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
              <p className="mt-3 max-w-4xl text-[13px] leading-7 text-[#65728a]">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-6 flex flex-col justify-between gap-5 rounded-2xl border border-[#e1e8e5] bg-white p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-3"><LifeBuoy size={23} className="shrink-0 text-[#009b67]" aria-hidden="true" /><div><h2 className="text-sm font-bold">Need a hand with your first payment?</h2><p className="mt-1 text-[13px] text-[#65728a]">Our support team can help you get started.</p></div></div>
        <Link href="/dashboard/support" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#dfe6e4] px-5 text-[13px] font-semibold text-[#53617a] transition hover:bg-[#f5f8f7]">Contact support <ArrowRight size={15} aria-hidden="true" /></Link>
      </section>
    </div>
  );
}
