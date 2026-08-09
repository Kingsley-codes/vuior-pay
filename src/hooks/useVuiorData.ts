"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  documentId,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/auth/firebase";

export type Bill = {
  id: string;
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
};

function asDate(value: unknown): Date | null {
  if (!value) return null;
  if (typeof value === "object" && value && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate();
  }
  const parsed = new Date(value as string | number | Date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
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
              name: String(data.name ?? data.billerName ?? "Bill"),
              category: String(data.category ?? data.billerName ?? "Other"),
              amount: Number(data.amount ?? 0),
              dueDate: String(data.dueDate ?? data.due_date ?? ""),
              status: String(data.status ?? "active"),
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
