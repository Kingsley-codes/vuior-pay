"use client";

import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/services/firebase";

export const IDLE_TIMEOUT_MS = 20 * 60 * 1000;
export const LAST_ACTIVITY_KEY = "vuior.lastAuthenticatedActivity";

export function markAuthenticatedActivity() {
  if (typeof window !== "undefined") localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
}

export function clearAuthenticatedActivity() {
  if (typeof window !== "undefined") localStorage.removeItem(LAST_ACTIVITY_KEY);
}

export function useIdleLogout(enabled: boolean) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let signingOut = false;
    let lastRecorded = 0;

    const expireOrSchedule = () => {
      if (timer) clearTimeout(timer);
      const saved = Number(localStorage.getItem(LAST_ACTIVITY_KEY));
      const lastActivity = Number.isFinite(saved) && saved > 0 ? saved : Date.now();
      if (!saved) localStorage.setItem(LAST_ACTIVITY_KEY, String(lastActivity));
      const remaining = IDLE_TIMEOUT_MS - (Date.now() - lastActivity);
      if (remaining <= 0) {
        if (signingOut) return;
        signingOut = true;
        clearAuthenticatedActivity();
        void signOut(auth).finally(() => router.replace("/login?reason=inactivity"));
        return;
      }
      timer = setTimeout(expireOrSchedule, remaining);
    };

    const recordActivity = () => {
      const now = Date.now();
      if (now - lastRecorded < 1000) return;
      lastRecorded = now;
      localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
      expireOrSchedule();
    };
    const checkVisibility = () => {
      if (document.visibilityState === "visible") expireOrSchedule();
    };
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "scroll", "touchstart", "mousemove"];
    events.forEach((event) => window.addEventListener(event, recordActivity, { passive: true }));
    document.addEventListener("visibilitychange", checkVisibility);
    window.addEventListener("storage", expireOrSchedule);
    expireOrSchedule();

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, recordActivity));
      document.removeEventListener("visibilitychange", checkVisibility);
      window.removeEventListener("storage", expireOrSchedule);
    };
  }, [enabled, router]);
}
