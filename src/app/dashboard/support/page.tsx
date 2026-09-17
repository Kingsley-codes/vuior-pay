"use client";

import Image from "next/image";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  LifeBuoy,
  LoaderCircle,
  Paperclip,
  Phone,
  Plus,
  RefreshCw,
  Send,
  Ticket as TicketIcon,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import NotificationsMenu from "@/components/dashboard/NotificationsMenu";
import PhoneNumberInput from "@/components/phone-number-input";
import { useVuiorSession } from "@/hooks/useVuiorSession";
import {
  createTicket,
  getUserTickets,
  markTicketResolved,
  reopenTicket,
  type Ticket,
  type TicketStatus,
  updateTicketAttachments,
  uploadTicketImages,
} from "@/services/tickets";

type SupportTab = "contact" | "tickets";

const categories = [
  ["account", "Account Issues", "Login, profile, or account settings"],
  ["bills", "Bills Issues", "Billing statements and payments"],
  ["payment", "Payment Issues", "Payment methods and transactions"],
  ["credits", "Credits/Rewards Issues", "Rewards and credit balance"],
  ["provider", "Provider Issues", "Provider-related concerns and support"],
  ["verification", "Verification", "Identity verification and documents"],
  ["technical", "Technical Issues", "Bugs or technical problems"],
  ["complaint", "Complaints", "File a complaint about our service"],
  ["general", "General Inquiry", "Questions about Vuior"],
  ["feature", "Feature Requests", "Suggestions and improvements"],
] as const;

const faqs = [
  ["How do I reset my password?", "Go to the login screen and select ‘Forgot Password’. Follow the instructions sent to your email."],
  ["How long do transfers take?", "Transfers typically take 1–3 business days to process, depending on your bank."],
  ["Is my money secure?", "Yes. Vuior uses bank-level encryption and security measures to protect your funds and data."],
  ["How do I report a problem?", "Submit the support form with the details of the problem, or call our support team during business hours."],
] as const;

const statusStyles: Record<TicketStatus, string> = {
  open: "bg-[#e8f2ff] text-[#2468b4]",
  "in-progress": "bg-[#fff5d9] text-[#9a6700]",
  resolved: "bg-[#e9f8f1] text-[#008f60]",
  closed: "bg-[#eef1f3] text-[#667085]",
};

export default function SupportPage() {
  const { user } = useVuiorSession();
  const [tab, setTab] = useState<SupportTab>("contact");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const loadTickets = useCallback(async () => {
    if (!user?.id) return;
    try {
      setTickets(await getUserTickets(user.id));
    } finally {
      setLoadingTickets(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  const activeCount = tickets.filter(
    (ticket) => ticket.status === "open" || ticket.status === "in-progress",
  ).length;

  async function resolve(ticket: Ticket) {
    if (!window.confirm("Mark this ticket as resolved? You can reopen it within 48 hours.")) return;
    setUpdatingId(ticket.id);
    try {
      await markTicketResolved(ticket.id);
      await loadTickets();
    } catch {
      setNotice("We couldn’t update that ticket. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function reopen(ticket: Ticket) {
    setUpdatingId(ticket.id);
    try {
      await reopenTicket(ticket.id);
      await loadTickets();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "We couldn’t reopen that ticket.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1250px] px-5 py-8 sm:px-8 lg:py-10">
        <div className="flex items-start justify-between gap-4">
          <div className="ml-12 sm:ml-0">
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#00a36a]">Help center</p>
            <h1 className="mt-2 text-2xl font-bold tracking-[-.03em] sm:text-[30px]">Support</h1>
            <p className="mt-2 text-[13px] text-[#68758d]">Get help from our team and keep track of your requests.</p>
          </div>
          <NotificationsMenu userId={user?.id} />
        </div>

        {notice ? (
          <div className="mt-5 flex items-center gap-3 rounded-lg border border-[#f4c7c7] bg-[#fff4f4] px-4 py-3 text-[12px] text-[#a83434]">
            <AlertCircle size={17} /><span className="flex-1">{notice}</span>
            <button aria-label="Dismiss message" onClick={() => setNotice("")}><X size={16} /></button>
          </div>
        ) : null}

        <div className="mt-7 flex w-fit rounded-lg border border-[#dfe6e4] bg-white p-1 shadow-[0_5px_18px_rgba(25,55,47,.04)]" role="tablist" aria-label="Support sections">
          <Tab active={tab === "contact"} onClick={() => setTab("contact")}><LifeBuoy size={16} />Contact support</Tab>
          <Tab active={tab === "tickets"} onClick={() => setTab("tickets")}>
            <TicketIcon size={16} />My tickets
            {activeCount ? <span className="grid min-w-5 place-items-center rounded-full bg-[#00a96b] px-1.5 py-0.5 text-[9px] text-white">{activeCount > 9 ? "9+" : activeCount}</span> : null}
          </Tab>
        </div>

        <div className="mt-6">
          {tab === "contact" ? (
            <ContactPanel
              user={user}
              onSubmitted={async () => {
                setNotice("");
                await loadTickets();
                setTab("tickets");
              }}
            />
          ) : (
            <TicketsPanel
              tickets={tickets}
              loading={loadingTickets}
              refreshing={refreshing}
              updatingId={updatingId}
              onRefresh={() => { setRefreshing(true); void loadTickets(); }}
              onCreate={() => setTab("contact")}
              onResolve={resolve}
              onReopen={reopen}
            />
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

function ContactPanel({ user, onSubmitted }: { user: ReturnType<typeof useVuiorSession>["user"]; onSubmitted: () => Promise<void> }) {
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const previews = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files]);
  useEffect(() => () => previews.forEach(({ url }) => URL.revokeObjectURL(url)), [previews]);

  function chooseFiles(selected: FileList | null) {
    if (!selected) return;
    const images = Array.from(selected).filter((file) => file.type.startsWith("image/"));
    if (images.length !== selected.length) setError("Only image attachments are supported.");
    const oversized = images.find((file) => file.size > 5 * 1024 * 1024);
    if (oversized) {
      setError("Each image must be 5 MB or smaller.");
      return;
    }
    setFiles((current) => [...current, ...images].slice(0, 4));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess(false);
    const digits = (phone ?? user?.phoneNo ?? "").replace(/\D/g, "");
    if (!user) return setError("You must be signed in to submit a ticket.");
    if (!category) return setError("Please select a category.");
    if (!subject.trim()) return setError("Please enter a subject.");
    if (!message.trim()) return setError("Please describe your issue.");
    if (!(digits.length === 10 || (digits.length === 11 && digits.startsWith("1")))) {
      return setError("Please enter a valid 10-digit US phone number.");
    }

    setSending(true);
    try {
      const ticketId = await createTicket({
        userId: user.id,
        userEmail: user.email || "",
        subject: subject.trim(),
        message: message.trim(),
        category,
        phoneNumber: digits,
      });
      if (files.length) {
        const urls = await uploadTicketImages(user.id, ticketId, files);
        await updateTicketAttachments(ticketId, urls);
      }
      setCategory(""); setSubject(""); setMessage(""); setFiles([]);
      setSuccess(true);
      window.setTimeout(() => void onSubmitted(), 1100);
    } catch (submitError) {
      console.error("Error submitting support ticket", submitError);
      setError("Your ticket could not be submitted. Please try again or call support.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,.72fr)]">
      <form onSubmit={submit} className="rounded-xl border border-[#e2e8e6] bg-white p-5 shadow-[0_7px_24px_rgba(25,55,47,.04)] sm:p-7">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eaf8f2] text-[#00a96b]"><Send size={18} /></span>
          <div><h2 className="text-[16px] font-bold">Send us a message</h2><p className="mt-1 text-[11px] text-[#738097]">Fields marked with * are required.</p></div>
        </div>

        {error ? <div role="alert" className="mt-5 flex gap-2 rounded-lg bg-[#fff1f1] px-4 py-3 text-[11px] text-[#b63838]"><AlertCircle size={16} className="shrink-0" />{error}</div> : null}
        {success ? <div role="status" className="mt-5 flex gap-2 rounded-lg bg-[#eaf8f2] px-4 py-3 text-[11px] text-[#007d54]"><CheckCircle2 size={16} />Ticket submitted. Our team will respond within 24–48 hours.</div> : null}

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Category" required>
            <select value={category} onChange={(event) => setCategory(event.target.value)} disabled={sending} className="h-11 w-full rounded-lg border border-[#dce5e2] bg-white px-3 text-[12px] outline-none focus:border-[#00a96b] focus:ring-3 focus:ring-[#00a96b]/10">
              <option value="">Select a category</option>
              {categories.map(([value, label, description]) => <option key={value} value={value}>{label} — {description}</option>)}
            </select>
          </Field>
          <Field label="Phone number" required>
            <PhoneNumberInput value={phone ?? user?.phoneNo ?? ""} onChange={setPhone} disabled={sending} className="vuior-phone-input--auth" inputProps={{ "aria-label": "Phone number" }} />
          </Field>
        </div>
        <div className="mt-5"><Field label="Subject" required><input value={subject} onChange={(event) => setSubject(event.target.value)} disabled={sending} maxLength={120} placeholder="What is your issue about?" className="h-11 w-full rounded-lg border border-[#dce5e2] px-3 text-[12px] outline-none placeholder:text-[#9aa4b4] focus:border-[#00a96b] focus:ring-3 focus:ring-[#00a96b]/10" /></Field></div>
        <div className="mt-5"><Field label="Message" required><textarea value={message} onChange={(event) => setMessage(event.target.value)} disabled={sending} maxLength={3000} rows={7} placeholder="Please describe your issue in detail..." className="w-full resize-y rounded-lg border border-[#dce5e2] px-3 py-3 text-[12px] leading-5 outline-none placeholder:text-[#9aa4b4] focus:border-[#00a96b] focus:ring-3 focus:ring-[#00a96b]/10" /><p className="mt-1 text-right text-[9px] text-[#8b96a8]">{message.length}/3000</p></Field></div>

        <div className="mt-5">
          <div className="flex items-center justify-between"><div><p className="text-[11px] font-semibold text-[#34425d]">Attachments</p><p className="mt-1 text-[9px] text-[#7d899d]">Up to 4 images, 5 MB each</p></div><span className="text-[10px] text-[#7d899d]">{files.length}/4</span></div>
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => { chooseFiles(event.target.files); event.target.value = ""; }} />
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {previews.map(({ file, url }, index) => <div key={`${file.name}-${file.lastModified}`} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-[#dfe6e4] bg-[#f5f8f7]"><Image src={url} alt={`Attachment ${index + 1}`} fill unoptimized className="object-cover" /><button type="button" aria-label={`Remove ${file.name}`} onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-[#07142d]/75 text-white"><Trash2 size={13} /></button></div>)}
            {files.length < 4 ? <button type="button" onClick={() => inputRef.current?.click()} disabled={sending} className="flex aspect-[4/3] flex-col items-center justify-center rounded-lg border border-dashed border-[#b8c8c3] bg-[#f9fbfa] text-[#66748a] transition hover:border-[#00a96b] hover:bg-[#f2fbf7] hover:text-[#008f60]"><Plus size={19} /><span className="mt-1 text-[10px] font-semibold">Add image</span></button> : null}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#edf1ef] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-[10px] text-[#738097]"><Clock3 size={14} />Replies typically arrive within 24–48 hours.</p>
          <button disabled={sending} className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#00a96b] px-7 text-[12px] font-semibold text-white transition hover:bg-[#009c63] disabled:cursor-not-allowed disabled:opacity-60">{sending ? <><LoaderCircle size={16} className="animate-spin" />Submitting…</> : <><Send size={15} />Submit ticket{files.length ? ` (${files.length})` : ""}</>}</button>
        </div>
      </form>

      <aside className="space-y-5">
        <section className="rounded-xl border border-[#e2e8e6] bg-white p-5 shadow-[0_7px_24px_rgba(25,55,47,.04)]">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#eaf8f2] text-[#00a96b]"><Phone size={18} /></span><div><h2 className="text-[13px] font-bold">Phone support</h2><p className="mt-1 text-[10px] text-[#738097]">Monday–Friday, 9 AM–6 PM EST</p></div></div>
          <a href="tel:+18333671826" className="mt-5 flex h-10 items-center justify-center rounded-lg border border-[#00a96b] text-[11px] font-semibold text-[#008f60] transition hover:bg-[#eaf8f2]">Call +1 (833) 367-1826</a>
        </section>
        <section className="rounded-xl border border-[#e2e8e6] bg-white p-5 shadow-[0_7px_24px_rgba(25,55,47,.04)]">
          <h2 className="text-[14px] font-bold">Frequently asked questions</h2>
          <div className="mt-3 divide-y divide-[#edf1ef]">{faqs.map(([question, answer], index) => <div key={question} className="py-3"><button type="button" onClick={() => setExpandedFaq((current) => current === index ? null : index)} aria-expanded={expandedFaq === index} className="flex w-full items-center gap-3 text-left text-[11px] font-semibold"><span className="flex-1">{question}</span>{expandedFaq === index ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</button>{expandedFaq === index ? <p className="mt-2 pr-5 text-[10px] leading-5 text-[#6f7d93]">{answer}</p> : null}</div>)}</div>
        </section>
      </aside>
    </div>
  );
}

function TicketsPanel({ tickets, loading, refreshing, updatingId, onRefresh, onCreate, onResolve, onReopen }: { tickets: Ticket[]; loading: boolean; refreshing: boolean; updatingId: string | null; onRefresh: () => void; onCreate: () => void; onResolve: (ticket: Ticket) => void; onReopen: (ticket: Ticket) => void }) {
  const [renderedAt] = useState(Date.now);
  if (loading) return <div className="grid min-h-[360px] place-items-center rounded-xl border border-[#e2e8e6] bg-white"><LoaderCircle className="animate-spin text-[#00a96b]" size={28} /></div>;
  return <section className="overflow-hidden rounded-xl border border-[#e2e8e6] bg-white shadow-[0_7px_24px_rgba(25,55,47,.04)]">
    <div className="flex flex-col gap-3 border-b border-[#e7ecea] p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-[16px] font-bold">My support tickets</h2><p className="mt-1 text-[10px] text-[#738097]">{tickets.length} ticket{tickets.length === 1 ? "" : "s"} · {tickets.filter((item) => item.status === "open" || item.status === "in-progress").length} active</p></div><div className="flex gap-2"><button onClick={onRefresh} disabled={refreshing} className="grid h-10 w-10 place-items-center rounded-lg border border-[#dfe6e4] text-[#66748a]" aria-label="Refresh tickets"><RefreshCw size={15} className={refreshing ? "animate-spin" : ""} /></button><button onClick={onCreate} className="flex h-10 items-center gap-2 rounded-lg bg-[#00a96b] px-4 text-[11px] font-semibold text-white"><Plus size={15} />New ticket</button></div></div>
    {!tickets.length ? <div className="grid min-h-[360px] place-items-center p-8 text-center"><div><span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#eaf8f2] text-[#00a96b]"><TicketIcon size={34} /></span><h3 className="mt-4 text-[15px] font-bold">No tickets yet</h3><p className="mt-2 text-[11px] text-[#738097]">When you contact support, your requests will appear here.</p><button onClick={onCreate} className="mt-5 h-10 rounded-lg bg-[#00a96b] px-5 text-[11px] font-semibold text-white">Create a ticket</button></div></div> : <div className="divide-y divide-[#edf1ef]">{tickets.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} renderedAt={renderedAt} updating={updatingId === ticket.id} onResolve={() => onResolve(ticket)} onReopen={() => onReopen(ticket)} />)}</div>}
  </section>;
}

function TicketRow({ ticket, renderedAt, updating, onResolve, onReopen }: { ticket: Ticket; renderedAt: number; updating: boolean; onResolve: () => void; onReopen: () => void }) {
  const active = ticket.status === "open" || ticket.status === "in-progress";
  const closedDate = ticket.closedAt?.toDate?.() || ticket.updatedAt?.toDate?.();
  const canReopen = !active && !!closedDate && renderedAt - closedDate.getTime() <= 48 * 3_600_000;
  const created = ticket.createdAt?.toDate?.();
  return <article className="p-5 transition hover:bg-[#fbfcfc] sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-[13px] font-bold">{ticket.subject || "Support ticket"}</h3><span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold capitalize ${statusStyles[ticket.status]}`}>{ticket.status.replace("-", " ")}</span></div><p className="mt-1.5 text-[9px] text-[#7b879b]">{ticket.ticket_ID || ticket.id} · Created {created ? created.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "just now"}</p><p className="mt-3 max-w-3xl whitespace-pre-wrap text-[11px] leading-5 text-[#53617a]">{ticket.message}</p><div className="mt-4 flex flex-wrap items-center gap-4 text-[9px] text-[#7b879b]"><span className="capitalize">Category: {ticket.category || "General"}</span><span className="flex items-center gap-1.5"><Paperclip size={13} />{ticket.attachments?.length || 0} attachment{ticket.attachments?.length === 1 ? "" : "s"}</span></div>{ticket.attachments?.length ? <div className="mt-3 flex gap-2 overflow-x-auto">{ticket.attachments.map((url, index) => <a key={url} href={url} target="_blank" rel="noreferrer" className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md border border-[#dfe6e4]"><Image src={url} alt={`Ticket attachment ${index + 1}`} fill unoptimized className="object-cover" /></a>)}</div> : null}</div><div className="shrink-0">{active ? <button disabled={updating} onClick={onResolve} className="flex h-9 min-w-[124px] items-center justify-center gap-2 rounded-lg bg-[#00a96b] px-4 text-[10px] font-semibold text-white disabled:opacity-60">{updating ? <LoaderCircle size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}Mark resolved</button> : canReopen ? <button disabled={updating} onClick={onReopen} className="flex h-9 min-w-[100px] items-center justify-center gap-2 rounded-lg border border-[#00a96b] px-4 text-[10px] font-semibold text-[#008f60] disabled:opacity-60">{updating ? <LoaderCircle size={14} className="animate-spin" /> : <RefreshCw size={13} />}Reopen</button> : null}</div></div></article>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block text-[11px] font-semibold text-[#34425d]">{label}{required ? <span className="text-[#e04444]"> *</span> : null}</span>{children}</label>; }
function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`flex h-10 items-center gap-2 rounded-md px-4 text-[11px] font-semibold transition sm:px-5 ${active ? "bg-[#eaf8f2] text-[#008f60]" : "text-[#66748a] hover:bg-[#f7f9f8]"}`}>{children}</button>; }
