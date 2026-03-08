"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

// Navigation labels from API: __navigation__
const navLinks = [
  { href: "/", label: "Principal" },
  { href: "/purificacao", label: "Purificação e Ascensão" },
  { href: "/tratamentos", label: "Tratamentos Integrados" },
  { href: "/testemunhos", label: "Testemunhos" },
  { href: "/quemsomos", label: "Quem Somos" },
  { href: "/contato", label: "Contato" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--navy-deep)]/95 backdrop-blur-md border-b border-[var(--gold)]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - from API: logo.title + logo.subtitle */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <SunLogo className="w-10 h-10 text-[var(--gold)] transition-transform duration-500 group-hover:rotate-12" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xs sm:text-sm tracking-widest text-[var(--gold)] uppercase">
                Igreja de Metatron
              </span>
              <span className="text-[10px] sm:text-xs tracking-wider text-[var(--text-on-dark)]/70">
                O Trabalho de Resgate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--text-on-dark)]/80 hover:text-[var(--gold)] transition-colors duration-300 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              asChild
              className="bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[var(--navy-deep)] font-medium px-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(196,148,59,0.4)]"
            >
              <Link href="/contato">Agende uma Conversa</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-[var(--text-on-dark)]"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[var(--navy-deep)]/98 backdrop-blur-md border-t border-[var(--gold)]/10">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-[var(--text-on-dark)]/80 hover:text-[var(--gold)] transition-colors duration-300 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
            <Button 
              asChild
              className="w-full mt-4 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[var(--navy-deep)] font-medium"
            >
              <Link href="/contato">Agende uma Conversa</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

// Pre-calculated ray positions to avoid hydration mismatch from floating point precision
const sunRays = [
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
      {/* Central circle */}
      <circle cx="50" cy="50" r="20" fill="currentColor" />
      
      {/* 12 rays */}
      {sunRays.map((ray, i) => (
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
