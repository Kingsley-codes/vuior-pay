"use client";

import PaymentMethodsPanel from "@/components/profile/PaymentMethodsPanel";
import { Suspense } from "react";
import { CreditCard, LockKeyhole, UserRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import NotificationsMenu from "@/components/dashboard/NotificationsMenu";
import { useVuiorSession } from "@/hooks/useVuiorSession";
import { ProfileSettingsPanel } from "@/app/dashboard/profile/page";
import { SecuritySettingsPanel } from "@/app/dashboard/security/page";
import { SettingsSkeleton as SettingsPageSkeleton } from "@/components/dashboard/DashboardSkeletons";

type SettingsTab = "profile" | "security" | "payments";

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsPageSkeleton />}>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useVuiorSession();
  const tab: SettingsTab =
    searchParams.get("tab") === "payments" ? "payments" : searchParams.get("tab") === "security" ? "security" : "profile";

  function selectTab(next: SettingsTab) {
    router.replace(
      next !== "profile"
        ? `/dashboard/settings?tab=${next}`
        : "/dashboard/settings",
      { scroll: false },
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8 lg:py-10">
      <div className="flex items-start justify-between gap-4">
        <div className="ml-12 sm:ml-0">
          <p className="text-base font-bold uppercase tracking-[.16em] text-[#00a36a]">
            Account
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-[-.03em] sm:text-[30px]">
            Settings
          </h1>
          <p className="mt-2 text-base text-[#68758d]">
            Manage your profile, payment methods and account security.
          </p>
        </div>
        <NotificationsMenu userId={user?.id} />
      </div>
      <div
        className="mt-7 flex max-w-full w-fit overflow-x-auto rounded-lg border border-[#dfe6e4] bg-white p-1 shadow-[0_5px_18px_rgba(25,55,47,.04)]"
        role="tablist"
        aria-label="Settings sections"
      >
        <TabButton
          active={tab === "profile"}
          onClick={() => selectTab("profile")}
          icon={<UserRound size={16} />}
        >
          Profile
        </TabButton>
        <TabButton
          active={tab === "security"}
          onClick={() => selectTab("security")}
          icon={<LockKeyhole size={16} />}
        >
          Security
        </TabButton>
        <TabButton active={tab === "payments"} onClick={() => selectTab("payments")} icon={<CreditCard size={16} />}>Payment methods</TabButton>
      </div>
      <div className="mt-6">
        {tab === "payments" ? <PaymentMethodsPanel /> : tab === "profile" ? (
          <ProfileSettingsPanel />
        ) : (
          <SecuritySettingsPanel />
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex h-10 shrink-0 items-center gap-2 rounded-md px-5 text-base font-semibold transition ${active ? "bg-[#eaf8f2] text-[#008f60]" : "text-[#66748a] hover:bg-[#f7f9f8]"}`}
    >
      {icon}
      {children}
    </button>
  );
}
