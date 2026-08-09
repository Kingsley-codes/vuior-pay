import type { Metadata } from "next";
import { getLegalPolicy, LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Data Protection Policy | Vuior",
  description: "Learn about Vuior's principles and safeguards for personal data.",
};

export default function DataProtectionPolicyPage() {
  return <LegalPage policy={getLegalPolicy("data-protection-policy")} />;
}
