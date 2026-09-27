"use client";

import { completeSocialProfile } from "./socialProfile";
import { appCheckFetch } from "@/services/appCheckFetch";

import {
  sendPasswordResetEmail,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { extractErrorInfo } from "./authErrors";
import { logAuditEvent } from "./auditLog";
import { assertFirebaseConfig, auth, db, googleProvider } from "./firebase";
import { clearAuthenticatedActivity, markAuthenticatedActivity } from "@/hooks/useIdleLogout";

const DELETE_ACCOUNT_ENDPOINT =
  "https://us-central1-vuior-3c7ff.cloudfunctions.net/deleteAccount";

type LoginResult = {
  mustChangePassword: boolean;
};

export async function login(
  email: string,
  password: string,
): Promise<LoginResult> {
  assertFirebaseConfig();

  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    const userRef = doc(db, "users", credential.user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("Your account profile could not be found.");
    }

    if (userDoc.data()?.isDeleted === true) {
      await signOut(auth);
      throw new Error("This account is no longer available.");
    }

    await updateDoc(userRef, {
      lastLogin: Timestamp.now(),
    });

    await logAuditEvent({
      event: "login_success",
      userId: credential.user.uid,
      email,
      method: "email",
    });

    markAuthenticatedActivity();

    return {
      mustChangePassword: userDoc.data()?.mustChangePassword === true,
    };
  } catch (error) {
    const { code, message } = extractErrorInfo(error);

    await logAuditEvent({
      event: "login_failed",
      status: "failure",
      email,
      method: "email",
      errorCode: code,
      errorMessage: message,
      attachIdToken: false,
    });

    throw error;
  }
}

export async function completeVerifiedRegistration(customToken: string) {
  assertFirebaseConfig();
  const credential = await signInWithCustomToken(auth, customToken);
  const userRef = doc(db, "users", credential.user.uid);
  await updateDoc(userRef, { lastLogin: Timestamp.now() });
  await logAuditEvent({
    event: "signup_success",
    userId: credential.user.uid,
    email: credential.user.email,
    method: "email",
  });
  markAuthenticatedActivity();
}

export async function forgotPassword(email: string) {
  assertFirebaseConfig();

  try {
    await sendPasswordResetEmail(auth, email);

    await logAuditEvent({
      event: "password_reset_requested",
      email,
      method: "email",
      attachIdToken: false,
    });
  } catch (error) {
    const { code, message } = extractErrorInfo(error);

    await logAuditEvent({
      event: "password_reset_failed",
      status: "failure",
      email,
      method: "email",
      errorCode: code,
      errorMessage: message,
      attachIdToken: false,
    });

    throw error;
  }
}

export async function continueWithGoogle() {
  assertFirebaseConfig();

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const { isNewUser, mustChangePassword } = await completeSocialProfile(result.user);

    await logAuditEvent({
      event: isNewUser ? "social_signup_success" : "social_login_success",
      userId: result.user.uid,
      email: result.user.email,
      method: "google",
    });
    markAuthenticatedActivity();
    return { mustChangePassword };
  } catch (error) {
    const { code, message } = extractErrorInfo(error);

    await logAuditEvent({
      event: "login_failed",
      status: "failure",
      method: "google",
      errorCode: code,
      errorMessage: message,
      attachIdToken: false,
    });

    throw error;
  }
}

export async function refreshUser(): Promise<User | null> {
  assertFirebaseConfig();

  const currentUser = auth.currentUser;

  if (!currentUser) {
    return null;
  }

  await currentUser.reload();

  return auth.currentUser;
}

export async function deleteAccount(userId: string) {
  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.uid !== userId) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const token = await currentUser.getIdToken();
  const response = await appCheckFetch(DELETE_ACCOUNT_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  let payload: {
    success?: boolean;
    message?: string;
    data?: { userId: string; softDeleted: boolean };
  } = {};
  try {
    payload = await response.json();
  } catch {
    /* The error below covers non-JSON responses. */
  }

  if (!response.ok || payload.data?.softDeleted !== true) {
    throw new Error(payload.message || "Unable to delete your account.");
  }

  return payload.data;
}

// Signs the current user out of Firebase Auth.
export async function logout() {
  assertFirebaseConfig();

  try {
    const currentUser = auth.currentUser;

    await signOut(auth);
    clearAuthenticatedActivity();

    if (currentUser) {
      await logAuditEvent({
        event: "logout_success",
        userId: currentUser.uid,
        email: currentUser.email,
        method: "email",
      });
    }
  } catch (error) {
    const { code, message } = extractErrorInfo(error);

    await logAuditEvent({
      event: "logout_failed",
      status: "failure",
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      method: "email",
      errorCode: code,
      errorMessage: message,
      attachIdToken: false,
    });

    throw error;
  }
}
