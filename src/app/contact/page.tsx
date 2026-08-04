import { ContactForm } from "@/components/contact-form";
import { Header } from "@/components/header";
import { Icon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";

const reach = [
  { icon: "✉", title: "Email support", lines: ["support@vuior.com"] },
  { icon: "◌", title: "Live chat", lines: ["Available in the app and", "dashboard"] },
  { icon: "▣", title: "Help center", lines: ["Browse answers to common", "questions"] },
  { icon: "☎", title: "Call us", lines: ["+234 800 123 4567", "Mon - Fri, 9am - 5pm (WAT)"] },
];

export default function ContactPage() {
  return (
    <main className="inner-page contact-page">
      <Header />
      <section className="contact-intro"><p className="inner-eyebrow">CONTACT US</p><h1>We’re here to help.</h1><p>Have a question, suggestion, or need support?<br />Reach out to us and we’ll get back to you as soon as possible.</p></section>
      <section className="contact-grid">
        <ContactForm />
        <aside className="contact-aside"><h2>Other ways to reach us</h2><div className="reach-list">{reach.map((item) => <article key={item.title}><span>{item.icon}</span><div><h3>{item.title}</h3>{item.lines.map((line) => <p key={line}>{line}</p>)}</div></article>)}</div></aside>
      </section>
      <section className="help-banner"><div><h2>Looking for quick answers?</h2><p>Visit our Help Center for articles on managing bills, payments, rewards and more.</p></div><a className="button button-outline button-small" href="#">Go to Help Center <Icon name="arrow" /></a></section>
      <section className="contact-trust">
        <article><span><Icon name="clock" /></span><div><h3>Response time</h3><p>We aim to respond to all<br />inquiries within 24 hours.</p></div></article>
        <article><span><Icon name="shield" /></span><div><h3>Secure & private</h3><p>Your information is safe with us.<br />We never share your data.</p></div></article>
        <article><span><Icon name="support" /></span><div><h3>Here to help</h3><p>Our support team is friendly<br />and ready to assist.</p></div></article>
      </section>
      <SiteFooter />
    </main>
  );
}
