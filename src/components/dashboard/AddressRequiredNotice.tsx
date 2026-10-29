import Link from "next/link";
import { MapPin } from "lucide-react";
import type { VuiorUser } from "@/hooks/useVuiorSession";
import {
  ADDRESS_REQUIRED_MESSAGE,
  hasProfileAddress,
} from "@/utils/profileRequirements";

export default function AddressRequiredNotice({
  user,
  loading,
}: {
  user: Pick<VuiorUser, "address"> | null;
  loading: boolean;
}) {
  if (loading || !user || hasProfileAddress(user.address)) return null;

  return (
    <div
      role="status"
      className="mb-6 flex flex-col gap-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <MapPin size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-base font-semibold">Add your address to create bills</p>
          <p className="mt-1 text-base leading-6">
            {ADDRESS_REQUIRED_MESSAGE}
          </p>
        </div>
      </div>
      <Link
        href="/dashboard/settings?tab=profile"
        className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg bg-[#009b67] px-4 py-2 text-base font-semibold text-white transition hover:bg-[#008e5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009b67]"
      >
        Add address
      </Link>
    </div>
  );
}
