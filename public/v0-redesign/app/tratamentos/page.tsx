import { Navigation } from "@/components/navigation"
import { FooterSection } from "@/components/footer-section"
import { TratamentosHero } from "@/components/tratamentos/hero"
import { TratamentosIntro } from "@/components/tratamentos/intro"
import { TratamentosModalities } from "@/components/tratamentos/modalities"
import { TratamentosProtection } from "@/components/tratamentos/protection"
import { TratamentosCTA } from "@/components/tratamentos/cta"

export default function TratamentosPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <TratamentosHero />
      <TratamentosIntro />
      <TratamentosModalities />
      <TratamentosProtection />
      <TratamentosCTA />
      <FooterSection />
    </main>
  )
}
