"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { useVuiorSession } from "@/hooks/useVuiorSession";

export function Header({
  active,
}: {
  active?: "about" | "contact" | "how" | "faq";
}) {
  const { firebaseUser, loading } = useVuiorSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Vuior home" onClick={closeMobileMenu}>
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
      <button
        type="button"
        className="mobile-menu-toggle"
        aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMobileMenuOpen((open) => !open)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <nav
        id="mobile-navigation"
        className={`mobile-nav${mobileMenuOpen ? " is-open" : ""}`}
        aria-label="Mobile navigation"
      >
        <Link className={active === "how" ? "active" : undefined} href="/how-it-works" onClick={closeMobileMenu}>How it works</Link>
        <Link className={active === "faq" ? "active" : undefined} href="/help" onClick={closeMobileMenu}>FAQs</Link>
        <Link className={active === "about" ? "active" : undefined} href="/about" onClick={closeMobileMenu}>About us</Link>
        <Link className={active === "contact" ? "active" : undefined} href="/contact" onClick={closeMobileMenu}>Contact</Link>
      </nav>
    </header>
  );
}
