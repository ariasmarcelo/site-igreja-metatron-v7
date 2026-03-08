"use client"

import { Crown, Star, Sparkles, Sun } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Content from API: faseFinal
const faseFinalContent = {
  title: "Fase Final — O Resgate",
  subtitle: "Iniciação e Ativação Antahkarana",
  iniciacao: {
    title: "Iniciação Final — Ativação Antahkarana",
    content: "Requer a conclusão da Fase Intermediária. Aqui o associado está habilitado para sua Iniciação Final, momento em que o Antahkarana é restaurado permanentemente.",
  },
  evento: {
    title: "Evento Iniciático — Restauração Antahkarana",
    content: [
      "Este é o Evento Iniciático que finaliza o percurso do associado como praticante nesta instituição, tornando-o Iniciado.",
      "A Iniciação representa o momento sagrado em que o véu entre o eu humano e o Eu Superior se dissolve completamente, permitindo uma conexão lúcida e permanente.",
    ],
  },
  posIniciacao: {
    title: "Após a Iniciação — Vivendo Antahkarana Ativo",
    items: [
      "Clareza absoluta sobre Propósito e Missão através da encarnação direta do Eu Superior",
      "Capacidade de servir como canal para a Hierarquia Celestial, transmitindo luz e sabedoria",
      "Acesso a níveis mais profundos de consciência e conhecimento esotérico",
      "Responsabilidade sagrada de auxiliar outros em seu caminho de evolução",
    ],
  },
}

export function FaseFinal() {
  return (
    <section className="relative py-20 sm:py-28 bg-[var(--ivory)] sacred-pattern">
      <div className="container px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-sm font-medium mb-6">
            <Crown className="w-4 h-4" />
            <span>Terceira Fase</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[var(--text-dark)] mb-4">
            {faseFinalContent.title}
          </h2>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            {faseFinalContent.subtitle}
          </p>
        </div>
        
        {/* Content cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Iniciação */}
          <Card className="bg-gradient-to-br from-[var(--navy-deep)] to-[var(--navy)] border-[var(--gold)]/30 text-[var(--text-on-dark)] hover:shadow-xl hover:shadow-[var(--gold)]/10 transition-all duration-300">
            <CardHeader>
              <div className="w-14 h-14 rounded-full bg-[var(--gold)]/20 flex items-center justify-center mb-4 glow-gold-soft">
                <Star className="w-7 h-7 text-[var(--gold)]" />
              </div>
              <CardTitle className="font-serif text-2xl text-[var(--gold)]">
                {faseFinalContent.iniciacao.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--text-on-dark)]/80 leading-relaxed text-lg">
                {faseFinalContent.iniciacao.content}
              </p>
            </CardContent>
          </Card>
          
          {/* Evento Iniciático */}
          <Card className="bg-gradient-to-br from-[var(--navy-deep)] to-[var(--navy)] border-[var(--gold)]/30 text-[var(--text-on-dark)] hover:shadow-xl hover:shadow-[var(--gold)]/10 transition-all duration-300">
            <CardHeader>
              <div className="w-14 h-14 rounded-full bg-[var(--gold)]/20 flex items-center justify-center mb-4 glow-gold-soft">
                <Sparkles className="w-7 h-7 text-[var(--gold)]" />
              </div>
              <CardTitle className="font-serif text-2xl text-[var(--gold)]">
                {faseFinalContent.evento.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faseFinalContent.evento.content.map((paragraph, index) => (
                <p key={index} className="text-[var(--text-on-dark)]/80 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </CardContent>
          </Card>
          
          {/* Pós-Iniciação - Full width */}
          <Card className="md:col-span-2 bg-[var(--cream)] border-[var(--gold)]/20 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--gold)]/10 flex items-center justify-center mb-4 mx-auto">
                <Sun className="w-8 h-8 text-[var(--gold)]" />
              </div>
              <CardTitle className="font-serif text-2xl text-[var(--text-dark)]">
                {faseFinalContent.posIniciacao.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {faseFinalContent.posIniciacao.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-[var(--ivory)]">
                    <div className="w-8 h-8 rounded-full bg-[var(--gold)]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[var(--gold)] font-medium">{index + 1}</span>
                    </div>
                    <p className="text-[var(--text-muted)] leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
