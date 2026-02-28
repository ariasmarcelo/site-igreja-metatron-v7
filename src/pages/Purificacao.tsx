import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Star, Crown, Compass, Heart, Infinity as InfinityIcon, LineChart, ChevronDown, Shield } from 'lucide-react';
import EditableField from '@/components/ui/EditableField';
import { Sun12Rays } from '../components/icons/Sun12Rays';
import { Link } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';
import { usePageContent } from '@/hooks/useContent';
import { PageLoading } from '@/components/PageLoading';

const TestimonialsCarousel = lazy(() => import('@/components/TestimonialsCarousel'));
import { SharedFooter } from '@/components/SharedFooter';
import { FooterBackground } from '@/components/FooterBackground';
import '@/styles/layouts/pages/purificacao.css';

interface PurificacaoTexts {
  header: { title: string; subtitle: string };
  sections?: {
    intro_title?: string;
    process_title?: string;
  };
  intro: { sectionTitle?: string; mainText: string; description: string };
  [key: string]: any;
}

export default function Purificacao() {
  console.log(`[${new Date().toISOString()}] [PURIFICACAO] Component rendering started`);
  
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  
  // usePageContent carrega apenas a página purificacao
  const { data: texts, loading } = usePageContent<PurificacaoTexts>('purificacao');
  


  const togglePhase = (phase: number) => {
    setExpandedPhase(expandedPhase === phase ? null : phase);
  };

  if (loading || !texts) {
    console.log(`[${new Date().toISOString()}] [PURIFICACAO] Waiting for data: loading=${loading}`);
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
  
  // Extract data from page object (with type assertions for nested access)
  const textsTyped = texts as Record<string, Record<string, unknown>>;
  const header = textsTyped.header as { title: string; subtitle: string };
  const intro = textsTyped.intro as { mainText: string; description: string };
  const fases = textsTyped.fases as { title: string; items: { phase: string; title: string; description: string }[] };
  const beneficios = textsTyped.beneficios as { title: string; items: { title: string; description: string }[] };
  const testimonials = textsTyped.testimonials as { title: string };
  const cta = textsTyped.cta as { title?: string; subtitle?: string; buttonText: string };
  
  // Fases detalhadas (type assertion para evitar erros de unknown)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faseInicial = textsTyped.faseInicial as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faseIntermediaria = textsTyped.faseIntermediaria as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faseFinal = textsTyped.faseFinal as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const psicodelicos = textsTyped.psicodelicos as any;
  
  console.log(`[${new Date().toISOString()}] [PURIFICACAO] Data loaded, rendering page`);
  
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50/30 via-stone-50 to-amber-50/20">
      {/* Header */}
      <section className="py-10 bg-linear-to-r from-[#CFAF5A] via-[#E0C76A] to-[#CFAF5A] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(255,255,255,0.35),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_60%,rgba(255,255,255,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_20%,rgba(255,255,255,0.12)_40%,rgba(255,255,255,0.18)_50%,rgba(255,255,255,0.12)_60%,transparent_80%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.1)_43%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.1)_57%,transparent_75%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_30%,transparent_65%)]"></div>
        <div className="absolute inset-0 opacity-65">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="20" fill="rgba(255,255,255,0.8)" />
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
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-section mx-auto text-center">
            <div className="flex justify-center mb-3">
              <svg
                viewBox="0 0 100 100"
                className="w-24 h-24 animate-spin-slow purificacao-icon"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="20" fill="white" />
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
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>
            </div>
            <EditableField
              value={header.title}
              jsonKey="purificacao.header.title"
              type="h1"
              className="text-5xl font-bold mb-4 drop-shadow-[0_4px_12px_rgba(80,50,0,0.9)] [text-shadow:0_2px_4px_rgba(80,50,0,0.6)]"
            />
            <EditableField
              value={header.subtitle}
              jsonKey="purificacao.header.subtitle"
              type="p"
              className="text-xl opacity-90 drop-shadow-[0_2px_8px_rgba(80,50,0,0.8)] [text-shadow:0_1px_3px_rgba(80,50,0,0.5)]"
            />
          </div>
        </div>
      </section>

      {/* Introdução */}
      <section className="py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-section mx-auto">
            <Card className="border border-amber-200/80 shadow-2xl overflow-hidden bg-white">
              <div className="h-1.5 bg-linear-to-r from-amber-400 via-amber-500 to-amber-400"></div>
              <CardContent className="p-5 md:p-8 text-center">
                <EditableField
                  value={intro.sectionTitle || ''}
                  jsonKey="purificacao.intro.sectionTitle"
                  type="h2"
                  className="text-3xl md:text-4xl font-light text-[#A08930] mb-6 tracking-wide [text-shadow:0_0_20px_rgba(207,175,90,0.25)]"
                />
                <EditableField
                  value={intro.mainText}
                  jsonKey="purificacao.intro.mainText"
                  type="p"
                  className="text-base md:text-lg text-stone-700 leading-loose mb-3 whitespace-pre-line"
                />
                <EditableField
                  value={intro.description}
                  jsonKey="purificacao.intro.description"
                  type="p"
                  className="text-lg text-stone-600 leading-relaxed"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Fluxo das Três Fases — Timeline Dourada Quente */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-section mx-auto">
            <Card className="border border-amber-200/80 shadow-2xl overflow-hidden bg-linear-to-b from-amber-50 via-[#FBF5E6] to-amber-50 relative">
              <div className="h-1.5 bg-linear-to-r from-amber-400 via-amber-500 to-amber-400"></div>
              {/* Efeitos de brilho suave */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-175 h-125 bg-[#CFAF5A]/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#CFAF5A]/10 rounded-full blur-[100px]"></div>
              </div>
              <CardContent className="p-6 md:p-10 relative z-10">
                <div>
            
            {/* Título da Seção */}
            <div className="text-center mb-8">
              <EditableField
                value={texts.sections?.process_title}
                jsonKey="purificacao.sections.process_title"
                type="h2"
                className="text-3xl md:text-4xl font-light text-[#A08930] mb-3 tracking-wide [text-shadow:0_0_20px_rgba(207,175,90,0.25)]"
              />
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-24 bg-linear-to-r from-transparent to-[#CFAF5A]/50"></div>
                <svg viewBox="0 0 100 100" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="14" fill="#CFAF5A" opacity="0.8" />
                  {[...Array(8)].map((_, i) => {
                    const angle = (i * 45 * Math.PI) / 180;
                    return (
                      <line key={i} x1={50 + Math.cos(angle) * 20} y1={50 + Math.sin(angle) * 20} x2={50 + Math.cos(angle) * 32} y2={50 + Math.sin(angle) * 32} stroke="#CFAF5A" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                    );
                  })}
                </svg>
                <div className="h-px w-24 bg-linear-to-l from-transparent to-[#CFAF5A]/50"></div>
              </div>
            </div>

            {/* Timeline Container */}
            <div className="relative">
              {/* Linha vertical dourada */}
              <div className="absolute left-2.5 md:left-3.5 top-0 bottom-0 w-px bg-linear-to-b from-[#CFAF5A]/40 via-[#A08930]/25 to-[#CFAF5A]/40"></div>

              {/* FASE 1 - INICIAL */}
              <div className="mb-5 relative pl-8 md:pl-10">
                {/* Nó da timeline */}
                <div className="absolute -left-0.5 md:left-0.5 top-6 w-7 h-7 rounded-full bg-linear-to-br from-[#CFAF5A] to-[#A08930] flex items-center justify-center shadow-[0_0_18px_rgba(207,175,90,0.5)] z-10 ring-2 ring-[#CFAF5A]/30 ring-offset-2 ring-offset-amber-50">
                  <span className="text-white font-bold text-xs">1</span>
                </div>

                {/* Card da Fase */}
                <div
                  className={`bg-white/90 backdrop-blur-sm border border-[#CFAF5A]/30 rounded-2xl shadow-md transition-all duration-500 cursor-pointer hover:shadow-[0_8px_30px_rgba(207,175,90,0.18)] ${
                    expandedPhase === 1 ? 'ring-1 ring-[#CFAF5A]/40 bg-white' : ''
                  }`}
                  onClick={() => togglePhase(1)}
                >
                  {/* Header */}
                  <div className="px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-rose-500" />
                      </div>
                      <div>
                        <EditableField
                          value={faseInicial.title}
                          jsonKey="purificacao.faseInicial.title"
                          type="h3"
                          className="text-xl md:text-2xl text-stone-800 font-medium"
                        />
                        <EditableField
                          value={faseInicial.subtitle}
                          jsonKey="purificacao.faseInicial.subtitle"
                          type="p"
                          className="text-sm text-stone-500"
                        />
                      </div>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-[#A08930]/60 transition-transform duration-300 ${
                        expandedPhase === 1 ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  
                  {/* Conteúdo expandido */}
                  <div 
                    className={`overflow-hidden transition-all duration-500 ${
                      expandedPhase === 1 ? 'max-h-500 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-5 pt-2 space-y-3 border-t border-[#CFAF5A]/15">
                      <div>
                        <EditableField
                          value={faseInicial.objetivo.title}
                          jsonKey="purificacao.faseInicial.objetivo.title"
                          type="h4"
                          className="text-xl font-semibold mb-3 text-stone-800"
                        />
                        <EditableField
                          value={faseInicial.objetivo.content}
                          jsonKey="purificacao.faseInicial.objetivo.content"
                          type="p"
                          className="text-stone-600 leading-relaxed"
                        />
                      </div>

                      <div className="bg-rose-50 border border-rose-200 p-6 rounded-xl">
                        <EditableField
                          value={faseInicial.activities.title}
                          jsonKey="purificacao.faseInicial.activities.title"
                          type="h5"
                          className="font-semibold text-lg mb-4 text-rose-700"
                        />
                        <ul className="space-y-3">
                          {faseInicial.activities.items.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="text-rose-500 font-bold mt-1">•</span>
                              <EditableField
                                value={item}
                                jsonKey={`purificacao.faseInicial.activities.items[${index}]`}
                                type="span"
                                className="text-stone-600"
                              />
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <EditableField
                          value={faseInicial.duration.title}
                          jsonKey="purificacao.faseInicial.duration.title"
                          type="h5"
                          className="font-semibold text-lg mb-3 text-stone-800"
                        />
                        <EditableField
                          value={faseInicial.duration.content}
                          jsonKey="purificacao.faseInicial.duration.content"
                          type="p"
                          className="text-stone-600 leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FASE 2 - INTERMEDIÁRIA */}
              <div className="mb-5 relative pl-8 md:pl-10">
                {/* Nó da timeline */}
                <div className="absolute -left-0.5 md:left-0.5 top-6 w-7 h-7 rounded-full bg-linear-to-br from-[#CFAF5A] to-[#A08930] flex items-center justify-center shadow-[0_0_18px_rgba(207,175,90,0.5)] z-10 ring-2 ring-[#CFAF5A]/30 ring-offset-2 ring-offset-amber-50">
                  <span className="text-white font-bold text-xs">2</span>
                </div>

                {/* Card da Fase */}
                <div
                  className={`bg-white/90 backdrop-blur-sm border border-[#CFAF5A]/30 rounded-2xl shadow-md transition-all duration-500 cursor-pointer hover:shadow-[0_8px_30px_rgba(207,175,90,0.18)] ${
                    expandedPhase === 2 ? 'ring-1 ring-[#CFAF5A]/40 bg-white' : ''
                  }`}
                  onClick={() => togglePhase(2)}
                >
                  {/* Header */}
                  <div className="px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-100 border border-cyan-200 flex items-center justify-center">
                        <LineChart className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div>
                        <EditableField
                          value={faseIntermediaria.title}
                          jsonKey="purificacao.faseIntermediaria.title"
                          type="h3"
                          className="text-xl md:text-2xl text-stone-800 font-medium"
                        />
                        <EditableField
                          value={faseIntermediaria.subtitle}
                          jsonKey="purificacao.faseIntermediaria.subtitle"
                          type="p"
                          className="text-sm text-stone-500"
                        />
                      </div>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-[#A08930]/60 transition-transform duration-300 ${
                        expandedPhase === 2 ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  
                  {/* Conteúdo expandido */}
                  <div 
                    className={`overflow-hidden transition-all duration-500 ${
                      expandedPhase === 2 ? 'max-h-500 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-5 pt-2 space-y-3 border-t border-[#CFAF5A]/15">
                      <div>
                        <EditableField
                          value={faseIntermediaria.requisito.title}
                          jsonKey="purificacao.faseIntermediaria.requisito.title"
                          type="h4"
                          className="text-xl font-semibold mb-3 text-stone-800"
                        />
                        <EditableField
                          value={faseIntermediaria.requisito.content}
                          jsonKey="purificacao.faseIntermediaria.requisito.content"
                          type="p"
                          className="text-stone-600 leading-relaxed"
                        />
                      </div>

                      <div className="bg-cyan-50 border border-cyan-200 p-6 rounded-xl">
                        <EditableField
                          value={faseIntermediaria.trabalhos.title}
                          jsonKey="purificacao.faseIntermediaria.trabalhos.title"
                          type="h5"
                          className="font-semibold text-lg mb-4 text-cyan-700"
                        />
                        <div className="space-y-4">
                          {faseIntermediaria.trabalhos.items.map((item, index) => (
                            <div key={index}>
                              <EditableField
                                value={item.title}
                                jsonKey={`purificacao.faseIntermediaria.trabalhos.items[${index}].title`}
                                type="h6"
                                className="font-semibold text-base mb-2 text-stone-700"
                              />
                              <EditableField
                                value={item.content}
                                jsonKey={`purificacao.faseIntermediaria.trabalhos.items[${index}].content`}
                                type="p"
                                className="text-stone-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <EditableField
                          value={faseIntermediaria.integracao.title}
                          jsonKey="purificacao.faseIntermediaria.integracao.title"
                          type="h5"
                          className="font-semibold text-lg mb-3 text-stone-800"
                        />
                        <EditableField
                          value={faseIntermediaria.integracao.content}
                          jsonKey="purificacao.faseIntermediaria.integracao.content"
                          type="p"
                          className="text-stone-600 leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FASE 3 - FINAL */}
              <div className="mb-3 relative pl-8 md:pl-10">
                {/* Nó da timeline */}
                <div className="absolute -left-0.5 md:left-0.5 top-6 w-7 h-7 rounded-full bg-linear-to-br from-[#CFAF5A] to-[#A08930] flex items-center justify-center shadow-[0_0_18px_rgba(207,175,90,0.5)] z-10 ring-2 ring-[#CFAF5A]/30 ring-offset-2 ring-offset-amber-50">
                  <span className="text-white font-bold text-xs">3</span>
                </div>

                {/* Card da Fase */}
                <div
                  className={`bg-white/90 backdrop-blur-sm border border-[#CFAF5A]/30 rounded-2xl shadow-md transition-all duration-500 cursor-pointer hover:shadow-[0_8px_30px_rgba(207,175,90,0.18)] ${
                    expandedPhase === 3 ? 'ring-1 ring-[#CFAF5A]/40 bg-white' : ''
                  }`}
                  onClick={() => togglePhase(3)}
                >
                  {/* Header */}
                  <div className="px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center">
                        <Crown className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <EditableField
                          value={faseFinal.title}
                          jsonKey="purificacao.faseFinal.title"
                          type="h3"
                          className="text-xl md:text-2xl text-stone-800 font-medium"
                        />
                        <EditableField
                          value={faseFinal.subtitle}
                          jsonKey="purificacao.faseFinal.subtitle"
                          type="p"
                          className="text-sm text-stone-500"
                        />
                      </div>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-[#A08930]/60 transition-transform duration-300 ${
                        expandedPhase === 3 ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  
                  {/* Conteúdo expandido */}
                  <div 
                    className={`overflow-hidden transition-all duration-500 ${
                      expandedPhase === 3 ? 'max-h-625 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-5 pt-2 space-y-3 border-t border-[#CFAF5A]/15">
                      <div>
                        <EditableField
                          value={faseFinal.iniciacao.content}
                          jsonKey="purificacao.faseFinal.iniciacao.content"
                          type="p"
                          className="text-stone-600 leading-relaxed"
                        />
                      </div>

                      <div className="bg-linear-to-r from-[#CFAF5A]/15 to-amber-100/50 border border-[#CFAF5A]/30 rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <svg viewBox="0 0 100 100" className="w-12 h-12 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="20" fill="#A08930" />
                            {[...Array(12)].map((_, i) => {
                              const angle = (i * 30 * Math.PI) / 180;
                              const x1 = 50 + Math.cos(angle) * 25;
                              const y1 = 50 + Math.sin(angle) * 25;
                              const x2 = 50 + Math.cos(angle) * 40;
                              const y2 = 50 + Math.sin(angle) * 40;
                              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#A08930" strokeWidth="3" strokeLinecap="round" />;
                            })}
                          </svg>
                          <EditableField
                            value={faseFinal.evento.title ?? 'O Evento Iniciático'}
                            jsonKey="purificacao.faseFinal.evento.title"
                            type="h5"
                            className="font-semibold text-xl text-[#A08930]"
                          />
                        </div>
                        {faseFinal.evento.content.map((para: string, i: number) => (
                          <EditableField
                            key={i}
                            value={para}
                            jsonKey={`purificacao.faseFinal.evento.content[${i}]`}
                            type="p"
                            className={`text-stone-600 leading-relaxed ${i > 0 ? 'mt-3' : ''}`}
                          />
                        ))}
                      </div>

                      <div>
                        <EditableField
                          value={faseFinal.posIniciacao.title}
                          jsonKey="purificacao.faseFinal.posIniciacao.title"
                          type="h5"
                          className="font-semibold text-lg mb-3 text-stone-800"
                        />
                        <EditableField
                          value={faseFinal.posIniciacao.content}
                          jsonKey="purificacao.faseFinal.posIniciacao.content"
                          type="p"
                          className="text-stone-600 leading-relaxed mb-4"
                        />
                        <ul className="space-y-3">
                          {faseFinal.posIniciacao.items.map((it: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="text-[#A08930] font-bold mt-1">✦</span>
                              <EditableField
                                value={it}
                                jsonKey={`purificacao.faseFinal.posIniciacao.items[${idx}]`}
                                type="span"
                                className="text-stone-600"
                              />
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                        <EditableField
                          value={faseFinal.adepto.title}
                          jsonKey="purificacao.faseFinal.adepto.title"
                          type="h5"
                          className="font-semibold text-lg mb-3 text-blue-700"
                        />
                        <EditableField
                          value={faseFinal.adepto.content}
                          jsonKey="purificacao.faseFinal.adepto.content"
                          type="p"
                          className="text-blue-600/80 leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trabalhos Espirituais com Psicodélicos */}
      <section className="py-16 bg-linear-to-br from-purple-800 via-indigo-800 to-purple-900 relative overflow-hidden">
        {/* Efeitos de fundo místicos */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-fuchsia-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-section mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-2 border-purple-300/30 shadow-2xl">
              <CardHeader className="bg-linear-to-br from-purple-500/50 via-fuchsia-400/50 to-indigo-500/50 backdrop-blur-sm text-white pt-6 pb-3 px-8 relative overflow-hidden border-b-2 border-purple-300/40">
                {/* Padr├Áes geom├®tricos sagrados */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 w-32 h-32 border-2 border-white rounded-full"></div>
                  <div className="absolute top-4 left-4 w-32 h-32 border-2 border-white rounded-full transform rotate-45"></div>
                  <div className="absolute bottom-4 right-4 w-40 h-40 border-2 border-white rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-40 h-40 border-2 border-white rounded-full transform rotate-45"></div>
                </div>
                
                {/* Efeitos de luz */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.35),transparent_50%)]"></div>
                
                <div className="text-center relative z-10">
                  <div className="inline-block mb-2 animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]">
                    <InfinityIcon className="w-24 h-24 mx-auto drop-shadow-2xl filter brightness-125" />
                  </div>
                  <EditableField
                    value={psicodelicos.title}
                    jsonKey="purificacao.psicodelicos.title"
                    type="h3"
                    className="text-3xl md:text-4xl font-semibold mb-3 drop-shadow-lg font-['Poppins',sans-serif] tracking-[0.02em] [text-shadow:0_0_30px_rgba(255,255,255,0.6),0_0_60px_rgba(167,139,250,0.5)]"
                  />
                  <EditableField
                    value={psicodelicos.subtitle}
                    jsonKey="purificacao.psicodelicos.subtitle"
                    type="p"
                    className="text-xl font-light italic opacity-95 drop-shadow-md pb-2 tracking-[0.05em]"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-8 bg-linear-to-br from-white/95 via-purple-50/90 to-white/95 backdrop-blur-sm">

                {/* Caixa Estilo Papiro Antigo - Texto Introdutório */}
                <div className="max-w-section mx-auto mb-12">
                  <div className="relative papiro-box p-8 rounded-lg border-4 border-amber-900/20 shadow-2xl">
                    
                    {/* Textura de papiro */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none papiro-texture">
                    </div>
                    
                    {/* Bordas decorativas do papiro */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-amber-800/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-amber-800/30 to-transparent"></div>
                    <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-transparent via-amber-800/30 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-1 h-full bg-linear-to-b from-transparent via-amber-800/30 to-transparent"></div>
                    
                    {/* Ornamentos nos cantos */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-800/40 rounded-tl-lg"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-800/40 rounded-tr-lg"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-800/40 rounded-bl-lg"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-800/40 rounded-br-lg"></div>
                    
                    {/* Texto em estilo manuscrito antigo */}
                    <div className="relative z-10 text-center space-y-6">
                      <div className="text-xl md:text-2xl text-amber-950 leading-relaxed font-serif italic papiro-text" 
                         data-json-key="purificacao.psicodelicos.intro"
                         dangerouslySetInnerHTML={{ __html: psicodelicos.intro }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Tripla Proteção - MANTIDO INTACTO */}
                <div className="bg-linear-to-br from-purple-100/80 via-fuchsia-50/70 to-indigo-100/80 p-6 pt-4 rounded-2xl border-2 border-purple-300/50 shadow-xl backdrop-blur-sm relative overflow-hidden mb-12">
                  {/* Efeito de brilho de fundo */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(167,139,250,0.2),transparent_70%)]"></div>
                  
                  {/* Ícone de Escudo Dourado Metálico */}
                  <div className="flex justify-center mb-2">
                    <div className="relative w-16 h-16">
                      <Shield className="w-16 h-16 text-amber-500 relative z-10 shield-gold-icon" />
                      <svg width="0" height="0">
                        <defs>
                          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fcd34d" />
                            <stop offset="50%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#b45309" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                  
                  <EditableField
                    value={psicodelicos.tripleProtection.title}
                    jsonKey="purificacao.psicodelicos.tripleProtection.title"
                    type="h4"
                    className="font-semibold text-2xl text-purple-900 mb-8 text-center relative z-10 tracking-[0.03em]"
                  />
                  
                  <div className="grid md:grid-cols-3 gap-8 relative z-10">
                    <div className="text-center bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                        <Compass className="w-10 h-10 text-blue-600" />
                      </div>
                      <EditableField
                        value={psicodelicos.tripleProtection.cards[0].title}
                        jsonKey="purificacao.psicodelicos.tripleProtection.cards[0].title"
                        type="h5"
                        className="font-semibold text-lg mb-3 text-blue-900"
                      />
                      <EditableField
                        value={psicodelicos.tripleProtection.cards[0].description}
                        jsonKey="purificacao.psicodelicos.tripleProtection.cards[0].description"
                        type="p"
                        className="text-sm text-gray-700 leading-relaxed"
                      />
                    </div>
                    <div className="text-center bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                        <Heart className="w-10 h-10 text-green-600" />
                      </div>
                      <EditableField
                        value={psicodelicos.tripleProtection.cards[1].title}
                        jsonKey="purificacao.psicodelicos.tripleProtection.cards[1].title"
                        type="h5"
                        className="font-semibold text-lg mb-3 text-green-900"
                      />
                      <EditableField
                        value={psicodelicos.tripleProtection.cards[1].description}
                        jsonKey="purificacao.psicodelicos.tripleProtection.cards[1].description"
                        type="p"
                        className="text-sm text-gray-700 leading-relaxed"
                      />
                    </div>
                    <div className="text-center bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                        <Sun12Rays className="w-10 h-10 text-amber-600" />
                      </div>
                      <EditableField
                        value={psicodelicos.tripleProtection.cards[2].title}
                        jsonKey="purificacao.psicodelicos.tripleProtection.cards[2].title"
                        type="h5"
                        className="font-semibold text-lg mb-3 text-amber-900"
                      />
                      <EditableField
                        value={psicodelicos.tripleProtection.cards[2].description}
                        jsonKey="purificacao.psicodelicos.tripleProtection.cards[2].description"
                        type="p"
                        className="text-sm text-gray-700 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                {/* Aplicações Espirituais e Terapêuticas */}
                <div className="mt-16 mb-16">
                  <EditableField 
                    value={psicodelicos.applications.title}
                    jsonKey="purificacao.psicodelicos.applications.title"
                    type="h3"
                    className="font-semibold text-3xl text-purple-900 text-center mb-10 tracking-wide"
                  />
                  <ul className="space-y-5 max-w-section mx-auto">
                    {psicodelicos.applications.items.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-4 bg-white/70 backdrop-blur-sm p-5 rounded-xl border border-purple-200/60 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                        <span className="text-purple-600 mt-0.5 text-2xl font-bold shrink-0">✦</span>
                        <span className="text-gray-800 leading-relaxed text-base" 
                              data-json-key={`purificacao.psicodelicos.applications.items[${idx}]`} 
                              dangerouslySetInnerHTML={{ __html: item }} 
                        />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Caixa Estilo Papiro - Conclusão */}
                <div className="max-w-section mx-auto mb-16">
                  <div className="relative papiro-box p-10 rounded-lg border-4 border-amber-900/20 shadow-2xl">
                    
                    {/* Textura de papiro */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none papiro-texture">
                    </div>
                    
                    {/* Bordas decorativas do papiro */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-amber-800/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-amber-800/30 to-transparent"></div>
                    <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-transparent via-amber-800/30 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-1 h-full bg-linear-to-b from-transparent via-amber-800/30 to-transparent"></div>
                    
                    {/* Ornamentos nos cantos */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-800/40 rounded-tl-lg"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-800/40 rounded-tr-lg"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-800/40 rounded-bl-lg"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-800/40 rounded-br-lg"></div>
                    
                    {/* Conteúdo */}
                    <div className="relative z-10 text-center space-y-6">
                      <h4 className="font-bold text-2xl md:text-3xl text-amber-950 tracking-wide font-serif papiro-title" >
                        <EditableField 
                          value={psicodelicos.conclusion.title}
                          jsonKey="purificacao.psicodelicos.conclusion.title"
                          type="span"
                          className="inline"
                        />
                      </h4>
                      <p className="text-lg md:text-xl text-amber-950 leading-relaxed font-serif italic papiro-text">
                        <EditableField 
                          value={psicodelicos.conclusion.content}
                          jsonKey="purificacao.psicodelicos.conclusion.content"
                          type="span"
                          className="inline"
                        />
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botão CTA */}
                <div className="text-center mt-12">
                  <Link to="/contato">
                    <Button size="lg" className="bg-linear-to-r from-purple-500 via-fuchsia-400 to-indigo-500 hover:from-purple-600 hover:via-fuchsia-500 hover:to-indigo-600 text-white shadow-2xl text-lg px-10 py-7 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 cta-button-spacing [box-shadow:0_0_20px_rgba(167,139,250,0.4),0_0_40px_rgba(167,139,250,0.2)]">
                      <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
                      <EditableField 
                        value={psicodelicos.ctaButton}
                        jsonKey="purificacao.psicodelicos.ctaButton"
                        type="span"
                        className="inline"
                      />
                    </Button>
                  </Link>
                </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <Suspense fallback={
        <section className="py-20 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CFAF5A] mx-auto mb-4"></div>
              <p className="text-stone-600">Carregando testemunhos...</p>
            </div>
          </div>
        </section>
      }>
        <TestimonialsCarousel />
      </Suspense>

      {/* Footer com horizonte terrestre */}
      <section className="relative overflow-hidden bg-slate-900">
        {/* Horizonte terrestre: céu acima, terra abaixo */}
        <FooterBackground
          gradientId="skyGradientPurificacao"
          skyColors={['#1e3a5f', '#4b6cb7', '#d4a843']}
          earthColor="#5c4a30"
          waterColors={['#0ea5e9', '#0284c7', '#0369a1']}
        />

        {/* CTA Content - posicionado no céu */}
        <div className="container mx-auto px-4 relative z-50 pt-6 pb-4">
          <div className="max-w-section mx-auto text-center">
            <EditableField 
              value={cta.title}
              jsonKey="purificacao.cta.title"
              type="h2"
              className="text-3xl md:text-4xl font-bold mb-4 text-white text-shadow-strong"
            />
            <EditableField 
              value={cta.subtitle}
              jsonKey="purificacao.cta.subtitle"
              type="p"
              className="text-lg mb-5 text-white text-shadow-medium"
            />
            <Link to="/contato">
              <Button className="bg-[#CFAF5A] text-white font-semibold px-6 py-4 text-base rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105">
                <EditableField 
                  value={cta.buttonText}
                  jsonKey="purificacao.cta.buttonText"
                  type="span"
                  className="inline"
                />
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Content - Copyright (do DB: compartilhado) */}
        <SharedFooter 
          className="pt-8 pb-4"
        />
      </section>
    </div>
  );
}
