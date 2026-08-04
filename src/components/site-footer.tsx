import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="inner-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Image src="/vuiorLogo.png" alt="Vuior" width={112} height={42} />
          <p>Pay your bills early and earn<br />credits for a smarter financial life.</p>
          <div className="social-links" aria-label="Social media">
            <a href="#" aria-label="Facebook">f</a><a href="#" aria-label="Instagram">◎</a>
            <a href="#" aria-label="X">𝕏</a><a href="#" aria-label="YouTube">▶</a>
          </div>
        </div>
        <div><b>Product</b><a href="/#how-it-works">How it works</a><a href="/#rewards">Rewards</a><a href="/#features">Features</a><a href="/#providers">Bill providers</a></div>
        <div><b>Company</b><a href="/about">About us</a><a href="#">Careers</a><a href="#">Blog</a><a href="/contact">Contact us</a></div>
        <div><b>Support</b><a href="#">Help center</a><a href="/contact">Contact support</a><a href="/#faq">FAQs</a></div>
        <div><b>Legal</b><a href="#">Privacy policy</a><a href="#">Terms of service</a><a href="#">Cookie policy</a></div>
      </div>
      <p className="copyright">© 2026 Vuior. All rights reserved.</p>
    </footer>
  );
}
