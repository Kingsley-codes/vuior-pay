"use client";

import { collection, doc, increment, runTransaction, Timestamp } from "firebase/firestore";
import { auth, db } from "@/auth/firebase";
import type { Bill } from "@/hooks/useVuiorData";

const endpoints = {
  sendCredit: "https://sendcredit-5risxnudva-uc.a.run.app",
  addCredits: "https://createcheckoutsession-5risxnudva-uc.a.run.app",
  payBills: "https://us-central1-vuior-3c7ff.cloudfunctions.net/createBillsCheckoutSession",
};

async function post<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Authentication required. Please sign in again.");
  const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
  const data = await response.json().catch(() => ({})) as T & { error?: string; message?: string };
  if (!response.ok) throw new Error(data.message || data.error || "Request failed.");
  return data;
}

export function sendCredits(userId: string, recipientEmail: string, creditToSend: number) {
  return post<{ message: string }>(endpoints.sendCredit, { userId, recipientEmail, creditToSend });
}

export function createCreditsCheckout(userId: string, credits: number) {
  const base = window.location.origin;
  return post<{ sessionId: string; url?: string }>(endpoints.addCredits, { userId, credits, success_url: `${base}/dashboard/credits?checkout=success`, cancel_url: `${base}/dashboard/credits/wallet?tab=add&checkout=cancelled` });
}

export function createBillsCheckout(params: { userId: string; bills: Bill[]; creditsApplied: number; savings: number; customerId?: string }) {
  const base = window.location.origin;
  const subtotal = params.bills.reduce((sum, bill) => sum + bill.amount, 0);
  return post<{ sessionId: string; url?: string }>(endpoints.payBills, {
    userId: params.userId,
    visibleItems: params.bills.map((bill) => ({ id: bill.id, name: bill.name, amount: bill.amount, dueDate: bill.dueDate, quantity: 1 })),
    subtotal, total: subtotal - params.creditsApplied, creditApplied: params.creditsApplied, savings: params.savings,
    successUrl: `${base}/dashboard/pay?payment=success`, cancelUrl: `${base}/dashboard/pay?payment=cancelled`,
    sessionType: "billsPayment", autoPayIds: [], customerId: params.customerId || null,
  });
}

function rewardPercent(dueDate: string) {
  const days = Math.max(0, Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86400000));
  return days >= 15 ? 15 : days >= 8 ? 10 : days >= 4 ? 5 : days >= 1 ? 2 : 0;
}

export function billReward(bill: Bill) {
  return Number((bill.amount * rewardPercent(bill.dueDate) / 100).toFixed(2));
}

export async function payBillsWithCredits(userId: string, bills: Bill[]) {
  const total = Number(bills.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2));
  const reward = Number(bills.reduce((sum, bill) => sum + billReward(bill), 0).toFixed(2));
  const now = Timestamp.now();
  const transactionId = `VPT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  await runTransaction(db, async transaction => {
    const userRef = doc(db, "users", userId);
    const billRefs = bills.map(bill => doc(db, "bills", bill.id));
    const [userSnapshot, ...billSnapshots] = await Promise.all([transaction.get(userRef), ...billRefs.map(ref => transaction.get(ref))]);
    if (!userSnapshot.exists()) throw new Error("User not found.");
    const currentBalance = Number(userSnapshot.data().availableCredits ?? 0);
    if (currentBalance < total) throw new Error(`Insufficient credits. You need ${total - currentBalance} more credits.`);
    billSnapshots.forEach((snapshot, index) => {
      const data = snapshot.data();
      if (!snapshot.exists() || String(data?.user_id ?? data?.userId ?? "") !== userId || !["active", "upcoming"].includes(String(data?.status ?? "").toLowerCase())) throw new Error(`${bills[index].name} is no longer available for payment.`);
    });
    bills.forEach((bill, index) => {
      const credits = billReward(bill);
      transaction.update(billRefs[index], { status: "in review", paymentSubmittedAt: now, paidWith: "credits", amountPaid: bill.amount, earlyPaymentReward: credits ? { billId: bill.id, billAmount: bill.amount, credits, paymentTransactionId: transactionId, paymentMethod: "credits", calculatedAt: now, status: "pending" } : null, updatedAt: now });
    });
    transaction.update(userRef, { availableCredits: currentBalance - total, lastCreditUsage: now, totalCreditsUsed: increment(total) });
    transaction.set(doc(collection(db, "transactionHistory")), { transaction_ID: transactionId, userId, billIds: bills.map(b => b.id), amount: total, totalAmount: total, credits: -total, paymentMethod: "credits", status: "Completed", date: now, type: "Bill Payment", category: "Bill Transactions", pendingCredits: reward, rewardStatus: reward > 0 ? "pending" : "none" });
  });
  return { total, reward };
}

export function checkoutUrl(result: { sessionId: string; url?: string }) {
  return result.url || `https://checkout.stripe.com/c/pay/${result.sessionId}`;
}
