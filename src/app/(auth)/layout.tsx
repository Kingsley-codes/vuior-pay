import { AuthLeftPanel } from "@/components/auth/AuthLeftPanel";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[#f8f9fb] lg:grid lg:grid-cols-[44%_56%]">
      <AuthLeftPanel />

      <section className="auth-content relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-7 sm:px-7 lg:px-10">
        <div className="auth-page-glow" />

        <div className="relative z-10 flex w-full max-w-[520px] flex-col items-center">
          {children}
        </div>
      </section>
    </main>
  );
}
