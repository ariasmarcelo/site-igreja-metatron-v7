import { Navigation } from "@/components/navigation"
import { FooterSection } from "@/components/footer-section"
import { PurificacaoHero } from "@/components/purificacao/hero"
import { FaseInicial } from "@/components/purificacao/fase-inicial"
import { FaseIntermediaria } from "@/components/purificacao/fase-intermediaria"
import { FaseFinal } from "@/components/purificacao/fase-final"
import { PurificacaoCTA } from "@/components/purificacao/cta"

export default function PurificacaoPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <PurificacaoHero />
      <FaseInicial />
      <FaseIntermediaria />
      <FaseFinal />
      <PurificacaoCTA />
      <FooterSection />
    </main>
  )
}
