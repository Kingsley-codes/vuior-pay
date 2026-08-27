"use client";

import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { extractErrorInfo } from "./authErrors";
import { logAuditEvent } from "./auditLog";
import { assertFirebaseConfig, auth, db, googleProvider } from "./firebase";
import type { RegisterPayload } from "./pendingRegistration";
import { normalizeInternationalPhone } from "@/utils/inputFormatting";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=Vuior+User&background=00a968&color=fff";

type LoginResult = {
  mustChangePassword: boolean;
};

function generatePublicId(prefix: string) {
  const randomId = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${randomId}`;
}

async function upsertSocialUser(user: User) {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  const [firstName = "", ...lastNameParts] = (user.displayName || "")
    .trim()
    .split(/\s+/);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      user_ID: generatePublicId("VPU"),
      email: user.email || "",
      firstName,
      lastName: lastNameParts.join(" "),
      role: "user",
      status: "active",
      phoneNo: user.phoneNumber || "",
      avatar: user.photoURL || DEFAULT_AVATAR,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dob: "",
      accountType: "personal",
      businessName: null,
      emailVerified: user.emailVerified,
      createdAt: Timestamp.now(),
      availableCredits: 0,
      lastLogin: Timestamp.now(),
    });

    return { isNewUser: true };
  }

  await updateDoc(userRef, { lastLogin: Timestamp.now() });

  return { isNewUser: false };
}

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

    await updateDoc(userRef, {
      lastLogin: Timestamp.now(),
    });

    await logAuditEvent({
      event: "login_success",
      userId: credential.user.uid,
      email,
      method: "email",
    });

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

export async function registerUser(payload: RegisterPayload) {
  assertFirebaseConfig();

  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      payload.email,
      payload.password,
    );

    const phoneNo = normalizeInternationalPhone(
      payload.phoneLocal.trim().startsWith("+")
        ? payload.phoneLocal
        : `${payload.phoneCountry.trim()} ${payload.phoneLocal.trim()}`,
    );

    await setDoc(doc(db, "users", credential.user.uid), {
      user_ID: generatePublicId("VPU"),
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: "user",
      status: "active",
      phoneNo,
      avatar: DEFAULT_AVATAR,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dob: payload.dob,
      accountType: payload.accountType,
      businessName: payload.businessName || null,
      emailVerified: true,
      createdAt: Timestamp.now(),
      availableCredits: 0,
      lastLogin: Timestamp.now(),
    });

    await logAuditEvent({
      event: "signup_success",
      userId: credential.user.uid,
      email: payload.email,
      method: "email",
      metadata: {
        accountType: payload.accountType,
      },
    });
  } catch (error) {
    const { code, message } = extractErrorInfo(error);

    await logAuditEvent({
      event: "signup_failed",
      status: "failure",
      email: payload.email,
      method: "email",
      errorCode: code,
      errorMessage: message,
      attachIdToken: false,
    });

    throw error;
  }
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
    const { isNewUser } = await upsertSocialUser(result.user);

    await logAuditEvent({
      event: isNewUser ? "social_signup_success" : "social_login_success",
      userId: result.user.uid,
      email: result.user.email,
      method: "google",
    });
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

// Signs the current user out of Firebase Auth.
export async function logout() {
  assertFirebaseConfig();

  try {
    const currentUser = auth.currentUser;

    await signOut(auth);

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
