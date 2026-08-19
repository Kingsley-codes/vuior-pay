"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const fieldClass =
    "w-full rounded-[5px] border border-[#d9e4e1] bg-white px-3.5 text-[11px] text-[#07142d] outline-none focus:border-[#009268] focus:shadow-[0_0_0_3px_#00a47512] min-[901px]:text-[14px] max-[620px]:text-[14px]";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <form
      className="rounded-[13px] border border-[#dfe9e6] bg-white/80 px-10 pt-[34px] pb-[25px] shadow-[0_7px_28px_#153c3010] max-[620px]:px-5 max-[620px]:py-7"
      onSubmit={submit}
    >
      <div>
        <h2 className="mb-2.5 text-[16px] min-[620px]:text-[17px]">
          Send us a message
        </h2>
        <p className="mb-[25px] text-[11px] text-[#667487] min-[901px]:text-[15px] min-[901px]:leading-[1.65] max-[620px]:text-[15px] max-[620px]:leading-[1.65]">
          Fill out the form below and our team will respond shortly.
        </p>
      </div>
      <label className="mt-5 flex flex-col gap-[9px] text-[10px] font-[650] min-[901px]:text-[12px] max-[620px]:text-[13px]">
        Full name
        <input
          className={`${fieldClass} h-[43px]`}
          required
          name="name"
          placeholder="Enter your full name"
        />
      </label>
      <label className="mt-5 flex flex-col gap-[9px] text-[10px] font-[650] min-[901px]:text-[12px] max-[620px]:text-[13px]">
        Email address
        <input
          className={`${fieldClass} h-[43px]`}
          required
          type="email"
          name="email"
          placeholder="Enter your email address"
        />
      </label>
      <label className="mt-5 flex flex-col gap-[9px] text-[10px] font-[650] min-[901px]:text-[12px] max-[620px]:text-[13px]">
        Subject
        <select
          className={`${fieldClass} h-[43px]`}
          required
          name="subject"
          defaultValue=""
        >
          <option value="" disabled>
            Select a subject
          </option>
          <option>Account support</option>
          <option>Payments and bills</option>
          <option>Rewards</option>
          <option>Feedback</option>
          <option>Something else</option>
        </select>
      </label>
      <label className="mt-5 flex flex-col gap-[9px] text-[10px] font-[650] min-[901px]:text-[12px] max-[620px]:text-[13px]">
        Message
        <textarea
          className={`${fieldClass} h-24 resize-y pt-3.5`}
          required
          name="message"
          placeholder="How can we help you?"
        />
      </label>
      <button
        className="mt-[19px] h-[42px] w-full cursor-pointer rounded-[5px] border-0 bg-linear-to-br from-[#00a475] to-[#00815c] text-[12px] font-bold text-white max-[620px]:text-[14px]"
        type="submit"
      >
        {sent ? "Message sent - thank you!" : "Send message"}
      </button>
      <p
        className="mt-4 text-center text-[9px] text-[#748093] min-[901px]:text-[12px] max-[620px]:text-[13px]"
        aria-live="polite"
      >
        {sent
          ? "We'll be in touch shortly."
          : "We typically respond within 24 hours on business days."}
      </p>
    </form>
  );
}
