import Image from "next/image";
import { LockKeyhole } from "lucide-react";
import { AuthLeftPanel } from "@/components/auth/AuthLeftPanel";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[#f8f9fb] lg:grid lg:grid-cols-2">
      <AuthLeftPanel />

      <section className="auth-content relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8 lg:px-12">
        <div className="auth-page-glow" />

        <div className="relative z-10 flex w-full max-w-[610px] flex-col items-center">
          {children}
        </div>
      </section>
    </main>
  );
}
