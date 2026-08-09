import type { Metadata } from "next";
import { getLegalPolicy, LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Cookies Policy | Vuior",
  description: "Understand how Vuior uses cookies and similar technologies.",
};

export default function CookiesPolicyPage() {
  return <LegalPage policy={getLegalPolicy("cookies-policy")} />;
}
