"use client";

const SERVICE_ID = "service_j17uiar";
const TEMPLATE_ID = "template_2rsiv8q";
const PUBLIC_KEY = "O6aIOujSd28u6JbI0";
const OTP_STORAGE_KEY = "vuior_pending_otp";

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

export function verifyOTP(email: string, code: string) {
  const currentOtp = getStoredOtp();

  if (!currentOtp) {
    return { valid: false, message: "No OTP was sent. Please request a new code." };
  }

  if (currentOtp.email !== email.toLowerCase().trim()) {
    return { valid: false, message: "Email does not match. Please request a new code." };
  }

  if (Date.now() > currentOtp.expiresAt) {
    sessionStorage.removeItem(OTP_STORAGE_KEY);
    return { valid: false, message: "OTP has expired. Please request a new code." };
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
