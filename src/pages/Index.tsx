import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Heart, Brain, Ghost, Sparkles, ChevronRight } from 'lucide-react';
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
        icon={Sun12Rays}
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
            <div className="inline-flex items-center justify-center mb-8 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl shadow-amber-900/30">
              <LogoGold className="w-[700px] h-auto" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-stone-900" data-json-key="index.hero.title">
              {texts.hero.title}
            </h1>
            
            <p className="text-2xl md:text-3xl text-amber-700 font-medium mb-12" data-json-key="index.hero.subtitle">
              {texts.hero.subtitle}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/purificacao">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-7 text-lg rounded-full">
                  <span data-json-key="index.hero.buttons.purification">{texts.hero.buttons.purification}</span>
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/tratamentos">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-12 py-7 text-lg rounded-full">
                  <span data-json-key="index.hero.buttons.treatments">{texts.hero.buttons.treatments}</span>
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
                  <h2 
                    data-json-key="index.instituto.firstCallTitle" 
                    className="text-3xl font-bold text-amber-800 leading-tight"
                  >
                    {texts?.instituto?.firstCallTitle || ''}
                  </h2>
                </div>

                {/* COLUNA DIREITA - Conteúdo */}
                <div className="lg:col-span-2 space-y-6">
                  {(texts?.instituto?.firstCall || []).map((p: string, i: number) => (
                    <p
                      key={i}
                      data-json-key={`index.instituto.firstCall[${i}]`}
                      className={
                        i === 0 
                          ? 'text-xl text-amber-700 font-semibold italic leading-relaxed border-l-4 border-amber-500 pl-6 py-2'
                          : i === 3 
                          ? 'text-base text-stone-800 font-bold mt-8' 
                          : 'text-base text-stone-600 leading-relaxed'
                      }
                    >
                      {p}
                    </p>
                  ))}

                  {(texts?.instituto?.firstCallList || []).length > 0 && (
                    <div className="bg-amber-100 rounded-xl p-6 my-6">
                      <ul className="space-y-3">
                        {texts.instituto.firstCallList.map((li: string, i: number) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-7 h-7 bg-amber-600 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow">
                              <span className="text-white text-sm font-bold">✓</span>
                            </div>
                            <span className="text-stone-800 font-medium" data-json-key={`index.instituto.firstCallList[${i}]`}>{li}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(texts?.instituto?.firstCall || []).length > 4 && (
                    <p data-json-key="index.instituto.firstCall[4]" className="text-base text-stone-600 leading-relaxed">
                      {texts.instituto.firstCall[4]}
                    </p>
                  )}

                  {texts?.instituto?.firstCallFooter && (
                    <div className="bg-amber-600 text-white rounded-xl p-6 mt-8 shadow-lg">
                      <p data-json-key="index.instituto.firstCallFooter" className="text-lg font-bold text-center">
                        {texts.instituto.firstCallFooter}
                      </p>
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
              <h2 className="text-5xl font-bold mb-6 text-stone-900" data-json-key="index.fisicoEspiritual.title">
                {texts.fisicoEspiritual.title}
              </h2>
              <p className="text-2xl text-stone-600" data-json-key="index.fisicoEspiritual.subtitle">
                {texts.fisicoEspiritual.subtitle}
              </p>
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
                      <h3 className="text-3xl font-bold text-teal-700" data-json-key="index.fisicoEspiritual.fisico.title">
                        {texts.fisicoEspiritual.fisico.title}
                      </h3>
                      <p className="text-teal-600 font-semibold" data-json-key="index.fisicoEspiritual.fisico.subtitle">
                        {texts.fisicoEspiritual.fisico.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-stone-600 mb-6 leading-relaxed" data-json-key="index.fisicoEspiritual.fisico.description">
                    {texts.fisicoEspiritual.fisico.description}
                  </p>
                  
                  <ul className="space-y-3 mb-6">
                    {texts.fisicoEspiritual.fisico.items.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 shrink-0"></div>
                        <span className="text-stone-600" data-json-key={`index.fisicoEspiritual.fisico.items[${i}]`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="bg-teal-50 rounded-xl p-6 border-l-4 border-teal-500">
                    <p className="font-bold text-teal-900 mb-2" data-json-key="index.fisicoEspiritual.fisico.abordagem.title">
                      {texts.fisicoEspiritual.fisico.abordagem.title}
                    </p>
                    <p className="text-teal-800" data-json-key="index.fisicoEspiritual.fisico.abordagem.description">
                      {texts.fisicoEspiritual.fisico.abordagem.description}
                    </p>
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
                      <h3 className="text-3xl font-bold text-amber-700" data-json-key="index.fisicoEspiritual.espiritual.title">
                        {texts.fisicoEspiritual.espiritual.title}
                      </h3>
                      <p className="text-amber-600 font-semibold" data-json-key="index.fisicoEspiritual.espiritual.subtitle">
                        {texts.fisicoEspiritual.espiritual.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-stone-600 mb-6 leading-relaxed" data-json-key="index.fisicoEspiritual.espiritual.description">
                    {texts.fisicoEspiritual.espiritual.description}
                  </p>
                  
                  <ul className="space-y-3 mb-6">
                    {texts.fisicoEspiritual.espiritual.items.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0"></div>
                        <span className="text-stone-600" data-json-key={`index.fisicoEspiritual.espiritual.items[${i}]`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-500">
                    <p className="font-bold text-amber-900 mb-2" data-json-key="index.fisicoEspiritual.espiritual.abordagem.title">
                      {texts.fisicoEspiritual.espiritual.abordagem.title}
                    </p>
                    <p className="text-amber-800" data-json-key="index.fisicoEspiritual.espiritual.abordagem.description">
                      {texts.fisicoEspiritual.espiritual.abordagem.description}
                    </p>
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
                    <h2 className="text-4xl font-bold text-stone-900" data-json-key="index.igreja.title">
                      {texts.igreja.title}
                    </h2>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {texts.igreja.description.map((p: string, i: number) => (
                      <p key={i} className="text-lg text-stone-600 leading-relaxed" data-json-key={`index.igreja.description[${i}]`}>
                        {p}
                      </p>
                    ))}
                  </div>

                  <Link to="/quemsomos">
                    <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-6 rounded-full text-lg" data-json-key="index.igreja.knowMoreButton">
                      {texts.igreja.knowMoreButton}
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>

                <div className="lg:col-span-2 bg-amber-50 p-10">
                  <h3 className="text-2xl font-bold text-amber-800 mb-8" data-json-key="index.purification.title">
                    {texts.purification.title}
                  </h3>
                  <div className="space-y-6">
                    {texts.purification.phases.map((phase: any, i: number) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-stone-900 mb-1" data-json-key={`index.purification.phases[${i}].title`}>
                            {phase.title}
                          </h4>
                          <p className="text-sm text-stone-600" data-json-key={`index.purification.phases[${i}].description`}>
                            {phase.description}
                          </p>
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
                  <h3 className="text-2xl font-bold text-teal-800 mb-8" data-json-key="index.treatments.title">
                    {texts.treatments?.title || "Tratamentos Oferecidos"}
                  </h3>
                  <div className="space-y-3">
                    {texts.instituto.treatments.slice(0, 7).map((t: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-3">
                        <div className="w-2 h-2 bg-teal-500 rounded-full shrink-0"></div>
                        <span className="text-stone-700" data-json-key={`index.instituto.treatments[${i}]`}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-3 p-12 lg:order-1">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center">
                      <Brain className="w-12 h-12 text-teal-600" />
                    </div>
                    <h2 className="text-4xl font-bold text-stone-900" data-json-key="index.instituto.title">
                      {texts.instituto.title}
                    </h2>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {texts.instituto.description.map((p: string, i: number) => (
                      <p key={i} className="text-lg text-stone-600 leading-relaxed" data-json-key={`index.instituto.description[${i}]`}>
                        {p}
                      </p>
                    ))}
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4 mb-8">
                    <p className="text-sm text-amber-900" data-json-key="index.instituto.legalNotice">
                      {texts.instituto.legalNotice}
                    </p>
                  </div>

                  <Link to="/tratamentos">
                    <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-6 rounded-full text-lg" data-json-key="index.instituto.ctaButton">
                      {texts.instituto.ctaButton}
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
              <h2 className="text-5xl font-bold mb-6 text-stone-900" data-json-key="index.benefitsSection.title">
                {texts.benefitsSection.title}
              </h2>
              <p className="text-2xl text-stone-600" data-json-key="index.benefitsSection.subtitle">
                {texts.benefitsSection.subtitle}
              </p>
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
                    <h3 className="text-xl font-bold mb-4 text-stone-900" data-json-key={`index.instituto.benefits[${i}].title`}>
                      {b.title}
                    </h3>
                    <p className="text-stone-600 leading-relaxed" data-json-key={`index.instituto.benefits[${i}].description`}>
                      {b.description}
                    </p>
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

      {/* ==================== CTA FINAL ==================== */}
      <section className="relative overflow-hidden bg-stone-900 py-20">
        <div className="absolute inset-0 opacity-20 z-0">
          <FooterBackground gradientId="skyGradIndex" />
        </div>

        {/* Sol */}
        <div className="absolute top-8 left-8 w-20 h-20 z-10 drop-shadow-lg">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="20" fill="#CFAF5A" />
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              return (
                <line key={i}
                  x1={50 + Math.cos(angle) * 25} y1={50 + Math.sin(angle) * 25}
                  x2={50 + Math.cos(angle) * 40} y2={50 + Math.sin(angle) * 40}
                  stroke="#CFAF5A" strokeWidth="3" strokeLinecap="round" />
              );
            })}
          </svg>
        </div>

        {/* Lua */}
        <div className="absolute top-8 right-8 w-20 h-20 z-20">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <mask id="crescentMaskIndex">
                <circle cx="50" cy="50" r="25" fill="white" />
                <circle cx="58" cy="50" r="22" fill="black" />
              </mask>
            </defs>
            <circle cx="50" cy="50" r="25" fill="#F3F4F6" mask="url(#crescentMaskIndex)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-6 text-white" data-json-key="index.cta.title">
              {(texts.cta || texts.testimonialsCta)?.title || 'Comece Sua Jornada'}
            </h2>
            <p className="text-2xl mb-10 text-stone-300" data-json-key="index.cta.subtitle">
              {(texts.cta || texts.testimonialsCta)?.subtitle || 'Entre em contato conosco'}
            </p>
            <Link to="/contato">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-7 text-xl rounded-full shadow-2xl" data-json-key="index.cta.buttonText">
                {(texts.cta || texts.testimonialsCta)?.buttonText || 'Fale Conosco'}
                <ChevronRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16">
          <SharedFooter />
        </div>
      </section>
    </div>
  );
}
