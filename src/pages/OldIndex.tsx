import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Heart, Brain, Ghost, Sparkles, ChevronRight, TrendingUp } from 'lucide-react';
import EditableField from '@/components/ui/EditableField';
import { Sun12Rays } from '../components/icons/Sun12Rays';
import { LogoGold } from '../components/icons/LogoGold';
import { usePageContent } from '@/hooks/useContent';
import { usePageStyles } from '@/hooks/usePageStyles';
import { PageLoading } from '@/components/PageLoading';
import { FooterBackground } from '@/components/FooterBackground';
import { SharedFooter } from '@/components/SharedFooter';

interface IndexTexts {
  header: { title: string; subtitle: string };
  [key: string]: any;
}

export default function OldIndex() {
  const stylesLoaded = usePageStyles('index');
  const { data: texts, loading } = usePageContent<IndexTexts>('index');

  if (!texts || !stylesLoaded || loading) {
    return (
      <PageLoading
        icon={Sparkles}
        text="Carregando página inicial..."
        bgColor="bg-gradient-to-b from-stone-50 to-stone-100"
        iconColor="text-amber-500"
        textColor="text-stone-800"
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* ==================== HERO ==================== */}
      <section className="relative bg-linear-to-b from-amber-50 via-white to-stone-50 py-16 border-b border-stone-200">
        <div className="container mx-auto px-4">
          <div className="max-w-section mx-auto text-center">
            <div className="inline-flex items-center justify-center mb-8 filter-[drop-shadow(0_20px_40px_rgba(0,0,0,0.25))_drop-shadow(0_10px_20px_rgba(0,0,0,0.15))]">
              <LogoGold className="w-190 h-auto" />
            </div>
            
            <EditableField 
              value={texts.hero.title}
              jsonKey="index.hero.title"
              type="h1"
              className="text-4xl md:text-6xl font-bold mb-6 text-stone-900"
            />
            
            <EditableField 
              value={texts.hero.subtitle}
              jsonKey="index.hero.subtitle"
              type="p"
              className="text-xl md:text-2xl text-amber-700 font-medium mb-12"
            />

            <div className="inline-grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mx-auto w-full sm:w-auto max-w-xs sm:max-w-none">
              <Link to="/purificacao" className="flex">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-5 sm:px-8 py-5 sm:py-7 text-base sm:text-lg rounded-full gap-1 w-full">
                  <EditableField 
                    value={texts.hero.buttons.purification}
                    jsonKey="index.hero.buttons.purification"
                    type="span"
                    className="inline"
                  />
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </Button>
              </Link>
              <Link to="/tratamentos" className="flex">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-5 sm:px-8 py-5 sm:py-7 text-base sm:text-lg rounded-full gap-1 w-full">
                  <EditableField 
                    value={texts.hero.buttons.treatments}
                    jsonKey="index.hero.buttons.treatments"
                    type="span"
                    className="inline"
                  />
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FÍSICO & ESPIRITUAL ==================== */}
      <div className="ds-new ds-embedded">
      <section className="ds-section-challenges">
        <div className="ds-challenges-inner">
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
      </div>

      {/* ==================== DOIS CAMINHOS ==================== */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-section mx-auto">
            <Card className="border border-amber-200/80 shadow-2xl overflow-hidden bg-white">
              {/* Barra dourada superior */}
              <div className="h-1.5 bg-linear-to-r from-amber-400 via-amber-500 to-amber-400"></div>
              <CardContent className="p-8 md:p-14">
                {/* Título centralizado */}
                <div className="text-center mb-10">
                  <EditableField
                    value={texts.caminhos?.title}
                    jsonKey="index.caminhos.title"
                    type="h2"
                    className="text-3xl font-bold text-amber-800 leading-tight"
                  />
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* INSTITUTO */}
                  <div className="bg-teal-50 rounded-xl border border-teal-200 p-6 md:p-8 flex flex-col">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center shrink-0 border border-teal-200">
                        <Brain className="w-8 h-8 text-teal-600" />
                      </div>
                      <EditableField
                        value={texts.instituto?.title}
                        jsonKey="index.instituto.title"
                        type="h3"
                        className="text-2xl font-bold text-teal-700"
                      />
                    </div>

                    <EditableField
                      value={texts.caminhos?.instituto?.resumo}
                      jsonKey="index.caminhos.instituto.resumo"
                      type="p"
                      className="text-base text-stone-600 leading-relaxed mb-5"
                    />

                    <ul className="space-y-2.5 mb-6">
                      {texts.caminhos?.instituto?.items?.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-teal-600 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                          <EditableField
                            value={item}
                            jsonKey={`index.caminhos.instituto.items[${i}]`}
                            type="span"
                            className="text-base text-stone-700 font-medium"
                          />
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto">
                      <Link to="/tratamentos">
                        <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-4 rounded-full text-sm w-full">
                          <EditableField
                            value={texts.caminhos?.instituto?.button}
                            jsonKey="index.caminhos.instituto.button"
                            type="span"
                            className="inline"
                          />
                          <ChevronRight className="ml-1 w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* IGREJA */}
                  <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 md:p-8 flex flex-col">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0 border border-amber-200">
                        <Sun12Rays className="w-8 h-8 text-amber-600" />
                      </div>
                      <EditableField
                        value={texts.igreja?.title}
                        jsonKey="index.igreja.title"
                        type="h3"
                        className="text-2xl font-bold text-amber-700"
                      />
                    </div>

                    <EditableField
                      value={texts.caminhos?.igreja?.resumo}
                      jsonKey="index.caminhos.igreja.resumo"
                      type="p"
                      className="text-base text-stone-600 leading-relaxed mb-5"
                    />

                    <ul className="space-y-2.5 mb-6">
                      {texts.caminhos?.igreja?.items?.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-amber-600 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                          <EditableField
                            value={item}
                            jsonKey={`index.caminhos.igreja.items[${i}]`}
                            type="span"
                            className="text-base text-stone-700 font-medium"
                          />
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto">
                      <Link to="/quemsomos">
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-4 rounded-full text-sm w-full">
                          <EditableField
                            value={texts.caminhos?.igreja?.button}
                            jsonKey="index.caminhos.igreja.button"
                            type="span"
                            className="inline"
                          />
                          <ChevronRight className="ml-1 w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ==================== BENEFÍCIOS ==================== */}
      <section className="py-10 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="max-w-section mx-auto">
            <Card className="border border-amber-200/80 shadow-2xl overflow-hidden bg-white">
              {/* Barra dourada superior */}
              <div className="h-1.5 bg-linear-to-r from-amber-400 via-amber-500 to-amber-400"></div>
              <CardContent className="p-8 md:p-14">
                {/* Título e subtítulo centralizados */}
                <div className="text-center mb-10">
                  <EditableField
                    value={texts.benefitsSection.title}
                    jsonKey="index.benefitsSection.title"
                    type="h2"
                    className="text-3xl font-bold text-amber-800 leading-tight"
                  />
                  <EditableField
                    value={texts.benefitsSection.subtitle}
                    jsonKey="index.benefitsSection.subtitle"
                    type="p"
                    className="text-lg text-stone-600 mt-3"
                  />
                </div>

                {/* 3 benefícios em colunas */}
                <div className="grid md:grid-cols-3 gap-8 mb-10">
                  {texts.instituto.benefits.map((b: any, i: number) => (
                    <Card key={i} className="border border-stone-200 shadow-xl hover:shadow-2xl transition-all bg-white">
                      <CardContent className="pt-5 pb-8 px-5 text-center">
                        <div className="w-16 h-16 mx-auto mb-6 bg-amber-50 rounded-2xl flex items-center justify-center shadow-md border border-amber-200">
                          {i === 0 && (
                            <svg viewBox="0 0 100 100" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="50" cy="50" r="20" fill="#CFAF5A" />
                              {[...Array(12)].map((_, j) => {
                                const angle = (j * 30 * Math.PI) / 180;
                                return (
                                  <line key={j} x1={50 + Math.cos(angle) * 25} y1={50 + Math.sin(angle) * 25} x2={50 + Math.cos(angle) * 40} y2={50 + Math.sin(angle) * 40} stroke="#CFAF5A" strokeWidth="3" strokeLinecap="round" />
                                );
                              })}
                            </svg>
                          )}
                          {i === 1 && <Brain className="w-10 h-10 text-blue-400" strokeWidth={1.5} />}
                          {i === 2 && <TrendingUp className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />}
                        </div>
                        <EditableField
                          value={b.title}
                          jsonKey={`index.instituto.benefits[${i}].title`}
                          type="h3"
                          className="text-xl font-bold mb-4 text-stone-900"
                        />
                        <EditableField
                          value={b.description}
                          jsonKey={`index.instituto.benefits[${i}].description`}
                          type="p"
                          className="text-stone-600 leading-relaxed"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Testemunhos CTA (absorvido) */}
                <div className="bg-stone-50 rounded-xl border border-stone-200 px-4 md:px-5 py-5 flex flex-col items-center text-center gap-3 md:flex-row md:text-left md:gap-4 w-fit mx-auto">
                  <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center shrink-0 border border-rose-200">
                    <Heart className="w-6 h-6 text-rose-500 fill-rose-500" strokeWidth={1.5} />
                  </div>
                  <EditableField
                    value={texts.testemunhosCta?.text}
                    jsonKey="index.testemunhosCta.text"
                    type="p"
                    className="text-base text-stone-600 leading-relaxed whitespace-nowrap"
                  />
                  <Link to="/testemunhos" className="shrink-0">
                    <Button className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-4 rounded-full text-sm shadow-md">
                      <EditableField
                        value={texts.testemunhosCta?.button}
                        jsonKey="index.testemunhosCta.button"
                        type="span"
                        className="inline"
                      />
                      <ChevronRight className="ml-1 w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ==================== CTA FINAL / FOOTER ==================== */}
      <section className="relative overflow-hidden bg-slate-900">
        {/* Horizonte terrestre: céu noturno profundo */}
        <FooterBackground
          gradientId="skyGradIndex"
          skyColors={['#050d1a', '#0f2240', '#152d5e']}
          earthColor="#1a1508"
          waterColors={['#0a3a3a', '#072e2e', '#052222']}
        />

        {/* CTA Content - posicionado no céu */}
        <div className="container mx-auto px-4 relative z-10 pt-6 pb-4">
          <div className="max-w-section mx-auto text-center">
            <EditableField
              value={texts.cta?.title}
              jsonKey="index.cta.title"
              type="h2"
              className="text-3xl md:text-4xl font-bold mb-4 text-white text-shadow-strong"
            />
            <EditableField
              value={texts.cta?.subtitle}
              jsonKey="index.cta.subtitle"
              type="p"
              className="text-lg mb-5 text-white text-shadow-medium"
            />
            <Link to="/contato">
              <Button className="bg-[#CFAF5A] text-white font-semibold px-6 py-4 text-base rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105">
                <EditableField
                  value={texts.cta?.buttonText}
                  jsonKey="index.cta.buttonText"
                  type="span"
                  className="inline"
                />
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Content - Copyright (do DB: compartilhado) */}
        <SharedFooter className="pt-8 pb-4" />
      </section>
    </div>
  );
}
