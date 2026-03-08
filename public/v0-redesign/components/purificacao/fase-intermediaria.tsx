"use client"

import { Leaf, Eye, Heart, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Content from API: faseIntermediaria
const faseIntermediariaContent = {
  title: "Fase Intermediária — A Transformação",
  subtitle: "Limpeza Interna e Reconhecimento",
  limpezaInterna: {
    title: "Trabalhos de Limpeza Interna",
    content: "A limpeza interna vai além do campo áurico, trabalhando diretamente com os padrões mentais, emocionais e kármicos que limitam a expressão plena do ser.",
    items: [
      "Liberação de memórias traumáticas armazenadas no corpo",
      "Dissolução de padrões de pensamento limitantes",
      "Harmonização das emoções e sentimentos",
    ],
  },
  ciclosReconhecimento: {
    title: "Ciclos de Reconhecimento",
    content: "Os ciclos de reconhecimento são processos profundos de autoconhecimento onde o praticante é guiado a reconhecer e integrar aspectos de sua personalidade e história de vida.",
  },
  liberacaoPadroes: {
    title: "Liberação de Padrões Repetitivos",
    content: "Através de técnicas específicas, o praticante aprende a identificar e liberar padrões repetitivos que se manifestam em diferentes áreas da vida.",
    items: [
      "Padrões de relacionamento",
      "Padrões de saúde",
      "Padrões financeiros",
      "Padrões de autossabotagem",
    ],
  },
}

export function FaseIntermediaria() {
  return (
    <section className="relative py-20 sm:py-28 navy-section">
      <div className="container px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--sage)]/20 text-[var(--sage-light)] text-sm font-medium mb-6">
            <Leaf className="w-4 h-4" />
            <span>Segunda Fase</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[var(--text-on-dark)] mb-4">
            {faseIntermediariaContent.title}
          </h2>
          <p className="text-lg text-[var(--text-on-dark)]/70 max-w-2xl mx-auto">
            {faseIntermediariaContent.subtitle}
          </p>
        </div>
        
        {/* Content cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Limpeza Interna */}
          <Card className="glass-card-dark border-[var(--gold)]/20 hover:border-[var(--gold)]/40 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-[var(--sage)]/20 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-[var(--sage-light)]" />
              </div>
              <CardTitle className="font-serif text-xl text-[var(--text-on-dark)]">
                {faseIntermediariaContent.limpezaInterna.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--text-on-dark)]/70 leading-relaxed mb-4">
                {faseIntermediariaContent.limpezaInterna.content}
              </p>
              <ul className="space-y-2">
                {faseIntermediariaContent.limpezaInterna.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-[var(--text-on-dark)]/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--sage-light)] mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Ciclos de Reconhecimento */}
          <Card className="glass-card-dark border-[var(--gold)]/20 hover:border-[var(--gold)]/40 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-[var(--gold)]" />
              </div>
              <CardTitle className="font-serif text-xl text-[var(--text-on-dark)]">
                {faseIntermediariaContent.ciclosReconhecimento.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--text-on-dark)]/70 leading-relaxed">
                {faseIntermediariaContent.ciclosReconhecimento.content}
              </p>
            </CardContent>
          </Card>
          
          {/* Liberação de Padrões */}
          <Card className="glass-card-dark border-[var(--gold)]/20 hover:border-[var(--gold)]/40 transition-all duration-300 md:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center mb-4">
                <RefreshCw className="w-6 h-6 text-[var(--gold)]" />
              </div>
              <CardTitle className="font-serif text-xl text-[var(--text-on-dark)]">
                {faseIntermediariaContent.liberacaoPadroes.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--text-on-dark)]/70 leading-relaxed mb-4">
                {faseIntermediariaContent.liberacaoPadroes.content}
              </p>
              <ul className="space-y-2">
                {faseIntermediariaContent.liberacaoPadroes.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-[var(--text-on-dark)]/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
