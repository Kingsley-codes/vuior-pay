"use client";
import { useEffect, useRef, useState } from "react";
import type { DuplicateBill } from "@/utils/billDuplicates";
export function useBillConfirmation() {
  const [duplicate, setDuplicate] = useState<DuplicateBill | null>(null);
  const resolve = useRef<((answer: boolean) => void) | null>(null);
  useEffect(() => () => { resolve.current?.(false); }, []);
  function answer(accepted: boolean) { resolve.current?.(accepted); resolve.current = null; setDuplicate(null); }
  function confirmBill(bill: DuplicateBill) { setDuplicate(bill); return new Promise<boolean>((done) => { resolve.current = done; }); }
  const confirmationDialog = duplicate ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4" onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); answer(false); } }}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="duplicate-bill-title" aria-describedby="duplicate-bill-description" className="max-h-[90vh] w-full max-w-md overflow-y-auto break-words rounded-2xl bg-white p-6 text-slate-900 shadow-xl">
        <h2 id="duplicate-bill-title" className="text-lg font-semibold">This bill already exists</h2>
        <p id="duplicate-bill-description" className="mt-3 text-sm leading-6">You already have an unpaid {duplicate.name} bill for account {duplicate.accountNumber}, due {duplicate.dueDate || "on an earlier date"}, for ${duplicate.amount.toFixed(2)}. It is due in the same month or is overdue.</p>
        <p className="mt-3 text-sm leading-6">Continue to update that existing bill with the new amount, due date, document, and other details you entered?</p>
        <div className="mt-5 flex justify-end gap-3">
          <button autoFocus type="button" onClick={() => answer(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Cancel</button>
          <button type="button" onClick={() => answer(true)} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Continue and update</button>
        </div>
      </section>
    </div>
  ) : null;
  return { confirmBill, confirmationDialog };
}
