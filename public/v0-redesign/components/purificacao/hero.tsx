"use client"

import { Sparkles } from "lucide-react"

export function PurificacaoHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden navy-section pt-24">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--gold)]/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative z-10 px-4 sm:px-6 py-16 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--gold)]/10 mb-8">
          <Sparkles className="w-10 h-10 text-[var(--gold)]" />
        </div>
        
        {/* Title - from API: hero.title */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-wider text-[var(--text-on-dark)] mb-6">
          <span className="text-gold-gradient">Trabalho de Purificação e Ascensão</span>
        </h1>
        
        {/* Subtitle - from API: hero.subtitle */}
        <p className="text-lg sm:text-xl text-[var(--text-on-dark)]/80 max-w-3xl mx-auto mb-8 leading-relaxed">
          Reconectando-se com seu Eu Superior através do caminho sagrado de purificação
        </p>
        
        {/* Intro - from API: intro.content */}
        <div className="max-w-4xl mx-auto">
          <p className="text-base sm:text-lg text-[var(--text-on-dark)]/70 leading-relaxed mb-6">
            O <strong className="text-[var(--gold)]">Trabalho de Purificação e Ascensão</strong> é o coração 
            espiritual da Igreja de Metatron. É um caminho sagrado de três fases que guia o praticante 
            através de um processo profundo de limpeza energética, reconhecimento interior e, 
            finalmente, a restauração do Antahkarana — a ponte de luz que conecta a 
            consciência humana ao Eu Superior.
          </p>
          <p className="text-base sm:text-lg text-[var(--text-on-dark)]/70 leading-relaxed">
            Cada fase é cuidadosamente estruturada para preparar o praticante para o próximo 
            nível de consciência, sempre respeitando o ritmo individual e os processos 
            naturais de transformação.
          </p>
        </div>
      </div>
    </section>
  )
}
