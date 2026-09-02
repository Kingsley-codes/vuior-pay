import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Icon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";

const values = [
  { icon: "shield" as const, title: "Smart rewards", text: "Earn credits when you pay early." },
  { icon: "spark" as const, title: "Financial wellness", text: "Build better money habits, one payment at a time." },
  { icon: "spark" as const, title: "Trust & security", text: "Your data and payments are always protected." },
  { icon: "support" as const, title: "Simplicity first", text: "Easy to use. Easy to love." },
];

const milestones = [
  { icon: "⌂", value: "2023", text: "Vuior was founded with a simple idea." },
  { icon: "◉", value: "10K+", text: "Users already managing their bills with Vuior." },
  { icon: "⌁", value: "100+", text: "Billers and providers integrated." },
  { icon: "✈", value: "And growing", text: "We're just getting started." },
];

const primaryButton =
  "inline-flex h-[50px] items-center justify-center gap-2.5 rounded-md bg-linear-to-br from-[#00a475] to-[#007d5a] px-[30px] text-[14px] font-bold text-white shadow-[0_8px_20px_#008e6623] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_#007b5824] [&_svg]:w-[19px]";
const textLink =
  "inline-flex items-center gap-[9px] whitespace-nowrap text-[13px] font-bold text-[#009268] max-[620px]:text-[14px] [&_svg]:w-[17px]";
const eyebrow =
  "mb-[18px] text-[11px] font-extrabold text-[#00895f] max-[620px]:text-[12px]";
const bodyCopy =
  "text-[12px] leading-[1.7] text-[#58677b] min-[901px]:text-[16px] min-[901px]:leading-[1.75] max-[620px]:text-[15px] max-[620px]:leading-[1.65]";
const sectionHeading =
  "mb-[17px] text-[26px] font-bold leading-[1.22] tracking-[-0.8px] max-[620px]:text-[28px]";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-[#07142d]">
      <Header active="about" />
      <section className="grid h-[440px] grid-cols-[48%_52%] overflow-hidden border-b border-[#dfe9e6] bg-linear-to-r from-white via-[#f8fcfa] via-42% to-[#e4f5ee] max-[900px]:h-auto max-[900px]:grid-cols-1 max-[900px]:bg-linear-to-b max-[900px]:from-white max-[900px]:via-[#f5fbf8] max-[900px]:to-[#e6f7f0]">
        <div className="py-[75px] pr-5 pl-[max(48px,calc((100vw-1330px)/2))] max-[900px]:px-[30px] max-[900px]:pt-[60px] max-[900px]:pb-[45px] max-[900px]:text-center">
          <p className={eyebrow}>ABOUT VUIOR</p>
          <h1 className="mb-[22px] text-[43px] font-bold leading-[1.08] tracking-[-1.9px] max-[620px]:text-[34px]">
            Building a better way
            <br />
            to manage bills.
          </h1>
          <p className="text-[14px] leading-[1.65] text-[#58677b] min-[901px]:text-[18px] min-[901px]:leading-[1.7] max-[620px]:text-[15px]">
            Vuior helps you pay your bills early, stay organized,
            <br className="max-[620px]:hidden" /> and earn real rewards for good
            financial habits.
          </p>
          <div className="mt-7 flex items-center gap-9 max-[900px]:justify-center">
            <Link className={`${primaryButton} h-11 px-6 text-[12px] max-[620px]:text-[14px]`} href="/signup">
              Create free account
            </Link>
            <Link className={textLink} href="/how-it-works">
              See how it works <Icon name="arrow" />
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden bg-transparent max-[900px]:h-[480px] max-[620px]:h-[410px]">
          <Image
            src="/about-hero-cutout.png"
            alt="Vuior customer smiling while paying a bill on her phone"
            fill
            sizes="(max-width: 800px) 100vw, 48vw"
            priority
            className="object-contain object-[61%_bottom] max-[620px]:object-[60%_bottom]"
          />
          <div className="absolute top-[23%] left-[4%] z-[2] flex h-[156px] w-[190px] flex-col gap-2 rounded-[10px] border border-[#e5eeeb] bg-white/95 py-[18px] pr-[17px] pb-[13px] pl-[45px] shadow-[0_12px_35px_#183c3120] max-[620px]:origin-top-left max-[620px]:scale-80">
            <span className="absolute top-[17px] left-[17px] grid h-[18px] w-[18px] place-items-center rounded-full bg-[#0ca879] text-[10px] text-white">✓</span>
            <b className="text-[10px]">Payment Successful</b>
            <small className="text-[10px] text-[#687689]">Electricity Bill</small>
            <strong className="text-[16px]">$85.50</strong>
            <em className="text-[9px] leading-[1.7] not-italic text-[#687689]">
              You earned
              <br />
              <mark className="rounded-lg bg-[#daf6ea] px-1.5 py-[3px] font-bold text-[#08795a]">
                +5% credits
              </mark>
            </em>
          </div>
          <div className="absolute bottom-5 left-[1%] z-[2] grid h-[72px] w-[175px] grid-cols-[1fr_auto] rounded-[10px] border border-[#e5eeeb] bg-white/95 px-4 py-3.5 shadow-[0_12px_35px_#183c3120] max-[620px]:origin-bottom-left max-[620px]:scale-80">
            <small className="col-span-full text-[9px] text-[#6b788a]">
              Available credits
            </small>
            <strong className="text-[16px]">2,450</strong>
            <span className="text-[#009268]">♙</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1330px] grid-cols-[42%_58%] items-center px-12 py-[62px] max-[900px]:grid-cols-1 max-[900px]:gap-[45px] max-[900px]:px-[30px] max-[900px]:py-[55px]">
        <div className="max-[900px]:text-center">
          <p className={eyebrow}>Our mission</p>
          <h2 className={sectionHeading}>
            Empowering smarter financial
            <br />
            habits through rewards.
          </h2>
          <p className={`${bodyCopy} max-w-[480px] max-[900px]:mx-auto`}>
            We believe paying your bills shouldn&apos;t just be an expense. It should
            work for you. Vuior rewards you for planning ahead and paying early,
            helping you save more and stress less.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-11 gap-y-[38px] max-[620px]:grid-cols-1">
          {values.map((item) => (
            <article
              className="grid grid-cols-[56px_1fr] items-center gap-3.5"
              key={item.title}
            >
              <span className="grid h-[50px] w-[50px] place-items-center rounded-xl bg-[#edf9f5] text-[#009268] [&_svg]:w-[26px]">
                <Icon name={item.icon} />
              </span>
              <div>
                <h3 className="mb-2 text-[12px] max-[620px]:text-[17px]">
                  {item.title}
                </h3>
                <p className="m-0 text-[10px] leading-[1.55] text-[#657386] min-[901px]:text-[14px] min-[901px]:leading-[1.65] max-[620px]:text-[15px] max-[620px]:leading-[1.65]">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1330px] border-t border-[#dfe9e6] px-12 pt-[45px] pb-[42px] max-[900px]:px-[30px] max-[620px]:text-center">
        <p className={eyebrow}>Our story</p>
        <h2 className={sectionHeading}>Solving a problem we all face.</h2>
        <p className={`${bodyCopy} max-w-[480px]`}>
          Late fees, forgotten due dates, and tight budgets. Managing bills can
          be stressful.
          <br />
          We built Vuior to change that. By combining bill management with early
          payment incentives, we&apos;re creating a platform that helps you take
          control and get rewarded.
        </p>
        <div className="mt-[35px] grid grid-cols-4 gap-2.5 max-[620px]:grid-cols-1">
          {milestones.map((item) => (
            <article
              className="flex min-h-[110px] flex-col items-start rounded-[10px] border border-[#dfe9e6] px-5 py-3.5 max-[620px]:items-center"
              key={item.value}
            >
              <span className="mb-[7px] grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-[#edf9f5] text-[#009268]">
                {item.icon}
              </span>
              <strong className="mb-2 text-[12px] text-[#00895f]">
                {item.value}
              </strong>
              <p className="m-0 text-[10px] text-[#677588] min-[901px]:text-[14px] min-[901px]:leading-[1.65] max-[620px]:text-[15px] max-[620px]:leading-[1.65]">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1330px] px-12 pb-[42px] max-[900px]:px-[30px] max-[620px]:px-5">
        <div className="relative grid overflow-hidden rounded-[18px] bg-[#063f36] text-white md:grid-cols-[1.02fr_.98fr]">
          <div className="absolute -top-24 left-[42%] h-72 w-72 rounded-full bg-[#0ab17d]/20 blur-3xl" />
          <div className="relative px-7 py-9 sm:px-11 sm:py-11">
            <p className="text-[11px] font-extrabold tracking-[.15em] text-[#92e0c0]">VUIOR, IN YOUR POCKET</p>
            <h2 className="mt-3 max-w-[550px] text-[29px] font-bold leading-[1.15] tracking-[-1px] sm:text-[35px]">A calmer way to stay ahead of every bill.</h2>
            <p className="mt-4 max-w-[510px] text-[14px] leading-[1.7] text-[#c9dfd7] sm:text-[15px]">Pay early, check your rewards, and keep the details that matter close at hand—where life happens.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/#" aria-label="Download Vuior on the App Store" className="inline-flex h-[50px] items-center gap-2 rounded-[9px] bg-white px-4 text-[#063f36] transition hover:-translate-y-0.5 hover:bg-[#e4f7ef]"><span className="text-[21px]">●</span><span className="flex flex-col leading-none"><small className="mb-1 text-[8px] font-bold">DOWNLOAD ON THE</small><strong className="text-[16px] font-semibold">App Store</strong></span></Link>
              <Link href="/#" aria-label="Get Vuior on Google Play" className="inline-flex h-[50px] items-center gap-2 rounded-[9px] border border-white/25 bg-white/10 px-4 text-white transition hover:-translate-y-0.5 hover:bg-white/20"><span className="text-[21px] text-[#7cdebd]">▶</span><span className="flex flex-col leading-none"><small className="mb-1 text-[8px] font-bold">GET IT ON</small><strong className="text-[16px] font-semibold">Google Play</strong></span></Link>
            </div>
          </div>
          <div className="relative min-h-[260px] overflow-hidden max-[620px]:min-h-[215px]">
            <div className="absolute inset-0 z-[1] bg-linear-to-l from-[#0d5c4e] to-transparent" />
            <Image src="/app-phones.png" alt="Vuior mobile app screens" fill sizes="(max-width: 768px) 100vw, 42vw" className="object-cover object-left" />
          </div>
        </div>
      </section>

      <section className="mx-auto mb-5 grid h-[150px] max-w-[1330px] grid-cols-[1fr_auto_260px] items-center overflow-hidden rounded-[15px] border border-[#dfe9e6] bg-linear-to-r from-[#f3faf7] to-[#fbfdfc] px-[42px] max-[900px]:mx-6 max-[900px]:h-auto max-[900px]:grid-cols-[1fr_auto] max-[900px]:p-8 max-[620px]:grid-cols-1 max-[620px]:gap-[25px] max-[620px]:text-center">
        <div>
          <h2 className={`${sectionHeading} m-0`}>
            Join thousands of users who are
            <br />
            getting more from their bills.
          </h2>
        </div>
        <div className="flex items-center gap-[30px] max-[620px]:flex-col max-[620px]:justify-center max-[620px]:gap-[18px]">
          <Link className={`${primaryButton} h-11 px-[23px]`} href="/signup">
            Create free account
          </Link>
          <Link className={textLink} href="/how-it-works">
            See how it works <Icon name="arrow" />
          </Link>
        </div>
        <Image
          src="/rewards-gift-v2.png"
          alt="Gift box and reward coins"
          width={245}
          height={150}
          className="h-[142px] w-[210px] self-end justify-self-end object-contain max-[900px]:hidden"
        />
      </section>
      <SiteFooter />
    </main>
  );
}
