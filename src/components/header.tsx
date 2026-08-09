import Image from "next/image";
import Link from "next/link";

export function Header({ active }: { active?: "about" | "contact" | "how" | "bills" | "credits" | "faq" }) {
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
        <Link className={active === "how" ? "active" : undefined} href="/how-it-works">How it works</Link>
        <Link className={active === "bills" ? "active" : undefined} href="/bills">Bills</Link>
        <Link className={active === "credits" ? "active" : undefined} href="/credits">Credits</Link>
        <Link className={active === "faq" ? "active" : undefined} href="/help">FAQs</Link>
        <Link className={active === "about" ? "active" : undefined} href="/about">About us</Link>
        <Link className={active === "contact" ? "active" : undefined} href="/contact">Contact</Link>
      </nav>
      <div className="nav-actions">
        <a href="/login" className="login-link">
          Log in
        </a>
        <Link href="/signup" className="button button-primary button-small">
          <span className="signup-long">Create free account</span>
          <span className="signup-short">Sign up</span>
        </Link>
      </div>
    </header>
  );
}
