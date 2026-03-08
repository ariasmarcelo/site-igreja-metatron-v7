"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden navy-section">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial glow behind logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse,rgba(196,148,59,0.12)_0%,transparent_60%)]" />
        
        {/* Subtle sacred geometry pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23C4943B' stroke-width='0.5'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3Ccircle cx='30' cy='30' r='15'/%3E%3Ccircle cx='30' cy='30' r='10'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        {/* Animated floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[var(--gold)]/30 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-[var(--gold)]/20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-[var(--gold)]/25 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-[var(--gold)]/20 scale-150" />
            <GoldenLogo className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48" />
          </div>
        </div>

        {/* Logo Title - from API: logo.title */}
        <p className="text-sm sm:text-base tracking-[0.3em] text-[var(--gold)] uppercase mb-4">
          Igreja de Metatron
        </p>
        
        {/* Logo Subtitle - from API: logo.subtitle */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wider text-[var(--text-on-dark)] mb-8">
          <span className="block text-gold-gradient uppercase">O Trabalho de Resgate</span>
        </h1>
        
        {/* Section title - from API: purification.title */}
        <p className="text-lg sm:text-xl md:text-2xl text-[var(--text-on-dark)]/80 max-w-3xl mx-auto mb-12 leading-relaxed">
          Trabalho de Purificação e Ascensão
        </p>

        {/* CTA Buttons - using navigation labels from API */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Button 
            asChild
            size="lg"
            className="group relative overflow-hidden bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[var(--navy-deep)] font-medium px-8 py-6 text-base transition-all duration-500 hover:shadow-[0_0_30px_rgba(196,148,59,0.5)]"
          >
            <Link href="/purificacao">
              <span className="relative z-10">Purificação e Ascensão</span>
              <div className="absolute inset-0 shimmer-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          </Button>
          
          <Button 
            asChild
            size="lg"
            variant="outline"
            className="border-[var(--gold)]/40 text-[var(--text-on-dark)] hover:bg-[var(--gold)]/10 hover:border-[var(--gold)] px-8 py-6 text-base transition-all duration-300"
          >
            <Link href="/tratamentos">
              Tratamentos Integrados
            </Link>
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-[var(--gold)]/60" />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--ivory)] to-transparent" />
    </section>
  )
}

// Pre-calculated ray positions to avoid hydration mismatch from floating point precision
// 12 rays starting from top (90 degrees offset), inner radius 30, outer radius 50
const goldenRays = [
  { x1: 100, y1: 70, x2: 100, y2: 50 },
  { x1: 115, y1: 74.02, x2: 125, y2: 56.7 },
  { x1: 125.98, y1: 85, x2: 143.3, y2: 75 },
  { x1: 130, y1: 100, x2: 150, y2: 100 },
  { x1: 125.98, y1: 115, x2: 143.3, y2: 125 },
  { x1: 115, y1: 125.98, x2: 125, y2: 143.3 },
  { x1: 100, y1: 130, x2: 100, y2: 150 },
  { x1: 85, y1: 125.98, x2: 75, y2: 143.3 },
  { x1: 74.02, y1: 115, x2: 56.7, y2: 125 },
  { x1: 70, y1: 100, x2: 50, y2: 100 },
  { x1: 74.02, y1: 85, x2: 56.7, y2: 75 },
  { x1: 85, y1: 74.02, x2: 75, y2: 56.7 },
]

function GoldenLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4943B" />
          <stop offset="50%" stopColor="#D4A853" />
          <stop offset="100%" stopColor="#C4943B" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer ring */}
      <circle cx="100" cy="100" r="90" stroke="url(#goldGradient)" strokeWidth="1.5" fill="none" opacity="0.5" />
      
      {/* Wings - Left */}
      <path
        d="M30 100 Q45 70 60 85 Q70 95 75 100 Q70 105 60 115 Q45 130 30 100"
        fill="url(#goldGradient)"
        opacity="0.8"
        filter="url(#glow)"
      />
      <path
        d="M20 100 Q35 60 55 78 Q68 90 72 100 Q68 110 55 122 Q35 140 20 100"
        fill="none"
        stroke="url(#goldGradient)"
        strokeWidth="1"
        opacity="0.6"
      />
      
      {/* Wings - Right */}
      <path
        d="M170 100 Q155 70 140 85 Q130 95 125 100 Q130 105 140 115 Q155 130 170 100"
        fill="url(#goldGradient)"
        opacity="0.8"
        filter="url(#glow)"
      />
      <path
        d="M180 100 Q165 60 145 78 Q132 90 128 100 Q132 110 145 122 Q165 140 180 100"
        fill="none"
        stroke="url(#goldGradient)"
        strokeWidth="1"
        opacity="0.6"
      />
      
      {/* Central Sun with 12 rays */}
      <circle cx="100" cy="100" r="25" fill="url(#goldGradient)" filter="url(#glow)" />
      <circle cx="100" cy="100" r="18" fill="#0C1520" />
      <circle cx="100" cy="100" r="12" fill="url(#goldGradient)" />
      
      {/* 12 rays */}
      {goldenRays.map((ray, i) => (
        <line
          key={i}
          x1={ray.x1}
          y1={ray.y1}
          x2={ray.x2}
          y2={ray.y2}
          stroke="url(#goldGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#glow)"
        />
      ))}
      
      {/* Inner decorative circles */}
      <circle cx="100" cy="100" r="60" stroke="url(#goldGradient)" strokeWidth="0.5" fill="none" opacity="0.4" />
      <circle cx="100" cy="100" r="70" stroke="url(#goldGradient)" strokeWidth="0.5" fill="none" opacity="0.3" />
    </svg>
  )
}
