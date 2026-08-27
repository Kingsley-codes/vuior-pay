"use client";

const SERVICE_ID = "service_j17uiar";
const TEMPLATE_ID = "template_2rsiv8q";
const PUBLIC_KEY = "O6aIOujSd28u6JbI0";
const OTP_STORAGE_KEY = "vuior_pending_otp";
const PASSWORD_CHANGE_KEY = "vuior_pending_password_change";
const REQUEST_REGISTRATION_OTP_URL =
  process.env.NEXT_PUBLIC_REQUEST_REGISTRATION_OTP_URL ||
  "https://us-central1-vuior-3c7ff.cloudfunctions.net/requestRegistrationOtp";
const VERIFY_REGISTRATION_OTP_URL =
  process.env.NEXT_PUBLIC_VERIFY_REGISTRATION_OTP_URL ||
  "https://us-central1-vuior-3c7ff.cloudfunctions.net/verifyRegistrationOtp";

type RegistrationPayload = {
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

type OtpRecord = {
  code: string;
  email: string;
  expiresAt: number;
  flow: "register" | "password_reset";
};

function generateOTP(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function storeOtp(record: OtpRecord) {
  sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(record));
}

function getStoredOtp(): OtpRecord | null {
  const rawRecord = sessionStorage.getItem(OTP_STORAGE_KEY);
  if (!rawRecord) return null;

  try {
    return JSON.parse(rawRecord) as OtpRecord;
  } catch {
    sessionStorage.removeItem(OTP_STORAGE_KEY);
    return null;
  }
}

export async function sendOTP(
  email: string,
  flow: "register" | "password_reset" = "register",
): Promise<void> {
  if (flow === "register") {
    await postRegistrationOtp({ email });
    return;
  }

  const code = generateOTP();
  const normalizedEmail = email.toLowerCase().trim();

  storeOtp({
    code,
    email: normalizedEmail,
    expiresAt: Date.now() + 15 * 60 * 1000,
    flow,
  });

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      template_params: {
        email: email.trim(),
        passcode: code,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Unable to send OTP email.");
  }
}

async function postRegistrationOtp(body: Record<string, unknown>) {
  const response = await fetch(REQUEST_REGISTRATION_OTP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Unable to send OTP email.");
  }

  return data;
}

export async function requestRegistrationOtp(
  payload: RegistrationPayload,
): Promise<void> {
  await postRegistrationOtp(payload);
}

export function verifyOTP(email: string, code: string) {
  const currentOtp = getStoredOtp();

  if (!currentOtp) {
    return {
      valid: false,
      message: "No OTP was sent. Please request a new code.",
    };
  }

  if (currentOtp.email !== email.toLowerCase().trim()) {
    return {
      valid: false,
      message: "Email does not match. Please request a new code.",
    };
  }

  if (Date.now() > currentOtp.expiresAt) {
    sessionStorage.removeItem(OTP_STORAGE_KEY);
    return {
      valid: false,
      message: "OTP has expired. Please request a new code.",
    };
  }

  if (currentOtp.code !== code.trim()) {
    return { valid: false, message: "Invalid OTP. Please try again." };
  }

  sessionStorage.removeItem(OTP_STORAGE_KEY);
  return {
    valid: true,
    message: "Email verified successfully.",
    flow: currentOtp.flow,
  };
}

export async function verifyRegistrationOTP(
  email: string,
  code: string,
): Promise<{ success: boolean; message: string; userId?: string }> {
  const response = await fetch(VERIFY_REGISTRATION_OTP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Unable to verify OTP.");
  }

  return data;
}

export function setPendingPasswordChange(email: string, newPassword: string) {
  sessionStorage.setItem(
    PASSWORD_CHANGE_KEY,
    JSON.stringify({ email: email.toLowerCase().trim(), newPassword }),
  );
}

export function getPendingPasswordChange(): {
  email: string;
  newPassword: string;
} | null {
  const value = sessionStorage.getItem(PASSWORD_CHANGE_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as { email: string; newPassword: string };
  } catch {
    sessionStorage.removeItem(PASSWORD_CHANGE_KEY);
    return null;
  }
}

export function clearPendingPasswordChange() {
  sessionStorage.removeItem(PASSWORD_CHANGE_KEY);
}
