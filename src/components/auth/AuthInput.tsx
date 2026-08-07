import type { InputHTMLAttributes, ReactNode } from "react";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: ReactNode;
  trailingIcon?: ReactNode;
  error?: string;
};

export default function AuthInput({
  label,
  icon,
  trailingIcon,
  error,
  className = "",
  ...props
}: AuthInputProps) {
  return (
    <label className="block">
      <span className="mb-3 block text-[15px] font-semibold text-[#16234c]">
        {label}
      </span>

      <div
        className={`flex h-14.5 items-center rounded-[9px] border bg-white px-4 transition focus-within:ring-4 ${
          error
            ? "border-[#f04465] focus-within:border-[#f04465] focus-within:ring-[#f04465]/10"
            : "border-[#d8dde7] focus-within:border-[#00a968] focus-within:ring-[#00a968]/10"
        }`}
      >
        <span className="mr-3 flex shrink-0 items-center justify-center text-[#8590aa]">
          {icon}
        </span>

        <input
          {...props}
          className={`h-full min-w-0 flex-1 border-0 bg-transparent text-[15px] text-[#142047] outline-none placeholder:text-[#919ab1] ${className}`}
        />

        {trailingIcon ? (
          <span className="ml-3 flex shrink-0 items-center justify-center text-[#8590aa]">
            {trailingIcon}
          </span>
        ) : null}
      </div>

      {error ? (
        <span className="mt-2 block text-[12px] text-[#e11d48]">{error}</span>
      ) : null}
    </label>
  );
}
