"use client";

import { ClipboardEvent, KeyboardEvent, useRef, useState } from "react";

const OTP_LENGTH = 6;

export default function OtpInput() {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);

    setDigits((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();

    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");

    if (!pastedDigits.length) return;

    setDigits((current) => {
      const next = [...current];

      pastedDigits.forEach((digit, index) => {
        next[index] = digit;
      });

      return next;
    });

    const focusIndex = Math.min(pastedDigits.length, OTP_LENGTH - 1);

    inputRefs.current[focusIndex]?.focus();
  }

  return (
    <>
      <div className="grid grid-cols-6 gap-2 sm:gap-3">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            value={digit}
            onChange={(event) => updateDigit(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onPaste={handlePaste}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            aria-label={`OTP digit ${index + 1}`}
            className="h-14 w-full rounded-[9px] border border-[#d8dde7] bg-white text-center text-[22px] font-semibold text-[#142047] outline-none transition focus:border-[#00a968] focus:ring-4 focus:ring-[#00a968]/10 sm:h-16"
          />
        ))}
      </div>

      <input type="hidden" name="otp" value={digits.join("")} />
    </>
  );
}
