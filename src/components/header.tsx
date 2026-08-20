"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, LayoutDashboard, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useVuiorSession } from "@/hooks/useVuiorSession";

export function Header({
  active,
  wide = false,
}: {
  active?: "about" | "contact" | "how" | "faq";
  wide?: boolean;
}) {
  const { firebaseUser, loading } = useVuiorSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLink = (item?: typeof active) =>
    `transition-colors duration-200 hover:text-[#009268] ${
      active === item
        ? "text-[#009268] underline decoration-2 underline-offset-4"
        : "text-[#07142d]"
    }`;

  const mobileNavLink = (item?: typeof active) =>
    `flex items-center justify-between rounded-lg border-b border-[#edf2ef] px-1 py-3.5 text-[15px] font-[650] transition-colors duration-200 hover:text-[#009268] [&_svg]:h-[18px] [&_svg]:w-[18px] hover:[&_svg]:text-[#009268] ${
      active === item
        ? "text-[#009268] [&_svg]:text-[#009268]"
        : "text-[#07142d] [&_svg]:text-[#91a099]"
    }`;

  const primaryButton =
    "inline-flex h-[50px] items-center justify-center gap-2.5 rounded-md bg-linear-to-br from-[#00a475] to-[#007d5a] px-[30px] text-[14px] font-bold !text-white shadow-[0_8px_20px_#008e6623] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_#007b5824] [&_svg]:w-[19px]";

  const smallPrimaryButton = `${primaryButton} h-11 px-[23px] max-[620px]:px-3.5`;

  return (
    <header
      className={`relative z-30 mx-auto flex items-center justify-between gap-7.5 max-[900px]:h-18 max-[620px]:gap-3 max-[620px]:px-4.5 ${wide ? "h-20 max-w-360 px-12 max-[900px]:px-6" : "h-22 max-w-310 px-7"}`}
    >
      <Link
        href="/"
        className="block"
        aria-label="Vuior home"
        onClick={closeMobileMenu}
      >
        <Image
          src="/vuiorLogo.png"
          alt="Vuior"
          width={121}
          height={45}
          priority
          className="block h-auto w-30.5 max-[620px]:w-25"
        />
      </Link>
      <nav
        className={`flex text-lg font-semibold max-[900px]:hidden ${wide ? "gap-11" : "gap-7.5"}`}
        aria-label="Main navigation"
      >
        <Link className={navLink("how")} href="/how-it-works">
          How it works
        </Link>
        <Link className={navLink("faq")} href="/help">
          FAQs
        </Link>
        <Link className={navLink("about")} href="/about">
          About us
        </Link>
        <Link className={navLink("contact")} href="/contact">
          Contact
        </Link>
      </nav>
      <div className="flex items-center gap-9 text-[16px] font-[650] max-[900px]:hidden max-[430px]:gap-2">
        {loading ? (
          <span
            className="h-11 w-41 rounded-[7px] bg-[#edf4f1]"
            aria-hidden="true"
          />
        ) : firebaseUser ? (
          <Link href="/dashboard" className={smallPrimaryButton}>
            <LayoutDashboard size={17} /> Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center hover:-translate-y-0.5 hover:shadow-[0_10px_24px_#007b5824] rounded-md border border-[#009268] px-[23px] text-[14px] font-bold text-[#009268] transition-colors duration-200 hover:text-[#007d5a]"
            >
              Log in
            </Link>

            <Link href="/signup" className={smallPrimaryButton}>
              <span className="max-[430px]:hidden">Create free account</span>
              <span className="hidden max-[430px]:inline">Sign up</span>
            </Link>
          </>
        )}
      </div>
      <button
        type="button"
        className="ml-auto hidden h-11 w-11 cursor-pointer items-center justify-center rounded-[9px] border border-[#dfe9e6] bg-white p-0 text-[#075b45] shadow-[0_4px_12px_#1233260c] hover:bg-[#eaf8f3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009268] max-[900px]:inline-flex"
        aria-label={
          mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
        }
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMobileMenuOpen((open) => !open)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <nav
        id="mobile-navigation"
        className={`absolute left-[18px] right-[18px] top-[calc(100%+4px)] z-[2] rounded-2xl border border-[#e1ebe6] bg-white p-[22px] shadow-[0_20px_45px_#12332624] max-[620px]:left-3 max-[620px]:right-3 max-[620px]:max-h-[calc(100dvh-88px)] max-[620px]:overflow-y-auto max-[620px]:p-5 ${
          mobileMenuOpen ? "grid" : "hidden"
        }`}
        aria-label="Mobile navigation"
      >
        <p className="mb-[5px] text-[11px] font-extrabold uppercase tracking-[1.1px] text-[#82918b]">
          Explore Vuior
        </p>
        <div className="border-t border-[#edf2ef]">
          <Link
            className={mobileNavLink("how")}
            href="/how-it-works"
            onClick={closeMobileMenu}
          >
            How it works <ChevronRight />
          </Link>
          <Link
            className={mobileNavLink("faq")}
            href="/help"
            onClick={closeMobileMenu}
          >
            FAQs <ChevronRight />
          </Link>
          <Link
            className={mobileNavLink("about")}
            href="/about"
            onClick={closeMobileMenu}
          >
            About us <ChevronRight />
          </Link>
          <Link
            className={mobileNavLink("contact")}
            href="/contact"
            onClick={closeMobileMenu}
          >
            Contact <ChevronRight />
          </Link>
        </div>
        <div className="grid gap-3 pt-5">
          {loading ? (
            <span
              className="h-11 w-[164px] rounded-[7px] bg-[#edf4f1]"
              aria-hidden="true"
            />
          ) : firebaseUser ? (
            <Link
              href="/dashboard"
              className={`${primaryButton} w-full text-center`}
              onClick={closeMobileMenu}
            >
              <LayoutDashboard size={17} /> Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className={`${primaryButton} w-full text-center`}
                onClick={closeMobileMenu}
              >
                Create free account
              </Link>
              <Link
                href="/login"
                className="inline-flex h-[50px] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_#007b5824] items-center justify-center p-1 rounded-md border border-[#009268] text-[13px] font-bold text-[#176650]"
                onClick={closeMobileMenu}
              >
                Log in to your account
              </Link>
            </>
          )}
        </div>
      </nav>
      <button
        type="button"
        className={`fixed inset-x-0 top-[72px] z-[1] h-[calc(100dvh-72px)] w-full cursor-default border-0 bg-[#0a2c2133] p-0 backdrop-blur-[2px] ${
          mobileMenuOpen ? "block" : "hidden"
        }`}
        aria-label="Close navigation menu"
        tabIndex={mobileMenuOpen ? 0 : -1}
        onClick={closeMobileMenu}
      />
    </header>
  );
}
