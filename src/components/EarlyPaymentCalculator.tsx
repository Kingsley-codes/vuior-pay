"use client";

import { useId, useState } from "react";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import EarlyPaymentNote from "@/components/EarlyPaymentNote";

const tiers = [
  { days: "1–3 days", rate: 2 },
  { days: "4–7 days", rate: 5 },
  { days: "8–14 days", rate: 10 },
  { days: "15+ days", rate: 15 },
];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function EarlyPaymentCalculator() {
  const id = useId();
  const [amount, setAmount] = useState("100");
  const [selectedTier, setSelectedTier] = useState(3);
  const numericAmount = Number(amount);
  const calculatedReward = Math.round(numericAmount * tiers[selectedTier].rate) / 100;
  const invalidAmount = amount !== "" && (
    !Number.isFinite(numericAmount) || numericAmount <= 0 || !Number.isFinite(calculatedReward)
  );
  const reward = amount !== "" && !invalidAmount ? calculatedReward : 0;

  return (
    <div className="mx-auto w-full min-w-0 max-w-[640px] rounded-2xl border border-[#dfe9e6] bg-white p-5 shadow-[0_12px_40px_#133c300b] sm:p-7">
      <div className="flex items-center gap-2 text-[14px] font-bold tracking-[0.09em] text-[#00895f]">
        <Sparkles size={15} aria-hidden="true" />
        TRY IT OUT
      </div>
      <h3 className="mt-3 text-[25px] font-bold leading-tight tracking-[-0.7px] text-[#07142d] sm:text-[28px]">
        See what you could earn
      </h3>
      <p className="mt-2 text-[16px] leading-6 text-[#58677b]">
        A little earlier can go a long way. Explore your potential credits.
      </p>

      <label htmlFor={`${id}-amount`} className="mt-6 block text-[15px] font-semibold text-[#253b46]">
        Your bill amount
      </label>
      <div className="mt-2 flex h-12 items-center gap-3 rounded-lg border border-[#d9e4df] bg-[#fbfdfc] px-4 transition focus-within:border-[#009268] focus-within:ring-2 focus-within:ring-[#009268]/10">
        <span aria-hidden="true" className="text-[18px] text-[#718091]">$</span>
        <input
          id={`${id}-amount`}
          type="number"
          min="0.01"
          step="0.01"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          aria-invalid={invalidAmount}
          aria-describedby={invalidAmount ? `${id}-error` : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-[18px] font-semibold tabular-nums text-[#07142d] outline-none"
        />
        <span className="text-[14px] font-medium text-[#718091]">USD</span>
      </div>
      {invalidAmount && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-red-700">
          Enter a valid bill amount greater than zero.
        </p>
      )}

      <fieldset className="mt-5">
        <legend className="text-[15px] font-semibold text-[#253b46]">How early would you pay?</legend>
        <div className="mt-2.5 grid grid-cols-2 gap-2 min-[620px]:grid-cols-4 min-[901px]:grid-cols-2 min-[1280px]:grid-cols-4">
          {tiers.map((tier, index) => (
            <label
              key={tier.rate}
              className={`relative flex cursor-pointer flex-col items-center rounded-lg border px-2 py-3 transition focus-within:ring-2 focus-within:ring-[#009268] focus-within:ring-offset-2 ${selectedTier === index ? "border-[#009268] bg-[#edf8f3] text-[#006d4e]" : "border-[#e0e8e4] bg-white text-[#58677b] hover:border-[#8bc6af] hover:bg-[#fbfdfc]"}`}
            >
              <input
                type="radio"
                name={`${id}-timing`}
                value={index}
                checked={selectedTier === index}
                onChange={() => setSelectedTier(index)}
                className="sr-only"
              />
              <span className="text-[14px] font-semibold">{tier.days} early</span>
              <span className="mt-1 text-[14px]">{tier.rate}% in credits</span>
              {selectedTier === index && <Check size={11} className="absolute right-1 top-1 text-[#009268]" aria-hidden="true" />}
            </label>
          ))}
        </div>
      </fieldset>

      <div aria-live="polite" aria-atomic="true" className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#d8ece2] bg-linear-to-br from-[#f1faf5] to-[#e7f5ed] px-5 py-5">
        <div>
          <p className="text-[14px] font-medium text-[#527064]">Estimated credits after approval</p>
          <p className="mt-1.5 text-[40px] font-bold leading-none tracking-[-1.5px] tabular-nums text-[#006b4f]">{money.format(reward)}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-[#c5e6d4] bg-white/75 px-3 py-1.5 text-[14px] font-semibold text-[#087057]">
          <ArrowUpRight size={14} aria-hidden="true" /> {tiers[selectedTier].rate}% reward
        </span>
      </div>
      <p className="mt-4 text-[14px] leading-5 text-[#718091]">
        For illustration only. Eligible credits are confirmed at payment and added after approval for use on a future bill. Processing fees are excluded.
      </p>
      <EarlyPaymentNote className="text-[#65728a]" />
    </div>
  );
}
