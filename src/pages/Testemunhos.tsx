import { usePageContent } from '@/hooks/useContent';
import { SharedFooter } from '@/components/SharedFooter';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Star, Sun } from 'lucide-react';
import { PageLoading, PageError } from '@/components/PageLoading';

// Adicionar keyframe para batimento cardíaco
const heartbeatStyle = `
  @keyframes heartbeat {
    0%, 100% { transform: scale(0.95); }
    50% { transform: scale(1.25); }
  }
`;

interface Testimonial {
  name: string;
  date: string;
  content: string;
}

interface TestemunhosTexts {
  header?: { title: string; subtitle: string };
  intro?: { description: string };
  testimonials?: Testimonial[];
  disclaimer?: { title: string; content: string };
  cta?: { title: string; subtitle: string; buttonText: string };
  footer?: { copyright: string; trademark: string };
}

const Testemunhos = () => {
  const { data: texts, loading, error } = usePageContent<TestemunhosTexts>('testemunhos');

  if (loading) {
    return (
      <PageLoading
        icon={Heart}
        text="Carregando testemunhos..."
        bgColor="bg-gradient-to-b from-rose-50 to-pink-100"
        iconColor="text-rose-600"
        textColor="text-rose-900"
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
  
  if (!texts) return null;

  const testimonials = texts.testimonials || [];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: heartbeatStyle }} />
      <div className="min-h-screen bg-linear-to-b from-rose-50 via-sky-100 to-sky-300">
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-pink-400">
        {/* Animated Metallic Gold Background Effects */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-[10%] w-96 h-96 bg-yellow-300/60 rounded-full blur-3xl animate-pulse orb-1" />
          <div className="absolute top-40 right-[15%] w-[500px] h-[500px] bg-amber-400/50 rounded-full blur-3xl animate-pulse orb-2" />
          <div className="absolute bottom-20 left-[20%] w-[400px] h-[400px] bg-yellow-400/55 rounded-full blur-3xl animate-pulse orb-3" />
          <div className="absolute top-60 right-[30%] w-80 h-80 bg-amber-300/45 rounded-full blur-3xl animate-pulse orb-4" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            
            {/* Main Heart Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-white/40 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-white/20 overflow-visible">
                <Heart className="h-18 w-18 text-yellow-400/60 fill-red-500 stroke-[2.5] animate-[heartbeat_3s_ease-in-out_infinite]" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
              {texts.header?.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-white/95 opacity-90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
              {texts.header?.subtitle}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 space-y-3 max-w-6xl">
        
        {/* Intro Card */}
        <div className="max-w-3xl mx-auto bg-linear-to-br from-white/80 via-rose-50/80 to-pink-50/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-rose-200/60 shadow-xl shadow-rose-200/30">
          <p className="text-lg text-rose-950/85 leading-relaxed">
            {texts.intro?.description}
          </p>
        </div>
      </div>

      {/* Testimonials Grid - 2 COLUMNS */}
      <section className="pb-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {testimonials.map((testimonial: Testimonial, index: number) => (
                <div
                  key={index}
                  className="group relative"
                >
                  {/* Card */}
                  <div className="h-full bg-linear-to-br from-white/90 via-rose-50/80 to-pink-50/70 backdrop-blur-md rounded-2xl p-8 border border-rose-200/50 hover:border-rose-300/70 shadow-xl hover:shadow-2xl hover:shadow-rose-300/40 transition-all duration-500">
                    
                    {/* Star Icon */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-rose-400/30 to-pink-400/30 border border-rose-300/50 flex items-center justify-center group-hover:from-rose-400/40 group-hover:to-pink-400/40 transition-all">
                        <Star className="w-5 h-5 text-rose-600 fill-amber-400/70" />
                      </div>
                      
                      {/* Name & Date */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <h3 className="text-xl font-semibold text-rose-900">
                            {testimonial.name}
                          </h3>
                          <span className="text-sm text-rose-700/70">{testimonial.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-rose-950/80 leading-relaxed">
                      {testimonial.content}
                    </p>

                    {/* Hover glow */}
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-rose-300/0 via-pink-200/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-linear-to-br from-white/80 via-rose-50/70 to-pink-50/60 backdrop-blur-md rounded-2xl p-8 border border-rose-200/60 shadow-lg shadow-rose-200/20">
              <div className="flex items-start gap-4">
                <Heart className="w-6 h-6 text-rose-500 shrink-0 mt-1 fill-rose-400/50" />
                <div>
                  <h3 className="text-xl font-semibold text-rose-900 mb-3">
                    {texts.disclaimer?.title}
                  </h3>
                  <p className="text-rose-950/80 leading-relaxed">
                    {texts.disclaimer?.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section - Céu-Terra-Água */}
      <section className="relative overflow-hidden mt-16">
        {/* Fundo com transição céu-terra-água */}
        <div className="absolute inset-0 z-0">
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 400"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradiente do céu - AZUL claro vibrante */}
              <linearGradient id="skyGradientTestemunhos" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9"/>
                <stop offset="50%" stopColor="#38bdf8"/>
                <stop offset="100%" stopColor="#7dd3fc"/>
              </linearGradient>
              
              {/* Gradiente da terra - marrom escuro */}
              <linearGradient id="earthGradientTestemunhos" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#78716c"/>
                <stop offset="100%" stopColor="#44403c"/>
              </linearGradient>
              
              {/* Efeitos metálicos difusos */}
              <radialGradient id="glow1Testemunhos">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#fef3c7" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="glow2Testemunhos">
                <stop offset="0%" stopColor="#fde68a" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="glow3Testemunhos">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#fef3c7" stopOpacity="0"/>
              </radialGradient>
            </defs>
            
            {/* CÉU ROSA - com curvatura positiva na parte inferior */}
            <path 
              d="M0,0 L1200,0 L1200,260 Q600,180 0,260 Z" 
              fill="url(#skyGradientTestemunhos)"
            />
            
            {/* Círculos de luz metálica difusa espalhados */}
            <circle cx="150" cy="30" r="80" fill="url(#glow1Testemunhos)" opacity="0.4"/>
            <circle cx="280" cy="50" r="60" fill="url(#glow3Testemunhos)" opacity="0.35"/>
            <circle cx="420" cy="25" r="90" fill="url(#glow2Testemunhos)" opacity="0.45"/>
            <circle cx="550" cy="45" r="70" fill="url(#glow1Testemunhos)" opacity="0.4"/>
            <circle cx="680" cy="35" r="85" fill="url(#glow3Testemunhos)" opacity="0.38"/>
            <circle cx="820" cy="55" r="65" fill="url(#glow2Testemunhos)" opacity="0.42"/>
            <circle cx="950" cy="40" r="75" fill="url(#glow1Testemunhos)" opacity="0.37"/>
            <circle cx="1080" cy="30" r="70" fill="url(#glow3Testemunhos)" opacity="0.4"/>
            
            {/* Segunda camada de brilhos menores */}
            <circle cx="200" cy="70" r="50" fill="url(#glow2Testemunhos)" opacity="0.3"/>
            <circle cx="360" cy="80" r="45" fill="url(#glow1Testemunhos)" opacity="0.28"/>
            <circle cx="500" cy="90" r="55" fill="url(#glow3Testemunhos)" opacity="0.32"/>
            <circle cx="640" cy="75" r="48" fill="url(#glow2Testemunhos)" opacity="0.3"/>
            <circle cx="780" cy="85" r="52" fill="url(#glow1Testemunhos)" opacity="0.29"/>
            <circle cx="920" cy="95" r="47" fill="url(#glow3Testemunhos)" opacity="0.31"/>
            <circle cx="1060" cy="80" r="50" fill="url(#glow2Testemunhos)" opacity="0.28"/>
            
            {/* Terceira camada - brilhos muito sutis */}
            <circle cx="100" cy="60" r="35" fill="url(#glow3Testemunhos)" opacity="0.25"/>
            <circle cx="320" cy="110" r="40" fill="url(#glow1Testemunhos)" opacity="0.22"/>
            <circle cx="480" cy="65" r="38" fill="url(#glow2Testemunhos)" opacity="0.24"/>
            <circle cx="720" cy="105" r="42" fill="url(#glow3Testemunhos)" opacity="0.23"/>
            <circle cx="880" cy="70" r="36" fill="url(#glow1Testemunhos)" opacity="0.25"/>
            <circle cx="1020" cy="100" r="39" fill="url(#glow2Testemunhos)" opacity="0.22"/>
            
            {/* TERRA - com curvatura positiva na parte superior */}
            <path 
              d="M0,290 Q600,210 1200,290 L1200,400 L0,400 Z" 
              fill="url(#earthGradientTestemunhos)"
            />
            
            {/* LINHA DO HORIZONTE - curvatura mais pronunciada */}
            <path 
              d="M0,290 Q600,210 1200,290" 
              stroke="#d6d3d1" 
              strokeWidth="2" 
              fill="none" 
              opacity="0.6"
            />
            
            {/* ÁGUA - camadas animadas azul-petróleo com curvatura acentuada */}
            <path 
              className="animate-[wave_3s_ease-in-out_infinite]" 
              d="M0,340 Q600,280 1200,340 L1200,400 L0,400 Z" 
              fill="#2dd4bf" 
              opacity="0.4"
            />
            <path 
              className="animate-[wave_3s_ease-in-out_infinite_0.5s]" 
              d="M0,360 Q600,300 1200,360 L1200,400 L0,400 Z" 
              fill="#14b8a6" 
              opacity="0.35"
            />
            <path 
              className="animate-[wave_3s_ease-in-out_infinite_1s]" 
              d="M0,380 Q600,320 1200,380 L1200,400 L0,400 Z" 
              fill="#0d9488" 
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Sol Dourado - posicionado absolutamente no canto superior esquerdo */}
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

        {/* Heart Icon - posicionado no canto superior direito */}
        <div className="absolute top-4 right-8 z-20">
          <Heart className="w-14 h-14 text-[#CFAF5A] fill-rose-300/80 stroke-[2.5] drop-shadow-lg" />
        </div>

        {/* CTA Content - posicionado no céu */}
        <div className="container mx-auto px-4 relative z-10 pt-6 pb-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg" data-json-key="testemunhos.cta.title">
              {texts.cta?.title}
            </h2>
            <p className="text-lg mb-5 text-white drop-shadow-md" data-json-key="testemunhos.cta.subtitle">
              {texts.cta?.subtitle}
            </p>
            <Link to="/contato">
              <Button className="bg-[#CFAF5A] text-white font-semibold px-6 py-4 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" data-json-key="testemunhos.cta.buttonText">
                {texts.cta?.buttonText}
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
    </>
  );
};

export default Testemunhos;
