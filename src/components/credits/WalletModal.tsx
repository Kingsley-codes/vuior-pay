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
  const numeric = Number(amount);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [onClose]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setResult(null);
    if (!numeric || numeric <= 0)
      return setResult({ ok: false, message: "Enter a valid amount." });
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#07142d]/60 p-3 backdrop-blur-[2px]"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-modal-title"
        className="max-h-[94vh] w-full max-w-[760px] overflow-y-auto rounded-2xl bg-white shadow-[0_24px_80px_rgba(4,33,25,.3)]"
      >
        <div className="grid md:grid-cols-[245px_1fr]">
          <aside className="relative overflow-hidden bg-linear-to-br from-[#063c33] to-[#075d4c] p-6 text-white md:p-7">
            <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full border-[30px] border-white/5" />
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10">
              <WalletCards size={22} />
            </span>
            <p className="mt-8 text-[10px] uppercase tracking-[.18em] text-[#9ed7c5]">
              Available balance
            </p>
            <strong className="mt-2 block text-[29px]">
              {money.format(available)}
            </strong>
            <div className="mt-8 space-y-4 text-[10px] leading-5 text-white/70">
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
          <form onSubmit={submit} className="p-5 sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#009b67]">
                  Vuior wallet
                </p>
                <h2
                  id="wallet-modal-title"
                  className="mt-1 text-[21px] font-bold text-[#10203d]"
                >
                  {action === "add" ? "Add funds" : "Send credits"}
                </h2>
                <p className="mt-1 text-[10px] leading-5 text-[#65728a]">
                  {action === "add"
                    ? "Choose an amount and continue to secure card checkout."
                    : "Transfer credits instantly to another verified Vuior user."}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f2f5f4] text-[#53617a]"
              >
                <X size={18} />
              </button>
            </div>
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
                  className={`h-10 rounded-lg text-[11px] font-semibold transition ${action === item ? "bg-white text-[#009b67] shadow-sm" : "text-[#718097]"}`}
                >
                  {item === "add" ? "Add funds" : "Send credits"}
                </button>
              ))}
            </div>
            <label className="mt-5 block text-[9px] font-bold uppercase tracking-[.14em] text-[#44516b]">
              Amount
            </label>
            <div className="mt-2 flex h-14 items-center rounded-xl border border-[#dfe6e4] bg-[#fafcfb] px-4 focus-within:border-[#009b67]">
              <span className="text-[20px] text-[#8792a4]">$</span>
              <input
                autoFocus
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value.replace(/[^0-9.]/g, ""))
                }
                inputMode="decimal"
                placeholder="0.00"
                className="min-w-0 flex-1 bg-transparent px-2 text-[25px] font-semibold text-[#10203d] outline-none"
              />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {presets.map((value) => (
                <button
                  type="button"
                  onClick={() => setAmount(String(value))}
                  key={value}
                  className={`h-9 rounded-lg border text-[10px] font-semibold ${numeric === value ? "border-[#00a36a] bg-[#eef9f5] text-[#009b67]" : "border-[#dfe6e4] text-[#53617a]"}`}
                >
                  {money.format(value).replace(".00", "")}
                </button>
              ))}
            </div>
            {action === "send" ? (
              <>
                <label className="mt-5 block text-[9px] font-bold uppercase tracking-[.14em] text-[#44516b]">
                  Recipient email
                </label>
                <div className="mt-2 flex h-11 items-center gap-3 rounded-xl border border-[#dfe6e4] px-4 focus-within:border-[#009b67]">
                  <Mail size={16} className="text-[#8b96a7]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@example.com"
                    className="min-w-0 flex-1 text-[11px] outline-none"
                  />
                </div>
                <p className="mt-3 rounded-lg bg-[#fff8eb] p-3 text-[9px] leading-4 text-[#8a6116]">
                  Transfers are immediate and cannot be reversed. Confirm the
                  recipient before sending.
                </p>
              </>
            ) : (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#dfe8e5] bg-[#f8fbfa] p-3">
                <CreditCard size={18} className="text-[#009b67]" />
                <div>
                  <p className="text-[10px] font-semibold">Card checkout</p>
                  <p className="mt-0.5 text-[9px] text-[#718097]">
                    Your payment is processed securely by Stripe.
                  </p>
                </div>
              </div>
            )}
            {result ? (
              <div
                className={`mt-4 flex gap-2 rounded-lg border p-3 text-[10px] ${result.ok ? "border-[#bde6d4] bg-[#effaf5] text-[#08764f]" : "border-[#fecaca] bg-[#fff1f2] text-[#b4233b]"}`}
              >
                {result.ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                <span>{result.message}</span>
              </div>
            ) : null}
            <button
              disabled={loading || numeric <= 0}
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#009b67] text-[11px] font-semibold text-white shadow-[0_8px_20px_rgba(0,155,103,.18)] hover:bg-[#00875a] disabled:opacity-50"
            >
              {loading ? (
                <LoaderCircle className="animate-spin" size={16} />
              ) : action === "add" ? (
                <CreditCard size={16} />
              ) : (
                <Send size={15} />
              )}{" "}
              {loading
                ? "Please wait…"
                : action === "add"
                  ? `Continue · ${money.format(numeric || 0)}`
                  : `Send ${money.format(numeric || 0)}`}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
