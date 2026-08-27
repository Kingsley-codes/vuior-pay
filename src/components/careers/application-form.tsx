"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { PhoneInput } from "react-international-phone";
import type { JobDescription } from "@/data/jobs";

const fieldClass =
  "w-full rounded-[5px] border border-[#d9e4e1] bg-white px-3.5 text-[11px] text-[#07142d] outline-none focus:border-[#009268] focus:shadow-[0_0_0_3px_#00a47512] min-[901px]:text-[14px] max-[620px]:text-[14px]";
type FormStatus = {
  type: "success" | "error";
  title: string;
  message: string;
};

export function JobApplicationForm({ job }: { job: JobDescription }) {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<FormStatus | null>(null);

  useEffect(() => {
    if (!status) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setStatus(null);
    }, 6500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [status]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (phone.replace(/\D/g, "").length < 8) {
      setStatus({
        type: "error",
        title: "Application not submitted",
        message: "Please enter a complete phone number before submitting.",
      });
      return;
    }

    setStatus({
      type: "success",
      title: "Application submitted",
      message:
        "Thanks for applying. Our careers team will review your details. No confirmation email was sent.",
    });
    event.currentTarget.reset();
    setPhone("");
  }

  return (
    <>
      {status ? (
        <div
          className={`fixed right-5 top-5 z-50 w-[min(380px,calc(100vw-40px))] rounded-[10px] border bg-white px-4 py-3 shadow-[0_18px_45px_#12332626] ${
            status.type === "success"
              ? "border-[#9edfc9]"
              : "border-[#efb7b7]"
          }`}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex gap-3">
            <span
              className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[14px] font-bold text-white ${
                status.type === "success" ? "bg-[#009268]" : "bg-[#c83f3f]"
              }`}
            >
              {status.type === "success" ? "OK" : "!"}
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block text-[14px] text-[#07142d]">
                {status.title}
              </strong>
              <p className="mt-1 text-[13px] leading-5 text-[#657386]">
                {status.message}
              </p>
            </div>
            <button
              className="h-6 w-6 shrink-0 rounded text-[18px] leading-none text-[#7b8798] hover:bg-[#f2f6f4]"
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setStatus(null)}
            >
              x
            </button>
          </div>
        </div>
      ) : null}

      <form
        className="rounded-[13px] border border-[#dfe9e6] bg-white/85 px-10 pt-[34px] pb-[25px] shadow-[0_7px_28px_#153c3010] max-[620px]:px-5 max-[620px]:py-7"
        onSubmit={submit}
      >
      <div>
        <p className="mb-2 text-[11px] font-extrabold text-[#00895f] max-[620px]:text-[12px]">
          APPLICATION
        </p>
        <h2 className="mb-2.5 text-[18px] font-bold max-[620px]:text-[19px]">
          Apply for {job.title}
        </h2>
        <p className="mb-[25px] text-[11px] leading-[1.65] text-[#667487] min-[901px]:text-[15px] max-[620px]:text-[15px]">
          Share a few details and our team will review your application.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-[620px]:grid-cols-1">
        <label className="flex flex-col gap-[9px] text-[10px] font-[650] min-[901px]:text-[12px] max-[620px]:text-[13px]">
          First name
          <input className={`${fieldClass} h-[43px]`} name="firstName" required />
        </label>
        <label className="flex flex-col gap-[9px] text-[10px] font-[650] min-[901px]:text-[12px] max-[620px]:text-[13px]">
          Last name
          <input className={`${fieldClass} h-[43px]`} name="lastName" required />
        </label>
      </div>

      <label className="mt-5 flex flex-col gap-[9px] text-[10px] font-[650] min-[901px]:text-[12px] max-[620px]:text-[13px]">
        Email address
        <input
          className={`${fieldClass} h-[43px]`}
          name="email"
          required
          type="email"
        />
      </label>

      <div className="mt-5 flex flex-col gap-[9px] text-[10px] font-[650] min-[901px]:text-[12px] max-[620px]:text-[13px]">
        Phone number
        <PhoneInput
          className="vuior-phone-input"
          defaultCountry="us"
          forceDialCode
          inputProps={{
            autoComplete: "tel",
            inputMode: "tel",
          }}
          name="phone"
          onChange={(value) => {
            setPhone(value);
            if (status) {
              setStatus(null);
            }
          }}
          placeholder="Enter phone number"
          required
          value={phone}
        />
      </div>

      <label className="mt-5 flex flex-col gap-[9px] text-[10px] font-[650] min-[901px]:text-[12px] max-[620px]:text-[13px]">
        Upload resume
        <input
          accept=".pdf,.doc,.docx"
          className={`${fieldClass} h-[43px] pt-2.5 file:mr-3 file:rounded file:border-0 file:bg-[#edf9f5] file:px-3 file:py-1.5 file:text-[12px] file:font-bold file:text-[#007f5d]`}
          name="resume"
          required
          type="file"
        />
      </label>

      <label className="mt-5 flex flex-col gap-[9px] text-[10px] font-[650] min-[901px]:text-[12px] max-[620px]:text-[13px]">
        How did you hear about us?
        <select className={`${fieldClass} h-[43px]`} defaultValue="" name="source" required>
          <option value="" disabled>
            Select an option
          </option>
          <option>Social Media</option>
          <option>Search Engine</option>
          <option>Referral</option>
          <option>Other</option>
        </select>
      </label>

      <label className="mt-5 flex items-start gap-3 text-[10px] leading-[1.6] text-[#667487] min-[901px]:text-[12px] max-[620px]:text-[13px]">
        <input
          className="mt-1 h-4 w-4 accent-[#009268]"
          defaultChecked
          name="agreeToPromotionalMessages"
          type="checkbox"
        />
        <span>
          I agree to receive automated promotional messages. This agreement is
          not a condition of purchase. Message and data rates may apply. See our{" "}
          <Link className="font-bold text-[#00895f] underline" href="/terms-of-service">
            Terms
          </Link>{" "}
          and{" "}
          <Link className="font-bold text-[#00895f] underline" href="/privacy-policy">
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      {status ? (
        <div
          className={`mt-6 rounded-[9px] border px-4 py-3 text-[13px] leading-6 ${
            status.type === "success"
              ? "border-[#b9e7d8] bg-[#f0fbf6] text-[#075b45]"
              : "border-[#f0c9c9] bg-[#fff5f5] text-[#8a1f1f]"
          }`}
          role="status"
          aria-live="polite"
        >
          <strong className="block text-[14px]">{status.title}</strong>
          {status.message}
        </div>
      ) : null}

      <button
        className="mt-[24px] h-[44px] w-full cursor-pointer rounded-[5px] border-0 bg-linear-to-br from-[#00a475] to-[#00815c] text-[12px] font-bold text-white transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_#007b5824] max-[620px]:text-[14px]"
        type="submit"
      >
        Submit application
      </button>
      <p
        className="mt-4 text-center text-[9px] text-[#748093] min-[901px]:text-[12px] max-[620px]:text-[13px]"
        aria-live="polite"
      >
        Your information is reviewed by the Vuior careers team.
      </p>
      </form>
    </>
  );
}
