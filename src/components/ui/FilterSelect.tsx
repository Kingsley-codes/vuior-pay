"use client";

import { ChevronDown, SlidersHorizontal } from "lucide-react";

export default function FilterSelect({
  label,
  value,
  onChange,
  options,
  icon: Icon = SlidersHorizontal,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  icon?: typeof SlidersHorizontal;
}) {
  return (
    <div className="relative min-w-0">
      <span className="mb-1.5 block text-base font-medium text-[#53637f]">
        {label}
      </span>
      <Icon
        size={15}
        className="pointer-events-none absolute left-3 top-[44px] text-[#7b879b]"
      />
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-lg border border-[#dfe5e7] bg-white pl-9 pr-9 text-base text-[#344260] outline-none transition hover:border-[#bacbc3] focus:border-[#00a96b] focus:ring-2 focus:ring-[#00a96b]/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-[44px] text-[#7b879b]"
      />
    </div>
  );
}

