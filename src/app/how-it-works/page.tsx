import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  FilePlus2,
  Gift,
  Headphones,
  History,
  LockKeyhole,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";

const tiers = [
  ["1–3 days early", "+2%"],
  ["4–7 days early", "+5%"],
  ["8–14 days early", "+10%"],
  ["15+ days early", "+15%"],
];

export default function HowItWorksPage() {
  return (
    <main className="bg-white text-[#07142d]">
      <Header active="how" />

      {/* Hero */}
      <section className="overflow-hidden border-t border-[#edf1ef] bg-linear-to-br from-white via-white to-[#f4faf7]">
        <div className="mx-auto grid min-h-[430px] max-w-[1120px] items-center px-6 pt-8 sm:px-7 lg:grid-cols-[52%_48%]">
          <div className="z-10 py-10 sm:py-12">
            <h1 className="text-[44px] font-bold leading-[1.06] tracking-[-.05em] sm:text-[54px]">
              How Vuior works
            </h1>

            <p className="mt-5 text-[18px] leading-7 text-[#596885] sm:text-[19px]">
              Add your bills, pay early, and earn credits.
              <br />
              The earlier you pay, the more you save.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="flex h-12 items-center rounded-md bg-[#008f64] px-7 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 sm:text-[15px]"
              >
                Create free account
              </Link>

              <a
                href="#rewards"
                className="flex h-12 items-center rounded-md border border-[#009b6b] px-7 text-[14px] font-semibold text-[#008f64] transition-colors hover:bg-[#f1faf6] sm:text-[15px]"
              >
                See rewards
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-[13px] font-semibold sm:gap-7 sm:text-[14px]">
              <span className="flex items-center gap-2">
                <LockKeyhole size={18} className="text-[#00a36a]" />
                Pay securely
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#00a36a]" />
                No hidden fees
              </span>

              <span className="flex items-center gap-2">
                <RefreshCcw size={18} className="text-[#00a36a]" />
                Cancel anytime
              </span>
            </div>
          </div>

          <div className="relative hidden h-[400px] lg:block">
            <Image
              src="/how-it-works.png"
              alt="Vuior app showing early bill payments and earned credits"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-contain object-center"
              priority
            />
          </div>
        </div>
      </section>

      {/* Three Steps */}
      <section className="mx-auto max-w-[960px] px-6 py-12 sm:py-14">
        <h2 className="text-center text-[27px] font-bold sm:text-[30px]">
          Three simple steps
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
          {[
            [
              "01",
              FilePlus2,
              "Add your bills",
              "Connect or enter your recurring bills in just a few taps.",
            ],
            [
              "02",
              CalendarDays,
              "Pay before the due date",
              "Choose when to pay or set autopay. The earlier you pay, the more you earn.",
            ],
            [
              "03",
              Gift,
              "Earn credits",
              "Get rewarded with credits based on how early you pay eligible bills.",
            ],
          ].map(([number, Icon, title, text], i) => {
            const I = Icon as typeof Gift;

            return (
              <article
                key={String(title)}
                className="relative min-h-[220px] rounded-xl border border-[#dfe7e4] bg-white p-6 shadow-[0_6px_20px_rgba(25,55,47,.025)]"
              >
                <div className="flex items-center gap-5">
                  <strong className="text-[30px] text-[#83dcbc]">
                    {String(number)}
                  </strong>

                  <I size={28} className="text-[#00a36a]" />
                </div>

                <h3 className="mt-5 text-xl font-bold sm:text-2xl">
                  {String(title)}
                </h3>

                <p className="mt-3 max-w-[260px] text-[16px] leading-6 text-[#596885]">
                  {String(text)}
                </p>

                {i < 2 && (
                  <span className="absolute -right-7 top-1/2 hidden text-[22px] text-[#aebbb7] md:block">
                    ⇢
                  </span>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* App download */}
      <section className="mx-auto max-w-[960px] px-6 pb-12 sm:pb-14">
        <div className="relative overflow-hidden rounded-2xl border border-[#dfe9e6] bg-white shadow-[0_14px_35px_rgba(20,62,48,.06)] lg:grid lg:min-h-[276px] lg:grid-cols-[1fr_310px]">
          <div className="relative z-10 px-7 py-8 sm:px-10 sm:py-10">
            <p className="text-[11px] font-bold tracking-[.14em] text-[#009268]">
              THE VUIOR APP
            </p>
            <h2 className="mt-3 text-[28px] font-bold leading-tight tracking-[-.04em] sm:text-[33px]">
              Your bills, rewards, and peace of mind—wherever you are.
            </h2>
            <p className="mt-3 max-w-[510px] text-[15px] leading-6 text-[#596885]">
              Stay ahead of every due date and make payments in a few easy taps.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/#" aria-label="Download Vuior on the App Store" className="inline-flex h-[48px] min-w-[151px] items-center justify-center gap-2 rounded-[8px] bg-[#101817] px-3 text-white transition-transform hover:-translate-y-0.5 hover:bg-[#1b2925]">
                <svg className="h-7 w-6" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.05 12.54c-.02-2.18 1.78-3.24 1.86-3.29a4 4 0 0 0-3.15-1.7c-1.32-.14-2.6.8-3.27.8-.69 0-1.73-.78-2.85-.76a4.2 4.2 0 0 0-3.54 2.16c-1.53 2.65-.39 6.55 1.08 8.69.74 1.05 1.6 2.23 2.72 2.19 1.1-.05 1.51-.7 2.83-.7 1.31 0 1.69.7 2.84.68 1.18-.02 1.92-1.05 2.63-2.1a8.6 8.6 0 0 0 1.2-2.45 3.78 3.78 0 0 1-2.35-3.52ZM14.9 6.15a3.83 3.83 0 0 0 .88-2.75 3.9 3.9 0 0 0-2.54 1.3 3.65 3.65 0 0 0-.9 2.65 3.22 3.22 0 0 0 2.56-1.2Z" /></svg>
                <span className="flex flex-col items-start leading-none"><small className="mb-1 text-[8px]">Download on the</small><strong className="text-[16px] font-semibold">App Store</strong></span>
              </Link>
              <Link href="/#" aria-label="Get Vuior on Google Play" className="inline-flex h-[48px] min-w-[151px] items-center justify-center gap-2 rounded-[8px] bg-[#101817] px-3 text-white transition-transform hover:-translate-y-0.5 hover:bg-[#1b2925]">
                <svg className="h-7 w-6" viewBox="0 0 28 31" aria-hidden="true"><path fill="#00d6ff" d="M1 1.5 17 15.5 1 29.5Z" /><path fill="#ffdb00" d="m17 15.5 4.2-3.7 5.2 3c.8.5.8 1.2 0 1.7l-5.3 3Z" /><path fill="#ff3a44" d="M1 29.5 17 15.5l4.1 4Z" /><path fill="#00ef75" d="M1 1.5 21.2 11.8 17 15.5Z" /></svg>
                <span className="flex flex-col items-start leading-none"><small className="mb-1 text-[8px]">GET IT ON</small><strong className="text-[16px] font-semibold">Google Play</strong></span>
              </Link>
            </div>
          </div>
          <div className="relative hidden overflow-hidden bg-[#f5faf8] lg:block">
            <div className="absolute inset-y-0 left-0 w-12 bg-linear-to-r from-white to-transparent" />
            <Image src="/hero-phone2.png" alt="Vuior mobile app dashboard" fill sizes="310px" className="object-contain object-center -translate-y-4 scale-[1.12]" />
          </div>
        </div>
      </section>

      {/* Rewards */}
      <section
        id="rewards"
        className="bg-linear-to-r from-[#004a3e] to-[#003c34] text-white"
      >
        <div className="mx-auto grid max-w-[1000px] gap-5 px-6 py-9 sm:px-7 md:grid-cols-[230px_repeat(4,1fr)]">
          <div className="flex flex-col justify-center">
            <h2 className="text-[24px] font-bold leading-7 sm:text-[26px]">
              The earlier you pay,
              <br />
              the more you earn
            </h2>

            <p className="mt-3 text-[14px] leading-5 text-[#c7ded7] sm:text-[15px]">
              Earn credits on eligible bills when you pay early.
            </p>
          </div>

          {tiers.map(([days, reward]) => (
            <div
              key={days}
              className="rounded-lg border border-[#ffffff24] bg-[#005647] p-5 text-center"
            >
              <b className="text-[13px] font-semibold sm:text-[14px]">{days}</b>

              <strong className="mt-3 block text-[30px] sm:text-[32px]">
                {reward}
              </strong>

              <small className="text-[12px] text-[#c7ded7] sm:text-[13px]">
                in credits
              </small>
            </div>
          ))}
        </div>
      </section>

      {/* What You Can Do */}
      <section className="mx-auto max-w-[820px] px-6 py-12 sm:py-14">
        <h2 className="text-center text-[26px] font-bold sm:text-[29px]">
          What you can do with Vuior
        </h2>

        <div className="mt-7 space-y-3">
          {[
            [
              CalendarDays,
              "Track upcoming bills and due dates",
              "See what’s coming up, so you never miss a due date.",
            ],
            [
              RefreshCcw,
              "Pay bills and manage autopay",
              "Pay instantly or set autopay for peace of mind.",
            ],
            [
              History,
              "View credits, savings, and history",
              "See your credits, total savings, and transactions in one place.",
            ],
          ].map(([Icon, title, text], index) => {
            const I = Icon as typeof History;

            return (
              <article
                key={String(title)}
                className="grid min-h-[100px] overflow-hidden rounded-lg border border-[#e2e9e6] md:grid-cols-2"
              >
                <div
                  className={`${
                    index % 2 ? "md:order-2" : ""
                  } flex h-full min-h-[90px] items-center justify-center bg-[#f5faf8]`}
                >
                  <I className="text-[#00a36a]" size={28} />
                </div>

                <div className="flex flex-col justify-center border-l-2 border-[#00a36a] px-6 py-5">
                  <b className="text-lg font-semibold sm:text-xl">
                    {String(title)}
                  </b>

                  <p className="mt-2 text-[16px] leading-5 text-[#596885] sm:leading-6">
                    {String(text)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto grid max-w-[960px] gap-8 px-6 pb-10 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [
            LockKeyhole,
            "Secure payments",
            "Bank-grade security keeps your payments and data safe.",
          ],
          [
            History,
            "Clear payment history",
            "View all transactions, credits, and receipts anytime.",
          ],
          [
            ShieldCheck,
            "Protected account",
            "Advanced controls help protect your account.",
          ],
          [
            Headphones,
            "Support when you need it",
            "Real humans are ready to help every step of the way.",
          ],
        ].map(([Icon, title, text]) => {
          const I = Icon as typeof ShieldCheck;

          return (
            <div key={String(title)} className="flex gap-3">
              <I size={27} className="shrink-0 text-[#00a36a]" />

              <span>
                <b className="text-xl font-semibold sm:text-2xl">
                  {String(title)}
                </b>

                <p className="mt-1.5 text-[16px] leading-5 text-[#596885] sm:leading-6">
                  {String(text)}
                </p>
              </span>
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="mx-4 mb-8 grid max-w-[800px] items-center gap-6 rounded-xl bg-linear-to-r from-[#004a3e] to-[#002f29] px-7 py-8 text-white sm:mx-auto sm:px-8 sm:py-9 md:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-[24px] font-bold leading-7 sm:text-[27px] sm:leading-8">
            Start getting more from
            <br />
            the bills you already pay
          </h2>

          <p className="mt-3 text-[14px] leading-5 text-[#c7ded7] sm:text-[15px]">
            Join Vuior today and earn credits every time you pay early.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            className="flex h-11 items-center rounded-md bg-[#00a36a] px-6 text-[13px] font-semibold !text-white transition-opacity hover:opacity-90 sm:text-[14px]"
            href="/signup"
          >
            Create free account
          </Link>

          <Link
            className="flex h-11 items-center rounded-md border border-[#9dc6b9] px-6 text-[13px] font-semibold text-white transition-colors hover:bg-white/10 sm:text-[14px]"
            href="/login"
          >
            Log in
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
