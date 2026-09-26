"use client";

import { httpsCallable } from "firebase/functions";
import { app, auth, functions } from "@/services/firebase";

const TOKEN_KEY = "vuior.push.device";
const disabledKey = (uid: string) => "vuior.push.disabled." + uid;
export const pushConfigured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY);
export const pushDisabled = (uid: string) => localStorage.getItem(disabledKey(uid)) === "true";
let pending: Promise<unknown> = Promise.resolve();
function serial<T>(operation: () => Promise<T>): Promise<T> {
  const result = pending.catch(() => {}).then(operation);
  pending = result;
  return result;
}
export async function messagingClient() {
  const sdk = await import("firebase/messaging");
  if (!window.isSecureContext || !(await sdk.isSupported())) return null;
  return { sdk, messaging: sdk.getMessaging(app) };
}
async function setOwner(registration: ServiceWorkerRegistration, userId: string) {
  const worker = registration.active;
  if (!worker) throw new Error("Notifications are still starting. Please try again.");
  await new Promise<void>((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => { channel.port1.close(); reject(new Error("Notification setup timed out.")); }, 10000);
    channel.port1.onmessage = () => { clearTimeout(timer); channel.port1.close(); resolve(); };
    worker.postMessage({ type: "VUIOR_PUSH_OWNER", userId }, [channel.port2]);
  });
}
async function readyWorker() {
  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: "/", updateViaCache: "none" });
  if (registration.active) return registration;
  await new Promise<void>((resolve, reject) => {
    const worker = registration.installing || registration.waiting;
    if (!worker) { reject(new Error("Unable to start notifications.")); return; }
    const timer = setTimeout(() => { worker.removeEventListener("statechange", changed); reject(new Error("Notification setup timed out.")); }, 15000);
    function changed() {
      if (worker?.state === "activated" || worker?.state === "redundant") {
        clearTimeout(timer); worker.removeEventListener("statechange", changed);
        if (worker.state === "activated") resolve(); else reject(new Error("Unable to start notifications."));
      }
    }
    worker.addEventListener("statechange", changed);
    changed();
  });
  return registration;
}

export function registerPush(userId: string) {
  return serial(async () => {
    if (auth.currentUser?.uid !== userId || Notification.permission !== "granted") return false;
    if (!pushConfigured) throw new Error("Push notifications are not configured yet.");
    const client = await messagingClient();
    if (!client) throw new Error("This browser does not support push notifications.");
    const registration = await readyWorker();
    const token = await client.sdk.getToken(client.messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    if (!token) throw new Error("Could not register this browser for notifications.");
    if (auth.currentUser?.uid !== userId) return false;
    const previous = JSON.parse(localStorage.getItem(TOKEN_KEY) || "null") as { token: string; userId: string } | null;
    if (previous?.userId === userId && previous.token !== token) {
      await httpsCallable(functions, "unregisterPushDevice")({ token: previous.token });
    }
    await httpsCallable(functions, "registerPushDevice")({ token, platform: "web" });
    localStorage.setItem(TOKEN_KEY, JSON.stringify({ token, userId }));
    await setOwner(registration, userId);
    localStorage.removeItem(disabledKey(userId));
    return true;
  });
}

export function unregisterPush(userId?: string, disable = false) {
  return serial(async () => {
    if (!userId && auth.currentUser) return;
    if (disable && userId) localStorage.setItem(disabledKey(userId), "true");
    // Clear worker ownership first, including when network/auth cleanup fails.
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.getRegistration("/");
      if (registration?.active) await setOwner(registration, "");
    }
    const saved = JSON.parse(localStorage.getItem(TOKEN_KEY) || "null") as { token: string; userId: string } | null;
    let revoked = false;
    if (saved && auth.currentUser?.uid === saved.userId) {
      try {
        await httpsCallable(functions, "unregisterPushDevice")({ token: saved.token });
        revoked = true;
      } catch { /* FCM deletion below also invalidates the server's token. */ }
    }
    const client = saved ? await messagingClient() : null;
    if (client) {
      try { await client.sdk.deleteToken(client.messaging); }
      catch (error) { if (!revoked) throw error; }
    }
    localStorage.removeItem(TOKEN_KEY);
  });
}
