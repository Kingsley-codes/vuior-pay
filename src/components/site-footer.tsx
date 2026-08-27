import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  const columnClass =
    "flex flex-col gap-3 text-[10px] text-[#bdd2cc] min-[901px]:gap-3.5 min-[901px]:text-[14px] max-[620px]:text-[14px]";
  const headingClass =
    "mb-1 text-[11px] text-white min-[901px]:mb-[5px] min-[901px]:text-[14px] max-[620px]:text-[13px]";
  const linkClass = "transition hover:text-[#76e1bc]";

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
          <div
            className="mt-4 flex gap-[18px] font-bold text-white"
            aria-label="Social media"
          >
            <a className={linkClass} href="#" aria-label="Facebook">
              f
            </a>
            <a className={linkClass} href="#" aria-label="Instagram">
              o
            </a>
            <a className={linkClass} href="#" aria-label="X">
              X
            </a>
            <a className={linkClass} href="#" aria-label="YouTube">
              ▶
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
          <Link className={linkClass} href="/help">
            Help center
          </Link>
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
