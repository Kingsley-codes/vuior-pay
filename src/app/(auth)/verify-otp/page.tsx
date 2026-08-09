"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { updatePassword } from "firebase/auth";
import { auth } from "@/auth/firebase";
import { logAuditEvent } from "@/auth/auditLog";
import { getAuthErrorMessage } from "@/auth/authErrors";
import { registerUser } from "@/auth/authService";
import {
  clearPendingRegistration,
  getPendingRegistration,
} from "@/auth/pendingRegistration";
import { clearPendingPasswordChange, getPendingPasswordChange, sendOTP, verifyOTP } from "@/auth/otpService";
import AuthFormShell from "@/components/auth/AuthFormShell";
import OtpInput from "@/components/auth/OtpInput";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<AuthFormShell title="Verify your email" description="Loading your verification session…"><div className="h-48 animate-pulse rounded-lg bg-[#f3f6f5]" /></AuthFormShell>}>
      <VerifyOtpForm />
    </Suspense>
  );
}

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const flow = searchParams.get("flow") || "register";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!email) {
      setError("Registration session is missing an email address.");
      return;
    }

    if (code.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    const result = verifyOTP(email, code);
    if (!result.valid) {
      setError(result.message);
      setCode("");
      return;
    }

    if (flow === "password_change") {
      const pending = getPendingPasswordChange();
      if (!pending || pending.email !== email.toLowerCase().trim() || !auth.currentUser) {
        setError("Your password change session expired. Please start again from Security.");
        return;
      }
      setIsSubmitting(true);
      try {
        await updatePassword(auth.currentUser, pending.newPassword);
        clearPendingPasswordChange();
        await logAuditEvent({ event: "password_change_success", userId: auth.currentUser.uid, email, method: "email" });
        router.replace("/dashboard/settings?tab=security&password=updated");
      } catch (updateError) {
        setError(getAuthErrorMessage(updateError));
        await logAuditEvent({ event: "password_change_failed", status: "failure", userId: auth.currentUser.uid, email, method: "email" });
      } finally { setIsSubmitting(false); }
      return;
    }

    if (flow !== "register") {
      router.replace("/login");
      return;
    }

    const pendingRegistration = getPendingRegistration();
    if (!pendingRegistration) {
      setError("Registration expired. Please fill the registration form again.");
      return;
    }

    setIsSubmitting(true);
    try {
      await registerUser(pendingRegistration);
      clearPendingRegistration();
      router.replace("/dashboard");
    } catch (registerError) {
      setError(getAuthErrorMessage(registerError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    if (!email) {
      setError("Registration session is missing an email address.");
      return;
    }

    setIsResending(true);
    setError("");
    setNotice("");
    try {
      await sendOTP(email, flow === "password_change" ? "password_reset" : "register");
      setCode("");
      setNotice("A new verification code has been sent to your email.");
    } catch (resendError) {
      setError(getAuthErrorMessage(resendError));
    } finally {
      setIsResending(false);
    }
  }

  return (
    <AuthFormShell
      title={flow === "password_change" ? "Verify password change" : "Verify your email"}
      description={`Enter the 6-digit code sent to ${email || "your email"}.`}
    >
      <form className="space-y-8" onSubmit={handleSubmit}>
        {error ? (
          <div className="rounded-lg border border-[#fecdd3] bg-[#fff1f2] px-4 py-3 text-[14px] text-[#be123c]">
            {error}
          </div>
        ) : null}

        {notice ? (
          <div className="rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-[14px] text-[#047857]">
            {notice}
          </div>
        ) : null}

        <OtpInput value={code} onChange={setCode} />

        <button
          type="submit"
          disabled={isSubmitting || isResending}
          className="h-13.5 w-full rounded-lg bg-linear-to-r from-[#00955c] to-[#00aa6a] text-[16px] font-semibold text-white shadow-[0_8px_20px_rgba(0,157,98,0.18)] transition hover:brightness-[0.98] active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (flow === "password_change" ? "Updating password..." : "Creating account...") : (flow === "password_change" ? "Verify & change password" : "Verify email")}
        </button>

        <div className="text-center">
          <p className="text-[14px] text-[#526080]">
            Didn&apos;t receive the code?
          </p>

          <button
            type="button"
            disabled={isSubmitting || isResending}
            onClick={handleResend}
            className="mt-2 text-[14px] font-semibold text-[#009d62] hover:underline disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isResending ? "Sending..." : "Resend code"}
          </button>
        </div>

        <Link
          href={flow === "password_change" ? "/dashboard/settings?tab=security" : "/signup"}
          className="mx-auto flex w-fit items-center gap-2 text-[14px] font-medium text-[#526080] hover:text-[#142047]"
        >
          <ArrowLeft size={17} />
          {flow === "password_change" ? "Back to security" : "Back to signup"}
        </Link>
      </form>
    </AuthFormShell>
  );
}
