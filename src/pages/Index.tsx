import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Heart, Brain, Ghost, Sparkles, ChevronRight, TrendingUp, MessageCircle } from 'lucide-react';
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

      {/* ==================== REDESCUBRA ==================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Título centralizado */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Heart className="w-12 h-12 text-amber-600" />
              </div>
              <EditableField 
                value={texts?.instituto?.firstCallTitle}
                jsonKey="index.instituto.firstCallTitle" 
                type="h2"
                className="text-4xl font-bold text-amber-800 leading-tight"
              />
            </div>

            {/* Conteúdo full-width */}
            <div className="space-y-5 mb-10">
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
                      ? 'text-base text-stone-800 font-bold mt-6' 
                      : 'text-base text-stone-600 leading-relaxed'
                  }
                />
              ))}
            </div>

            {/* Checkmarks em 2 colunas */}
            {(texts?.instituto?.firstCallList?.length || 0) > 0 && (
              <div className="bg-amber-50 rounded-2xl p-8 mb-8 border border-amber-200">
                <div className="grid md:grid-cols-2 gap-4">
                  {texts.instituto.firstCallList.map((li: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-amber-600 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <EditableField
                        value={li}
                        jsonKey={`index.instituto.firstCallList[${i}]`}
                        type="span"
                        className="text-stone-800 font-medium"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {texts?.instituto?.firstCallFooter && (
              <div className="bg-amber-600 text-white rounded-xl p-6 shadow-lg">
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
                  
                  <ul className="space-y-3 mb-8">
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
                  
                  <Link to="/tratamentos">
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-5 rounded-full text-base">
                      Explorar Tratamentos
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
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
                  
                  <ul className="space-y-3 mb-8">
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
                  
                  <Link to="/purificacao">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-5 rounded-full text-base">
                      Caminho de Purificação
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== DOIS CAMINHOS ==================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <EditableField
                value={texts.caminhos?.title}
                jsonKey="index.caminhos.title"
                type="h2"
                className="text-5xl font-bold mb-4 text-stone-900"
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              {/* IGREJA */}
              <div className="bg-linear-to-br from-amber-50 to-white rounded-2xl p-10 border border-amber-200 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center shadow">
                    <Sun12Rays className="w-10 h-10 text-amber-600" />
                  </div>
                  <EditableField
                    value={texts.igreja?.title}
                    jsonKey="index.igreja.title"
                    type="h3"
                    className="text-2xl font-bold text-amber-800"
                  />
                </div>

                <EditableField
                  value={texts.caminhos?.igreja?.resumo}
                  jsonKey="index.caminhos.igreja.resumo"
                  type="p"
                  className="text-stone-600 leading-relaxed mb-6"
                />

                <ul className="space-y-3 mb-8">
                  {texts.caminhos?.igreja?.items?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-amber-600 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <EditableField
                        value={item}
                        jsonKey={`index.caminhos.igreja.items[${i}]`}
                        type="span"
                        className="text-stone-700 font-medium"
                      />
                    </li>
                  ))}
                </ul>

                <Link to="/quemsomos">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-5 rounded-full text-base w-full">
                    <EditableField
                      value={texts.caminhos?.igreja?.button}
                      jsonKey="index.caminhos.igreja.button"
                      type="span"
                      className="inline"
                    />
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* INSTITUTO */}
              <div className="bg-linear-to-br from-teal-50 to-white rounded-2xl p-10 border border-teal-200 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center shadow">
                    <Brain className="w-10 h-10 text-teal-600" />
                  </div>
                  <EditableField
                    value={texts.instituto?.title}
                    jsonKey="index.instituto.title"
                    type="h3"
                    className="text-2xl font-bold text-teal-800"
                  />
                </div>

                <EditableField
                  value={texts.caminhos?.instituto?.resumo}
                  jsonKey="index.caminhos.instituto.resumo"
                  type="p"
                  className="text-stone-600 leading-relaxed mb-6"
                />

                <ul className="space-y-3 mb-8">
                  {texts.caminhos?.instituto?.items?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-teal-600 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <EditableField
                        value={item}
                        jsonKey={`index.caminhos.instituto.items[${i}]`}
                        type="span"
                        className="text-stone-700 font-medium"
                      />
                    </li>
                  ))}
                </ul>

                <Link to="/tratamentos">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-5 rounded-full text-base w-full">
                    <EditableField
                      value={texts.caminhos?.instituto?.button}
                      jsonKey="index.caminhos.instituto.button"
                      type="span"
                      className="inline"
                    />
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
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
                      {i === 2 && <TrendingUp className="w-10 h-10 text-stone-600" />}
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

      {/* ==================== TESTEMUNHOS CTA ==================== */}
      <section className="py-14 bg-linear-to-r from-stone-100 via-stone-50 to-stone-100 border-y border-stone-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center shadow">
                <MessageCircle className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-stone-900 mb-1">Testemunhos</h3>
                <EditableField
                  value={texts.testemunhos_cta}
                  jsonKey="index.testemunhos_cta"
                  type="p"
                  className="text-stone-600"
                />
              </div>
            </div>
            <Link to="/testemunhos">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-5 rounded-full text-base whitespace-nowrap">
                <EditableField
                  value={texts.testemunhos_cta?.button}
                  jsonKey="index.testemunhos_cta.button"
                  type="span"
                  className="inline"
                />
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
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
