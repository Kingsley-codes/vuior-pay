"use client";

import { FormEvent, useMemo, useState } from "react";
import { Check, Copy, Gift, Share2, Tag, UserPlus, UsersRound, WalletCards } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useVuiorData } from "@/hooks/useVuiorData";
import { useVuiorSession } from "@/hooks/useVuiorSession";
import { redeemPromoCode, redeemReferralCode } from "@/services/referrals";

type Feedback = { tone: "success" | "error"; text: string } | null;

export default function ReferralsPage() {
  const { user } = useVuiorSession();
  const { transactions, totalBillPaymentsThisYear } = useVuiorData(user?.id);
  const [referralCode, setReferralCode] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [redeeming, setRedeeming] = useState<"referral" | "promo" | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [copied, setCopied] = useState(false);

  const referralCredits = useMemo(
    () => transactions.filter((item) => item.type.toLowerCase().includes("referral")),
    [transactions],
  );
  const totalEarned = referralCredits.reduce((sum, item) => sum + item.credits, 0);
  const ownCode = user?.referralCode || `VUIOR-${(user?.firstName || "USER").toUpperCase()}`;

  async function copyCode() {
    await navigator.clipboard.writeText(ownCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function redeemReferral(event: FormEvent) {
    event.preventDefault();
    const code = referralCode.trim();
    setFeedback(null);
    if (!user?.id) return;
    if (code.length < 5) return setFeedback({ tone: "error", text: "Enter a valid referral code." });
    if (totalBillPaymentsThisYear < 1000) return setFeedback({ tone: "error", text: "You need to pay at least $1,000 in bills this year before redeeming a referral code." });
    setRedeeming("referral");
    try {
      const result = await redeemReferralCode(code, user.id);
      setReferralCode("");
      setFeedback({ tone: "success", text: result.message || "Referral code redeemed successfully." });
    } catch (error) {
      setFeedback({ tone: "error", text: error instanceof Error ? error.message : "Unable to redeem this code." });
    } finally { setRedeeming(null); }
  }

  async function redeemPromo(event: FormEvent) {
    event.preventDefault();
    const code = promoCode.trim().toUpperCase();
    setFeedback(null);
    if (!user?.id) return;
    if (code.length < 3) return setFeedback({ tone: "error", text: "Enter a valid promo code." });
    setRedeeming("promo");
    try {
      const result = await redeemPromoCode(code, user.id);
      setPromoCode("");
      setFeedback({ tone: "success", text: result.message || "Your promo credits are now available." });
    } catch (error) {
      setFeedback({ tone: "error", text: error instanceof Error ? error.message : "Unable to redeem this promo code." });
    } finally { setRedeeming(null); }
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1120px] px-5 py-8 sm:px-8 lg:py-10">
        <div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#00a36a]">Rewards</p><h1 className="mt-2 text-2xl font-bold tracking-[-.03em] sm:text-[30px]">Referrals & promotions</h1><p className="mt-2 text-[13px] text-[#68758d]">Invite friends, track your rewards, and redeem eligible codes.</p></div>

        {feedback ? <div role="status" className={`mt-6 rounded-lg border px-4 py-3 text-[13px] ${feedback.tone === "success" ? "border-[#b9ead7] bg-[#effbf6] text-[#087553]" : "border-[#fecdd3] bg-[#fff1f2] text-[#be123c]"}`}>{feedback.text}</div> : null}

        <div className="mt-7 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <section className="overflow-hidden rounded-2xl bg-[#071a35] p-6 text-white shadow-[0_18px_50px_rgba(7,26,53,.13)] sm:p-7">
            <div className="grid grid-cols-2 divide-x divide-white/12">
              <Stat icon={<UsersRound size={20}/>} label="Total referrals" value={String(referralCredits.length)} />
              <Stat icon={<WalletCards size={20}/>} label="Total earned" value={`$${totalEarned.toFixed(2)}`} accent />
            </div>
            <div className="mt-7 border-t border-white/10 pt-6"><p className="text-[11px] text-[#9eabc0]">Your referral code</p><div className="mt-2 flex items-center gap-3"><strong className="min-w-0 flex-1 truncate text-xl tracking-[.12em]">{ownCode}</strong><button onClick={copyCode} className="flex h-10 items-center gap-2 rounded-lg bg-white/10 px-4 text-[12px] font-semibold transition hover:bg-white/15">{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? "Copied" : "Copy"}</button></div></div>
          </section>

          <section className="rounded-2xl border border-[#e1e8e5] bg-white p-6 shadow-[0_8px_28px_rgba(25,55,47,.04)]">
            <div className="flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf8f2] text-[#00a36a]"><Share2 size={19}/></span><div><h2 className="text-[15px] font-bold">Share and earn together</h2><p className="mt-1 text-[12px] leading-5 text-[#718097]">You both earn credits when your friend becomes a verified bill payer.</p></div></div>
            <div className="mt-5 rounded-xl bg-[#f2fbf7] px-4 py-3 text-[11px] leading-5 text-[#52677b]">Verified bill payers have paid $1,000 or more in bills during the current year.</div>
          </section>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <CodeCard icon={<UserPlus size={19}/>} title="Redeem a referral code" description="Enter the code from the person who invited you.">
            <form onSubmit={redeemReferral} className="flex flex-col gap-3 sm:flex-row"><input aria-label="Referral code" value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())} placeholder="Enter referral code" className="h-12 min-w-0 flex-1 rounded-lg border border-[#dce4e2] bg-[#fbfcfc] px-4 text-[13px] font-semibold uppercase tracking-wider outline-none focus:border-[#00a36a]"/><ActionButton busy={redeeming === "referral"}>Redeem</ActionButton></form>
          </CodeCard>
          <CodeCard icon={<Tag size={19}/>} title="Redeem a promo code" description="Apply an eligible Vuior offer to your wallet.">
            <form onSubmit={redeemPromo} className="flex flex-col gap-3 sm:flex-row"><input aria-label="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder="PROMO CODE" className="h-12 min-w-0 flex-1 rounded-lg border border-[#dce4e2] bg-[#fbfcfc] px-4 text-[13px] font-semibold uppercase tracking-wider outline-none focus:border-[#00a36a]"/><ActionButton busy={redeeming === "promo"}>Apply</ActionButton></form>
          </CodeCard>
        </div>

        <section className="mt-5 rounded-2xl border border-[#e1e8e5] bg-white p-6 shadow-[0_8px_28px_rgba(25,55,47,.04)]"><h2 className="text-[15px] font-bold">How referral rewards work</h2><div className="mt-5 grid gap-4 md:grid-cols-3">{[[Share2,"Share your code","Send your unique code to friends and family."],[UserPlus,"Your friend joins","They create an account using your referral code."],[Gift,"Earn rewards","You both receive credits after they become verified."]].map(([Icon,title,copy], index) => { const I = Icon as typeof Share2; return <div key={String(title)} className="relative rounded-xl border border-[#e7ecea] p-5"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#eaf8f2] text-[#00a36a]"><I size={18}/></span><span className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-[#f0f8f5] text-[10px] font-bold text-[#00a36a]">{index + 1}</span><h3 className="mt-4 text-[13px] font-bold">{String(title)}</h3><p className="mt-1 text-[11px] leading-5 text-[#748197]">{String(copy)}</p></div>})}</div></section>
      </div>
    </DashboardShell>
  );
}

function Stat({ icon, label, value, accent = false }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) { return <div className="px-4 first:pl-0 last:pr-0 sm:px-7"><span className="grid h-10 w-10 place-items-center rounded-full bg-white/8 text-[#28c68e]">{icon}</span><p className="mt-3 text-[11px] text-[#9eabc0]">{label}</p><strong className={`mt-1 block text-2xl ${accent ? "text-[#2bd195]" : "text-white"}`}>{value}</strong></div> }
function CodeCard({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) { return <section className="rounded-2xl border border-[#e1e8e5] bg-white p-6 shadow-[0_8px_28px_rgba(25,55,47,.04)]"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf8f2] text-[#00a36a]">{icon}</span><div><h2 className="text-[14px] font-bold">{title}</h2><p className="mt-0.5 text-[11px] text-[#77849a]">{description}</p></div></div><div className="mt-5">{children}</div></section> }
function ActionButton({ busy, children }: { busy: boolean; children: React.ReactNode }) { return <button disabled={busy} className="h-12 rounded-lg bg-[#00a36a] px-7 text-[12px] font-bold text-white transition hover:bg-[#008f5d] disabled:opacity-60">{busy ? "Please wait…" : children}</button> }
