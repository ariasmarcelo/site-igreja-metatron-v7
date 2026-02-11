import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Navigation from './Navigation.tsx';
import { LanguageProvider } from './contexts/LanguageContext';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <Navigation />
    </LanguageProvider>
  </StrictMode>
);
