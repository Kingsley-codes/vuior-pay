"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, completeTemporaryPasswordChange } from "@/services/firebase";
import { logout } from "@/services/authService";

export default function ChangeTemporaryPasswordPage() {
  const router = useRouter();
  const [passwords, setPasswords] = useState({ next: "", confirm: "" });
  const [visible, setVisible] = useState({ next: false, confirm: false });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (passwords.next !== passwords.confirm) {
      setError("Your new passwords do not match.");
      return;
    }
    if (
      passwords.next.length < 8 ||
      !/(?=.*\d)(?=.*[!@#$%^&*])/.test(passwords.next)
    ) {
      setError("Use at least 8 characters, including a number and symbol.");
      return;
    }

    setSubmitting(true);
    try {
      const currentEmail = auth.currentUser?.email;
      await completeTemporaryPasswordChange(passwords.next);
      if (currentEmail) {
        try {
          await signInWithEmailAndPassword(auth, currentEmail, passwords.next);
        } catch {
          router.replace("/login");
          return;
        }
      }
      router.replace("/dashboard");
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to update your password.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-8 text-slate-950">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex justify-center">
          <Image
            src="/signInLogo.png"
            alt="Vuior"
            width={842}
            height={313}
            priority
            className="h-16 w-auto object-contain"
          />
        </div>
        <div className="mt-8 text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
            <ShieldCheck size={21} />
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Change your password
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your account was created with a temporary password. Set a permanent
            password to continue.
          </p>
        </div>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <PasswordField
            label="New password"
            value={passwords.next}
            visible={visible.next}
            onToggle={() =>
              setVisible((current) => ({ ...current, next: !current.next }))
            }
            onChange={(value) =>
              setPasswords((current) => ({ ...current, next: value }))
            }
          />
          <PasswordField
            label="Confirm new password"
            value={passwords.confirm}
            visible={visible.confirm}
            onToggle={() =>
              setVisible((current) => ({
                ...current,
                confirm: !current.confirm,
              }))
            }
            onChange={(value) =>
              setPasswords((current) => ({ ...current, confirm: value }))
            }
          />
          {error ? (
            <p role="alert" className="text-xs text-rose-600">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="h-11 w-full rounded-lg bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Updating password" : "Save password"}
          </button>
          <button
            type="button"
            onClick={() => void logout()}
            className="h-10 w-full rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Sign out
          </button>
        </form>
      </section>
    </main>
  );
}

function PasswordField({
  label,
  value,
  visible,
  onToggle,
  onChange,
}: {
  label: string;
  value: string;
  visible: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-xs font-medium text-slate-600">
      {label}
      <span className="mt-1.5 flex h-11 items-center gap-2 rounded-lg border border-slate-200 px-3 transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50">
        <LockKeyhole size={16} className="text-slate-400" />
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="new-password"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={onToggle}
          className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </span>
    </label>
  );
}
