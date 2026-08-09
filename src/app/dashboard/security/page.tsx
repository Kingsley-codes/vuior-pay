"use client";

import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, HelpCircle, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db } from "@/auth/firebase";
import { logAuditEvent } from "@/auth/auditLog";
import { sendOTP, setPendingPasswordChange } from "@/auth/otpService";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useVuiorSession } from "@/hooks/useVuiorSession";

const QUESTIONS = ["What was the name of your first school?","What was the name of your first pet?","In what city were you born?","What is your mother's maiden name?","What was the make of your first car?","What was your childhood nickname?"];

export default function SecurityPage() {
  const router = useRouter();
  const { user, firebaseUser } = useVuiorSession();
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false });
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState<"password" | "question" | null>(null);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  useEffect(() => { if (user?.id) void getDoc(doc(db, "users", user.id)).then((snap) => { const saved = snap.data()?.securityQuestion; if (typeof saved === "string") setQuestion(saved); }); }, [user?.id]);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("password") === "updated") {
      // Reflect the result of the OTP route after returning to this screen.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFeedback({ tone: "success", text: "Your password has been changed successfully." });
    }
  }, []);

  async function changePassword(event: FormEvent) {
    event.preventDefault(); setFeedback(null);
    if (!passwords.current || !passwords.next || !passwords.confirm) return setFeedback({ tone: "error", text: "Complete all three password fields." });
    if (passwords.next !== passwords.confirm) return setFeedback({ tone: "error", text: "Your new passwords do not match." });
    if (passwords.next.length < 8 || !/(?=.*\d)(?=.*[!@#$%^&*])/.test(passwords.next)) return setFeedback({ tone: "error", text: "Use at least 8 characters, including a number and symbol." });
    if (!firebaseUser?.email) return setFeedback({ tone: "error", text: "Please sign in again to continue." });
    setBusy("password");
    try {
      await reauthenticateWithCredential(firebaseUser, EmailAuthProvider.credential(firebaseUser.email, passwords.current));
      setPendingPasswordChange(firebaseUser.email, passwords.next);
      await sendOTP(firebaseUser.email, "password_reset");
      await logAuditEvent({ event: "password_change_started", userId: firebaseUser.uid, email: firebaseUser.email, method: "email" });
      setPasswords({ current: "", next: "", confirm: "" });
      router.push(`/verify-otp?flow=password_change&email=${encodeURIComponent(firebaseUser.email)}`);
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
      await logAuditEvent({ event: "password_change_failed", status: "failure", userId: firebaseUser.uid, email: firebaseUser.email, method: "email", errorCode: code });
      setFeedback({ tone: "error", text: code === "auth/invalid-credential" || code === "auth/wrong-password" ? "Your current password is incorrect." : code === "auth/too-many-requests" ? "Too many attempts. Please try again later." : "We couldn’t verify your password. Please try again." });
    } finally { setBusy(null); }
  }

  async function saveQuestion(event: FormEvent) {
    event.preventDefault(); setFeedback(null);
    const normalized = answer.trim().toLowerCase();
    if (!user?.id || !question) return setFeedback({ tone: "error", text: "Select a security question." });
    if (normalized.length < 2) return setFeedback({ tone: "error", text: "Please provide an answer." });
    setBusy("question");
    try {
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized));
      const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
      await updateDoc(doc(db, "users", user.id), { securityQuestion: question, securityAnswerHash: hash, securityQuestionUpdatedAt: serverTimestamp() });
      setAnswer(""); setFeedback({ tone: "success", text: "Your security question has been updated." });
    } catch { setFeedback({ tone: "error", text: "We couldn’t save your security question." }); }
    finally { setBusy(null); }
  }

  return <DashboardShell><div className="mx-auto max-w-[1060px] px-5 py-8 sm:px-8 lg:py-10">
    <div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#00a36a]">Settings</p><h1 className="mt-2 text-2xl font-bold tracking-[-.03em] sm:text-[30px]">Security</h1><p className="mt-2 text-[13px] text-[#68758d]">Manage your password and account recovery details.</p></div>
    {feedback ? <div role="status" className={`mt-6 rounded-lg border px-4 py-3 text-[13px] ${feedback.tone === "success" ? "border-[#b9ead7] bg-[#effbf6] text-[#087553]" : "border-[#fecdd3] bg-[#fff1f2] text-[#be123c]"}`}>{feedback.text}</div> : null}
    <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]">
      <form onSubmit={changePassword} className="rounded-2xl border border-[#e1e8e5] bg-white p-6 shadow-[0_8px_28px_rgba(25,55,47,.04)] sm:p-7">
        <CardHeading icon={<KeyRound size={19}/>} title="Change password" copy="We’ll email you a one-time code before applying the change."/>
        <div className="mt-6 space-y-5"><PasswordField label="Current password" value={passwords.current} show={visible.current} onToggle={() => setVisible(v => ({...v,current:!v.current}))} onChange={(value) => setPasswords(p => ({...p,current:value}))}/><PasswordField label="New password" value={passwords.next} show={visible.next} onToggle={() => setVisible(v => ({...v,next:!v.next}))} onChange={(value) => setPasswords(p => ({...p,next:value}))}/><PasswordField label="Confirm new password" value={passwords.confirm} show={visible.confirm} onToggle={() => setVisible(v => ({...v,confirm:!v.confirm}))} onChange={(value) => setPasswords(p => ({...p,confirm:value}))}/></div>
        <div className="mt-5 rounded-xl bg-[#f5f8f7] p-4 text-[11px] leading-5 text-[#66748a]"><strong className="text-[#34445f]">Password requirements</strong><br/>At least 8 characters with one number and one symbol (!@#$%^&*).</div>
        <button disabled={busy !== null} className="mt-6 h-12 w-full rounded-lg bg-[#00a36a] text-[12px] font-bold text-white transition hover:bg-[#008f5d] disabled:opacity-60">{busy === "password" ? "Verifying…" : "Continue with email verification"}</button>
      </form>
      <div className="space-y-5"><form onSubmit={saveQuestion} className="rounded-2xl border border-[#e1e8e5] bg-white p-6 shadow-[0_8px_28px_rgba(25,55,47,.04)]"><CardHeading icon={<HelpCircle size={19}/>} title="Security question" copy="Used as an additional account recovery check."/><label className="mt-6 block text-[11px] font-semibold text-[#334562]">Question<select value={question} onChange={(e) => setQuestion(e.target.value)} className="mt-2 h-12 w-full rounded-lg border border-[#dce4e2] bg-[#fbfcfc] px-3 text-[12px] outline-none focus:border-[#00a36a]"><option value="">Select a question</option>{QUESTIONS.map(q => <option key={q}>{q}</option>)}</select></label><label className="mt-4 block text-[11px] font-semibold text-[#334562]">Answer<input type="password" autoComplete="off" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Enter your answer" className="mt-2 h-12 w-full rounded-lg border border-[#dce4e2] bg-[#fbfcfc] px-3 text-[12px] outline-none focus:border-[#00a36a]"/></label><button disabled={busy !== null} className="mt-5 h-11 w-full rounded-lg border border-[#00a36a] text-[11px] font-bold text-[#009662] disabled:opacity-60">{busy === "question" ? "Saving…" : "Save security question"}</button></form>
        <div className="rounded-2xl bg-[#071a35] p-6 text-white"><span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-[#2bd195]"><ShieldCheck size={20}/></span><h2 className="mt-4 text-[14px] font-bold">Your account is protected</h2><p className="mt-2 text-[11px] leading-5 text-[#a8b3c5]">Sensitive changes require recent authentication and email verification.</p></div>
      </div>
    </div>
  </div></DashboardShell>;
}

function CardHeading({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) { return <div className="flex items-start gap-3 border-b border-[#edf1ef] pb-5"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eaf8f2] text-[#00a36a]">{icon}</span><div><h2 className="text-[15px] font-bold">{title}</h2><p className="mt-1 text-[11px] leading-5 text-[#7b8799]">{copy}</p></div></div> }
function PasswordField({ label, value, show, onToggle, onChange }: { label: string; value: string; show: boolean; onToggle: () => void; onChange: (value: string) => void }) { return <label className="block"><span className="mb-2 block text-[11px] font-semibold text-[#334562]">{label}</span><span className="flex h-12 items-center rounded-lg border border-[#dce4e2] bg-[#fbfcfc] px-3 focus-within:border-[#00a36a]"><LockKeyhole size={16} className="mr-2 text-[#00a36a]"/><input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} autoComplete="off" className="min-w-0 flex-1 bg-transparent text-[13px] outline-none"/><button type="button" onClick={onToggle} aria-label={show ? "Hide password" : "Show password"} className="text-[#7a8799]">{show ? <EyeOff size={17}/> : <Eye size={17}/>}</button></span></label> }
