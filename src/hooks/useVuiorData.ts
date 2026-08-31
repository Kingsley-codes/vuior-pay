"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  documentId,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebase";

export type Bill = {
  id: string;
  billId: string;
  name: string;
  category: string;
  amount: number;
  dueDate: string;
  status: string;
  autoPay: boolean;
  frequency: string;
  accountNumber?: string;
  documentUrl?: string;
  notes?: string;
  providerPhoneNumber?: string;
  address?: string;
  paidAt?: Date;
  paymentSubmittedAt?: Date;
  paidWith?: string;
  paymentId?: string;
  amountPaid?: number;
};

export type Transaction = {
  id: string;
  label: string;
  category: string;
  amount: number;
  status: string;
  date: Date;
  type: string;
  credits: number;
  reference?: string;
  transactionId: string;
  paymentId?: string;
  billIds: string[];
  billPublicIds: string[];
  paymentMethod?: string;
  creditsApplied: number;
  pendingCredits: number;
  rewardStatus?: string;
};

function asDate(value: unknown): Date | null {
  if (!value) return null;
  if (typeof value === "object" && value && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate();
  }
  const parsed = new Date(value as string | number | Date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizedBillStatus(status: unknown, dueDate: unknown) {
  const normalized = String(status ?? "active").trim().toLowerCase();
  if (!["active", "pending", "approved", "unpaid"].includes(normalized))
    return normalized;
  const due = asDate(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (due) {
    due.setHours(0, 0, 0, 0);
    if (due < today) return "overdue";
  }
  return normalized;
}

export function useVuiorData(userId?: string) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalBillPaymentsThisYear, setTotalBillPaymentsThisYear] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const unsubscribeBills = onSnapshot(
      query(
        collection(db, "bills"),
        where("user_id", "==", userId),
        where("isDeleted", "==", false),
      ),
      (snapshot) => {
        setBills(
          snapshot.docs.map((item) => {
            const data = item.data();
            return {
              id: item.id,
              billId: String(data.bill_ID ?? data.billId ?? "Not recorded"),
              name: String(data.name ?? data.billerName ?? "Bill"),
              category: String(data.category ?? data.billerName ?? "Other"),
              amount: Number(data.amount ?? 0),
              dueDate: String(data.dueDate ?? data.due_date ?? ""),
              status: normalizedBillStatus(
                data.status,
                data.dueDate ?? data.due_date,
              ),
              autoPay: Boolean(data.autoPay),
              frequency: String(data.frequency ?? "Monthly"),
              accountNumber: data.accountNumber
                ? String(data.accountNumber)
                : undefined,
              documentUrl: data.documentUrl
                ? String(data.documentUrl)
                : undefined,
              notes: data.notes ? String(data.notes) : undefined,
              providerPhoneNumber: data.providerPhoneNumber
                ? String(data.providerPhoneNumber)
                : undefined,
              address: data.address ? String(data.address) : undefined,
              paidAt: asDate(data.paidAt) ?? undefined,
              paymentSubmittedAt: asDate(data.paymentSubmittedAt) ?? undefined,
              paidWith: data.paidWith ? String(data.paidWith) : undefined,
              paymentId:
                (data.payment_ID ??
                data.paymentId ??
                data.earlyPaymentReward?.paymentTransactionId)
                  ? String(
                      data.payment_ID ??
                        data.paymentId ??
                        data.earlyPaymentReward?.paymentTransactionId,
                    )
                  : undefined,
              amountPaid:
                data.amountPaid == null ? undefined : Number(data.amountPaid),
            };
          }),
        );
      },
    );

    const unsubscribeTransactions = onSnapshot(
      query(
        collection(db, "transactionHistory"),
        where("userId", "==", userId),
      ),
      (snapshot) => {
        const next = snapshot.docs.map((item) => {
          const data = item.data();
          return {
            id: item.id,
            label: String(
              data.billName ?? data.name ?? data.description ?? "Bill payment",
            ),
            category: String(data.category ?? "Payment"),
            amount: Number(data.amount ?? data.amountPaid ?? 0),
            status: String(data.status ?? "completed"),
            date:
              asDate(data.date ?? data.createdAt ?? data.paidAt) ?? new Date(0),
            type: String(data.type ?? "bill_payment"),
            credits: Number(data.credits ?? 0),
            reference: data.reference ? String(data.reference) : undefined,
            transactionId: String(
              data.transaction_ID ??
                data.payment_ID ??
                data.reference ??
                item.id,
            ),
            paymentId: data.payment_ID ? String(data.payment_ID) : undefined,
            billIds: Array.isArray(data.billIds)
              ? data.billIds.map(String)
              : [],
            billPublicIds: Array.isArray(data.bill_IDs)
              ? data.bill_IDs.map(String)
              : [],
            paymentMethod: data.paymentMethod
              ? String(data.paymentMethod)
              : undefined,
            creditsApplied: Number(
              data.creditsApplied ?? data.creditApplied ?? 0,
            ),
            pendingCredits: Number(data.pendingCredits ?? 0),
            rewardStatus: data.rewardStatus
              ? String(data.rewardStatus)
              : undefined,
          };
        });
        next.sort((a, b) => b.date.getTime() - a.date.getTime());
        setTransactions(next);
      },
    );

    const unsubscribeStats = onSnapshot(
      query(collection(db, "stats"), where(documentId(), "==", userId)),
      (snapshot) => {
        const data = snapshot.docs[0]?.data();
        setWalletBalance(
          Number(
            data?.availableBalance ?? data?.walletBalance ?? data?.balance ?? 0,
          ),
        );
        setTotalBillPaymentsThisYear(
          Number(data?.totalBillPaymentsThisYear ?? 0),
        );
      },
    );

    return () => {
      unsubscribeBills();
      unsubscribeTransactions();
      unsubscribeStats();
    };
  }, [userId]);

  const activeBills = useMemo(
    () =>
      bills.filter((bill) =>
        ["active", "upcoming"].includes(bill.status.trim().toLowerCase()),
      ),
    [bills],
  );

  return {
    bills,
    activeBills,
    transactions,
    walletBalance,
    totalBillPaymentsThisYear,
  };
}
