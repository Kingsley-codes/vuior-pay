"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileImage,
  FileText,
  LoaderCircle,
  Pencil,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import PhoneNumberInput from "@/components/phone-number-input";
import { db, storage } from "@/services/firebase";
import { searchProviders, storeProvider, type Provider } from "@/services/providerService";
import type { Bill } from "@/hooks/useVuiorData";
import {
  currencyInputNumber,
  formatCurrencyInput,
  normalizeInternationalPhone,
} from "@/utils/inputFormatting";

type Mode = "add" | "details" | "edit";
type FormState = {
  name: string;
  category: string;
  amount: string;
  dueDate: string;
  accountNumber: string;
  providerPhoneNumber: string;
  autoPay: boolean;
  notes: string;
};
type Extracted = Partial<
  Pick<FormState, "name" | "amount" | "accountNumber" | "dueDate">
>;

const emptyForm: FormState = {
  name: "",
  category: "Utilities",
  amount: "",
  dueDate: "",
  accountNumber: "",
  providerPhoneNumber: "",
  autoPay: false,
  notes: "",
};
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function dateInput(value?: string) {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? ""
    : parsed.toISOString().slice(0, 10);
}

function normalizedStatus(value?: string) {
  return String(value || "active")
    .trim()
    .toLowerCase();
}

async function extractBill(file: File): Promise<Extracted> {
  const key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!key || !file.type.startsWith("image/")) return {};
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract the service provider name, total amount due, account number, and due date from this bill. Return only compact JSON with keys name, amount, accountNumber, dueDate. Use a numeric amount and YYYY-MM-DD date.",
            },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
    }),
  });
  if (!response.ok)
    throw new Error("The document could not be read automatically.");
  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const match = data.choices?.[0]?.message?.content?.match(/\{[\s\S]*\}/);
  return match ? (JSON.parse(match[0]) as Extracted) : {};
}

export default function BillModal({
  initialMode,
  bill,
  userId,
  onClose,
}: {
  initialMode: Mode;
  bill?: Bill | null;
  userId: string;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [form, setForm] = useState<FormState>(() =>
    bill
      ? {
          name: bill.name,
          category: bill.category || "Other",
          amount: formatCurrencyInput(String(bill.amount)),
          dueDate: dateInput(bill.dueDate),
          accountNumber: bill.accountNumber || "",
          providerPhoneNumber: normalizeInternationalPhone(
            bill.providerPhoneNumber || "",
          ),
          autoPay: bill.autoPay,
          notes: bill.notes || "",
        }
      : emptyForm,
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(bill?.documentUrl || "");
  const [working, setWorking] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState("");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showProviders, setShowProviders] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [onClose]);

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

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  }

  async function chooseFile(next: File | undefined) {
    if (!next) return;
    if (!next.type.startsWith("image/"))
      return setError("Choose a JPG, PNG, or WEBP image of the bill.");
    if (next.size > 10 * 1024 * 1024)
      return setError("The document must be smaller than 10 MB.");
    setFile(next);
    setPreview(URL.createObjectURL(next));
    setError("");
    setExtracting(true);
    try {
      const result = await extractBill(next);
      setForm(
        (current) =>
          ({
            ...current,
            ...Object.fromEntries(
              Object.entries(result).filter(([, value]) => Boolean(value)),
            ),
            ...(result.amount
              ? { amount: formatCurrencyInput(String(result.amount)) }
              : {}),
          }) as FormState,
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? `${cause.message} You can still enter the details manually.`
          : "AI extraction failed. Enter the details manually.",
      );
    } finally {
      setExtracting(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const amount = currencyInputNumber(form.amount);
    if (
      !form.name.trim() ||
      !amount ||
      amount <= 0 ||
      !form.dueDate ||
      !form.accountNumber.trim()
    )
      return setError(
        "Complete the bill name, amount, due date, and account number.",
      );
    if (mode === "add" && !file)
      return setError("Attach an image of the bill before saving.");
    setWorking(true);
    setError("");
    try {
      const billRef = bill
        ? doc(db, "bills", bill.id)
        : doc(collection(db, "bills"));
      let documentUrl = bill?.documentUrl || null;
      if (file) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const storageRef = ref(
          storage,
          `documents/${userId}/${Date.now()}_${safeName}`,
        );
        await uploadBytes(storageRef, file, { contentType: file.type });
        documentUrl = await getDownloadURL(storageRef);
        await addDoc(collection(db, "documents"), {
          userId,
          billId: billRef.id,
          documentUrl,
          documentName: safeName,
          documentType: file.type,
          uploadedAt: Timestamp.now(),
          purpose: "Bill",
          isDeleted: false,
        });
      }
      const due = new Date(`${form.dueDate}T12:00:00`).toISOString();
      const values = {
        name: form.name.trim(),
        category: form.category,
        amount,
        due_date: due,
        dueDate: due,
        accountNumber: form.accountNumber.trim(),
        providerPhoneNumber:
          normalizeInternationalPhone(form.providerPhoneNumber) || null,
        autoPay: form.autoPay,
        notes: form.notes.trim() || null,
        documentUrl,
        updated_at: Timestamp.now(),
      };
      const providerId = await storeProvider(
        form.name,
        form.providerPhoneNumber,
        form.category,
        selectedProvider?.id,
      );
      if (bill) {
        await updateDoc(billRef, {
          ...values,
          provider_ID: providerId,
          status: ["in review", "paid", "completed"].includes(
            normalizedStatus(bill.status),
          )
            ? normalizedStatus(bill.status)
            : "active",
        });
      } else {
        await setDoc(billRef, {
          ...values,
          bill_ID: `VPB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          user_id: userId,
          provider_ID: providerId,
          status: "active",
          isDeleted: false,
          created_at: Timestamp.now(),
        });
      }
      onClose();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to save this bill.",
      );
    } finally {
      setWorking(false);
    }
  }

  const currentStatus = normalizedStatus(bill?.status);
  const isInReview = currentStatus === "in review";
  const isPaid = ["paid", "completed"].includes(currentStatus);
  const isPaymentSubmitted = isInReview || isPaid;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#07142d]/60 p-3 backdrop-blur-[2px]"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="bill-modal-title"
        className="max-h-[94vh] w-full max-w-[720px] overflow-y-auto rounded-2xl border border-white/60 bg-white shadow-[0_24px_80px_rgba(4,33,25,.28)]"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-[#e8eeeb] bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#009b67]">
              {mode === "details"
                ? "Bill overview"
                : mode === "edit"
                  ? "Update bill"
                  : "New bill"}
            </p>
            <h2
              id="bill-modal-title"
              className="mt-1 text-[21px] font-bold text-[#10203d]"
            >
              {mode === "details"
                ? bill?.name
                : mode === "edit"
                  ? "Edit bill details"
                  : "Add a bill"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-[#f2f5f4] text-[#53617a] hover:bg-[#e7ecea]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>
        {mode === "details" && bill ? (
          <div className="p-5 sm:p-7">
            <div className="rounded-2xl bg-linear-to-br from-[#063c33] to-[#075a49] p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] text-white/60">
                    {isPaymentSubmitted ? "Payment amount" : "Amount due"}
                  </p>
                  <strong className="mt-2 block text-[32px]">
                    {money.format(bill.amount)}
                  </strong>
                  <p className="mt-3 flex items-center gap-2 text-[11px] text-white/75">
                    <CalendarDays size={15} />
                    {dateInput(bill.dueDate)
                      ? new Date(bill.dueDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "No due date"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${isPaid ? "bg-[#dcfce7] text-[#08764f]" : isInReview ? "bg-[#fff6df] text-[#9a6700]" : "bg-white/12 text-white"}`}
                >
                  {isPaymentSubmitted ? (
                    <CheckCircle2 className="mr-1.5 inline" size={13} />
                  ) : null}
                  {isInReview ? "In review" : isPaid ? "Paid" : bill.status}
                </span>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["Category", bill.category],
                ["Account number", bill.accountNumber || "Not provided"],
                ["Frequency", bill.frequency || "Not set"],
                ["Autopay", bill.autoPay ? "On" : "Off"],
                ["Provider phone", bill.providerPhoneNumber || "Not provided"],
                ["Payment method", bill.paidWith || "Not paid"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-[#e4ebe8] bg-[#fafcfb] p-4"
                >
                  <p className="text-[9px] uppercase tracking-wider text-[#8792a4]">
                    {label}
                  </p>
                  <p className="mt-2 text-[12px] font-semibold text-[#263553]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            {bill.notes ? (
              <div className="mt-4 rounded-xl border border-[#e4ebe8] p-4">
                <p className="text-[9px] uppercase tracking-wider text-[#8792a4]">
                  Notes
                </p>
                <p className="mt-2 text-[11px] leading-5 text-[#53617a]">
                  {bill.notes}
                </p>
              </div>
            ) : null}
            {bill.documentUrl ? (
              <a
                href={bill.documentUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center gap-3 rounded-xl border border-[#cceadd] bg-[#f2fbf7] p-4 text-[#08764f]"
              >
                <FileImage size={21} />
                <span className="flex-1 text-[11px] font-semibold">
                  View attached bill document
                </span>
                <ExternalLink size={16} />
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => setMode("edit")}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#009b67] text-[12px] font-semibold text-white hover:bg-[#00875a]"
            >
              <Pencil size={16} /> Edit bill
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5 sm:p-7">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="relative flex min-h-[132px] w-full items-center gap-4 overflow-hidden rounded-2xl border border-dashed border-[#8fd4b8] bg-[#f3fbf7] p-5 text-left hover:bg-[#edf9f3]"
            >
              {preview ? (
                <Image
                  src={preview}
                  alt="Bill preview"
                  width={80}
                  height={80}
                  unoptimized
                  className="h-20 w-20 rounded-xl object-cover"
                />
              ) : (
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-white text-[#009b67] shadow-sm">
                  <Upload size={22} />
                </span>
              )}
              <span className="flex-1">
                <b className="block text-[12px] text-[#19352d]">
                  {file
                    ? file.name
                    : bill?.documentUrl
                      ? "Replace attached document"
                      : "Upload a bill image"}
                </b>
                <small className="mt-1.5 block text-[10px] leading-5 text-[#657a72]">
                  JPG, PNG or WEBP up to 10 MB. Vuior AI will fill in the bill
                  details automatically.
                </small>
                {extracting ? (
                  <span className="mt-2 flex items-center gap-2 text-[10px] font-semibold text-[#009b67]">
                    <LoaderCircle className="animate-spin" size={14} /> Reading
                    your bill…
                  </span>
                ) : (
                  <span className="mt-2 flex items-center gap-2 text-[10px] font-semibold text-[#009b67]">
                    <Sparkles size={14} /> AI-assisted entry
                  </span>
                )}
              </span>
            </button>
            <input
              ref={inputRef}
              hidden
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => chooseFile(event.target.files?.[0])}
            />
            {error ? (
              <p className="mt-4 rounded-lg border border-[#fecdd3] bg-[#fff1f2] px-4 py-3 text-[11px] text-[#be123c]">
                {error}
              </p>
            ) : null}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="relative">
                <Field label="Service provider">
                  <input
                    required
                    value={form.name}
                    onFocus={() => setShowProviders(true)}
                    onChange={(e) => {
                      update("name", e.target.value);
                      setSelectedProvider(null);
                      setShowProviders(true);
                    }}
                    placeholder="e.g. Duke Energy"
                  />
                </Field>
                {showProviders && providers.length ? (
                  <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-[#cfeade] bg-white shadow-lg">
                    {providers.map((provider) => (
                      <button key={provider.id} type="button" className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[12px] hover:bg-[#f3fbf7]" onMouseDown={(event) => event.preventDefault()} onClick={() => {
                        setSelectedProvider(provider);
                        setForm((current) => ({ ...current, name: provider.name, providerPhoneNumber: provider.phoneNumbers[0] || current.providerPhoneNumber }));
                        setShowProviders(false);
                      }}>
                        <span>{provider.name}</span>
                        {provider.categories[0] ? <span className="text-[10px] text-[#718097]">{provider.categories[0]}</span> : null}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                >
                  {[
                    "Utilities",
                    "Transportation",
                    "Internet & Phone",
                    "Loans",
                    "Education",
                    "Subscriptions",
                    "Insurance",
                    "Business",
                    "Housing",
                    "Credit Card",
                    "Healthcare",
                    "Custom",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field label="Amount">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-3 text-[12px] text-[#65728a]">
                    $
                  </span>
                  <input
                    required
                    inputMode="decimal"
                    value={form.amount}
                    onChange={(e) =>
                      update("amount", formatCurrencyInput(e.target.value))
                    }
                    placeholder="0.00"
                    className="!pl-7"
                  />
                </div>
              </Field>
              <Field label="Due date">
                <input
                  required
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => update("dueDate", e.target.value)}
                />
              </Field>
              <Field label="Account number">
                <input
                  required
                  inputMode="numeric"
                  value={form.accountNumber}
                  onChange={(e) =>
                    update("accountNumber", e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Account or reference number"
                />
              </Field>
              <Field label="Provider phone">
                <PhoneNumberInput
                  className="vuior-phone-input--modal"
                  value={form.providerPhoneNumber}
                  onChange={(value) => update("providerPhoneNumber", value)}
                  placeholder="Enter provider phone"
                />
              </Field>
            </div>
            <Field label="Notes" wide>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Optional payment notes"
              />
            </Field>
            <label className="mt-4 flex items-center justify-between rounded-xl border border-[#e1e8e5] p-4">
              <span>
                <b className="block text-[11px]">Enable autopay</b>
                <small className="mt-1 block text-[9px] text-[#718097]">
                  Pay automatically on the due date.
                </small>
              </span>
              <input
                type="checkbox"
                checked={form.autoPay}
                onChange={(e) => update("autoPay", e.target.checked)}
                className="h-4 w-4 accent-[#009b67]"
              />
            </label>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={
                  mode === "edit" && bill ? () => setMode("details") : onClose
                }
                className="h-11 flex-1 rounded-lg border border-[#d7e0dd] text-[11px] font-semibold text-[#53617a]"
              >
                Cancel
              </button>
              <button
                disabled={working || extracting}
                className="flex h-11 flex-[1.6] items-center justify-center gap-2 rounded-lg bg-[#009b67] text-[11px] font-semibold text-white disabled:opacity-50"
              >
                {working ? (
                  <LoaderCircle className="animate-spin" size={16} />
                ) : (
                  <FileText size={16} />
                )}{" "}
                {working ? "Saving…" : bill ? "Save changes" : "Add bill"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`${wide ? "mt-4 block" : "block"}`}>
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#44516b]">
        {label}
      </span>
      <div className="[&_input]:h-11 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#dfe6e4] [&_input]:px-3 [&_input]:text-[12px] [&_input]:outline-none [&_input]:focus:border-[#009b67] [&_select]:h-11 [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-[#dfe6e4] [&_select]:bg-white [&_select]:px-3 [&_select]:text-[12px] [&_select]:outline-none [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#dfe6e4] [&_textarea]:p-3 [&_textarea]:text-[12px] [&_textarea]:outline-none">
        {children}
      </div>
    </label>
  );
}
