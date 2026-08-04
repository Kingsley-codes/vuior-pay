import { Header } from "@/components/header";
import {
  DownloadSection,
  FaqSection,
  FeaturesSection,
  Footer,
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
      <Footer />
    </main>
  );
}
