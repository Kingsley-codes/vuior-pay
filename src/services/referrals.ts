"use client";

import { auth } from "@/services/firebase";

const ENDPOINTS = {
  referral: "https://redeemreferralcode-5risxnudva-uc.a.run.app",
  promo: "https://redeempromocode-5risxnudva-uc.a.run.app",
};

async function postJson<T>(
  url: string,
  body: Record<string, unknown>,
): Promise<T> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Please sign in again to continue.");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as T & {
    message?: string;
  };
  if (!response.ok)
    throw new Error(data.message || "Request failed. Please try again.");
  return data;
}

export function redeemReferralCode(referralCode: string, userId: string) {
  return postJson<{ message: string }>(ENDPOINTS.referral, {
    referralCode,
    userId,
  });
}

export function redeemPromoCode(promoCode: string, userId: string) {
  return postJson<{ message: string; credits: number }>(ENDPOINTS.promo, {
    promoCode,
    userId,
  });
}
