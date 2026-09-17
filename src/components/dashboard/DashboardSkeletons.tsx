"use client";

import { usePathname } from "next/navigation";

function Bone({ className = "" }: { className?: string }) {
  return <div className={`rounded-md bg-[#e7ecea] ${className}`} />;
}

function PageHeading({ wide = false }: { wide?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-3">
        <Bone className="h-8 w-36" />
        <Bone className={`h-3 ${wide ? "w-80 max-w-[70vw]" : "w-60 max-w-[60vw]"}`} />
      </div>
      <Bone className="h-10 w-10 rounded-full" />
    </div>
  );
}

function Card({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  return <div className={`rounded-xl border border-[#e2e8e6] bg-white p-5 ${className}`}>{children}</div>;
}

function Rows({ count = 4 }: { count?: number }) {
  return <div className="divide-y divide-[#edf1ef]">{Array.from({ length: count }, (_, index) => <div key={index} className="flex items-center gap-3 py-4"><Bone className="h-9 w-9 shrink-0 rounded-full"/><div className="flex-1 space-y-2"><Bone className="h-3 w-2/5"/><Bone className="h-2.5 w-1/4 bg-[#eef2f0]"/></div><div className="space-y-2"><Bone className="ml-auto h-3 w-16"/><Bone className="ml-auto h-5 w-12"/></div></div>)}</div>;
}

export function DashboardHomeSkeleton() {
  return <SkeletonPage className="max-w-[1530px]"><PageHeading wide/><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({length:4},(_,i)=><Card key={i} className="flex min-h-[136px] items-center gap-4"><Bone className="h-14 w-14 shrink-0 rounded-full"/><div className="flex-1 space-y-3"><Bone className="h-3 w-3/5"/><Bone className="h-7 w-4/5"/><Bone className="h-2.5 w-1/2"/></div></Card>)}</div><Card className="mt-5"><Bone className="h-4 w-28"/><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({length:4},(_,i)=><Bone key={i} className="h-[74px]"/>)}</div></Card><div className="mt-5 grid gap-5 xl:grid-cols-[1.05fr_1.12fr_.85fr]"><Card><Bone className="h-4 w-32"/><Rows count={4}/></Card><Card><Bone className="h-4 w-40"/><Rows count={5}/></Card><Card><Bone className="h-4 w-28"/><Bone className="mt-6 h-16 w-full"/><Bone className="mt-5 h-10 w-full"/></Card></div></SkeletonPage>;
}

export function BillsSkeleton() {
  return <SkeletonPage className="max-w-[1530px]"><PageHeading/><div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({length:4},(_,i)=><Card key={i} className="h-[118px]"><Bone className="h-3 w-24"/><Bone className="mt-4 h-7 w-20"/><Bone className="mt-3 h-2.5 w-32"/></Card>)}</div><div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]"><Card className="overflow-hidden p-0"><div className="p-5"><Bone className="h-5 w-32"/><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_auto]"><Bone className="h-11"/><Bone className="h-11"/><Bone className="h-11 w-28"/></div></div><div className="border-t border-[#edf1ef] px-5"><Rows count={6}/></div></Card><div className="space-y-5"><Card className="h-48"><Bone className="h-10 w-10 rounded-full"/><Bone className="mt-5 h-4 w-36"/><Bone className="mt-3 h-3 w-full"/><Bone className="mt-2 h-3 w-4/5"/></Card><Card className="h-48"><Bone className="h-10 w-10 rounded-full"/><Bone className="mt-5 h-4 w-32"/><Bone className="mt-3 h-3 w-full"/></Card></div></div></SkeletonPage>;
}

export function PayBillsSkeleton() {
  return <SkeletonPage className="max-w-[1530px]"><PageHeading/><Bone className="mt-6 h-32 rounded-xl bg-[#dfe8e5]"/><Bone className="mt-5 h-12 rounded-lg"/><div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]"><Card className="p-0"><div className="p-5"><Bone className="h-5 w-24"/></div><div className="grid grid-cols-2 gap-px bg-[#edf1ef]">{Array.from({length:8},(_,i)=><div key={i} className="bg-white p-5"><Bone className="h-10 w-10 rounded-full"/><Bone className="mt-4 h-3 w-2/3"/><Bone className="mt-3 h-5 w-1/3"/></div>)}</div></Card><Card className="h-[420px]"><Bone className="h-5 w-32"/><div className="mt-6 space-y-5"><Bone className="h-12"/><Bone className="h-12"/><Bone className="h-20"/><Bone className="h-12 bg-[#dce9e4]"/></div></Card></div></SkeletonPage>;
}

export function CreditsSkeleton() {
  return <SkeletonPage className="max-w-[1530px]"><PageHeading/><div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({length:4},(_,i)=><Card key={i} className="h-32"><Bone className="h-3 w-28"/><Bone className="mt-5 h-8 w-24"/><Bone className="mt-4 h-2.5 w-32"/></Card>)}</div><div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_385px]"><Card><Bone className="h-5 w-32"/><Bone className="mt-5 h-11"/><Rows count={6}/></Card><div className="space-y-5">{Array.from({length:3},(_,i)=><Card key={i} className="h-44"><Bone className="h-4 w-32"/><Bone className="mt-5 h-16 w-full"/><Bone className="mt-4 h-3 w-3/4"/></Card>)}</div></div></SkeletonPage>;
}

export function ReferralsSkeleton() {
  return <SkeletonPage className="max-w-[1320px]"><div className="rounded-3xl bg-[#dce8e4] p-8 sm:p-10"><Bone className="h-6 w-28 bg-white/60"/><Bone className="mt-6 h-10 w-3/5 bg-white/70"/><Bone className="mt-4 h-3 w-2/5 bg-white/60"/><Bone className="mt-8 h-12 w-40 bg-white/70"/></div><div className="mt-5 grid gap-4 md:grid-cols-3">{Array.from({length:3},(_,i)=><Card key={i} className="h-32"><Bone className="h-10 w-10 rounded-full"/><Bone className="mt-4 h-3 w-28"/><Bone className="mt-2 h-6 w-20"/></Card>)}</div><div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="h-64"><Bone className="h-5 w-40"/><Bone className="mt-6 h-14"/><Bone className="mt-4 h-12"/></Card><Card className="h-64"><Bone className="h-5 w-36"/><Bone className="mt-6 h-14"/><Bone className="mt-4 h-12"/></Card></div></SkeletonPage>;
}

export function SupportSkeleton() {
  return <SkeletonPage className="max-w-[1250px]"><PageHeading wide/><Bone className="mt-7 h-12 w-80 max-w-full rounded-lg"/><div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,.72fr)]"><Card className="min-h-[520px]"><Bone className="h-5 w-40"/><div className="mt-7 grid gap-5 sm:grid-cols-2">{Array.from({length:4},(_,i)=><div key={i}><Bone className="h-3 w-24"/><Bone className="mt-2 h-12"/></div>)}</div><Bone className="mt-5 h-32"/><Bone className="mt-6 h-12 w-36"/></Card><div className="space-y-5"><Card className="h-28"><Bone className="h-10 w-10 rounded-full"/><Bone className="mt-3 h-3 w-32"/></Card><Card className="h-72"><Bone className="h-4 w-48"/><div className="mt-5 space-y-4"><Bone className="h-10"/><Bone className="h-10"/><Bone className="h-10"/><Bone className="h-10"/></div></Card></div></div></SkeletonPage>;
}

export function SettingsSkeleton({ security = false }: { security?: boolean }) {
  return <SkeletonPage className="max-w-[1100px]"><PageHeading wide/><Bone className="mt-7 h-12 w-56 rounded-lg"/>{security ? <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]"><Card className="min-h-[540px]"><Bone className="h-10 w-10"/><Bone className="mt-4 h-5 w-36"/>{Array.from({length:3},(_,i)=><div className="mt-6" key={i}><Bone className="h-3 w-28"/><Bone className="mt-2 h-12"/></div>)}<Bone className="mt-6 h-12"/></Card><div className="space-y-5"><Card className="h-72"><Bone className="h-5 w-40"/><Bone className="mt-6 h-12"/><Bone className="mt-4 h-12"/></Card><Bone className="h-40 rounded-2xl"/></div></div> : <div className="mt-6 grid gap-5 lg:grid-cols-[285px_minmax(0,1fr)]"><Card className="h-80 text-center"><Bone className="mx-auto h-28 w-28 rounded-full"/><Bone className="mx-auto mt-5 h-5 w-36"/><Bone className="mx-auto mt-3 h-3 w-44"/><Bone className="mx-auto mt-6 h-10 w-32"/></Card><Card className="min-h-[500px]"><Bone className="h-5 w-40"/><div className="mt-7 grid gap-5 sm:grid-cols-2">{Array.from({length:7},(_,i)=><div className={i===5?"sm:col-span-2":""} key={i}><Bone className="h-3 w-24"/><Bone className="mt-2 h-12"/></div>)}</div></Card></div>}</SkeletonPage>;
}

export function AddBillSkeleton() {
  return <SkeletonPage className="max-w-[920px]"><Bone className="h-4 w-24"/><Bone className="mt-6 h-8 w-44"/><Bone className="mt-3 h-3 w-72 max-w-full"/><Card className="mt-7 p-6 sm:p-8"><div className="grid gap-6 sm:grid-cols-2">{Array.from({length:8},(_,i)=><div className={i>5?"sm:col-span-2":""} key={i}><Bone className="h-3 w-28"/><Bone className={`mt-2 ${i===7?"h-28":"h-12"}`}/></div>)}</div><Bone className="ml-auto mt-7 h-12 w-36"/></Card></SkeletonPage>;
}

export function ChangePasswordSkeleton() {
  return <div className="grid min-h-screen place-items-center bg-[#f8faf9] p-5"><Card className="w-full max-w-md p-6"><Bone className="h-11 w-11 rounded-full"/><Bone className="mt-5 h-7 w-52"/><Bone className="mt-3 h-3 w-full"/>{Array.from({length:3},(_,i)=><div className="mt-5" key={i}><Bone className="h-3 w-28"/><Bone className="mt-2 h-12"/></div>)}<Bone className="mt-6 h-12 bg-[#dce9e4]"/></Card></div>;
}

function SkeletonPage({ className, children }: { className: string; children: React.ReactNode }) {
  return <div role="status" aria-label="Loading page" className={`mx-auto animate-pulse p-5 sm:p-7 lg:p-8 ${className}`}>{children}<span className="sr-only">Loading…</span></div>;
}

function skeletonFor(pathname: string) {
  if (pathname.includes("change-password")) return <ChangePasswordSkeleton/>;
  if (pathname.includes("add-bills")) return <AddBillSkeleton/>;
  if (pathname.startsWith("/dashboard/pay")) return <PayBillsSkeleton/>;
  if (pathname.startsWith("/dashboard/bills")) return <BillsSkeleton/>;
  if (pathname.startsWith("/dashboard/credits")) return <CreditsSkeleton/>;
  if (pathname.startsWith("/dashboard/referrals")) return <ReferralsSkeleton/>;
  if (pathname.startsWith("/dashboard/support")) return <SupportSkeleton/>;
  if (pathname.includes("security") || pathname.includes("tab=security")) return <SettingsSkeleton security/>;
  if (pathname.startsWith("/dashboard/settings") || pathname.startsWith("/dashboard/profile")) return <SettingsSkeleton/>;
  return <DashboardHomeSkeleton/>;
}

export function DashboardRouteSkeleton({ pathname }: { pathname: string }) {
  return skeletonFor(pathname);
}

export function DashboardLoadingScreen() {
  const pathname = usePathname();
  const content = skeletonFor(pathname);
  if (pathname.includes("change-password")) return content;
  return <DashboardSkeletonFrame>{content}</DashboardSkeletonFrame>;
}

export function DashboardSkeletonFrame({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#f8faf9]"><aside className="fixed hidden h-screen w-[260px] border-r border-[#e2e8e6] bg-white p-5 lg:block"><Bone className="h-12 w-32"/><div className="mt-10 space-y-3">{Array.from({length:6},(_,i)=><Bone key={i} className="h-10 w-full"/>)}</div><Bone className="absolute bottom-5 left-4 right-4 h-14"/></aside><div className="min-h-screen lg:pl-[260px]">{children}</div></main>;
}
