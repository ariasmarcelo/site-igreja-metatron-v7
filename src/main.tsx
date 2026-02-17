import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Navigation from './Navigation.tsx';
import { LanguageProvider } from './contexts/LanguageContext';
import { ContentCacheProvider } from './contexts/ContentCacheContext';
import { PendingEditsProvider } from './contexts/PendingEditsContext';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <ContentCacheProvider>
        <PendingEditsProvider>
          <Navigation />
        </PendingEditsProvider>
      </ContentCacheProvider>
    </LanguageProvider>
  </StrictMode>
);
