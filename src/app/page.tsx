import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Eligibility from "@/components/landing/Eligibility";
import CompensationTable from "@/components/landing/CompensationTable";
import SocialProof from "@/components/landing/SocialProof";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import StickyCTA from "@/components/landing/StickyCTA";
import CookieConsent from "@/components/CookieConsent";
import PrefetchCheck from "@/components/landing/PrefetchCheck";

export default function Home() {
  return (
    <main>
      <PrefetchCheck />
      <Hero />
      <HowItWorks />
      <Eligibility />
      <CompensationTable />
      <SocialProof />
      <FAQ />
      <FinalCTA />
      <Footer />
      <StickyCTA />
      <CookieConsent />
    </main>
  );
}
