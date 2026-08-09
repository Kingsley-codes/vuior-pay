import type { Metadata } from "next";
import { getLegalPolicy, LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service | Vuior",
  description: "Read the terms that govern your access to and use of Vuior.",
};

export default function TermsOfServicePage() {
  return <LegalPage policy={getLegalPolicy("terms-of-service")} />;
}
