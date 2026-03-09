/**
 * Quem Somos — Redesign V8 (visitor-centered)
 *
 * Flow: Why We Exist → Origin Story → Igreja+Instituto → Principles → Hermetics → Magia → Footer
 * Sage-emerald accent (#3D7B5F). Dense content in accordions with summaries.
 * Scoped under `.ds-new.ds-qs` — styles in styles/layouts/pages/quemsomos.css
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Sparkles, Stethoscope, ChevronDown,
  Compass, ScrollText, Layers,
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EditableField from '@/components/ui/EditableField';
import { useGlossary } from '@/hooks/useGlossary';
import { usePageContent } from '@/hooks/useContent';
import { usePageStyles } from '@/hooks/usePageStyles';
import { PageLoading } from '@/components/PageLoading';
import { FooterBackground } from '@/components/FooterBackground';
import { FOOTER } from '@/components/footer-constants';
import { Button } from '@/components/ui/button';
import '@/styles/layouts/pages/quemsomos.css';

interface QuemSomosTexts {
  header: { title: string; subtitle: string };
  origin?: { title: string; content: string };
  manifesto?: {
    title: string;
    subtitle: string;
    items: string[];
    buddhaIntro: string;
    buddhaQuote: string;
    buddhaAttribution: string;
  };
  dualNature?: {
    title: string;
    igreja: { title: string; content: string };
    instituto: { title: string; content: string };
  };
  principios_unificados?: {
    title: string;
    summary?: string;
    items: { title: string; content: string }[];
  };
  hermeticos?: {
    title: string;
    subtitle?: string;
    summary?: string;
    items: { number: string; title: string; quote?: string; description: string }[];
  };
  magia?: {
    title: string;
    introducao?: string[];
    caracteristicas?: {
      title: string;
      items: { title: string; content: string }[];
    };
  };
  cta?: { title: string; subtitle: string; buttonText: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function QuemSomos() {
  const stylesLoaded = usePageStyles('quemsomos');
  const { data: texts, loading, error } = usePageContent<QuemSomosTexts>('quemsomos', {
    includePages: ['__shared__'],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const GLOSSARY = useGlossary((texts as any)?.__shared__);
  void GLOSSARY;

  const [magiaOpen, setMagiaOpen] = useState(false);

  if (!texts || !stylesLoaded || loading) {
    return (
      <PageLoading
        icon={BookOpen}
        text="Carregando..."
        bgColor="bg-gradient-to-b from-stone-50 to-stone-100"
        iconColor="text-emerald-600"
        textColor="text-stone-800"
      />
    );
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
  }

  return (
    <div className="ds-new ds-qs min-h-screen">
      {/* ==================== HERO ==================== */}
      <section className="qs-hero">
        <div className="qs-hero-inner max-w-section mx-auto">
          <div className="qs-hero-icon">
            <img
              src="/logo-metatron-sem-asas-gold.svg"
              alt="Logo Igreja de Metatron"
              className="w-20 h-20"
            />
          </div>

          <EditableField
            value={texts.header?.title}
            jsonKey="quemsomos.header.title"
            type="h1"
            className=""
          />

          <EditableField
            value={texts.header?.subtitle}
            jsonKey="quemsomos.header.subtitle"
            type="p"
            className="qs-hero-sub"
          />

          <div className="qs-hero-buttons">
            <Link to="/contato">
              <Button className="qs-btn qs-btn-sage">
                Fale Conosco
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== ORIGIN STORY ==================== */}
      <section className="qs-section">
        <div className="qs-card qs-origin-card max-w-section mx-auto">
          <EditableField
            value={texts.origin?.title}
            jsonKey="quemsomos.origin.title"
            type="h2"
            className="qs-origin-title"
          />
          <div className="qs-gold-divider" />
          <EditableField
            value={texts.origin?.content}
            jsonKey="quemsomos.origin.content"
            type="p"
            className="qs-origin-body whitespace-pre-line"
          />
        </div>
      </section>

      {/* ==================== MANIFESTO DE PRINCÍPIOS ==================== */}
      <section className="qs-section qs-manifesto-section">
        <div className="max-w-section mx-auto">
          <div className="qs-manifesto-icon">
            <img
              src="/logo-metatron-asas-gold-svgo.svg"
              alt="Logo Igreja de Metatron"
              className="w-58 h-auto"
            />
          </div>

          <EditableField
            value={texts.manifesto?.title}
            jsonKey="quemsomos.manifesto.title"
            type="h2"
            className="qs-manifesto-title"
          />
          <EditableField
            value={texts.manifesto?.subtitle}
            jsonKey="quemsomos.manifesto.subtitle"
            type="p"
            className="qs-manifesto-subtitle"
          />

          <div className="qs-manifesto-divider" />

          <div className="qs-manifesto-items">
            {(texts.manifesto?.items || []).map((item: string, idx: number) => (
              <div key={idx} className="qs-manifesto-item">
                <EditableField
                  value={item}
                  jsonKey={`quemsomos.manifesto.items[${idx}]`}
                  type="p"
                  className=""
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== BUDDHA QUOTE CALLOUT ==================== */}
      <section className="qs-section qs-buddha-section">
        <div className="qs-buddha-card max-w-section mx-auto">
          <div className="qs-buddha-block">
            <EditableField
              value={texts.manifesto?.buddhaIntro}
              jsonKey="quemsomos.manifesto.buddhaIntro"
              type="p"
              className="qs-buddha-intro"
            />
            <EditableField
              value={texts.manifesto?.buddhaQuote}
              jsonKey="quemsomos.manifesto.buddhaQuote"
              type="p"
              className="qs-buddha-quote whitespace-pre-line"
            />
            <EditableField
              value={texts.manifesto?.buddhaAttribution}
              jsonKey="quemsomos.manifesto.buddhaAttribution"
              type="p"
              className="qs-buddha-attribution"
            />
          </div>
        </div>
      </section>

      {/* ==================== DUAL NATURE — Igreja + Instituto ==================== */}
      <section className="qs-section qs-section-bridge">
        <div className="max-w-section mx-auto">
          <EditableField
            value={texts.dualNature?.title}
            jsonKey="quemsomos.dualNature.title"
            type="h2"
            className="qs-bridge-title"
          />

          <div className="qs-dual-grid">
            {/* Igreja Card */}
            <div className="qs-dual-card igreja">
              <div className="qs-dual-icon">
                <Sparkles className="w-7 h-7" />
              </div>
              <EditableField
                value={texts.dualNature?.igreja?.title}
                jsonKey="quemsomos.dualNature.igreja.title"
                type="h3"
                className="qs-dual-card-title"
              />
              <EditableField
                value={texts.dualNature?.igreja?.content}
                jsonKey="quemsomos.dualNature.igreja.content"
                type="p"
                className="qs-dual-card-body whitespace-pre-line"
              />
            </div>

            {/* Instituto Card */}
            <div className="qs-dual-card instituto">
              <div className="qs-dual-icon">
                <Stethoscope className="w-7 h-7" />
              </div>
              <EditableField
                value={texts.dualNature?.instituto?.title}
                jsonKey="quemsomos.dualNature.instituto.title"
                type="h3"
                className="qs-dual-card-title"
              />
              <EditableField
                value={texts.dualNature?.instituto?.content}
                jsonKey="quemsomos.dualNature.instituto.content"
                type="p"
                className="qs-dual-card-body whitespace-pre-line"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PRINCIPIOS UNIFICADOS ==================== */}
      <section className="qs-section qs-accordion-section">
        <div className="qs-card max-w-section mx-auto">
          <div className="qs-accordion-icon">
            <ScrollText className="w-10 h-10" />
          </div>
          <EditableField
            value={texts.principios_unificados?.title}
            jsonKey="quemsomos.principios_unificados.title"
            type="h2"
            className="qs-accordion-title"
          />
          <EditableField
            value={texts.principios_unificados?.summary}
            jsonKey="quemsomos.principios_unificados.summary"
            type="p"
            className="qs-accordion-summary"
          />

          <div className="qs-accordion-wrapper">
            <Accordion type="multiple">
              {(texts.principios_unificados?.items || [])
                .slice(0, 12)
                .map((item: { title: string; content: string } | null, idx: number) => {
                  if (!item?.title && !item?.content) return null;
                  return (
                    <AccordionItem
                      key={idx}
                      value={`principio-${idx}`}
                      className="qs-accordion-item border-0"
                    >
                      <AccordionTrigger className="qs-accordion-trigger hover:no-underline [&>svg]:text-(--qs-accent-muted) [&>svg]:w-5 [&>svg]:h-5">
                        <span className="qs-accordion-number">{idx + 1}</span>
                        <EditableField
                          value={item.title}
                          jsonKey={`quemsomos.principios_unificados.items[${idx}].title`}
                          type="span"
                          className=""
                        />
                      </AccordionTrigger>
                      <AccordionContent className="qs-accordion-content">
                        <EditableField
                          value={item.content}
                          jsonKey={`quemsomos.principios_unificados.items[${idx}].content`}
                          type="p"
                          className=""
                        />
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ==================== FUNDAMENTOS HERMÉTICOS ==================== */}
      <section className="qs-section qs-accordion-section">
        <div className="qs-card max-w-section mx-auto">
          <div className="qs-accordion-icon">
            <Compass className="w-10 h-10" />
          </div>
          <EditableField
            value={texts.hermeticos?.title}
            jsonKey="quemsomos.hermeticos.title"
            type="h2"
            className="qs-accordion-title"
          />
          {texts.hermeticos?.subtitle && (
            <EditableField
              value={texts.hermeticos.subtitle}
              jsonKey="quemsomos.hermeticos.subtitle"
              type="p"
              className="qs-accordion-summary"
            />
          )}
          <EditableField
            value={texts.hermeticos?.summary}
            jsonKey="quemsomos.hermeticos.summary"
            type="p"
            className="qs-accordion-summary"
          />

          <div className="qs-accordion-wrapper">
            <Accordion type="multiple">
              {Array.from({ length: 7 }).map((_, idx) => {
                const item = texts.hermeticos?.items?.[idx] || { number: String(idx + 1), title: '', description: '' };
                return (
                  <AccordionItem
                    key={idx}
                    value={`hermetico-${idx}`}
                    className="qs-accordion-item border-0"
                  >
                    <AccordionTrigger className="qs-accordion-trigger hover:no-underline [&>svg]:text-(--qs-accent-muted) [&>svg]:w-5 [&>svg]:h-5">
                      <span className="qs-accordion-number">{item.number || idx + 1}</span>
                      <EditableField
                        value={item.title}
                        jsonKey={`quemsomos.hermeticos.items[${idx}].title`}
                        type="span"
                        className=""
                      />
                    </AccordionTrigger>
                    <AccordionContent className="qs-accordion-content">
                      {item.quote && (
                        <div className="qs-accordion-quote">
                          &ldquo;<EditableField
                            value={item.quote}
                            jsonKey={`quemsomos.hermeticos.items[${idx}].quote`}
                            type="span"
                            className="inline"
                          />&rdquo;
                        </div>
                      )}
                      <EditableField
                        value={item.description}
                        jsonKey={`quemsomos.hermeticos.items[${idx}].description`}
                        type="p"
                        className=""
                      />
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ==================== MAGIA DIVINA ==================== */}
      {texts.magia && (
        <section className="qs-section qs-magia-section">
          <div className="qs-card max-w-section mx-auto">
            <div className="qs-accordion-icon">
              <Layers className="w-10 h-10 text-(--ds-sacred-gold)" />
            </div>

            <button
              className="qs-magia-toggle"
              onClick={() => setMagiaOpen(!magiaOpen)}
              {...{ 'aria-expanded': magiaOpen }}
              aria-label="Expandir seção Magia Divina"
            >
              <EditableField
                value={texts.magia.title}
                jsonKey="quemsomos.magia.title"
                type="span"
                className=""
              />
              <ChevronDown className={`qs-magia-chevron ${magiaOpen ? 'open' : ''}`} />
            </button>

            <div className={`qs-magia-body ${magiaOpen ? 'open' : ''}`}>
              <div className="qs-magia-content">
                {texts.magia.introducao?.map((paragraph: string, index: number) => (
                  <div key={index} className="qs-magia-paragraph">
                    <EditableField
                      value={paragraph}
                      jsonKey={`quemsomos.magia.introducao[${index}]`}
                      type="p"
                      className=""
                    />
                  </div>
                ))}

                {texts.magia.caracteristicas && (
                  <div className="mt-6">
                    <EditableField
                      value={texts.magia.caracteristicas.title}
                      jsonKey="quemsomos.magia.caracteristicas.title"
                      type="h4"
                      className="qs-magia-feature-title"
                    />
                    {texts.magia.caracteristicas.items?.map(
                      (item: { title: string; content: string }, index: number) => (
                        <div key={index} className="qs-magia-feature-item">
                          <EditableField
                            value={item.title}
                            jsonKey={`quemsomos.magia.caracteristicas.items[${index}].title`}
                            type="h5"
                            className=""
                          />
                          <EditableField
                            value={item.content}
                            jsonKey={`quemsomos.magia.caracteristicas.items[${index}].content`}
                            type="p"
                            className=""
                          />
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== FOOTER ==================== */}
      <footer className={FOOTER.sectionClass}>
        <div className="relative">
          <FooterBackground
            gradientId="skyGradientQuemSomos"
            skyColors={['#60a5fa', '#93c5fd', '#bae6fd']}
            earthColor="#7c6a42"
            waterColors={['#34d399', '#10b981', '#059669']}
          />

          <div className={FOOTER.containerClass}>
            <div className="max-w-section mx-auto text-center">
              <EditableField
                value={texts.cta?.title}
                jsonKey="quemsomos.cta.title"
                type="h2"
                className={FOOTER.titleClass}
              />
              <EditableField
                value={texts.cta?.subtitle}
                jsonKey="quemsomos.cta.subtitle"
                type="p"
                className={FOOTER.subtitleClass}
              />
              <Link to="/contato">
                <Button className={FOOTER.buttonClass}>
                  <EditableField
                    value={texts.cta?.buttonText}
                    jsonKey="quemsomos.cta.buttonText"
                    type="span"
                    className="inline"
                  />
                </Button>
              </Link>
            </div>

            <div>
              <EditableField
                value={(texts as Record<string, Record<string, Record<string, string>>>).__shared__?.footer?.copyright}
                jsonKey="__shared__.footer.copyright"
                type="p"
                className={FOOTER.copyrightClass}
              />
              <EditableField
                value={(texts as Record<string, Record<string, Record<string, string>>>).__shared__?.footer?.trademark}
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
