"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  Check,
  CheckCircle2,
  Copy,
  Gift,
  LoaderCircle,
  Share2,
  Sparkles,
  TicketPercent,
  Trophy,
  UserPlus,
  UsersRound,
  WalletCards,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useVuiorData } from "@/hooks/useVuiorData";
import { useVuiorSession } from "@/hooks/useVuiorSession";
import { redeemPromoCode, redeemReferralCode } from "@/services/referrals";

type Feedback = { tone: "success" | "error"; text: string } | null;
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function ReferralsPage() {
  const { user } = useVuiorSession();
  const { transactions, totalBillPaymentsThisYear } = useVuiorData(user?.id);
  const [referralCode, setReferralCode] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [redeeming, setRedeeming] = useState<"referral" | "promo" | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [copied, setCopied] = useState(false);

  const referralCredits = useMemo(
    () =>
      transactions.filter((item) =>
        item.type.toLowerCase().includes("referral"),
      ),
    [transactions],
  );
  const totalEarned = referralCredits.reduce(
    (sum, item) => sum + Math.max(0, item.credits),
    0,
  );
  const ownCode =
    user?.referralCode || `VUIOR-${(user?.firstName || "USER").toUpperCase()}`;
  const eligibility = Math.min(
    100,
    Math.round((totalBillPaymentsThisYear / 1000) * 100),
  );

  async function copyCode() {
    await navigator.clipboard.writeText(ownCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function shareCode() {
    const text = `Join me on Vuior with referral code ${ownCode}`;
    if (navigator.share) await navigator.share({ title: "Join Vuior", text });
    else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  }

  async function redeemReferral(event: FormEvent) {
    event.preventDefault();
    const code = referralCode.trim().toUpperCase();
    setFeedback(null);
    if (!user?.id) return;
    if (code.length < 5)
      return setFeedback({
        tone: "error",
        text: "Enter a valid referral code.",
      });
    if (totalBillPaymentsThisYear < 1000)
      return setFeedback({
        tone: "error",
        text: "You need to pay at least $1,000 in bills this year before redeeming a referral code.",
      });
    setRedeeming("referral");
    try {
      const result = await redeemReferralCode(code, user.id);
      setReferralCode("");
      setFeedback({
        tone: "success",
        text: result.message || "Referral code redeemed successfully.",
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to redeem this code.",
      });
    } finally {
      setRedeeming(null);
    }
  }

  async function redeemPromo(event: FormEvent) {
    event.preventDefault();
    const code = promoCode.trim().toUpperCase();
    setFeedback(null);
    if (!user?.id) return;
    if (code.length < 3)
      return setFeedback({ tone: "error", text: "Enter a valid promo code." });
    setRedeeming("promo");
    try {
      const result = await redeemPromoCode(code, user.id);
      setPromoCode("");
      setFeedback({
        tone: "success",
        text: result.message || "Your promo credits are now available.",
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to redeem this promo code.",
      });
    } finally {
      setRedeeming(null);
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1320px] p-5 sm:p-7 lg:p-8">
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#043d33] via-[#075847] to-[#08765c] px-6 py-7 text-white shadow-[0_20px_55px_rgba(4,61,51,.18)] sm:px-9 sm:py-9">
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[55px] border-white/5" />
          <div className="absolute -bottom-24 left-[38%] h-56 w-56 rounded-full bg-[#35d39b]/8 blur-2xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_420px]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[12px] font-medium text-[#c9f5e5]">
                <Sparkles size={14} /> Rewards center
              </span>
              <h1 className="mt-5 text-[32px] font-bold tracking-[-.04em] sm:text-[40px]">
                Promo and Referrals
              </h1>
              <p className="mt-3 max-w-[580px] text-[14px] leading-7 text-[#c7e4dc]">
                Unlock exclusive offers, invite friends to Vuior, and keep every
                reward in one place.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={shareCode}
                  className="flex h-11 items-center gap-2 rounded-lg bg-white px-5 text-[13px] font-semibold text-[#075544]"
                >
                  <Share2 size={16} /> Share your code
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("redeem-codes")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="flex h-11 items-center gap-2 rounded-lg border border-white/20 bg-white/8 px-5 text-[13px] font-semibold"
                >
                  Redeem a code <ArrowRight size={15} />
                </button>
              </div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[.15em] text-[#b8ded3]">
                    Your referral code
                  </p>
                  <p className="mt-1 text-[12px] text-white/65">
                    Share it with friends
                  </p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-[#62e2b5]">
                  <Gift size={22} />
                </span>
              </div>
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-dashed border-white/20 bg-[#032f28]/30 p-3">
                <strong className="min-w-0 flex-1 truncate text-[19px] tracking-[.12em]">
                  {ownCode}
                </strong>
                <button
                  onClick={copyCode}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-[#075544]"
                  aria-label="Copy referral code"
                >
                  {copied ? <Check size={17} /> : <Copy size={17} />}
                </button>
              </div>
              <p className="mt-3 flex items-center gap-2 text-[11px] text-[#b8ded3]">
                <CheckCircle2 size={14} />{" "}
                {copied ? "Code copied to clipboard" : "Ready to share"}
              </p>
            </div>
          </div>
        </section>

        {feedback ? (
          <div
            role="status"
            className={`mt-5 flex items-center gap-3 rounded-xl border px-4 py-3 text-[13px] ${feedback.tone === "success" ? "border-[#b9ead7] bg-[#effbf6] text-[#087553]" : "border-[#fecdd3] bg-[#fff1f2] text-[#be123c]"}`}
          >
            <CheckCircle2 size={18} />
            {feedback.text}
          </div>
        ) : null}

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          <Metric
            icon={<UsersRound size={20} />}
            label="Successful referrals"
            value={String(referralCredits.length)}
            note="Friends rewarded"
          />
          <Metric
            icon={<WalletCards size={20} />}
            label="Referral rewards"
            value={money.format(totalEarned)}
            note="Total credits earned"
          />
          <article className="rounded-2xl border border-[#e1e8e5] bg-white p-5 shadow-[0_8px_28px_rgba(25,55,47,.04)]">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#fff6e9] text-[#e68a16]">
                <Trophy size={20} />
              </span>
              <span className="text-[12px] text-[#718097]">{eligibility}%</span>
            </div>
            <p className="mt-4 text-[12px] text-[#65728a]">
              Referral eligibility
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#edf1ef]">
              <div
                className="h-full rounded-full bg-[#00a36a]"
                style={{ width: `${eligibility}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-[#7c899c]">
              {money.format(totalBillPaymentsThisYear)} of $1,000 paid
            </p>
          </article>
        </section>

        <section id="redeem-codes" className="mt-5 grid gap-5 xl:grid-cols-2">
          <RedeemCard
            icon={<TicketPercent size={22} />}
            eyebrow="Limited offers"
            title="Redeem a promo code"
            description="Apply an eligible campaign or partner offer directly to your Vuior wallet."
            accent="promo"
          >
            <form onSubmit={redeemPromo} className="mt-6">
              <label className="text-[12px] font-medium text-[#42516b]">
                Promo code
              </label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input
                  aria-label="Promo code"
                  value={promoCode}
                  onChange={(event) =>
                    setPromoCode(event.target.value.toUpperCase())
                  }
                  placeholder="ENTER PROMO CODE"
                  className="h-12 min-w-0 flex-1 rounded-lg border border-[#dce4e2] bg-white px-4 text-[14px] uppercase tracking-[.08em] outline-none focus:border-[#00a36a]"
                />
                <ActionButton busy={redeeming === "promo"}>
                  Apply promo
                </ActionButton>
              </div>
            </form>
          </RedeemCard>
          <RedeemCard
            icon={<UserPlus size={22} />}
            eyebrow="Invited by someone?"
            title="Redeem a referral code"
            description="Enter your inviter’s code after you become a verified bill payer."
            accent="referral"
          >
            <form onSubmit={redeemReferral} className="mt-6">
              <label className="text-[12px] font-medium text-[#42516b]">
                Referral code
              </label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input
                  aria-label="Referral code"
                  value={referralCode}
                  onChange={(event) =>
                    setReferralCode(event.target.value.toUpperCase())
                  }
                  placeholder="ENTER REFERRAL CODE"
                  className="h-12 min-w-0 flex-1 rounded-lg border border-[#dce4e2] bg-white px-4 text-[14px] uppercase tracking-[.08em] outline-none focus:border-[#00a36a]"
                />
                <ActionButton busy={redeeming === "referral"}>
                  Redeem code
                </ActionButton>
              </div>
            </form>
          </RedeemCard>
        </section>

        <section className="mt-5 rounded-2xl border border-[#e1e8e5] bg-white p-6 shadow-[0_8px_28px_rgba(25,55,47,.04)] sm:p-7">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#00a36a]">
              Simple and rewarding
            </p>
            <h2 className="mt-2 text-[20px] font-bold">How referrals work</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              [
                Share2,
                "Share your code",
                "Send your unique Vuior code to friends and family.",
              ],
              [
                UserPlus,
                "Your friend joins",
                "They create an account and start managing bills.",
              ],
              [
                BadgePercent,
                "You both earn",
                "Rewards unlock when eligibility requirements are met.",
              ],
            ].map(([Icon, title, copy], index) => {
              const I = Icon as typeof Share2;
              return (
                <div
                  key={String(title)}
                  className="relative rounded-xl bg-[#f7faf9] p-5"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#00a36a] shadow-sm">
                    <I size={18} />
                  </span>
                  <span className="absolute right-4 top-4 text-[12px] text-[#9aa6b5]">
                    0{index + 1}
                  </span>
                  <h3 className="mt-4 text-[14px] font-semibold">
                    {String(title)}
                  </h3>
                  <p className="mt-2 text-[12px] leading-5 text-[#718097]">
                    {String(copy)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

function Metric({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-[#e1e8e5] bg-white p-5 shadow-[0_8px_28px_rgba(25,55,47,.04)]">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#eaf8f2] text-[#00a36a]">
        {icon}
      </span>
      <div>
        <p className="text-[12px] text-[#65728a]">{label}</p>
        <strong className="mt-1 block text-[24px] font-semibold text-[#10203d]">
          {value}
        </strong>
        <p className="mt-1 text-[11px] text-[#8995a7]">{note}</p>
      </div>
    </article>
  );
}
function RedeemCard({
  icon,
  eyebrow,
  title,
  description,
  accent,
  children,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  accent: "promo" | "referral";
  children: React.ReactNode;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-6 shadow-[0_8px_28px_rgba(25,55,47,.04)] sm:p-7 ${accent === "promo" ? "border-[#d9e8ff] bg-linear-to-br from-[#f4f8ff] to-white" : "border-[#d9ede5] bg-linear-to-br from-[#f2fbf7] to-white"}`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${accent === "promo" ? "bg-[#e7f0ff] text-[#3478d4]" : "bg-[#dff5eb] text-[#009b67]"}`}
        >
          {icon}
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[.13em] text-[#718097]">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-[19px] font-bold text-[#10203d]">{title}</h2>
          <p className="mt-2 text-[12px] leading-5 text-[#65728a]">
            {description}
          </p>
        </div>
      </div>
      {children}
    </article>
  );
}
function ActionButton({
  busy,
  children,
}: {
  busy: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      disabled={busy}
      className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[#009b67] px-6 text-[13px] font-semibold text-white transition hover:bg-[#008b5d] disabled:opacity-60"
    >
      {busy ? (
        <>
          <LoaderCircle className="animate-spin" size={16} /> Please wait…
        </>
      ) : (
        children
      )}
    </button>
  );
}
