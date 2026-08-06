"use client";

import Link from "next/link";
import { Eye, LockKeyhole, Mail, UserRound } from "lucide-react";
import AuthFormShell from "@/components/auth/AuthFormShell";
import AuthInput from "@/components/auth/AuthInput";
import GoogleButton from "@/components/auth/GoogleButton";

export default function SignupPage() {
  return (
    <AuthFormShell
      title="Create account"
      description="Start managing bills and earning credits."
    >
      <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
        <AuthInput
          label="Full name"
          type="text"
          name="name"
          placeholder="Enter your full name"
          autoComplete="name"
          icon={<UserRound size={21} strokeWidth={1.8} />}
          required
        />

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
          placeholder="Create a password"
          autoComplete="new-password"
          icon={<LockKeyhole size={21} strokeWidth={1.8} />}
          trailingIcon={<Eye size={21} strokeWidth={1.8} />}
          required
        />

        <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-5 text-[#526080]">
          <input type="checkbox" className="auth-checkbox mt-0.5" />
          <span>
            I agree to the{" "}
            <Link
              href="/terms"
              className="font-medium text-[#009d62] hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-[#009d62] hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <button
          type="submit"
          className="h-13.5 w-full rounded-lg bg-linear-to-r from-[#00955c] to-[#00aa6a] text-[16px] font-semibold text-white shadow-[0_8px_20px_rgba(0,157,98,0.18)] transition hover:brightness-[0.98] active:scale-[0.995]"
        >
          Create account
        </button>

        <div className="flex items-center gap-5">
          <div className="h-px flex-1 bg-[#dfe3eb]" />
          <span className="text-[14px] text-[#78829c]">or</span>
          <div className="h-px flex-1 bg-[#dfe3eb]" />
        </div>

        <GoogleButton label="Sign up with Google" />

        <p className="pt-1 text-center text-[14px] text-[#33405f]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#009d62] hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </AuthFormShell>
  );
}
