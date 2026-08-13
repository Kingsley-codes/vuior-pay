type AuthFormShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function AuthFormShell({
  title,
  description,
  children,
}: AuthFormShellProps) {
  return (
    <div className="auth-card w-full rounded-xl border border-[#e1e5ec] bg-white px-5 py-7 shadow-[0_14px_42px_rgba(35,47,77,0.07)] sm:px-9 sm:py-8">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold leading-[1.12] tracking-[-0.03em] text-[#101d4b] sm:text-[32px]">
          {title}
        </h1>

        <p className="mt-2 text-[15px] leading-6 text-[#77819c] sm:text-[16px]">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}
