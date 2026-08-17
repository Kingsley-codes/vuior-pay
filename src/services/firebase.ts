"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  browserLocalPersistence,
  browserPopupRedirectResolver,
  browserSessionPersistence,
  getAuth,
  GoogleAuthProvider,
  initializeAuth,
  type Auth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

export function assertFirebaseConfig() {
  const missingConfig = Object.entries(firebaseConfig)
    .filter(([key, value]) => key !== "measurementId" && !value)
    .map(([key]) => key);

  if (missingConfig.length > 0) {
    throw new Error(
      `Missing Firebase config: ${missingConfig.join(", ")}. Add the matching NEXT_PUBLIC_* values to .env.local.`,
    );
  }
}

export const app: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

function getClientAuth(): Auth {
  if (typeof window === "undefined") {
    return getAuth(app);
  }

  try {
    return initializeAuth(app, {
      persistence: [browserLocalPersistence, browserSessionPersistence],
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch (error) {
    // Fast Refresh can re-evaluate this module after Auth has been initialized.
    if ((error as { code?: string }).code === "auth/already-initialized") {
      return getAuth(app);
    }

    throw error;
  }
}

export const auth = getClientAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  pagination?: UsersPage["pagination"];
};

export type UsersPage = {
  data: [];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

async function request<T>(
  endpoint: string,
  options: {
    params?: URLSearchParams;
    method?: "GET" | "POST";
    body?: unknown;
  } = {},
): Promise<ApiResponse<T>> {
  const user = auth.currentUser;
  if (!user) throw new Error("Your session has expired. Please sign in again.");
  const token = await user.getIdToken();
  const query = options.params?.toString();
  const response = await fetch(`${endpoint}${query ? `?${query}` : ""}`, {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok)
    throw new Error(payload.message || "Unable to load user data.");
  return payload;
}

export async function completeTemporaryPasswordChange(newPassword: string) {
  return (
    await request<{ mustChangePassword: false }>(
      "https://us-central1-vuior-3c7ff.cloudfunctions.net/completeTemporaryPasswordChange",
      { method: "POST", body: { newPassword } },
    )
  ).data;
}
