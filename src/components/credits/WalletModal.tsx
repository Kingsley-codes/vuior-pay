"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  Mail,
  Send,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X,
  XCircle,
} from "lucide-react";
import {
  checkoutUrl,
  createCreditsCheckout,
  sendCredits,
} from "@/services/payments";
import {
  currencyInputNumber,
  formatCurrencyInput,
} from "@/utils/inputFormatting";

export type WalletAction = "add" | "send";
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function WalletModal({
  initialAction,
  userId,
  available,
  onClose,
}: {
  initialAction: WalletAction;
  userId: string;
  available: number;
  onClose: () => void;
}) {
  const [action, setAction] = useState<WalletAction>(initialAction);
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const numeric = currencyInputNumber(amount);
  const invalidCheckoutAmount = action === "add" && amount !== "" && (numeric < 0.5 || numeric > 999999.99);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", close);
    };
  }, [onClose]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setResult(null);
    if (!numeric || numeric <= 0)
      return setResult({ ok: false, message: "Enter a valid amount." });
    if (invalidCheckoutAmount)
      return setResult({ ok: false, message: "Enter an amount between $0.50 and $999,999.99 per card payment." });
    if (action === "send" && numeric > available)
      return setResult({
        ok: false,
        message: "This amount exceeds your available credits.",
      });
    if (action === "send" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return setResult({
        ok: false,
        message: "Enter the verified email on the recipient's Vuior account.",
      });
    setLoading(true);
    try {
      if (action === "add") {
        const checkout = await createCreditsCheckout(userId, numeric);
        window.location.assign(checkoutUrl(checkout));
      } else {
        const response = await sendCredits(
          userId,
          email.trim().toLowerCase(),
          numeric,
        );
        setAmount("");
        setEmail("");
        setResult({
          ok: true,
          message: response.message || "Credits sent successfully.",
        });
      }
    } catch (cause) {
      setResult({
        ok: false,
        message:
          cause instanceof Error
            ? cause.message
            : "Unable to complete this request.",
      });
    } finally {
      setLoading(false);
    }
  }

  const presets = action === "add" ? [25, 50, 100, 250] : [10, 20, 50, 100];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#07142d]/60 p-2 backdrop-blur-[2px] sm:p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-modal-title"
        className="grid max-h-[calc(100dvh-1rem)] w-full min-w-0 max-w-[760px] grid-cols-[minmax(0,1fr)] overflow-hidden rounded-2xl bg-white shadow-[0_24px_80px_rgba(4,33,25,.3)] sm:max-h-[calc(100dvh-2rem)] md:grid-cols-[245px_minmax(0,1fr)]"
      >
        <aside className="relative hidden min-w-0 overflow-y-auto bg-linear-to-br from-[#063c33] to-[#075d4c] p-7 text-white [overflow-wrap:anywhere] md:block">
          <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full border-[30px] border-white/5" />
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10">
            <WalletCards size={22} />
          </span>
          <p className="mt-8 text-base uppercase tracking-[.18em] text-[#9ed7c5]">
            Available Credits
          </p>
          <strong className="mt-2 block text-[29px]">
            {money.format(available)}
          </strong>
          <div className="mt-8 space-y-4 text-base leading-6 text-white/70">
            <p className="flex gap-2">
              <ShieldCheck
                className="mt-0.5 shrink-0 text-[#5ee0b4]"
                size={15}
              />{" "}
              Secure checkout and encrypted transfers.
            </p>
            <p className="flex gap-2">
              <Sparkles
                className="mt-0.5 shrink-0 text-[#5ee0b4]"
                size={15}
              />{" "}
              Use credits to pay eligible bills early.
            </p>
          </div>
        </aside>
        <form onSubmit={submit} className="flex max-h-[calc(100dvh-1rem)] min-h-0 w-full min-w-0 flex-col sm:max-h-[calc(100dvh-2rem)]">
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#e7eeea] px-4 py-4 sm:px-7 sm:py-5">
            <div className="min-w-0">
              <p className="text-base font-bold uppercase tracking-[.16em] text-[#009b67]">
                Vuior wallet
              </p>
              <h2
                id="wallet-modal-title"
                className="mt-1 text-[21px] font-bold text-[#10203d]"
              >
                {action === "add" ? "Add funds" : "Send credits"}
              </h2>
            </div>
            <button
              type="button"
              autoFocus
              onClick={onClose}
              aria-label="Close"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f2f5f4] text-[#53617a]"
            >
              <X size={18} />
            </button>
          </div>
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 [overflow-wrap:anywhere] sm:px-7 sm:py-5">
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl bg-[#edf8f3] p-3 text-[#075d4c] md:hidden">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white">
                <WalletCards size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-base text-[#536d63]">Available credits</p>
                <strong className="block break-words text-2xl leading-tight">{money.format(available)}</strong>
              </div>
            </div>
            <p className="text-base leading-6 text-[#65728a]">
              {action === "add"
                ? "Choose an amount and continue to secure card checkout."
                : "Transfer credits instantly to another verified Vuior user."}
            </p>
            <div className="mt-5 grid grid-cols-2 rounded-xl bg-[#f3f6f5] p-1.5">
              {(["add", "send"] as WalletAction[]).map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => {
                    setAction(item);
                    setResult(null);
                    setAmount("");
                  }}
                  className={`min-h-11 rounded-lg px-2 py-2 text-base font-semibold transition ${action === item ? "bg-white text-[#009b67] shadow-sm" : "text-[#718097]"}`}
                >
                  {item === "add" ? "Add funds" : "Send credits"}
                </button>
              ))}
            </div>
            <label htmlFor="wallet-amount" className="mt-5 block text-base font-bold uppercase tracking-[.14em] text-[#44516b]">
              Amount<span className="text-red-600" aria-label="required"> *</span>
            </label>
            <div className="mt-2 flex h-14 min-w-0 items-center rounded-xl border border-[#dfe6e4] bg-[#fafcfb] px-4 focus-within:border-[#009b67]">
              <span className="text-[20px] text-[#8792a4]">$</span>
              <input
                id="wallet-amount"
                required
                value={amount}
                onChange={(event) =>
                  setAmount(formatCurrencyInput(event.target.value))
                }
                inputMode="decimal"
                aria-invalid={invalidCheckoutAmount}
                aria-describedby={action === "add" ? "wallet-amount-help" : undefined}
                placeholder="0.00"
                className="w-0 min-w-0 flex-1 bg-transparent px-2 text-[25px] font-semibold text-[#10203d] outline-none"
              />
            </div>
            {action === "add" && (
              <p id="wallet-amount-help" role={invalidCheckoutAmount ? "alert" : undefined} className={`mt-2 text-base ${invalidCheckoutAmount ? "text-[#b4233b]" : "text-[#718097]"}`}>
                {invalidCheckoutAmount
                  ? "Enter an amount between $0.50 and $999,999.99 per card payment."
                  : "Card payments: $0.50 to $999,999.99 per payment."}
              </p>
            )}
            <div className="mt-3 grid grid-cols-4 gap-2">
              {presets.map((value) => (
                <button
                  type="button"
                  onClick={() => setAmount(formatCurrencyInput(String(value)))}
                  key={value}
                  className={`min-h-11 min-w-0 rounded-lg border px-1 py-2 text-base font-semibold ${numeric === value ? "border-[#00a36a] bg-[#eef9f5] text-[#009b67]" : "border-[#dfe6e4] text-[#53617a]"}`}
                >
                  {money.format(value).replace(".00", "")}
                </button>
              ))}
            </div>
            {action === "send" ? (
              <>
                <label htmlFor="wallet-recipient" className="mt-5 block text-base font-bold uppercase tracking-[.14em] text-[#44516b]">
                  Recipient email<span className="text-red-600" aria-label="required"> *</span>
                </label>
                <div className="mt-2 flex h-11 min-w-0 items-center gap-3 rounded-xl border border-[#dfe6e4] px-4 focus-within:border-[#009b67]">
                  <Mail size={16} className="shrink-0 text-[#8b96a7]" />
                  <input
                    id="wallet-recipient"
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@example.com"
                    className="w-0 min-w-0 flex-1 text-base outline-none"
                  />
                </div>
                <p className="mt-3 rounded-lg bg-[#fff8eb] p-3 text-base leading-6 text-[#8a6116]">
                  Transfers are immediate and cannot be reversed. Confirm the
                  recipient before sending.
                </p>
              </>
            ) : (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#dfe8e5] bg-[#f8fbfa] p-3">
                <CreditCard size={18} className="shrink-0 text-[#009b67]" />
                <div className="min-w-0">
                  <p className="text-base font-semibold">Card checkout</p>
                  <p className="mt-0.5 text-base text-[#718097]">
                    Your payment is processed securely by Stripe.
                  </p>
                </div>
              </div>
            )}
            {result ? (
              <div
                className={`mt-4 flex gap-2 rounded-lg border p-3 text-base ${result.ok ? "border-[#bde6d4] bg-[#effaf5] text-[#08764f]" : "border-[#fecaca] bg-[#fff1f2] text-[#b4233b]"}`}
              >
                {result.ok ? <CheckCircle2 size={16} className="mt-1 shrink-0" /> : <XCircle size={16} className="mt-1 shrink-0" />}
                <span className="min-w-0 break-words">{result.message}</span>
              </div>
            ) : null}
          </div>
          <div className="shrink-0 border-t border-[#e7eeea] bg-white px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-7 sm:py-5">
            <button
              disabled={loading || numeric <= 0 || invalidCheckoutAmount}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#009b67] px-3 py-3 text-base font-semibold text-white shadow-[0_8px_20px_rgba(0,155,103,.18)] hover:bg-[#00875a] disabled:opacity-50"
            >
              {loading ? (
                <LoaderCircle className="shrink-0 animate-spin" size={16} />
              ) : action === "add" ? (
                <CreditCard size={16} className="shrink-0" />
              ) : (
                <Send size={15} className="shrink-0" />
              )}{" "}
              <span className="min-w-0 break-words">{loading
                ? "Please wait…"
                : action === "add"
                  ? `Continue · ${money.format(numeric || 0)}`
                  : `Send ${money.format(numeric || 0)}`}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
