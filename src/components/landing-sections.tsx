import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icons";
import { MOBILE_FAQS } from "@/data/faqs";

const buttonBase =
  "inline-flex h-[50px] items-center justify-center gap-2.5 rounded-md px-[30px] text-[14px] font-bold transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_#007b5824] [&_svg]:w-[19px]";

const primaryButton = `${buttonBase} bg-linear-to-br from-[#00a475] to-[#007d5a] !text-white shadow-[0_8px_20px_#008e6623]`;

const outlineButton = `${buttonBase} border border-[#009268] bg-white text-[#007f5d]`;

const textLink =
  "inline-flex items-center gap-[9px] text-[13px] font-bold text-[#009268] max-[620px]:text-[14px] [&_svg]:w-[17px]";

const eyebrow =
  "mb-6 text-[10px] font-extrabold leading-none tracking-[0.6px] text-[#009268] max-[620px]:text-[12px]";

const sectionHeading =
  "mb-5 text-[30px] font-bold leading-[1.24] tracking-[-1px] max-[620px]:text-[26px]";

const ButtonPair = ({ cta = false }: { cta?: boolean }) => (
  <div
    className={`flex items-center gap-[18px] ${
      cta
        ? "relative z-[1] max-[620px]:flex-col"
        : "max-[900px]:justify-center max-[620px]:flex-col"
    }`}
  >
    <a
      className={`${primaryButton} ${cta ? "max-[620px]:w-[230px]" : "max-[620px]:w-full max-[620px]:max-w-[300px]"}`}
      href="#signup"
    >
      Create free account
    </a>
    <a
      className={`${outlineButton} ${cta ? "border-[#b6d5cb] bg-white/5 text-white max-[620px]:w-[230px]" : "max-[620px]:w-full max-[620px]:max-w-[300px]"}`}
      href="#how-it-works"
    >
      <Icon name="play" />
      See how it works
    </a>
  </div>
);

export function HeroSection() {
  return (
    <section className="overflow-hidden bg-linear-to-br from-white via-[#fbfdfc] via-30% to-[#f1f8f6]">
      <div className="mx-auto grid h-[575px] max-w-[1240px] grid-cols-[48%_52%] items-center px-7 pt-[25px] max-[900px]:h-auto max-[900px]:min-h-[720px] max-[900px]:grid-cols-1 max-[900px]:pt-[60px] max-[620px]:min-h-[680px] max-[620px]:px-[18px] max-[620px]:pt-[42px]">
        <div className="relative z-[2] pb-10 max-[900px]:pb-0 max-[900px]:text-center">
          <h1 className="mb-6 text-[57px] font-[750] leading-[1.07] tracking-[-2.6px] max-[900px]:text-[48px] max-[620px]:text-[39px] max-[620px]:tracking-[-1.8px] max-[430px]:text-[clamp(34px,10vw,39px)]">
            Pay your bills early.
            <br />
            <span className="text-[#009268]">Get rewarded for it.</span>
          </h1>
          <p className="mb-[33px] max-w-140 text-[18px] leading-[1.7] text-[#58677b] min-[901px]:text-[20px] max-[900px]:mx-auto max-[620px]:text-[15px] max-[430px]:text-[16px] max-[430px]:leading-[1.65]">
            Manage all your bills in one place, pay before the due date, and
            earn credits based on how early you pay.
          </p>
          <ButtonPair />
          <div className="mt-[57px] flex gap-[35px] text-[12px] font-bold max-[900px]:mt-[35px] max-[900px]:justify-center max-[620px]:flex-wrap max-[620px]:gap-[13px] max-[430px]:mx-auto max-[430px]:grid max-[430px]:max-w-[290px] max-[430px]:grid-cols-2 max-[430px]:justify-items-start [&_span]:flex [&_span]:items-center [&_span]:gap-[9px] [&_span]:whitespace-nowrap [&_svg]:h-6 [&_svg]:w-6 [&_svg]:rounded-full [&_svg]:bg-[#eaf8f3] [&_svg]:p-[5px] [&_svg]:text-[#009268]">
            <span>
              <Icon name="gift" />
              Free to join
            </span>
            <span>
              <Icon name="check" />
              No hidden fees
            </span>
            <span className="max-[430px]:col-span-full">
              <Icon name="lock" />
              Secure payments
            </span>
          </div>
        </div>
        <div className="relative ml-[-25px] h-[570px] w-[760px] max-[900px]:m-0 max-[900px]:h-[460px] max-[900px]:w-full max-[620px]:mt-[18px] max-[620px]:h-[340px] max-[430px]:ml-0 max-[430px]:h-[280px]">
          <Image
            src="/hero-phone.png"
            alt="Vuior app showing bills, balance and rewards"
            fill
            sizes="(max-width: 800px) 100vw, 58vw"
            priority
            className="object-contain object-center"
          />
        </div>
      </div>
    </section>
  );
}

export function Providers() {
  return (
    <section
      className="overflow-hidden border-y border-b-[#dfe9e6] border-t-[#f0f4f2] px-6 pt-[35px] pb-[37px] text-center"
      id="providers"
    >
      <p className="mb-[31px] text-[10px] font-extrabold tracking-[1.2px] text-[#718091] max-[620px]:text-[12px]">
        TRUSTED BY MILLIONS TO PAY BILLS FROM TOP PROVIDERS
      </p>

      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-7 max-[620px]:grid max-[620px]:grid-cols-4 max-[620px]:gap-x-5 max-[620px]:gap-y-6">
        <Image
          src="/logos/att.png"
          alt="AT&T"
          width={80}
          height={35}
          className="h-3 w-auto shrink-0 object-contain max-[620px]:justify-self-center md:h-[35px]"
        />

        <Image
          src="/logos/verizon.png"
          alt="Verizon"
          width={90}
          height={35}
          className="h-3 w-auto shrink-0 object-contain max-[620px]:justify-self-center md:h-[35px]"
        />

        <Image
          src="/logos/duke-energy.png"
          alt="Duke Energy"
          width={80}
          height={40}
          className="h-3 w-auto shrink-0 object-contain max-[620px]:justify-self-center md:h-[40px]"
        />

        <Image
          src="/logos/comcast.png"
          alt="Comcast"
          width={100}
          height={35}
          className="h-3 w-auto shrink-0 object-contain max-[620px]:justify-self-center md:h-[35px]"
        />

        <Image
          src="/logos/mastercard.png"
          alt="Mastercard"
          width={105}
          height={35}
          className="h-3 w-auto shrink-0 object-contain max-[620px]:justify-self-center md:h-[40px]"
        />

        <Image
          src="/logos/exelon.png"
          alt="Exelon"
          width={80}
          height={35}
          className="h-3 w-auto shrink-0 object-contain max-[620px]:justify-self-center md:h-[35px]"
        />

        <strong className="text-[9px] max-[620px]:justify-self-center md:text-base">
          +100
          <br />
          <small>more</small>
        </strong>
      </div>
    </section>
  );
}

const bills = [
  {
    icon: "⚡",
    name: "Electricity",
    due: "Due Jun 28, 2026",
    amount: "$85.50",
    state: "Due soon",
  },
  {
    icon: "⌁",
    name: "Internet",
    due: "Due Jun 30, 2026",
    amount: "$55.00",
    state: "Due soon",
  },
  {
    icon: "◉",
    name: "Water Bill",
    due: "Due Jul 05, 2026",
    amount: "$31.20",
    state: "Upcoming",
  },
];

export function FeaturesSection() {
  return (
    <section
      className="mx-auto grid max-w-[1150px] grid-cols-[37%_63%] items-center gap-[35px] px-6 py-[74px] max-[900px]:grid-cols-1 max-[900px]:px-[30px] max-[900px]:py-[60px] max-[620px]:px-5 max-[620px]:py-[55px]"
      id="features"
    >
      <div className="max-[900px]:text-center">
        <p className={eyebrow}>ALL YOUR BILLS. ONE PLACE.</p>
        <h2 className={sectionHeading}>
          Stay organized and
          <br />
          never miss a payment
        </h2>
        <p className="max-w-[350px] text-[14px] leading-[1.55] text-[#58677b] min-[901px]:text-[17px] min-[901px]:leading-[1.7] max-[900px]:mx-auto max-[620px]:text-[14px] max-[620px]:leading-[1.65]">
          Track due dates, set reminders, and manage payments with ease.
        </p>
        <ul className="my-7 list-none p-0 max-[900px]:mx-auto max-[900px]:max-w-[330px] max-[900px]:text-left [&_li]:my-[15px] [&_li]:flex [&_li]:items-center [&_li]:gap-3 [&_li]:text-[12px] max-[620px]:[&_li]:text-[13px] [&_svg]:w-[18px] [&_svg]:rounded-full [&_svg]:bg-[#eaf8f3] [&_svg]:p-[3px] [&_svg]:text-[#009268]">
          <li>
            <Icon name="calendar" />
            See all upcoming bills at a glance
          </li>
          <li>
            <Icon name="clock" />
            Set up autopay and reminders
          </li>
          <li>
            <Icon name="wallet" />
            View payment history anytime
          </li>
        </ul>
        <a className={textLink} href="#">
          Explore features <Icon name="arrow" />
        </a>
      </div>
      <div className="grid h-[360px] grid-cols-[2fr_1fr] gap-2.5 max-[620px]:h-auto max-[620px]:grid-cols-1">
        <div className="rounded-xl border border-[#dfe9e6] bg-white p-6 shadow-[0_6px_25px_#133c3010] max-[620px]:p-[15px]">
          <h3 className="mb-5 text-[12px]">Upcoming Bills</h3>
          {bills.map((bill) => (
            <div
              className="grid grid-cols-[36px_1fr_70px_54px] items-center gap-[11px] border-b border-[#edf1f0] py-3.5 text-[11px] last:border-0 max-[620px]:grid-cols-[32px_1fr_58px_42px] max-[430px]:grid-cols-[30px_minmax(75px,1fr)_52px_42px] max-[430px]:gap-[7px] [&_small]:text-[9px] [&_small]:text-[#718091] [&_span]:flex [&_span]:flex-col [&_span]:gap-[5px]"
              key={bill.name}
            >
              <span className="grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-[#fff7e8] text-[17px] text-[#ffa200]">
                {bill.icon}
              </span>
              <span>
                <b>{bill.name}</b>
                <small>{bill.due}</small>
              </span>
              <span className="text-right max-[430px]:[&_b]:text-[9px]">
                <b>{bill.amount}</b>
                <small
                  className={
                    bill.state === "Upcoming"
                      ? "text-[#009268]"
                      : "text-[#f28a00]"
                  }
                >
                  {bill.state}
                </small>
              </span>
              <button className="h-[33px] rounded-[5px] border-0 bg-[#009268] text-[10px] font-bold text-white max-[620px]:min-h-10">
                Pay
              </button>
            </div>
          ))}
        </div>
        <aside className="grid grid-rows-[105px_1fr] gap-2.5 max-[620px]:grid-cols-2 max-[620px]:grid-rows-none max-[430px]:grid-cols-1">
          <div className="relative rounded-xl border border-[#dfe9e6] bg-white p-[18px] shadow-[0_6px_25px_#133c3010]">
            <small className="mb-[7px] block text-[9px] text-[#637184]">
              Total Credits
            </small>
            <strong className="text-[23px]">2,450</strong>
            <span className="absolute right-4 bottom-[18px] text-right text-[10px] font-bold text-[#009268]">
              +$84.20
              <br />
              <small className="font-normal">This month</small>
            </span>
          </div>
          <div className="rounded-xl border border-[#dfe9e6] bg-white p-[18px] text-[8px] shadow-[0_6px_25px_#133c3010]">
            <h3 className="mb-5 text-[12px]">Recent Transaction</h3>
            {[
              ["⚡", "Wallet Top-up", "Jun 23 · 10:30 AM", "+$100.00"],
              ["◇", "Electricity Payment", "Jun 23 · 09:15 AM", "-$85.50"],
            ].map(([icon, title, date, amount]) => (
              <p
                className="m-0 grid grid-cols-[20px_1fr_auto] items-center gap-[5px] border-b border-[#edf1f0] py-2.5"
                key={title}
              >
                {icon}
                <span className="flex flex-col gap-[5px]">
                  <b>{title}</b>
                  <small className="text-[7px] text-[#718091]">{date}</small>
                </span>
                <strong className="flex flex-col gap-[5px]">
                  {amount}
                  <small className="text-right text-[7px] text-[#009268]">
                    Success
                  </small>
                </strong>
              </p>
            ))}
            <a className="mt-[15px] block text-right text-[#009268]" href="#">
              View all
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function RewardsSection() {
  const tiers = [
    { days: "1 – 3 days early", pct: "2%" },
    { days: "4 – 7 days early", pct: "5%" },
    { days: "8 – 14 days early", pct: "10%" },
  ];
  return (
    <section className="bg-[#003f35] text-white" id="rewards">
      <div className="mx-auto grid min-h-[300px] max-w-[1240px] grid-cols-[31%_69%] items-center px-7 py-9 max-[900px]:grid-cols-1 max-[620px]:px-5 max-[620px]:py-[45px]">
        <div className="pl-10 max-[900px]:px-0 max-[900px]:pt-5 max-[900px]:pb-[35px] max-[900px]:text-center">
          <p className={`${eyebrow} text-[#83e6c2]`}>◉ VUIOR REWARDS</p>
          <h2 className={`${sectionHeading} mb-[15px]`}>
            The earlier you pay,
            <br />
            the more you earn
          </h2>
          <p className="max-w-[290px] text-[13px] leading-[1.55] text-[#d3e4df] min-[901px]:text-[16px] min-[901px]:leading-[1.7] max-[900px]:mx-auto max-[620px]:text-[14px] max-[620px]:leading-[1.65]">
            Earn credits when you pay eligible bills before the due date.
          </p>
          <a
            className="mt-2.5 inline-flex h-[39px] items-center justify-center rounded-md bg-white px-[19px] text-[11px] font-bold text-[#006b4f] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_#007b5824]"
            href="#"
          >
            View all rewards
          </a>
        </div>
        <div className="grid grid-cols-[repeat(3,1fr)_1.35fr] items-stretch max-[900px]:grid-cols-2 max-[620px]:grid-cols-1">
          {tiers.map((t) => (
            <div
              className="flex min-h-[214px] flex-col items-center justify-center gap-2 border-l border-white/25 text-center max-[620px]:min-h-[180px] max-[620px]:border-l-0 max-[620px]:border-t max-[620px]:border-white/20"
              key={t.pct}
            >
              <span className="mb-1.5 grid h-[52px] w-[52px] place-items-center rounded-full border border-[#00a878] [&_svg]:w-[27px] [&_svg]:text-[#00c28a]">
                <Icon name="calendar" />
              </span>
              <b className="text-[13px]">{t.days}</b>
              <small className="text-[11px]">Earn up to</small>
              <strong className="text-[40px] leading-none">{t.pct}</strong>
              <small className="text-[11px]">in credits</small>
            </div>
          ))}
          <div className="relative flex min-h-[214px] flex-col items-stretch justify-between gap-2 overflow-hidden border-l border-white/25 px-4 pt-5 pb-[15px] pl-[30px] text-left max-[900px]:border-t max-[900px]:border-white/20 max-[620px]:min-h-[210px] max-[620px]:border-l-0 max-[620px]:pl-6">
            <div className="relative z-[2] w-full [&_p]:my-2 [&_p]:w-full [&_p]:text-[10px] max-[620px]:[&_p]:text-[13px] [&_small]:my-[16px_0_5px] [&_small]:block [&_small]:text-[9px] max-[620px]:[&_small]:text-[13px] [&_strong]:text-[18px]">
              <b>Example</b>
              <p>
                Electricity bill{" "}
                <span className="float-right font-bold">$100.00</span>
              </p>
              <p>Paid 10 days early</p>
              <small>Credits earned</small>
              <strong>+$10.00</strong>
            </div>
            <Image
              className="absolute right-0 bottom-0 h-[154px] w-[230px] object-cover object-[70%_center] mix-blend-lighten max-[620px]:h-[167px] max-[620px]:w-[250px]"
              src="/reward-coins.png"
              alt="Stacks of gold Vuior reward coins"
              width={270}
              height={180}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      icon: "wallet" as const,
      title: "Add your bills",
      text: "Connect or manually add all your recurring bills in one place.",
    },
    {
      icon: "calendar" as const,
      title: "Pay before the due date",
      text: "Choose when to pay or set autopay and stay ahead.",
    },
    {
      icon: "gift" as const,
      title: "Earn credits",
      text: "Get rewarded based on how early you pay eligible bills.",
    },
  ];
  return (
    <section
      className="mx-auto max-w-[1120px] px-[25px] py-[52px] text-center"
      id="how-it-works"
    >
      <p className={`${eyebrow} mb-[13px]`}>HOW VUIOR WORKS</p>
      <h2 className={`${sectionHeading} mb-[33px]`}>
        Simple steps. Real rewards.
      </h2>
      <div className="relative grid grid-cols-3 before:absolute before:top-[35px] before:left-[17%] before:right-[17%] before:border-t-2 before:border-dashed before:border-[#d7ebe5] max-[620px]:grid-cols-1 max-[620px]:gap-[42px] max-[620px]:before:hidden">
        {steps.map((step, i) => (
          <div
            className="relative flex flex-col items-center px-[45px]"
            key={step.title}
          >
            <i className="absolute top-[27px] left-1.5 grid h-[23px] w-[23px] place-items-center rounded-full bg-[#009268] text-[10px] font-bold not-italic text-white max-[620px]:left-[20%]">
              {i + 1}
            </i>
            <span className="z-[1] mb-[17px] grid h-[70px] w-[70px] place-items-center rounded-full bg-[#eff8f5] [&_svg]:w-[37px] [&_svg]:text-[#009268]">
              <Icon name={step.icon} />
            </span>
            <b className="mb-2.5 text-[12px] max-[620px]:text-[13px]">
              {step.title}
            </b>
            <p className="m-0 max-w-[220px] text-[10px] leading-[1.6] text-[#5c6a7e] min-[901px]:text-[15px] min-[901px]:leading-[1.7] max-[620px]:text-[14px] max-[620px]:leading-[1.65]">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DownloadSection() {
  return (
    <section className="mx-auto mb-[49px] grid h-[242px] max-w-[1045px] grid-cols-[48%_52%] overflow-hidden rounded-2xl border border-[#dfe9e6] bg-[#f7faf9] max-[900px]:mx-[25px] max-[900px]:mb-[45px] max-[620px]:mx-[18px] max-[620px]:h-auto max-[620px]:grid-cols-1">
      <div className="relative max-[620px]:h-[220px]">
        <Image
          src="/app-phones.png"
          alt="Three Vuior mobile app screens"
          fill
          sizes="(max-width: 800px) 100vw, 50vw"
          className="object-cover object-left"
        />
      </div>
      <div className="flex flex-col justify-center px-[52px] py-5 max-[620px]:px-[25px] max-[620px]:pt-[27px] max-[620px]:pb-[35px] max-[620px]:text-center">
        <h2 className="mb-[13px] text-[26px] font-bold leading-[1.24] tracking-[-1px]">
          Manage your bills
          <br />
          anytime, anywhere
        </h2>
        <p className="max-w-[390px] text-[12px] leading-[1.55] text-[#5c6a7e] min-[901px]:text-[15px] min-[901px]:leading-[1.7] max-[620px]:text-[14px] max-[620px]:leading-[1.65]">
          The Vuior app makes it easy to pay bills, earn credits, and stay in
          control on the go.
        </p>
        <div className="mt-2 flex gap-3 max-[620px]:justify-center max-[430px]:flex-col max-[430px]:items-center">
          <StoreBadge store="apple" />
          <StoreBadge store="google" />
        </div>
      </div>
    </section>
  );
}

function StoreBadge({ store }: { store: "apple" | "google" }) {
  const apple = store === "apple";
  return (
    <a
      className="flex h-[50px] min-w-[154px] items-center gap-2.5 rounded-[9px] border border-[#27312e] bg-linear-to-b from-[#171a19] to-[#050606] px-3.5 py-1.5 text-white shadow-[0_7px_16px_#10251d1c] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_#10251d29] max-[430px]:w-[150px]"
      href="#"
      aria-label={
        apple ? "Download Vuior on the App Store" : "Get Vuior on Google Play"
      }
    >
      {apple ? (
        <svg
          className="h-[30px] w-[29px] shrink-0"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M17.05 12.54c-.02-2.18 1.78-3.24 1.86-3.29a4 4 0 0 0-3.15-1.7c-1.32-.14-2.6.8-3.27.8-.69 0-1.73-.78-2.85-.76a4.2 4.2 0 0 0-3.54 2.16c-1.53 2.65-.39 6.55 1.08 8.69.74 1.05 1.6 2.23 2.72 2.19 1.1-.05 1.51-.7 2.83-.7 1.31 0 1.69.7 2.84.68 1.18-.02 1.92-1.05 2.63-2.1a8.6 8.6 0 0 0 1.2-2.45 3.78 3.78 0 0 1-2.35-3.52ZM14.9 6.15a3.83 3.83 0 0 0 .88-2.75 3.9 3.9 0 0 0-2.54 1.3 3.65 3.65 0 0 0-.9 2.65 3.22 3.22 0 0 0 2.56-1.2Z"
          />
        </svg>
      ) : (
        <svg
          className="h-[30px] w-[27px] shrink-0"
          viewBox="0 0 28 31"
          aria-hidden="true"
        >
          <path fill="#00d6ff" d="M1 1.5 17 15.5 1 29.5Z" />
          <path
            fill="#ffdb00"
            d="m17 15.5 4.2-3.7 5.2 3c.8.5.8 1.2 0 1.7l-5.3 3Z"
          />
          <path fill="#ff3a44" d="M1 29.5 17 15.5l4.1 4Z" />
          <path fill="#00ef75" d="M1 1.5 21.2 11.8 17 15.5Z" />
        </svg>
      )}
      <span className="flex flex-col items-start leading-none">
        <small className="mb-1 text-[8px] font-medium tracking-[0.03em]">
          {apple ? "Download on the" : "GET IT ON"}
        </small>
        <strong className="text-[17px] font-semibold tracking-[-0.02em]">
          {apple ? "App Store" : "Google Play"}
        </strong>
      </span>
    </a>
  );
}

export function SecurityStrip() {
  const items = [
    {
      icon: "shield" as const,
      title: "Secure & encrypted",
      text: "Your data and payments are always protected.",
    },
    {
      icon: "spark" as const,
      title: "Trusted payments",
      text: "We use secure payment networks you know.",
    },
    {
      icon: "lock" as const,
      title: "Private & confidential",
      text: "We never sell your data. Period.",
    },
    {
      icon: "support" as const,
      title: "24/7 support",
      text: "We're here anytime you need help.",
    },
  ];
  return (
    <section className="mx-auto mb-[52px] grid max-w-[1110px] grid-cols-4 max-[900px]:grid-cols-2 max-[900px]:gap-7 max-[620px]:mx-5 max-[620px]:mb-[45px] max-[620px]:grid-cols-1">
      {items.map((x) => (
        <div
          className={`grid grid-cols-[55px_1fr] gap-2.5 border-r border-[#dfe9e6] px-[25px] last:border-0 max-[900px]:nth-[2]:border-0 max-[620px]:border-r-0 max-[620px]:border-b max-[620px]:px-2 max-[620px]:pb-[22px] [&_svg]:w-[38px] [&_svg]:text-[#009268]`}
          key={x.title}
        >
          <Icon name={x.icon} />
          <span>
            <b className="text-[11px] max-[620px]:text-[13px]">{x.title}</b>
            <p className="my-2 text-[9px] leading-[1.6] text-[#647185] min-[901px]:text-[14px] max-[620px]:text-[14px] max-[620px]:leading-[1.65]">
              {x.text}
            </p>
          </span>
        </div>
      ))}
    </section>
  );
}

export function FaqSection() {
  const faqs = MOBILE_FAQS.slice(0, 8);
  return (
    <section
      className="mx-auto mb-[33px] max-w-[1080px] px-[22px] max-[430px]:px-4"
      id="faq"
    >
      <div className="flex items-center justify-between max-[430px]:items-start max-[430px]:gap-[15px]">
        <h2 className="text-[18px] font-bold tracking-[-0.3px]">
          Frequently asked questions
        </h2>
        <Link
          className="flex items-center gap-[7px] text-[10px] font-bold text-[#009268] max-[620px]:text-[13px] max-[430px]:mt-1 max-[430px]:whitespace-nowrap [&_svg]:w-[17px]"
          href="/help"
        >
          View all FAQs <Icon name="arrow" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-[55px] max-[620px]:grid-cols-1">
        {faqs.map((faq, index) => (
          <details
            className={`border border-b-0 border-[#dfe9e6] ${index >= faqs.length - 2 ? "border-b max-[620px]:border-b-0" : ""} last:max-[620px]:border-b`}
            key={faq.value}
          >
            <summary className="flex h-11 cursor-pointer list-none items-center justify-between px-[17px] text-[10px] max-[620px]:min-h-[52px] max-[620px]:h-auto max-[620px]:py-3 max-[620px]:text-[13px] [&::-webkit-details-marker]:hidden [&_svg]:w-3.5 [[open]_&>svg]:rotate-180">
              {faq.title}
              <Icon name="chevron" />
            </summary>
            <p className="m-0 px-[17px] pb-3.5 text-[10px] leading-[1.5] text-[#607083] min-[901px]:text-[14px] min-[901px]:leading-[1.65] max-[620px]:text-[14px] max-[620px]:leading-[1.65]">
              {faq.content}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function FinalCtaSection() {
  return (
    <section
      className="isolate relative mx-auto mb-9 grid h-[190px] max-w-[1080px] grid-cols-[1fr_auto] items-center overflow-hidden rounded-[17px] px-16 text-white max-[900px]:mx-[25px] max-[900px]:px-[35px] max-[620px]:mx-[15px] max-[620px]:mb-[35px] max-[620px]:min-h-[360px] max-[620px]:grid-cols-1 max-[620px]:px-[22px] max-[620px]:py-[45px] max-[620px]:text-center max-[430px]:mx-2.5"
      id="signup"
    >
      <Image
        src="/rewards-gift.png"
        alt="Vuior reward gift and coins"
        fill
        sizes="90vw"
        className="z-0 object-cover object-center"
      />
      <div className="relative z-[1]">
        <h2 className="mb-[13px] text-[26px] font-bold leading-[1.24] tracking-[-1px]">
          Start getting more from
          <br />
          the bills you already pay
        </h2>
        <p className="text-[11px] leading-[1.5] min-[901px]:text-[15px] min-[901px]:leading-[1.65] max-[620px]:text-[14px] max-[620px]:leading-[1.65]">
          Join Vuior today and turn early payments into real rewards.
        </p>
      </div>
      <ButtonPair cta />
    </section>
  );
}
