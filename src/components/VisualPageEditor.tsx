import { useEffect, useRef, useState, useCallback } from 'react';

interface VisualPageEditorProps {
  pageId: string;
  pageName: string;
  pageComponent: React.ComponentType;
}

interface EditField {
  key: string;
  originalValue: string;
  currentValue: string;
  isModified: boolean;
}

const VisualPageEditor = ({ pageId, pageComponent: PageComponent }: VisualPageEditorProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [fields, setFields] = useState<EditField[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const activeEditorRef = useRef<HTMLDivElement | null>(null);
  const isEditModeRef = useRef(false);

  // Função para coletar todos os elementos editáveis
  const collectEditableElements = () => {
    const editables = document.querySelectorAll('[data-editable]');
    const collected: EditField[] = [];

    editables.forEach(el => {
      const key = el.getAttribute('data-editable');
      if (key) {
        const text = el.textContent || '';
        collected.push({
          key,
          originalValue: text,
          currentValue: text,
          isModified: false
        });
      }
    });

    console.log(`📝 Collected ${collected.length} editable elements`);
    setFields(collected);
  };

  // Adicionar highlights nos elementos editáveis
  const addHighlights = () => {
    const editables = document.querySelectorAll('[data-editable]');
    
    editables.forEach(el => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.cursor = 'pointer';
      htmlEl.style.outline = '2px dashed #CFAF5A';
      htmlEl.style.outlineOffset = '2px';
      htmlEl.style.transition = 'outline 0.2s';

      // Hover effect
      const handleMouseEnter = () => {
        htmlEl.style.outline = '2px solid #CFAF5A';
        htmlEl.style.backgroundColor = 'rgba(207, 175, 90, 0.1)';
      };

      const handleMouseLeave = () => {
        htmlEl.style.outline = '2px dashed #CFAF5A';
        htmlEl.style.backgroundColor = '';
      };

      htmlEl.addEventListener('mouseenter', handleMouseEnter);
      htmlEl.addEventListener('mouseleave', handleMouseLeave);
      
      // Armazenar handlers para remover depois
      (htmlEl as any)._hoverHandlers = { handleMouseEnter, handleMouseLeave };
    });

    console.log(`✨ Added highlights to ${editables.length} elements`);
  };

  // Remover highlights
  const removeHighlights = () => {
    const editables = document.querySelectorAll('[data-editable]');
    
    editables.forEach(el => {
      const htmlEl = el as HTMLElement;
      
      // Remover event listeners
      const handlers = (htmlEl as any)._hoverHandlers;
      if (handlers) {
        htmlEl.removeEventListener('mouseenter', handlers.handleMouseEnter);
        htmlEl.removeEventListener('mouseleave', handlers.handleMouseLeave);
        delete (htmlEl as any)._hoverHandlers;
      }
      
      htmlEl.style.cursor = '';
      htmlEl.style.outline = '';
      htmlEl.style.outlineOffset = '';
      htmlEl.style.backgroundColor = '';
    });

    console.log('🧹 Removed all highlights');
  };

  // Abrir editor para um elemento
  const openEditor = (element: HTMLElement, key: string) => {
    // Fechar editor anterior se existir
    if (activeEditorRef.current) {
      activeEditorRef.current.remove();
      const existingOverlay = document.getElementById('editor-overlay');
      existingOverlay?.remove();
    }

    const currentText = element.textContent || '';

    // Criar overlay
    const overlay = document.createElement('div');
    overlay.id = 'editor-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Criar container do editor
    const editor = document.createElement('div');
    editor.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      z-index: 9999;
      padding: 24px;
      min-width: 500px;
      max-width: 800px;
    `;

    // Título
    const title = document.createElement('div');
    title.textContent = '📝 Texto Selecionado';
    title.style.cssText = `
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
    `;

    // Subtítulo com a key
    const subtitle = document.createElement('div');
    subtitle.textContent = key;
    subtitle.style.cssText = `
      font-size: 12px;
      color: #666;
      margin-bottom: 16px;
      font-family: monospace;
      background: #f5f5f5;
      padding: 4px 8px;
      border-radius: 4px;
    `;

    // Textarea
    const textarea = document.createElement('textarea');
    textarea.value = currentText;
    textarea.style.cssText = `
      width: 100%;
      min-height: 150px;
      padding: 12px;
      border: 2px solid #CFAF5A;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
      margin-bottom: 16px;
    `;
    textarea.focus();
    textarea.select();

    // Container de botões
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;

    // Botão OK
    const okButton = document.createElement('button');
    okButton.textContent = '✓ OK';
    okButton.style.cssText = `
      padding: 8px 16px;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
    `;
    okButton.onmouseover = () => okButton.style.background = '#059669';
    okButton.onmouseout = () => okButton.style.background = '#10b981';

    // Botão Cancelar
    const cancelButton = document.createElement('button');
    cancelButton.textContent = '✕ Cancelar';
    cancelButton.style.cssText = `
      padding: 8px 16px;
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    `;
    cancelButton.onmouseover = () => cancelButton.style.background = '#4b5563';
    cancelButton.onmouseout = () => cancelButton.style.background = '#6b7280';

    // Função de salvamento
    const saveEdit = () => {
      const newText = textarea.value;
      
      // Atualizar DOM imediatamente
      element.textContent = newText;
      
      // Atualizar estado
      setFields(prev => {
        const updated = [...prev];
        const fieldIndex = updated.findIndex(f => f.key === key);
        
        if (fieldIndex >= 0) {
          updated[fieldIndex] = {
            ...updated[fieldIndex],
            currentValue: newText,
            isModified: updated[fieldIndex].originalValue !== newText
          };
        } else {
          updated.push({
            key,
            originalValue: currentText,
            currentValue: newText,
            isModified: currentText !== newText
          });
        }
        
        return updated;
      });
      
      console.log(`✅ Updated: ${key} = "${newText}"`);
      cleanup();
    };

    // Função de limpeza
    const cleanup = () => {
      overlay.remove();
      editor.remove();
      activeEditorRef.current = null;
    };

    // Event listeners
    okButton.onclick = saveEdit;
    cancelButton.onclick = cleanup;
    overlay.onclick = cleanup;
    editor.onclick = (e) => e.stopPropagation();

    // Atalhos de teclado
    textarea.onkeydown = (e) => {
      if (e.key === 'Escape') {
        cleanup();
      } else if (e.key === 'Enter' && e.ctrlKey) {
        saveEdit();
      }
    };

    // Montar estrutura
    buttonContainer.appendChild(okButton);
    buttonContainer.appendChild(cancelButton);
    
    editor.appendChild(title);
    editor.appendChild(subtitle);
    editor.appendChild(textarea);
    editor.appendChild(buttonContainer);
    
    document.body.appendChild(overlay);
    document.body.appendChild(editor);
    
    activeEditorRef.current = editor;
  };

  // Click handler para elementos editáveis
  const handleElementClick = useCallback((e: Event) => {
    console.log('🖱️ Click detected, isEditMode:', isEditModeRef.current);
    
    if (!isEditModeRef.current) {
      console.log('⚠️ Click ignored - edit mode is OFF');
      return;
    }

    const mouseEvent = e as MouseEvent;
    const target = mouseEvent.target as HTMLElement;
    console.log('🎯 Target element:', target.tagName, target.className);
    
    const editable = target.closest('[data-editable]') as HTMLElement;
    
    if (editable) {
      mouseEvent.preventDefault();
      mouseEvent.stopPropagation();
      
      const key = editable.getAttribute('data-editable');
      console.log(`✅ Found editable element with key: ${key}`);
      
      if (key) {
        console.log(`🎯 Opening editor for: ${key}`);
        openEditor(editable, key);
      }
    } else {
      console.log('⚠️ Click on non-editable element');
    }
  }, []);

  // Ativar modo de edição
  const enableEditMode = useCallback(() => {
    console.log('🔓 Enabling edit mode...');
    setIsEditMode(true);
    isEditModeRef.current = true;
    collectEditableElements();
    addHighlights();
    
    // Adicionar listener global com capture=true para capturar antes de bubbling
    document.addEventListener('click', handleElementClick as EventListener, true);
    
    console.log('✅ Edit mode ENABLED, ref:', isEditModeRef.current);
  }, [handleElementClick]);

  // Desativar modo de edição
  const disableEditMode = useCallback(() => {
    console.log('🔒 Disabling edit mode...');
    setIsEditMode(false);
    isEditModeRef.current = false;
    removeHighlights();
    
    // Remover listener global
    document.removeEventListener('click', handleElementClick as EventListener, true);
    
    // Fechar editor se aberto
    if (activeEditorRef.current) {
      activeEditorRef.current.remove();
      activeEditorRef.current = null;
      const existingOverlay = document.getElementById('editor-overlay');
      existingOverlay?.remove();
    }
    
    console.log('🔒 Edit mode DISABLED');
  }, [handleElementClick]);

  // Salvar mudanças no banco
  const saveChanges = async () => {
    const modifiedFields = fields.filter(f => f.isModified);
    
    if (modifiedFields.length === 0) {
      alert('Nenhuma mudança para salvar');
      return;
    }

    console.log(`💾 Saving ${modifiedFields.length} changes...`);
    setIsSaving(true);

    try {
      const updates = modifiedFields.reduce((acc, field) => {
        acc[field.key] = field.currentValue;
        return acc;
      }, {} as Record<string, string>);

      const response = await fetch('/api/save-visual-edits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: pageId,
          updates
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Changes saved successfully');
        
        // Atualizar originalValue dos campos salvos
        setFields(prev => prev.map(f => 
          f.isModified ? { ...f, originalValue: f.currentValue, isModified: false } : f
        ));
        
        alert(`✅ ${modifiedFields.length} mudanças salvas com sucesso!`);
      } else {
        throw new Error(result.error || 'Failed to save');
      }
    } catch (error) {
      console.error('❌ Error saving changes:', error);
      alert('❌ Erro ao salvar mudanças. Verifique o console.');
    } finally {
      setIsSaving(false);
    }
  };

  // Cancelar todas as mudanças
  const cancelChanges = () => {
    if (!confirm('Descartar todas as mudanças?')) {
      return;
    }

    // Reverter DOM
    fields.forEach(field => {
      if (field.isModified) {
        const element = document.querySelector(`[data-editable="${field.key}"]`);
        if (element) {
          element.textContent = field.originalValue;
        }
      }
    });

    // Resetar estado
    setFields(prev => prev.map(f => ({ 
      ...f, 
      currentValue: f.originalValue, 
      isModified: false 
    })));

    console.log('↩️ All changes cancelled');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disableEditMode();
    };
  }, []);

  const modifiedCount = fields.filter(f => f.isModified).length;

  return (
    <>
      {/* Renderizar o componente da página */}
      <PageComponent />
      
      {/* Controles do editor */}
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px', 
      zIndex: 9997,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      {/* Botão Ativar/Desativar Edição */}
      <button
        onClick={isEditMode ? disableEditMode : enableEditMode}
        style={{
          padding: '12px 20px',
          background: isEditMode ? '#ef4444' : '#CFAF5A',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        }}
      >
        {isEditMode ? '🔒 Desativar Edição' : '✏️ Ativar Edição'}
      </button>

      {/* Botões de Salvar/Cancelar (apenas quando há mudanças) */}
      {isEditMode && modifiedCount > 0 && (
        <div style={{
          background: 'white',
          padding: '12px',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#666',
            fontWeight: '600'
          }}>
            {modifiedCount} mudança{modifiedCount !== 1 ? 's' : ''}
          </div>

          <button
            onClick={saveChanges}
            disabled={isSaving}
            style={{
              padding: '10px 16px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              opacity: isSaving ? 0.6 : 1
            }}
          >
            {isSaving ? '⏳ Salvando...' : '💾 Salvar Mudanças'}
          </button>

          <button
            onClick={cancelChanges}
            disabled={isSaving}
            style={{
              padding: '8px 16px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              opacity: isSaving ? 0.6 : 1
            }}
          >
            ↩️ Cancelar
          </button>
        </div>
      )}
      </div>
    </>
  );
};

export default VisualPageEditor;
