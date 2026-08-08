"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  Coins,
  FileText,
  Home,
  LogOut,
  Menu,
  Search,
  Settings,
  SlidersHorizontal,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { auth } from "@/auth/firebase";
import { useVuiorSession } from "@/hooks/useVuiorSession";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Bills", href: "/dashboard/bills", icon: FileText },
  { label: "Pay Bills", href: "/dashboard/pay", icon: WalletCards },
  { label: "Credits", href: "/dashboard/credits", icon: Coins },
  { label: "Transactions", href: "#", icon: SlidersHorizontal },
  { label: "Referrals", href: "#", icon: UsersRound },
  { label: "Help & Support", href: "/help", icon: CircleHelp },
  { label: "Profile", href: "#", icon: UserRound },
  { label: "Settings", href: "#", icon: Settings },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, firebaseUser, loading } = useVuiorSession();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !firebaseUser) router.replace("/login");
  }, [firebaseUser, loading, router]);

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Vuior User";
  const avatar = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=101d4b&color=fff`;

  async function logout() {
    await signOut(auth);
    router.replace("/login");
  }

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-[#f9fbfa] text-sm text-[#65718c]">Loading your Vuior workspace…</div>;
  }

  if (!firebaseUser) return null;

  return (
    <div className="min-h-screen bg-[#fbfcfc] text-[#0d1b42] lg:grid lg:grid-cols-[236px_minmax(0,1fr)]">
      {menuOpen ? <button className="fixed inset-0 z-30 bg-[#07142d]/30 lg:hidden" aria-label="Close menu" onClick={() => setMenuOpen(false)} /> : null}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[236px] flex-col border-r border-[#e5eae8] bg-white px-4 py-6 transition-transform lg:sticky lg:top-0 lg:h-screen ${menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center justify-between px-2">
          <Image src="/vuiorLogo.png" alt="Vuior" width={132} height={49} priority className="h-auto w-[128px]" />
          <button className="lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={21} /></button>
        </div>
        <nav className="mt-9 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href !== "#" && (item.href === "/dashboard" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`));
            return (
              <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className={`relative flex h-11 items-center gap-4 rounded-lg px-4 text-[13px] font-medium transition ${active ? "bg-[#eaf8f2] text-[#00a36a]" : "text-[#263b63] hover:bg-[#f5f8f7]"}`}>
                {active ? <span className="absolute -left-4 h-7 w-[2px] rounded-r bg-[#00b874]" /> : null}
                <Icon size={19} strokeWidth={1.8} />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-xl border border-[#e2e8e6] p-3 shadow-[0_7px_20px_rgba(26,62,51,0.04)]">
          <div className="flex items-center gap-3">
            <Image src={avatar} alt={name} width={38} height={38} unoptimized className="h-[38px] w-[38px] rounded-full object-cover" />
            <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold">{name}</p><p className="truncate text-[10px] text-[#77839a]">{user?.email}</p></div>
            <button onClick={logout} title="Log out" aria-label="Log out" className="text-[#64718b] hover:text-[#e11d48]"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>
      <main className="min-w-0">
        <header className="sticky top-0 z-20 flex h-[82px] items-center gap-4 border-b border-[#edf0ef] bg-white/95 px-5 backdrop-blur sm:px-7 lg:px-8">
          <button className="lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={23} /></button>
          <label className="ml-auto hidden h-11 w-full max-w-[375px] items-center gap-3 rounded-lg border border-[#dfe5e7] bg-white px-4 text-[#75829a] sm:flex">
            <input className="min-w-0 flex-1 bg-transparent text-[12px] outline-none placeholder:text-[#7b879d]" placeholder="Search bills, payments, or transactions…" />
            <Search size={18} />
          </label>
          <button className="relative ml-auto grid h-11 w-11 place-items-center rounded-full border border-[#e3e8e7] text-[#263b63] sm:ml-2" aria-label="Notifications"><Bell size={19} /><span className="absolute right-1.5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#00a96b]" /></button>
          <div className="flex items-center gap-2.5">
            <Image src={avatar} alt={name} width={38} height={38} unoptimized className="h-[38px] w-[38px] rounded-full object-cover" />
            <span className="hidden text-[13px] font-semibold sm:inline">{user?.firstName || "User"}</span><ChevronDown size={15} />
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
