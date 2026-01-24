import { PlaceholderContext } from './types';

/**
 * Replace placeholders in a template string with actual values
 * Placeholders use {{key}} syntax, e.g., {{their_thing}}, {{vibe}}
 *
 * If a placeholder has no value, it's removed cleanly (no leftover commas or spaces)
 */
export function replacePlaceholders(
  template: string,
  context: PlaceholderContext
): string {
  // Replace all {{key}} patterns with their values or empty string
  let result = template.replace(/\{\{(\w+)\}\}/g, (_match, key) => {
    const value = context[key as keyof PlaceholderContext];
    return value || '';
  });

  // Clean up the result
  result = result
    .replace(/,\s*,+/g, ',')      // Remove double/multiple commas
    .replace(/,\s*$/g, '')        // Remove trailing comma
    .replace(/^\s*,/g, '')        // Remove leading comma
    .replace(/\s+/g, ' ')         // Normalize whitespace
    .trim();

  return result;
}

/**
 * Build a PlaceholderContext from user wizard answers
 * Maps answer fields to placeholder keys
 */
export function buildPlaceholderContext(
  answers: Record<string, unknown>,
  subject?: string
): PlaceholderContext {
  return {
    subject: subject || '',
    name: (answers.name as string) || '',
    relationship: (answers.relationshipType as string) || '',
    occasion: (answers.specialDay as string) ||
              (answers.lifeEvent as string) ||
              (answers.occasion as string) || '',
    vibe: Array.isArray(answers.vibe)
      ? (answers.vibe as string[])[0]
      : (answers.vibe as string) || '',
    their_thing: (answers.theirThing as string) || '',
    inside_joke: (answers.insideJoke as string) || '',
    recent_moment: (answers.recentMoment as string) || '',
    shared_memory: (answers.sharedMemory as string) || '',
    what_admire: (answers.whatYouAdmire as string) || '',
    traits: Array.isArray(answers.quickTraits)
      ? (answers.quickTraits as string[]).join(', ')
      : '',
    any_details: (answers.anyDetails as string) || '',
  };
}

/**
 * Check if a template string contains any placeholders
 */
export function hasPlaceholders(template: string): boolean {
  return /\{\{\w+\}\}/.test(template);
}

/**
 * Get list of placeholder keys used in a template
 */
export function getPlaceholderKeys(template: string): string[] {
  const matches = template.match(/\{\{(\w+)\}\}/g) || [];
  return matches.map(m => m.replace(/\{\{|\}\}/g, ''));
}
