import { redirect } from "next/navigation";

export default async function LegacyCreditsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (Array.isArray(value)) value.forEach((entry) => params.append(key, entry));
    else if (value !== undefined) params.set(key, value);
  }
  redirect(`/dashboard/transactions${params.size ? `?${params}` : ""}`);
}
