import { HeroSection } from "@/components/hero-section"
import { ChallengesSection } from "@/components/challenges-section"
import { JourneySection } from "@/components/journey-section"
import { BenefitsSection } from "@/components/benefits-section"
import { TestimonialBanner } from "@/components/testimonial-banner"
import { FooterSection } from "@/components/footer-section"
import { Navigation } from "@/components/navigation"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ChallengesSection />
      <JourneySection />
      <BenefitsSection />
      <TestimonialBanner />
      <FooterSection />
    </main>
  )
}
