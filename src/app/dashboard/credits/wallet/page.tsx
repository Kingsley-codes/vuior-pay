import { redirect } from "next/navigation";

export default async function LegacyWalletPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  redirect(`/dashboard/credits?wallet=${tab === "send" ? "send" : "add"}`);
}
