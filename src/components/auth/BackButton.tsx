"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton({ href }: { href?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => (href ? router.push(href) : router.back())}
      className="inline-flex items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-[13px] font-medium text-[#1f3358] shadow-sm transition hover:bg-[#eef3ff] active:scale-95 lg:text-white lg:bg-white/15 lg:hover:bg-white/25"
      aria-label="Go back"
    >
      <ChevronLeft size={18} strokeWidth={1.8} /> Back
    </button>
  );
}
