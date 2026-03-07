/**
 * Tratamentos — Redesign V8 (visitor-centered)
 *
 * Flow: Empathy → Validation → Approach → Modalities (expandable) → Trust → Action
 * Clinical blue accent (#2563EB). Techniques shown in accordions, not as primary content.
 * Scoped under `.ds-new.ds-trat` — styles in styles/layouts/pages/tratamentos.css
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Brain, Wind, Sparkles, Activity, Stethoscope,
  HeartHandshake, Compass, Sun, AlertTriangle, MessageCircle,
  Flower2, Route,
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EditableField from '@/components/ui/EditableField';
import { usePageContent } from '@/hooks/useContent';
import { usePageStyles } from '@/hooks/usePageStyles';
import { PageLoading } from '@/components/PageLoading';
import { FooterBackground } from '@/components/FooterBackground';
import { FOOTER } from '@/components/footer-constants';
import { Button } from '@/components/ui/button';

const WHATSAPP_NUMBER = '5511949555555';
const whatsappUrl = (msg: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const TREATMENT_ICONS = [
  <Stethoscope key="psy" className="w-6 h-6" />,
  <Brain key="neuro" className="w-6 h-6" />,
  <Wind key="breath" className="w-6 h-6" />,
  <Route key="emdr" className="w-6 h-6" />,
  <Heart key="bio" className="w-6 h-6" />,
  <Flower2 key="cbd" className="w-6 h-6" />,
  <HeartHandshake key="pap" className="w-6 h-6" />,
  <Sparkles key="extra" className="w-6 h-6" />,
];

export default function Tratamentos() {
  const stylesLoaded = usePageStyles('tratamentos');
  const [showLegal, setShowLegal] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: texts, loading } = usePageContent<any>('tratamentos', {
    includePages: ['__shared__'],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: indexTexts } = usePageContent<any>('index');

  if (!texts || !stylesLoaded || loading) {
    return (
      <PageLoading
        icon={Stethoscope}
        text="Carregando tratamentos..."
        bgColor="bg-gradient-to-b from-slate-50 to-blue-50"
        iconColor="text-blue-600"
        textColor="text-blue-900"
      />
    );
  }

  const treatments = texts.treatments || [];

  return (
    <div className="ds-new ds-trat min-h-screen">
      {/* ==================== HERO ==================== */}
      <section className="ds-hero">
        <div className="ds-hero-inner max-w-section mx-auto">
          <div className="dt-hero-icon">
            <Stethoscope className="w-10 h-10" />
          </div>

          <EditableField
            value={texts.header?.title}
            jsonKey="tratamentos.header.title"
            type="h1"
            className=""
          />

          <p className="ds-hero-sub">
            <EditableField
              value={texts.header?.subtitle}
              jsonKey="tratamentos.header.subtitle"
              type="span"
              className=""
            />
          </p>

          <div className="ds-hero-buttons">
            <a
              href={whatsappUrl('Olá! Gostaria de saber mais sobre os tratamentos terapêuticos.')}
              target="_blank"
              rel="noopener noreferrer"
              className="ds-btn ds-btn-blue"
              aria-label="Iniciar conversa no WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <EditableField
                value={texts.hero?.primaryCta}
                jsonKey="tratamentos.hero.primaryCta"
                type="span"
                className="inline"
              />
            </a>
            <Link to="/purificacao" className="ds-btn ds-btn-ghost-blue ds-btn-hero-ghost">
              <EditableField
                value={texts.hero?.secondaryCta}
                jsonKey="tratamentos.hero.secondaryCta"
                type="span"
                className="inline"
              />
              <span className="ds-arrow">›</span>
            </Link>
          </div>
        </div>

        {/* Legal tooltip */}
        <div className="dt-legal-trigger">
          <div
            className="dt-legal-dot"
            onClick={() => setShowLegal(!showLegal)}
            onMouseEnter={() => setShowLegal(true)}
            onMouseLeave={() => setShowLegal(false)}
          >
            <AlertTriangle className="w-4 h-4 text-stone-700" />
          </div>
          <div
            className={`dt-legal-tooltip ${showLegal ? 'visible' : ''}`}
            onMouseEnter={() => setShowLegal(true)}
            onMouseLeave={() => setShowLegal(false)}
          >
            <div className="dt-legal-content">
              <EditableField
                value={texts.legal?.title}
                jsonKey="tratamentos.legal.title"
                type="h4"
                className=""
              />
              <EditableField
                value={texts.legal?.notice}
                jsonKey="tratamentos.legal.notice"
                type="p"
                className=""
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== REDESCUBRA (from index.instituto) ==================== */}
      {indexTexts && (
        <section className="dt-section-redescubra">
          <div className="dt-redescubra-inner max-w-section mx-auto">
            <h2 className="ds-section-heading">
              <EditableField
                value={indexTexts?.instituto?.firstCallTitle}
                jsonKey="index.instituto.firstCallTitle"
                type="span"
                className=""
              />
            </h2>

            {indexTexts?.instituto?.firstCall?.[0] && (
              <div className="dt-redescubra-quote">
                <EditableField
                  value={indexTexts.instituto.firstCall[0]}
                  jsonKey="index.instituto.firstCall[0]"
                  type="p"
                  className=""
                />
              </div>
            )}

            {indexTexts?.instituto?.firstCall?.length > 2 && (
              <div className="dt-redescubra-body">
                {indexTexts.instituto.firstCall.slice(1, -1).map((p: string, i: number) => (
                  <div key={i} className="dt-redescubra-item">
                    <div className="dt-redescubra-dot" />
                    <EditableField
                      value={p}
                      jsonKey={`index.instituto.firstCall[${i + 1}]`}
                      type="p"
                      className=""
                    />
                  </div>
                ))}
              </div>
            )}

            {(indexTexts?.instituto?.firstCallList?.length || 0) > 0 && (
              <div className="dt-checklist-box">
                {indexTexts?.instituto?.firstCall?.length > 1 && (
                  <div className="dt-checklist-title">
                    <EditableField
                      value={indexTexts.instituto.firstCall[indexTexts.instituto.firstCall.length - 1]}
                      jsonKey={`index.instituto.firstCall[${indexTexts.instituto.firstCall.length - 1}]`}
                      type="span"
                      className=""
                    />
                  </div>
                )}
                <div className="dt-checklist-grid">
                  {indexTexts.instituto.firstCallList.map((li: string, i: number) => (
                    <div key={i} className="dt-checklist-item">
                      <div className="dt-check">✓</div>
                      <EditableField
                        value={li}
                        jsonKey={`index.instituto.firstCallList[${i}]`}
                        type="span"
                        className=""
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {indexTexts?.instituto?.firstCallFooter && (
              <div className="dt-redescubra-footer">
                <EditableField
                  value={indexTexts.instituto.firstCallFooter}
                  jsonKey="index.instituto.firstCallFooter"
                  type="p"
                  className=""
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ==================== BRIDGE (approach) ==================== */}
      <section className="ds-section-bridge">
        <div className="ds-bridge-inner max-w-section mx-auto">
          <p className="ds-bridge-preamble">
            <EditableField
              value={texts.approach?.content}
              jsonKey="tratamentos.approach.content"
              type="span"
              className=""
            />
          </p>
          <h2 className="ds-bridge-title">
            <EditableField
              value={texts.approach?.title}
              jsonKey="tratamentos.approach.title"
              type="span"
              className=""
            />
          </h2>
          <div className="ds-bridge-body">
            <EditableField
              value={texts.intro?.p1}
              jsonKey="tratamentos.intro.p1"
              type="p"
              className=""
            />
          </div>
          <div className="ds-bridge-highlight">
            <EditableField
              value={texts.intro?.p2}
              jsonKey="tratamentos.intro.p2"
              type="p"
              className=""
            />
          </div>
        </div>
      </section>

      {/* ==================== MODALITIES (accordion) ==================== */}
      <section className="dt-section-modalities">
        <div className="dt-modalities-inner max-w-section mx-auto">
          <h2 className="ds-section-heading">
            <EditableField
              value={texts.sections?.treatments_title}
              jsonKey="tratamentos.sections.treatments_title"
              type="span"
              className=""
            />
          </h2>
          <p className="ds-section-sub">
            <EditableField
              value={texts.modalities?.description}
              jsonKey="tratamentos.modalities.description"
              type="span"
              className=""
            />
          </p>

          <Accordion type="multiple" className="flex flex-col gap-4 mt-6">
            {treatments.map((treatment: Record<string, string>, index: number) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="dt-accordion-item border-0"
              >
                <AccordionTrigger className="dt-accordion-trigger hover:no-underline [&>svg]:text-slate-400 [&>svg]:w-5 [&>svg]:h-5">
                  <div className="dt-trigger-icon">
                    {TREATMENT_ICONS[index] || <Activity className="w-6 h-6" />}
                  </div>
                  <div className="dt-trigger-text">
                    <EditableField
                      value={treatment.title}
                      jsonKey={`tratamentos.treatments[${index}].title`}
                      type="h3"
                      className=""
                    />
                    <EditableField
                      value={treatment.description}
                      jsonKey={`tratamentos.treatments[${index}].description`}
                      type="p"
                      className=""
                    />
                  </div>
                </AccordionTrigger>

                <AccordionContent className="dt-accordion-content">
                  {treatment.details && (
                    <div className="dt-detail-block dt-block-about">
                      <h4>
                        <Activity className="w-4 h-4" />
                        <EditableField
                          value={texts.labels?.about}
                          jsonKey="tratamentos.labels.about"
                          type="span"
                          className="inline"
                        />
                      </h4>
                      <EditableField
                        value={treatment.details}
                        jsonKey={`tratamentos.treatments[${index}].details`}
                        type="p"
                        className=""
                      />
                    </div>
                  )}

                  {treatment.indications && (
                    <div className="dt-detail-block dt-block-indications">
                      <h4>
                        <EditableField
                          value={texts.labels?.indications}
                          jsonKey="tratamentos.labels.indications"
                          type="span"
                          className="inline"
                        />
                      </h4>
                      <EditableField
                        value={treatment.indications}
                        jsonKey={`tratamentos.treatments[${index}].indications`}
                        type="p"
                        className=""
                      />
                    </div>
                  )}

                  {treatment.benefits && (
                    <div className="dt-detail-block dt-block-benefits">
                      <h4>
                        <EditableField
                          value={texts.labels?.benefits}
                          jsonKey="tratamentos.labels.benefits"
                          type="span"
                          className="inline"
                        />
                      </h4>
                      {Array.isArray(treatment.benefits) ? (
                        <ul>
                          {treatment.benefits.map((b: string, bi: number) => (
                            <li key={bi}>
                              <EditableField
                                value={b}
                                jsonKey={`tratamentos.treatments[${index}].benefits[${bi}]`}
                                type="span"
                                className="inline"
                              />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <EditableField
                          value={treatment.benefits}
                          jsonKey={`tratamentos.treatments[${index}].benefits`}
                          type="p"
                          className=""
                        />
                      )}
                    </div>
                  )}

                  {treatment.contraindications && (
                    <div className="dt-detail-block dt-block-contra">
                      <h4>
                        <AlertTriangle className="w-4 h-4" />
                        <EditableField
                          value={texts.labels?.contraindications}
                          jsonKey="tratamentos.labels.contraindications"
                          type="span"
                          className="inline"
                        />
                      </h4>
                      {Array.isArray(treatment.contraindications) ? (
                        <ul>
                          {treatment.contraindications.map((c: string, ci: number) => (
                            <li key={ci}>
                              <EditableField
                                value={c}
                                jsonKey={`tratamentos.treatments[${index}].contraindications[${ci}]`}
                                type="span"
                                className="inline"
                              />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <EditableField
                          value={treatment.contraindications}
                          jsonKey={`tratamentos.treatments[${index}].contraindications`}
                          type="p"
                          className=""
                        />
                      )}
                    </div>
                  )}

                  <div className="dt-detail-meta">
                    {treatment.duration && (
                      <div className="dt-meta-block">
                        <EditableField
                          value={texts.labels?.duration}
                          jsonKey="tratamentos.labels.duration"
                          type="h5"
                          className=""
                        />
                        <EditableField
                          value={treatment.duration}
                          jsonKey={`tratamentos.treatments[${index}].duration`}
                          type="p"
                          className=""
                        />
                      </div>
                    )}
                    {treatment.professional && (
                      <div className="dt-meta-block">
                        <EditableField
                          value={texts.labels?.professional}
                          jsonKey="tratamentos.labels.professional"
                          type="h5"
                          className=""
                        />
                        <EditableField
                          value={treatment.professional}
                          jsonKey={`tratamentos.treatments[${index}].professional`}
                          type="p"
                          className=""
                        />
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ==================== TRIPLA PROTECAO ==================== */}
      <section className="dt-section-protection">
        <div className="dt-protection-inner max-w-section mx-auto">
          <div className="dt-shield-wrap">
            <svg className="dt-shield-icon" width="56" height="56" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="shieldMetalLeftTrat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e8ecf1" />
                  <stop offset="35%" stopColor="#c0c8d4" />
                  <stop offset="60%" stopColor="#8a9bb0" />
                  <stop offset="100%" stopColor="#5a6e85" />
                </linearGradient>
                <linearGradient id="shieldMetalRightTrat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="35%" stopColor="#94a3b8" />
                  <stop offset="60%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#3b4f65" />
                </linearGradient>
              </defs>
              <path d="M12 2 L3 7 L3 12 C3 17.5 7 21.5 12 23 C12 23 12 23 12 23 L12 2 Z" fill="url(#shieldMetalLeftTrat)" />
              <path d="M12 2 L21 7 L21 12 C21 17.5 17 21.5 12 23 C12 23 12 23 12 23 L12 2 Z" fill="url(#shieldMetalRightTrat)" />
              <path d="M12 22C17.5 20.5 20 16.5 20 12V7.5L12 3L4 7.5V12C4 16.5 6.5 20.5 12 22Z" fill="none" stroke="#475569" strokeWidth="0.5" opacity="0.4" />
            </svg>
          </div>
          <h2 className="dt-protection-title">
            <EditableField
              value={texts.triplaProtecao?.title}
              jsonKey="tratamentos.triplaProtecao.title"
              type="span"
              className=""
            />
          </h2>
          <p className="dt-protection-subtitle">
            <EditableField
              value={texts.triplaProtecao?.subtitle}
              jsonKey="tratamentos.triplaProtecao.subtitle"
              type="span"
              className=""
            />
          </p>

          <div className="dt-protection-grid">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {texts.triplaProtecao?.items?.map((item: any, i: number) => {
              const icons = [Compass, Heart, Sun];
              const iconClasses = ['dt-prot-icon-tech', 'dt-prot-icon-human', 'dt-prot-icon-spirit'];
              const Icon = icons[i];

              const cardClasses = ['dt-prot-card-tech', 'dt-prot-card-human', 'dt-prot-card-spirit'];
              return (
                <div key={i} className={`dt-protection-card ${cardClasses[i] ?? ''}`}>
                  <div className={`dt-protection-card-icon ${iconClasses[i]}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <EditableField
                    value={item.title}
                    jsonKey={`tratamentos.triplaProtecao.items[${i}].title`}
                    type="h4"
                    className=""
                  />
                  <EditableField
                    value={item.description}
                    jsonKey={`tratamentos.triplaProtecao.items[${i}].description`}
                    type="p"
                    className=""
                  />
                </div>
              );
            })}
          </div>

          {/* Testimonial banner */}
          <div className="dt-testimonial-banner">
            <div className="dt-testimonial-left">
              <div className="dt-testimonial-icon">
                <Heart className="w-4 h-4" />
              </div>
              <div className="dt-testimonial-text">
                <EditableField
                  value={texts.triplaProtecao?.footerMessage}
                  jsonKey="tratamentos.triplaProtecao.footerMessage"
                  type="span"
                  className=""
                />
              </div>
            </div>
            <Link to="/testemunhos" className="dt-testimonial-btn">
              <EditableField
                value={texts.labels?.seeTestimonials}
                jsonKey="tratamentos.labels.seeTestimonials"
                type="span"
                className="inline"
              />
              <span className="dt-arrow">›</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER CTA (pre-dawn sky) ==================== */}
      <footer className={`ds-footer-section ${FOOTER.sectionClass}`}>
        <div className="relative">
          <FooterBackground
            gradientId="skyGradTrat"
            skyColors={['#0F1D2F', '#162840', '#1A3550']}
            earthColor="#1a1508"
            waterColors={['#0a3a4a', '#083040', '#062530']}
          />

          <div className={FOOTER.containerClass}>
            <div className="max-w-section mx-auto text-center">
              <EditableField
                value={texts.cta?.title}
                jsonKey="tratamentos.cta.title"
                type="h2"
                className={FOOTER.titleClass}
              />
              <EditableField
                value={texts.cta?.subtitle}
                jsonKey="tratamentos.cta.subtitle"
                type="p"
                className={FOOTER.subtitleClass}
              />
              <a
                href={whatsappUrl('Olá! Gostaria de agendar uma avaliação inicial para tratamentos.')}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Iniciar conversa no WhatsApp"
              >
                <Button className={FOOTER.buttonClass}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <EditableField
                    value={texts.cta?.buttonText}
                    jsonKey="tratamentos.cta.buttonText"
                    type="span"
                    className="inline"
                  />
                </Button>
              </a>
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
