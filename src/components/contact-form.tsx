"use client";

import { FormEvent, useRef, useState } from "react";
import { Paperclip, X } from "lucide-react";
import PhoneNumberInput from "@/components/phone-number-input";
import { createPublicTicket } from "@/services/tickets";

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

const fieldClass =
  "w-full rounded-[5px] border border-[#d9e4e1] bg-white px-3.5 text-[16px] text-[#07142d] outline-none focus:border-[#009268] focus:shadow-[0_0_0_3px_#00a47512]";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif",
]);

function readImage(file: File): Promise<{ name: string; contentType: string; data: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve({ name: file.name, contentType: file.type, data: result.split(",")[1] || "" });
    };
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const fieldLabel = "mt-5 flex flex-col gap-[9px] text-[14px] font-[650] max-[620px]:text-[15px]";

  function selectImages(fileList: FileList | null) {
    if (!fileList) return;
    const selected = Array.from(fileList);
    if (selected.some((file) => !ALLOWED_IMAGE_TYPES.has(file.type))) {
      setError("Please attach JPEG, PNG, WebP, HEIC, or HEIF images only.");
      return;
    }
    if (selected.some((file) => file.size > MAX_IMAGE_BYTES)) {
      setError("Each image must be 5 MB or smaller.");
      return;
    }
    if (images.length + selected.length > 4) {
      setError("You can attach up to four images.");
      return;
    }
    setError("");
    setImages((current) => [...current, ...selected]);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const category = String(form.get("category") || "");
    const subject = String(form.get("subject") || "").trim();
    const message = String(form.get("message") || "").trim();
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 7 || phoneDigits.length > 15) return setError("Please enter a valid phone number.");
    if (images.reduce((total, file) => total + file.size, 0) > 16 * 1024 * 1024) {
      return setError("Attachments must total 16 MB or less.");
    }

    setSending(true);
    setSent(false);
    const formElement = event.currentTarget;
    try {
      await createPublicTicket({
        name,
        email,
        phoneNumber: phone,
        category,
        subject,
        message,
        images: await Promise.all(images.map(readImage)),
      });
      setSent(true);
      setImages([]);
      formElement.reset();
      setPhone("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Your message could not be sent. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      className="rounded-[13px] border border-[#dfe9e6] bg-white/80 px-10 pt-[34px] pb-[25px] shadow-[0_7px_28px_#153c3010] max-[620px]:px-5 max-[620px]:py-7"
      onSubmit={submit}
    >
      <div>
        <h2 className="mb-2.5 text-[16px] min-[620px]:text-[17px]">Send us a message</h2>
        <p className="mb-[25px] text-[16px] text-[#667487] min-[901px]:leading-[1.65] max-[620px]:leading-[1.65]">
          Fill out the form below, and our team will respond shortly.
        </p>
      </div>
      {error ? <p role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-[14px] text-red-700">{error}</p> : null}
      {sent ? <p role="status" className="mb-4 rounded-md bg-[#eaf8f3] p-3 text-[14px] text-[#007f5d]">Message sent. Our team will be in touch shortly.</p> : null}

      <label className={fieldLabel}>
        <span>Full name <span className="text-red-600">*</span></span>
        <input className={`${fieldClass} h-[43px]`} required name="name" maxLength={120} placeholder="Enter your full name" disabled={sending} />
      </label>
      <label className={fieldLabel}>
        <span>Email address <span className="text-red-600">*</span></span>
        <input className={`${fieldClass} h-[43px]`} required type="email" name="email" maxLength={254} placeholder="Enter your email address" disabled={sending} />
      </label>
      <label className={fieldLabel}>
        <span>Phone number <span className="text-red-600">*</span></span>
        <PhoneNumberInput className="vuior-phone-input--auth" value={phone} onChange={setPhone} disabled={sending} inputProps={{ "aria-label": "Phone number", required: true }} />
      </label>
      <label className={fieldLabel}>
        <span>Category <span className="text-red-600">*</span></span>
        <select className={`${fieldClass} h-[43px]`} required name="category" defaultValue="" disabled={sending}>
          <option value="" disabled>Select a category</option>
          {categories.map(([value, label, description]) => <option key={value} value={value}>{label} — {description}</option>)}
        </select>
      </label>
      <label className={fieldLabel}>
        <span>Subject <span className="text-red-600">*</span></span>
        <input className={`${fieldClass} h-[43px]`} required name="subject" maxLength={200} placeholder="Briefly describe your request" disabled={sending} />
      </label>
      <label className={fieldLabel}>
        <span>Message <span className="text-red-600">*</span></span>
        <textarea className={`${fieldClass} h-24 resize-y pt-3.5`} required name="message" maxLength={10000} placeholder="How can we help you?" disabled={sending} />
      </label>
      <div className="mt-5">
        <span className="mb-2 block text-[14px] font-[650] max-[620px]:text-[15px]">Images <span className="font-normal text-[#748093]">(optional, up to 4)</span></span>
        <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple className="sr-only" onChange={(event) => selectImages(event.target.files)} disabled={sending} />
        <button type="button" onClick={() => fileInput.current?.click()} disabled={sending || images.length >= 4} className="inline-flex h-10 items-center gap-2 rounded-md border border-[#d9e4e1] px-3 text-[14px] text-[#34425d] disabled:opacity-50">
          <Paperclip size={15} /> Attach images
        </button>
        <p className="mt-1 text-[13px] text-[#748093]">JPEG, PNG, WebP, HEIC, or HEIF. 5 MB max per image.</p>
        {images.length ? <ul className="mt-2 space-y-1">{images.map((image, index) => <li key={`${image.name}-${index}`} className="flex items-center gap-2 text-[14px] text-[#53617a]"><Paperclip size={12} /><span className="flex-1 truncate">{image.name}</span><button type="button" aria-label={`Remove ${image.name}`} onClick={() => setImages((current) => current.filter((_, i) => i !== index))} className="p-1"><X size={14} /></button></li>)}</ul> : null}
      </div>
      <button className="mt-[19px] h-[42px] w-full cursor-pointer rounded-[5px] border-0 bg-linear-to-br from-[#00a475] to-[#00815c] text-[14px] font-bold text-white disabled:cursor-wait disabled:opacity-70 max-[620px]:text-[16px]" type="submit" disabled={sending}>
        {sending ? "Sending..." : sent ? "Send another message" : "Send message"}
      </button>
      <p className="mt-4 text-center text-[14px] text-[#748093] max-[620px]:text-[15px]" aria-live="polite">
        We typically respond within 24 hours on business days.
      </p>
    </form>
  );
}
