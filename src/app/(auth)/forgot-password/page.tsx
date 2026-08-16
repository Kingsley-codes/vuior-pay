"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { forgotPassword } from "@/services/authService";
import { getAuthErrorMessage } from "@/services/authErrors";
import AuthFormShell from "@/components/auth/AuthFormShell";
import AuthInput from "@/components/auth/AuthInput";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    setError("");
    setNotice("");

    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword(trimmedEmail);
      setNotice("Check your email for reset instructions.");
    } catch (resetError) {
      setError(getAuthErrorMessage(resetError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormShell
      title="Reset password"
      description="Enter your email and we will send reset instructions."
    >
      <form className="space-y-7" onSubmit={handleSubmit}>
        {notice ? (
          <div className="rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-[14px] text-[#047857]">
            {notice}
          </div>
        ) : null}

        <AuthInput
          label="Email address"
          type="email"
          name="email"
          placeholder="Enter your email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
            setNotice("");
          }}
          error={error}
          icon={<Mail size={21} strokeWidth={1.8} />}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-13.5 w-full rounded-lg bg-linear-to-r from-[#00955c] to-[#00aa6a] text-[16px] font-semibold text-white shadow-[0_8px_20px_rgba(0,157,98,0.18)] transition hover:brightness-[0.98] active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>

        <Link
          href="/login"
          className="mx-auto flex w-fit items-center gap-2 text-[14px] font-medium text-[#526080] hover:text-[#142047]"
        >
          <ArrowLeft size={17} />
          Back to login
        </Link>
      </form>
    </AuthFormShell>
  );
}
