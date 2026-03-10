import { useState, useMemo } from 'react';
import { usePageContent } from '@/hooks/useContent';
import { FooterBackground } from '@/components/FooterBackground';
import { FOOTER } from '@/components/footer-constants';
import EditableField from '@/components/ui/EditableField';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageLoading, PageError } from '@/components/PageLoading';
import { useLanguage } from '@/contexts/LanguageContext';
import '@/styles/layouts/pages/testemunhos.css';

const ITEMS_PER_PAGE = 6;

interface Testimonial {
  name: string;
  date: string;
  content: string;
  category?: string;
}

const CATEGORIES = [
  { id: 'all', labelPt: 'Todos', labelEn: 'All' },
  { id: 'tratamento', labelPt: 'Tratamento Terapêutico', labelEn: 'Therapeutic Treatment' },
  { id: 'transformacao', labelPt: 'Transformação Pessoal', labelEn: 'Personal Transformation' },
  { id: 'cura-espiritual', labelPt: 'Cura Espiritual', labelEn: 'Spiritual Healing' },
  { id: 'purificacao', labelPt: 'Purificação', labelEn: 'Purification' },
  { id: 'desobsessao', labelPt: 'Desobsessão', labelEn: 'Disobsession' },
] as const;

function getCategoryLabel(categoryId: string | undefined, lang: string): string {
  if (!categoryId) return '';
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return categoryId;
  return lang === 'en-US' ? cat.labelEn : cat.labelPt;
}

const Testemunhos = () => {
  const { data: texts, loading, error } = usePageContent<any>('testemunhos', { includePages: ['__shared__'] });
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const testimonials: Testimonial[] = texts?.testimonials || [];

  const filteredTestimonials = useMemo(() => {
    if (activeFilter === 'all') return testimonials;
    return testimonials.filter(t => t.category === activeFilter);
  }, [testimonials, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedTestimonials = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredTestimonials.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTestimonials, safePage]);

  const originalIndices = useMemo(() => {
    return paginatedTestimonials.map(t => testimonials.indexOf(t));
  }, [paginatedTestimonials, testimonials]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: testimonials.length };
    for (const t of testimonials) {
      if (t.category) {
        counts[t.category] = (counts[t.category] || 0) + 1;
      }
    }
    return counts;
  }, [testimonials]);

  const handleFilterChange = (categoryId: string) => {
    setActiveFilter(categoryId);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <PageLoading
        icon={Heart}
        text="Carregando testemunhos..."
        bgColor="bg-linear-to-b from-amber-50 to-orange-50"
        iconColor="text-amber-700"
        textColor="text-amber-900"
      />
    );
  }

  if (error) {
    return (
      <PageError
        message={error}
        bgColor="bg-linear-to-b from-red-50 to-red-50"
        textColor="text-red-700"
      />
    );
  }

  if (!texts) return null;

  return (
    <div className="ds-new ds-testem">

      {/* ==================== HERO ==================== */}
      <section className="ts-hero">
        <div className="ts-hero-orbs">
          <div className="ts-hero-orb" />
          <div className="ts-hero-orb" />
          <div className="ts-hero-orb" />
        </div>

        <div className="ts-hero-content">
          <div className="ts-hero-icon">
            <img
              src="/logo-metatron-sem-asas-gold.svg"
              alt="Logo Igreja de Metatron"
              className="w-16 h-16"
            />
          </div>
          <EditableField
            value={texts.testimonialsPage?.header?.title}
            jsonKey="testemunhos.testimonialsPage.header.title"
            type="h1"
            className=""
          />
          <EditableField
            value={texts.testimonialsPage?.header?.subtitle}
            jsonKey="testemunhos.testimonialsPage.header.subtitle"
            type="p"
            className="ts-hero-sub"
          />
        </div>
      </section>

      {/* ==================== INTRO ==================== */}
      <div className="ts-intro">
        <div className="ts-intro-card">
          <EditableField
            value={texts.testimonialsPage?.intro?.description}
            jsonKey="testemunhos.testimonialsPage.intro.description"
            type="p"
            className=""
          />
        </div>
      </div>

      {/* ==================== FILTERS ==================== */}
      <div className="ts-filter-section">
        <div className="ts-filter-bar">
          {CATEGORIES.map(cat => {
            const count = categoryCounts[cat.id] || 0;
            if (cat.id !== 'all' && count === 0) return null;
            const label = language === 'en-US' ? cat.labelEn : cat.labelPt;
            return (
              <button
                key={cat.id}
                className={`ts-filter-pill ${activeFilter === cat.id ? 'active' : ''}`}
                onClick={() => handleFilterChange(cat.id)}
              >
                {label}
                <span className="ts-filter-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================== GRID ==================== */}
      <div className="ts-grid-section">
        <div className="ts-grid">
          {paginatedTestimonials.length === 0 ? (
            <div className="ts-empty-state">
              {language === 'en-US'
                ? 'No testimonials found for this category.'
                : 'Nenhum testemunho encontrado para esta categoria.'}
            </div>
          ) : (
            paginatedTestimonials.map((testimonial, idx) => {
              const originalIdx = originalIndices[idx];
              return (
                <div key={originalIdx} className="ts-card">
                  <div className="ts-card-quote">&ldquo;</div>
                  <div className="ts-card-header">
                    <EditableField
                      value={testimonial.name}
                      jsonKey={`testemunhos.testimonials[${originalIdx}].name`}
                      type="h3"
                      className="ts-card-name"
                    />
                    <EditableField
                      value={testimonial.date}
                      jsonKey={`testemunhos.testimonials[${originalIdx}].date`}
                      type="span"
                      className="ts-card-date"
                    />
                  </div>
                  <div className="ts-card-body">
                    <EditableField
                      value={testimonial.content}
                      jsonKey={`testemunhos.testimonials[${originalIdx}].content`}
                      type="p"
                      className=""
                    />
                  </div>
                  {testimonial.category && (
                    <div className="ts-card-footer">
                      <span className="ts-card-category-badge">
                        {getCategoryLabel(testimonial.category, language)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ==================== PAGINATION ==================== */}
      {totalPages > 1 && (
        <div className="ts-pagination">
          <button
            className="ts-page-btn"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`ts-page-btn ${safePage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="ts-page-btn"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            aria-label="Próxima página"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="ts-page-info">
            {safePage}/{totalPages}
          </span>
        </div>
      )}

      {/* ==================== DISCLAIMER ==================== */}
      <div className="ts-disclaimer-section">
        <div className="ts-disclaimer">
          <Heart className="ts-disclaimer-icon" />
          <div>
            <EditableField
              value={texts.testimonialsPage?.disclaimer?.title}
              jsonKey="testemunhos.testimonialsPage.disclaimer.title"
              type="h3"
              className=""
            />
            <EditableField
              value={texts.testimonialsPage?.disclaimer?.content}
              jsonKey="testemunhos.testimonialsPage.disclaimer.content"
              type="p"
              className=""
            />
          </div>
        </div>
      </div>

      {/* ==================== FOOTER ==================== */}
      <footer className={FOOTER.sectionClass}>
        <div className="relative">
          <FooterBackground
            gradientId="skyGradientTestemunhos"
            skyColors={['#1a1520', '#2a1f15', '#3a2a20']}
            earthColor="#2a1f10"
            waterColors={['#0a3a3a', '#083030', '#062525']}
          />

          <div className={FOOTER.containerClass}>
            <div className="max-w-section mx-auto text-center">
              <EditableField
                value={texts.testimonialsPage?.cta?.title}
                jsonKey="testemunhos.testimonialsPage.cta.title"
                type="h2"
                className={FOOTER.titleClass}
              />
              <EditableField
                value={texts.testimonialsPage?.cta?.subtitle}
                jsonKey="testemunhos.testimonialsPage.cta.subtitle"
                type="p"
                className={FOOTER.subtitleClass}
              />
              <Link to="/contato">
                <Button className={FOOTER.buttonClass}>
                  <EditableField
                    value={texts.testimonialsPage?.cta?.buttonText}
                    jsonKey="testemunhos.testimonialsPage.cta.buttonText"
                    type="span"
                    className="inline"
                  />
                </Button>
              </Link>
            </div>

            <div>
              <EditableField
                value={(texts as any).__shared__?.footer?.copyright}
                jsonKey="__shared__.footer.copyright"
                type="p"
                className={FOOTER.copyrightClass}
              />
              <EditableField
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
};

export default Testemunhos;
