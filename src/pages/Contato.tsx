import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Clock, MessageCircle, ShieldCheck, Phone, ChevronDown } from 'lucide-react';
import EditableField from '@/components/ui/EditableField';
import { usePageContent } from '@/hooks/useContent';
import { usePageStyles } from '@/hooks/usePageStyles';
import { PageLoading } from '@/components/PageLoading';

interface ContatoTexts {
  header: { title: string; subtitle: string };
  whatsapp: { title: string; description: string; button: string };
  [key: string]: any;
}

export default function Contato() {
  usePageStyles('contato');
  const { data: texts, loading } = usePageContent<ContatoTexts>('contato');
  const [openFaqItems, setOpenFaqItems] = useState<Set<number>>(new Set());
  const [showWhatsAppMsg, setShowWhatsAppMsg] = useState(false);
  const [showEmailMsg, setShowEmailMsg] = useState(false);
  
  const handleWhatsAppClick = () => {
    const phoneNumber = '5511949555555';
    const msg = texts?.contactCard?.whatsappMessage || 'Olá! Quero saber mais sobre *O Trabalho de Resgate*!';
    const message = encodeURIComponent(msg);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const toggleFaqItem = (idx: number) => {
    setOpenFaqItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

    if (loading || !texts) {
    return (
      <PageLoading
        icon={Mail}
        text="Carregando contato..."
        bgColor="bg-gradient-to-b from-teal-50 to-cyan-50"
        iconColor="text-teal-600"
        textColor="text-teal-900"
      />
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-teal-50 via-emerald-50 to-cyan-50">
      
      {/* Hero Section */}
      <section className="relative py-10 overflow-hidden bg-linear-to-r from-teal-600 via-emerald-600 to-teal-600">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-300 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 mb-6">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <EditableField
              value={texts.header.title}
              jsonKey="contato.header.title"
              type="h1"
              className="text-5xl font-bold mb-4 text-white drop-shadow-lg"
            />
            <EditableField
              value={texts.header.subtitle}
              jsonKey="contato.header.subtitle"
              type="p"
              className="text-xl text-white/90 drop-shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-4">
            
            {/* FAÇA CONTATO - DESTAQUE */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-linear-to-r from-green-300/20 via-green-400/30 to-green-300/20 rounded-3xl blur-2xl"></div>
              
              <div className="relative bg-linear-to-br from-white via-green-50/50 to-emerald-50/30 rounded-3xl p-6 md:p-8 border-2 border-green-300/60 shadow-2xl">
                <div className="text-center mb-6">
                  <EditableField
                    value={texts.contactCard.title}
                    jsonKey="contato.contactCard.title"
                    type="h2"
                    className="text-4xl md:text-5xl font-bold mb-3 bg-linear-to-r from-green-700 via-emerald-600 to-green-700 bg-clip-text text-transparent"
                  />
                  <EditableField
                    value={texts.contactCard?.description}
                    jsonKey="contato.contactCard.description"
                    type="p"
                    className="text-lg text-gray-700 max-w-2xl mx-auto"
                  />
                </div>

                <div className="max-w-4xl mx-auto space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 items-stretch">
                  {/* WhatsApp */}
                  <div className="flex flex-col bg-white/80 rounded-2xl p-6 border border-green-200/60 shadow-lg">
                    <div className="relative flex items-center justify-center mx-auto mb-4">
                      <div
                        className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center cursor-pointer hover:bg-[#25D366]/20 transition-colors duration-300"
                        onMouseEnter={() => setShowWhatsAppMsg(true)}
                        onMouseLeave={() => setShowWhatsAppMsg(false)}
                      >
                        <MessageCircle className="w-6 h-6 text-[#25D366]" />
                      </div>
                      {/* Tooltip: mensagem que será enviada ao WhatsApp */}
                      <div
                        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[80vw] transition-all duration-300 ease-out z-30 ${
                          showWhatsAppMsg ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        }`}
                        onMouseEnter={() => setShowWhatsAppMsg(true)}
                        onMouseLeave={() => setShowWhatsAppMsg(false)}
                      >
                        <div className="relative bg-green-50 border border-green-300 rounded-xl shadow-xl p-4 text-left">
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-green-400 via-emerald-500 to-green-400 rounded-t-xl"></div>
                          <div className="flex items-start gap-3">
                            <div className="shrink-0 mt-0.5">
                              <MessageCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-green-800 mb-1">Mensagem pré-preenchida:</p>
                              <EditableField
                                value={texts.contactCard.whatsappMessage}
                                jsonKey="contato.contactCard.whatsappMessage"
                                type="p"
                                className="text-sm text-green-900 italic leading-snug"
                              />
                            </div>
                          </div>
                          {/* Seta apontando para baixo */}
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-green-50 border-r border-b border-green-300 rotate-45"></div>
                        </div>
                      </div>
                    </div>
                    <EditableField
                      value={texts.contactCard.whatsapp.label}
                      jsonKey="contato.contactCard.whatsapp.label"
                      type="p"
                      className="text-sm text-gray-600 text-center"
                    />
                    <EditableField
                      value={texts.contactCard.whatsapp.number}
                      jsonKey="contato.contactCard.whatsapp.number"
                      type="p"
                      className="text-base font-semibold text-gray-900 text-center mb-4"
                    />
                    <div className="mt-auto flex flex-col items-center">
                      <Button
                        onClick={handleWhatsAppClick}
                        className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 h-12 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <EditableField
                          value={texts.contactCard.whatsappButton.text}
                          jsonKey="contato.contactCard.whatsappButton.text"
                          type="span"
                          className="inline"
                        />
                      </Button>
                      <EditableField
                        value={texts.contactCard.whatsappButton.description}
                        jsonKey="contato.contactCard.whatsappButton.description"
                        type="p"
                        className="text-xs text-center text-gray-500 mt-2"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col bg-white/80 rounded-2xl p-6 border border-violet-200/60 shadow-lg">
                    <div className="relative flex items-center justify-center mx-auto mb-4">
                      <div
                        className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center cursor-pointer hover:bg-violet-200 transition-colors duration-300"
                        onMouseEnter={() => setShowEmailMsg(true)}
                        onMouseLeave={() => setShowEmailMsg(false)}
                      >
                        <Mail className="w-6 h-6 text-violet-600" />
                      </div>
                      {/* Tooltip: assunto e corpo do email */}
                      <div
                        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[80vw] transition-all duration-300 ease-out z-30 ${
                          showEmailMsg ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        }`}
                        onMouseEnter={() => setShowEmailMsg(true)}
                        onMouseLeave={() => setShowEmailMsg(false)}
                      >
                        <div className="relative bg-violet-50 border border-violet-300 rounded-xl shadow-xl p-4 text-left">
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-violet-400 via-purple-500 to-violet-400 rounded-t-xl"></div>
                          <div className="flex items-start gap-3">
                            <div className="shrink-0 mt-0.5">
                              <Mail className="w-5 h-5 text-violet-600" />
                            </div>
                            <div className="flex-1 space-y-1.5">
                              <div>
                                <p className="text-xs font-semibold text-violet-800 mb-0.5">Assunto:</p>
                                <EditableField
                                  value={texts.contactCard.emailSubject}
                                  jsonKey="contato.contactCard.emailSubject"
                                  type="p"
                                  className="text-sm text-violet-900 italic leading-snug"
                                />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-violet-800 mb-0.5">Mensagem:</p>
                                <EditableField
                                  value={texts.contactCard.emailBody}
                                  jsonKey="contato.contactCard.emailBody"
                                  type="p"
                                  className="text-sm text-violet-900 italic leading-snug"
                                />
                              </div>
                            </div>
                          </div>
                          {/* Seta apontando para baixo */}
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-violet-50 border-r border-b border-violet-300 rotate-45"></div>
                        </div>
                      </div>
                    </div>
                    <EditableField
                      value={texts.contactCard.email.label}
                      jsonKey="contato.contactCard.email.label"
                      type="p"
                      className="text-sm text-gray-600 text-center"
                    />
                    <EditableField
                      value={texts.contactCard.email.address}
                      jsonKey="contato.contactCard.email.address"
                      type="p"
                      className="text-base font-semibold text-gray-900 text-center mb-4"
                    />
                    <div className="mt-auto flex flex-col items-center">
                      <a
                        href={`mailto:${texts.contactCard.email.address}?subject=${encodeURIComponent(texts.contactCard.emailSubject || '')}&body=${encodeURIComponent(texts.contactCard.emailBody || '')}`}
                        title="Enviar Email"
                        className="inline-flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white px-8 h-12 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
                      >
                        <Mail className="w-5 h-5 inline mr-2" />
                        <EditableField
                          value={texts.contactCard.emailButton?.text}
                          jsonKey="contato.contactCard.emailButton.text"
                          type="span"
                          className="inline"
                        />
                      </a>
                      <EditableField
                        value={texts.contactCard.emailButton?.description}
                        jsonKey="contato.contactCard.emailButton.description"
                        type="p"
                        className="text-xs text-center text-gray-500 mt-2"
                      />
                    </div>
                  </div>
                  </div>

                  {/* Horários */}
                  <div className="flex items-center justify-center gap-3 bg-white/80 rounded-xl px-4 py-1.5 border border-slate-200/60 shadow-sm">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                    <EditableField
                      value={texts.businessHours.title}
                      jsonKey="contato.businessHours.title"
                      type="span"
                      className="text-sm font-medium text-gray-600"
                    />
                    <EditableField
                      value={texts.businessHours.hours.weekdays}
                      jsonKey="contato.businessHours.hours.weekdays"
                      type="span"
                      className="text-sm font-medium text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sobre a Avaliação Inicial */}
            <div className="bg-linear-to-br from-white via-amber-50/30 to-yellow-50/20 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-amber-200/60 shadow-xl">
              <div className="flex items-center justify-center gap-4">
                <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-linear-to-br from-amber-400/30 to-yellow-400/30 border border-amber-300/50">
                  <Clock className="w-7 h-7 text-amber-700" />
                </div>
              <EditableField
                value={texts.initialAssessment.title}
                jsonKey="contato.initialAssessment.title"
                type="h2"
                className="text-2xl md:text-3xl font-bold text-amber-900"
              />
              </div>
                
              <div className="grid md:grid-cols-2 gap-6">
                {/* O Que Esperar */}
                <div className="bg-white/60 rounded-2xl p-5 border border-amber-200/40">
                  <EditableField
                    value={texts.initialAssessment.whatToExpect.title}
                    jsonKey="contato.initialAssessment.whatToExpect.title"
                    type="h4"
                    className="text-lg font-semibold text-amber-800 mb-3 inline-flex items-center gap-3"
                  />
                  <ul className="space-y-3">
                    {texts.initialAssessment.whatToExpect.items.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <span className="text-amber-600 mt-1 font-bold">✦</span>
                      <EditableField
                        value={item}
                        jsonKey={`contato.initialAssessment.whatToExpect.items[${idx}]`}
                        type="span"
                        className="text-gray-700"
                      />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nosso Compromisso */}
                <div className="bg-white/60 rounded-2xl p-5 border border-amber-200/40">
                  <EditableField
                    value={texts.initialAssessment.commitment.title}
                    jsonKey="contato.initialAssessment.commitment.title"
                    type="h4"
                    className="text-lg font-semibold text-amber-800 mb-3 inline-flex items-center gap-3"
                  />
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-7 h-7 text-amber-600 shrink-0 mt-1" />
                    <EditableField
                      value={texts.initialAssessment.commitment.description}
                      jsonKey="contato.initialAssessment.commitment.description"
                      type="p"
                      className="text-gray-700 leading-relaxed text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Perguntas Frequentes */}
            <div className="bg-linear-to-br from-white via-slate-50/30 to-gray-50/20 rounded-3xl p-8 md:p-12 border border-slate-200/60 shadow-xl">
              <EditableField
                value={texts.faq.title}
                jsonKey="contato.faq.title"
                type="h2"
                className="text-3xl md:text-4xl font-bold text-center mb-10 text-slate-900"
              />
              <div className="space-y-4 max-w-3xl mx-auto">
                {texts.faq.items.map((qa: { question: string; answer: string }, idx: number) => {
                  const isOpen = openFaqItems.has(idx);
                  return (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-200/40 shadow-md hover:shadow-lg transition-all overflow-hidden">
                      <button
                        onClick={() => toggleFaqItem(idx)}
                        title={isOpen ? 'Fechar pergunta' : 'Abrir pergunta'}
                        className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 bg-linear-to-r from-slate-50 to-slate-100/50 hover:from-slate-100 hover:to-slate-50 transition-all"
                      >
                        <EditableField
                          value={qa.question}
                          jsonKey={`contato.faq.items[${idx}].question`}
                          type="h4"
                          className="text-lg font-bold text-slate-900 drop-shadow-sm"
                        />
                        <ChevronDown className={`w-5 h-5 text-slate-700 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 pt-3 bg-white border-t border-slate-100">
                          <EditableField
                            value={qa.answer}
                            jsonKey={`contato.faq.items[${idx}].answer`}
                            type="p"
                            className="text-gray-600 leading-relaxed"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
