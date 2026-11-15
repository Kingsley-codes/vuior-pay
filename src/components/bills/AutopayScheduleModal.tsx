"use client";

import { useState } from "react";

export default function AutopayScheduleModal({
  days,
  onConfirm,
  onClose,
}: {
  days: number;
  onConfirm: (days: number) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState(String(days));
  const parsed = Number(value);
  const valid =
    value.trim() !== "" &&
    Number.isInteger(parsed) &&
    parsed >= 0 &&
    parsed <= 30;
  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[#07142d]/60 p-4"
      onMouseDown={(event) => {
        event.stopPropagation();
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="autopay-schedule-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 id="autopay-schedule-title" className="text-xl font-semibold">
          Choose your autopay timing
        </h2>

        <label className="mt-5 block text-base font-medium">
          Days before the due date
          <input
            autoFocus
            type="number"
            min={0}
            max={30}
            step={1}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-[#dfe6e4] px-3"
          />
        </label>
        <p className="mt-2 text-sm text-[#65728a]">
          Choose 0–30 days. Choose 0 to pay on the due date.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 flex-1 rounded-lg border border-[#d7e0dd]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!valid}
            onClick={() => onConfirm(parsed)}
            className="h-11 flex-1 rounded-lg bg-[#009b67] font-semibold text-white disabled:opacity-50"
          >
            Confirm timing
          </button>
        </div>
      </section>
    </div>
  );
}
