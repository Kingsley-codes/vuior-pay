import type { Metadata } from "next";
import { getLegalPolicy, LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Vuior",
  description: "Learn how Vuior collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return <LegalPage policy={getLegalPolicy("privacy-policy")} />;
}
