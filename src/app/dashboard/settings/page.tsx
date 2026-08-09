"use client";

import { Suspense } from "react";
import { LockKeyhole, UserRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { ProfileSettingsPanel } from "@/app/dashboard/profile/page";
import { SecuritySettingsPanel } from "@/app/dashboard/security/page";

type SettingsTab = "profile" | "security";

export default function SettingsPage() {
  return <DashboardShell><Suspense fallback={<SettingsSkeleton/>}><SettingsContent/></Suspense></DashboardShell>;
}

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab: SettingsTab = searchParams.get("tab") === "security" ? "security" : "profile";

  function selectTab(next: SettingsTab) {
    router.replace(next === "security" ? "/dashboard/settings?tab=security" : "/dashboard/settings", { scroll: false });
  }

  return <div className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8 lg:py-10">
    <div className="ml-12 sm:ml-0"><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#00a36a]">Account</p><h1 className="mt-2 text-2xl font-bold tracking-[-.03em] sm:text-[30px]">Settings</h1><p className="mt-2 text-[13px] text-[#68758d]">Manage your profile information and account security.</p></div>
    <div className="mt-7 flex w-fit rounded-lg border border-[#dfe6e4] bg-white p-1 shadow-[0_5px_18px_rgba(25,55,47,.04)]" role="tablist" aria-label="Settings sections">
      <TabButton active={tab === "profile"} onClick={() => selectTab("profile")} icon={<UserRound size={16}/>}>Profile</TabButton>
      <TabButton active={tab === "security"} onClick={() => selectTab("security")} icon={<LockKeyhole size={16}/>}>Security</TabButton>
    </div>
    <div className="mt-6">{tab === "profile" ? <ProfileSettingsPanel/> : <SecuritySettingsPanel/>}</div>
  </div>;
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`flex h-10 items-center gap-2 rounded-md px-5 text-[12px] font-semibold transition ${active ? "bg-[#eaf8f2] text-[#008f60]" : "text-[#66748a] hover:bg-[#f7f9f8]"}`}>{icon}{children}</button>;
}

function SettingsSkeleton() { return <div className="mx-auto max-w-[1100px] animate-pulse px-5 py-10 sm:px-8"><div className="h-8 w-40 rounded bg-[#e7ecea]"/><div className="mt-3 h-3 w-72 rounded bg-[#eef2f0]"/><div className="mt-8 h-12 w-56 rounded-lg bg-[#e7ecea]"/><div className="mt-6 h-96 rounded-2xl bg-white"/></div> }
