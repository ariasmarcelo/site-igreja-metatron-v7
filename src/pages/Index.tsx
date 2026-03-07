/**
 * Index — Design System V2 (promoted from NewIndex)
 * 
 * Uses Supabase content via usePageContent('index').
 * Scoped under CSS class `.ds-new` — styles in styles/layouts/pages/index.css
 * Route: /
 */
import { Link } from 'react-router-dom';
import { Heart, Brain, Ghost, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import EditableField from '@/components/ui/EditableField';
import { Sun12Rays } from '../components/icons/Sun12Rays';
import { LogoGold } from '../components/icons/LogoGold';
import { usePageContent } from '@/hooks/useContent';
import { usePageStyles } from '@/hooks/usePageStyles';
import { PageLoading } from '@/components/PageLoading';
import { FooterBackground } from '@/components/FooterBackground';
import { FOOTER } from '@/components/footer-constants';
import { Button } from '@/components/ui/button';

interface IndexTexts {
  header: { title: string; subtitle: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function Index() {
  const stylesLoaded = usePageStyles('index');
  const { data: texts, loading } = usePageContent<IndexTexts>('index', { includePages: ['__shared__'] });

  if (!texts || !stylesLoaded || loading) {
    return (
      <PageLoading
        icon={Sparkles}
        text="Carregando..."
        bgColor="bg-gradient-to-b from-stone-50 to-stone-100"
        iconColor="text-amber-500"
        textColor="text-stone-800"
      />
    );
  }

  return (
    <div className="ds-new min-h-screen">

      {/* ==================== HERO (dark navy) ==================== */}
      <section className="ds-hero">
        <div className="ds-hero-inner max-w-section mx-auto">
          <div className="ds-hero-logo">
            <LogoGold className="w-190 h-auto" />
          </div>

          <EditableField
            value={texts.hero.title}
            jsonKey="index.hero.title"
            type="h1"
            className=""
          />

          <p className="ds-hero-sub">
            <EditableField
              value={texts.hero.subtitle}
              jsonKey="index.hero.subtitle"
              type="span"
              className=""
            />
          </p>

          <div className="ds-hero-buttons">
            <Link to="/purificacao" className="ds-btn ds-btn-gold">
              <EditableField
                value={texts.hero.buttons.purification}
                jsonKey="index.hero.buttons.purification"
                type="span"
                className="inline"
              />
              <span className="ds-arrow">›</span>
            </Link>
            <Link to="/tratamentos" className="ds-btn ds-btn-ghost-gold ds-btn-hero-ghost">
              <EditableField
                value={texts.hero.buttons.treatments}
                jsonKey="index.hero.buttons.treatments"
                type="span"
                className="inline"
              />
              <span className="ds-arrow">›</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== CHALLENGES ("Is what we suffer...") ==================== */}
      <section className="ds-section-challenges">
        <div className="ds-challenges-inner max-w-section mx-auto">
          <h2 className="ds-section-heading">
            <EditableField
              value={texts.fisicoEspiritual.title}
              jsonKey="index.fisicoEspiritual.title"
              type="span"
              className=""
            />
          </h2>
          <p className="ds-section-sub">
            <EditableField
              value={texts.fisicoEspiritual.subtitle}
              jsonKey="index.fisicoEspiritual.subtitle"
              type="span"
              className=""
            />
          </p>

          <div className="ds-challenge-cards">
            {/* SPIRITUAL (Church) */}
            <div className="ds-challenge-card spiritual">
              <div className="ds-challenge-header">
                <div className="ds-brand-icon church">
                  <Sun12Rays className="w-5 h-5" />
                </div>
                <div className="ds-challenge-title spiritual">
                  <EditableField
                    value={texts.fisicoEspiritual.espiritual.title}
                    jsonKey="index.fisicoEspiritual.espiritual.title"
                    type="span"
                    className=""
                  />
                </div>
              </div>
              <div className="ds-challenge-subtitle spiritual">
                <EditableField
                  value={texts.fisicoEspiritual.espiritual.subtitle}
                  jsonKey="index.fisicoEspiritual.espiritual.subtitle"
                  type="span"
                  className=""
                />
              </div>
              <div className="ds-challenge-desc">
                <EditableField
                  value={texts.fisicoEspiritual.espiritual.description}
                  jsonKey="index.fisicoEspiritual.espiritual.description"
                  type="span"
                  className=""
                />
              </div>
              <ul className="ds-challenge-list">
                {texts.fisicoEspiritual.espiritual.items.map((item: string, i: number) => (
                  <li key={i}>
                    <EditableField
                      value={item}
                      jsonKey={`index.fisicoEspiritual.espiritual.items[${i}]`}
                      type="span"
                      className=""
                    />
                  </li>
                ))}
              </ul>
              <Link to="/purificacao" className="ds-btn ds-btn-gold ds-btn-sm">
                <EditableField
                  value={texts.fisicoEspiritual.espiritual.buttonText}
                  jsonKey="index.fisicoEspiritual.espiritual.buttonText"
                  type="span"
                  className="inline"
                />
                <span className="ds-arrow">›</span>
              </Link>
            </div>

            {/* CLINICAL (Institute) */}
            <div className="ds-challenge-card clinical">
              <div className="ds-challenge-header">
                <div className="ds-brand-icon institute">
                  <Brain className="w-5 h-5" />
                </div>
                <div className="ds-challenge-title clinical">
                  <EditableField
                    value={texts.fisicoEspiritual.fisico.title}
                    jsonKey="index.fisicoEspiritual.fisico.title"
                    type="span"
                    className=""
                  />
                </div>
              </div>
              <div className="ds-challenge-subtitle clinical">
                <EditableField
                  value={texts.fisicoEspiritual.fisico.subtitle}
                  jsonKey="index.fisicoEspiritual.fisico.subtitle"
                  type="span"
                  className=""
                />
              </div>
              <div className="ds-challenge-desc">
                <EditableField
                  value={texts.fisicoEspiritual.fisico.description}
                  jsonKey="index.fisicoEspiritual.fisico.description"
                  type="span"
                  className=""
                />
              </div>
              <ul className="ds-challenge-list">
                {texts.fisicoEspiritual.fisico.items.map((item: string, i: number) => (
                  <li key={i}>
                    <EditableField
                      value={item}
                      jsonKey={`index.fisicoEspiritual.fisico.items[${i}]`}
                      type="span"
                      className=""
                    />
                  </li>
                ))}
              </ul>
              <Link to="/tratamentos" className="ds-btn ds-btn-sage ds-btn-sm">
                <EditableField
                  value={texts.fisicoEspiritual.fisico.buttonText}
                  jsonKey="index.fisicoEspiritual.fisico.buttonText"
                  type="span"
                  className="inline"
                />
                <span className="ds-arrow">›</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== JOURNEY ("One Journey, Two Stages") ==================== */}
      <section className="ds-section-journey">
        <div className="ds-journey-inner max-w-section mx-auto">
          <h2 className="ds-section-heading">
            <EditableField
              value={texts.caminhos?.title}
              jsonKey="index.caminhos.title"
              type="span"
              className=""
            />
          </h2>
          <div className="ds-sun-divider" />

          <div className="ds-journey-cards">
            {/* INSTITUTO */}
            <div className="ds-journey-card institute">
              <div className="ds-journey-card-header">
                <div className="ds-brand-icon institute">
                  <Brain className="w-5 h-5" />
                </div>
                <div className="ds-journey-card-name institute">
                  <EditableField
                    value={texts.instituto?.title}
                    jsonKey="index.instituto.title"
                    type="span"
                    className=""
                  />
                </div>
              </div>
              <div className="ds-journey-card-desc">
                <EditableField
                  value={texts.caminhos?.instituto?.resumo}
                  jsonKey="index.caminhos.instituto.resumo"
                  type="span"
                  className=""
                />
              </div>
              <ul className="ds-journey-list">
                {texts.caminhos?.instituto?.items?.map((item: string, i: number) => (
                  <li key={i}>
                    <span className="ds-check institute">✓</span>
                    <EditableField
                      value={item}
                      jsonKey={`index.caminhos.instituto.items[${i}]`}
                      type="span"
                      className=""
                    />
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link to="/tratamentos" className="ds-btn ds-btn-sage ds-btn-full">
                  <EditableField
                    value={texts.caminhos?.instituto?.button}
                    jsonKey="index.caminhos.instituto.button"
                    type="span"
                    className="inline"
                  />
                  <span className="ds-arrow">›</span>
                </Link>
              </div>
            </div>

            {/* IGREJA */}
            <div className="ds-journey-card church">
              <div className="ds-journey-card-header">
                <div className="ds-brand-icon church">
                  <Sun12Rays className="w-5 h-5" />
                </div>
                <div className="ds-journey-card-name church">
                  <EditableField
                    value={texts.igreja?.title}
                    jsonKey="index.igreja.title"
                    type="span"
                    className=""
                  />
                </div>
              </div>
              <div className="ds-journey-card-desc">
                <EditableField
                  value={texts.caminhos?.igreja?.resumo}
                  jsonKey="index.caminhos.igreja.resumo"
                  type="span"
                  className=""
                />
              </div>
              <ul className="ds-journey-list">
                {texts.caminhos?.igreja?.items?.map((item: string, i: number) => (
                  <li key={i}>
                    <span className="ds-check church">✓</span>
                    <EditableField
                      value={item}
                      jsonKey={`index.caminhos.igreja.items[${i}]`}
                      type="span"
                      className=""
                    />
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link to="/purificacao" className="ds-btn ds-btn-gold ds-btn-full">
                  <EditableField
                    value={texts.caminhos?.igreja?.button}
                    jsonKey="index.caminhos.igreja.button"
                    type="span"
                    className="inline"
                  />
                  <span className="ds-arrow">›</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW CAN WE HELP ==================== */}
      <section className="ds-section-help">
        <div className="ds-help-inner max-w-section mx-auto">
          <h2 className="ds-section-heading">
            <EditableField
              value={texts.benefitsSection.title}
              jsonKey="index.benefitsSection.title"
              type="span"
              className=""
            />
          </h2>
          <p className="ds-section-sub">
            <EditableField
              value={texts.benefitsSection.subtitle}
              jsonKey="index.benefitsSection.subtitle"
              type="span"
              className=""
            />
          </p>

          <div className="ds-pillars-grid">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {texts.instituto.benefits.map((b: any, i: number) => (
              <div key={i} className="ds-pillar-card">
                <div className={`ds-pillar-icon ${i === 0 ? 'warm' : i === 1 ? 'balanced' : 'growth'}`}>
                  {i === 0 && <Sun12Rays className="w-6 h-6" />}
                  {i === 1 && <Brain className="w-6 h-6" />}
                  {i === 2 && <TrendingUp className="w-6 h-6" />}
                </div>
                <h3>
                  <EditableField
                    value={b.title}
                    jsonKey={`index.instituto.benefits[${i}].title`}
                    type="span"
                    className=""
                  />
                </h3>
                <p>
                  <EditableField
                    value={b.description}
                    jsonKey={`index.instituto.benefits[${i}].description`}
                    type="span"
                    className=""
                  />
                </p>
              </div>
            ))}
          </div>

          {/* Testimonial banner */}
          <div className="ds-testimonial-banner">
            <div className="ds-testimonial-banner-left">
              <div className="ds-testimonial-icon">
                <Heart className="w-4 h-4" />
              </div>
              <div className="ds-testimonial-text">
                <EditableField
                  value={texts.testemunhosCta?.text}
                  jsonKey="index.testemunhosCta.text"
                  type="span"
                  className=""
                />
              </div>
            </div>
            <Link to="/testemunhos" className="ds-btn ds-btn-navy ds-btn-sm ds-btn-noshrink">
              <EditableField
                value={texts.testemunhosCta?.button}
                jsonKey="index.testemunhosCta.button"
                type="span"
                className="inline"
              />
              <span className="ds-arrow">›</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== LANDSCAPE FOOTER ==================== */}
      <footer className={`ds-footer-section ${FOOTER.sectionClass}`}>
        <div className="relative">
          <FooterBackground
            gradientId="skyGradIndex"
            skyColors={['#0C1520', '#071020', '#091830']}
            earthColor="#1a1508"
            waterColors={['#0a3a3a', '#072e2e', '#052222']}
          />

          <div className={FOOTER.containerClass}>
            <div className="max-w-section mx-auto text-center">
              <EditableField
                value={texts.cta?.title}
                jsonKey="index.cta.title"
                type="h2"
                className={FOOTER.titleClass}
              />
              <EditableField
                value={texts.cta?.subtitle}
                jsonKey="index.cta.subtitle"
                type="p"
                className={FOOTER.subtitleClass}
              />
              <Link to="/contato">
                <Button className={FOOTER.buttonClass}>
                  <EditableField
                    value={texts.cta?.buttonText}
                    jsonKey="index.cta.buttonText"
                    type="span"
                    className="inline"
                  />
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
