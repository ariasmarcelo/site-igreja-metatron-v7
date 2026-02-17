import { createContext, useContext, useCallback, useRef, useState, ReactNode } from 'react';

/**
 * Context para gerenciar edições pendentes (não salvas no DB ainda).
 * 
 * Quando o usuário clica "Aplicar" no editor visual, a edição é armazenada aqui.
 * `usePageContent` mescla automaticamente estas edições nos dados retornados.
 * 
 * Isso permite que React renderize corretamente em qualquer idioma sem
 * manipulação direta do DOM ou timers arbitrários.
 */

interface PendingEdit {
  'pt-BR': string;
  'en-US': string;
}

interface PendingEditsContextType {
  /** Registrar uma edição pendente para um campo */
  setPendingEdit: (pageId: string, cleanKey: string, ptValue: string, enValue: string) => void;
  /** Limpar edições pendentes (de uma página ou todas) */
  clearPendingEdits: (pageId?: string) => void;
  /** Obter edições pendentes de uma página */
  getPendingEditsForPage: (pageId: string) => Map<string, PendingEdit>;
  /** Versão incremental — muda a cada edição, usado como dep de useMemo */
  version: number;
}

const PendingEditsContext = createContext<PendingEditsContextType | undefined>(undefined);

export function PendingEditsProvider({ children }: { children: ReactNode }) {
  // Ref para dados (evita re-renders desnecessários) + state para versão (trigger de re-render)
  const editsRef = useRef<Map<string, Map<string, PendingEdit>>>(new Map());
  const [version, setVersion] = useState(0);

  const setPendingEdit = useCallback((pageId: string, cleanKey: string, ptValue: string, enValue: string) => {
    const normalized = pageId.toLowerCase();
    if (!editsRef.current.has(normalized)) {
      editsRef.current.set(normalized, new Map());
    }
    editsRef.current.get(normalized)!.set(cleanKey, { 'pt-BR': ptValue, 'en-US': enValue });
    setVersion(v => v + 1);
  }, []);

  const clearPendingEdits = useCallback((pageId?: string) => {
    if (pageId) {
      editsRef.current.delete(pageId.toLowerCase());
    } else {
      editsRef.current.clear();
    }
    setVersion(v => v + 1);
  }, []);

  const getPendingEditsForPage = useCallback((pageId: string): Map<string, PendingEdit> => {
    return editsRef.current.get(pageId.toLowerCase()) || new Map();
  }, []);

  return (
    <PendingEditsContext.Provider value={{ setPendingEdit, clearPendingEdits, getPendingEditsForPage, version }}>
      {children}
    </PendingEditsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePendingEdits() {
  const context = useContext(PendingEditsContext);
  if (!context) {
    throw new Error('usePendingEdits deve ser usado dentro de PendingEditsProvider');
  }
  return context;
}
