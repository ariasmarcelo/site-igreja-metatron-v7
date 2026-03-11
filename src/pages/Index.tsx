/**
 * Index — Redesign V8 (visitor-centered)
 *
 * Flow: Pain/Desire → Validation → Promise → Social Proof → Action
 * All CTAs point to WhatsApp (AI attendant handles triage + scheduling).
 * Content from Supabase via usePageContent('index').
 * Scoped under CSS class `.ds-new` — styles in styles/layouts/pages/index.css
 */
import { Link } from 'react-router-dom';
import { Heart, Brain, Sparkles, Shield, MessageCircle } from 'lucide-react';
import EditableField from '@/components/ui/EditableField';
import { useGlossary } from '@/hooks/useGlossary';
import { Sun12Rays } from '../components/icons/Sun12Rays';
import { LogoGold } from '../components/icons/LogoGold';
import { usePageContent } from '@/hooks/useContent';
import { usePageStyles } from '@/hooks/usePageStyles';
import { PageLoading } from '@/components/PageLoading';
import { FooterBackground } from '@/components/FooterBackground';
import { FOOTER } from '@/components/footer-constants';


interface IndexTexts {
  hero: { title: string; headline: string; subheadline: string; primaryCta: string; secondaryCta: string };
  recognition: {
    title: string;
    subtitle: string;
    cards: { text: string; icon: string }[];
  };
  bridge: { title: string; body: string; highlight: string };
  paths: {
    title: string;
    subtitle: string;
    igreja: { title: string; description: string; items: string[]; cta: string };
    instituto: { title: string; description: string; items: string[]; cta: string };
  };
  socialProof: {
    title: string;
    subtitle: string;
    testimonials: { name: string; text: string; tag: string }[];
    cta: string;
  };
  footerCta: { title: string; subtitle: string; buttonText: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const RECOGNITION_ICONS = [
  <Heart key="h" className="w-5 h-5" />,
  <Brain key="b" className="w-5 h-5" />,
  <Shield key="s" className="w-5 h-5" />,
  <Sparkles key="sp" className="w-5 h-5" />,
  <Heart key="h2" className="w-5 h-5" />,
  <Sun12Rays key="sr" className="w-5 h-5" />,
];

export default function Index() {
  const stylesLoaded = usePageStyles('index');
  const { data: texts, loading } = usePageContent<IndexTexts>('index', {
    includePages: ['__shared__'],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const GLOSSARY = useGlossary((texts as any)?.__shared__);

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
      {/* ==================== HERO ==================== */}
      <section className="ds-hero">
        <div className="ds-hero-inner max-w-section mx-auto">
          <div className="ds-hero-logo">
            <LogoGold className="w-190 h-auto" />
          </div>

          <EditableField
            value={texts.hero?.title}
            jsonKey="index.hero.title"
            type="h1"
            className=""
          />

          <p className="ds-hero-sub">
            <EditableField
              value={texts.hero?.headline}
              jsonKey="index.hero.headline"
              type="span"
              className=""
            />
          </p>

          <div className="ds-hero-buttons">
            <Link to="/contato" className="ds-btn ds-btn-gold">
              <MessageCircle className="w-4 h-4" />
              <EditableField
                value={texts.hero?.primaryCta}
                jsonKey="index.hero.primaryCta"
                type="span"
                className="inline"
              />
            </Link>
            <Link to="/purificacao" className="ds-btn ds-btn-ghost-gold ds-btn-hero-ghost">
              <EditableField
                value={texts.hero?.secondaryCta}
                jsonKey="index.hero.secondaryCta"
                type="span"
                className="inline"
              />
              <span className="ds-arrow">›</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== RECOGNITION ("Você se reconhece?") ==================== */}
      <section className="ds-section-recognition">
        <div className="ds-recognition-inner max-w-section mx-auto">
          <h2 className="ds-section-heading">
            <EditableField
              value={texts.recognition?.title}
              jsonKey="index.recognition.title"
              type="span"
              className=""
            />
          </h2>
          <p className="ds-section-sub">
            <EditableField
              value={texts.recognition?.subtitle}
              jsonKey="index.recognition.subtitle"
              type="span"
              className=""
            />
          </p>

          <div className="ds-recognition-grid">
            {(texts.recognition?.cards || []).map(
              (card: { text: string; icon: string }, i: number) => (
                <div key={i} className="ds-recognition-card">
                  <div className="ds-recognition-icon">
                    {RECOGNITION_ICONS[i] || <Heart className="w-5 h-5" />}
                  </div>
                  <EditableField
                    value={card.text}
                    jsonKey={`index.recognition.cards[${i}].text`}
                    type="p"
                    className="ds-recognition-text"
                  />
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ==================== BRIDGE (insight diferenciador) ==================== */}
      <section className="ds-section-bridge">
        <div className="ds-bridge-inner max-w-section mx-auto">
          <p className="ds-bridge-preamble">
            <EditableField
              value={texts.hero?.subheadline}
              jsonKey="index.hero.subheadline"
              type="span"
              className=""
            />
          </p>
          <h2 className="ds-bridge-title">
            <EditableField
              value={texts.bridge?.title}
              jsonKey="index.bridge.title"
              type="span"
              className=""
            />
          </h2>
          <div className="ds-bridge-body">
            <EditableField
              value={texts.bridge?.body}
              jsonKey="index.bridge.body"
              type="p"
              className=""
            />
          </div>
          <div className="ds-bridge-highlight">
            <EditableField
              value={texts.bridge?.highlight}
              jsonKey="index.bridge.highlight"
              type="p"
              className=""
            />
          </div>
        </div>
      </section>

      {/* ==================== TWO PATHS (Igreja + Instituto) ==================== */}
      <section className="ds-section-paths">
        <div className="ds-paths-inner max-w-section mx-auto">
          <h2 className="ds-section-heading">
            <EditableField
              value={texts.paths?.title}
              jsonKey="index.paths.title"
              type="span"
              className=""
            />
          </h2>
          <p className="ds-section-sub">
            <EditableField
              value={texts.paths?.subtitle}
              jsonKey="index.paths.subtitle"
              type="span"
              className=""
            />
          </p>

          <div className="ds-paths-cards">
            {/* IGREJA (primary) */}
            <div className="ds-path-card church">
              <div className="ds-path-header">
                <div className="ds-brand-icon church">
                  <Sun12Rays className="w-5 h-5" />
                </div>
                <div className="ds-path-name church">
                  <EditableField
                    value={texts.paths?.igreja?.title}
                    jsonKey="index.paths.igreja.title"
                    type="span"
                    className=""
                  />
                </div>
              </div>
              <div className="ds-path-desc">
                <EditableField
                  value={texts.paths?.igreja?.description}
                  jsonKey="index.paths.igreja.description"
                  type="span"
                  className=""
                />
              </div>
              <ul className="ds-path-list">
                {(texts.paths?.igreja?.items || []).map((item: string, i: number) => (
                  <li key={i}>
                    <span className="ds-check church">✓</span>
                    <EditableField
                      value={item}
                      jsonKey={`index.paths.igreja.items[${i}]`}
                      type="span"
                      className=""
                    />
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link to="/purificacao" className="ds-btn ds-btn-gold ds-btn-full">
                  <EditableField
                    value={texts.paths?.igreja?.cta}
                    jsonKey="index.paths.igreja.cta"
                    type="span"
                    className="inline"
                  />
                  <span className="ds-arrow">›</span>
                </Link>
              </div>
            </div>

            {/* INSTITUTO (support) */}
            <div className="ds-path-card institute">
              <div className="ds-path-header">
                <div className="ds-brand-icon institute">
                  <Brain className="w-5 h-5" />
                </div>
                <div className="ds-path-name institute">
                  <EditableField
                    value={texts.paths?.instituto?.title}
                    jsonKey="index.paths.instituto.title"
                    type="span"
                    className=""
                  />
                </div>
              </div>
              <div className="ds-path-desc">
                <EditableField
                  value={texts.paths?.instituto?.description}
                  jsonKey="index.paths.instituto.description"
                  type="span"
                  className=""
                />
              </div>
              <ul className="ds-path-list">
                {(texts.paths?.instituto?.items || []).map((item: string, i: number) => (
                  <li key={i}>
                    <span className="ds-check institute">✓</span>
                    <EditableField
                      value={item}
                      jsonKey={`index.paths.instituto.items[${i}]`}
                      type="span"
                      className=""
                    />
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link to="/tratamentos" className="ds-btn ds-btn-sage ds-btn-full">
                  <EditableField
                    value={texts.paths?.instituto?.cta}
                    jsonKey="index.paths.instituto.cta"
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

      {/* ==================== SOCIAL PROOF ==================== */}
      <section className="ds-section-social-proof">
        <div className="ds-social-inner max-w-section mx-auto">
          <h2 className="ds-section-heading">
            <EditableField
              value={texts.socialProof?.title}
              jsonKey="index.socialProof.title"
              type="span"
              className=""
            />
          </h2>
          <p className="ds-section-sub">
            <EditableField
              value={texts.socialProof?.subtitle}
              jsonKey="index.socialProof.subtitle"
              type="span"
              className=""
            />
          </p>

          <div className="ds-testimonials-grid">
            {(texts.socialProof?.testimonials || []).map(
              (t: { name: string; text: string; tag: string }, i: number) => (
                <div key={i} className="ds-testimonial-card">
                  <div className="ds-testimonial-quote">"</div>
                  <EditableField
                    value={t.text}
                    jsonKey={`index.socialProof.testimonials[${i}].text`}
                    type="p"
                    className="ds-testimonial-body"
                  />
                  <div className="ds-testimonial-footer">
                    <EditableField
                      value={t.name}
                      jsonKey={`index.socialProof.testimonials[${i}].name`}
                      type="span"
                      className="ds-testimonial-name"
                    />
                    <EditableField
                      value={t.tag}
                      jsonKey={`index.socialProof.testimonials[${i}].tag`}
                      type="span"
                      className="ds-testimonial-tag"
                    />
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="ds-testimonial-banner">
            <div className="ds-testimonial-banner-left">
              <div className="ds-testimonial-icon">
                <Heart className="w-4 h-4" />
              </div>
              <div className="ds-testimonial-text">
                <EditableField
                  value={texts.socialProof?.cta}
                  jsonKey="index.socialProof.cta"
                  type="span"
                  className=""
                />
              </div>
            </div>
            <Link to="/testemunhos" className="ds-btn ds-btn-navy ds-btn-sm ds-btn-noshrink">
              Testemunhos
              <span className="ds-arrow">›</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== LANDSCAPE FOOTER + CTA ==================== */}
      <footer className={`ds-footer-section ${FOOTER.sectionClass}`}>
        <div className="relative">
          <FooterBackground
            gradientId="skyGradIndex"
            skyColors={['#0C1520', '#071020', '#091830']}
            earthColor="#1a1508"
            waterColors={['#0a2a3d', '#081f30', '#061825']}
          />

          <div className={FOOTER.containerClass}>
            <div className="max-w-section mx-auto text-center">
              <EditableField
                value={texts.footerCta?.title}
                jsonKey="index.footerCta.title"
                type="h2"
                className={FOOTER.titleClass}
              />
              <EditableField
                value={texts.footerCta?.subtitle}
                jsonKey="index.footerCta.subtitle"
                type="p"
                className={FOOTER.subtitleClass}
              />
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
