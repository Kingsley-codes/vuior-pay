import BackButton from "./BackButton";
import Image from "next/image";
import Link from "next/link";

type AuthFormShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  backHref?: string;
};

export default function AuthFormShell({
  title,
  description,
  children,
  backHref,
}: AuthFormShellProps) {
  return (
    <div className="auth-card w-full rounded-xl border border-[#e1e5ec] bg-white px-5 py-7 shadow-[0_14px_42px_rgba(35,47,77,0.07)] sm:px-9 sm:py-8">
      {/* Mobile back button and logo */}
      <div className="lg:hidden mb-5">
        <BackButton href={backHref} />
      </div>

      {/* Mobile logo - only visible on small screens */}
      <div className="lg:hidden flex justify-center mb-6">
        <Link href="/" className="inline-block">
          <Image
            src="/vuiorLogo.png"
            alt="Vuior"
            width={120}
            height={45}
            priority
            className="h-auto w-[110px] object-contain"
          />
        </Link>
      </div>

      {/* Page heading with responsive sizing */}
      <div className="mb-6">
        <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold leading-[1.12] tracking-[-0.03em] text-[#101d4b]">
          {title}
        </h1>

        <p className="mt-2 text-[13px] sm:text-[15px] lg:text-[16px] leading-6 text-[#77819c]">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}
