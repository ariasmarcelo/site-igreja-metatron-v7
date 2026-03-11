import React from 'react';
import { logger, DEBUG_ENABLED } from '@/lib/logger';
import { applyGlossary, type GlossaryEntry } from '@/components/GlossaryTooltip';

/**
 * Parses lightweight Markdown (**bold** and *italic*) into React fragments.
 * Safe — no dangerouslySetInnerHTML, only <strong> and <em> elements.
 * If the text contains no markers, returns the original string (zero overhead).
 */
function parseInlineMarkdown(text: string): React.ReactNode {
  if (!text.includes('*')) return text;

  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(<b key={key++}>{match[2]}</b>);
    } else if (match[3]) {
      parts.push(<i key={key++}>{match[3]}</i>);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  if (DEBUG_ENABLED) {
    logger.debug('[MD] Final parts count:', parts.length, 'types:', parts.map(p => typeof p === 'string' ? 'text' : 'element'));
  }
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <>{parts}</>;
}

/**
 * Component universal para renderizar campos editáveis com placeholder automático
 * 
 * USADO EM: Todas as páginas, todos os elementos de texto
 * 
 * @example
 * <EditableField 
 *   value={texts.header.title}
 *   jsonKey="quemsomos.header.title"
 *   type="h1"
 *   className="text-5xl font-bold"
 * />
 */

export interface EditableFieldProps extends React.HTMLAttributes<HTMLElement> {
  /** Valor do banco de dados (ou undefined) */
  value?: string | null;
  
  /** Chave JSON para identificar no editor - OBRIGATÓRIO */
  jsonKey: string;
  
  /** Tipo de elemento HTML a renderizar */
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  
  /** Placeholder customizado (default: "✎ Clique para editar") */
  placeholder?: string;

  /** Glossary terms to annotate with hover tooltips */
  glossary?: GlossaryEntry[];
}

const VALID_TYPES = new Set(['h1','h2','h3','h4','h5','h6','p','span','div']);

/**
 * Component principal - renderiza elemento com placeholder automático.
 * Wrapped em React.memo para evitar re-renders quando props não mudam.
 */
const EditableField = React.memo(
  React.forwardRef<HTMLElement, EditableFieldProps>(
    (
      {
        value,
        jsonKey,
        type = 'span',
        className = '',
        placeholder = '✎ Clique para editar',
        glossary,
        ...htmlProps
      },
      ref
    ) => {
      const isEmpty = !value || (typeof value === 'string' && value.trim() === '');

      const emptyClasses = isEmpty
        ? 'text-gray-400/50 italic min-h-[1em]'
        : '';

      const finalClassName = [className, emptyClasses].filter(Boolean).join(' ');

      let content: React.ReactNode = isEmpty
        ? placeholder
        : (typeof value === 'string' ? parseInlineMarkdown(value) : value);

      if (!isEmpty && glossary?.length) {
        content = applyGlossary(content, glossary);
      }

      const tag = VALID_TYPES.has(type) ? type : 'span';

      return React.createElement(
        tag,
        { ref, 'data-json-key': jsonKey, className: finalClassName, ...htmlProps },
        content
      );
    }
  )
);

EditableField.displayName = 'EditableField';

export default EditableField;
