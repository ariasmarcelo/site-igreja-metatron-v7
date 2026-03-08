import { useMemo } from 'react';
import type { GlossaryEntry } from '@/components/GlossaryTooltip';

/**
 * Builds glossary entries from __shared__ content already loaded
 * by usePageContent(..., { includePages: ['__shared__'] }).
 *
 * The glossary definitions live in Supabase under:
 *   page_id: __shared__
 *   json_key: glossary.<term>
 *
 * @param sharedTexts - The __shared__ object from texts.__shared__
 *
 * @example
 * const { data: texts } = usePageContent('purificacao', { includePages: ['__shared__'] });
 * const GLOSSARY = useGlossary(texts?.__shared__);
 * // then pass to EditableField: <EditableField glossary={GLOSSARY} ... />
 */
export function useGlossary(
  sharedTexts: Record<string, unknown> | undefined | null
): GlossaryEntry[] {
  return useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const glossary = (sharedTexts as any)?.glossary;
    if (!glossary || typeof glossary !== 'object') return [];

    const TERM_LABELS: Record<string, string> = {
      antahkarana: 'Antahkarana',
    };

    return Object.entries(glossary)
      .filter(([, v]) => typeof v === 'string' && v.length > 0)
      .map(([key, value]) => ({
        term: TERM_LABELS[key] ?? key,
        definition: value as string,
        jsonKey: `__shared__.glossary.${key}`,
      }));
  }, [sharedTexts]);
}
