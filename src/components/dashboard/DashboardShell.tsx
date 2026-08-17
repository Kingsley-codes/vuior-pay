"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Coins,
  FileText,
  Home,
  LogOut,
  Menu,
  Settings,
  SlidersHorizontal,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { auth } from "@/services/firebase";
import { useVuiorSession } from "@/hooks/useVuiorSession";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Bills", href: "/dashboard/bills", icon: FileText },
  { label: "Pay Bills", href: "/dashboard/pay", icon: WalletCards },
  { label: "Credits", href: "/dashboard/credits", icon: Coins },
  {
    label: "Promo and Referrals",
    href: "/dashboard/referrals",
    icon: UsersRound,
  },
];

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, firebaseUser, loading } = useVuiorSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const passwordChangePath = "/dashboard/change-password";
  const mustChangePassword = user?.mustChangePassword;

  useEffect(() => {
    if (!loading && !firebaseUser) router.replace("/login");
  }, [firebaseUser, loading, router]);

  useEffect(() => {
    if (mustChangePassword && pathname !== passwordChangePath) {
      router.replace(passwordChangePath);
    }
  }, [mustChangePassword, pathname, router]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const outside = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node))
        setUserMenuOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [userMenuOpen]);

  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Vuior User";
  const avatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=101d4b&color=fff`;

  async function logout() {
    setLoggingOut(true);
    try {
      await signOut(auth);
      router.replace("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading)
    return (
      <div className="grid min-h-screen place-items-center bg-[#f8faf9] text-sm text-[#65718c]">
        Loading your Vuior workspace…
      </div>
    );
  if (!firebaseUser) return null;

  return (
    <main className="dashboard-app min-h-screen bg-[#f8faf9] text-[#0d1b42]">
      {mobileOpen ? (
        <button
          className="fixed inset-0 z-40 bg-[#07142d]/30 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col border-r border-[#e2e8e6] bg-white px-3 py-5 transition-all duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 ${collapsed ? "lg:w-[76px]" : "lg:w-[260px]"}`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-md border border-[#dfe6e4] lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>
        <button
          onClick={() => setCollapsed((value) => !value)}
          className="absolute -right-3 top-6 hidden h-6 w-6 place-items-center rounded-full border border-[#dfe6e4] bg-white text-[#627089] shadow-sm lg:grid"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
        <div
          className={`mb-8 flex h-16 items-center px-2 ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
        >
          <Image
            src="/favicon.png"
            alt="Vuior"
            width={50}
            height={50}
            priority
            className={`${collapsed ? "hidden lg:block" : "hidden"} h-10 w-10 object-contain`}
          />
          <Image
            src="/vuiorLogo.png"
            alt="Vuior"
            width={132}
            height={49}
            priority
            className={`${collapsed ? "lg:hidden" : ""} h-auto w-[128px]`}
          />
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href !== "#" &&
              (item.href === "/dashboard"
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.label}
                href={item.href}
                title={collapsed ? item.label : undefined}
                onClick={() => setMobileOpen(false)}
                className={`flex h-10 items-center gap-3 rounded-md px-3 text-[13px] font-medium transition ${collapsed ? "lg:justify-center" : ""} ${active ? "bg-[#eaf8f2] text-[#008f60]" : "text-[#53617a] hover:bg-[#f5f8f7]"}`}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span className={collapsed ? "lg:hidden" : ""}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <div ref={userMenuRef} className="absolute bottom-5 left-3 right-3">
          {userMenuOpen ? (
            <div
              role="menu"
              className="absolute bottom-full right-0 mb-2 w-56 overflow-hidden rounded-lg border border-[#dfe6e4] bg-white p-1.5 shadow-[0_12px_35px_rgba(20,43,36,.14)]"
            >
              <Link
                href="/dashboard/settings"
                role="menuitem"
                onClick={() => {
                  setUserMenuOpen(false);
                  setMobileOpen(false);
                }}
                className="flex h-10 items-center gap-3 rounded-md px-3 text-[12px] text-[#53617a] transition hover:bg-[#f5f8f7]"
              >
                <Settings size={17} /> Profile & settings
              </Link>
              <button
                role="menuitem"
                type="button"
                disabled={loggingOut}
                onClick={logout}
                className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-[12px] text-[#dc3545] transition hover:bg-[#fff1f2] disabled:opacity-60"
              >
                <LogOut size={17} />
                {loggingOut ? "Logging out…" : "Log out"}
              </button>
            </div>
          ) : null}
          <button
            type="button"
            aria-label="Open user menu"
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
            onClick={() => setUserMenuOpen((value) => !value)}
            className={`flex w-full items-center gap-2 rounded-lg border border-[#dfe6e4] bg-white p-2 text-left transition hover:bg-[#f7f9f8] ${collapsed ? "lg:justify-center" : ""}`}
          >
            <Image
              src={avatar}
              alt={name}
              width={34}
              height={34}
              unoptimized
              className="h-[34px] w-[34px] shrink-0 rounded-full object-cover"
            />
            <div className={collapsed ? "min-w-0 lg:hidden" : "min-w-0"}>
              <p className="truncate text-[11px] font-semibold">{name}</p>
              <p className="truncate text-[9px] text-[#7c889a]">
                {user?.email}
              </p>
            </div>
            <ChevronDown
              size={15}
              className={`${collapsed ? "lg:hidden" : ""} ml-auto shrink-0 text-[#8490a1] transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </aside>
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-30 grid h-10 w-10 place-items-center rounded-lg border border-[#dfe6e4] bg-white shadow-sm lg:hidden"
      >
        <Menu size={20} />
      </button>
      <div
        className={`min-h-screen pt-14 transition-[padding] duration-300 lg:pt-0 ${collapsed ? "lg:pl-[76px]" : "lg:pl-[260px]"}`}
      >
        {children}
      </div>
    </main>
  );
}
