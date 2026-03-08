"use client"

import { motion } from "framer-motion"
import { Check, Heart, Brain, Sparkles, Users } from "lucide-react"

// Content from API: tratamentos page - "Rediscover Your Strength" section
export function TratamentosIntro() {
  // Benefits list from API
  const benefits = [
    "Compreenda suas emoções em um nível mais profundo",
    "Regule seu sistema nervoso",
    "Libere o que aprisionava seu maior potencial",
    "Reconecte-se consigo mesmo e com quem você ama",
  ]

  return (
    <section className="py-24 bg-[var(--ivory)]">
      <div className="container mx-auto px-4">
        {/* Quote section - from API */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--sage)]/10 mb-8">
            <Heart className="w-8 h-8 text-[var(--sage)]" />
          </div>
          
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[var(--text-dark)] mb-6 leading-relaxed">
            Redescubra Sua Força e Equilíbrio
          </h2>
          
          <blockquote className="text-lg text-[var(--sage)] italic mb-8">
            &ldquo;Se você está passando por dificuldades emocionais ou espirituais, não precisa enfrentá-las sozinho. 
            Podemos caminhar com você em direção à cura e ao reequilíbrio.&rdquo;
          </blockquote>
        </motion.div>

        {/* Pain points - from API */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[var(--cream)] rounded-2xl p-8 border border-[var(--sand)]"
          >
            <h3 className="font-serif text-xl text-[var(--text-dark)] mb-4">
              Você se sente sobrecarregado, ansioso ou preso em sua capacidade de seguir em frente?
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Dificuldades relacionais ou reatividade emocional intensa podem refletir trauma desenvolvimental.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[var(--cream)] rounded-2xl p-8 border border-[var(--sand)]"
          >
            <h3 className="font-serif text-xl text-[var(--text-dark)] mb-4">
              Com compaixão e técnica precisa
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Oferecemos caminhos para uma cura real e duradoura, fundamentada na neurobiologia do trauma.
            </p>
          </motion.div>
        </div>

        {/* Benefits grid - from API */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-center text-[var(--text-muted)] mb-8">
            Fundamentado na neurobiologia do trauma, ajudando você a:
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-[var(--cream)] rounded-xl p-4 border border-[var(--sage)]/20"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--sage)]/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-[var(--sage)]" />
                </div>
                <p className="text-[var(--text-dark)] text-sm">{benefit}</p>
              </div>
            ))}
          </div>
          
          <p className="text-center text-[var(--sage)] mt-8 font-medium">
            Para uma saúde integral, é essencial cuidar do corpo, mente e espírito
          </p>
        </motion.div>
      </div>
    </section>
  )
}
