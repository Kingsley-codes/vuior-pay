"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { useVuiorSession } from "@/hooks/useVuiorSession";

export function Header({
  active,
}: {
  active?: "about" | "contact" | "how" | "faq";
}) {
  const { firebaseUser, loading } = useVuiorSession();
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Vuior home">
        <Image
          src="/vuiorLogo.png"
          alt="Vuior"
          width={121}
          height={45}
          priority
        />
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        <Link
          className={active === "how" ? "active" : undefined}
          href="/how-it-works"
        >
          How it works
        </Link>
        <Link className={active === "faq" ? "active" : undefined} href="/help">
          FAQs
        </Link>
        <Link
          className={active === "about" ? "active" : undefined}
          href="/about"
        >
          About us
        </Link>
        <Link
          className={active === "contact" ? "active" : undefined}
          href="/contact"
        >
          Contact
        </Link>
      </nav>
      <div className="nav-actions">
        {loading ? (
          <span className="nav-auth-placeholder" aria-hidden="true" />
        ) : firebaseUser ? (
          <Link
            href="/dashboard"
            className="button button-primary button-small dashboard-link"
          >
            <LayoutDashboard size={17} /> Dashboard
          </Link>
        ) : (
          <>
            <Link href="/login" className="login-link">
              Log in
            </Link>
            <Link href="/signup" className="button button-primary button-small">
              <span className="signup-long">Create free account</span>
              <span className="signup-short">Sign up</span>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
