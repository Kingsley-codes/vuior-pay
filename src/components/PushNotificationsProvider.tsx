"use client";

import Link from "next/link";
import { beforeAuthStateChanged, onAuthStateChanged } from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { auth } from "@/services/firebase";
import { messagingClient, pushConfigured, pushDisabled, registerPush, unregisterPush } from "@/services/pushNotifications";

type PushStatus = "checking" | "unsupported" | "unconfigured" | "available" | "enabled" | "blocked";
type PushContextValue = { status: PushStatus; busy: boolean; error: string; enable: () => Promise<void>; disable: () => Promise<void> };
const PushContext = createContext<PushContextValue | null>(null);
export const usePushNotifications = () => useContext(PushContext);
type Alert = { id: string; title: string; body: string; url: string };

export default function PushNotificationsProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<PushStatus>("checking");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState<Alert | null>(null);

  useEffect(() => {
    let disposed = false;
    let unsubscribeMessages: (() => void) | undefined;
    const seen = new Set<string>();
    const unsubscribeBefore = beforeAuthStateChanged(auth, async (next) => {
      if (auth.currentUser && auth.currentUser.uid !== next?.uid) {
        // Applies to manual logout, idle logout and account changes alike.
        try { await unregisterPush(auth.currentUser.uid); }
        catch { console.warn("Push token cleanup will be retried on the next visit."); }
      }
    });
    const sync = async (user: typeof auth.currentUser) => {
      setAlert(null);
      setError("");
      try {
        const client = await messagingClient();
        if (disposed || auth.currentUser?.uid !== user?.uid) return;
        if (!client) { setStatus("unsupported"); return; }
        if (!user) {
          await unregisterPush();
          if (!disposed) setStatus("available");
          return;
        }
        if (pushDisabled(user.uid)) { await unregisterPush(user.uid); if (!disposed) setStatus("available"); return; }
        if (!pushConfigured) { setStatus("unconfigured"); return; }
        if (Notification.permission === "denied") { setStatus("blocked"); await unregisterPush(user.uid); return; }
        setStatus("available");
        if (Notification.permission === "granted" && !pushDisabled(user.uid)) {
          const registered = await registerPush(user.uid);
          if (!disposed && auth.currentUser?.uid === user.uid && registered) setStatus("enabled");
        }
      } catch {
        if (!disposed) { setStatus("available"); setError("Could not connect notifications. Please try again."); }
      }
    };
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => { void sync(user); });
    let lastRefresh = Date.now();
    const refresh = () => {
      if (document.visibilityState !== "visible" || !auth.currentUser) return;
      if (Date.now() - lastRefresh < 3600000) return;
      lastRefresh = Date.now();
      void sync(auth.currentUser);
    };
    const retryOnline = () => { lastRefresh = 0; refresh(); };
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("online", retryOnline);
    void messagingClient().then((client) => {
      if (!client || disposed) return;
      unsubscribeMessages = client.sdk.onMessage(client.messaging, (payload) => {
        const data = payload.data;
        const uid = auth.currentUser?.uid;
        if (!data || !uid || data.userId !== uid || pushDisabled(uid) || !data.notificationId || seen.has(data.notificationId)) return;
        seen.add(data.notificationId);
        if (seen.size > 200) seen.delete(seen.values().next().value!);
        const url = data.url?.startsWith("/dashboard") && !data.url.includes("\\") ? data.url : "/dashboard";
        setAlert({ id: data.notificationId, title: data.title || "Vuior update", body: data.body || "", url });
      });
    }).catch(() => { if (!disposed) setStatus("unsupported"); });
    return () => { disposed = true; unsubscribeAuth(); unsubscribeBefore(); unsubscribeMessages?.(); document.removeEventListener("visibilitychange", refresh); window.removeEventListener("online", retryOnline); };
  }, []);

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 8000);
    return () => clearTimeout(timer);
  }, [alert]);

  const enable = useCallback(async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    setBusy(true); setError("");
    try {
      // Request immediately from this click, preserving the browser user gesture.
      const permission = await Notification.requestPermission();
      if (permission !== "granted") { setStatus(permission === "denied" ? "blocked" : "available"); return; }
      if (await registerPush(uid)) setStatus("enabled");
    } catch { setError("Could not enable notifications. Please try again."); }
    finally { setBusy(false); }
  }, []);
  const disable = useCallback(async () => {
    setBusy(true); setError("");
    try { await unregisterPush(auth.currentUser?.uid, true); setStatus("available"); setAlert(null); }
    catch { setError("Could not finish turning off notifications. Please try again."); }
    finally { setBusy(false); }
  }, []);

  return <PushContext.Provider value={{ status, busy, error, enable, disable }}>
    {children}
    {alert ? <aside role="status" aria-live="polite" className="fixed bottom-5 right-5 z-[100] w-[min(24rem,calc(100vw-2.5rem))] rounded-xl border border-[#dfe6e4] bg-white p-4 text-[#16254b] shadow-xl">
      <div className="flex items-start gap-3"><Link href={alert.url} onClick={() => setAlert(null)} className="min-w-0 flex-1"><p className="text-sm font-semibold">{alert.title}</p><p className="mt-1 text-xs leading-5 text-[#66748b]">{alert.body}</p></Link><button type="button" onClick={() => setAlert(null)} aria-label="Dismiss notification" className="px-2 text-xl">?</button></div>
    </aside> : null}
  </PushContext.Provider>;
}
