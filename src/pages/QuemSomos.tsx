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
      <section className="bg-linear-to-r from-violet-600 via-purple-600 to-violet-600 text-white py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.1)_50%,transparent_60%)]"></div>
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
           PRINCÍPIOS UNIFICADOS — Violeta sacerdotal + Cuboctaedro com raios
           13 princípios em lista de coluna única
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 px-4 md:px-8 overflow-hidden bg-linear-to-br from-violet-200 via-purple-100 to-violet-200 border-y border-violet-300">
        {/* Brilho radial em 12 direções — raios dourados */}
        <div className="absolute inset-0 cuboctahedron-radial-glow-principios pointer-events-none z-20" />

        {/* Cuboctaedro centralizado no topo com glow dourado */}
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30">
          <div className="absolute inset-0 scale-[2.5] bg-[radial-gradient(circle,rgba(255,215,0,0.35)_0%,rgba(255,215,0,0.12)_30%,transparent_60%)] pointer-events-none" />
          <Cuboctahedron size={180} className="text-violet-600 drop-shadow-[0_0_12px_rgba(255,215,0,0.5)]" strokeWidth={5} />
        </div>

        {/* Conteúdo principal */}
        <div className="max-w-3xl mx-auto pt-56 relative z-30">
          {/* Caixa translúcida */}
          <div className="bg-white/50 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-violet-300/50 p-8 md:p-12">

            {/* Título */}
            <div className="text-center mb-10">
              <EditableField
                value={(texts as any)?.principios_unificados?.title}
                jsonKey="quemsomos.principios_unificados.title"
                type="h2"
                className="text-4xl font-bold text-gray-800 mb-3"
              />
              <div className="w-24 h-0.5 mx-auto bg-linear-to-r from-transparent via-violet-500 to-transparent" />
            </div>

            {/* Lista de princípios — coluna única */}
            <div className="space-y-4">
              {Array.from({ length: 13 }).map((_, idx) => {
                const item = (texts as any)?.principios_unificados?.items?.[idx] || { title: '', content: '' };
                return (
                  <div
                    key={idx}
                    className="group flex items-start gap-4 p-5 rounded-xl border border-violet-200/60 bg-white/40 hover:bg-white/70 hover:shadow-lg hover:border-violet-300 transition-all duration-300"
                  >
                    {/* Número */}
                    <span className="shrink-0 w-9 h-9 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold shadow-md">
                      {idx + 1}
                    </span>
                    {/* Textos */}
                    <div className="flex-1 min-w-0">
                      <EditableField
                        value={item.title}
                        jsonKey={`quemsomos.principios_unificados.items[${idx}].title`}
                        type="h3"
                        className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-violet-800 transition-colors duration-300"
                      />
                      <EditableField
                        value={item.content}
                        jsonKey={`quemsomos.principios_unificados.items[${idx}].content`}
                        type="p"
                        className="text-sm text-gray-600 leading-relaxed"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           FUNDAMENTOS HERMÉTICOS — mesmo estilo visual dos Princípios
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 px-4 md:px-8 overflow-hidden bg-linear-to-br from-amber-100 via-amber-50 to-amber-100 border-y border-amber-300">

        {/* Conteúdo principal */}
        <div className="max-w-3xl mx-auto relative z-10">
          {/* Caixa translúcida */}
          <div className="bg-white/50 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-amber-300/50 p-8 md:p-12">

            {/* Título com Pentagramas */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="relative w-14 h-14 rounded-full bg-linear-to-br from-gray-200 via-gray-50 to-gray-300 shadow-[0_6px_12px_rgba(0,0,0,0.25),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.15)] flex items-center justify-center border border-gray-400/30">
                <Pentagram size={56} className="text-blue-600 shield-blue-icon drop-shadow-md" strokeWidth={2.5} />
              </div>
              <EditableField
                value={texts.hermeticos?.title}
                jsonKey="quemsomos.hermeticos.title"
                type="h2"
                className="text-4xl font-bold text-gray-800 text-center"
              />
              <div className="relative w-14 h-14 rounded-full bg-linear-to-br from-purple-700 via-purple-900 to-indigo-950 shadow-[0_8px_16px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(147,51,234,0.3),inset_0_-2px_6px_rgba(0,0,0,0.5)] flex items-center justify-center border border-purple-950/60">
                <Pentagram size={56} className="text-red-600 shield-red-icon scale-y-[-1] drop-shadow-md" strokeWidth={2.5} />
              </div>
            </div>
            <div className="w-24 h-0.5 mx-auto bg-linear-to-r from-transparent via-amber-500 to-transparent mb-6" />

            {/* Subtítulo introdutório */}
            {texts.hermeticos?.subtitle && (
              <p className="text-base text-amber-900/80 leading-relaxed text-center italic mb-10 max-w-2xl mx-auto">
                <EditableField
                  value={texts.hermeticos?.subtitle}
                  jsonKey="quemsomos.hermeticos.subtitle"
                  type="span"
                  className="inline"
                />
              </p>
            )}

            {/* Lista dos 7 princípios — coluna única */}
            <div className="space-y-4">
              {Array.from({ length: 7 }).map((_, index) => {
                const item = (texts as any)?.hermeticos?.items?.[index] || { number: String(index + 1), title: '', quote: undefined, description: '' };
                return (
                  <div
                    key={index}
                    className="group p-5 rounded-xl border border-amber-200/60 bg-white/40 hover:bg-white/70 hover:shadow-lg hover:border-amber-300 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      {/* Número */}
                      <span className="shrink-0 w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-bold shadow-md">
                        {item.number}
                      </span>
                      {/* Textos */}
                      <div className="flex-1 min-w-0">
                        <EditableField
                          value={item.title}
                          jsonKey={`quemsomos.hermeticos.items[${index}].title`}
                          type="h3"
                          className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-amber-800 transition-colors duration-300"
                        />
                        {item.quote && (
                          <div className="pl-4 border-l-3 border-amber-400 italic text-amber-800/80 text-sm mb-3">
                            "<EditableField
                              value={item.quote}
                              jsonKey={`quemsomos.hermeticos.items[${index}].quote`}
                              type="span"
                              className="inline"
                            />"
                          </div>
                        )}
                        <EditableField
                          value={item.description}
                          jsonKey={`quemsomos.hermeticos.items[${index}].description`}
                          type="p"
                          className="text-sm text-gray-600 leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA Section com fundo céu, água, sol e lua */}
      <section className="relative overflow-hidden mt-16">
        {/* Fundo com transição céu-água */}
        <FooterBackground
          gradientId="skyGradientQuemSomos"
          skyColors={['#60a5fa', '#93c5fd', '#bae6fd']}
          earthColor="#7c6a42"
          waterColors={['#34d399', '#10b981', '#059669']}
        />

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
