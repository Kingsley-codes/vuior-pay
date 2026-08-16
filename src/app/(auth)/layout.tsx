import { AuthLeftPanel } from "@/components/auth/AuthLeftPanel";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[#f8f9fb] lg:grid lg:grid-cols-[44%_56%]">
      <AuthLeftPanel />

      <section className="auth-content relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-7 sm:px-7 lg:px-10">
        <Link href="/" className="absolute left-4 top-4 lg:hidden">
          <Image
            src="/vuiorLogo.png"
            alt="Vuior"
            width={132}
            height={49}
            priority
            className="h-auto w-[120px]"
          />
        </Link>
        <div className="auth-page-glow" />

        <div className="relative z-10 flex w-full max-w-[520px] flex-col items-center">
          {children}
        </div>
      </section>
    </main>
  );
}
