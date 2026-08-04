import Image from "next/image";

export function Header() {
  return (
    <header className="site-header">
      <a href="#" className="brand" aria-label="Vuior home">
        <Image src="/vuiorLogo.png" alt="Vuior" width={121} height={45} priority />
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="#how-it-works">How it works</a>
        <a href="#rewards">Rewards</a>
        <a href="#features">Features</a>
        <a href="#providers">Bill providers</a>
        <a href="#faq">Help</a>
      </nav>
      <div className="nav-actions">
        <a href="#" className="login-link">Log in</a>
        <a href="#signup" className="button button-primary button-small"><span className="signup-long">Create free account</span><span className="signup-short">Sign up</span></a>
      </div>
    </header>
  );
}
