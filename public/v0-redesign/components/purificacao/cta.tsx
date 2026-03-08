"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PurificacaoCTA() {
  return (
    <section className="relative py-20 sm:py-28 navy-section">
      <div className="container px-4 sm:px-6 text-center">
        {/* Decorative line */}
        <div className="section-divider max-w-xs mx-auto mb-12" />
        
        <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text-on-dark)] mb-6">
          Pronto para Iniciar sua Jornada?
        </h2>
        
        <p className="text-lg text-[var(--text-on-dark)]/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          Entre em contato conosco para saber mais sobre o Trabalho de Purificação e Ascensão 
          e como iniciar seu caminho de transformação.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            asChild
            size="lg"
            className="group relative overflow-hidden bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[var(--navy-deep)] font-medium px-8 py-6 text-base transition-all duration-500 hover:shadow-[0_0_30px_rgba(196,148,59,0.5)]"
          >
            <Link href="/contato">
              <span className="relative z-10 flex items-center gap-2">
                Entrar em Contato
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 shimmer-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          </Button>
          
          <Button 
            asChild
            size="lg"
            variant="outline"
            className="border-[var(--gold)]/40 text-[var(--text-on-dark)] hover:bg-[var(--gold)]/10 hover:border-[var(--gold)] px-8 py-6 text-base transition-all duration-300"
          >
            <Link href="/testemunhos">
              Ver Testemunhos
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
