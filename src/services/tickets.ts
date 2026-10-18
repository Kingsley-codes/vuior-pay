"use client";

import { generatePublicId } from "@/utils/publicId";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/services/firebase";

export type TicketStatus = "open" | "in-progress" | "resolved" | "closed";

export type Ticket = {
  id: string;
  ticket_ID: string;
  userId: string;
  userEmail: string;
  subject: string;
  message: string;
  status: TicketStatus;
  attachments: string[];
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  closedAt?: Timestamp | null;
  category: string;
  phoneNumber: string;
};

export type CreateTicketData = Pick<
  Ticket,
  "userId" | "userEmail" | "subject" | "message" | "category" | "phoneNumber"
>;

export type PublicTicketImage = {
  name: string;
  contentType: string;
  data: string;
};

export async function createPublicTicket(ticketData: {
  name: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
  category: string;
  images: PublicTicketImage[];
}) {
  const baseUrl = (
    process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_BASE_URL ||
    "https://us-central1-vuior-3c7ff.cloudfunctions.net"
  ).replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/createPublicTicket`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticketData),
  });
  const payload = (await response.json()) as {
    success: boolean;
    message?: string;
  };
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Unable to submit your message.");
  }
}

export async function createTicket(ticketData: CreateTicketData) {
  const ticketRef = doc(collection(db, "tickets"));
  await setDoc(ticketRef, {
    ...ticketData,
    ticket_ID: generatePublicId("VTK"),
    status: "open",
    attachments: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ticketRef.id;
}

export async function uploadTicketImages(
  userId: string,
  ticketId: string,
  files: File[],
) {
  return Promise.all(
    files.map(async (file, index) => {
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const storageRef = ref(
        storage,
        `tickets/${userId}/${ticketId}/image_${index}_${Date.now()}.${extension}`,
      );
      await uploadBytes(storageRef, file, { contentType: file.type });
      return getDownloadURL(storageRef);
    }),
  );
}

export async function updateTicketAttachments(
  ticketId: string,
  attachments: string[],
) {
  await updateDoc(doc(db, "tickets", ticketId), {
    attachments,
    updatedAt: serverTimestamp(),
  });
}

export async function getUserTickets(userId: string): Promise<Ticket[]> {
  const snapshot = await getDocs(
    query(collection(db, "tickets"), where("userId", "==", userId)),
  );
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }) as Ticket)
    .sort(
      (a, b) =>
        (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0),
    );
}

export async function getActiveTicketCount(userId: string) {
  const snapshot = await getDocs(
    query(
      collection(db, "tickets"),
      where("userId", "==", userId),
      where("status", "in", ["open", "in-progress"]),
    ),
  );
  return snapshot.size;
}

export async function markTicketResolved(ticketId: string) {
  await updateDoc(doc(db, "tickets", ticketId), {
    status: "resolved",
    closedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function reopenTicket(ticketId: string) {
  const ticketRef = doc(db, "tickets", ticketId);
  const snapshot = await getDoc(ticketRef);
  if (!snapshot.exists()) throw new Error("Ticket not found.");

  const ticket = snapshot.data() as Partial<Ticket>;
  const closedAt = ticket.closedAt || ticket.updatedAt;
  const closedDate = closedAt?.toDate?.();
  if (!closedDate) throw new Error("This ticket cannot be reopened.");
  if ((Date.now() - closedDate.getTime()) / 3_600_000 > 48) {
    throw new Error("Tickets can only be reopened within 48 hours.");
  }

  await updateDoc(ticketRef, {
    status: "open",
    closedAt: null,
    updatedAt: serverTimestamp(),
  });
}
