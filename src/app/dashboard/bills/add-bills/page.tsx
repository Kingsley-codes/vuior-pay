import { redirect } from "next/navigation";

export default function LegacyAddBillPage() {
  redirect("/dashboard/bills?addBill=1");
}
