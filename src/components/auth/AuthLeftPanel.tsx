import Image from "next/image";
import { CalendarDays, FileText, Star } from "lucide-react";

export function AuthLeftPanel() {
  return (
    <section className="relative hidden min-h-screen overflow-hidden bg-[#004c3d] lg:block">
      <Image
        src="/images/auth/auth-green-background.png"
        alt=""
        fill
        priority
        sizes="50vw"
        className="object-cover"
      />

      <div className="relative z-10 flex min-h-screen flex-col px-[7%] py-[42px]">
        <div className="flex items-center gap-4">
          <div className="relative h-[42px] w-[48px]">
            <span className="absolute left-[3px] top-0 h-[40px] w-[22px] -rotate-[32deg] rounded-full bg-[#15ce89]" />
            <span className="absolute right-[3px] top-0 h-[40px] w-[22px] rotate-[32deg] rounded-full bg-[#00996e]" />
          </div>

          <span className="text-[25px] font-semibold tracking-[0.25em] text-white">
            VUIOR
          </span>
        </div>

        <div className="mt-[52px]">
          <h1 className="text-[46px] font-bold leading-[1.25] tracking-[-0.03em] text-white">
            Welcome back
            <br />
            to Vuior
          </h1>

          <p className="mt-4 max-w-[430px] text-[18px] leading-7 text-white/90">
            Manage bills, pay early, and earn credits that put more back in your
            pocket.
          </p>
        </div>

        <div className="relative mt-4 h-[470px] w-full">
          <Image
            src="/images/auth/auth-dashboard-mockup.png"
            alt="Vuior dashboard preview"
            fill
            priority
            sizes="50vw"
            className="object-contain object-left"
          />
        </div>

        <div className="mt-auto space-y-4 pb-1">
          <Feature
            icon={<FileText size={24} strokeWidth={1.8} />}
            title="Track bills"
            description="See upcoming bills and due dates in one place."
          />

          <Feature
            icon={<CalendarDays size={24} strokeWidth={1.8} />}
            title="Pay early"
            description="Pay ahead and save with early payment rewards."
          />

          <Feature
            icon={<Star size={24} strokeWidth={1.8} />}
            title="Earn credits"
            description="Rack up credits to reduce future payments."
          />
        </div>
      </div>
    </section>
  );
}

export function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-5">
      <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#10d988] to-[#00945f] text-white">
        {icon}
      </div>

      <div>
        <h3 className="text-[18px] font-semibold text-white">{title}</h3>

        <p className="mt-1 text-[14px] leading-5 text-white/85">
          {description}
        </p>
      </div>
    </div>
  );
}
