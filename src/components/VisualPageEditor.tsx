import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useContentCache } from '@/contexts/ContentCacheContext';
import { usePendingEdits } from '@/contexts/PendingEditsContext';

interface VisualPageEditorProps {
  pageId: string;
  pageName: string;
  pageComponent: React.ComponentType;
  selectedLanguage: 'pt-BR' | 'en-US';
}

interface EditField {
  id: string;           // ID único simples (edit-1, edit-2, etc.)
  jsonKey: string;      // Chave JSON original para API
  originalValue: string;
  currentValue: string;
  isModified: boolean;
  ptValue?: string;     // Para campos multilíngues: português
  enValue?: string;     // Para campos multilíngues: inglês
  languages?: string[]; // Idiomas suportados
}

interface HTMLElementWithHandlers extends HTMLElement {
  _hoverHandlers?: {
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
  };
}

interface WindowWithObserver extends Window {
  __editorObserver?: MutationObserver;
}

/**
 * Extrai o page_id real e a chave limpa a partir de um data-json-key.
 * 
 * Formato: "{pageId}.{rest}"  ex: "testemunhos.testimonials[0].content"
 *   → { sourcePageId: "testemunhos", cleanKey: "testimonials[0].content" }
 * ex: "__shared__.footer.copyright"
 *   → { sourcePageId: "__shared__", cleanKey: "footer.copyright" }
 */
function extractSourcePageId(jsonKey: string): { sourcePageId: string; cleanKey: string } {
  const dotIndex = jsonKey.indexOf('.');
  if (dotIndex === -1) return { sourcePageId: jsonKey, cleanKey: jsonKey };
  return {
    sourcePageId: jsonKey.substring(0, dotIndex),
    cleanKey: jsonKey.substring(dotIndex + 1),
  };
}

const VisualPageEditor = ({ pageId, pageComponent: PageComponent, selectedLanguage }: VisualPageEditorProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [fields, setFields] = useState<EditField[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    type: 'success' | 'confirm' | null;
    message: string;
    onConfirm?: () => void;
  }>({ open: false, type: null, message: '', onConfirm: undefined });
  
  // Integração com cache invalidation e edições pendentes
  const { invalidateCache } = useContentCache();
  const { setPendingEdit, clearPendingEdits } = usePendingEdits();
  const activeEditorRef = useRef<HTMLDivElement | null>(null);
  const isEditModeRef = useRef(false);
  const idCounterRef = useRef(0);
  
  // Mapeamento ID -> Elemento DOM
  const elementMapRef = useRef<Map<string, { element: HTMLElement; jsonKey: string }>>(new Map());

  // 🌐 Quando o idioma muda durante edição, React re-renderiza o PageComponent
  // automaticamente com dados corretos (incluindo edições pendentes via PendingEditsContext).
  // Só precisamos re-aplicar a seleção visual nos novos elementos DOM.
  useEffect(() => {
    if (!isEditModeRef.current) return;
    // Aguardar React terminar o re-render com double-rAF (sem timer hardcoded)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (isEditModeRef.current) {
          addVisualSelection();
        }
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage]);

  // 🎨 Adicionar seleção visual a um elemento específico
  const addSelectionToElement = (htmlEl: HTMLElement) => {
    const jsonKey = htmlEl.getAttribute('data-json-key');
    if (!jsonKey) return;
    
    // Se o elemento já tem ID (React preservou o nó DOM), re-registrar no map
    const existingId = htmlEl.getAttribute('data-edit-id');
    if (existingId) {
      elementMapRef.current.set(existingId, { element: htmlEl, jsonKey });
      return;
    }
    
    // Atribuir ID único simples
    const uniqueId = `edit-${++idCounterRef.current}`;
    htmlEl.setAttribute('data-edit-id', uniqueId);
    
    // Salvar no mapeamento
    elementMapRef.current.set(uniqueId, { element: htmlEl, jsonKey });
    
    // Estilo de seleção visual destacado
    htmlEl.style.cursor = 'pointer';
    htmlEl.style.outline = '3px dashed #CFAF5A';
    htmlEl.style.outlineOffset = '4px';
    htmlEl.style.transition = 'all 0.2s ease';
    htmlEl.style.position = 'relative';

    const handleMouseEnter = () => {
      htmlEl.style.outline = '3px solid #CFAF5A';
      htmlEl.style.backgroundColor = 'rgba(207, 175, 90, 0.15)';
      htmlEl.style.transform = 'scale(1.01)';
    };

    const handleMouseLeave = () => {
      htmlEl.style.outline = '3px dashed #CFAF5A';
      htmlEl.style.backgroundColor = '';
      htmlEl.style.transform = 'scale(1)';
    };

    htmlEl.addEventListener('mouseenter', handleMouseEnter);
    htmlEl.addEventListener('mouseleave', handleMouseLeave);
    
    (htmlEl as HTMLElementWithHandlers)._hoverHandlers = { handleMouseEnter, handleMouseLeave };
  };

  // 🎨 Adicionar seleção visual aos elementos
  const addVisualSelection = useCallback(() => {
    const editables = document.querySelectorAll('[data-json-key]');
    
    // Limpar mapeamento anterior
    elementMapRef.current.clear();
    idCounterRef.current = 0;
    
    // Desconectar observer anterior (evitar acumulação)
    const windowWithObserver = window as unknown as WindowWithObserver;
    if (windowWithObserver.__editorObserver) {
      windowWithObserver.__editorObserver.disconnect();
    }
    
    editables.forEach(el => addSelectionToElement(el as HTMLElement));

    console.log(`✨ Visual selection added to ${editables.length} elements`);
    
    // 👁️ OBSERVER: Detectar novos elementos adicionados ao DOM (accordions, tabs, etc)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            
            // Se o elemento adicionado tem data-json-key
            if (element.hasAttribute('data-json-key')) {
              console.log(`🆕 Novo elemento detectado: ${element.getAttribute('data-json-key')}`);
              addSelectionToElement(element);
            }
            
            // Se o elemento tem filhos com data-json-key
            const children = element.querySelectorAll('[data-json-key]');
            children.forEach(child => {
              console.log(`🆕 Novo elemento filho detectado: ${child.getAttribute('data-json-key')}`);
              addSelectionToElement(child as HTMLElement);
            });
          }
        });
      });
    });
    
    // Observar toda a página
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Salvar observer para limpar depois
    (window as unknown as WindowWithObserver).__editorObserver = observer;
    
    console.log('👁️ MutationObserver ativado - detectando novos elementos dinamicamente');
  }, []);

  // 🧹 Remover seleção visual
  const removeVisualSelection = () => {
    const editables = document.querySelectorAll('[data-edit-id]');
    
    editables.forEach(el => {
      const htmlEl = el as HTMLElement;
      
      const handlers = (htmlEl as HTMLElementWithHandlers)._hoverHandlers;
      if (handlers) {
        htmlEl.removeEventListener('mouseenter', handlers.handleMouseEnter);
        htmlEl.removeEventListener('mouseleave', handlers.handleMouseLeave);
        delete (htmlEl as HTMLElementWithHandlers)._hoverHandlers;
      }
      
      htmlEl.style.cursor = '';
      htmlEl.style.outline = '';
      htmlEl.style.outlineOffset = '';
      htmlEl.style.backgroundColor = '';
      htmlEl.style.transform = '';
      htmlEl.removeAttribute('data-edit-id');
    });
    
    // 🛑 Desconectar MutationObserver
    const windowWithObserver = window as unknown as WindowWithObserver;
    const observer = windowWithObserver.__editorObserver;
    if (observer) {
      observer.disconnect();
      delete windowWithObserver.__editorObserver;
      console.log('🛑 MutationObserver desconectado');
    }
    
    elementMapRef.current.clear();
    console.log('🧹 Visual selection removed');
  };

  const openEditor = useCallback((editId: string) => {
    const mapped = elementMapRef.current.get(editId);
    if (!mapped) {
      console.error('❌ Element not found for ID:', editId);
      return;
    }
    
    const { element, jsonKey } = mapped;
    // Fechar editor anterior se existir
    if (activeEditorRef.current) {
      activeEditorRef.current.remove();
      const existingOverlay = document.getElementById('editor-overlay');
      existingOverlay?.remove();
    }

    const currentText = element.textContent?.trim() || '';
    const hasText = currentText.length > 0;
    
    // 🔍 LOG DETALHADO para debugging
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 EDITOR OPENED (MULTILINGUAL)');
    console.log('Edit ID:', editId);
    console.log('JSON Key:', jsonKey);
    console.log('Element tag:', element.tagName);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Extrair o pageId real a partir da chave — pode diferir do pageId da aba.
    // Ex: na purificação, o carrossel de testemunhos tem chaves "testemunhos.…"
    const { sourcePageId, cleanKey } = extractSourcePageId(jsonKey);
    const fetchPageId = sourcePageId; // página real do conteúdo
    console.log(`📌 Source page: ${fetchPageId} (editor page: ${pageId}, jsonKey: ${jsonKey})`);

    // Buscar dados multilíngues do pageId REAL do conteúdo
    fetch(`/api/content/${fetchPageId}`).then(r => r.json()).then((response) => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📡 RESPOSTA DO GET - Dados de "${fetchPageId}" (1 GET para todas as linguas)`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const content = response?.content || {};
      const languageMetadata = response?.languageMetadata || {};
      
      console.log('Response structure:', { 
        success: response?.success, 
        contentKeys: Object.keys(content || {}),
        metadataKeys: Object.keys(languageMetadata || {})
      });
      console.log('Full response:', JSON.stringify(response, null, 2).substring(0, 500));
      
      const getParts = (obj: Record<string, unknown> | null | undefined, key: string): unknown => {
        let value: unknown = obj;
        const parts = key.split('.');
        for (const part of parts) {
          const arrayMatch = part.match(/^(.+?)\[(\d+)\]$/);
          if (arrayMatch) {
            const [, arrayName, index] = arrayMatch;
            const arrayValue = (value as Record<string, unknown>)?.[arrayName];
            if (Array.isArray(arrayValue)) {
              value = arrayValue[parseInt(index)];
            } else {
              value = undefined;
            }
          } else {
            value = (value as Record<string, unknown>)?.[part];
          }
          if (value === undefined) return null;
        }
        return value;
      };
      
      // Extrair o objeto completo (pode ser string ou { "pt-BR": ..., "en-US": ... })
      const fieldValue = getParts(content, cleanKey);
      let ptText = '';
      let enText = '';
      
      if (typeof fieldValue === 'object' && fieldValue !== null && ('pt-BR' in fieldValue || 'en-US' in fieldValue)) {
        // Estrutura multilíngue: { "pt-BR": "...", "en-US": "..." }
        ptText = fieldValue['pt-BR'] || '';
        enText = fieldValue['en-US'] || '';
      } else if (typeof fieldValue === 'string') {
        // Valor simples (não-multilíngue sharedpode ser __shared__)
        ptText = fieldValue;
        enText = fieldValue;
      } else {
        ptText = '';
        enText = '';
      }
      
      console.log(`✓ Valores extraídos para chave "${cleanKey}":`);
      console.log(`  PT-BR: "${ptText.substring(0, 80)}..." (length: ${ptText.length})`);
      console.log(`  EN-US: "${enText.substring(0, 80)}..." (length: ${enText.length})`);
      
      // Verificar status de integridade - agora ambos vêm na mesma resposta
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ptWarning = languageMetadata?.pt_BR?.integrityWarnings?.find((w: any) => w.key === jsonKey);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const enWarning = languageMetadata?.en_US?.integrityWarnings?.find((w: any) => w.key === jsonKey);
      
      console.log('🔍 Integridade:');
      console.log(`  PT-BR warning:`, ptWarning);
      console.log(`  EN-US warning:`, enWarning);
      
      // Sistema melhorado de detecção: fallbackUsed ou FALTANDO
      const ptMissing = ptWarning?.fallbackUsed === true || ptWarning?.issues?.some?.((i: string) => i.includes('FALTANDO')) || !ptText;
      const enMissing = enWarning?.fallbackUsed === true || enWarning?.issues?.some?.((i: string) => i.includes('FALTANDO')) || !enText;
      
      console.log('🚨 Detecção de Missing:');
      console.log(`  PT-BR missing: ${ptMissing} (fallbackUsed: ${ptWarning?.fallbackUsed}, FALTANDO: ${ptWarning?.issues?.some?.((i: string) => i.includes('FALTANDO'))}, vazio: ${!ptText})`);
      console.log(`  EN-US missing: ${enMissing} (fallbackUsed: ${enWarning?.fallbackUsed}, FALTANDO: ${enWarning?.issues?.some?.((i: string) => i.includes('FALTANDO'))}, vazio: ${!enText})`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      renderMultilingualEditor(editId, jsonKey, ptText, enText, ptMissing, enMissing);
    }).catch(error => {
      console.error('Erro ao buscar dados multilíngues:', error);
      // Fallback para editor simples
      renderSimpleEditor(editId, jsonKey, currentText, hasText);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);
  
  const renderMultilingualEditor = (editId: string, jsonKey: string, ptText: string, enText: string, ptMissing: boolean, enMissing: boolean) => {
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.id = 'editor-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 9998;
      backdrop-filter: blur(2px);
      animation: fadeIn 0.2s;
    `;

    // Criar container do editor
    const editor = document.createElement('div');
    editor.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      z-index: 9999;
      padding: 32px;
      min-width: 900px;
      max-width: 1200px;
      max-height: 85vh;
      overflow-y: auto;
      animation: slideIn 0.3s;
      display: flex;
      flex-direction: column;
    `;

    // Título principal
    const title = document.createElement('div');
    title.textContent = '✏️ Editor Multilíngue';
    title.style.cssText = `
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #333;
    `;

    // Subtítulo com a chave
    const subtitle = document.createElement('div');
    subtitle.textContent = jsonKey;
    subtitle.style.cssText = `
      font-size: 14px;
      color: #666;
      margin-bottom: 24px;
      font-family: 'Courier New', monospace;
      background: #f5f5f5;
      padding: 8px 12px;
      border-radius: 6px;
      border-left: 4px solid #CFAF5A;
    `;

    // Container de idiomas lado a lado
    const languagesContainer = document.createElement('div');
    languagesContainer.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
      flex-grow: 1;
    `;

    // ========== PORTUGUÊS ==========
    const ptSection = document.createElement('div');
    ptSection.style.cssText = `
      display: flex;
      flex-direction: column;
      border: 2px solid ${ptMissing ? '#fca5a5' : '#86efac'};
      border-radius: 8px;
      padding: 16px;
      background: ${ptMissing ? '#fef2f2' : '#f0fdf4'};
    `;

    const ptLabel = document.createElement('div');
    ptLabel.style.cssText = `
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: ${ptMissing ? '#991b1b' : '#166534'};
    `;
    ptLabel.innerHTML = `${ptMissing ? '⚠️' : '✅'} Português (pt-BR)`;

    const ptStatus = document.createElement('div');
    ptStatus.style.cssText = `
      font-size: 12px;
      margin-bottom: 12px;
      padding: 8px 12px;
      border-radius: 4px;
      background: ${ptMissing ? '#fecaca' : '#d1fae5'};
      color: ${ptMissing ? '#7f1d1d' : '#065f46'};
      font-weight: 600;
    `;
    ptStatus.textContent = ptMissing ? '🔴 FALTANDO - Adicione conteúdo em português' : '🟢 OK - Conteúdo presente';

    const ptTextarea = document.createElement('textarea');
    ptTextarea.value = ptText;
    ptTextarea.placeholder = ptMissing ? 'Digite o conteúdo em português...' : '';
    ptTextarea.style.cssText = `
      flex-grow: 1;
      padding: 12px;
      border: 2px solid ${ptMissing ? '#fca5a5' : '#86efac'};
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      resize: none;
      min-height: 300px;
      line-height: 1.5;
      transition: all 0.2s;
      ${ptMissing ? 'background: #fefce8; color: #7f1d1d;' : ''}
    `;
    ptTextarea.onmouseover = () => {
      ptTextarea.style.borderColor = ptMissing ? '#f87171' : '#4ade80';
    };
    ptTextarea.onmouseout = () => {
      ptTextarea.style.borderColor = ptMissing ? '#fca5a5' : '#86efac';
    };

    ptSection.appendChild(ptLabel);
    ptSection.appendChild(ptStatus);
    ptSection.appendChild(ptTextarea);

    // ========== INGLÊS ==========
    const enSection = document.createElement('div');
    enSection.style.cssText = `
      display: flex;
      flex-direction: column;
      border: 2px solid ${enMissing ? '#fca5a5' : '#86efac'};
      border-radius: 8px;
      padding: 16px;
      background: ${enMissing ? '#fef2f2' : '#f0fdf4'};
    `;

    const enLabel = document.createElement('div');
    enLabel.style.cssText = `
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: ${enMissing ? '#991b1b' : '#166534'};
    `;
    enLabel.innerHTML = `${enMissing ? '⚠️' : '✅'} English (en-US)`;

    const enStatus = document.createElement('div');
    enStatus.style.cssText = `
      font-size: 12px;
      margin-bottom: 12px;
      padding: 8px 12px;
      border-radius: 4px;
      background: ${enMissing ? '#fecaca' : '#d1fae5'};
      color: ${enMissing ? '#7f1d1d' : '#065f46'};
      font-weight: 600;
    `;
    enStatus.textContent = enMissing ? '🔴 FALTANDO - Adicione conteúdo em inglês' : '🟢 OK - Conteúdo presente';

    const enTextarea = document.createElement('textarea');
    enTextarea.value = enText;
    enTextarea.placeholder = enMissing ? 'Type content in English...' : '';
    enTextarea.style.cssText = `
      flex-grow: 1;
      padding: 12px;
      border: 2px solid ${enMissing ? '#fca5a5' : '#86efac'};
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      resize: none;
      min-height: 300px;
      line-height: 1.5;
      transition: all 0.2s;
      ${enMissing ? 'background: #fefce8; color: #7f1d1d;' : ''}
    `;
    enTextarea.onmouseover = () => {
      enTextarea.style.borderColor = enMissing ? '#f87171' : '#4ade80';
    };
    enTextarea.onmouseout = () => {
      enTextarea.style.borderColor = enMissing ? '#fca5a5' : '#86efac';
    };

    enSection.appendChild(enLabel);
    enSection.appendChild(enStatus);
    enSection.appendChild(enTextarea);

    languagesContainer.appendChild(ptSection);
    languagesContainer.appendChild(enSection);

    // Container de botões
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      align-items: center;
      margin-top: auto;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
    `;

    // Dica de formatação Markdown (à esquerda dos botões)
    const formatHint = document.createElement('div');
    formatHint.style.cssText = `
      flex: 1;
      font-size: 12px;
      color: #9ca3af;
      line-height: 1.5;
    `;
    formatHint.innerHTML = '<span style="color:#6b7280;font-weight:600">Formatação:</span> '
      + '<code style="background:#f3f4f6;padding:1px 4px;border-radius:3px;font-size:11px">**texto**</code> → <strong>negrito</strong> · '
      + '<code style="background:#f3f4f6;padding:1px 4px;border-radius:3px;font-size:11px">*texto*</code> → <em>itálico</em>';

    // Botão OK (Aplicar = preview no layout, NÃO salva no DB ainda)
    const okButton = document.createElement('button');
    okButton.textContent = '✓ Aplicar';
    okButton.style.cssText = `
      padding: 12px 28px;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 700;
      font-size: 16px;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    `;
    okButton.onmouseover = () => {
      okButton.style.background = '#059669';
      okButton.style.transform = 'translateY(-2px)';
    };
    okButton.onmouseout = () => {
      okButton.style.background = '#10b981';
      okButton.style.transform = 'translateY(0)';
    };

    // Botão Cancelar
    const cancelButton = document.createElement('button');
    cancelButton.textContent = '✕ Cancelar';
    cancelButton.style.cssText = `
      padding: 12px 28px;
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.2s;
    `;
    cancelButton.onmouseover = () => {
      cancelButton.style.background = '#4b5563';
      cancelButton.style.transform = 'translateY(-2px)';
    };
    cancelButton.onmouseout = () => {
      cancelButton.style.background = '#6b7280';
      cancelButton.style.transform = 'translateY(0)';
    };

    // Função de salvamento MULTILINGUAL
    const saveEdit = () => {
      const newPTText = ptTextarea.value.trim();
      const newENText = enTextarea.value.trim();
      
      // Validacao: pelo menos um idioma deve ter conteudo
      if (!newPTText && !newENText) {
        const errorMsg = document.createElement('div');
        errorMsg.textContent = '⚠️ Pelo menos um idioma deve ter conteúdo!';
        errorMsg.style.cssText = `
          color: #ef4444;
          font-size: 14px;
          font-weight: 700;
          padding: 12px;
          background: #fef2f2;
          border-radius: 6px;
          border-left: 4px solid #ef4444;
          margin-bottom: 16px;
        `;
        editor.insertBefore(errorMsg, buttonContainer);
        
        setTimeout(() => {
          errorMsg.remove();
        }, 3000);
        return;
      }

      console.log(`💾 Acumulando mudanca na chave: ${jsonKey}`);
      console.log(`   pt-BR: "${newPTText.substring(0, 60)}..."`);
      console.log(`   en-US: "${newENText.substring(0, 60)}..."`);
      
      // 🔄 Registrar edição pendente no Context — usePageContent vai mesclar
      // automaticamente nos dados retornados, em qualquer idioma.
      // Usar o pageId REAL extraído da chave (pode ser diferente da aba atual).
      const { sourcePageId: pendingPageId, cleanKey: pendingCleanKey } = extractSourcePageId(jsonKey);
      setPendingEdit(pendingPageId, pendingCleanKey, newPTText, newENText);
      
      // Atualizar estado local (para tracking de modificações e save)
      setFields(prev => {
        const updated = [...prev];
        const fieldIndex = updated.findIndex(f => f.id === editId);
        
        if (fieldIndex >= 0) {
          // Atualizar campo existente com marcas de multilingual
          updated[fieldIndex] = {
            ...updated[fieldIndex],
            currentValue: newPTText || newENText,  // Preview com PT principal
            isModified: true,
            ptValue: newPTText,
            enValue: newENText,
            languages: ['pt-BR', 'en-US']
          };
        } else {
          updated.push({
            id: editId,
            jsonKey,
            originalValue: ptText || enText,
            currentValue: newPTText || newENText,
            isModified: true,
            ptValue: newPTText,
            enValue: newENText,
            languages: ['pt-BR', 'en-US']
          });
        }
        
        return updated;
      });
      
      // 🖼️ LIVE PREVIEW via React: setPendingEdit() acima já disparou
      // recalculação no usePageContent → React re-renderiza o componente
      // com o valor correto para o idioma atual. NÃO manipular o DOM diretamente
      // aqui — isso quebraria a reconciliação do React (o elemento ficaria "morto"
      // e não responderia mais a trocas de idioma, além de perder formatações
      // como substring/truncation que o componente aplica no render).
      //
      // O indicador visual (outline amber) é re-aplicado pelo MutationObserver
      // quando React re-renderiza e o addVisualSelection detecta o novo nó DOM.
      console.log(`🖼️ Pending edit registered for ${jsonKey} — React will re-render`);
      
      console.log('✓ Campo acumulado. Usuario vera botao "Salvar X mudancas"');
      cleanup();
    };

    okButton.onclick = saveEdit;
    cancelButton.onclick = cleanup;
    
    buttonContainer.appendChild(formatHint);
    buttonContainer.appendChild(okButton);
    buttonContainer.appendChild(cancelButton);
    
    editor.appendChild(title);
    editor.appendChild(subtitle);
    editor.appendChild(languagesContainer);
    editor.appendChild(buttonContainer);

    function cleanup() {
      overlay.remove();
      editor.remove();
      activeEditorRef.current = null;
    }

    overlay.onclick = cleanup;
    editor.onclick = (e) => e.stopPropagation();

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cleanup();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    document.body.appendChild(overlay);
    document.body.appendChild(editor);
    
    activeEditorRef.current = editor;
  };

  // Função helper para renderizar editor simples como fallback
  const renderSimpleEditor = (editId: string, jsonKey: string, currentText: string, hasText: boolean) => {
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.id = 'editor-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 9998;
      backdrop-filter: blur(2px);
    `;

    // Criar container do editor
    const editor = document.createElement('div');
    editor.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      z-index: 9999;
      padding: 32px;
      min-width: 600px;
      max-width: 800px;
    `;

    // Título
    const title = document.createElement('div');
    title.textContent = hasText ? '✏️ Editor de Texto (Fallback)' : '⚠️ Elemento Não Editável';
    title.style.cssText = `
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 12px;
      color: ${hasText ? '#333' : '#ef4444'};
    `;

    // Subtítulo
    const subtitle = document.createElement('div');
    subtitle.textContent = jsonKey;
    subtitle.style.cssText = `
      font-size: 15px;
      color: #666;
      margin-bottom: 24px;
      font-family: 'Courier New', monospace;
      background: #f5f5f5;
      padding: 8px 12px;
      border-radius: 6px;
      border-left: 4px solid #CFAF5A;
    `;

    if (!hasText) {
      // Mensagem para elementos sem texto
      const message = document.createElement('div');
      message.textContent = '❌ Este elemento não possui texto editável';
      message.style.cssText = `
        padding: 20px;
        background: #fef2f2;
        border: 2px solid #ef4444;
        border-radius: 8px;
        color: #991b1b;
        font-weight: 600;
        text-align: center;
        margin-bottom: 24px;
      `;

      const closeButton = document.createElement('button');
      closeButton.textContent = 'Fechar (ESC)';
      closeButton.style.cssText = `
        width: 100%;
        padding: 12px 24px;
        background: #6b7280;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 16px;
      `;
      closeButton.onclick = cleanup;

      editor.appendChild(title);
      editor.appendChild(subtitle);
      editor.appendChild(message);
      editor.appendChild(closeButton);
    } else {
      // Textarea simples como fallback
      const textarea = document.createElement('textarea');
      textarea.value = currentText;
      textarea.style.cssText = `
        width: 100%;
        min-height: 300px;
        padding: 16px;
        border: 3px solid #CFAF5A;
        border-radius: 8px;
        font-size: 18px;
        font-family: inherit;
        resize: vertical;
        margin-bottom: 24px;
      `;
      textarea.focus();
      textarea.select();

      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      `;

      const okButton = document.createElement('button');
      okButton.textContent = '✓ OK';
      okButton.style.cssText = `
        padding: 12px 28px;
        background: #10b981;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 700;
      `;
      okButton.onclick = () => {
        const newText = textarea.value.trim();
        if (!newText) {
          alert('⚠️ Campo não pode estar vazio');
          return;
        }
        // Salvar usando a função padrão
        saveChanges();
        cleanup();
      };

      const cancelButton = document.createElement('button');
      cancelButton.textContent = '✕ Cancelar';
      cancelButton.style.cssText = `
        padding: 12px 28px;
        background: #6b7280;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
      `;
      cancelButton.onclick = cleanup;

      buttonContainer.appendChild(okButton);
      buttonContainer.appendChild(cancelButton);

      editor.appendChild(title);
      editor.appendChild(subtitle);
      editor.appendChild(textarea);
      editor.appendChild(buttonContainer);
    }

    function cleanup() {
      overlay.remove();
      editor.remove();
      activeEditorRef.current = null;
    }

    overlay.onclick = cleanup;
    editor.onclick = (e) => e.stopPropagation();

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cleanup();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    document.body.appendChild(overlay);
    document.body.appendChild(editor);
    
    activeEditorRef.current = editor;
  };

  // 🖱️ Click handler para elementos
  const handleElementClick = useCallback((e: Event) => {
    if (!isEditModeRef.current) return;

    const mouseEvent = e as MouseEvent;
    const target = mouseEvent.target as HTMLElement;
    
    const editable = target.closest('[data-edit-id]') as HTMLElement;
    
    if (editable) {
      mouseEvent.preventDefault();
      mouseEvent.stopPropagation();
      
      const editId = editable.getAttribute('data-edit-id');
      
      if (editId) {
        const mapped = elementMapRef.current.get(editId);
        console.log(`🎯 Opening editor for ID: ${editId}, JSON Key: ${mapped?.jsonKey}`);
        openEditor(editId);
      }
    }
  }, [openEditor]);

  // 🔓 Ativar modo de edição
  const enableEditMode = useCallback(() => {
    console.log('🔓 Enabling edit mode...');
    setIsEditMode(true);
    isEditModeRef.current = true;
    addVisualSelection();
    
    document.addEventListener('click', handleElementClick as EventListener, true);
    
    console.log('✅ Edit mode ENABLED');
  }, [handleElementClick, addVisualSelection]);

  // 🔒 Desativar modo de edição
  const disableEditMode = useCallback(() => {
    console.log('🔒 Disabling edit mode...');
    setIsEditMode(false);
    isEditModeRef.current = false;
    removeVisualSelection();
    
    // Limpar edições pendentes ao sair do modo de edição (TODAS as páginas)
    clearPendingEdits();
    
    document.removeEventListener('click', handleElementClick as EventListener, true);
    
    if (activeEditorRef.current) {
      activeEditorRef.current.remove();
      activeEditorRef.current = null;
      const existingOverlay = document.getElementById('editor-overlay');
      existingOverlay?.remove();
    }
    
    console.log('🔒 Edit mode DISABLED');
  }, [handleElementClick, clearPendingEdits]);

  // 💾 Salvar mudanças no banco
  const saveChanges = async () => {
    const modifiedFields = fields.filter(f => f.isModified);
    
    if (modifiedFields.length === 0) {
      setDialogState({
        open: true,
        type: 'success',
        message: 'Nenhuma mudança para salvar',
      });
      return;
    }

    // 📌 Preservar posição de scroll antes de qualquer operação
    const savedScrollY = window.scrollY;
    console.log(`💾 Saving ${modifiedFields.length} changes... (scroll position: ${savedScrollY}px)`);
    setIsSaving(true);

    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💾 SAVING TO DATABASE');
      console.log('Page ID:', pageId);
      console.log('Number of edits:', modifiedFields.length);
      
      modifiedFields.forEach((field, i) => {
        console.log(`\nEdit ${i + 1}:`);
        console.log('  ID:', field.id);
        console.log('  JSON Key:', field.jsonKey);
        console.log('  Original:', field.originalValue.substring(0, 80) + '...');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isMultilang = (field as any).ptValue || (field as any).enValue;
        if (isMultilang) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          console.log(`  PT-BR: "${(field as any).ptValue ? (field as any).ptValue.substring(0, 60) + '...' : '(nao alterado)'}"}`);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          console.log(`  EN-US: "${(field as any).enValue ? (field as any).enValue.substring(0, 60) + '...' : '(nao alterado)'}"}`);
        } else {
          console.log('  New:', field.currentValue.substring(0, 80) + '...');
        }
      });
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // ━━━ Agrupar campos por sourcePageId (podem vir de páginas diferentes) ━━━
      // Ex: na aba "purificacao", edições em testemunhos vão para /api/content/testemunhos
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const promises: Promise<any>[] = [];

      // Coletar todos os sourcePageIds únicos dos campos modificados
      const affectedPageIds = new Set<string>();
      modifiedFields.forEach(f => {
        const { sourcePageId: sp } = extractSourcePageId(f.jsonKey);
        affectedPageIds.add(sp);
      });
      console.log(`📄 Páginas afetadas: ${[...affectedPageIds].join(', ')}`);

      // Para cada página afetada, processar seus campos
      for (const targetPageId of affectedPageIds) {
        const pageFields = modifiedFields.filter(f => {
          const { sourcePageId: sp } = extractSourcePageId(f.jsonKey);
          return sp === targetPageId;
        });
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pageMultilang = pageFields.filter((f: any) => f.ptValue || f.enValue);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pageSimple = pageFields.filter((f: any) => !f.ptValue && !f.enValue);

        console.log(`  [${targetPageId}] Multi: ${pageMultilang.length}, Simple: ${pageSimple.length}`);

        // Multilíngues: GET → MERGE → PUT
        if (pageMultilang.length > 0) {
          console.log(`📥 GETting existing values from "${targetPageId}" for ${pageMultilang.length} multilingual fields...`);
          
          const getPromises = pageMultilang.map(field => {
            const { cleanKey } = extractSourcePageId(field.jsonKey);
            
            return fetch(`/api/content/${targetPageId}`)
              .then(r => r.json())
              .then(data => {
                let current = data.content || {};
                const parts = cleanKey.split('.');
                for (const part of parts) {
                  const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
                  if (arrayMatch) {
                    const [, arrayName, index] = arrayMatch;
                    current = current?.[arrayName]?.[parseInt(index)];
                  } else {
                    current = current?.[part];
                  }
                }
                if (typeof current !== 'object' || !current) current = {};
                return { field, currentValue: current };
              });
          });
          
          const existingValues = await Promise.all(getPromises);
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mergedEdits: Record<string, any> = {};
          existingValues.forEach(({ field, currentValue }) => {
            const mergedContent = {
              'pt-BR': field.ptValue || currentValue['pt-BR'] || '',
              'en-US': field.enValue || currentValue['en-US'] || ''
            };
            console.log(`  Merged ${field.jsonKey}: PT="${mergedContent['pt-BR'].substring(0, 50)}…" EN="${mergedContent['en-US'].substring(0, 50)}…"`);
            mergedEdits[field.jsonKey] = { newText: mergedContent };
          });
          
          if (Object.keys(mergedEdits).length > 0) {
            console.log(`📤 PUT multilingual to "${targetPageId}" (${Object.keys(mergedEdits).length} fields)`);
            promises.push(
              fetch(`/api/content/${targetPageId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ edits: mergedEdits })
              })
            );
          }
        }
        
        // Campos simples: PUT direto
        if (pageSimple.length > 0) {
          const simpleEdits = pageSimple.reduce((acc, field) => {
            acc[field.jsonKey] = { newText: field.currentValue };
            return acc;
          }, {} as Record<string, { newText: string }>);
          
          console.log(`📤 PUT simple to "${targetPageId}":`, simpleEdits);
          promises.push(
            fetch(`/api/content/${targetPageId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ edits: simpleEdits })
            })
          );
        }
      }
      
      // Aguardar todos os PUTs completarem
      console.log(`⏳ Aguardando ${promises.length} PUT requests...`);
      const responses = await Promise.all(promises);
      
      // Validar todas as respostas
      for (const response of responses) {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
      }
      
      // Processar resultados
      const results = await Promise.all(responses.map(r => r.json()));
      console.log('✅ All PUT requests completed:', results);
      
      const allSuccess = results.every(r => r.success);
      
      if (allSuccess) {
        console.log('✅ Changes saved successfully');
        
        // Atualizar originalValue dos campos salvos
        setFields(prev => prev.map(f => 
          f.isModified ? { ...f, originalValue: f.currentValue, isModified: false } : f
        ));
        
        // NÃO limpar edições pendentes aqui!
        // Os pending edits servem como "ponte" — mantêm os valores corretos
        // na tela enquanto o refetch silencioso traz os dados novos do DB.
        // Se limparmos antes do refetch, o useMemo recalcula com dados antigos
        // do cache → os valores "revertem" visualmente por um instante.
        // Pending edits são limpos ao desativar o modo de edição.
        
        // Invalidar cache de TODAS as páginas afetadas
        console.log(`🔄 Invalidating cache for pages: ${[...affectedPageIds].join(', ')}`);
        affectedPageIds.forEach(pid => invalidateCache(pid));
        
        // Restaurar scroll e seleção visual usando double-rAF (sem timer hardcoded)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo(0, savedScrollY);
            if (isEditModeRef.current) {
              addVisualSelection();
            }
          });
        });
        
        // Success feedback via console only (dialog removed for UX speed)
        console.log(`✅ ${modifiedFields.length} mudanças salvas com sucesso!`);
        
        // Return to read mode after successful save
        disableEditMode();
      } else {
        throw new Error('Algumas requisicoes falharam');
      }
    } catch (error) {
      console.error('❌ Error saving changes:', error);
      setDialogState({
        open: true,
        type: 'success',
        message: '❌ Erro ao salvar mudancas. Verifique o console.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 🚫 Cancelar todas as mudanças
  const cancelAllChanges = async () => {
    const modifiedFields = fields.filter(f => f.isModified);
    
    if (modifiedFields.length === 0) {
      return;
    }
    
    setDialogState({
      open: true,
      type: 'confirm',
      message: `Descartar ${modifiedFields.length} modificações não salvas?`,
      onConfirm: async () => {
    
    console.log(`🚫 Cancelando ${modifiedFields.length} mudanças...`);
    
    // Limpar edições pendentes de TODAS as páginas (podem ter cross-page edits)
    clearPendingEdits();
    
    // Coletar pageIds afetados para invalidar cache
    const cancelAffected = new Set<string>();
    modifiedFields.forEach(f => {
      const { sourcePageId: sp } = extractSourcePageId(f.jsonKey);
      cancelAffected.add(sp);
    });
    
    // Limpar estado de campos modificados
    setFields([]);
    
    // Invalidar cache de todas as páginas afetadas
    cancelAffected.forEach(pid => invalidateCache(pid));
    
    // Re-aplicar seleção visual após React re-render
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (isEditModeRef.current) {
          addVisualSelection();
        }
      });
    });
    
    console.log('✅ Todas as mudanças foram descartadas');
      },
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disableEditMode();
    };
  }, [disableEditMode]);

  const modifiedCount = fields.filter(f => f.isModified).length;

  return (
    <>
      {/* 🔄 RENDERIZAR PÁGINA COM IDIOMA SELECIONADO */}
      <div>
        <PageComponent />
      </div>
      
      {/* 🟡 BOTÃO FLUTUANTE AMARELO - EDITAR TEXTOS */}
      <button
        onClick={isEditMode ? disableEditMode : enableEditMode}
        className={`visual-editor-main-btn ${isEditMode ? 'edit-mode-active' : 'edit-mode-inactive'}`}
      >
        {isEditMode ? '🔒 DESATIVAR EDIÇÃO' : '✏️ EDITAR TEXTOS'}
      </button>

      {/* 🟢 BOTÃO FLUTUANTE VERDE - SALVAR */}
      {isEditMode && modifiedCount > 0 && (
        <>
          <button
            onClick={saveChanges}
            disabled={isSaving}
            className={`visual-editor-save-btn ${isSaving ? 'saving' : 'active'}`}
          >
            {isSaving ? '⏳ SALVANDO...' : `💾 SALVAR ${modifiedCount} MUDANÇA${modifiedCount !== 1 ? 'S' : ''}`}
          </button>

          {/* 🔴 BOTÃO FLUTUANTE VERMELHO - CANCELAR */}
          <button
            onClick={cancelAllChanges}
            disabled={isSaving}
            className={`visual-editor-cancel-btn ${isSaving ? 'disabled' : 'active'}`}
          >
            🚫 CANCELAR {modifiedCount} MUDANÇA{modifiedCount !== 1 ? 'S' : ''}
          </button>
        </>
      )}

      {/* Dialog centralizado para confirmações e mensagens */}
      <Dialog open={dialogState.open} onOpenChange={(open) => setDialogState(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-106.25 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <DialogHeader>
            <DialogTitle>
              {dialogState.type === 'success' ? 'Sucesso' : 'Confirmação'}
            </DialogTitle>
            <DialogDescription className="text-base pt-4">
              {dialogState.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {dialogState.type === 'confirm' ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setDialogState(prev => ({ ...prev, open: false }))}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDialogState(prev => ({ ...prev, open: false }));
                    dialogState.onConfirm?.();
                  }}
                >
                  Confirmar
                </Button>
              </>
            ) : (
              <Button onClick={() => setDialogState(prev => ({ ...prev, open: false }))}>
                OK
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VisualPageEditor;

