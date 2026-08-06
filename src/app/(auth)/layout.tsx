import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[#f8f9fb] lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#004c3d] lg:block">
        <Image
          src="/images/vuior-auth-panel.png"
          alt="Vuior bills and credits dashboard preview"
          fill
          priority
          sizes="50vw"
          className="object-cover object-center"
        />
      </section>

      <section className="auth-content relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="auth-page-glow" />

        <div className="relative z-10 flex w-full max-w-152.5 flex-col items-center">
          {children}

          <div className="auth-security-note mt-16 flex items-center gap-4 text-[#526080]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e3f8ef]">
              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7 10V8a5 5 0 0 1 10 0v2"
                  stroke="#00A968"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="11"
                  rx="2.5"
                  stroke="#00A968"
                  strokeWidth="1.8"
                />
                <path
                  d="M12 14.5v2"
                  stroke="#00A968"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <p className="text-[15px] font-semibold text-[#263454]">
                Secure sign in
              </p>
              <p className="mt-1 text-[13px] text-[#7b86a1]">
                Your data is encrypted and protected.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
