import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { Header } from "@/components/header";
import { Icon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";

const reach = [
  { icon: "✉", title: "Email support", lines: ["support@vuior.com"] },
  {
    icon: "❓",
    title: "Frequently asked questions",
    lines: ["Browse answers to common", "questions"],
  },
  {
    icon: "☎",
    title: "Call us",
    lines: ["+234 800 123 4567", "Mon - Fri, 9am - 5pm (WAT)"],
  },
];

const outlineButton =
  "inline-flex h-11 items-center justify-center gap-2.5 rounded-md border border-[#009268] bg-white px-[23px] text-[14px] font-bold text-[#007f5d] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_#007b5824] [&_svg]:w-[19px]";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-white from-30% to-[#fbfdfc] text-[#07142d]">
      <Header active="contact" />
      <section className="mx-auto max-w-[1330px] px-12 pt-[70px] pb-[42px] max-[900px]:px-[30px] max-[900px]:pt-[55px] max-[900px]:pb-[35px] max-[620px]:px-5 max-[620px]:text-center">
        <p className="mb-[18px] text-[11px] font-extrabold text-[#00895f] max-[620px]:text-[12px]">
          CONTACT US
        </p>
        <h1 className="mb-5 text-[41px] font-bold leading-[1.08] tracking-[-1.9px] max-[620px]:text-[34px]">
          We&apos;re here to help.
        </h1>
        <p className="text-[14px] leading-[1.65] text-[#58677b] min-[901px]:text-[18px] min-[901px]:leading-[1.7] max-[620px]:text-[15px]">
          Have a question, suggestion, or need support?
          <br />
          Reach out to us and we&apos;ll get back to you as soon as possible.
        </p>
      </section>
      <section className="mx-auto grid max-w-[1330px] grid-cols-[1.7fr_1fr] gap-6 max-[900px]:grid-cols-1 max-[900px]:px-[30px] max-[620px]:px-4">
        <ContactForm />
        <aside className="rounded-[13px] border border-[#dfe9e6] bg-white/80 px-[34px] py-[35px] shadow-[0_7px_28px_#153c3010] max-[620px]:px-5 max-[620px]:py-7">
          <h2 className="mb-[34px] text-[16px] max-[620px]:text-[17px]">
            Other ways to reach us
          </h2>
          <div className="grid gap-[17px]">
            {reach.map((item) => (
              <article
                className="grid min-h-[84px] grid-cols-[50px_1fr] items-center gap-4 rounded-[11px] border border-[#e5ecea] p-[15px] shadow-[0_6px_20px_#153c300d]"
                key={item.title}
              >
                <span className="grid h-[45px] w-[45px] place-items-center rounded-xl bg-[#edf9f5] text-[19px] text-[#009268]">
                  {item.icon}
                </span>
                <div>
                  <h3 className="mb-[7px] text-[12px] max-[620px]:text-[17px]">
                    {item.title}
                  </h3>
                  {item.lines.map((line) => (
                    <p
                      className="m-0 text-[10px] leading-[1.55] text-[#657386] min-[901px]:text-[14px] min-[901px]:leading-[1.65] max-[620px]:text-[15px] max-[620px]:leading-[1.65]"
                      key={line}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>
      <section className="mx-auto mt-6 flex min-h-[100px] max-w-[1330px] items-center justify-between rounded-[13px] border border-[#dfe9e6] bg-white/80 px-9 py-6 shadow-[0_7px_28px_#153c3010] max-[900px]:mx-[30px] max-[620px]:mx-4 max-[620px]:flex-col max-[620px]:items-start max-[620px]:gap-[18px]">
        <div>
          <h2 className="mb-[9px] text-[16px] max-[620px]:text-[17px]">
            Looking for quick answers?
          </h2>
          <p className="m-0 text-[11px] text-[#667487] min-[901px]:text-[15px] min-[901px]:leading-[1.65] max-[620px]:text-[15px] max-[620px]:leading-[1.65]">
            Visit our FAQs for articles on managing bills, payments, rewards and
            more.
          </p>
        </div>
        <Link className={outlineButton} href="/help">
          Go to FAQs <Icon name="arrow" />
        </Link>
      </section>
      <section className="mx-auto mt-6 mb-8 grid min-h-[122px] max-w-[1330px] grid-cols-3 gap-[30px] rounded-[13px] border border-[#dfe9e6] bg-white/80 px-8 py-6 shadow-[0_7px_28px_#153c3010] max-[900px]:mx-[30px] max-[620px]:mx-4 max-[620px]:grid-cols-1">
        {(
          [
            [
              "clock" as const,
              "Response time",
              "We aim to respond to all",
              "inquiries within 24 hours.",
            ],
            [
              "shield" as const,
              "Secure & private",
              "Your information is safe with us.",
              "We never share your data.",
            ],
            [
              "support" as const,
              "Here to help",
              "Our support team is friendly",
              "and ready to assist.",
            ],
          ] as const
        ).map(([icon, title, line1, line2], index) => (
          <article
            className={`grid grid-cols-[56px_1fr] items-center gap-3.5 pr-[25px] ${
              index === 2 ? "border-0" : "border-r border-[#dfe9e6]"
            } max-[620px]:border-r-0 max-[620px]:border-b max-[620px]:pb-5 max-[620px]:last:border-0`}
            key={title}
          >
            <span className="grid h-[50px] w-[50px] place-items-center rounded-full bg-[#edf9f5] text-[#009268] [&_svg]:w-7">
              <Icon name={icon} />
            </span>
            <div>
              <h3 className="mb-2 text-[12px] max-[620px]:text-[17px]">
                {title}
              </h3>
              <p className="m-0 text-[10px] leading-[1.55] text-[#657386] min-[901px]:text-[14px] min-[901px]:leading-[1.65] max-[620px]:text-[15px] max-[620px]:leading-[1.65]">
                {line1}
                <br />
                {line2}
              </p>
            </div>
          </article>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
