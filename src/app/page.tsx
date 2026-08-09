import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import {
  DownloadSection,
  FaqSection,
  FeaturesSection,
  FinalCtaSection,
  HeroSection,
  HowItWorks,
  Providers,
  RewardsSection,
  SecurityStrip,
} from "@/components/landing-sections";

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <Providers />
      <FeaturesSection />
      <RewardsSection />
      <HowItWorks />
      <DownloadSection />
      <SecurityStrip />
      <FaqSection />
      <FinalCtaSection />
      <SiteFooter />
    </main>
  );
}
