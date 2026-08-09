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

export function LegalPage({ policy }: { policy: LegalPolicy }) {
  const PolicyIcon = policy.icon;

  return (
    <main className="inner-page legal-page">
      <Header />

      <section className="legal-hero">
        <div className="legal-hero-inner">
          <div className="legal-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Legal</span>
          </div>
          <div className="legal-heading">
            <span className="legal-heading-icon" aria-hidden="true">
              <PolicyIcon />
            </span>
            <div>
              <p className="inner-eyebrow">{policy.eyebrow}</p>
              <h1>{policy.title}</h1>
              <p>{policy.description}</p>
            </div>
          </div>
          <div className="legal-effective">
            <span>Effective date</span>
            <strong>{policy.effectiveDate}</strong>
          </div>
        </div>
      </section>

      <div className="legal-layout">
        <aside className="legal-sidebar">
          <nav aria-label="Legal policies">
            <p>Legal documents</p>
            {legalPolicies.map((item) => (
              <Link
                className={item.slug === policy.slug ? "active" : undefined}
                href={`/${item.slug}`}
                key={item.slug}
                aria-current={item.slug === policy.slug ? "page" : undefined}
              >
                {item.shortTitle}
              </Link>
            ))}
          </nav>
          <div className="legal-help-card">
            <HelpCircle aria-hidden="true" />
            <strong>Have a question?</strong>
            <p>We’re here to help you understand our policies.</p>
            <Link href="/contact">Contact support</Link>
          </div>
        </aside>

        <article className="legal-document">
          <div className="legal-document-topline">
            <span>{policy.sections.length} sections</span>
            <span>Last updated {policy.effectiveDate}</span>
          </div>

          {policy.notice ? (
            <div className="legal-notice">
              <PolicyIcon aria-hidden="true" />
              <div>
                <strong>{policy.notice.title}</strong>
                <p>{policy.notice.text}</p>
              </div>
            </div>
          ) : null}

          <div className="legal-sections">
            {policy.sections.map((section, index) => {
              const SectionIcon = section.icon;
              return (
                <section id={sectionId(section.title)} key={section.title}>
                  <div className="legal-section-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="legal-section-content">
                    <h2>
                      {SectionIcon ? <SectionIcon aria-hidden="true" /> : null}
                      {section.title}
                    </h2>
                    {typeof section.content === "string" ? (
                      <p><RichText text={section.content} /></p>
                    ) : isDetailedItems(section.content) ? (
                      <div className="legal-detail-list">
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
                      <ul>
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

          <div className="legal-document-footer">
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
