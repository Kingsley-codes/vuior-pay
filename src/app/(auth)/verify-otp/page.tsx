"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthFormShell from "@/components/auth/AuthFormShell";
import OtpInput from "@/components/auth/OtpInput";

export default function VerifyOtpPage() {
  return (
    <AuthFormShell
      title="Verify your email"
      description="Enter the 6-digit code sent to you@example.com."
    >
      <form className="space-y-8" onSubmit={(event) => event.preventDefault()}>
        <OtpInput />

        <button
          type="submit"
          className="h-13.5 w-full rounded-lg bg-linear-to-r from-[#00955c] to-[#00aa6a] text-[16px] font-semibold text-white shadow-[0_8px_20px_rgba(0,157,98,0.18)] transition hover:brightness-[0.98] active:scale-[0.995]"
        >
          Verify email
        </button>

        <div className="text-center">
          <p className="text-[14px] text-[#526080]">
            Didn&apos;t receive the code?
          </p>

          <button
            type="button"
            className="mt-2 text-[14px] font-semibold text-[#009d62] hover:underline"
          >
            Resend code
          </button>
        </div>

        <Link
          href="/signup"
          className="mx-auto flex w-fit items-center gap-2 text-[14px] font-medium text-[#526080] hover:text-[#142047]"
        >
          <ArrowLeft size={17} />
          Back to signup
        </Link>
      </form>
    </AuthFormShell>
  );
}
