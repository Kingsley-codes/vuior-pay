import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export default function CollapsibleGuideSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="group/guide rounded-b-2xl border-t border-white/10 bg-black/10">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-b-2xl px-5 py-4 text-base font-semibold text-[#b6f4d4] transition hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#b6f4d4] sm:px-7 [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <ChevronDown size={20} aria-hidden="true" className="shrink-0 transition-transform group-open/guide:rotate-180 motion-reduce:transition-none" />
      </summary>
      <div className="border-t border-white/10 p-5 sm:p-7">{children}</div>
    </details>
  );
}
