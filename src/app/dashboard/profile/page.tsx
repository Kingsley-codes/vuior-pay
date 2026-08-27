"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/services/firebase";
import { useVuiorSession } from "@/hooks/useVuiorSession";
import PhoneNumberInput from "@/components/phone-number-input";
import { parseUsAddress, US_STATES } from "@/utils/profile";
import {
  hasCompletePhoneNumber,
  normalizeInternationalPhone,
} from "@/utils/inputFormatting";

const latestBirthDate = (() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 14);
  return date.toISOString().slice(0, 10);
})();

export function ProfileSettingsPanel() {
  const { user } = useVuiorSession();
  const fileInput = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    dob: "",
    addressLine: "",
    city: "",
    stateCode: "",
  });
  const [avatar, setAvatar] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!user) return;
    const address = parseUsAddress(user.address || "");
    // The profile arrives asynchronously from Firestore and seeds this editable draft.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNo: normalizeInternationalPhone(user.phoneNo || ""),
      dob: user.dob || "",
      ...address,
    });
    setAvatar(user.avatar || "");
  }, [user]);

  function setField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function updatePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;
    setFeedback(null);
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setFeedback({
        tone: "error",
        text: "Choose a JPG, PNG, or WebP image smaller than 5 MB.",
      });
      return;
    }
    const preview = URL.createObjectURL(file);
    const previous = avatar;
    setAvatar(preview);
    setUploading(true);
    try {
      const avatarRef = ref(
        storage,
        `avatars/${user.id}/profile_${Date.now()}`,
      );
      await uploadBytes(avatarRef, file, { contentType: file.type });
      const url = await getDownloadURL(avatarRef);
      await updateDoc(doc(db, "users", user.id), {
        avatar: url,
        updatedAt: serverTimestamp(),
      });
      setAvatar(url);
      setFeedback({
        tone: "success",
        text: "Your profile photo has been updated.",
      });
    } catch {
      setAvatar(previous);
      setFeedback({
        tone: "error",
        text: "We couldn’t update your profile photo. Please try again.",
      });
    } finally {
      URL.revokeObjectURL(preview);
      setUploading(false);
      event.target.value = "";
    }
  }

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setFeedback(null);
    if (!user?.id) return;
    const values = Object.values(form);
    if (values.some((value) => !value.trim()))
      return setFeedback({
        tone: "error",
        text: "Complete every required profile field.",
      });
    if (!US_STATES.some(([code]) => code === form.stateCode))
      return setFeedback({ tone: "error", text: "Select a valid U.S. state." });
    if (!hasCompletePhoneNumber(form.phoneNo))
      return setFeedback({
        tone: "error",
        text: "Enter a complete phone number.",
      });
    if (form.dob < "1930-01-01" || form.dob > latestBirthDate)
      return setFeedback({
        tone: "error",
        text: "Enter a valid date of birth. You must be at least 14 years old.",
      });

    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.id), {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNo: normalizeInternationalPhone(form.phoneNo),
        dob: form.dob,
        address: `${form.addressLine.trim()}, ${form.city.trim()}, ${form.stateCode}`,
        addressUpdatedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setFeedback({
        tone: "success",
        text: "Your profile changes have been saved.",
      });
    } catch {
      setFeedback({
        tone: "error",
        text: "We couldn’t save your changes. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  const displayName =
    [form.firstName, form.lastName].filter(Boolean).join(" ") || "Vuior User";
  const avatarUrl =
    avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=101d4b&color=fff`;

  const content = (
    <div>
      {feedback ? (
        <div
          role="status"
          className={`mt-6 flex items-center gap-2 rounded-lg border px-4 py-3 text-[13px] ${feedback.tone === "success" ? "border-[#b9ead7] bg-[#effbf6] text-[#087553]" : "border-[#fecdd3] bg-[#fff1f2] text-[#be123c]"}`}
        >
          {feedback.tone === "success" ? <CheckCircle2 size={17} /> : null}
          {feedback.text}
        </div>
      ) : null}

      <div className="mt-7 grid gap-5 lg:grid-cols-[285px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-[#e1e8e5] bg-white p-6 text-center shadow-[0_8px_28px_rgba(25,55,47,.04)]">
          <div className="relative mx-auto h-28 w-28">
            <Image
              src={avatarUrl}
              alt={displayName}
              fill
              unoptimized
              className="rounded-full border-4 border-[#edf8f4] object-cover"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInput.current?.click()}
              className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-[#00a36a] text-white shadow-md"
              aria-label="Change profile photo"
            >
              <Camera size={16} />
            </button>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={updatePhoto}
          />
          <h2 className="mt-4 text-[16px] font-bold">{displayName}</h2>
          <p className="mt-1 text-[11px] text-[#7a879b]">{user?.email}</p>
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
            className="mt-5 h-10 rounded-lg border border-[#00a36a] px-5 text-[11px] font-bold text-[#009662]"
          >
            {uploading ? "Uploading…" : "Change photo"}
          </button>
          <p className="mt-3 text-[10px] leading-4 text-[#98a2b2]">
            JPG, PNG, or WebP. Maximum 5 MB.
          </p>
        </aside>

        <form
          onSubmit={saveProfile}
          className="rounded-2xl border border-[#e1e8e5] bg-white p-6 shadow-[0_8px_28px_rgba(25,55,47,.04)] sm:p-7"
        >
          <div className="flex items-center gap-3 border-b border-[#edf1ef] pb-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf8f2] text-[#00a36a]">
              <UserRound size={19} />
            </span>
            <div>
              <h2 className="text-[15px] font-bold">Personal information</h2>
              <p className="mt-0.5 text-[11px] text-[#7b8799]">
                All fields marked required must be completed.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-x-5 gap-y-5 sm:grid-cols-2">
            <Field label="First name">
              <input
                value={form.firstName}
                onChange={(e) => setField("firstName", e.target.value)}
                required
              />
            </Field>
            <Field label="Last name">
              <input
                value={form.lastName}
                onChange={(e) => setField("lastName", e.target.value)}
                required
              />
            </Field>
            <Field label="Email address" icon={<Mail size={16} />}>
              <input
                value={user?.email || ""}
                disabled
                className="text-[#8a95a6]"
              />
            </Field>
            <Field label="Phone number" icon={<Phone size={16} />}>
              <PhoneNumberInput
                className="vuior-phone-input--embedded"
                value={form.phoneNo}
                onChange={(value) => setField("phoneNo", value)}
                placeholder="Enter phone number"
                required
              />
            </Field>
            <Field label="Date of birth">
              <input
                type="date"
                min="1930-01-01"
                max={latestBirthDate}
                value={form.dob}
                onChange={(e) => setField("dob", e.target.value)}
                required
              />
            </Field>
            <Field label="State">
              <select
                value={form.stateCode}
                onChange={(e) => setField("stateCode", e.target.value)}
                required
              >
                <option value="">Select state</option>
                {US_STATES.map(([code, name]) => (
                  <option value={code} key={code}>
                    {name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Street address" icon={<MapPin size={16} />} wide>
              <input
                value={form.addressLine}
                onChange={(e) => setField("addressLine", e.target.value)}
                placeholder="123 Main Street"
                required
              />
            </Field>
            <Field label="City">
              <input
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                required
              />
            </Field>
          </div>
          <div className="mt-7 flex justify-end border-t border-[#edf1ef] pt-5">
            <button
              disabled={saving}
              className="h-12 rounded-lg bg-[#00a36a] px-8 text-[12px] font-bold text-white shadow-[0_8px_18px_rgba(0,163,106,.16)] transition hover:bg-[#008f5d] disabled:opacity-60"
            >
              {saving ? "Saving changes…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  return content;
}

export default function ProfilePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/settings");
  }, [router]);
  return null;
}

function Field({
  label,
  icon,
  wide = false,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={wide ? "sm:col-span-2" : ""}>
      <span className="mb-2 block text-[11px] font-semibold text-[#334562]">
        {label} <em className="not-italic text-[#e05757]">*</em>
      </span>
      <span className="flex h-12 items-center gap-2 rounded-lg border border-[#dce4e2] bg-[#fbfcfc] px-3 text-[#00a36a] focus-within:border-[#00a36a] [&>input]:min-w-0 [&>input]:flex-1 [&>input]:bg-transparent [&>input]:text-[13px] [&>input]:text-[#172744] [&>input]:outline-none [&>select]:min-w-0 [&>select]:flex-1 [&>select]:bg-transparent [&>select]:text-[13px] [&>select]:text-[#172744] [&>select]:outline-none">
        {icon}
        {children}
      </span>
    </label>
  );
}
