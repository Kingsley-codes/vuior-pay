"use client";

import { auth } from "@/services/firebase";
import { appCheckFetch } from "@/services/appCheckFetch";
import type { Bill } from "@/hooks/useVuiorData";

const endpoints = {
  sendCredit: "https://sendcredit-5risxnudva-uc.a.run.app",
  addCredits: "https://createcheckoutsession-5risxnudva-uc.a.run.app",
  payBills:
    "https://us-central1-vuior-3c7ff.cloudfunctions.net/createBillsCheckoutSession",
  payBillsWithCredits:
    "https://us-central1-vuior-3c7ff.cloudfunctions.net/payBillsWithCredits",
};

async function post<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Authentication required. Please sign in again.");
  const response = await appCheckFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as T & {
    error?: string;
    message?: string;
  };
  if (!response.ok)
    throw new Error(data.message || data.error || "Request failed.");
  return data;
}

export function sendCredits(
  userId: string,
  recipientEmail: string,
  creditToSend: number,
) {
  return post<{ message: string }>(endpoints.sendCredit, {
    userId,
    recipientEmail,
    creditToSend,
  });
}

export function createCreditsCheckout(userId: string, credits: number, saveCard = false) {
  if (!Number.isFinite(credits) || credits < 0.5) {
    throw new Error("Add at least $0.50 to continue to card checkout.");
  }
  if (credits > 999999.99) {
    throw new Error("You can add up to $999,999.99 per card payment. Enter a smaller amount.");
  }
  const base = window.location.origin;
  return post<{ sessionId: string; url?: string }>(endpoints.addCredits, {
    userId,
    credits,
    saveCard,
    success_url: `${base}/dashboard/transactions?checkout=success`,
    cancel_url: `${base}/dashboard/transactions?wallet=add&checkout=cancelled`,
  });
}

export function createBillsCheckout(params: {
  userId: string;
  bills: Bill[];
  creditsApplied: number;
  savings: number;
  customerId?: string;
  saveCard?: boolean;
  billAmounts?: Record<string, number>;
}) {
  const base = window.location.origin;
  const subtotal = params.bills.reduce((sum, bill) => sum + bill.amount, 0);
  return post<{ sessionId: string; url?: string }>(endpoints.payBills, {
    userId: params.userId,
    saveCard: params.saveCard === true,
    billAmounts: params.billAmounts,
    visibleItems: params.bills.map((bill) => ({
      id: bill.id,
      name: bill.name,
      amount: bill.amount,
      dueDate: bill.dueDate,
      quantity: 1,
    })),
    subtotal,
    total: subtotal - params.creditsApplied,
    creditApplied: params.creditsApplied,
    savings: params.savings,
    successUrl: `${base}/dashboard/bills?payment=success`,
    cancelUrl: `${base}/dashboard/bills?payment=cancelled`,
    sessionType: "billsPayment",
    customerId: params.customerId || null,
  });
}

function rewardPercent(dueDate: string) {
  const days = Math.max(
    0,
    Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86400000),
  );
  return days >= 15 ? 15 : days >= 8 ? 10 : days >= 4 ? 5 : days >= 1 ? 2 : 0;
}

export function billReward(bill: Bill) {
  return Number(((bill.amount * rewardPercent(bill.dueDate)) / 100).toFixed(2));
}

export async function payBillsWithCredits(userId: string, bills: Bill[], requestId = crypto.randomUUID().replaceAll("-", ""), billAmounts?: Record<string, number>) {
  return post<{ total: number; reward: number }>(endpoints.payBillsWithCredits, {
    userId,
    billIds: bills.map((bill) => bill.id),
    billAmounts,
    requestId,
  });
}

export function checkoutUrl(result: { sessionId: string; url?: string }) {
  return result.url || `https://checkout.stripe.com/c/pay/${result.sessionId}`;
}

export function createAutopaySetupSession(billId: string) {
  return post<{ url: string }>(
    "https://us-central1-vuior-3c7ff.cloudfunctions.net/createAutopaySetupSession",
    { billId },
  );
}

export function confirmAutopaySetup(sessionId: string) {
  return post<{ cardSaved: boolean }>(
    "https://us-central1-vuior-3c7ff.cloudfunctions.net/confirmAutopaySetup",
    { sessionId },
  );
}

export type SavedCard = { id: string; brand: string; last4: string; expMonth: number; expYear: number; isDefault: boolean; expired: boolean };
export function managePaymentMethods(input: { action: "list" | "default" | "remove" | "setupWeb" | "confirm"; paymentMethodId?: string; sessionId?: string }) {
  return post<{ cards: SavedCard[]; url?: string }>("https://us-central1-vuior-3c7ff.cloudfunctions.net/managePaymentMethods", input);
}
