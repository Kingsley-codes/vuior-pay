"use client";

import Link from "next/link";
import { Eye, LockKeyhole, Mail } from "lucide-react";
import AuthFormShell from "@/components/auth/AuthFormShell";
import AuthInput from "@/components/auth/AuthInput";
import GoogleButton from "@/components/auth/GoogleButton";

export default function LoginPage() {
  return (
    <AuthFormShell
      title="Log in"
      description="Access your bills, payments, and credits."
    >
      <form className="space-y-7" onSubmit={(event) => event.preventDefault()}>
        <AuthInput
          label="Email address"
          type="email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          icon={<Mail size={21} strokeWidth={1.8} />}
          required
        />

        <AuthInput
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          icon={<LockKeyhole size={21} strokeWidth={1.8} />}
          trailingIcon={<Eye size={21} strokeWidth={1.8} />}
          required
        />

        <div className="flex items-center justify-between gap-4 text-[14px]">
          <label className="flex cursor-pointer items-center gap-3 text-[#263454]">
            <input type="checkbox" defaultChecked className="auth-checkbox" />
            <span>Remember me</span>
          </label>

          <Link
            href="/forgot-password"
            className="font-medium text-[#009d62] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="h-13.5 w-full rounded-lg bg-linear-to-r from-[#00955c] to-[#00aa6a] text-[16px] font-semibold text-white shadow-[0_8px_20px_rgba(0,157,98,0.18)] transition hover:brightness-[0.98] active:scale-[0.995]"
        >
          Log in
        </button>

        <div className="flex items-center gap-5">
          <div className="h-px flex-1 bg-[#dfe3eb]" />
          <span className="text-[14px] text-[#78829c]">or</span>
          <div className="h-px flex-1 bg-[#dfe3eb]" />
        </div>

        <GoogleButton />

        <p className="pt-2 text-center text-[14px] text-[#33405f]">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-[#009d62] hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthFormShell>
  );
}
