"use client";

import { auth } from "@/services/firebase";
import { appCheckFetch } from "@/services/appCheckFetch";

const FUNCTIONS_BASE_URL = (
  process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_BASE_URL ||
  "https://us-central1-vuior-3c7ff.cloudfunctions.net"
).replace(/\/$/, "");

const REQUEST_REGISTRATION_OTP_URL =
  process.env.NEXT_PUBLIC_REQUEST_REGISTRATION_OTP_URL ||
  `${FUNCTIONS_BASE_URL}/requestRegistrationOtp`;
const VERIFY_REGISTRATION_OTP_URL =
  process.env.NEXT_PUBLIC_VERIFY_REGISTRATION_OTP_URL ||
  `${FUNCTIONS_BASE_URL}/verifyRegistrationOtp`;
const REQUEST_PASSWORD_CHANGE_OTP_URL = `${FUNCTIONS_BASE_URL}/requestPasswordChangeOtp`;
const CONFIRM_PASSWORD_CHANGE_URL = `${FUNCTIONS_BASE_URL}/confirmPasswordChange`;

export type RegistrationPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneCountry: string;
  phoneLocal: string;
  dob: string;
  accountType: "personal" | "business";
  businessName?: string;
};

async function responseJson(response: Response) {
  const data = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
    userId?: string;
    customToken?: string;
  };
  if (!response.ok) throw new Error(data.message || "Request failed.");
  return data;
}

async function postRegistrationOtp(body: Record<string, unknown>) {
  return responseJson(
    await appCheckFetch(REQUEST_REGISTRATION_OTP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

export async function requestRegistrationOtp(
  payload: RegistrationPayload,
): Promise<void> {
  await postRegistrationOtp(payload);
}

export async function resendRegistrationOtp(email: string): Promise<void> {
  await postRegistrationOtp({ email });
}

export async function verifyRegistrationOTP(
  email: string,
  code: string,
): Promise<{
  success: boolean;
  message: string;
  userId: string;
  customToken: string;
}> {
  const data = await responseJson(
    await appCheckFetch(VERIFY_REGISTRATION_OTP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    }),
  );
  if (!data.userId || !data.customToken) {
    throw new Error("The verification response was incomplete.");
  }
  return {
    success: true,
    message: data.message || "Email verified.",
    userId: data.userId,
    customToken: data.customToken,
  };
}

async function authenticatedPost(
  url: string,
  body: Record<string, unknown> = {},
) {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in again to continue.");
  const token = await user.getIdToken(true);
  return responseJson(
    await appCheckFetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }),
  );
}

export async function requestPasswordChangeOtp(): Promise<void> {
  await authenticatedPost(REQUEST_PASSWORD_CHANGE_OTP_URL);
}

export async function confirmPasswordChange(
  code: string,
  newPassword: string,
): Promise<void> {
  await authenticatedPost(CONFIRM_PASSWORD_CHANGE_URL, { code, newPassword });
}
