"use client"

import { Flame, Sun, Zap, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Content from API: faseInicial
const faseInicialContent = {
  title: "Fase Inicial — O Despertar",
  subtitle: "Limpeza Externa e Reativação Solar",
  limpezaExterna: {
    title: "Trabalhos de Limpeza Externa",
    content: "Os trabalhos de limpeza externa são rituais sagrados que utilizam elementos naturais — fogo, água, terra, ar e éter — para purificar o campo áurico e remover energias densas acumuladas ao longo da vida.",
  },
  ciclosLimpeza: {
    title: "Ciclos de Limpeza Energética",
    items: [
      "Cada ciclo trabalha uma camada específica do campo energético",
      "Os ciclos são progressivos e cumulativos em seus efeitos",
      "O praticante recebe orientação contínua durante todo o processo",
      "A frequência dos ciclos é adaptada às necessidades individuais",
    ],
  },
  reativacaoSolar: {
    title: "Reativação do Fluxo de Forças Solares",
    content: "Através de práticas específicas, o praticante aprende a canalizar e trabalhar com as forças solares — a energia primordial de vida e consciência que anima toda a existência.",
    items: [
      "Técnicas de respiração solar",
      "Meditações de conexão com o Sol Central",
      "Práticas de absorção e distribuição de prana",
    ],
  },
}

export function FaseInicial() {
  return (
    <section className="relative py-20 sm:py-28 bg-[var(--ivory)] sacred-pattern">
      <div className="container px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--fire-red)]/10 text-[var(--fire-red)] text-sm font-medium mb-6">
            <Flame className="w-4 h-4" />
            <span>Primeira Fase</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[var(--text-dark)] mb-4">
            {faseInicialContent.title}
          </h2>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            {faseInicialContent.subtitle}
          </p>
        </div>
        
        {/* Content cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Limpeza Externa */}
          <Card className="bg-[var(--cream)] border-[var(--sand)] hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-[var(--fire-red)]/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-[var(--fire-red)]" />
              </div>
              <CardTitle className="font-serif text-xl text-[var(--text-dark)]">
                {faseInicialContent.limpezaExterna.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--text-muted)] leading-relaxed">
                {faseInicialContent.limpezaExterna.content}
              </p>
            </CardContent>
          </Card>
          
          {/* Ciclos de Limpeza */}
          <Card className="bg-[var(--cream)] border-[var(--sand)] hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-[var(--gold)]" />
              </div>
              <CardTitle className="font-serif text-xl text-[var(--text-dark)]">
                {faseInicialContent.ciclosLimpeza.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {faseInicialContent.ciclosLimpeza.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-[var(--text-muted)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Reativação Solar */}
          <Card className="bg-[var(--cream)] border-[var(--sand)] hover:shadow-lg transition-shadow duration-300 md:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center mb-4">
                <Sun className="w-6 h-6 text-[var(--gold)]" />
              </div>
              <CardTitle className="font-serif text-xl text-[var(--text-dark)]">
                {faseInicialContent.reativacaoSolar.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                {faseInicialContent.reativacaoSolar.content}
              </p>
              <ul className="space-y-2">
                {faseInicialContent.reativacaoSolar.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-[var(--text-muted)]">
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
