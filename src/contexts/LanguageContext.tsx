import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'pt-BR' | 'en-US';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isDarkLanguage: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Detectar idioma do navegador ou usar localStorage
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('preferred_language') as Language | null;
    if (stored && ['pt-BR', 'en-US'].includes(stored)) {
      return stored;
    }
    
    // Detectar do navegador
    const browserLang = navigator.language || 'pt-BR';
    return browserLang.startsWith('en') ? 'en-US' : 'pt-BR';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred_language', lang);
    // Atualizar html lang attribute para acessibilidade
    document.documentElement.lang = lang === 'pt-BR' ? 'pt' : 'en';
  };

  useEffect(() => {
    document.documentElement.lang = language === 'pt-BR' ? 'pt' : 'en';
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isDarkLanguage: false }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook para acessar contexto de idioma
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
