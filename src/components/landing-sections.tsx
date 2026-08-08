import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icons";

const ButtonPair = () => (
  <div className="button-row">
    <a className="button button-primary" href="#signup">
      Create free account
    </a>
    <a className="button button-outline" href="#how-it-works">
      <Icon name="play" />
      See how it works
    </a>
  </div>
);

export function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <h1>
            Pay your bills early.
            <br />
            <span>Get rewarded for it.</span>
          </h1>
          <p>
            Manage all your bills in one place, pay before the due date, and
            earn credits based on how early you pay.
          </p>
          <ButtonPair />
          <div className="hero-benefits">
            <span>
              <Icon name="gift" />
              Free to join
            </span>
            <span>
              <Icon name="check" />
              No hidden fees
            </span>
            <span>
              <Icon name="lock" />
              Secure payments
            </span>
          </div>
        </div>
        <div className="hero-art">
          <Image
            src="/hero-phone.png"
            alt="Vuior app showing bills, balance and rewards"
            fill
            sizes="(max-width: 800px) 100vw, 58vw"
            priority
          />
        </div>
      </div>
    </section>
  );
}

export function Providers() {
  return (
    <section className="providers" id="providers">
      <p>TRUSTED BY MILLIONS TO PAY BILLS FROM TOP PROVIDERS</p>
      <div className="provider-list">
        <strong>◉ AT&amp;T</strong>
        <strong>
          verizon<span>✓</span>
        </strong>
        <strong>
          ♞ DUKE
          <br />
          ENERGY
        </strong>
        <strong>✺ COMCAST</strong>
        <strong>●● mastercard</strong>
        <strong>⬡ exelon</strong>
        <strong>
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
    <section className="section features" id="features">
      <div className="section-copy">
        <p className="eyebrow">ALL YOUR BILLS. ONE PLACE.</p>
        <h2>
          Stay organized and
          <br />
          never miss a payment
        </h2>
        <p>Track due dates, set reminders, and manage payments with ease.</p>
        <ul className="feature-list">
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
        <a className="text-link" href="#">
          Explore features <Icon name="arrow" />
        </a>
      </div>
      <div className="dashboard-preview">
        <div className="bills-card">
          <h3>Upcoming Bills</h3>
          {bills.map((bill) => (
            <div className="bill-row" key={bill.name}>
              <span className="bill-icon">{bill.icon}</span>
              <span>
                <b>{bill.name}</b>
                <small>{bill.due}</small>
              </span>
              <span className="bill-price">
                <b>{bill.amount}</b>
                <small
                  className={bill.state === "Upcoming" ? "green" : "orange"}
                >
                  {bill.state}
                </small>
              </span>
              <button>Pay</button>
            </div>
          ))}
        </div>
        <aside>
          <div className="mini-stat">
            <small>Total Credits</small>
            <strong>2,450</strong>
            <span>
              +$84.20
              <br />
              <small>This month</small>
            </span>
          </div>
          <div className="recent">
            <h3>Recent Transaction</h3>
            <p>
              ⚡{" "}
              <span>
                <b>Wallet Top-up</b>
                <small>Jun 23 · 10:30 AM</small>
              </span>
              <strong>
                +$100.00<small>Success</small>
              </strong>
            </p>
            <p>
              ◇{" "}
              <span>
                <b>Electricity Payment</b>
                <small>Jun 23 · 09:15 AM</small>
              </span>
              <strong>
                -$85.50<small>Success</small>
              </strong>
            </p>
            <a href="#">View all</a>
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
    <section className="rewards" id="rewards">
      <div className="rewards-inner">
        <div className="rewards-copy">
          <p className="eyebrow light">◉ VUIOR REWARDS</p>
          <h2>
            The earlier you pay,
            <br />
            the more you earn
          </h2>
          <p>Earn credits when you pay eligible bills before the due date.</p>
          <a className="button button-light" href="#">
            View all rewards
          </a>
        </div>
        <div className="reward-tiers">
          {tiers.map((t) => (
            <div className="reward-tier" key={t.pct}>
              <span className="round-icon">
                <Icon name="calendar" />
              </span>
              <b>{t.days}</b>
              <small>Earn up to</small>
              <strong>{t.pct}</strong>
              <small>in credits</small>
            </div>
          ))}
          <div className="reward-example">
            <div className="reward-example-copy">
              <b>Example</b>
              <p>
                Electricity bill <span>$100.00</span>
              </p>
              <p>Paid 10 days early</p>
              <small>Credits earned</small>
              <strong>+$10.00</strong>
            </div>
            <Image
              className="reward-coins"
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
    <section className="how section-stack" id="how-it-works">
      <p className="eyebrow centered">HOW VUIOR WORKS</p>
      <h2>Simple steps. Real rewards.</h2>
      <div className="steps">
        {steps.map((step, i) => (
          <div className="step" key={step.title}>
            <i>{i + 1}</i>
            <span className="step-icon">
              <Icon name={step.icon} />
            </span>
            <b>{step.title}</b>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DownloadSection() {
  return (
    <section className="download">
      <div className="download-art">
        <Image
          src="/app-phones.png"
          alt="Three Vuior mobile app screens"
          fill
          sizes="(max-width: 800px) 100vw, 50vw"
        />
      </div>
      <div className="download-copy">
        <h2>
          Manage your bills
          <br />
          anytime, anywhere
        </h2>
        <p>
          The Vuior app makes it easy to pay bills, earn credits, and stay in
          control on the go.
        </p>
        <div className="store-row">
          <span className="store-badge">
            ● <i>Download on the</i>
            <b>App Store</b>
          </span>
          <span className="store-badge playstore">
            ▶ <i>GET IT ON</i>
            <b>Google Play</b>
          </span>
        </div>
      </div>
    </section>
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
    <section className="security-strip">
      {items.map((x) => (
        <div className="security-item" key={x.title}>
          <Icon name={x.icon} />
          <span>
            <b>{x.title}</b>
            <p>{x.text}</p>
          </span>
        </div>
      ))}
    </section>
  );
}

const faqs = [
  "How do Vuior credits work?",
  "Which bills can I pay with Vuior?",
  "How early do I need to pay to earn credits?",
  "Can I set up autopay for my bills?",
  "Is Vuior free to use?",
  "Can I withdraw my credits?",
  "What happens if a payment fails?",
  "How does Vuior protect my account?",
];

export function FaqSection() {
  return (
    <section className="faq" id="faq">
      <div className="faq-heading">
        <h2>Frequently asked questions</h2>
        <Link href="/help">
          View all FAQs <Icon name="arrow" />
        </Link>
      </div>
      <div className="faq-grid">
        {faqs.map((faq, i) => (
          <details key={faq}>
            <summary>
              {faq}
              <Icon name="chevron" />
            </summary>
            <p>
              {i === 0
                ? "Credits are earned automatically when eligible bills are paid before their due date."
                : "Find quick answers and helpful guidance in the Vuior help center."}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <section className="final-cta" id="signup">
        <Image
          src="/rewards-gift.png"
          alt="Vuior reward gift and coins"
          fill
          sizes="90vw"
        />
        <div className="cta-copy">
          <h2>
            Start getting more from
            <br />
            the bills you already pay
          </h2>
          <p>Join Vuior today and turn early payments into real rewards.</p>
        </div>
        <ButtonPair />
      </section>
      <div className="footer-grid">
        <div className="footer-brand">
          <Image src="/vuiorLogo.png" alt="Vuior" width={112} height={42} />
          <p>
            Pay your bills early and earn
            <br />
            credits for a smarter financial life.
          </p>
          <div className="socials">f　◎　𝕏　▶</div>
        </div>
        <div>
          <b>Product</b>
          <a href="#how-it-works">How it works</a>
          <a href="#rewards">Rewards</a>
          <a href="#features">Features</a>
          <a href="#providers">Bill providers</a>
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
          <a href="#">Privacy policy</a>
          <a href="#">Terms of service</a>
          <a href="#">Cookie policy</a>
        </div>
      </div>
      <p className="copyright">© 2026 Vuior. All rights reserved.</p>
    </footer>
  );
}
