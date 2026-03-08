"use client"

import { Shield, Compass, Sun } from "lucide-react"

const benefits = [
  {
    icon: Shield,
    title: "Tripla Proteção",
    description: "Nosso método único oferece proteção espiritual, terapêutica e médica em cada etapa do processo. Você nunca está sozinho.",
  },
  {
    icon: Compass,
    title: "Orientação Especializada",
    description: "Guias espirituais e profissionais de saúde mental trabalham em conjunto para assegurar sua jornada segura e transformadora.",
  },
  {
    icon: Sun,
    title: "Cura Integral",
    description: "Tratamos corpo, mente e espírito como uma unidade. Nossa abordagem holística promove transformação duradoura e profunda.",
  },
]

export function BenefitsSection() {
  return (
    <section className="relative py-24 md:py-32 navy-section overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[var(--gold)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[var(--gold)]/3 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="inline-block text-sm tracking-[0.2em] text-[var(--gold)] uppercase mb-4">
            Nossa Abordagem
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[var(--text-on-dark)] mb-6 text-balance">
            Como podemos ajudar você?
          </h2>
          <p className="text-lg text-[var(--text-on-dark)]/70 max-w-2xl mx-auto leading-relaxed">
            Três pilares fundamentais que sustentam nossa metodologia de cura
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group relative text-center"
            >
              {/* Icon container */}
              <div className="relative inline-flex mb-8">
                <div className="absolute inset-0 bg-[var(--gold)]/20 rounded-full blur-xl scale-150 group-hover:scale-175 transition-transform duration-500" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--gold-light)] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_30px_rgba(196,148,59,0.4)] transition-all duration-500">
                  <benefit.icon className="w-9 h-9 text-[var(--navy-deep)]" />
                </div>
              </div>
              
              {/* Content */}
              <h3 className="font-serif text-xl md:text-2xl text-[var(--text-on-dark)] mb-4">
                {benefit.title}
              </h3>
              <p className="text-[var(--text-on-dark)]/70 leading-relaxed max-w-sm mx-auto">
                {benefit.description}
              </p>
              
              {/* Decorative line */}
              {index < benefits.length - 1 && (
                <div className="hidden md:block absolute top-10 right-0 translate-x-1/2 w-px h-16 bg-gradient-to-b from-[var(--gold)]/30 to-transparent" />
              )}
            </div>
          ))}
        </div>

        {/* Decorative divider */}
        <div className="mt-20 flex justify-center">
          <div className="section-divider w-48" />
        </div>
      </div>
    </section>
  )
}
