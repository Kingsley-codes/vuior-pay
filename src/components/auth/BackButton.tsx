"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton({ href }: { href?: string }) {
  const router = useRouter();

  return (
    <div className="-mx-5 mb-4 flex w-full">
      <button
        type="button"
        onClick={() => (href ? router.push(href) : router.back())}
        className="inline-flex items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2 text-[13px] font-medium text-[#1f3358] shadow-sm hover:bg-[#eef3ff]"
      >
        <ChevronLeft size={18} strokeWidth={1.8} /> Back
      </button>
    </div>
  );
}
