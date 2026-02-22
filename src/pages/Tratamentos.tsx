import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Heart, Wind, Route, Flower2, Sparkles, AlertTriangle, Users, Infinity as InfinityIcon, Activity, Stethoscope, Waves, Compass, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditableField from '@/components/ui/EditableField';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { usePageContent } from '@/hooks/useContent';
import { SharedFooter } from '@/components/SharedFooter';
import { FooterBackground } from '@/components/FooterBackground';
import { usePageStyles } from '@/hooks/usePageStyles';
import { PageLoading } from '@/components/PageLoading';
import '@/styles/layouts/pages/tratamentos.css';
import '@/styles/waves.css';


interface TratamentosTexts {
  header: { title: string; subtitle: string };
  sections: {
    intro_title: string;
    treatments_title: string;
  };
  intro: { p1: string; p2: string };
  legal: { title: string; notice: string };
  treatments: Array<Record<string, string>>;
  footer?: { copyright: string; trademark: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function Tratamentos() {
  usePageStyles('tratamentos');
  const [showLegal, setShowLegal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: texts, loading, error } = usePageContent<any>('tratamentos');
  
  if (loading || !texts) {
    console.log(`[${new Date().toISOString()}] [TRATAMENTOS] Waiting for data: loading=${loading}`);
    return (
      <PageLoading
        icon={Stethoscope}
        text="Carregando tratamentos..."
        bgColor="bg-gradient-to-b from-cyan-50 to-blue-50"
        iconColor="text-cyan-600"
        textColor="text-cyan-900"
      />
    );
  }

  const icons = [
    <Users className="w-12 h-12" />,
    <Brain className="w-12 h-12" />,
    <Wind className="w-12 h-12" />,
    <Route className="w-12 h-12" />,
    <Heart className="w-12 h-12" />,
    <Flower2 className="w-12 h-12" />,
    <InfinityIcon className="w-12 h-12" />,
    <Sparkles className="w-12 h-12" />
  ];

  const treatments = texts.treatments;

  // Mapear cores dos treatments para classes CSS
  const getGradientClass = (index: number) => {
    const classMap = [
      'accordion-trigger-gradient-psychotherapy',
      'accordion-trigger-gradient-neurofeedback',
      'accordion-trigger-gradient-breathwork',
      'accordion-trigger-gradient-emdr',
      'accordion-trigger-gradient-biodynamic-massage',
      'accordion-trigger-gradient-body-therapy',
      'accordion-trigger-gradient-pap'
    ];
    return classMap[index] || classMap[0];
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-blue-50">
      {/* Header */}
      <section className="py-10 bg-linear-to-r from-cyan-600 via-blue-600 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,white,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,white,transparent_50%)]"></div>
        </div>
        <div className="absolute inset-0 opacity-15">
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
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Stethoscope className="h-10 w-10" />
              </div>
            </div>
            <EditableField
              value={texts.header.title}
              jsonKey="tratamentos.header.title"
              type="h1"
              className="text-5xl font-bold mb-4 drop-shadow-lg"
            />
            <EditableField
              value={texts.header.subtitle}
              jsonKey="tratamentos.header.subtitle"
              type="p"
              className="text-xl opacity-90 drop-shadow-md"
            />
          </div>
        </div>

        {/* Aviso Legal - ícone discreto no canto inferior direito */}
        <div className="absolute bottom-3 right-4 z-20">
          <div
            className="w-7 h-7 rounded-full bg-amber-400 border border-amber-300 flex items-center justify-center cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.4),0_0_20px_rgba(217,170,0,0.35)] hover:shadow-[0_3px_16px_rgba(0,0,0,0.5),0_0_28px_rgba(217,170,0,0.45)] hover:scale-105 transition-all duration-300 animate-[pulse_3s_ease-in-out_infinite]"
            onClick={() => setShowLegal(!showLegal)}
            onMouseEnter={() => setShowLegal(true)}
            onMouseLeave={() => setShowLegal(false)}
          >
            <AlertTriangle className="w-4 h-4 text-stone-700 -mt-px" />
          </div>
          {/* Tooltip */}
          <div
            className={`absolute bottom-full right-0 mb-2 w-max max-w-[90vw] transition-all duration-300 ease-out ${
              showLegal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onMouseEnter={() => setShowLegal(true)}
            onMouseLeave={() => setShowLegal(false)}
          >
            <div className="relative bg-amber-50 border-2 border-amber-400 rounded-xl shadow-2xl p-5 text-left">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-400 via-orange-500 to-amber-400 rounded-t-xl"></div>
              <div className="flex items-start gap-4">
                <div className="shrink-0 mt-1">
                  <AlertTriangle className="w-10 h-10 text-amber-600" />
                </div>
                <div className="flex-1">
                  <EditableField
                    value={texts.legal.title}
                    jsonKey="tratamentos.legal.title"
                    type="h4"
                    className="text-base font-bold text-amber-900 mb-2"
                  />
                  <EditableField
                    value={texts.legal.notice}
                    jsonKey="tratamentos.legal.notice"
                    type="p"
                    className="text-amber-900 text-sm leading-snug"
                  />
                </div>
              </div>
              {/* Seta apontando para baixo */}
              <div className="absolute -bottom-2 right-4 w-4 h-4 bg-amber-50 border-r-2 border-b-2 border-amber-400 rotate-45"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pt-3 pb-16 space-y-6 max-w-6xl">

        {/* Introdução - Destaque Premium */}
        <div className="relative bg-linear-to-br from-blue-50 via-cyan-50/90 to-teal-50/80 rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-blue-200/60 overflow-hidden">
          {/* Efeitos decorativos de fundo */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-300 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-56 h-56 bg-cyan-300 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-200 rounded-full blur-3xl"></div>
          </div>
          
          {/* Padrão de linhas sutis */}
          <div className="absolute inset-0 opacity-[0.03] tratamentos-pattern"></div>
          
          {/* Título */}
          <EditableField
            value={texts.sections?.intro_title}
            jsonKey="tratamentos.sections.intro_title"
            type="h2"
            className="text-3xl md:text-4xl font-bold text-center mb-6 text-slate-800 relative z-10 drop-shadow-sm"
          />
          
          <div className="max-w-5xl mx-auto space-y-5 relative z-10">
            {/* Primeiro parágrafo com destaque */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-blue-100/50">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="shrink-0 md:pt-1 flex justify-center md:justify-start">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                    <Stethoscope className="w-5 h-5 text-white" />
                  </div>
                </div>
                <EditableField
                  value={texts.intro.p1}
                  jsonKey="tratamentos.intro.p1"
                  type="p"
                  className="text-lg md:text-xl text-slate-800 leading-relaxed font-medium text-center md:text-left"
                />
              </div>
            </div>
            
            {/* Segundo parágrafo com destaque */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-cyan-100/50">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="shrink-0 md:pt-1 flex justify-center md:justify-start">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-md">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                </div>
                <EditableField
                  value={texts.intro.p2}
                  jsonKey="tratamentos.intro.p2"
                  type="p"
                  className="text-lg md:text-xl text-slate-800 leading-relaxed font-medium text-center md:text-left"
                />
              </div>
            </div>
          </div>
          
          {/* Linha decorativa inferior */}
          <div className="relative z-10 mt-6 flex justify-center">
            <div className="h-1 w-32 bg-linear-to-r from-transparent via-cyan-400 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Tratamentos - Accordion em Box Agrupado */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-200">
          <EditableField
            value={texts.sections?.treatments_title}
            jsonKey="tratamentos.sections.treatments_title"
            type="h2"
            className="text-3xl md:text-4xl font-bold text-center mb-6 text-slate-800 drop-shadow-sm"
          />
          
          <Accordion type="multiple" className="max-w-5xl mx-auto space-y-4">
            {treatments.map((treatment, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-2 border-slate-200 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden"
              >
                <AccordionTrigger 
                  className={`px-6 py-5 hover:no-underline relative [&>svg]:h-10 [&>svg]:w-10 [&>svg]:text-slate-700 [&>svg]:relative [&>svg]:z-20 ${getGradientClass(index)}`}
                >
                  <div className="absolute inset-0 bg-white/75"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.4),transparent_60%)]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.3),transparent_60%)]"></div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-4 w-full relative z-10">
                    <div className="shrink-0 text-slate-700 drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)] flex justify-center md:justify-start">
                      {icons[index]}
                    </div>
                    <div className="flex-1 text-center md:text-left pr-4">
                      <EditableField
                        value={treatment.title.includes('(supervisão geral integrada)') 
                          ? treatment.title.split('(')[0]
                          : treatment.title
                        }
                        jsonKey={`tratamentos.treatments[${index}].title`}
                        type="h3"
                        className="text-xl md:text-2xl font-semibold text-slate-800 mb-1"
                      />
                      <EditableField
                        value={treatment.description}
                        jsonKey={`tratamentos.treatments[${index}].description`}
                        type="p"
                        className="text-slate-700 text-sm md:text-base"
                      />
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-6 pt-4 bg-linear-to-br from-white to-slate-50">
                  <div className="space-y-4">
                    {/* Sobre o Tratamento */}
                    <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400 shadow-sm">
                      <h4 className="text-base font-semibold text-slate-800 mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" />
                        <EditableField
                          value={texts.labels.about}
                          jsonKey="tratamentos.labels.about"
                          type="span"
                          className="inline"
                        />
                      </h4>
                      <EditableField
                        value={treatment.details}
                        jsonKey={`tratamentos.treatments[${index}].details`}
                        type="p"
                        className="text-slate-700 text-sm leading-relaxed"
                      />
                    </div>

                    {/* Indicações */}
                    {treatment.indications && (
                      <div className="bg-teal-50 rounded-lg p-4 border-l-4 border-teal-400">
                        <EditableField
                          value={texts.labels.indications}
                          jsonKey="tratamentos.labels.indications"
                          type="h5"
                          className="text-sm font-semibold text-teal-900 mb-2"
                        />
                        <EditableField
                          value={treatment.indications}
                          jsonKey={`tratamentos.treatments[${index}].indications`}
                          type="p"
                          className="text-teal-800 text-sm leading-relaxed"
                        />
                      </div>
                    )}

                    {/* Benefícios */}
                    {treatment.benefits && (
                      <div className="bg-emerald-50 rounded-lg p-4 border-l-4 border-emerald-400">
                        <EditableField
                          value={texts.labels.benefits}
                          jsonKey="tratamentos.labels.benefits"
                          type="h5"
                          className="text-sm font-semibold text-emerald-900 mb-2"
                        />
                        <EditableField
                          value={treatment.benefits}
                          jsonKey={`tratamentos.treatments[${index}].benefits`}
                          type="p"
                          className="text-emerald-800 text-sm leading-relaxed"
                        />
                      </div>
                    )}

                    {/* Contraindicações */}
                    {treatment.contraindications && (
                      <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-400">
                        <h4 className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          <EditableField
                            value={texts.labels.contraindications}
                            jsonKey="tratamentos.labels.contraindications"
                            type="span"
                            className="inline"
                          />
                        </h4>
                        <EditableField
                          value={treatment.contraindications}
                          jsonKey={`tratamentos.treatments[${index}].contraindications`}
                          type="p"
                          className="text-red-800 text-sm leading-relaxed"
                        />
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-3">
                      {/* Duração */}
                      {treatment.duration && (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <EditableField
                            value={texts.labels.duration}
                            jsonKey="tratamentos.labels.duration"
                            type="h5"
                            className="text-xs font-semibold text-blue-900 mb-1"
                          />
                          <EditableField
                            value={treatment.duration}
                            jsonKey={`tratamentos.treatments[${index}].duration`}
                            type="p"
                            className="text-blue-800 text-xs"
                          />
                        </div>
                      )}

                      {/* Profissional */}
                      {treatment.professional && (
                        <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                          <EditableField
                            value={texts.labels.professional}
                            jsonKey="tratamentos.labels.professional"
                            type="h5"
                            className="text-xs font-semibold text-cyan-900 mb-1"
                          />
                          <EditableField
                            value={treatment.professional}
                            jsonKey={`tratamentos.treatments[${index}].professional`}
                            type="p"
                            className="text-cyan-800 text-xs"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Tripla Proteção - Design Premium com Simbolismo */}
        <div className="mt-12 mb-0">
          <div className="relative bg-linear-to-br from-slate-50 via-stone-100 to-slate-50 rounded-3xl shadow-2xl border-2 border-stone-300 overflow-hidden">
            {/* Padrão decorativo de fundo - simbolizando interconexão */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="absolute top-10 left-10 w-64 h-64 border-4 border-teal-400 rounded-full"></div>
              <div className="absolute top-10 right-10 w-64 h-64 border-4 border-amber-400 rounded-full"></div>
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-64 border-4 border-rose-400 rounded-full"></div>
            </div>

            {/* Efeitos de luz suaves */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-200 rounded-full blur-3xl"></div>
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-200 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 p-8 md:p-12">
              {/* Header com ícone de proteção */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="relative">
                    {/* Luz azul pulsante de fundo com efeito blur - aparecer/sumir em 3 segundos */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-blue-400 rounded-full blur-2xl animate-blue-glow"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full blur-xl animate-blue-glow-delay-1"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-cyan-300 rounded-full blur-lg animate-blue-glow-delay-2"></div>
                    </div>
                    <div className="relative w-32 h-32 rounded-full flex items-center justify-center">
                      <span className="text-8xl drop-shadow-2xl">🛡️</span>
                    </div>
                  </div>
                </div>
                
                <EditableField 
                  value={texts.triplaProtecao?.title}
                  jsonKey="tratamentos.triplaProtecao.title"
                  type="h2"
                  className="text-3xl md:text-4xl font-bold mb-3 text-slate-800 tracking-tight"
                />
                <div className="w-24 h-1 bg-linear-to-r from-transparent via-slate-400 to-transparent mx-auto mb-4"></div>
                <EditableField 
                  value={texts.triplaProtecao?.subtitle}
                  jsonKey="tratamentos.triplaProtecao.subtitle"
                  type="p"
                  className="text-lg md:text-xl text-slate-700 max-w-5xl mx-auto leading-relaxed font-medium"
                />
              </div>

              {/* Grid dos três pilares */}
              <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {texts.triplaProtecao?.items?.map((item: any, i: number) => {
                  const icons = [Compass, Heart, Sun];
                  const gradients = [
                    'from-teal-500 to-cyan-600',
                    'from-pink-400 to-rose-500',
                    'from-amber-500 to-orange-600'
                  ];
                  const glowColors = ['teal-400', 'pink-300', 'amber-400'];
                  const Icon = icons[i];

                  return (
                    <div key={i} className="group relative">
                      {/* Glow effect no hover */}
                      <div className={`absolute -inset-1 bg-linear-to-r ${gradients[i]} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                      
                      <div className="relative bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 border-slate-200 group-hover:border-slate-300 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl h-full flex flex-col">
                        {/* Ícone com gradiente e animação */}
                        <div className="flex justify-center mb-6">
                          <div className="relative inline-block">
                            <div className={`absolute inset-0 bg-${glowColors[i]} rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                            <div className={`relative bg-linear-to-br ${gradients[i]} rounded-2xl shadow-xl transform group-hover:rotate-6 transition-transform duration-300 w-16.25 h-16.25 flex items-center justify-center`}>
                              <Icon className="w-12 h-12 text-white shrink-0" strokeWidth={2} />
                            </div>
                          </div>
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 flex flex-col">
                          <EditableField
                            value={item.title}
                            jsonKey={`tratamentos.triplaProtecao.items[${i}].title`}
                            type="h4"
                            className="text-xl md:text-2xl font-bold mb-4 text-slate-800 text-center group-hover:text-slate-900 transition-colors"
                          />
                          <EditableField
                            value={item.description}
                            jsonKey={`tratamentos.triplaProtecao.items[${i}].description`}
                            type="p"
                            className="text-slate-600 leading-relaxed text-center text-sm md:text-base group-hover:text-slate-700 transition-colors"
                          />
                        </div>

                        {/* Barra decorativa inferior */}
                        <div className="mt-6 pt-4 border-t border-slate-100">
                          <div className={`w-full h-1 bg-linear-to-r ${gradients[i]} rounded-full opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rodapé com mensagem integrativa */}
              <div className="mt-10 text-center">
                <div className="inline-flex items-center gap-2 text-slate-600 text-sm font-medium bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-slate-200">
                  <span className="text-teal-500">●</span>
                  <span className="text-rose-500">●</span>
                  <span className="text-amber-500">●</span>
                  <EditableField
                    value={texts.triplaProtecao?.footerMessage}
                    jsonKey="tratamentos.triplaProtecao.footerMessage"
                    type="span"
                    className="inline"
                  />
                  <span className="text-teal-500">●</span>
                  <span className="text-rose-500">●</span>
                  <span className="text-amber-500">●</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA Section com fundo céu, terra e água */}
      <section className="relative overflow-hidden -mt-4">
        {/* Fundo com transição céu-água — Amanhecer */}
        <FooterBackground
          gradientId="skyGradientTratamentos"
          skyColors={['#1e3a5f', '#2563eb', '#38bdf8']}
          earthColor="#4a3f2e"
          waterColors={['#14b8a6', '#0d9488', '#0f766e']}
          leftIcon={<Activity className="text-[#CFAF5A] stroke-[1.5]" />}
          leftIconSize={48}
          rightIcon={<Waves className="text-[#CFAF5A] stroke-[1.5]" />}
          rightIconSize={48}
        />

        {/* CTA Content - posicionado no céu */}
        <div className="container mx-auto px-4 relative z-50 pt-6 pb-4">
          <div className="max-w-4xl mx-auto text-center">
            <EditableField
              value={texts.cta?.title}
              jsonKey="tratamentos.cta.title"
              type="h2"
              className="text-3xl md:text-4xl font-bold mb-4 text-white text-shadow-strong"
            />
            <EditableField
              value={texts.cta?.subtitle}
              jsonKey="tratamentos.cta.subtitle"
              type="p"
              className="text-lg mb-5 text-white text-shadow-medium"
            />
            <Link to="/contato">
              <Button className="bg-[#CFAF5A] text-white font-semibold px-6 py-4 text-base rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105">
                <EditableField
                  value={texts.cta?.buttonText}
                  jsonKey="tratamentos.cta.buttonText"
                  type="span"
                  className="inline"
                />
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Content - Copyright (do DB: compartilhado) */}
        <SharedFooter />
      </section>
    </div>
  );
}
