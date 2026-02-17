import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Heart, Brain, Ghost, Sparkles, ChevronRight } from 'lucide-react';
import EditableField from '@/components/ui/EditableField';
import { Sun12Rays } from '../components/icons/Sun12Rays';
import { LogoGold } from '../components/icons/LogoGold';
import { lazy, Suspense } from 'react';
import { usePageContent } from '@/hooks/useContent';
import { usePageStyles } from '@/hooks/usePageStyles';
import { PageLoading } from '@/components/PageLoading';
import { FooterBackground } from '@/components/FooterBackground';
import { SharedFooter } from '@/components/SharedFooter';

const TestimonialsCarousel = lazy(() => import('@/components/TestimonialsCarousel'));

interface IndexTexts {
  header: { title: string; subtitle: string };
  [key: string]: any;
}

export default function Index() {
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
      <section className="relative bg-linear-to-b from-amber-50 via-white to-stone-50 py-20 border-b border-stone-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center justify-center mb-8 filter-[drop-shadow(0_20px_40px_rgba(0,0,0,0.25))_drop-shadow(0_10px_20px_rgba(0,0,0,0.15))]">
              <LogoGold className="w-175 h-auto" />
            </div>
            
            <EditableField 
              value={texts.hero.title}
              jsonKey="index.hero.title"
              type="h1"
              className="text-5xl md:text-7xl font-bold mb-6 text-stone-900"
            />
            
            <EditableField 
              value={texts.hero.subtitle}
              jsonKey="index.hero.subtitle"
              type="p"
              className="text-2xl md:text-3xl text-amber-700 font-medium mb-12"
            />

            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/purificacao">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-7 text-lg rounded-full">
                  <EditableField 
                    value={texts.hero.buttons.purification}
                    jsonKey="index.hero.buttons.purification"
                    type="span"
                    className="inline"
                  />
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/tratamentos">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-12 py-7 text-lg rounded-full">
                  <EditableField 
                    value={texts.hero.buttons.treatments}
                    jsonKey="index.hero.buttons.treatments"
                    type="span"
                    className="inline"
                  />
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FIRST CALL ==================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Card className="max-w-7xl mx-auto border-0 shadow-2xl bg-linear-to-br from-amber-50 to-white">
            <CardContent className="p-16">
              <div className="grid lg:grid-cols-3 gap-12">
                
                {/* COLUNA ESQUERDA - Ícone e Título */}
                <div className="lg:col-span-1 flex flex-col items-center justify-start text-center">
                  <div className="w-24 h-24 bg-amber-100 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                    <Heart className="w-14 h-14 text-amber-600" />
                  </div>
                  <EditableField 
                    value={texts?.instituto?.firstCallTitle}
                    jsonKey="index.instituto.firstCallTitle" 
                    type="h2"
                    className="text-3xl font-bold text-amber-800 leading-tight"
                  />
                </div>

                {/* COLUNA DIREITA - Conteúdo */}
                <div className="lg:col-span-2 space-y-6">
                  {texts?.instituto?.firstCall?.map((p: string, i: number) => (
                    <EditableField
                      key={i}
                      value={p}
                      jsonKey={`index.instituto.firstCall[${i}]`}
                      type="p"
                      className={
                        i === 0 
                          ? 'text-xl text-amber-700 font-semibold italic leading-relaxed border-l-4 border-amber-500 pl-6 py-2'
                          : i === 3 
                          ? 'text-base text-stone-800 font-bold mt-8' 
                          : 'text-base text-stone-600 leading-relaxed'
                      }
                    />
                  ))}

                  {(texts?.instituto?.firstCallList?.length || 0) > 0 && (
                    <div className="bg-amber-100 rounded-xl p-6 my-6">
                      <ul className="space-y-3">
                        {texts.instituto.firstCallList.map((li: string, i: number) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-7 h-7 bg-amber-600 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow">
                              <span className="text-white text-sm font-bold">✓</span>
                            </div>
                            <EditableField
                              value={li}
                              jsonKey={`index.instituto.firstCallList[${i}]`}
                              type="span"
                              className="text-stone-800 font-medium"
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {texts?.instituto?.firstCallFooter && (
                    <div className="bg-amber-600 text-white rounded-xl p-6 mt-8 shadow-lg">
                      <EditableField
                        value={texts.instituto.firstCallFooter}
                        jsonKey="index.instituto.firstCallFooter"
                        type="p"
                        className="text-lg font-bold text-center"
                      />
                    </div>
                  )}
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ==================== FÍSICO & ESPIRITUAL ==================== */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <EditableField 
                value={texts.fisicoEspiritual.title}
                jsonKey="index.fisicoEspiritual.title"
                type="h2"
                className="text-5xl font-bold mb-6 text-stone-900"
              />
              <EditableField 
                value={texts.fisicoEspiritual.subtitle}
                jsonKey="index.fisicoEspiritual.subtitle"
                type="p"
                className="text-2xl text-stone-600"
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* FÍSICO */}
              <Card className="border-0 shadow-2xl bg-white overflow-hidden group hover:shadow-3xl transition-all">
                <div className="h-2 bg-linear-to-r from-teal-500 to-teal-600"></div>
                <CardContent className="p-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center">
                      <Brain className="w-10 h-10 text-teal-600" />
                    </div>
                    <div className="text-left">
                      <EditableField 
                        value={texts.fisicoEspiritual.fisico.title}
                        jsonKey="index.fisicoEspiritual.fisico.title"
                        type="h3"
                        className="text-3xl font-bold text-teal-700"
                      />
                      <EditableField 
                        value={texts.fisicoEspiritual.fisico.subtitle}
                        jsonKey="index.fisicoEspiritual.fisico.subtitle"
                        type="p"
                        className="text-teal-600 font-semibold"
                      />
                    </div>
                  </div>
                  
                  <EditableField 
                    value={texts.fisicoEspiritual.fisico.description}
                    jsonKey="index.fisicoEspiritual.fisico.description"
                    type="p"
                    className="text-stone-600 mb-6 leading-relaxed"
                  />
                  
                  <ul className="space-y-3 mb-6">
                    {texts.fisicoEspiritual.fisico.items.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 shrink-0"></div>
                        <EditableField
                          value={item}
                          jsonKey={`index.fisicoEspiritual.fisico.items[${i}]`}
                          type="span"
                          className="text-stone-600"
                        />
                      </li>
                    ))}
                  </ul>
                  
                  <div className="bg-teal-50 rounded-xl p-6 border-l-4 border-teal-500">
                    <EditableField
                      value={texts.fisicoEspiritual.fisico.abordagem.title}
                      jsonKey="index.fisicoEspiritual.fisico.abordagem.title"
                      type="p"
                      className="font-bold text-teal-900 mb-2"
                    />
                    <EditableField
                      value={texts.fisicoEspiritual.fisico.abordagem.description}
                      jsonKey="index.fisicoEspiritual.fisico.abordagem.description"
                      type="p"
                      className="text-teal-800"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* ESPIRITUAL */}
              <Card className="border-0 shadow-2xl bg-white overflow-hidden group hover:shadow-3xl transition-all">
                <div className="h-2 bg-linear-to-r from-amber-500 to-amber-600"></div>
                <CardContent className="p-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
                      <Ghost className="w-10 h-10 text-amber-600" />
                    </div>
                    <div className="text-left">
                      <EditableField
                        value={texts.fisicoEspiritual.espiritual.title}
                        jsonKey="index.fisicoEspiritual.espiritual.title"
                        type="h3"
                        className="text-3xl font-bold text-amber-700"
                      />
                      <EditableField
                        value={texts.fisicoEspiritual.espiritual.subtitle}
                        jsonKey="index.fisicoEspiritual.espiritual.subtitle"
                        type="p"
                        className="text-amber-600 font-semibold"
                      />
                    </div>
                  </div>
                  
                  <EditableField
                    value={texts.fisicoEspiritual.espiritual.description}
                    jsonKey="index.fisicoEspiritual.espiritual.description"
                    type="p"
                    className="text-stone-600 mb-6 leading-relaxed"
                  />
                  
                  <ul className="space-y-3 mb-6">
                    {texts.fisicoEspiritual.espiritual.items.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0"></div>
                        <EditableField
                          value={item}
                          jsonKey={`index.fisicoEspiritual.espiritual.items[${i}]`}
                          type="span"
                          className="text-stone-600"
                        />
                      </li>
                    ))}
                  </ul>
                  
                  <div className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-500">
                    <EditableField
                      value={texts.fisicoEspiritual.espiritual.abordagem.title}
                      jsonKey="index.fisicoEspiritual.espiritual.abordagem.title"
                      type="p"
                      className="font-bold text-amber-900 mb-2"
                    />
                    <EditableField
                      value={texts.fisicoEspiritual.espiritual.abordagem.description}
                      jsonKey="index.fisicoEspiritual.espiritual.abordagem.description"
                      type="p"
                      className="text-amber-800"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== IGREJA DE METATRON ==================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Card className="max-w-7xl mx-auto border-0 shadow-2xl overflow-hidden">
            <div className="h-3 bg-linear-to-r from-amber-400 via-amber-500 to-amber-600"></div>
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-5 gap-0">
                <div className="lg:col-span-3 p-12">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center">
                      <Sun12Rays className="w-12 h-12 text-amber-600" />
                    </div>
                    <EditableField
                      value={texts.igreja.title}
                      jsonKey="index.igreja.title"
                      type="h2"
                      className="text-4xl font-bold text-stone-900"
                    />
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {texts.igreja.description.map((p: string, i: number) => (
                      <EditableField
                        key={i}
                        value={p}
                        jsonKey={`index.igreja.description[${i}]`}
                        type="p"
                        className="text-lg text-stone-600 leading-relaxed"
                      />
                    ))}
                  </div>

                  <Link to="/quemsomos">
                    <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-6 rounded-full text-lg">
                      <EditableField
                        value={texts.igreja.knowMoreButton}
                        jsonKey="index.igreja.knowMoreButton"
                        type="span"
                        className="inline"
                      />
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>

                <div className="lg:col-span-2 bg-amber-50 p-10">
                  <EditableField
                    value={texts.purification.title}
                    jsonKey="index.purification.title"
                    type="h3"
                    className="text-2xl font-bold text-amber-800 mb-8"
                  />
                  <div className="space-y-6">
                    {texts.purification.phases.map((phase: any, i: number) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <EditableField
                            value={phase.title}
                            jsonKey={`index.purification.phases[${i}].title`}
                            type="h4"
                            className="font-bold text-stone-900 mb-1"
                          />
                          <EditableField
                            value={phase.description}
                            jsonKey={`index.purification.phases[${i}].description`}
                            type="p"
                            className="text-sm text-stone-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ==================== INSTITUTO METATRON ==================== */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-7xl mx-auto border-0 shadow-2xl overflow-hidden">
            <div className="h-3 bg-linear-to-r from-teal-400 via-teal-500 to-teal-600"></div>
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-5 gap-0">
                <div className="lg:col-span-2 bg-teal-50 p-10 lg:order-2">
                  <EditableField
                    value={texts.treatments?.title}
                    jsonKey="index.treatments.title"
                    type="h3"
                    className="text-2xl font-bold text-teal-800 mb-8"
                  />
                  <div className="space-y-3">
                    {texts.instituto.treatments.slice(0, 7).map((t: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-3">
                        <div className="w-2 h-2 bg-teal-500 rounded-full shrink-0"></div>
                        <EditableField
                          value={t}
                          jsonKey={`index.instituto.treatments[${i}]`}
                          type="span"
                          className="text-stone-700"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-3 p-12 lg:order-1">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center">
                      <Brain className="w-12 h-12 text-teal-600" />
                    </div>
                    <EditableField
                      value={texts.instituto.title}
                      jsonKey="index.instituto.title"
                      type="h2"
                      className="text-4xl font-bold text-stone-900"
                    />
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {texts.instituto.description.map((p: string, i: number) => (
                      <EditableField
                        key={i}
                        value={p}
                        jsonKey={`index.instituto.description[${i}]`}
                        type="p"
                        className="text-lg text-stone-600 leading-relaxed"
                      />
                    ))}
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4 mb-8">
                    <EditableField
                      value={texts.instituto.legalNotice}
                      jsonKey="index.instituto.legalNotice"
                      type="p"
                      className="text-sm text-amber-900"
                    />
                  </div>

                  <Link to="/tratamentos">
                    <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-6 rounded-full text-lg">
                      <EditableField
                        value={texts.instituto.ctaButton}
                        jsonKey="index.instituto.ctaButton"
                        type="span"
                        className="inline"
                      />
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ==================== BENEFÍCIOS ==================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <EditableField
                value={texts.benefitsSection.title}
                jsonKey="index.benefitsSection.title"
                type="h2"
                className="text-5xl font-bold mb-6 text-stone-900"
              />
              <EditableField
                value={texts.benefitsSection.subtitle}
                jsonKey="index.benefitsSection.subtitle"
                type="p"
                className="text-2xl text-stone-600"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {texts.instituto.benefits.map((b: any, i: number) => (
                <Card key={i} className="border-0 shadow-lg hover:shadow-2xl transition-all bg-stone-50">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-md">
                      {i === 0 && <Sun12Rays className="w-10 h-10 text-amber-600" />}
                      {i === 1 && <Brain className="w-10 h-10 text-teal-600" />}
                      {i === 2 && <Sparkles className="w-10 h-10 text-stone-600" />}
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
          </div>
        </div>
      </section>

      {/* ==================== TESTEMUNHOS ==================== */}
      <Suspense fallback={
        <section className="py-20 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-stone-600 text-lg">Carregando testemunhos...</p>
            </div>
          </div>
        </section>
      }>
        <TestimonialsCarousel />
      </Suspense>

      {/* ==================== CTA FINAL / FOOTER ==================== */}
      <section className="relative overflow-hidden bg-slate-900">
        {/* Horizonte terrestre: céu noturno profundo */}
        <FooterBackground
          gradientId="skyGradIndex"
          skyColors={['#050d1a', '#0f2240', '#152d5e']}
          earthColor="#1a1508"
          waterColors={['#0a3a3a', '#072e2e', '#052222']}
        />

        {/* Sol Dourado - posicionado absolutamente */}
        <div className="absolute top-4 left-8 w-20 h-20 z-10 drop-shadow-lg">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="20" fill="#CFAF5A" />
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = 50 + Math.cos(angle) * 25;
              const y1 = 50 + Math.sin(angle) * 25;
              const x2 = 50 + Math.cos(angle) * 40;
              const y2 = 50 + Math.sin(angle) * 40;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#CFAF5A"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </div>

        {/* Lua Crescente - canto superior direito */}
        <div className="absolute top-4 right-8 w-20 h-20 z-20">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <mask id="crescentMaskIndex">
                <circle cx="50" cy="50" r="25" fill="white" />
                <circle cx="58" cy="50" r="22" fill="black" />
              </mask>
            </defs>
            <circle cx="50" cy="50" r="25" fill="#F3F4F6" mask="url(#crescentMaskIndex)" />
          </svg>
        </div>

        {/* CTA Content - posicionado no céu */}
        <div className="container mx-auto px-4 relative z-50 pt-6 pb-4">
          <div className="max-w-4xl mx-auto text-center">
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
