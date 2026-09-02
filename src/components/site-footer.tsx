import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  const columnClass =
    "flex flex-col gap-3 text-[10px] text-[#bdd2cc] min-[901px]:gap-3.5 min-[901px]:text-[14px] max-[620px]:text-[14px]";
  const headingClass =
    "mb-1 text-[11px] text-white min-[901px]:mb-[5px] min-[901px]:text-[14px] max-[620px]:text-[13px]";
  const linkClass = "transition hover:text-[#76e1bc]";
  const socialLinkClass =
    "grid h-6 w-6 place-items-center transition hover:text-[#76e1bc] min-[901px]:h-8 min-[901px]:w-8 [&_svg]:h-5 [&_svg]:w-5 min-[901px]:[&_svg]:h-6 min-[901px]:[&_svg]:w-6";

  return (
    <footer className="border-t border-[#dbe9e4] bg-[#003f35] pt-8 text-white">
      <div className="mx-auto grid max-w-[1050px] grid-cols-[2.2fr_repeat(4,1fr)] gap-[50px] px-[25px] max-[900px]:grid-cols-[2fr_repeat(2,1fr)] max-[620px]:grid-cols-2 max-[620px]:gap-x-[18px] max-[620px]:gap-y-[26px] max-[620px]:px-5">
        <div className="max-[620px]:col-span-full">
          <Image
            src="/logo-light.png"
            alt="Vuior"
            width={202}
            height={50}
            className="h-auto w-[105px] bg-transparent"
          />
          <p className="text-[10px] leading-[1.6] text-[#bdd2cc] min-[901px]:text-[14px] min-[901px]:leading-[1.7] max-[620px]:text-[14px] max-[620px]:leading-[1.65]">
            Pay your bills early and earn
            <br />
            credits for a smarter financial life.
          </p>
          <p className="mt-4 mb-2 text-[10px] font-bold text-white min-[901px]:text-[13px] max-[620px]:text-[13px]">
            Follow us on
          </p>
          <div
            className="flex items-center gap-[18px] text-white"
            aria-label="Social media"
          >
            <a className={socialLinkClass} href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M14 8.5V6.75c0-.5.4-.9.9-.9h1.6V3h-2.3C11.7 3 10 4.7 10 7.2v1.3H8v3h2V21h3.2v-9.5h2.5l.4-3H13.2Z" />
              </svg>
            </a>
            <a className={socialLinkClass} href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="4.5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3.4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="16.8" cy="7.2" r="1.1" fill="currentColor" />
              </svg>
            </a>
            <a className={socialLinkClass} href="#" aria-label="TikTok">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M15.2 3c.3 2.3 1.7 3.8 3.8 4v3.1a7 7 0 0 1-3.7-1.1v5.8c0 3.4-2.1 5.9-5.5 5.9A5.1 5.1 0 0 1 4.5 16c0-3 2.3-5.2 5.3-5.2.4 0 .8 0 1.1.1v3.2a3 3 0 0 0-1.1-.2c-1.3 0-2.2.9-2.2 2.1s.9 2.1 2.1 2.1c1.4 0 2.2-.8 2.2-2.5V3Z" />
              </svg>
            </a>
          </div>
        </div>

        <div className={columnClass}>
          <b className={headingClass}>Company</b>
          <Link className={linkClass} href="/about">
            About us
          </Link>
          <Link className={linkClass} href="/careers">
            Careers
          </Link>
          <Link className={linkClass} href="/how-it-works">
            How it works
          </Link>
        </div>

        <div className={`${columnClass} max-[900px]:mt-2.5`}>
          <b className={headingClass}>Support</b>
          <Link className={linkClass} href="/contact">
            Contact us
          </Link>
          <Link className={linkClass} href="/help">
            FAQs
          </Link>
        </div>

        <div className={`${columnClass} max-[900px]:mt-2.5`}>
          <b className={headingClass}>Legal</b>
          <Link className={linkClass} href="/privacy-policy">
            Privacy policy
          </Link>
          <Link className={linkClass} href="/terms-of-service">
            Terms of service
          </Link>
          <Link className={linkClass} href="/cookies-policy">
            Cookies policy
          </Link>
          <Link className={linkClass} href="/data-protection-policy">
            Data protection
          </Link>
        </div>
      </div>
      <p className="mt-[35px] mb-0 pb-[22px] text-center text-[9px] text-[#9fbab2] min-[901px]:text-[12px] max-[620px]:mt-[30px] max-[620px]:text-[12px]">
        © 2026 Vuior. All rights reserved.
      </p>
    </footer>
  );
}
