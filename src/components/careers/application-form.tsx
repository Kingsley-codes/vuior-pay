"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { PhoneInput } from "react-international-phone";
import type { JobDescription } from "@/data/jobs";

const fieldClass =
  "w-full rounded-[5px] border border-[#d9e4e1] bg-white px-3.5 text-[11px] text-[#07142d] outline-none focus:border-[#009268] focus:shadow-[0_0_0_3px_#00a47512] min-[901px]:text-[14px] max-[620px]:text-[14px]";

export function JobApplicationForm({ job }: { job: JobDescription }) {
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
    setPhone("");
  }

  return (
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
          onChange={setPhone}
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

      <button
        className="mt-[24px] h-[44px] w-full cursor-pointer rounded-[5px] border-0 bg-linear-to-br from-[#00a475] to-[#00815c] text-[12px] font-bold text-white transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_#007b5824] max-[620px]:text-[14px]"
        type="submit"
      >
        {submitted ? "Application received" : "Submit application"}
      </button>
      <p
        className="mt-4 text-center text-[9px] text-[#748093] min-[901px]:text-[12px] max-[620px]:text-[13px]"
        aria-live="polite"
      >
        {submitted
          ? "Thanks for applying. No confirmation email was sent."
          : "Your information is reviewed by the Vuior careers team."}
      </p>
    </form>
  );
}
