/**
 * Purificação — Redesign V8 (visitor-centered)
 *
 * Visual: Logo dourado + raios cônicos + gradiente dourado (mantido).
 * Flow: Aspiracional → Jornada das 3 Fases → Sacramentos (novo) → Triple Protection → CTA WhatsApp
 * Seção Psicodélicos substituída por "Sacramentos" com linguagem sagrada.
 */
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sparkles, Crown, Compass, Heart, Infinity as InfinityIcon,
  LineChart, ChevronDown, MessageCircle, Shield, AlertTriangle,
} from 'lucide-react';
import EditableField from '@/components/ui/EditableField';
import { useGlossary } from '@/hooks/useGlossary';
import { Sun12Rays } from '../components/icons/Sun12Rays';
import { LogoGold } from '../components/icons/LogoGold';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { usePageContent } from '@/hooks/useContent';
import { PageLoading } from '@/components/PageLoading';
import { FooterBackground } from '@/components/FooterBackground';
import { FOOTER } from '@/components/footer-constants';
import '@/styles/layouts/pages/purificacao.css';


interface PurificacaoTexts {
  header: { title: string; subtitle: string };
  hero?: { primaryCta?: string; secondaryCta?: string };
  sections?: { process_title?: string; process_subtitle?: string };
  intro: { sectionTitle?: string; mainText: string; description: string };
  testemunhosCta?: { text?: string; button?: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function Purificacao() {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [showSafety, setShowSafety] = useState(false);
  const { data: texts, loading } = usePageContent<PurificacaoTexts>('purificacao', { includePages: ['__shared__'] });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const GLOSSARY = useGlossary((texts as any)?.__shared__);

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
  const intro = textsTyped.intro as { sectionTitle?: string; mainText: string; description: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faseInicial = textsTyped.faseInicial as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faseIntermediaria = textsTyped.faseIntermediaria as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faseFinal = textsTyped.faseFinal as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const psicodelicos = textsTyped.psicodelicos as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sacramentos = textsTyped.sacramentos as Record<string, any>;
  const cta = textsTyped.cta as { title?: string; subtitle?: string; buttonText: string };

  return (
    <div className="ds-new purificacao-sacred min-h-screen">
      {/* Bloco unificado: hero + 2 seções — mesmo fundo, raios irradiam até desfazer */}
      <div className="purificacao-hero-block">
        <div className="purificacao-rays-origin">
          <div className="purificacao-hero-logo-area">
            <div className="purificacao-hero-rays-layer pointer-events-none" aria-hidden />
            <div className="purificacao-hero-logo">
              <LogoGold className="w-190 h-auto" />
            </div>
          </div>
        </div>
        <section className="purificacao-hero relative">
          <div className="purificacao-hero-inner max-w-section mx-auto relative z-10">
          <div className="purificacao-hero-text relative z-10">
            <EditableField value={header.title} jsonKey="purificacao.header.title" type="h1" className="purificacao-hero-title" />
            <p className="purificacao-hero-sub">
              <EditableField value={header.subtitle} jsonKey="purificacao.header.subtitle" type="span" className="" glossary={GLOSSARY} />
            </p>

            {/* CTA Buttons */}
            <div className="purificacao-hero-buttons">
              <Link to="/contato" className="purificacao-btn-primary">
                <MessageCircle className="w-4 h-4" />
                <EditableField
                  value={texts.hero?.primaryCta}
                  jsonKey="purificacao.hero.primaryCta"
                  type="span"
                  className="inline"
                />
              </Link>
              <Link to="/tratamentos" className="purificacao-btn-secondary">
                <EditableField
                  value={texts.hero?.secondaryCta}
                  jsonKey="purificacao.hero.secondaryCta"
                  type="span"
                  className="inline"
                />
                <span className="purificacao-arrow">›</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Introdução — card dourado */}
      <section className="purificacao-section purificacao-section-first">
        <div className="max-w-section mx-auto">
          <Card className="purificacao-card purificacao-card-gold">
            <CardContent className="purificacao-card-content text-center">
              <EditableField value={intro.sectionTitle || ''} jsonKey="purificacao.intro.sectionTitle" type="h2" className="purificacao-heading gold" />
              <div className="purificacao-gold-ornament" />
              <EditableField value={intro.mainText} jsonKey="purificacao.intro.mainText" type="p" className="purificacao-body whitespace-pre-line" />
              <div className="purificacao-gold-ornament" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Fluxo das Três Fases */}
      <section className="purificacao-section">
        <div className="max-w-section mx-auto">
            <Card className="purificacao-card purificacao-timeline-card">
              <CardContent className="purificacao-card-content relative z-10">
                <div className="purificacao-section-title-block text-center">
                  <div className="purificacao-process-icon-wrap">
                    <svg viewBox="0 0 100 100" className="w-20 h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="20" fill="currentColor" />
                      {[...Array(12)].map((_, i) => {
                        const angle = (i * 30 * Math.PI) / 180;
                        const x1 = 50 + Math.cos(angle) * 25, y1 = 50 + Math.sin(angle) * 25;
                        const x2 = 50 + Math.cos(angle) * 40, y2 = 50 + Math.sin(angle) * 40;
                        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />;
                      })}
                    </svg>
                  </div>
                  <div className="purificacao-sun-divider" />
                  <EditableField value={texts.sections?.process_title} jsonKey="purificacao.sections.process_title" type="h2" className="purificacao-heading gold mb-3" />
                  <EditableField value={texts.sections?.process_subtitle} jsonKey="purificacao.sections.process_subtitle" type="p" className="purificacao-process-subtitle" />
                </div>

                <div className="relative purificacao-timeline">
                  <div className="purificacao-timeline-line" />

                  {/* FASE 1 — vermelho fogo */}
                  <div className="purificacao-phase">
                    <div className="purificacao-phase-node fire">1</div>
                    <div className={`purificacao-phase-card fire ${expandedPhase === 1 ? 'expanded' : ''}`}>
                      <div className="purificacao-phase-header" onClick={() => togglePhase(1)}>
                        <div className="purificacao-phase-icon fire">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                          <EditableField value={faseInicial.title} jsonKey="purificacao.faseInicial.title" type="h3" className="purificacao-phase-title" />
                          <EditableField value={faseInicial.subtitle} jsonKey="purificacao.faseInicial.subtitle" type="p" className="purificacao-phase-subtitle" />
                        </div>
                        <ChevronDown className={`purificacao-chevron ${expandedPhase === 1 ? 'open' : ''}`} />
                      </div>
                      <EditableField value={faseInicial.outcome} jsonKey="purificacao.faseInicial.outcome" type="p" className="purificacao-phase-outcome" />
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
                    <div className={`purificacao-phase-card sage ${expandedPhase === 2 ? 'expanded' : ''}`}>
                      <div className="purificacao-phase-header" onClick={() => togglePhase(2)}>
                        <div className="purificacao-phase-icon sage">
                          <LineChart className="w-6 h-6" />
                        </div>
                        <div>
                          <EditableField value={faseIntermediaria.title} jsonKey="purificacao.faseIntermediaria.title" type="h3" className="purificacao-phase-title" />
                          <EditableField value={faseIntermediaria.subtitle} jsonKey="purificacao.faseIntermediaria.subtitle" type="p" className="purificacao-phase-subtitle" />
                        </div>
                        <ChevronDown className={`purificacao-chevron ${expandedPhase === 2 ? 'open' : ''}`} />
                      </div>
                      <EditableField value={faseIntermediaria.outcome} jsonKey="purificacao.faseIntermediaria.outcome" type="p" className="purificacao-phase-outcome" />
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
                                <EditableField value={item.content} jsonKey={`purificacao.faseIntermediaria.trabalhos.items[${index}].content`} type="p" className="purificacao-body" />
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

                  {/* FASE 3 — featured, dourado / branco / prata metálicos */}
                  <div className="purificacao-phase">
                    <div className="purificacao-phase-node metallic">3</div>
                    <div className={`purificacao-phase-card purificacao-phase-card--featured metallic ${expandedPhase === 3 ? 'expanded' : ''}`}>
                      <div className="purificacao-phase-header" onClick={() => togglePhase(3)}>
                        <div className="purificacao-phase-icon metallic">
                          <Crown className="w-6 h-6" />
                        </div>
                        <div>
                          <EditableField value={faseFinal.title} jsonKey="purificacao.faseFinal.title" type="h3" className="purificacao-phase-title" glossary={GLOSSARY} />
                          <EditableField value={faseFinal.subtitle} jsonKey="purificacao.faseFinal.subtitle" type="p" className="purificacao-phase-subtitle" />
                        </div>
                        <ChevronDown className={`purificacao-chevron ${expandedPhase === 3 ? 'open' : ''}`} />
                      </div>

                      {/* Always visible — experiential lead */}
                      <EditableField value={faseFinal.experiencia} jsonKey="purificacao.faseFinal.experiencia" type="p" className="purificacao-phase-outcome" />

                      {/* Always visible — the 5 outcomes */}
                      <div className="purificacao-phase-outcomes-list">
                        <EditableField value={faseFinal.posIniciacao?.title} jsonKey="purificacao.faseFinal.posIniciacao.title" type="h5" className="purificacao-subheading gold" glossary={GLOSSARY} />
                        <ul className="purificacao-list">
                          {faseFinal.posIniciacao?.items?.map((it: string, idx: number) => (
                            <li key={idx}>
                              <span className="bullet metallic">✦</span>
                              <EditableField value={it} jsonKey={`purificacao.faseFinal.posIniciacao.items[${idx}]`} type="span" className="purificacao-body" glossary={GLOSSARY} />
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Expandable — technical details */}
                      <div className={`purificacao-phase-body ${expandedPhase === 3 ? 'open' : ''}`}>
                        <div>
                          <EditableField value={faseFinal.iniciacao?.content} jsonKey="purificacao.faseFinal.iniciacao.content" type="p" className="purificacao-body" glossary={GLOSSARY} />
                        </div>
                        <div className="purificacao-phase-block metallic">
                          <div className="flex items-center gap-4 mb-4">
                            <Sun12Rays className="w-12 h-12 text-(--purificacao-gold) shrink-0" />
                            <EditableField value={faseFinal.evento?.title} jsonKey="purificacao.faseFinal.evento.title" type="h5" className="purificacao-subheading gold" glossary={GLOSSARY} />
                          </div>
                          {faseFinal.evento?.content?.map((para: string, i: number) => (
                            <EditableField key={i} value={para} jsonKey={`purificacao.faseFinal.evento.content[${i}]`} type="p" className={`purificacao-body ${i > 0 ? 'mt-3' : ''}`} />
                          ))}
                        </div>
                        <div className="purificacao-phase-block sage">
                          <EditableField value={faseFinal.adepto?.title} jsonKey="purificacao.faseFinal.adepto.title" type="h5" className="purificacao-subheading" />
                          <EditableField value={faseFinal.adepto?.content} jsonKey="purificacao.faseFinal.adepto.content" type="p" className="purificacao-body" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
      </section>
      </div>

      {/* ==================== SACRAMENTOS ==================== */}
      {sacramentos && (
        <section className="purificacao-psicodelicos">
          <div className="purificacao-psicodelicos-bg" />
          <div className="max-w-section mx-auto relative z-10">
            <Card className="purificacao-psicodelicos-card">
              <CardHeader className="purificacao-psicodelicos-header">
                <div className="text-center relative z-10">
                  <div className="purificacao-psicodelicos-icon-wrap">
                    <InfinityIcon className="w-20 h-20" />
                  </div>
                  <EditableField value={sacramentos.title} jsonKey="purificacao.sacramentos.title" type="h2" className="purificacao-psicodelicos-title" />
                  <EditableField value={sacramentos.subtitle} jsonKey="purificacao.sacramentos.subtitle" type="p" className="purificacao-psicodelicos-subtitle" />
                </div>
              </CardHeader>

              <div className="purificacao-psicodelicos-content">

                {/* Objectives */}
                <div className="purificacao-sacr-block">
                  <EditableField value={sacramentos.objectives?.title} jsonKey="purificacao.sacramentos.objectives.title" type="h3" className="purificacao-sacr-subtitle" />
                  <div className="purificacao-sacr-objectives">
                    {sacramentos.objectives?.items?.map((item: string, idx: number) => (
                      <div key={idx} className="purificacao-sacr-objective">
                        <span className="purificacao-sacr-objective-bullet">✦</span>
                        <EditableField
                          value={item}
                          jsonKey={`purificacao.sacramentos.objectives.items[${idx}]`}
                          type="p"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gains — card grid matching Triple Protection */}
                <div className="purificacao-sacr-block">
                  <EditableField value={sacramentos.gains?.title} jsonKey="purificacao.sacramentos.gains.title" type="h3" className="purificacao-sacr-subtitle" />
                  <div className="purificacao-sacr-gains-grid">
                    {sacramentos.gains?.items?.map((gain: { title: string; content: string }, idx: number) => (
                      <div key={idx} className="purificacao-sacr-gain-card">
                        <div className="purificacao-sacr-gain-icon">
                          {idx === 0 && <Sparkles className="w-6 h-6" />}
                          {idx === 1 && <Heart className="w-6 h-6" />}
                          {idx === 2 && <Sun12Rays className="w-6 h-6" />}
                        </div>
                        <EditableField value={gain.title} jsonKey={`purificacao.sacramentos.gains.items[${idx}].title`} type="h5" className="purificacao-sacr-gain-title" />
                        <EditableField value={gain.content} jsonKey={`purificacao.sacramentos.gains.items[${idx}].content`} type="p" className="purificacao-sacr-gain-text" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sacred Rhythm */}
                <div className="purificacao-sacr-block">
                  <div className="purificacao-sacr-papiro">
                    <div className="purificacao-sacr-papiro-texture" />
                    <h3 className="purificacao-sacr-papiro-title">
                      <EditableField value={sacramentos.rhythm?.title} jsonKey="purificacao.sacramentos.rhythm.title" type="span" />
                    </h3>
                    <EditableField value={sacramentos.rhythm?.content} jsonKey="purificacao.sacramentos.rhythm.content" type="p" className="purificacao-sacr-rhythm-text" />
                  </div>
                </div>

                {/* Precepts */}
                <div className="purificacao-sacr-block">
                  <EditableField value={sacramentos.precepts?.title} jsonKey="purificacao.sacramentos.precepts.title" type="h3" className="purificacao-sacr-subtitle" />
                  <div className="purificacao-sacr-precepts">
                    {sacramentos.precepts?.items?.map((item: string, idx: number) => (
                      <div key={idx} className="purificacao-sacr-precept">
                        <Heart className="w-4 h-4 purificacao-sacr-precept-icon" />
                        <EditableField
                          value={item}
                          jsonKey={`purificacao.sacramentos.precepts.items[${idx}]`}
                          type="p"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety */}
                <div className="purificacao-sacr-block">
                  <div className="purificacao-sacr-safety">
                    <button
                      className="purificacao-sacr-safety-trigger"
                      onClick={() => setShowSafety(!showSafety)}
                      aria-label="Proteção e Discernimento"
                    >
                      <div className="purificacao-sacr-safety-left">
                        <Shield className="w-5 h-5" />
                        <EditableField value={sacramentos.safety?.title} jsonKey="purificacao.sacramentos.safety.title" type="span" />
                      </div>
                      <ChevronDown className={`purificacao-chevron ${showSafety ? 'open' : ''}`} />
                    </button>
                    <div className={`purificacao-sacr-safety-body ${showSafety ? 'open' : ''}`}>
                      <div className="purificacao-sacr-safety-items">
                        {sacramentos.safety?.items?.map((item: string, idx: number) => (
                          <div key={idx} className="purificacao-sacr-safety-item">
                            <AlertTriangle className="w-4 h-4" />
                            <EditableField
                              value={item}
                              jsonKey={`purificacao.sacramentos.safety.items[${idx}]`}
                              type="p"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="purificacao-sacr-block">
                  <div className="purificacao-sacr-cta-area">
                    <div className="purificacao-sacr-divider" />
                    <Link to="/contato">
                      <Button size="lg" className="purificacao-cta-btn">
                        <MessageCircle className="w-5 h-5 mr-3" />
                        <EditableField value={psicodelicos?.ctaButton} jsonKey="purificacao.psicodelicos.ctaButton" type="span" />
                      </Button>
                    </Link>
                  </div>
                </div>

              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Tripla Proteção */}
      <section className="purificacao-section">
        <div className="max-w-section mx-auto">
            <div className="purificacao-triple-section">
              <div className="purificacao-shield-wrap">
                <svg className="purificacao-shield-icon" width="56" height="56" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="shieldMetalLeft" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e8ecf1" />
                      <stop offset="35%" stopColor="#c0c8d4" />
                      <stop offset="60%" stopColor="#8a9bb0" />
                      <stop offset="100%" stopColor="#5a6e85" />
                    </linearGradient>
                    <linearGradient id="shieldMetalRight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#cbd5e1" />
                      <stop offset="35%" stopColor="#94a3b8" />
                      <stop offset="60%" stopColor="#64748b" />
                      <stop offset="100%" stopColor="#3b4f65" />
                    </linearGradient>
                  </defs>
                  <path d="M12 2 L3 7 L3 12 C3 17.5 7 21.5 12 23 C12 23 12 23 12 23 L12 2 Z" fill="url(#shieldMetalLeft)" />
                  <path d="M12 2 L21 7 L21 12 C21 17.5 17 21.5 12 23 C12 23 12 23 12 23 L12 2 Z" fill="url(#shieldMetalRight)" />
                  <path d="M12 22C17.5 20.5 20 16.5 20 12V7.5L12 3L4 7.5V12C4 16.5 6.5 20.5 12 22Z" fill="none" stroke="#475569" strokeWidth="0.5" opacity="0.4" />
                </svg>
              </div>
              <EditableField value={psicodelicos?.tripleProtection?.title} jsonKey="purificacao.psicodelicos.tripleProtection.title" type="h2" className="purificacao-heading gold text-center" />

              <div className="purificacao-triple-grid">
                <div className="purificacao-triple-card">
                  <div className="purificacao-triple-icon sage"><Compass className="w-6 h-6" /></div>
                  <EditableField value={psicodelicos?.tripleProtection?.cards?.[0]?.title} jsonKey="purificacao.psicodelicos.tripleProtection.cards[0].title" type="h3" className="purificacao-subheading" />
                  <EditableField value={psicodelicos?.tripleProtection?.cards?.[0]?.description} jsonKey="purificacao.psicodelicos.tripleProtection.cards[0].description" type="p" className="purificacao-body" />
                </div>
                <div className="purificacao-triple-card">
                  <div className="purificacao-triple-icon fire"><Heart className="w-6 h-6" /></div>
                  <EditableField value={psicodelicos?.tripleProtection?.cards?.[1]?.title} jsonKey="purificacao.psicodelicos.tripleProtection.cards[1].title" type="h3" className="purificacao-subheading" />
                  <EditableField value={psicodelicos?.tripleProtection?.cards?.[1]?.description} jsonKey="purificacao.psicodelicos.tripleProtection.cards[1].description" type="p" className="purificacao-body" />
                </div>
                <div className="purificacao-triple-card">
                  <div className="purificacao-triple-icon gold"><Sun12Rays className="w-6 h-6" /></div>
                  <EditableField value={psicodelicos?.tripleProtection?.cards?.[2]?.title} jsonKey="purificacao.psicodelicos.tripleProtection.cards[2].title" type="h3" className="purificacao-subheading" />
                  <EditableField value={psicodelicos?.tripleProtection?.cards?.[2]?.description} jsonKey="purificacao.psicodelicos.tripleProtection.cards[2].description" type="p" className="purificacao-body" />
                </div>
              </div>

              {/* Testimonial banner */}
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

      {/* Rodapé — paisagem padronizada */}
      <footer className={FOOTER.sectionClass}>
        <div className="relative">
          <FooterBackground gradientId="skyGradientPurificacao" skyColors={['#0F1D35', '#182D4A', '#1E3855']} earthColor="#1a1a10" waterColors={['#0d3650', '#0a2d44', '#082538']} />

          <div className={FOOTER.containerClass}>
            <div className="max-w-section mx-auto text-center">
              <EditableField value={cta.title} jsonKey="purificacao.cta.title" type="h2" className={FOOTER.titleClass} />
              <EditableField value={cta.subtitle} jsonKey="purificacao.cta.subtitle" type="p" className={FOOTER.subtitleClass} />
              <Link to="/contato">
                <Button className={FOOTER.buttonClass}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <EditableField value={cta.buttonText} jsonKey="purificacao.cta.buttonText" type="span" className="inline" />
                </Button>
              </Link>
            </div>

            <div>
              <EditableField
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value={(texts as any).__shared__?.footer?.copyright}
                jsonKey="__shared__.footer.copyright"
                type="p"
                className={FOOTER.copyrightClass}
              />
              <EditableField
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value={(texts as any).__shared__?.footer?.trademark}
                jsonKey="__shared__.footer.trademark"
                type="p"
                className={FOOTER.trademarkClass}
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
