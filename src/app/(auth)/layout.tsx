import { AuthLeftPanel } from "@/components/auth/AuthLeftPanel";
import BackButton from "@/components/auth/BackButton";

export default function AuthLayout({
  children,
  backHref,
}: Readonly<{
  children: React.ReactNode;
  backHref?: string;
}>) {
  return (
    <main className="min-h-screen bg-[#f8f9fb] lg:grid lg:grid-cols-[44%_56%]">
      {/* Desktop left panel */}
      <AuthLeftPanel backHref={backHref} />

      {/* Right side */}
      <section className="auth-content relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-7 pt-18 sm:px-7 sm:pb-7 sm:pt-22 lg:px-10 lg:py-7">
        {/* Mobile back button — fixed to the page corner */}
        <div className="absolute left-4 top-4 z-30 lg:hidden sm:left-7 sm:top-7">
          <BackButton href={backHref} />
        </div>
        <div className="auth-page-glow" />
        <div className="relative z-10 flex w-full max-w-[520px] flex-col items-center">
          {children}
        </div>
      </section>
    </main>
  );
}
