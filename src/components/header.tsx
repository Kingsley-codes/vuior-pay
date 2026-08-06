import Image from "next/image";
import Link from "next/link";

export function Header({ active }: { active?: "about" | "contact" }) {
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
        <Link href="/#how-it-works">How it works</Link>
        <Link href="/#rewards">Rewards</Link>
        <Link href="/#features">Features</Link>
        <Link href="/#providers">Bill providers</Link>
        <Link
          className={active === "about" ? "active" : undefined}
          href="/about"
        >
          About us
        </Link>
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
