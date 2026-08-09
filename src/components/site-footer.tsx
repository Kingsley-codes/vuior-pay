import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="inner-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Image src="/logo-light.png" alt="Vuior" width={202} height={50} />
          <p>
            Pay your bills early and earn
            <br />
            credits for a smarter financial life.
          </p>
          <div className="social-links" aria-label="Social media">
            <a href="#" aria-label="Facebook">
              f
            </a>
            <a href="#" aria-label="Instagram">
              ◎
            </a>
            <a href="#" aria-label="X">
              𝕏
            </a>
            <a href="#" aria-label="YouTube">
              ▶
            </a>
          </div>
        </div>
        <div>
          <b>Product</b>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#rewards">Rewards</Link>
          <Link href="/#features">Features</Link>
          <Link href="/#providers">Bill providers</Link>
        </div>
        <div>
          <b>Company</b>
          <Link href="/about">About us</Link>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
          <Link href="/contact">Contact us</Link>
        </div>
        <div>
          <b>Support</b>
          <Link href="/help">Help center</Link>
          <Link href="/contact">Contact support</Link>
          <Link href="/help">FAQs</Link>
        </div>
        <div>
          <b>Legal</b>
          <Link href="/privacy-policy">Privacy policy</Link>
          <Link href="/terms-of-service">Terms of service</Link>
          <Link href="/cookies-policy">Cookies policy</Link>
          <Link href="/data-protection-policy">Data protection</Link>
        </div>
      </div>
      <p className="copyright">© 2026 Vuior. All rights reserved.</p>
    </footer>
  );
}
