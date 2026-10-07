import { auth } from "@/services/firebase";
import { appCheckFetch } from "@/services/appCheckFetch";
import { DuplicateBillError, type BillConfirmation } from "@/utils/billDuplicates";
export async function saveUserBill(input: { values: Record<string, unknown>; billId?: string; requestId: string; confirmation?: BillConfirmation }) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Sign in again to save this bill.");
  const response = await appCheckFetch("https://us-central1-vuior-3c7ff.cloudfunctions.net/saveUserBill", {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(input),
  });
  const result = await response.json();
  if (!response.ok) {
    if (result.code === "duplicate-bill" && result.duplicate) throw new DuplicateBillError(result.message, result.duplicate, Boolean(result.canUpdate) && !input.billId);
    throw new Error(result.message || "Unable to save this bill.");
  }
  return result.data as { billId: string; updated: boolean };
}
