import { auth } from "@/services/firebase";
import { appCheckFetch } from "@/services/appCheckFetch";

export async function getTransactionReference(transactionId: string): Promise<string> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Sign in again to view this transaction.");
  const response = await appCheckFetch("https://us-central1-vuior-3c7ff.cloudfunctions.net/getTransactionReference", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ transactionId }),
  });
  if (!response.ok) throw new Error("Unable to load transaction reference.");
  return (await response.json()).reference;
}
