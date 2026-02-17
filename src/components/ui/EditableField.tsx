import React from 'react';

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
}

/**
 * Component principal - renderiza elemento com placeholder automático
 */
const EditableField = React.forwardRef<HTMLElement, EditableFieldProps>(
  (
    {
      value,
      jsonKey,
      type = 'span',
      className = '',
      placeholder = '✎ Clique para editar',
      ...htmlProps
    },
    ref
  ) => {
    // Determinar se deve mostrar placeholder - com type guard apropriado
    const isEmpty = !value || (typeof value === 'string' && value.trim() === '');
    
    // Classes dinâmicas para estado vazio
    const emptyClasses = isEmpty 
      ? 'text-gray-400/50 italic min-h-[1em]'
      : '';
    
    // Combinar classes
    const finalClassName = [className, emptyClasses].filter(Boolean).join(' ');
    
    // Renderizar elemento baseado no tipo
    const elementProps = {
      ref,
      'data-json-key': jsonKey,
      className: finalClassName,
      ...htmlProps,
    };

    const content: React.ReactNode = value || placeholder;

    // Map de elementos HTML
    const elementMap: Record<string, React.ReactElement> = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      h1: <h1 {...(elementProps as any)}>{content}</h1>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      h2: <h2 {...(elementProps as any)}>{content}</h2>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      h3: <h3 {...(elementProps as any)}>{content}</h3>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      h4: <h4 {...(elementProps as any)}>{content}</h4>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      h5: <h5 {...(elementProps as any)}>{content}</h5>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      h6: <h6 {...(elementProps as any)}>{content}</h6>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      p: <p {...(elementProps as any)}>{content}</p>,
      span: <span {...elementProps}>{content}</span>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      div: <div {...(elementProps as any)}>{content}</div>,
    };

    return elementMap[type] || elementMap.span;
  }
);

EditableField.displayName = 'EditableField';

export default EditableField;
