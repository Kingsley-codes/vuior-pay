import { redirect } from "next/navigation";

export default async function PayPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const payment = typeof params.payment === "string" ? params.payment : undefined;
  redirect(payment ? `/dashboard/bills?payment=${encodeURIComponent(payment)}` : "/dashboard/bills");
}
