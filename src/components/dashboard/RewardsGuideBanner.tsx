import EarlyPaymentNote from "@/components/EarlyPaymentNote";
import { ArrowUpRight, Sparkles, type LucideIcon } from "lucide-react";

type GuideAction = {
  label: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
};

export default function RewardsGuideBanner({
  title,
  description,
  badge,
  actions,
}: {
  title: string;
  description: string;
  badge: string;
  actions: GuideAction[];
}) {
  return (
    <section className="relative isolate overflow-hidden rounded-2xl border border-[#156754] bg-linear-to-br from-[#073e35] via-[#075747] to-[#08775b] p-5 text-white shadow-[0_8px_28px_rgba(7,62,53,0.12)] sm:p-6">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-32 -z-10 h-72 w-72 rounded-full border-[40px] border-white/5" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 left-1/3 -z-10 h-56 w-56 rounded-full bg-[#43dfa1]/10 blur-3xl" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] xl:items-center">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-[#9ce7c6]/25 bg-[#9ce7c6]/10 text-[#b5f5d6]">
              <Sparkles size={16} aria-hidden="true" />
            </span>
            <span className="rounded-full border border-[#b5f5d6]/20 bg-[#b5f5d6]/10 px-3 py-1 text-base font-semibold tracking-wide text-[#c4f7df]">
              {badge}
            </span>
          </div>
          <h2 className="text-[19px] font-bold tracking-[-0.025em] sm:text-[21px]">{title}</h2>
          <p className="mt-2 max-w-md text-base leading-6 text-[#c0dfd4]">{description}</p>
        </div>
        <div className={`grid gap-2.5 ${actions.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {actions.map(({ label, description: actionDescription, icon: Icon, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className="group flex h-full flex-col rounded-xl border border-white/15 bg-white/[0.08] p-4 text-left transition hover:border-[#a8edcd]/50 hover:bg-white/[0.14] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b5f5d6]"
            >
              <span className="mb-4 flex w-full items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#c4f7df] text-[#086348]">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <ArrowUpRight size={16} className="text-[#a8d7c6] transition group-hover:text-white" aria-hidden="true" />
              </span>
              <span className="text-base font-semibold">{label}</span>
              <span className="mt-1 text-base leading-6 text-[#c0dfd4]">{actionDescription}</span>
            </button>
          ))}
        </div>
      </div>
      <EarlyPaymentNote className="text-[#c7e4dc]" />
    </section>
  );
}
