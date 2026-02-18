import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EditableField from "@/components/ui/EditableField";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Pentagram, Cuboctahedron } from "@/components/icons";
import { usePageContent } from '@/hooks/useContent';
import { usePageStyles } from '@/hooks/usePageStyles';
import { SharedFooter } from '@/components/SharedFooter';
import { FooterBackground } from '@/components/FooterBackground';
import { PageLoading, PageError } from '@/components/PageLoading';
import '@/styles/layouts/pages/quemsomos.css';
import '@/styles/waves.css';

interface QuemSomosTexts {
  header: { title: string; subtitle: string };
  sections: {
    historico_title: string;
    principios_title: string;
    hermeticos_title: string;
  };
  mission: { title: string; text: string };
  footer?: { copyright: string; trademark: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Cores gradiente para cada princípio — 13 princípios unificados
const PRINCIPLE_GRADIENTS = [
  { from: 'from-violet-500/20', border: 'border-violet-400/40', glow: 'hover:shadow-violet-500/20' },
  { from: 'from-blue-500/20', border: 'border-blue-400/40', glow: 'hover:shadow-blue-500/20' },
  { from: 'from-emerald-500/20', border: 'border-emerald-400/40', glow: 'hover:shadow-emerald-500/20' },
  { from: 'from-rose-500/20', border: 'border-rose-400/40', glow: 'hover:shadow-rose-500/20' },
  { from: 'from-amber-500/20', border: 'border-amber-400/40', glow: 'hover:shadow-amber-500/20' },
  { from: 'from-cyan-500/20', border: 'border-cyan-400/40', glow: 'hover:shadow-cyan-500/20' },
  { from: 'from-indigo-500/20', border: 'border-indigo-400/40', glow: 'hover:shadow-indigo-500/20' },
  { from: 'from-teal-500/20', border: 'border-teal-400/40', glow: 'hover:shadow-teal-500/20' },
  { from: 'from-pink-500/20', border: 'border-pink-400/40', glow: 'hover:shadow-pink-500/20' },
  { from: 'from-sky-500/20', border: 'border-sky-400/40', glow: 'hover:shadow-sky-500/20' },
  { from: 'from-purple-500/20', border: 'border-purple-400/40', glow: 'hover:shadow-purple-500/20' },
  { from: 'from-fuchsia-500/20', border: 'border-fuchsia-400/40', glow: 'hover:shadow-fuchsia-500/20' },
  { from: 'from-orange-500/20', border: 'border-orange-400/40', glow: 'hover:shadow-orange-500/20' },
];

export default function QuemSomos() {
  usePageStyles('quemsomos');
  const { data: texts, loading, error } = usePageContent<QuemSomosTexts>('quemsomos');

  if (loading) {
    return (
      <PageLoading
        icon={BookOpen}
        text="Carregando sobre nós..."
        bgColor="bg-gradient-to-b from-violet-50 to-purple-50"
        iconColor="text-violet-600"
        textColor="text-violet-900"
      />
    );
  }
  
  if (error) {
    return (
      <PageError
        message={error}
        bgColor="bg-gradient-to-b from-red-50 to-rose-50"
        textColor="text-red-700"
      />
    );
  }
  
  if (!texts) return <div className="flex items-center justify-center min-h-screen">Sem dados</div>;
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header Moderno */}
      <section className="bg-linear-to-r from-violet-600 via-purple-600 to-violet-600 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.1)_50%,transparent_60%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <BookOpen className="h-10 w-10" />
              </div>
            </div>
            <EditableField 
              value={texts.header?.title}
              jsonKey="quemsomos.header.title"
              type="h1"
              className="text-5xl font-bold mb-4 drop-shadow-lg"
            />
            <EditableField 
              value={texts.header?.subtitle}
              jsonKey="quemsomos.header.subtitle"
              type="p"
              className="text-xl opacity-90 drop-shadow-md"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           PRINCÍPIOS UNIFICADOS — Design "Tábuas de Cristal"
           13 princípios em grid responsivo sobre fundo estrelado
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 px-4 md:px-8 overflow-hidden principles-starfield">
        {/* Fundo estrelado */}
        <div className="absolute inset-0 bg-linear-to-b from-[#0f0a2e] via-[#1a1145] to-[#0f0a2e]" />
        <div className="absolute inset-0 principles-stars opacity-60" />
        
        {/* Cuboctahedron central com glow */}
        <div className="relative z-10 flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 scale-150 bg-[radial-gradient(circle,rgba(139,92,246,0.3)_0%,transparent_70%)]" />
            <Cuboctahedron size={140} className="text-violet-300/80 drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]" strokeWidth={4} />
          </div>
        </div>

        {/* Título da seção */}
        <div className="relative z-10 text-center mb-16">
          <EditableField
            value={(texts as any)?.principios_unificados?.title}
            jsonKey="quemsomos.principios_unificados.title"
            type="h2"
            className="text-4xl md:text-5xl font-bold text-white/95 mb-3 drop-shadow-[0_2px_8px_rgba(139,92,246,0.4)]"
          />
          <div className="w-32 h-0.5 mx-auto bg-linear-to-r from-transparent via-violet-400 to-transparent" />
        </div>

        {/* Grid de Princípios — cards de cristal */}
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 13 }).map((_, idx) => {
            const item = (texts as any)?.principios_unificados?.items?.[idx] || { title: '', content: '' };
            const gradient = PRINCIPLE_GRADIENTS[idx % PRINCIPLE_GRADIENTS.length];
            return (
              <div
                key={idx}
                className={`group relative rounded-2xl border ${gradient.border} bg-white/[0.06] backdrop-blur-md p-6 transition-all duration-500 hover:bg-white/[0.12] hover:shadow-2xl ${gradient.glow} hover:-translate-y-1`}
              >
                {/* Glow interno sutil */}
                <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${gradient.from} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                
                {/* Número */}
                <div className="relative z-10 flex items-start gap-4">
                  <span className="shrink-0 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm font-semibold text-white/70 group-hover:text-white group-hover:bg-white/20 transition-all duration-300">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <EditableField
                      value={item.title}
                      jsonKey={`quemsomos.principios_unificados.items[${idx}].title`}
                      type="h3"
                      className="text-lg font-semibold text-white/90 mb-2 group-hover:text-white transition-colors duration-300"
                    />
                    <EditableField
                      value={item.content}
                      jsonKey={`quemsomos.principios_unificados.items[${idx}].content`}
                      type="p"
                      className="text-sm text-white/60 leading-relaxed group-hover:text-white/75 transition-colors duration-300"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-20 max-w-6xl relative">
        {texts.historico?.content && Array.isArray(texts.historico.content) && texts.historico.content.length > 0 && (
        <section className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          <EditableField 
            value={texts.historico?.title}
            jsonKey="quemsomos.historico.title"
            type="h2"
            className="text-4xl font-bold text-gray-800 mb-8 text-center"
          />
          <div className="space-y-6">
            {texts.historico.content.map((paragraph: string, index: number) => (
              <div key={index} className="bg-linear-to-r from-gray-50 to-white p-6 rounded-lg border-l-4 border-[#5EA98D] shadow-sm hover:shadow-md transition-shadow">
                <EditableField 
                  value={paragraph}
                  jsonKey={`quemsomos.historico.content[${index}]`}
                  type="p"
                  className="text-gray-700 leading-relaxed"
                />
              </div>
            ))}
          </div>
        </section>
        )}

        {/* Princípios Herméticos - Estilo Papiro */}
        <section className="relative papiro-box p-12 rounded-lg border-4 border-amber-900/20 shadow-2xl">
                
                {/* Textura de papiro */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none papiro-texture z-0"></div>
                
                {/* Bordas decorativas do papiro */}
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-amber-800/30 to-transparent z-5"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-amber-800/30 to-transparent z-5"></div>
                <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-transparent via-amber-800/30 to-transparent z-5"></div>
                <div className="absolute top-0 right-0 w-1 h-full bg-linear-to-b from-transparent via-amber-800/30 to-transparent z-5"></div>
                
                {/* Ornamentos nos cantos */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-800/40 rounded-tl-lg z-5"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-800/40 rounded-tr-lg z-5"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-800/40 rounded-bl-lg z-5"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-800/40 rounded-br-lg z-5"></div>
                
                {/* Raios de luz - acima de tudo */}
                <div className="papiro-rays-container" />
                
                {/* Cuboctahedron - acima dos raios */}
                <div className="papiro-cuboctahedron-container">
                  <Cuboctahedron size={200} className="text-indigo-600" strokeWidth={6} />
                </div>
                
            {/* Conteúdo interno */}
            <div className="relative z-10">
              {/* Espaço para o cuboctahedron */}
              <div className="h-50 mb-6"></div>                  <div className="flex items-center justify-center gap-4 mb-8 relative z-50">
                    <div className="relative w-16.5 h-16.5 rounded-full bg-linear-to-br from-gray-200 via-gray-50 to-gray-300 shadow-[0_8px_16px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.2)] flex items-center justify-center border border-gray-400/30">
                      <Pentagram size={66} className="text-blue-600 shield-blue-icon drop-shadow-md" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-4xl font-bold text-center text-amber-950 font-serif">
                      <EditableField 
                        value={texts.hermeticos?.title}
                        jsonKey="quemsomos.hermeticos.title"
                        type="span"
                        className="inline"
                      />
                    </h2>
                    <div className="relative w-16.5 h-16.5 rounded-full bg-linear-to-br from-purple-700 via-purple-900 to-indigo-950 shadow-[0_12px_24px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(147,51,234,0.3),inset_0_-2px_8px_rgba(0,0,0,0.6)] flex items-center justify-center border border-purple-950/60">
                      <Pentagram size={66} className="text-red-600 shield-red-icon scale-y-[-1] drop-shadow-md" strokeWidth={2.5} />
                    </div>
                  </div>
                  
                  {/* Parágrafo introdutório */}
                  {texts.hermeticos?.subtitle && (
                  <div className="mb-12 max-w-4xl mx-auto relative z-40">
                    <p className="text-lg text-amber-900 leading-relaxed text-center font-serif italic">
                      <EditableField 
                        value={texts.hermeticos?.subtitle}
                        jsonKey="quemsomos.hermeticos.subtitle"
                        type="span"
                        className="inline"
                      />
                    </p>
                  </div>
                  )}
                  
                  {/* Cards dos 7 princípios */}
                  <div className="space-y-6">
                    {Array.from({ length: 7 }).map((_, index) => {
                      const item = (texts as any)?.hermeticos?.items?.[index] || { number: String(index + 1), title: '', quote: undefined, description: '' };
                      return (
                      <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm border border-amber-200/40">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3 text-2xl text-amber-900">
                            <span className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                              {item.number}
                            </span>
                            <EditableField 
                              value={item.title}
                              jsonKey={`quemsomos.hermeticos.items[${index}].title`}
                              type="span"
                              className="inline"
                            />
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {item.quote && (
                            <div className="pl-4 border-l-4 border-amber-500 italic text-amber-800 text-base mb-4">
                              "{<EditableField 
                                value={item.quote}
                                jsonKey={`quemsomos.hermeticos.items[${index}].quote`}
                                type="span"
                                className="inline"
                              />}"
                            </div>
                          )}
                          <EditableField 
                            value={item.description}
                            jsonKey={`quemsomos.hermeticos.items[${index}].description`}
                            type="p"
                            className="text-gray-700 leading-relaxed"
                          />
                        </CardContent>
                      </Card>
                      );
                    })}
                  </div>
                </div>
        </section>
      </div>

      {/* Footer CTA Section com fundo céu, água, sol e lua */}
      <section className="relative overflow-hidden mt-16">
        {/* Fundo com transição céu-água */}
        <FooterBackground
          gradientId="skyGradientQuemSomos"
          skyColors={['#60a5fa', '#93c5fd', '#bae6fd']}
          earthColor="#7c6a42"
          waterColors={['#34d399', '#10b981', '#059669']}
        />

        {/* Sol Dourado - posicionado absolutamente, independente do fundo */}
        <div className="absolute top-4 left-8 w-20 h-20 z-10">
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

        {/* Lua Crescente - posicionada no canto superior direito */}
        <div className="absolute top-4 right-8 w-20 h-20 z-20">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <mask id="crescentMaskQuemSomos">
                <circle cx="50" cy="50" r="25" fill="white" />
                <circle cx="58" cy="50" r="22" fill="black" />
              </mask>
            </defs>
            <circle cx="50" cy="50" r="25" fill="#F3F4F6" mask="url(#crescentMaskQuemSomos)" />
          </svg>
        </div>

        {/* CTA Content - posicionado no céu */}
        <div className="container mx-auto px-4 relative z-50 pt-6 pb-4">
          <div className="max-w-4xl mx-auto text-center">
            <EditableField 
              value={texts.cta?.title}
              jsonKey="quemsomos.cta.title"
              type="h2"
              className="text-3xl md:text-4xl font-bold mb-4 text-white text-shadow-strong whitespace-pre-line"
            />
            <EditableField 
              value={texts.cta?.subtitle}
              jsonKey="quemsomos.cta.subtitle"
              type="p"
              className="text-lg mb-5 text-white text-shadow-medium whitespace-pre-line"
            />
            <Link to="/contato">
              <Button className="bg-[#CFAF5A] text-white font-semibold px-6 py-4 text-base rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105">
                <EditableField 
                  value={texts.cta.buttonText}
                  jsonKey="quemsomos.cta.buttonText"
                  type="span"
                  className="inline"
                />
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Content - Copyright (do DB: compartilhado) */}
        <SharedFooter 
          copyright={texts?.footer?.copyright}
          trademark={texts?.footer?.trademark}
        />
      </section>
    </div>
  );
}
