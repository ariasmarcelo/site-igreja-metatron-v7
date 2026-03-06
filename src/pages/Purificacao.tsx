/**
 * Purificação — Aspecto sagrado. Sol como símbolo central.
 * Logo da Index, dourado metálico predominante.
 * Fase 1: vermelho fogo | Fase 2: instituto (sage) | Fase 3: dourado/branco/prata metálicos.
 * Fontes/estilos da Index. Rodapé mantido.
 */
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Crown, Compass, Heart, Infinity as InfinityIcon, LineChart, ChevronDown, Shield } from 'lucide-react';
import EditableField from '@/components/ui/EditableField';
import { Sun12Rays } from '../components/icons/Sun12Rays';
import { LogoGold } from '../components/icons/LogoGold';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { usePageContent } from '@/hooks/useContent';
import { PageLoading } from '@/components/PageLoading';
import { SharedFooter } from '@/components/SharedFooter';
import { FooterBackground } from '@/components/FooterBackground';
import '@/styles/layouts/pages/purificacao.css';


interface PurificacaoTexts {
  header: { title: string; subtitle: string };
  sections?: { process_title?: string; process_subtitle?: string };
  intro: { sectionTitle?: string; mainText: string; description: string };
  [key: string]: any;
}

export default function Purificacao() {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const { data: texts, loading } = usePageContent<PurificacaoTexts>('purificacao');

  const togglePhase = (phase: number) => {
    setExpandedPhase(expandedPhase === phase ? null : phase);
  };

  if (loading || !texts) {
    return (
      <PageLoading
        icon={Sparkles}
        text="Carregando purificação..."
        bgColor="bg-gradient-to-b from-amber-50 to-yellow-50"
        iconColor="text-amber-600"
        textColor="text-amber-900"
      />
    );
  }

  const textsTyped = texts as Record<string, Record<string, unknown>>;
  const header = textsTyped.header as { title: string; subtitle: string };
  const intro = textsTyped.intro as { mainText: string; description: string };
  const faseInicial = textsTyped.faseInicial as any;
  const faseIntermediaria = textsTyped.faseIntermediaria as any;
  const faseFinal = textsTyped.faseFinal as any;
  const psicodelicos = textsTyped.psicodelicos as any;
  const cta = textsTyped.cta as { title?: string; subtitle?: string; buttonText: string };

  return (
    <div className="ds-new purificacao-sacred min-h-screen">
      {/* Hero — dourado metálico, logo da Index (sol) */}
      <section className="purificacao-hero">
        <div className="purificacao-hero-inner">
          <div className="purificacao-hero-logo">
            <LogoGold className="w-190 h-auto" />
          </div>
          <EditableField value={header.title} jsonKey="purificacao.header.title" type="h1" className="purificacao-hero-title" />
          <p className="purificacao-hero-sub">
            <EditableField value={header.subtitle} jsonKey="purificacao.header.subtitle" type="span" className="" />
          </p>
        </div>
      </section>

      {/* Introdução — card dourado */}
      <section className="purificacao-section">
        <div className="container mx-auto px-4">
          <div className="max-w-section mx-auto">
            <Card className="purificacao-card purificacao-card-gold">
              <div className="purificacao-card-bar gold" />
              <CardContent className="p-5 md:p-8 text-center">
                <EditableField value={intro.sectionTitle || ''} jsonKey="purificacao.intro.sectionTitle" type="h2" className="purificacao-heading gold" />
                <EditableField value={intro.mainText} jsonKey="purificacao.intro.mainText" type="p" className="purificacao-body mb-3 whitespace-pre-line" />
                <EditableField value={intro.description} jsonKey="purificacao.intro.description" type="p" className="purificacao-body" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Fluxo das Três Fases */}
      <section className="purificacao-section">
        <div className="container mx-auto px-4">
          <div className="max-w-section mx-auto">
            <Card className="purificacao-card purificacao-timeline-card">
              <div className="purificacao-card-bar gold" />
              <CardContent className="p-6 md:p-10 relative z-10">
                <div className="text-center mb-8">
                  <EditableField value={texts.sections?.process_title} jsonKey="purificacao.sections.process_title" type="h2" className="purificacao-heading gold mb-3" />
                  <p className="purificacao-body muted max-w-full mx-auto mb-4">
                    <EditableField value={texts.sections?.process_subtitle} jsonKey="purificacao.sections.process_subtitle" type="span" className="inline" />
                  </p>
                  <div className="purificacao-sun-divider" />
                </div>

                <div className="relative purificacao-timeline">
                  <div className="purificacao-timeline-line" />

                  {/* FASE 1 — vermelho fogo */}
                  <div className="purificacao-phase">
                    <div className="purificacao-phase-node fire">1</div>
                    <div className={`purificacao-phase-card fire ${expandedPhase === 1 ? 'expanded' : ''}`} onClick={() => togglePhase(1)}>
                      <div className="purificacao-phase-header">
                        <div className="purificacao-phase-icon fire">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                          <EditableField value={faseInicial.title} jsonKey="purificacao.faseInicial.title" type="h3" className="purificacao-phase-title" />
                          <EditableField value={faseInicial.subtitle} jsonKey="purificacao.faseInicial.subtitle" type="p" className="purificacao-phase-subtitle" />
                        </div>
                        <ChevronDown className={`purificacao-chevron ${expandedPhase === 1 ? 'open' : ''}`} />
                      </div>
                      <div className={`purificacao-phase-body ${expandedPhase === 1 ? 'open' : ''}`}>
                        <div>
                          <EditableField value={faseInicial.objetivo.title} jsonKey="purificacao.faseInicial.objetivo.title" type="h4" className="purificacao-subheading" />
                          <EditableField value={faseInicial.objetivo.content} jsonKey="purificacao.faseInicial.objetivo.content" type="p" className="purificacao-body" />
                        </div>
                        <div className="purificacao-phase-block fire">
                          <EditableField value={faseInicial.activities.title} jsonKey="purificacao.faseInicial.activities.title" type="h5" className="purificacao-subheading" />
                          <ul className="purificacao-list">
                            {faseInicial.activities.items.map((item: string, index: number) => (
                              <li key={index}>
                                <span className="bullet fire" />
                                <EditableField value={item} jsonKey={`purificacao.faseInicial.activities.items[${index}]`} type="span" className="purificacao-body" />
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <EditableField value={faseInicial.duration.title} jsonKey="purificacao.faseInicial.duration.title" type="h5" className="purificacao-subheading" />
                          <EditableField value={faseInicial.duration.content} jsonKey="purificacao.faseInicial.duration.content" type="p" className="purificacao-body" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FASE 2 — instituto (sage) */}
                  <div className="purificacao-phase">
                    <div className="purificacao-phase-node sage">2</div>
                    <div className={`purificacao-phase-card sage ${expandedPhase === 2 ? 'expanded' : ''}`} onClick={() => togglePhase(2)}>
                      <div className="purificacao-phase-header">
                        <div className="purificacao-phase-icon sage">
                          <LineChart className="w-6 h-6" />
                        </div>
                        <div>
                          <EditableField value={faseIntermediaria.title} jsonKey="purificacao.faseIntermediaria.title" type="h3" className="purificacao-phase-title" />
                          <EditableField value={faseIntermediaria.subtitle} jsonKey="purificacao.faseIntermediaria.subtitle" type="p" className="purificacao-phase-subtitle" />
                        </div>
                        <ChevronDown className={`purificacao-chevron ${expandedPhase === 2 ? 'open' : ''}`} />
                      </div>
                      <div className={`purificacao-phase-body ${expandedPhase === 2 ? 'open' : ''}`}>
                        <div>
                          <EditableField value={faseIntermediaria.requisito.title} jsonKey="purificacao.faseIntermediaria.requisito.title" type="h4" className="purificacao-subheading" />
                          <EditableField value={faseIntermediaria.requisito.content} jsonKey="purificacao.faseIntermediaria.requisito.content" type="p" className="purificacao-body" />
                        </div>
                        <div className="purificacao-phase-block sage">
                          <EditableField value={faseIntermediaria.trabalhos.title} jsonKey="purificacao.faseIntermediaria.trabalhos.title" type="h5" className="purificacao-subheading" />
                          <div className="space-y-4">
                            {faseIntermediaria.trabalhos.items.map((item: { title: string; content: string }, index: number) => (
                              <div key={index}>
                                <EditableField value={item.title} jsonKey={`purificacao.faseIntermediaria.trabalhos.items[${index}].title`} type="h6" className="purificacao-subheading" />
                                <EditableField value={item.content} jsonKey={`purificacao.faseIntermediaria.trabalhos.items[${index}].content`} type="p" className="purificacao-body muted" />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <EditableField value={faseIntermediaria.integracao.title} jsonKey="purificacao.faseIntermediaria.integracao.title" type="h5" className="purificacao-subheading" />
                          <EditableField value={faseIntermediaria.integracao.content} jsonKey="purificacao.faseIntermediaria.integracao.content" type="p" className="purificacao-body" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FASE 3 — dourado / branco / prata metálicos */}
                  <div className="purificacao-phase">
                    <div className="purificacao-phase-node metallic">3</div>
                    <div className={`purificacao-phase-card metallic ${expandedPhase === 3 ? 'expanded' : ''}`} onClick={() => togglePhase(3)}>
                      <div className="purificacao-phase-header">
                        <div className="purificacao-phase-icon metallic">
                          <Crown className="w-6 h-6" />
                        </div>
                        <div>
                          <EditableField value={faseFinal.title} jsonKey="purificacao.faseFinal.title" type="h3" className="purificacao-phase-title" />
                          <EditableField value={faseFinal.subtitle} jsonKey="purificacao.faseFinal.subtitle" type="p" className="purificacao-phase-subtitle" />
                        </div>
                        <ChevronDown className={`purificacao-chevron ${expandedPhase === 3 ? 'open' : ''}`} />
                      </div>
                      <div className={`purificacao-phase-body ${expandedPhase === 3 ? 'open' : ''}`}>
                        <div>
                          <EditableField value={faseFinal.iniciacao.content} jsonKey="purificacao.faseFinal.iniciacao.content" type="p" className="purificacao-body" />
                        </div>
                        <div className="purificacao-phase-block metallic">
                          <div className="flex items-center gap-4 mb-4">
                            <Sun12Rays className="w-12 h-12 text-[var(--purificacao-gold)] shrink-0" />
                            <EditableField value={faseFinal.evento.title ?? 'O Evento Iniciático'} jsonKey="purificacao.faseFinal.evento.title" type="h5" className="purificacao-subheading gold" />
                          </div>
                          {faseFinal.evento.content.map((para: string, i: number) => (
                            <EditableField key={i} value={para} jsonKey={`purificacao.faseFinal.evento.content[${i}]`} type="p" className={`purificacao-body ${i > 0 ? 'mt-3' : ''}`} />
                          ))}
                        </div>
                        <div>
                          <EditableField value={faseFinal.posIniciacao.title} jsonKey="purificacao.faseFinal.posIniciacao.title" type="h5" className="purificacao-subheading" />
                          <EditableField value={faseFinal.posIniciacao.content} jsonKey="purificacao.faseFinal.posIniciacao.content" type="p" className="purificacao-body mb-4" />
                          <ul className="purificacao-list">
                            {faseFinal.posIniciacao.items.map((it: string, idx: number) => (
                              <li key={idx}>
                                <span className="bullet metallic">✦</span>
                                <EditableField value={it} jsonKey={`purificacao.faseFinal.posIniciacao.items[${idx}]`} type="span" className="purificacao-body" />
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="purificacao-phase-block sage">
                          <EditableField value={faseFinal.adepto.title} jsonKey="purificacao.faseFinal.adepto.title" type="h5" className="purificacao-subheading" />
                          <EditableField value={faseFinal.adepto.content} jsonKey="purificacao.faseFinal.adepto.content" type="p" className="purificacao-body" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Psicodélicos — dourado metálico sagrado */}
      <section className="purificacao-psicodelicos">
        <div className="purificacao-psicodelicos-bg" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-section mx-auto">
            <Card className="purificacao-psicodelicos-card">
              <CardHeader className="purificacao-psicodelicos-header">
                <div className="text-center relative z-10">
                  <div className="purificacao-psicodelicos-icon-wrap">
                    <InfinityIcon className="w-24 h-24" />
                  </div>
                  <EditableField value={psicodelicos.title} jsonKey="purificacao.psicodelicos.title" type="h3" className="purificacao-psicodelicos-title" />
                  <EditableField value={psicodelicos.subtitle} jsonKey="purificacao.psicodelicos.subtitle" type="p" className="purificacao-psicodelicos-subtitle" />
                </div>
              </CardHeader>
              <CardContent className="purificacao-psicodelicos-content">
                <div className="purificacao-papiro-wrap">
                  <div className="papiro-texture" />
                  <div className="papiro-text text-center text-xl md:text-2xl leading-relaxed font-serif italic" data-json-key="purificacao.psicodelicos.intro" dangerouslySetInnerHTML={{ __html: psicodelicos.intro }} />
                </div>

                <div className="purificacao-triple-wrap">
                  <div className="purificacao-shield-wrap">
                    <Shield className="w-16 h-16 purificacao-shield-icon" />
                  </div>
                  <EditableField value={psicodelicos.tripleProtection.title} jsonKey="purificacao.psicodelicos.tripleProtection.title" type="h4" className="purificacao-heading gold text-center mb-8" />
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="purificacao-triple-card">
                      <div className="purificacao-triple-icon sage"><Compass className="w-10 h-10" /></div>
                      <EditableField value={psicodelicos.tripleProtection.cards[0].title} jsonKey="purificacao.psicodelicos.tripleProtection.cards[0].title" type="h5" className="purificacao-subheading" />
                      <EditableField value={psicodelicos.tripleProtection.cards[0].description} jsonKey="purificacao.psicodelicos.tripleProtection.cards[0].description" type="p" className="purificacao-body text-sm" />
                    </div>
                    <div className="purificacao-triple-card">
                      <div className="purificacao-triple-icon fire"><Heart className="w-10 h-10" /></div>
                      <EditableField value={psicodelicos.tripleProtection.cards[1].title} jsonKey="purificacao.psicodelicos.tripleProtection.cards[1].title" type="h5" className="purificacao-subheading" />
                      <EditableField value={psicodelicos.tripleProtection.cards[1].description} jsonKey="purificacao.psicodelicos.tripleProtection.cards[1].description" type="p" className="purificacao-body text-sm" />
                    </div>
                    <div className="purificacao-triple-card">
                      <div className="purificacao-triple-icon gold"><Sun12Rays className="w-10 h-10" /></div>
                      <EditableField value={psicodelicos.tripleProtection.cards[2].title} jsonKey="purificacao.psicodelicos.tripleProtection.cards[2].title" type="h5" className="purificacao-subheading" />
                      <EditableField value={psicodelicos.tripleProtection.cards[2].description} jsonKey="purificacao.psicodelicos.tripleProtection.cards[2].description" type="p" className="purificacao-body text-sm" />
                    </div>
                  </div>
                </div>

                <EditableField value={psicodelicos.applications.title} jsonKey="purificacao.psicodelicos.applications.title" type="h3" className="purificacao-heading gold text-center mt-16 mb-10" />
                <ul className="space-y-5">
                  {psicodelicos.applications.items.map((item: string, idx: number) => (
                    <li key={idx} className="purificacao-application-item">
                      <span className="purificacao-app-bullet">✦</span>
                      <span className="purificacao-body" data-json-key={`purificacao.psicodelicos.applications.items[${idx}]`} dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>

                <div className="purificacao-papiro-wrap mt-16">
                  <div className="papiro-texture" />
                  <h4 className="papiro-title text-center font-bold text-2xl md:text-3xl text-[var(--purificacao-text-dark)] mb-4">
                    <EditableField value={psicodelicos.conclusion.title} jsonKey="purificacao.psicodelicos.conclusion.title" type="span" className="inline" />
                  </h4>
                  <p className="papiro-text text-center text-lg md:text-xl leading-relaxed font-serif italic">
                    <EditableField value={psicodelicos.conclusion.content} jsonKey="purificacao.psicodelicos.conclusion.content" type="span" className="inline" />
                  </p>
                </div>

                <div className="text-center mt-12">
                  <Link to="/contato">
                    <Button size="lg" className="purificacao-cta-btn">
                      <Sparkles className="w-6 h-6 mr-3" />
                      <EditableField value={psicodelicos.ctaButton} jsonKey="purificacao.psicodelicos.ctaButton" type="span" className="inline" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Banner de testemunhos — texto editável + link */}
      <section className="purificacao-section">
        <div className="container mx-auto px-4">
          <div className="max-w-section mx-auto">
            <div className="purificacao-testimonial-banner">
              <div className="purificacao-testimonial-left">
                <div className="purificacao-testimonial-icon">
                  <Heart className="w-4 h-4" />
                </div>
                <div className="purificacao-body">
                  <EditableField
                    value={texts.testemunhosCta?.text}
                    jsonKey="purificacao.testemunhosCta.text"
                    type="span"
                    className=""
                  />
                </div>
              </div>
              <Link to="/testemunhos" className="purificacao-testimonial-btn">
                <EditableField
                  value={texts.testemunhosCta?.button}
                  jsonKey="purificacao.testemunhosCta.button"
                  type="span"
                  className="inline"
                />
                <span className="purificacao-arrow">›</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rodapé — mantido */}
      <section className="relative overflow-hidden bg-slate-900">
        <FooterBackground gradientId="skyGradientPurificacao" skyColors={['#1e3a5f', '#4b6cb7', '#d4a843']} earthColor="#5c4a30" waterColors={['#0ea5e9', '#0284c7', '#0369a1']} />
        <div className="container mx-auto px-4 relative z-10 pt-6 pb-4">
          <div className="max-w-section mx-auto text-center">
            <EditableField value={cta.title} jsonKey="purificacao.cta.title" type="h2" className="text-3xl md:text-4xl font-bold mb-4 text-white text-shadow-strong" />
            <EditableField value={cta.subtitle} jsonKey="purificacao.cta.subtitle" type="p" className="text-lg mb-5 text-white text-shadow-medium" />
            <Link to="/contato">
              <Button className="bg-[#CFAF5A] text-white font-semibold px-6 py-4 text-base rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105">
                <EditableField value={cta.buttonText} jsonKey="purificacao.cta.buttonText" type="span" className="inline" />
              </Button>
            </Link>
          </div>
        </div>
        <SharedFooter className="pt-8 pb-4" />
      </section>
    </div>
  );
}
