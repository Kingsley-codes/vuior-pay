"use client";

import { CreditCard, X } from "lucide-react";
import BillDocumentPreview from "@/components/bills/BillDocumentPreview";
import type { Bill, Transaction } from "@/hooks/useVuiorData";
import {
  billsForTransaction,
  categoriesForTransaction,
  displayName,
  normalize,
  transactionKind,
  transactionPaymentMethod,
  transactionStatus,
} from "@/utils/transactions";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function TransactionDetailsModal({
  transaction,
  bills = [],
  onClose,
}: {
  transaction: Transaction;
  bills?: Bill[];
  onClose: () => void;
}) {
  const isCredit = transactionKind(transaction) === "credit";
  const linkedBills = isCredit ? [] : billsForTransaction(transaction, bills);
  const rawCredits = transaction.credits || transaction.amount;
  const credits = normalize(transaction.type).includes("sent")
    ? -Math.abs(rawCredits)
    : rawCredits;
  const publicBillIds = transaction.billPublicIds.length
    ? transaction.billPublicIds
    : transaction.billIds.map(
        (id) => bills.find((bill) => bill.id === id)?.billId || "Not recorded",
      );
  const paymentMethod = transactionPaymentMethod(transaction);
  const rows = [
    ["Transaction ID", transaction.transactionId],
    ...(linkedBills.length
      ? []
      : [["Bill IDs", publicBillIds.join(", ") || "Not applicable"]]),
    ["Type", displayName(transaction.type)],
    ...(linkedBills.length
      ? []
      : [
          ["Category", categoriesForTransaction(transaction, bills).join(", ")],
        ]),
    [
      "Payment method",
      paymentMethod === "stripe"
        ? "Stripe"
        : paymentMethod === "credits"
          ? "Credits"
          : transaction.paymentMethod || "Not recorded",
    ],
    ["Status", transactionStatus(transaction.status)],
    [
      "Date",
      transaction.date.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    ],
    ["Reference", transaction.reference || "Not recorded"],
  ];

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-[#07142d]/55 p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-title"
        className="max-h-[90vh] w-full max-w-[580px] overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-[#e7ecea] p-6">
          <div className="flex min-w-0 gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#eaf8f2] text-[#009b67]">
              <CreditCard size={20} />
            </span>
            <div className="min-w-0">
              <h2 id="transaction-title" className="text-[20px] font-semibold">
                Transaction details
              </h2>
              <p className="mt-1 break-words text-[12px] text-[#65728a]">
                {linkedBills.length > 1
                  ? `${linkedBills.length} bills in this payment`
                  : linkedBills[0]?.name || transaction.label}
              </p>
            </div>
          </div>
          <button
            aria-label="Close transaction details"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f1f4f3]"
          >
            <X size={17} />
          </button>
        </div>
        <div className="p-6">
          <div className="rounded-xl bg-[#f6faf8] p-5">
            <p className="text-[11px] uppercase tracking-[.12em] text-[#718097]">
              {isCredit ? "Credits" : "Amount"}
            </p>
            <p className="mt-2 text-[28px] font-semibold">
              {isCredit
                ? `${credits > 0 ? "+" : ""}${credits.toLocaleString(undefined, { maximumFractionDigits: 2 })} credits`
                : money.format(transaction.amount)}
            </p>
            {!isCredit && transaction.credits !== 0 && (
              <p className="mt-2 text-[12px] text-[#009b67]">
                Credits: {transaction.credits > 0 ? "+" : ""}
                {transaction.credits.toFixed(2)}
              </p>
            )}
            {Boolean(
              transaction.creditsApplied || transaction.pendingCredits,
            ) && (
              <div className="mt-4 space-y-2 border-t border-[#dce9e4] pt-3">
                {transaction.creditsApplied ? (
                  <p className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-[12px]">
                    <span className="text-[#718097]">Credits applied</span>
                    <span className="font-medium tabular-nums">
                      {transaction.creditsApplied.toFixed(2)} credits
                    </span>
                  </p>
                ) : null}
                {transaction.pendingCredits ? (
                  <p className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-[12px]">
                    <span className="text-[#718097]">Pending reward</span>
                    <span className="font-medium tabular-nums text-[#009b67]">
                      {transaction.pendingCredits.toFixed(2)} credits (
                      {transaction.rewardStatus || "pending"})
                    </span>
                  </p>
                ) : null}
              </div>
            )}
          </div>
          {linkedBills.length > 0 && (
            <section className="mt-5 rounded-xl border border-[#e2e8e6] p-4">
              <h3 className="text-[12px] font-semibold text-[#344260]">
                Bills included ({linkedBills.length})
              </h3>
              <ul className="mt-2 divide-y divide-[#edf1ef]">
                {linkedBills.map((bill) => (
                  <li
                    key={bill.id}
                    className="flex flex-col gap-1 py-3 first:pt-2 last:pb-1"
                  >
                    <span className="min-w-0 break-words text-[13px] font-medium text-[#26344c]">
                      {bill.name}
                    </span>
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#718097]">
                      <span className="min-w-0 break-words">
                        <span className="sr-only">Category: </span>
                        {bill.category || "Uncategorized"}
                      </span>
                      <span className="break-all font-mono text-[10px]">
                        <span className="sr-only">Bill ID: </span>
                        {bill.billId}
                      </span>
                    </span>
                    {bill.documentUrl ? (
                      <BillDocumentPreview
                        url={bill.documentUrl}
                        documentType={bill.documentType}
                      />
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          )}
          <dl className="mt-5 divide-y divide-[#edf1ef]">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]"
              >
                <dt className="text-[12px] text-[#718097]">{label}</dt>
                <dd className="break-all text-[13px] text-[#17213b]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
