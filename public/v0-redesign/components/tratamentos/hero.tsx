"use client"

import { motion } from "framer-motion"

// Content from API: tratamentos page
export function TratamentosHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden navy-section pt-24">
      {/* Background effects */}
      <div className="absolute inset-0 sacred-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--sage)]/10 blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <span className="inline-block text-sm tracking-[0.2em] text-[var(--sage-light)] uppercase mb-6">
            Instituto de Metatron
          </span>
          
          {/* Title - from API */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wider text-[var(--text-on-dark)] mb-6">
            <span className="block">Tratamentos</span>
            <span className="block text-[var(--sage-light)]">Integrados</span>
          </h1>
          
          {/* Subtitle - from API */}
          <p className="text-lg sm:text-xl text-[var(--text-on-dark)]/70 max-w-2xl mx-auto mb-8 leading-relaxed">
            Abordagens terapêuticas integradas e baseadas em evidências
          </p>
          
          {/* Legal notice - from API */}
          <div className="inline-block bg-[var(--navy)]/50 border border-[var(--sage)]/20 rounded-lg px-6 py-3">
            <p className="text-xs text-[var(--text-on-dark)]/50">
              <strong className="text-[var(--sage-light)]">Aviso Legal:</strong> Não substitui orientação médica. Descrições são resumos informativos.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
