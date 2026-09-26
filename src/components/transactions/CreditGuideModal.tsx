"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CalendarDays, Copy, Share2, Sparkles, UserRound, UsersRound, X } from "lucide-react";
const tiers = [["1 - 3 days early", "Pay 1-3 days before due date", "+2%"], ["4 - 7 days early", "Pay 4-7 days before due date", "+5%"], ["8 - 14 days early", "Pay 8-14 days before due date", "+10%"], ["15+ days early", "Pay 15 or more days before due date", "+15%"]];
export default function CreditGuideModal({guide, referralCode, referral, onClose}: {guide: number; referralCode: string; referral: number; onClose: () => void}) {
 const dialog = useRef<HTMLDialogElement>(null);
 const [copied, setCopied] = useState(false);
 const [error, setError] = useState("");
 useEffect(() => { const element = dialog.current; element?.showModal(); return () => element?.close(); }, []);
 async function copyReferral() { try { await navigator.clipboard.writeText(referralCode); setCopied(true); } catch { setError("Unable to copy. Please copy the code manually."); } }
 async function shareReferral() { try { const text = "Join me on Vuior with referral code " + referralCode; if (navigator.share) await navigator.share({ title: "Join Vuior", text }); else await copyReferral(); } catch (error) { if (!(error instanceof Error && error.name === "AbortError")) setError("Unable to share the referral code."); } }
 return <dialog ref={dialog} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }} aria-label={["How to earn more credits", "Referral and rewards", "Use your credits"][guide]} className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl bg-white p-5 text-[#14203e] shadow-2xl backdrop:bg-[#07142d]/55">
 <button autoFocus aria-label="Close guide" onClick={onClose} className="mb-3 ml-auto grid h-9 w-9 place-items-center rounded-full bg-[#f1f4f3]"><X size={18}/></button>
           <div className="space-y-5">
            {guide === 0 && <section className="rounded-xl border border-[#e1e8e5] bg-white p-5">
              <h2 className="text-[14px] font-bold">
                How to earn more credits
              </h2>
              <div className="mt-2 divide-y divide-[#ebefed]">
                {tiers.map(([title, note, reward]) => (
                  <div className="flex items-center gap-3 py-3" key={title}>
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef8f4] text-[#00a36a]">
                      <CalendarDays size={19} />
                    </span>
                    <div className="flex-1">
                      <b className="text-[10px]">{title}</b>
                      <p className="mt-1 text-[9px] text-[#65728a]">{note}</p>
                    </div>
                    <strong className="text-[15px] text-[#009b67]">
                      {reward}
                    </strong>
                  </div>
                ))}
              </div>
            </section>}
            {guide === 1 && <section className="rounded-xl border border-[#e1e8e5] bg-white p-5">
              <h2 className="text-[14px] font-bold">Referral & Rewards</h2>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#eef8f4] text-[#00a36a]">
                  <UsersRound size={24} />
                </span>
                <p className="text-[10px] leading-4">
                  Invite friends and earn credits when they pay their first
                  bill.
                </p>
              </div>
              <label className="mt-4 block text-[10px] text-[#65728a]">
                Your referral code
              </label>
              <button
                onClick={copyReferral}
                className="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-[#dfe6e4] px-4 text-[12px] font-semibold"
              >
                <span>{copied ? "Copied!" : referralCode}</span>
                <Copy size={15} />
              </button>
              <div className="mt-3 flex justify-between text-[10px]">
                <span className="text-[#65728a]">Bonus earned</span>
                <b className="text-[#009b67]">
                  +{referral.toLocaleString()} credits
                </b>
              </div>
              <button
                onClick={shareReferral}
                className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#009b67] text-[10px] font-semibold text-white"
              >
                <Share2 size={15} /> Share referral code
              </button>
            </section>}
            {guide === 2 && <section className="rounded-xl border border-[#e1e8e5] bg-white p-5">
              <h2 className="text-[14px] font-bold">Use your credits</h2>
              <p className="mt-1 text-[10px] text-[#65728a]">
                Apply your credits to reduce your bill payments.
              </p>
              <div className="mt-3 space-y-3 text-[10px]">
                <p className="flex gap-3">
                  <UserRound size={16} className="text-[#00a36a]" /> Apply to
                  eligible bills
                </p>
                <p className="flex gap-3">
                  <Sparkles size={16} className="text-[#00a36a]" /> No minimum
                  credit balance
                </p>
              </div>
              <Link
                href="/dashboard/bills"
                className="mt-4 flex h-10 items-center justify-center rounded-md bg-[#009b67] text-[10px] font-semibold text-white"
              >
                Apply credits
              </Link>
            </section>}
          </div>
 {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
 </dialog>;
}

