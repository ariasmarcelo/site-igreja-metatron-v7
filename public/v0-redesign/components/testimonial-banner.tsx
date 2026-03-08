"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Quote, ArrowRight } from "lucide-react"

export function TestimonialBanner() {
  return (
    <section className="relative py-20 md:py-28 bg-[var(--ivory)] overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[var(--gold)]/5 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[var(--sage)]/5 rounded-full blur-3xl translate-x-1/2" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section header - from API: testimonials.intro */}
        <span className="inline-block text-sm tracking-[0.2em] text-[var(--gold)] uppercase mb-4">
          Transforme Sua Vida
        </span>
        
        {/* Quote icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--gold)]/10 mb-8">
          <Quote className="w-8 h-8 text-[var(--gold)]" />
        </div>
        
        {/* Description - from API: testimonials.description */}
        <p className="font-serif text-xl sm:text-2xl md:text-3xl text-[var(--text-dark)] leading-relaxed mb-8 text-pretty">
          Ouça de pessoas que experimentaram cura profunda através da nossa abordagem integrada.
        </p>
        
        {/* CTA - using navigation label from API */}
        <Button 
          asChild
          variant="outline"
          className="group border-[var(--gold)]/30 text-[var(--text-dark)] hover:bg-[var(--gold)]/10 hover:border-[var(--gold)] transition-all duration-300"
        >
          <Link href="/testemunhos" className="flex items-center gap-2">
            Testemunhos
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
