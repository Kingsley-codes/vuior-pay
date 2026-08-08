"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/auth/firebase";

export type VuiorUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  availableCredits?: number;
  referralCode?: string;
  referralBonus?: number;
};

export function useVuiorSession() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<VuiorUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (nextUser) => {
      unsubscribeProfile?.();
      setFirebaseUser(nextUser);

      if (!nextUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      unsubscribeProfile = onSnapshot(
        doc(db, "users", nextUser.uid),
        (snapshot) => {
          const data = snapshot.data() ?? {};
          setUser({
            id: nextUser.uid,
            email: String(data.email ?? nextUser.email ?? ""),
            firstName: String(data.firstName ?? nextUser.displayName?.split(" ")[0] ?? "User"),
            lastName: String(data.lastName ?? ""),
            avatar: String(data.avatar ?? nextUser.photoURL ?? ""),
            availableCredits: Number(data.availableCredits ?? 0),
            referralCode: String(data.referralCode ?? data.referral_code ?? ""),
            referralBonus: Number(data.referralBonus ?? data.referralEarnings ?? 0),
          });
          setLoading(false);
        },
        () => {
          setUser({
            id: nextUser.uid,
            email: nextUser.email ?? "",
            firstName: nextUser.displayName?.split(" ")[0] ?? "User",
            lastName: nextUser.displayName?.split(" ").slice(1).join(" ") ?? "",
            avatar: nextUser.photoURL ?? "",
            availableCredits: 0,
            referralCode: "",
            referralBonus: 0,
          });
          setLoading(false);
        },
      );
    });

    return () => {
      unsubscribeProfile?.();
      unsubscribeAuth();
    };
  }, []);

  return { firebaseUser, user, loading };
}
