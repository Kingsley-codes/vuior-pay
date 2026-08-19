import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Check,
  ClipboardList,
  Clock,
  Cookie,
  Download,
  FileCheck2,
  HelpCircle,
  Info,
  Minimize2,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";

type SectionItem = {
  title?: string;
  description: string;
  icon?: LucideIcon;
};

export type LegalSection = {
  title: string;
  content: string | string[] | SectionItem[];
  icon?: LucideIcon;
};

export type LegalPolicy = {
  slug: string;
  shortTitle: string;
  title: string;
  eyebrow: string;
  description: string;
  effectiveDate: string;
  icon: LucideIcon;
  notice?: {
    title: string;
    text: string;
  };
  sections: LegalSection[];
};

export const legalPolicies: LegalPolicy[] = [
  {
    slug: "privacy-policy",
    shortTitle: "Privacy Policy",
    title: "Privacy Policy",
    eyebrow: "PRIVACY AT VUIOR",
    description: "How we collect, use, share, and safeguard your information.",
    effectiveDate: "November 29, 2024",
    icon: ShieldCheck,
    sections: [
      {
        title: "Introduction",
        content:
          "Vuior, LLC ('Vuior', 'we', 'us', or 'our') is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you interact with our services, in compliance with applicable data protection laws, including the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), Children's Online Privacy Protection Act (COPPA), and other relevant laws.",
      },
      {
        title: "Information We Collect",
        content: [
          "Personal Information: Name, address, phone number, email address, and payment information.",
          "Non-Personal Information: Browser type, device ID, IP address, usage data, and cookies.",
          "Sensitive Data: Only if explicitly consented to, such as demographic details or financial data for specific services.",
        ],
      },
      {
        title: "How We Use Your Information",
        content: [
          "To provide and improve our services.",
          "For billing, account management, and customer support.",
          "To send updates, promotional content, and security alerts.",
          "To comply with legal obligations and enforce our Terms of Service.",
        ],
      },
      {
        title: "Your Rights",
        content: [
          "GDPR: Right to access, correct, delete, or restrict processing of your data.",
          "CCPA: Right to know what personal data is collected, delete it, or opt out of data sale.",
          "Children: We do not knowingly collect data from individuals under 13.",
        ],
      },
      {
        title: "Sharing Your Data",
        content:
          "We do not sell your data. Data may be shared with trusted third parties for payment processing, customer support tools, and legal compliance.",
      },
      {
        title: "Security Measures",
        content:
          "Vuior employs industry-standard measures, including encryption, secure servers, and routine security audits, to safeguard your data.",
      },
      {
        title: "Contact Information",
        content:
          "For inquiries about this Privacy Policy, contact us at support@vuio.com.",
      },
    ],
  },
  {
    slug: "terms-of-service",
    shortTitle: "Terms of Service",
    title: "Terms of Service",
    eyebrow: "USING VUIOR",
    description: "The terms that govern your access to and use of Vuior services.",
    effectiveDate: "November 29, 2024",
    icon: FileCheck2,
    notice: {
      title: "Please read these terms carefully",
      text: "By using Vuior services, you agree to these Terms of Service. If you do not agree, please do not use our services.",
    },
    sections: [
      {
        title: "Agreement Overview",
        content:
          "By accessing or using Vuior services, you agree to these Terms of Service. If you disagree with any part, discontinue use immediately.",
      },
      {
        title: "Eligibility",
        content:
          "You must be at least 18 years old or meet the age of majority in your jurisdiction.",
      },
      {
        title: "Services Provided",
        content:
          "Vuior offers bill management, financial tracking, and early payment savings systems through the Vuior platform.",
      },
      {
        title: "User Obligations",
        content: [
          "Provide accurate and up-to-date information.",
          "Maintain the confidentiality of your login credentials.",
          "Use the platform for lawful purposes only.",
        ],
      },
      {
        title: "Prohibited Activities",
        content: [
          "Resale or misuse of our services.",
          "Attempting to hack or disrupt our platform.",
          "Uploading malicious software.",
        ],
      },
      {
        title: "Termination",
        content:
          "Vuior reserves the right to suspend or terminate accounts for violations of these terms.",
      },
      {
        title: "Limitation of Liability",
        content:
          "Vuior is not liable for indirect damages, including data loss, service interruptions, or third-party misuse of your data.",
      },
      {
        title: "Contact Information",
        content: "Questions about this policy should be sent to support@vuio.com.",
      },
    ],
  },
  {
    slug: "cookies-policy",
    shortTitle: "Cookies Policy",
    title: "Cookies Policy",
    eyebrow: "YOUR BROWSING EXPERIENCE",
    description: "How cookies help us keep Vuior secure, useful, and relevant.",
    effectiveDate: "November 29, 2023",
    icon: Cookie,
    notice: {
      title: "Cookie usage",
      text: "We use cookies to enhance your browsing experience and provide personalized services. By continuing to use our site, you agree to our use of cookies.",
    },
    sections: [
      {
        title: "Introduction",
        icon: Info,
        content:
          "Vuior uses cookies and similar technologies to enhance user experience, analyze website traffic, and support marketing efforts.",
      },
      {
        title: "What Are Cookies?",
        icon: Cookie,
        content: "Cookies are small text files placed on your device to store data.",
      },
      {
        title: "Types of Cookies We Use",
        icon: Cookie,
        content: [
          {
            title: "Essential Cookies",
            description:
              "Necessary for core functionalities, such as user authentication.",
            icon: Zap,
          },
          {
            title: "Performance Cookies",
            description:
              "Track how you interact with the platform to improve user experience.",
            icon: Settings2,
          },
          {
            title: "Targeting Cookies",
            description: "Used for personalized advertising.",
            icon: Target,
          },
        ],
      },
      {
        title: "Managing Cookies",
        icon: Settings2,
        content:
          "You can control or disable cookies via browser settings. However, doing so may affect service functionality.",
      },
      {
        title: "Third-Party Cookies",
        icon: Target,
        content:
          "Vuior may allow trusted partners to use cookies for analytics and targeted advertising.",
      },
      {
        title: "Contact Information",
        icon: HelpCircle,
        content: "For inquiries about cookies, email us at support@vuio.com.",
      },
    ],
  },
  {
    slug: "data-protection-policy",
    shortTitle: "Data Protection",
    title: "Data Protection Policy",
    eyebrow: "OUR DATA COMMITMENT",
    description: "The principles and safeguards we use to protect personal data.",
    effectiveDate: "June 1, 2023",
    icon: ShieldCheck,
    notice: {
      title: "Data protection",
      text: "Vuior is committed to protecting your personal data in compliance with GDPR, CCPA, and other applicable data privacy laws.",
    },
    sections: [
      {
        title: "Objective",
        icon: ShieldCheck,
        content:
          "This Data Protection Policy outlines how Vuior complies with GDPR, CCPA, and other data privacy laws to protect user information.",
      },
      {
        title: "Principles",
        icon: Sparkles,
        content: [
          {
            title: "Lawfulness, Fairness, Transparency",
            description: "Data is collected and processed lawfully and transparently.",
            icon: Check,
          },
          {
            title: "Data Minimization",
            description: "Only data necessary for specific purposes is collected.",
            icon: Minimize2,
          },
          {
            title: "Accuracy",
            description: "Data is accurate and up to date.",
            icon: RefreshCw,
          },
          {
            title: "Accountability",
            description:
              "Vuior is responsible for demonstrating compliance with data protection laws.",
            icon: ClipboardList,
          },
        ],
      },
      {
        title: "Roles and Responsibilities",
        icon: Users,
        content: [
          {
            title: "Data Controller",
            description:
              "Vuior is responsible for deciding how and why data is processed.",
            icon: Users,
          },
          {
            title: "Data Processor",
            description:
              "Third-party vendors processing data on behalf of Vuior comply with our policies.",
            icon: Users,
          },
        ],
      },
      {
        title: "User Data Rights",
        icon: ClipboardList,
        content: [
          {
            title: "Access and Rectification",
            description: "Users can view and correct personal data.",
            icon: Check,
          },
          {
            title: "Portability",
            description: "Users can request data in a portable format.",
            icon: Download,
          },
          {
            title: "Erasure (Right to Be Forgotten)",
            description: "Users can request deletion of data.",
            icon: Trash2,
          },
        ],
      },
      {
        title: "Data Retention",
        icon: Clock,
        content:
          "Data is retained only as long as necessary for business purposes or legal compliance.",
      },
      {
        title: "Data Breaches",
        icon: AlertTriangle,
        content: [
          "All breaches are reported to the relevant authorities within 72 hours if required by law.",
          "Affected users are notified promptly.",
        ],
      },
      {
        title: "Contact Information",
        icon: HelpCircle,
        content:
          "Questions about data protection should be directed to support@vuio.com.",
      },
    ],
  },
];

export function getLegalPolicy(slug: string) {
  const policy = legalPolicies.find((item) => item.slug === slug);

  if (!policy) {
    throw new Error(`Unknown legal policy: ${slug}`);
  }

  return policy;
}

function sectionId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function RichText({ text }: { text: string }) {
  const email = "support@vuio.com";
  const parts = text.split(email);

  if (parts.length === 1) return text;

  return (
    <>
      {parts[0]}
      <a href={`mailto:${email}`}>{email}</a>
      {parts.slice(1).join(email)}
    </>
  );
}

function isDetailedItems(content: LegalSection["content"]): content is SectionItem[] {
  return Array.isArray(content) && content.length > 0 && typeof content[0] === "object";
}

const innerEyebrow =
  "mb-[18px] text-[11px] font-extrabold text-[#00895f] max-[620px]:text-[12px]";
const legalLink =
  "relative flex min-h-[42px] items-center px-[18px] text-[12px] font-[650] text-[#64736f] transition before:absolute before:left-0 before:h-[22px] before:w-[3px] before:rounded-r-[3px] before:bg-transparent before:content-[''] hover:bg-[#f7fbf9] hover:text-[#008d63] max-[900px]:min-h-9 max-[900px]:min-w-max max-[900px]:rounded-[7px] max-[900px]:px-[13px] max-[900px]:before:hidden max-[620px]:text-[14px]";
const activeLegalLink = "bg-[#eef9f5] text-[#007e59] before:bg-[#00a475]";
const legalDocument =
  "overflow-hidden rounded-2xl border border-[#e0e9e6] bg-white shadow-[0_14px_45px_rgba(26,66,53,0.045)] max-[620px]:rounded-xl";
const legalTopline =
  "flex min-h-[51px] items-center justify-between border-b border-[#e8eeec] bg-[#fcfdfd] px-[30px] text-[10px] font-[650] text-[#86928e] max-[620px]:px-5 max-[620px]:text-[12px]";
const legalNotice =
  "mx-[30px] mt-7 mb-1 flex gap-3.5 rounded-[10px] border border-[#cde9df] bg-[#f0faf6] px-5 py-[18px] text-[#235449] max-[620px]:mx-5 [&_svg]:w-5 [&_svg]:shrink-0 [&_svg]:text-[#009268] [&_strong]:text-[12px] [&_strong]:capitalize max-[620px]:[&_strong]:text-[14px] [&_p]:mt-[5px] [&_p]:mb-0 [&_p]:text-[11px] [&_p]:leading-[1.6] [&_p]:text-[#5e756f] max-[620px]:[&_p]:text-[14px]";
const legalSections = "px-[30px] pt-2 pb-3 max-[620px]:px-5";
const legalSection =
  "grid grid-cols-[42px_minmax(0,1fr)] gap-3.5 border-b border-[#e9efed] py-[29px] scroll-mt-6 last:border-b-0 max-[620px]:grid-cols-1 max-[620px]:gap-[9px]";
const legalSectionNumber =
  "grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-[#edf8f4] text-[10px] font-extrabold text-[#008a61] max-[620px]:block max-[620px]:h-auto max-[620px]:w-auto max-[620px]:bg-transparent max-[620px]:text-[12px]";
const legalSectionHeading =
  "mb-[9px] flex min-h-[34px] items-center gap-[9px] text-[16px] tracking-[-0.015em] text-[#14263f] max-[620px]:text-[20px] [&_svg]:w-[17px] [&_svg]:text-[#009268]";
const legalBodyText =
  "m-0 text-[13px] leading-[1.8] text-[#61716f] max-[620px]:text-[16px] max-[620px]:leading-[1.7] [&_a]:font-bold [&_a]:text-[#008c63] hover:[&_a]:underline";
const legalList =
  "m-0 pl-[18px] text-[13px] leading-[1.8] text-[#61716f] marker:text-[#25b17d] max-[620px]:text-[16px] max-[620px]:leading-[1.7] [&_a]:font-bold [&_a]:text-[#008c63] hover:[&_a]:underline [&_li]:pl-1 [&_li+li]:mt-[7px]";
const legalDetailList =
  "grid gap-[9px] [&_>div]:grid [&_>div]:grid-cols-[29px_minmax(0,1fr)] [&_>div]:items-start [&_>div]:gap-2 [&_>div]:rounded-[9px] [&_>div]:border [&_>div]:border-[#e7eeeb] [&_>div]:bg-[#fcfdfd] [&_>div]:px-4 [&_>div]:py-3.5 [&_svg]:mt-px [&_svg]:w-4 [&_svg]:text-[#00a171] [&_h3]:mb-1 [&_h3]:mt-0 [&_h3]:text-[12px] [&_h3]:text-[#24394f] max-[620px]:[&_h3]:text-[14px] [&_p]:m-0 [&_p]:text-[11px] [&_p]:leading-[1.6] [&_p]:text-[#697875] max-[620px]:[&_p]:text-[14px]";
const legalDocumentFooter =
  "grid min-h-[88px] grid-cols-[auto_1fr_auto] items-center gap-3.5 bg-[#063f36] px-[30px] py-5 text-[#d9ede7] max-[620px]:grid-cols-[auto_1fr] max-[620px]:px-5 [&_svg]:w-[22px] [&_svg]:text-[#4bd1a1] [&_p]:m-0 [&_p]:max-w-[490px] [&_p]:text-[11px] [&_p]:leading-[1.55] max-[620px]:[&_p]:text-[14px] [&_a]:rounded-md [&_a]:border [&_a]:border-white/25 [&_a]:px-[13px] [&_a]:py-[9px] [&_a]:text-[10px] [&_a]:font-[750] [&_a]:text-white max-[620px]:[&_a]:col-start-2 max-[620px]:[&_a]:justify-self-start max-[620px]:[&_a]:text-[14px]";

export function LegalPage({ policy }: { policy: LegalPolicy }) {
  const PolicyIcon = policy.icon;

  return (
    <main className="min-h-screen bg-[#fbfdfc] text-[#07142d]">
      <Header />

      <section className="relative overflow-hidden border-y border-[#dfeae6] bg-[radial-gradient(circle_at_82%_24%,rgba(71,203,153,0.18),transparent_25%),linear-gradient(115deg,#f7fcfa_0%,#edf8f4_52%,#e5f5ef_100%)] after:absolute after:right-[-80px] after:bottom-[-210px] after:h-[440px] after:w-[440px] after:rounded-full after:border after:border-[rgba(0,146,104,0.11)] after:content-['']">
        <div className="relative z-[1] mx-auto min-h-[310px] max-w-[1160px] px-10 pt-[34px] pb-[46px] max-[900px]:px-[30px] max-[620px]:min-h-[340px] max-[620px]:px-5 max-[620px]:pt-[25px] max-[620px]:pb-[34px]">
          <div className="flex items-center gap-[9px] text-[11px] font-semibold text-[#74847f] max-[620px]:text-[12px]" aria-label="Breadcrumb">
            <Link className="hover:text-[#009268]" href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Legal</span>
          </div>
          <div className="mt-[38px] flex items-center gap-[25px] max-[620px]:mt-[27px] max-[620px]:items-start max-[620px]:gap-3.5">
            <span className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-[20px] border border-[#cfe8df] bg-white/80 text-[#008d63] shadow-[0_14px_35px_rgba(27,93,73,0.08)] max-[620px]:h-[50px] max-[620px]:w-[50px] max-[620px]:rounded-[14px] [&_svg]:h-[31px] [&_svg]:w-[31px] max-[620px]:[&_svg]:h-[23px] max-[620px]:[&_svg]:w-[23px]" aria-hidden="true">
              <PolicyIcon />
            </span>
            <div>
              <p className={`${innerEyebrow} mb-2.5 tracking-[0.15em]`}>{policy.eyebrow}</p>
              <h1 className="m-0 text-[clamp(36px,4vw,50px)] leading-[1.05] tracking-[-0.045em] max-[620px]:text-[34px]">{policy.title}</h1>
              <p className="mt-[15px] mb-0 text-[15px] leading-[1.6] text-[#5d6e78]">{policy.description}</p>
            </div>
          </div>
          <div className="absolute right-10 bottom-12 flex flex-col gap-[5px] border-l-2 border-[#56caa1] pl-[18px] max-[900px]:right-[30px] max-[620px]:static max-[620px]:mt-[27px] max-[620px]:ml-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#768781] max-[620px]:text-[12px]">Effective date</span>
            <strong className="text-[13px] text-[#193b34]">{policy.effectiveDate}</strong>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1160px] grid-cols-[230px_minmax(0,1fr)] items-start gap-[52px] px-10 pt-[54px] pb-[72px] max-[900px]:grid-cols-1 max-[900px]:gap-6 max-[900px]:px-[30px] max-[620px]:px-3.5 max-[620px]:pt-7 max-[620px]:pb-12">
        <aside className="sticky top-6 max-[900px]:static">
          <nav className="rounded-xl border border-[#e0e9e6] bg-white py-5 shadow-[0_8px_28px_rgba(25,55,47,0.035)] max-[900px]:flex max-[900px]:gap-1 max-[900px]:overflow-x-auto max-[900px]:p-2.5" aria-label="Legal policies">
            <p className="mx-[18px] mb-3 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#89958f] max-[900px]:hidden">Legal documents</p>
            {legalPolicies.map((item) => (
              <Link
                className={`${legalLink} ${item.slug === policy.slug ? activeLegalLink : ""}`}
                href={`/${item.slug}`}
                key={item.slug}
                aria-current={item.slug === policy.slug ? "page" : undefined}
              >
                {item.shortTitle}
              </Link>
            ))}
          </nav>
          <div className="mt-[18px] rounded-xl bg-linear-to-br from-[#064c40] to-[#003a32] p-5 text-white max-[900px]:hidden">
            <HelpCircle className="w-[21px] text-[#53d5a7]" aria-hidden="true" />
            <strong className="mt-3 block text-[13px]">Have a question?</strong>
            <p className="mt-[7px] mb-3.5 text-[11px] leading-[1.55] text-[#bad4cd]">We’re here to help you understand our policies.</p>
            <Link className="text-[11px] font-[750] text-[#66dbb3]" href="/contact">Contact support</Link>
          </div>
        </aside>

        <article className={legalDocument}>
          <div className={legalTopline}>
            <span>{policy.sections.length} sections</span>
            <span>Last updated {policy.effectiveDate}</span>
          </div>

          {policy.notice ? (
            <div className={legalNotice}>
              <PolicyIcon aria-hidden="true" />
              <div>
                <strong>{policy.notice.title}</strong>
                <p>{policy.notice.text}</p>
              </div>
            </div>
          ) : null}

          <div className={legalSections}>
            {policy.sections.map((section, index) => {
              const SectionIcon = section.icon;
              return (
                <section className={legalSection} id={sectionId(section.title)} key={section.title}>
                  <div className={legalSectionNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h2 className={legalSectionHeading}>
                      {SectionIcon ? <SectionIcon aria-hidden="true" /> : null}
                      {section.title}
                    </h2>
                    {typeof section.content === "string" ? (
                      <p className={legalBodyText}><RichText text={section.content} /></p>
                    ) : isDetailedItems(section.content) ? (
                      <div className={legalDetailList}>
                        {section.content.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <div key={item.title ?? item.description}>
                              {ItemIcon ? <ItemIcon aria-hidden="true" /> : null}
                              <div>
                                {item.title ? <h3>{item.title}</h3> : null}
                                <p>{item.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <ul className={legalList}>
                        {section.content.map((item) => (
                          <li key={item}><RichText text={item} /></li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              );
            })}
          </div>

          <div className={legalDocumentFooter}>
            <ShieldCheck aria-hidden="true" />
            <p>
              Your trust matters to us. If anything in this policy is unclear,
              our support team will be happy to help.
            </p>
            <Link href="/contact">Get in touch</Link>
          </div>
        </article>
      </div>

      <SiteFooter />
    </main>
  );
}
