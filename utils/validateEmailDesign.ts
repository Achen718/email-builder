import { EmailDesign } from '@/types/templates';

/**
 * Type guard to verify if an unknown object matches the EmailDesign structure
 */
export function isEmailDesign(obj: unknown): obj is EmailDesign {
  if (!obj || typeof obj !== 'object') return false;

  const design = obj as Record<string, unknown>;

  return (
    'body' in design &&
    'counters' in design &&
    'schemaVersion' in design &&
    typeof design.body === 'object' &&
    design.body !== null &&
    typeof design.counters === 'object' &&
    design.counters !== null &&
    typeof design.schemaVersion === 'number' &&
    'rows' in (design.body as Record<string, unknown>) &&
    Array.isArray((design.body as Record<string, unknown>).rows)
  );
}
