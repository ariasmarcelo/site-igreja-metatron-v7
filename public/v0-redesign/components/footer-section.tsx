"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react"

// Footer links using labels from API: __navigation__
const footerLinks = {
  navegacao: [
    { label: "Principal", href: "/" },
    { label: "Purificação e Ascensão", href: "/purificacao" },
    { label: "Tratamentos Integrados", href: "/tratamentos" },
    { label: "Testemunhos", href: "/testemunhos" },
  ],
  institucional: [
    { label: "Quem Somos", href: "/quemsomos" },
    { label: "Contato", href: "/contato" },
  ],
}

export function FooterSection() {
  return (
    <footer className="relative">
      {/* CTA Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-[var(--navy)] to-[var(--navy-deep)] overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(196,148,59,0.1)_0%,transparent_70%)]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-sm tracking-[0.2em] text-[var(--gold)] uppercase mb-4">
            Pronto para Transformar Sua Vida?
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[var(--text-on-dark)] mb-6 text-balance">
            Comece sua jornada de cura hoje
          </h2>
          <p className="text-lg text-[var(--text-on-dark)]/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Agende uma conversa inicial gratuita e descubra qual caminho é o mais adequado para você
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              asChild
              size="lg"
              className="group bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[var(--navy-deep)] font-medium px-8 transition-all duration-500 hover:shadow-[0_0_30px_rgba(196,148,59,0.5)]"
            >
              <Link href="/contato" className="flex items-center gap-2">
                Agende sua Conversa
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button 
              asChild
              size="lg"
              variant="outline"
              className="border-[var(--gold)]/40 text-[var(--text-on-dark)] hover:bg-[var(--gold)]/10 hover:border-[var(--gold)] transition-all duration-300"
            >
              <Link href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Landscape Footer with SVG background */}
      <div className="relative">
        {/* Sky section */}
        <div className="relative h-32 bg-gradient-to-b from-[#1a2c40] via-[#2d4560] to-[#4a6b8a]">
          <div className="absolute inset-0 opacity-30">
            {/* Stars */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Mountains/Earth section */}
        <div className="relative">
          <svg className="absolute bottom-full left-0 right-0 w-full h-24" preserveAspectRatio="none" viewBox="0 0 1200 100">
            <path 
              d="M0,100 L0,60 Q150,20 300,50 Q450,80 600,40 Q750,0 900,30 Q1050,60 1200,20 L1200,100 Z" 
              fill="#3d5a4a"
            />
            <path 
              d="M0,100 L0,70 Q200,40 400,60 Q600,80 800,50 Q1000,20 1200,40 L1200,100 Z" 
              fill="#2d4a3a"
            />
          </svg>
          <div className="relative h-20 bg-[#2d4a3a]" />
        </div>
        
        {/* Water section */}
        <div className="relative">
          <svg className="absolute bottom-full left-0 right-0 w-full h-12" preserveAspectRatio="none" viewBox="0 0 1200 50">
            <path 
              d="M0,50 L0,20 Q300,30 600,10 Q900,30 1200,20 L1200,50 Z" 
              fill="#1a3a5a"
            />
          </svg>
          <div className="relative bg-gradient-to-b from-[#1a3a5a] to-[#0f2a45] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-4 gap-10">
                {/* Brand - from API: logo.title + logo.subtitle */}
                <div className="md:col-span-1">
                  <Link href="/" className="inline-flex flex-col gap-1 mb-4">
                    <div className="flex items-center gap-3">
                      <SunLogo className="w-10 h-10 text-[var(--gold)]" />
                      <span className="font-serif text-sm tracking-widest text-[var(--gold)] uppercase">
                        Igreja de Metatron
                      </span>
                    </div>
                    <span className="text-xs text-[var(--text-on-dark)]/70 ml-13 pl-[52px]">
                      O Trabalho de Resgate
                    </span>
                  </Link>
                  {/* from API: footer.message */}
                  <p className="text-sm text-[var(--text-on-dark)]/60 leading-relaxed">
                    Sua jornada de cura começa com um único passo.
                  </p>
                </div>
                
                {/* Navigation */}
                <div>
                  <h4 className="font-medium text-[var(--text-on-dark)] mb-4 text-sm tracking-wide uppercase">
                    Navegação
                  </h4>
                  <ul className="space-y-2">
                    {footerLinks.navegacao.map((link) => (
                      <li key={link.href}>
                        <Link 
                          href={link.href}
                          className="text-sm text-[var(--text-on-dark)]/60 hover:text-[var(--gold)] transition-colors duration-300"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Institutional */}
                <div>
                  <h4 className="font-medium text-[var(--text-on-dark)] mb-4 text-sm tracking-wide uppercase">
                    Institucional
                  </h4>
                  <ul className="space-y-2">
                    {footerLinks.institucional.map((link) => (
                      <li key={link.href}>
                        <Link 
                          href={link.href}
                          className="text-sm text-[var(--text-on-dark)]/60 hover:text-[var(--gold)] transition-colors duration-300"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Contact */}
                <div>
                  <h4 className="font-medium text-[var(--text-on-dark)] mb-4 text-sm tracking-wide uppercase">
                    Contato
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <Link 
                        href="mailto:contato@igrejademetatron.com.br"
                        className="flex items-center gap-2 text-sm text-[var(--text-on-dark)]/60 hover:text-[var(--gold)] transition-colors duration-300"
                      >
                        <Mail className="w-4 h-4" />
                        contato@igrejademetatron.com.br
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="https://wa.me/5511999999999"
                        className="flex items-center gap-2 text-sm text-[var(--text-on-dark)]/60 hover:text-[var(--gold)] transition-colors duration-300"
                      >
                        <Phone className="w-4 h-4" />
                        +55 11 99999-9999
                      </Link>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[var(--text-on-dark)]/60">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>São Paulo, Brasil</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Bottom bar - from API: footer.footer.copyright + footer.footer.trademarks */}
              <div className="mt-12 pt-8 border-t border-[var(--gold)]/10 flex flex-col items-center gap-4">
                <p className="text-xs text-[var(--text-on-dark)]/40">
                  Instituto Metatron® e Igreja de Metatron® são marcas registradas.
                </p>
                <p className="text-xs text-[var(--text-on-dark)]/40">
                  ©2025 Igreja de Metatron. Todos os direitos reservados.
                </p>
                <p className="text-xs text-[var(--text-on-dark)]/40">
                  Marcas registradas® protegidas por lei.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Pre-calculated ray positions to avoid hydration mismatch
const sunRaysFooter = [
  { x1: 75, y1: 50, x2: 95, y2: 50 },
  { x1: 71.65, y1: 62.5, x2: 88.97, y2: 72.5 },
  { x1: 62.5, y1: 71.65, x2: 72.5, y2: 88.97 },
  { x1: 50, y1: 75, x2: 50, y2: 95 },
  { x1: 37.5, y1: 71.65, x2: 27.5, y2: 88.97 },
  { x1: 28.35, y1: 62.5, x2: 11.03, y2: 72.5 },
  { x1: 25, y1: 50, x2: 5, y2: 50 },
  { x1: 28.35, y1: 37.5, x2: 11.03, y2: 27.5 },
  { x1: 37.5, y1: 28.35, x2: 27.5, y2: 11.03 },
  { x1: 50, y1: 25, x2: 50, y2: 5 },
  { x1: 62.5, y1: 28.35, x2: 72.5, y2: 11.03 },
  { x1: 71.65, y1: 37.5, x2: 88.97, y2: 27.5 },
]

function SunLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="20" fill="currentColor" />
      {sunRaysFooter.map((ray, i) => (
        <line
          key={i}
          x1={ray.x1}
          y1={ray.y1}
          x2={ray.x2}
          y2={ray.y2}
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}
