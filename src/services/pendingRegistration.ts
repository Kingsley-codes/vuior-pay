"use client";

export type RegisterPayload = {
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

const PENDING_REGISTRATION_KEY = "vuior_pending_registration";

export function setPendingRegistration(payload: RegisterPayload): void {
  sessionStorage.setItem(PENDING_REGISTRATION_KEY, JSON.stringify(payload));
}

export function getPendingRegistration(): RegisterPayload | null {
  const rawPayload = sessionStorage.getItem(PENDING_REGISTRATION_KEY);
  if (!rawPayload) return null;

  try {
    return JSON.parse(rawPayload) as RegisterPayload;
  } catch {
    clearPendingRegistration();
    return null;
  }
}

export function clearPendingRegistration(): void {
  sessionStorage.removeItem(PENDING_REGISTRATION_KEY);
}
