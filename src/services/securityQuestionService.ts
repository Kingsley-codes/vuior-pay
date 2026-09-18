"use client";

import { auth } from "@/services/firebase";
import { appCheckFetch } from "@/services/appCheckFetch";

const FUNCTIONS_BASE_URL = (
  process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_BASE_URL ||
  "https://us-central1-vuior-3c7ff.cloudfunctions.net"
).replace(/\/$/, "");

export async function updateSecurityQuestion(question: string, answer: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in again to continue.");
  const token = await user.getIdToken(true);
  const response = await appCheckFetch(`${FUNCTIONS_BASE_URL}/updateSecurityQuestion`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, answer }),
  });
  const data = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) throw new Error(data.message || "Could not save your security question.");
}
