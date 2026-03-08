"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Flame, Brain } from "lucide-react"

const challenges = [
  {
    icon: Flame,
    title: "Desafios Espirituais",
    description: "Sentimentos de vazio, desconexão com o sagrado, busca por significado mais profundo na vida, ou traumas espirituais não resolvidos.",
    color: "gold",
    items: [
      "Sensação de vazio existencial",
      "Desconexão com propósito de vida",
      "Traumas energéticos e espirituais",
      "Busca por transformação profunda",
    ]
  },
  {
    icon: Brain,
    title: "Desafios Emocionais",
    description: "Ansiedade, depressão, traumas, dependências, ou dificuldades emocionais que afetam sua qualidade de vida e relacionamentos.",
    color: "sage",
    items: [
      "Ansiedade e crises de pânico",
      "Depressão e desânimo crônico",
      "Traumas e bloqueios emocionais",
      "Dependências e comportamentos compulsivos",
    ]
  },
]

export function ChallengesSection() {
  return (
    <section className="relative py-24 md:py-32 bg-[var(--ivory)] sacred-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="inline-block text-sm tracking-[0.2em] text-[var(--gold)] uppercase mb-4">
            Reconhecemos Sua Jornada
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[var(--text-dark)] mb-6 text-balance">
            Você enfrenta algum desses desafios?
          </h2>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            Nossa abordagem única integra sabedoria ancestral e ciência moderna para oferecer cura genuína
          </p>
        </div>

        {/* Challenge cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {challenges.map((challenge, index) => (
            <Card 
              key={index}
              className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-[var(--cream)] ${
                challenge.color === "gold" 
                  ? "hover:shadow-[0_8px_30px_rgba(196,148,59,0.15)]" 
                  : "hover:shadow-[0_8px_30px_rgba(74,123,111,0.15)]"
              }`}
            >
              {/* Top accent line */}
              <div 
                className={`absolute top-0 left-0 right-0 h-1 ${
                  challenge.color === "gold" 
                    ? "bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" 
                    : "bg-gradient-to-r from-transparent via-[var(--sage)] to-transparent"
                }`} 
              />
              
              <CardContent className="p-8 md:p-10">
                {/* Icon */}
                <div 
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-6 ${
                    challenge.color === "gold" 
                      ? "bg-[var(--gold)]/10 text-[var(--gold)]" 
                      : "bg-[var(--sage)]/10 text-[var(--sage)]"
                  }`}
                >
                  <challenge.icon className="w-7 h-7" />
                </div>
                
                {/* Title */}
                <h3 className="font-serif text-2xl md:text-3xl text-[var(--text-dark)] mb-4">
                  {challenge.title}
                </h3>
                
                {/* Description */}
                <p className="text-[var(--text-muted)] mb-6 leading-relaxed">
                  {challenge.description}
                </p>
                
                {/* Items list */}
                <ul className="space-y-3">
                  {challenge.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <span 
                        className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 ${
                          challenge.color === "gold" ? "bg-[var(--gold)]" : "bg-[var(--sage)]"
                        }`} 
                      />
                      <span className="text-[var(--text-dark)]/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Connecting element */}
        <div className="flex justify-center mt-16">
          <div className="flex items-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--gold)]/50" />
            <span className="text-sm text-[var(--text-muted)] tracking-wide">Dois caminhos, uma solução integrada</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--gold)]/50" />
          </div>
        </div>
      </div>
    </section>
  )
}
