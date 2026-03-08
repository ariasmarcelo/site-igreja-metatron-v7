"use client"

import { motion } from "framer-motion"
import { Brain, Wind, Zap, Leaf, Sparkles, Heart, Hand, Droplets } from "lucide-react"

// Content from API: tratamentos page - Therapeutic Modalities
const modalities = [
  {
    icon: Heart,
    name: "Psicoterapia Humanista e Transpessoal",
    description: "Reconhecendo sua natureza e identidade, explorando seus estados internos, emoções e experiências com uma perspectiva compassiva e restauradora.",
  },
  {
    icon: Brain,
    name: "Neurofeedback",
    description: "Os benefícios do Neurofeedback decorrem da melhora da função cerebral, contribuindo para melhor regulação geral, foco, cognição e equilíbrio comportamental.",
  },
  {
    icon: Wind,
    name: "Breathworking — A Ciência da Respiração Funcional",
    description: "Breathwork é a versão moderna do Pranayama, agora fundamentada nas descobertas e fundamentos da neurofisiologia humana.",
  },
  {
    icon: Zap,
    name: "EMDR",
    description: "O EMDR estimula mecanismos naturais do sistema nervoso para acessar e reintegrar memórias traumáticas, reduzindo o sofrimento emocional e a desregulação neurofisiológica.",
  },
  {
    icon: Hand,
    name: "Terapia Corporal Biodinâmica",
    description: "Desenvolvida pela psicóloga e fisioterapeuta norueguesa Gerda Boyesen, esta técnica faz parte da psicoterapia corporal, baseada na ideia de que corpo e mente são profundamente integrados.",
  },
  {
    icon: Droplets,
    name: "CBD (Canabidiol)",
    description: "O Canabidiol (CBD) é um dos compostos encontrados na planta Cannabis Sativa, amplamente conhecido por suas propriedades terapêuticas.",
  },
  {
    icon: Sparkles,
    name: "Terapia Tântrica",
    description: "A Terapia Tântrica é uma abordagem psicoespiritual centrada no corpo que integra trabalho respiratório, meditação ativa, várias formas de massagem e outras práticas somáticas para promover a regulação dos estados elétricos e emocionais do corpo, apoiar o reprocessamento de traumas e oferecer uma ampla gama de benefícios terapêuticos.",
  },
]

export function TratamentosModalities() {
  return (
    <section className="py-24 bg-[var(--cream)]">
      <div className="container mx-auto px-4">
        {/* Section header - from API */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm tracking-[0.2em] text-[var(--sage)] uppercase mb-4">
            Abordagens Clínicas
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[var(--text-dark)] mb-6">
            Modalidades Terapêuticas
          </h2>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            Os tratamentos listados abaixo são abordagens clínicas modernas, solidamente baseadas em evidências e conduzidas por profissionais especializados.
          </p>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed mt-4">
            Cada abordagem é parte de um caminho integrado de regulação interna, honrando os aspectos técnicos da terapêutica e a dimensão sagrada da transformação.
          </p>
        </motion.div>

        {/* Modalities grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modalities.map((modality, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-[var(--ivory)] rounded-2xl p-6 border border-[var(--sand)] hover:border-[var(--sage)]/30 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--sage)]/10 flex items-center justify-center group-hover:bg-[var(--sage)]/20 transition-colors">
                  <modality.icon className="w-6 h-6 text-[var(--sage)]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[var(--text-dark)] mb-2 group-hover:text-[var(--sage)] transition-colors">
                    {modality.name}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {modality.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
