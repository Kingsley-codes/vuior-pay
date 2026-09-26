import { redirect } from "next/navigation";

export default async function LegacyWalletPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  redirect(`/dashboard/transactions?wallet=${tab === "send" ? "send" : "add"}`);
}
