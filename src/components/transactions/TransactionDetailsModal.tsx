"use client";

import { CreditCard, FileText, X } from "lucide-react";
import type { Bill, Transaction } from "@/hooks/useVuiorData";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function TransactionDetailsModal({ transaction, bills = [], onClose }: { transaction: Transaction; bills?: Bill[]; onClose: () => void }) {
  const publicBillIds = transaction.billPublicIds.length
    ? transaction.billPublicIds
    : transaction.billIds.map((id) => bills.find((bill) => bill.id === id)?.billId || "Not recorded");
  const rows = [
    ["Transaction ID", transaction.transactionId],
    ["Payment ID", transaction.paymentId || transaction.transactionId],
    ["Bill ID", publicBillIds.join(", ") || "Not applicable"],
    ["Type", transaction.type],
    ["Category", transaction.category],
    ["Payment method", transaction.paymentMethod || "Not recorded"],
    ["Status", transaction.status],
    ["Date", transaction.date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })],
    ["Reference", transaction.reference || "Not recorded"],
  ];

  return <div className="fixed inset-0 z-[70] grid place-items-center bg-[#07142d]/55 p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div role="dialog" aria-modal="true" aria-labelledby="transaction-title" className="max-h-[90vh] w-full max-w-[580px] overflow-y-auto rounded-2xl bg-white shadow-2xl">
      <div className="flex items-start justify-between border-b border-[#e7ecea] p-6">
        <div className="flex gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#eaf8f2] text-[#009b67]"><CreditCard size={20}/></span><div><h2 id="transaction-title" className="text-[20px] font-semibold">Transaction details</h2><p className="mt-1 text-[12px] text-[#65728a]">{transaction.label}</p></div></div>
        <button aria-label="Close transaction details" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-[#f1f4f3]"><X size={17}/></button>
      </div>
      <div className="p-6">
        <div className="rounded-xl bg-[#f6faf8] p-5"><p className="text-[11px] uppercase tracking-[.12em] text-[#718097]">Amount</p><p className="mt-2 text-[28px] font-semibold">{money.format(transaction.amount)}</p>{transaction.credits !== 0 && <p className="mt-2 text-[12px] text-[#009b67]">Credits: {transaction.credits > 0 ? "+" : ""}{transaction.credits.toFixed(2)}</p>}</div>
        <dl className="mt-5 divide-y divide-[#edf1ef]">{rows.map(([label, value]) => <div key={label} className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]"><dt className="text-[12px] text-[#718097]">{label}</dt><dd className="break-all text-[13px] text-[#17213b]">{value}</dd></div>)}</dl>
        {(transaction.creditsApplied || transaction.pendingCredits) ? <div className="mt-5 rounded-xl border border-[#dce9e4] p-4"><p className="flex items-center gap-2 text-[13px] font-medium"><FileText size={16} className="text-[#009b67]"/> Credits summary</p>{transaction.creditsApplied ? <p className="mt-3 flex justify-between text-[12px]"><span className="text-[#718097]">Credits applied</span><span>{transaction.creditsApplied.toFixed(2)}</span></p> : null}{transaction.pendingCredits ? <p className="mt-2 flex justify-between text-[12px]"><span className="text-[#718097]">Pending reward</span><span>{transaction.pendingCredits.toFixed(2)} ({transaction.rewardStatus || "pending"})</span></p> : null}</div> : null}
      </div>
    </div>
  </div>;
}
