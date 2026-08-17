import Image from "next/image";
import { CalendarDays, FileText, Star } from "lucide-react";
import BackButton from "./BackButton";

export function AuthLeftPanel({ backHref }: { backHref?: string } = {}) {
  return (
    <section className="relative hidden min-h-screen overflow-hidden bg-[#004c3d] lg:block">
      <Image
        src="/auth-green-background.png"
        alt=""
        fill
        priority
        sizes="50vw"
        className="object-cover"
      />

      {/* Desktop back button */}
      <div className="absolute left-[7.5%] top-8 z-20">
        <BackButton href={backHref} />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col px-[7.5%] py-8">
        <div className="mb-6">
          <Image
            src="/logo-light.png"
            alt="Vuior"
            width={202}
            height={50}
            priority
            className="h-auto w-[132px]"
          />
        </div>

        <div className="mt-9">
          <h1 className="text-[38px] font-bold leading-[1.2] text-white">
            Welcome back
            <br />
            to Vuior
          </h1>

          <p className="mt-3 max-w-[390px] text-[15px] leading-6 text-white/90">
            Manage bills, pay early, and earn credits that put more back in your
            pocket.
          </p>
        </div>

        <div className="relative mt-4 h-[360px] w-[calc(100%+18px)] translate-x-7">
          <Image
            src="/auth-dashboard-mockup.png"
            alt="Vuior dashboard preview"
            fill
            priority
            sizes="50vw"
            className="object-contain object-left-top"
          />
        </div>

        <div className="mt-auto space-y-3 pb-1 pl-7">
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
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 scale-90 items-center justify-center rounded-full bg-gradient-to-br from-[#10d988] to-[#00945f] text-white">
        {icon}
      </div>

      <div>
        <h3 className="text-[15px] font-semibold text-white">{title}</h3>

        <p className="mt-0.5 text-[12px] leading-4 text-white/85">
          {description}
        </p>
      </div>
    </div>
  );
}
