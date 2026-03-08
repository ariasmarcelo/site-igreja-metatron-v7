"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Sparkles, Heart } from "lucide-react"

// Journey data using content from API: purification.phases
const journeys = [
  {
    badge: "Igreja de Metatron",
    icon: Sparkles,
    title: "Trabalho de Purificação e Ascensão", // from API: purification.title
    subtitle: "Caminho Espiritual",
    description: "Um processo sagrado de 3 fases que purifica corpo, mente e alma através de rituais ancestrais combinados com acompanhamento terapêutico.",
    features: [
      // from API: purification.phases[0] - Fase Inicial
      "Fase Inicial: Trabalhos de limpeza externa, Ciclos de Limpeza Energética, Reativação do Fluxo de Forças Solares",
      // from API: purification.phases[1] - Fase Intermediária  
      "Fase Intermediária: Trabalhos de Limpeza Interna, Ciclos de Reconhecimento, Liberação de padrões repetitivos",
      // from API: purification.phases[2] - Fase Final
      "Fase Final: Realização Antahkarana, Recebimento do Eu Superior (Iniciação)",
    ],
    ctaText: "Purificação e Ascensão", // from API: __navigation__.purificacao
    ctaLink: "/purificacao",
    color: "gold",
    bgGradient: "from-[var(--navy-deep)] to-[var(--navy)]",
  },
  {
    badge: "Instituto de Metatron",
    icon: Heart,
    title: "Tratamentos Integrados", // from API: __navigation__.tratamentos
    subtitle: "Caminho Terapêutico",
    description: "Abordagem clínica profissional com múltiplas modalidades terapêuticas, sempre integrada à dimensão espiritual do ser.",
    features: [
      "Psicoterapia integrativa e neurofeedback",
      "Respiração holotrópica e EMDR",
      "Massagem biodinâmica e terapia corporal",
    ],
    ctaText: "Tratamentos Integrados", // from API: __navigation__.tratamentos
    ctaLink: "/tratamentos",
    color: "sage",
    bgGradient: "from-[var(--sage)] to-[var(--sage-light)]",
  },
]

export function JourneySection() {
  return (
    <section className="relative py-24 md:py-32 bg-[var(--sand)]">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="inline-block text-sm tracking-[0.2em] text-[var(--gold)] uppercase mb-4">
            Escolha Seu Caminho
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[var(--text-dark)] mb-6 text-balance">
            Dois caminhos para transformação
          </h2>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            Seja através da jornada espiritual ou do caminho clínico, nosso objetivo é sua cura integral
          </p>
        </div>

        {/* Journey cards */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
          {journeys.map((journey, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden border-0 bg-[var(--cream)] shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Top gradient bar */}
              <div 
                className={`h-2 bg-gradient-to-r ${
                  journey.color === "gold" 
                    ? "from-[var(--gold)] via-[var(--gold-light)] to-[var(--gold)]" 
                    : "from-[var(--sage)] via-[var(--sage-light)] to-[var(--sage)]"
                }`} 
              />
              
              <CardContent className="p-8 md:p-10">
                {/* Badge */}
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className={`p-2 rounded-full ${
                      journey.color === "gold" 
                        ? "bg-[var(--gold)]/10 text-[var(--gold)]" 
                        : "bg-[var(--sage)]/10 text-[var(--sage)]"
                    }`}
                  >
                    <journey.icon className="w-5 h-5" />
                  </div>
                  <span 
                    className={`text-xs tracking-[0.15em] uppercase font-medium ${
                      journey.color === "gold" ? "text-[var(--gold)]" : "text-[var(--sage)]"
                    }`}
                  >
                    {journey.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-2xl md:text-3xl text-[var(--text-dark)] mb-2">
                  {journey.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">{journey.subtitle}</p>
                
                {/* Description */}
                <p className="text-[var(--text-muted)] mb-8 leading-relaxed">
                  {journey.description}
                </p>
                
                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {journey.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div 
                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                          journey.color === "gold" 
                            ? "bg-[var(--gold)]/15 text-[var(--gold)]" 
                            : "bg-[var(--sage)]/15 text-[var(--sage)]"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-[var(--text-dark)]/80 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA */}
                <Button 
                  asChild
                  className={`group/btn w-full sm:w-auto ${
                    journey.color === "gold"
                      ? "bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[var(--navy-deep)]"
                      : "bg-[var(--sage)] hover:bg-[var(--sage-light)] text-white"
                  } transition-all duration-300`}
                >
                  <Link href={journey.ctaLink} className="flex items-center gap-2">
                    {journey.ctaText}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
