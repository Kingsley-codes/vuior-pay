"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import type { NotificationKind } from "@/services/notifications";

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  kind: NotificationKind;
  read: boolean;
  createdAt: Date | null;
};

function asDate(value: unknown): Date | null {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate();
  }
  if (!value) return null;
  const parsed = new Date(value as string | number | Date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    // Sorting locally retains compatibility with legacy documents and avoids a
    // composite Firestore index requirement during the migration.
    return onSnapshot(
      query(collection(db, "notifications"), where("userId", "==", userId)),
      (snapshot) => {
        const now = Date.now();
        setNotifications(
          snapshot.docs
            .map((item) => {
              const data = item.data();
              return {
                id: item.id,
                title: String(data.title ?? "Vuior update"),
                message: String(data.message ?? ""),
                kind: (data.kind ?? "general") as NotificationKind,
                read: data.read === true,
                createdAt: asDate(data.createdAt ?? data.timestamp),
                expiresAt: asDate(data.expiresAt),
              };
            })
            .filter((item) => !item.expiresAt || item.expiresAt.getTime() > now)
            .sort(
              (a, b) =>
                (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
            )
            .map(({ id, title, message, kind, read, createdAt }) => ({
              id,
              title,
              message,
              kind,
              read,
              createdAt,
            })),
        );
      },
      () => setNotifications([]),
    );
  }, [userId]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  );

  return {
    notifications,
    unreadCount,
    markRead: (id: string) => updateDoc(doc(db, "notifications", id), { read: true }),
    markAllRead: async () => {
      const unread = notifications.filter((item) => !item.read);
      await Promise.all(
        unread.map((item) => updateDoc(doc(db, "notifications", item.id), { read: true })),
      );
    },
    remove: (id: string) => deleteDoc(doc(db, "notifications", id)),
    clearAll: async () => {
      if (!userId) return;
      const snapshot = await getDocs(
        query(collection(db, "notifications"), where("userId", "==", userId)),
      );
      const chunks = Array.from({ length: Math.ceil(snapshot.docs.length / 500) }, (_, index) =>
        snapshot.docs.slice(index * 500, index * 500 + 500),
      );
      await Promise.all(
        chunks.map(async (items) => {
          const batch = writeBatch(db);
          items.forEach((item) => batch.delete(item.ref));
          await batch.commit();
        }),
      );
    },
  };
}
