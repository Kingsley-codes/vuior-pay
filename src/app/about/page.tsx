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
  { icon: "◎", value: "10K+", text: "Users already managing their bills with Vuior." },
  { icon: "⌁", value: "100+", text: "Billers and providers integrated." },
  { icon: "✈", value: "And growing", text: "We’re just getting started." },
];

export default function AboutPage() {
  return (
    <main className="inner-page">
      <Header active="about" />
      <section className="about-hero">
        <div className="about-hero-copy">
          <p className="inner-eyebrow">ABOUT VUIOR</p>
          <h1>Building a better way<br />to manage bills.</h1>
          <p>Vuior helps you pay your bills early, stay organized,<br className="desktop-break" /> and earn real rewards for good financial habits.</p>
          <div className="about-actions"><Link className="button button-primary" href="/#signup">Create free account</Link><Link className="text-link" href="/#how-it-works">See how it works <Icon name="arrow" /></Link></div>
        </div>
        <div className="about-visual">
          <Image src="/about-hero-cutout.png" alt="Vuior customer smiling while paying a bill on her phone" fill sizes="(max-width: 800px) 100vw, 48vw" priority />
          <div className="payment-card"><span className="success-dot">✓</span><b>Payment Successful</b><small>Electricity Bill</small><strong>$85.50</strong><em>You earned<br /><mark>+5% credits</mark></em></div>
          <div className="credits-card"><small>Available credits</small><strong>2,450</strong><span>♙</span></div>
        </div>
      </section>

      <section className="about-mission">
        <div><p className="inner-eyebrow">Our mission</p><h2>Empowering smarter financial<br />habits through rewards.</h2><p>We believe paying your bills shouldn’t just be an expense—it should work for you. Vuior rewards you for planning ahead and paying early, helping you save more and stress less.</p></div>
        <div className="value-grid">{values.map((item) => <article key={item.title}><span><Icon name={item.icon} /></span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div>
      </section>

      <section className="about-story">
        <p className="inner-eyebrow">Our story</p><h2>Solving a problem we all face.</h2>
        <p>Late fees, forgotten due dates, and tight budgets—managing bills can be stressful.<br />We built Vuior to change that. By combining bill management with early payment incentives, we’re creating a platform that helps you take control and get rewarded.</p>
        <div className="milestone-grid">{milestones.map((item) => <article key={item.value}><span>{item.icon}</span><strong>{item.value}</strong><p>{item.text}</p></article>)}</div>
      </section>

      <section className="about-cta">
        <div><h2>Join thousands of users who are<br />getting more from their bills.</h2></div>
        <div className="about-cta-actions"><Link className="button button-primary button-small" href="/#signup">Create free account</Link><Link className="text-link" href="/#how-it-works">See how it works <Icon name="arrow" /></Link></div>
        <Image src="/rewards-gift-v2.png" alt="Gift box and reward coins" width={245} height={150} />
      </section>
      <SiteFooter />
    </main>
  );
}
