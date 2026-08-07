"use client";

import { auth } from "./firebase";

type AuditEventType =
  | "login_success"
  | "login_failed"
  | "signup_success"
  | "signup_failed"
  | "social_login_success"
  | "social_signup_success"
  | "logout"
  | "password_reset_requested"
  | "password_reset_failed";

type LogEventOptions = {
  event: AuditEventType;
  status?: "success" | "failure";
  userId?: string | null;
  email?: string | null;
  method?: "email" | "google";
  errorCode?: string;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
  attachIdToken?: boolean;
};

const LOG_EVENT_URL =
  process.env.NEXT_PUBLIC_AUDIT_LOG_URL ||
  "https://us-central1-vuior-3c7ff.cloudfunctions.net/createAuditLog";

export async function logAuditEvent({
  event,
  status = "success",
  userId = null,
  email = null,
  method,
  errorCode,
  errorMessage,
  metadata = {},
  attachIdToken = true,
}: LogEventOptions): Promise<void> {
  try {
    const idToken =
      attachIdToken && auth.currentUser
        ? await auth.currentUser.getIdToken().catch(() => undefined)
        : undefined;

    const response = await fetch(LOG_EVENT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      },
      body: JSON.stringify({
        eventType: event,
        source: "web",
        category: "auth",
        outcome: status,
        userId,
        email,
        method,
        failureCode: errorCode,
        metadata: {
          ...metadata,
          errorCode: errorCode || null,
          errorMessage: errorMessage || null,
          method: method || null,
          platform: "web",
        },
        platform: "web",
      }),
    });

    if (!response.ok) {
      throw new Error(`Audit endpoint returned ${response.status}`);
    }
  } catch (error) {
    console.warn("[logAuditEvent] failed", error);
  }
}
