"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { continueWithGoogle, login } from "@/services/authService";
import { getAuthErrorMessage } from "@/services/authErrors";
import AuthFormShell from "@/components/auth/AuthFormShell";
import AuthInput from "@/components/auth/AuthInput";
import GoogleButton from "@/components/auth/GoogleButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialSubmitting, setSocialSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await login(email.trim(), password);
      router.replace(
        session.mustChangePassword ? "/dashboard/change-password" : "/dashboard",
      );
    } catch (loginError) {
      setError(getAuthErrorMessage(loginError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setSocialSubmitting(true);
    try {
      await continueWithGoogle();
      router.replace("/dashboard");
    } catch (googleError) {
      setError(getAuthErrorMessage(googleError));
    } finally {
      setSocialSubmitting(false);
    }
  }

  return (
    <AuthFormShell
      title="Log in"
      description="Access your bills, payments, and credits."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error ? (
          <div className="rounded-lg border border-[#fecdd3] bg-[#fff1f2] px-3.5 py-2.5 text-[12px] text-[#be123c]">
            {error}
          </div>
        ) : null}

        <AuthInput
          label="Email address"
          type="email"
          name="email"
          placeholder="Enter your email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          icon={<Mail size={21} strokeWidth={1.8} />}
          required
        />

        <AuthInput
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          icon={<LockKeyhole size={21} strokeWidth={1.8} />}
          trailingIcon={
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? (
                <EyeOff size={21} strokeWidth={1.8} />
              ) : (
                <Eye size={21} strokeWidth={1.8} />
              )}
            </button>
          }
          required
        />

        <div className="flex items-center justify-between gap-4 text-[12px]">
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
          disabled={isSubmitting || socialSubmitting}
          className="h-12 w-full rounded-lg bg-linear-to-r from-[#00955c] to-[#00aa6a] text-[14px] font-semibold text-white shadow-[0_7px_17px_rgba(0,157,98,0.16)] transition hover:brightness-[0.98] active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>

        <div className="flex items-center gap-5">
          <div className="h-px flex-1 bg-[#dfe3eb]" />
          <span className="text-[12px] text-[#78829c]">or</span>
          <div className="h-px flex-1 bg-[#dfe3eb]" />
        </div>

        <GoogleButton
          disabled={isSubmitting || socialSubmitting}
          label={socialSubmitting ? "Connecting..." : "Continue with Google"}
          onClick={handleGoogle}
        />

        <p className="pt-1 text-center text-[12px] text-[#33405f]">
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
