/**
 * Holiday Conflict Resolver
 *
 * Handles conflicts between holiday overlays and sensitive occasions.
 * Philosophy: "If conflict → choose restraint"
 *
 * Conflict Resolution Rules:
 * - Holiday + apology → calm, minimal (letterpress_minimal)
 * - Holiday + illness → remove celebration cues (night_sky_quiet)
 * - Holiday + professional → letterpress only
 * - Holiday + grief → most restrained (botanical_silhouette)
 */

import { HolidayOverlay, HolidayId, OverlayConflict, ConflictResolution } from './types';
import { getHolidayOverlay } from './holidayOverlays';
import { HighRiskOccasion, detectHighRiskOccasions } from '../guardrails';

/**
 * Celebration-related negative prompts to add when conflict requires restraint
 */
const CELEBRATION_NEGATIVES = [
  'festive',
  'celebration',
  'party',
  'confetti',
  'balloons',
  'fireworks',
  'streamers',
  'gift boxes',
  'champagne',
  'cheers',
  'decorations',
  'banners',
];

/**
 * Additional negatives per conflict type
 */
const CONFLICT_NEGATIVES: Record<OverlayConflict, string[]> = {
  apology: ['bright', 'energetic', 'joyful', 'excited', 'playful', 'cheerful'],
  illness: ['energetic', 'busy', 'overwhelming', 'intense', 'loud', 'chaotic'],
  grief: ['happy', 'cheerful', 'bright', 'festive', 'celebratory', 'joyous', 'upbeat'],
  professional: ['whimsical', 'playful', 'cute', 'informal', 'casual', 'silly'],
};

/**
 * Forced template per conflict type
 */
const FORCED_TEMPLATES: Record<OverlayConflict, string> = {
  apology: 'letterpress_minimal',
  illness: 'night_sky_quiet',
  grief: 'botanical_silhouette',
  professional: 'letterpress_minimal',
};

/**
 * Conflict priority (higher = more restrictive)
 */
const CONFLICT_PRIORITY: OverlayConflict[] = ['grief', 'apology', 'illness', 'professional'];

/**
 * Map guardrail HighRiskOccasion to OverlayConflict
 */
function mapToOverlayConflict(occasion: HighRiskOccasion): OverlayConflict | null {
  const mapping: Record<HighRiskOccasion, OverlayConflict> = {
    grief: 'grief',
    illness: 'illness',
    apology: 'apology',
    professional: 'professional',
  };
  return mapping[occasion] || null;
}

/**
 * Extract only color/palette mentions from visual treatment
 * Used for maximum restraint scenarios (grief, apology)
 */
function extractPaletteOnly(treatment: string): string {
  const paletteKeywords = [
    'palette',
    'colors',
    'tones',
    'hues',
    'red',
    'pink',
    'blue',
    'green',
    'gold',
    'silver',
    'cream',
    'white',
    'warm',
    'cool',
    'soft',
    'muted',
    'gentle',
    'deep',
    'blush',
    'rose',
    'indigo',
    'charcoal',
    'earth',
    'neutral',
    'pastel',
  ];

  const sentences = treatment.split(/\.\s+/);
  const paletteSentences = sentences.filter((s) =>
    paletteKeywords.some((k) => s.toLowerCase().includes(k))
  );

  if (paletteSentences.length === 0) {
    return 'Use a soft, muted color palette. The composition should feel calm and minimal.';
  }

  return paletteSentences.join('. ') + '.';
}

/**
 * Remove celebration-specific language while keeping mood/palette
 */
function removeCelebrationCues(treatment: string): string {
  const celebrationTerms = [
    /\bcelebrat\w*\b/gi,
    /\bfestiv\w*\b/gi,
    /\bjoyful\b/gi,
    /\bexcit\w*\b/gi,
    /\bmerry\b/gi,
    /\bjolly\b/gi,
    /\bcheery\b/gi,
    /\bcheer\b/gi,
    /\bupbeat\b/gi,
    /\blively\b/gi,
  ];

  let result = treatment;
  for (const term of celebrationTerms) {
    result = result.replace(term, 'calm');
  }

  return result;
}

/**
 * Create a restrained version of a holiday overlay for conflict scenarios
 */
function createRestrainedOverlay(
  original: HolidayOverlay,
  conflictType: OverlayConflict
): { overlay: HolidayOverlay; negatives: string[] } {
  const negatives: string[] = [...CELEBRATION_NEGATIVES, ...CONFLICT_NEGATIVES[conflictType]];

  let modifiedTreatment: string;

  switch (conflictType) {
    case 'apology':
      // Holiday + apology → calm, minimal; strip to palette only
      modifiedTreatment = extractPaletteOnly(original.visualTreatment);
      break;

    case 'illness':
      // Holiday + illness → remove celebration cues, keep comforting elements
      modifiedTreatment = removeCelebrationCues(original.visualTreatment);
      break;

    case 'grief':
      // Holiday + grief → most restrained, palette only
      modifiedTreatment = extractPaletteOnly(original.visualTreatment);
      break;

    case 'professional':
      // Holiday + professional → palette only, formal restraint
      modifiedTreatment = extractPaletteOnly(original.visualTreatment);
      break;

    default:
      modifiedTreatment = original.visualTreatment;
  }

  return {
    overlay: {
      ...original,
      visualTreatment: modifiedTreatment,
      // Clear best styles - let the forced template take over
      bestBaseStyles: [],
    },
    negatives,
  };
}

/**
 * Resolve conflicts between holiday overlay and sensitive occasions
 *
 * @param holidayId - The holiday to apply (or null if none)
 * @param answers - User wizard answers (for detecting high-risk occasions)
 * @returns ConflictResolution with resolved overlay and any forced constraints
 */
export function resolveHolidayConflict(
  holidayId: HolidayId | null | undefined,
  answers: Record<string, unknown>
): ConflictResolution {
  // No holiday = no conflict
  if (!holidayId || holidayId === 'other') {
    return {
      hasConflict: false,
      resolvedOverlay: null,
      additionalNegatives: [],
    };
  }

  const overlay = getHolidayOverlay(holidayId);
  if (!overlay) {
    return {
      hasConflict: false,
      resolvedOverlay: null,
      additionalNegatives: [],
    };
  }

  // Detect high-risk occasions using existing guardrails
  const highRiskOccasions = detectHighRiskOccasions(answers as Record<string, any>);

  // Map to overlay conflicts
  const conflicts = highRiskOccasions
    .map(mapToOverlayConflict)
    .filter((c): c is OverlayConflict => c !== null);

  // No conflicts = use overlay as-is with its avoid list as negatives
  if (conflicts.length === 0) {
    return {
      hasConflict: false,
      resolvedOverlay: overlay,
      additionalNegatives: overlay.avoidList,
    };
  }

  // Determine the most restrictive conflict (highest priority)
  const primaryConflict = CONFLICT_PRIORITY.find((c) => conflicts.includes(c)) || conflicts[0];

  // Create restrained overlay
  const { overlay: restrained, negatives } = createRestrainedOverlay(overlay, primaryConflict);

  // Get forced template
  const forcedTemplateId = FORCED_TEMPLATES[primaryConflict];

  // Build explanation
  const explanations: Record<OverlayConflict, string> = {
    professional: `Professional context: using ${forcedTemplateId} with muted holiday palette.`,
    apology: `Apology context: celebration cues removed, using calm minimal style.`,
    illness: `Support context: celebration cues removed, using comforting style.`,
    grief: `Grief context: holiday reduced to subtle palette only, using respectful style.`,
  };

  return {
    hasConflict: true,
    conflictType: primaryConflict,
    resolvedOverlay: restrained,
    forcedTemplateId,
    additionalNegatives: [...negatives, ...overlay.avoidList],
    explanation: explanations[primaryConflict],
  };
}

/**
 * Check if a conflict would force a specific template
 * Useful for UI to show why a template was auto-selected
 */
export function wouldForceTemplate(
  holidayId: HolidayId | null | undefined,
  answers: Record<string, unknown>
): { forced: boolean; templateId?: string; reason?: string } {
  const resolution = resolveHolidayConflict(holidayId, answers);

  if (resolution.hasConflict && resolution.forcedTemplateId) {
    return {
      forced: true,
      templateId: resolution.forcedTemplateId,
      reason: resolution.explanation,
    };
  }

  return { forced: false };
}
