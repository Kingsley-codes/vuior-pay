"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, collection, setDoc, Timestamp } from "firebase/firestore";
import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  FileText,
  Hash,
  Phone,
  RefreshCcw,
  Tag,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import NotificationsMenu from "@/components/dashboard/NotificationsMenu";
import PhoneNumberInput from "@/components/phone-number-input";
import { db } from "@/services/firebase";
import { searchProviders, storeProvider, type Provider } from "@/services/providerService";
import { useVuiorSession } from "@/hooks/useVuiorSession";
import {
  currencyInputNumber,
  formatCurrencyInput,
  normalizeInternationalPhone,
} from "@/utils/inputFormatting";

function publicId() {
  return `VPB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

const checkboxClass =
  "grid h-4 w-4 shrink-0 cursor-pointer appearance-none place-content-center rounded border-[1.5px] border-[#cfd5df] bg-white before:mt-[-2px] before:h-1.5 before:w-2.5 before:origin-center before:rotate-[-45deg] before:scale-0 before:border-b-2 before:border-l-2 before:border-white before:transition-transform before:duration-150 before:content-[''] checked:border-[#00a968] checked:bg-[#00a968] checked:before:scale-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[rgba(0,169,104,0.13)]";

export default function AddBillPage() {
  const router = useRouter();
  const { user } = useVuiorSession();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showProviders, setShowProviders] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "Utilities",
    amount: "",
    dueDate: "",
    accountNumber: "",
    providerPhoneNumber: "",
    frequency: "Monthly",
    autoPay: false,
    notes: "",
  });

  function update(key: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  }

  useEffect(() => {
    const term = form.name.trim();
    if (!term) return void setProviders([]);
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void searchProviders(term)
        .then((matches) => !cancelled && setProviders(matches))
        .catch(() => !cancelled && setProviders([]));
    }, 250);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [form.name]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user)
      return setError("Your session is still loading. Please try again.");
    const amount = currencyInputNumber(form.amount);
    if (
      !form.name.trim() ||
      !amount ||
      amount <= 0 ||
      !form.dueDate ||
      !form.accountNumber.trim()
    )
      return setError("Complete the required bill details.");
    setSaving(true);
    try {
      const billRef = doc(collection(db, "bills"));
      const due = new Date(`${form.dueDate}T12:00:00`).toISOString();
      const providerId = await storeProvider(
        form.name,
        form.providerPhoneNumber,
        form.category,
        selectedProvider?.id,
      );
      await setDoc(billRef, {
        bill_ID: publicId(),
        user_id: user.id,
        name: form.name.trim(),
        provider_ID: providerId,
        category: form.category,
        amount,
        due_date: due,
        dueDate: due,
        status: "active",
        autoPay: form.autoPay,
        isDeleted: false,
        accountNumber: form.accountNumber.trim(),
        providerPhoneNumber:
          normalizeInternationalPhone(form.providerPhoneNumber) || null,
        frequency: form.frequency,
        notes: form.notes.trim() || null,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      });
      router.push("/dashboard/bills");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to add this bill.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[920px] p-5 sm:p-8 lg:p-10">
        <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[12px] font-semibold text-[#53637f]"
        >
          <ArrowLeft size={17} /> Back to bills
        </button>
        <NotificationsMenu userId={user?.id} />
        </div>
        <div className="mt-6">
          <h1 className="text-[29px] font-bold tracking-[-0.035em]">
            Add a Bill
          </h1>
          <p className="mt-2 text-[13px] text-[#66738b]">
            Add a recurring bill to track its due date, automate payments, and
            earn credits.
          </p>
        </div>
        <form
          onSubmit={submit}
          className="mt-7 rounded-xl border border-[#e2e8e6] bg-white p-5 shadow-[0_10px_30px_rgba(25,55,47,0.05)] sm:p-8"
        >
          {error ? (
            <div className="mb-6 rounded-lg border border-[#fecdd3] bg-[#fff1f2] px-4 py-3 text-[12px] text-[#be123c]">
              {error}
            </div>
          ) : null}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="relative">
              <Field label="Service provider" icon={<FileText size={18} />}>
                <input
                  required
                  value={form.name}
                  onFocus={() => setShowProviders(true)}
                  onChange={(e) => {
                    update("name", e.target.value);
                    setSelectedProvider(null);
                    setShowProviders(true);
                  }}
                  placeholder="Enter your provider's name"
                />
              </Field>
              {showProviders && providers.length ? (
                <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-[#cfeade] bg-white shadow-lg">
                  {providers.map((provider) => (
                    <button key={provider.id} type="button" className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] hover:bg-[#f3fbf7]" onMouseDown={(event) => event.preventDefault()} onClick={() => {
                      setSelectedProvider(provider);
                      setForm((current) => ({ ...current, name: provider.name, providerPhoneNumber: provider.phoneNumbers[0] || current.providerPhoneNumber }));
                      setShowProviders(false);
                    }}>
                      <span>{provider.name}</span>
                      {provider.categories[0] ? <span className="text-[11px] text-[#718097]">{provider.categories[0]}</span> : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <Field label="Category" icon={<Tag size={18} />}>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                {[
                  "Utilities",
                  "Internet",
                  "Insurance",
                  "Entertainment",
                  "Housing",
                  "Education",
                  "Other",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
            <Field label="Amount" icon={<CircleDollarSign size={18} />}>
              <input
                required
                inputMode="decimal"
                value={form.amount}
                onChange={(e) =>
                  update("amount", formatCurrencyInput(e.target.value))
                }
                placeholder="0.00"
              />
            </Field>
            <Field label="Due date" icon={<CalendarDays size={18} />}>
              <input
                required
                type="date"
                value={form.dueDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => update("dueDate", e.target.value)}
              />
            </Field>
            <Field label="Account number" icon={<Hash size={18} />}>
              <input
                required
                value={form.accountNumber}
                onChange={(e) => update("accountNumber", e.target.value)}
                placeholder="From your bill"
              />
            </Field>
            <Field label="Provider phone" icon={<Phone size={18} />}>
              <PhoneNumberInput
                className="vuior-phone-input--embedded"
                value={form.providerPhoneNumber}
                onChange={(value) => update("providerPhoneNumber", value)}
                placeholder="Enter provider phone"
              />
            </Field>
            <Field label="Frequency" icon={<RefreshCcw size={18} />}>
              <select
                value={form.frequency}
                onChange={(e) => update("frequency", e.target.value)}
              >
                {["Weekly", "Monthly", "Quarterly", "Yearly", "One-time"].map(
                  (item) => (
                    <option key={item}>{item}</option>
                  ),
                )}
              </select>
            </Field>
          </div>
          <label className="mt-6 block text-[12px] font-semibold text-[#1c2b50]">
            Notes <span className="font-normal text-[#8590a3]">(optional)</span>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Add any helpful information…"
              className="mt-2 min-h-24 w-full resize-y rounded-lg border border-[#dbe2e4] p-3 text-[13px] font-normal outline-none focus:border-[#00a96b]"
            />
          </label>
          <label className="mt-6 flex items-center justify-between rounded-lg border border-[#dfe7e4] bg-[#f8fbfa] p-4">
            <span>
              <strong className="block text-[12px]">Enable autopay</strong>
              <small className="mt-1 block text-[10px] text-[#718097]">
                Automatically pay this bill on its due date.
              </small>
            </span>
            <input
              type="checkbox"
              className={checkboxClass}
              checked={form.autoPay}
              onChange={(e) => update("autoPay", e.target.checked)}
            />
          </label>
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-11 rounded-lg border border-[#dbe2e4] px-6 text-[12px] font-semibold"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              className="h-11 rounded-lg bg-[#00a96b] px-7 text-[12px] font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Adding bill…" : "Add Bill"}
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-[12px] font-semibold text-[#1c2b50]">
      {label}
      <div className="mt-2 flex h-12 items-center gap-3 rounded-lg border border-[#dbe2e4] px-3 text-[#00a96b] focus-within:border-[#00a96b] [&_input]:min-w-0 [&_input]:flex-1 [&_input]:bg-transparent [&_input]:text-[13px] [&_input]:font-normal [&_input]:text-[#172445] [&_input]:outline-none [&_select]:min-w-0 [&_select]:flex-1 [&_select]:bg-transparent [&_select]:text-[13px] [&_select]:font-normal [&_select]:text-[#172445] [&_select]:outline-none">
        {icon}
        {children}
      </div>
    </label>
  );
}
