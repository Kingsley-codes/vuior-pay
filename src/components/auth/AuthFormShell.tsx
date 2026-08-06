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
    <div className="auth-card w-full rounded-[14px] border border-[#e1e5ec] bg-white px-6 py-9 shadow-[0_18px_55px_rgba(35,47,77,0.08)] sm:px-12 sm:py-12">
      <div className="mb-9">
        <h1 className="text-[36px] font-bold leading-[1.1] tracking-[-0.03em] text-[#101d4b] sm:text-[42px]">
          {title}
        </h1>

        <p className="mt-3 text-[16px] leading-6 text-[#77819c] sm:text-[18px]">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}
