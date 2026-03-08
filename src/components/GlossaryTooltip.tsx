import React, { useState } from 'react';

export interface GlossaryEntry {
  term: string;
  definition: string;
  jsonKey?: string;
}

interface GlossaryTooltipProps {
  term: string;
  definition: string;
  jsonKey?: string;
}

/**
 * Follows the same pattern as dt-legal-tooltip in Tratamentos:
 * - Balloon is a plain container (no data-json-key on it)
 * - Content INSIDE the balloon has data-json-key for the visual editor
 * - Visibility controlled by React state (hover/focus)
 */
const GlossaryTooltip: React.FC<GlossaryTooltipProps> = ({ term, definition, jsonKey }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="glossary-term"
      role="term"
      tabIndex={0}
      aria-label={definition}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {term}
      <span
        className={`glossary-balloon ${visible ? 'visible' : ''}`}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        <span
          className="glossary-balloon-text"
          {...(jsonKey ? { 'data-json-key': jsonKey } : {})}
        >
          {definition}
        </span>
      </span>
    </span>
  );
};

/**
 * Takes a React node tree (from parseInlineMarkdown) and wraps glossary terms
 * with tooltip balloons. Works on plain strings and recursively on React elements.
 */
export function applyGlossary(
  node: React.ReactNode,
  entries: GlossaryEntry[]
): React.ReactNode {
  if (!entries.length) return node;

  if (typeof node === 'string') {
    return splitAndWrap(node, entries);
  }

  if (React.isValidElement(node)) {
    const children = (node.props as { children?: React.ReactNode }).children;
    if (!children) return node;

    const newChildren = React.Children.map(children, child =>
      applyGlossary(child, entries)
    );
    return React.cloneElement(node, undefined, newChildren);
  }

  if (Array.isArray(node)) {
    return node.map((child, i) => (
      <React.Fragment key={i}>{applyGlossary(child, entries)}</React.Fragment>
    ));
  }

  return node;
}

function splitAndWrap(text: string, entries: GlossaryEntry[]): React.ReactNode {
  const pattern = entries.map(e => escapeRegex(e.term)).join('|');
  const regex = new RegExp(`(${pattern})`, 'g');

  const parts = text.split(regex);
  if (parts.length === 1) return text;

  const entryMap = new Map(entries.map(e => [e.term.toLowerCase(), e]));
  let key = 0;

  return (
    <>
      {parts.map(part => {
        const entry = entryMap.get(part.toLowerCase());
        if (entry) {
          return (
            <GlossaryTooltip
              key={`g-${key++}`}
              term={part}
              definition={entry.definition}
              jsonKey={entry.jsonKey}
            />
          );
        }
        return part;
      })}
    </>
  );
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default GlossaryTooltip;
