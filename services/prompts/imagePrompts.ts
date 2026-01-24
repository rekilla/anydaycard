import { ImagePromptConfig, HolidayId } from './types';
import { replacePlaceholders, buildPlaceholderContext } from './placeholderUtils';
import { getHolidayOverlay, mapSpecialDayToHolidayId } from './holidayOverlays';
import { resolveHolidayConflict } from './holidayConflictResolver';

// Import style prompts from .txt files (Vite ?raw imports)
import floralWhisperStyle from './image-styles/floral_whisper.txt?raw';
import texturalMotifStyle from './image-styles/textural_motif.txt?raw';
import iconStudyStyle from './image-styles/icon_study.txt?raw';
import singleLineStyle from './image-styles/single_line.txt?raw';
import painterlyHorizonStyle from './image-styles/painterly_horizon.txt?raw';
import lyricalAbstractStyle from './image-styles/lyrical_abstract.txt?raw';
import negativeSpaceStyle from './image-styles/negative_space.txt?raw';
import botanicalSilhouetteStyle from './image-styles/botanical_silhouette.txt?raw';
import geometricPoiseStyle from './image-styles/geometric_poise.txt?raw';
import collageReverieStyle from './image-styles/collage_reverie.txt?raw';
import letterpressMinimalStyle from './image-styles/letterpress_minimal.txt?raw';
import nightSkyQuietStyle from './image-styles/night_sky_quiet.txt?raw';
import playfulDoodleStyle from './image-styles/playful_doodle.txt?raw';

/**
 * Parse style string from .txt file into array of modifiers
 */
const parseStyleModifiers = (styleString: string): string[] => {
  return styleString.trim().split(',').map(s => s.trim()).filter(Boolean);
};

/**
 * Base image generation settings - quality enhancers applied to ALL images
 */
export const IMAGE_BASE_SETTINGS = {
  quality: 'masterpiece quality, professionally composed, highly detailed',
  noText: 'no text, no lettering, no typography, no words, no numbers',
  aesthetic: 'beautiful greeting card art, emotionally resonant, print-ready',
  lighting: 'perfect lighting, balanced exposure',
};

/**
 * Position-specific modifiers for front vs back of card
 */
export const POSITION_MODIFIERS: Record<'front' | 'back', string[]> = {
  front: [
    'greeting card cover art',
    'hero illustration',
    'centered focal point',
    'visually striking composition',
    'rich colors',
    'emotionally impactful',
  ],
  back: [
    'subtle background design',
    'very low contrast',
    'abundant negative space for text',
    'minimal and calming',
    'soft muted tones',
    'unobtrusive pattern',
  ],
};

/**
 * Cover text preference modifiers
 */
export const COVER_TEXT_MODIFIERS: Record<'text-on-image' | 'design-only', string> = {
  'text-on-image': 'leave clean space for a short cover line',
  'design-only': 'full bleed design, no reserved text space',
};

/**
 * Template-specific image prompt configurations
 * Style modifiers loaded from .txt files in image-styles/
 */
export const TEMPLATE_IMAGE_CONFIGS: Record<string, ImagePromptConfig> = {
  floral_whisper: {
    id: 'img_floral_whisper',
    name: 'Floral Whisper Image Config',
    templateId: 'floral_whisper',
    position: 'both',
    styleModifiers: parseStyleModifiers(floralWhisperStyle),
    negativePrompts: ['harsh colors', 'geometric shapes', 'dark tones', 'sharp edges'],
  },

  textural_motif: {
    id: 'img_textural_motif',
    name: 'Textural Motif Image Config',
    templateId: 'textural_motif',
    position: 'both',
    styleModifiers: parseStyleModifiers(texturalMotifStyle),
    negativePrompts: ['flat design', 'digital', 'smooth surfaces'],
  },

  icon_study: {
    id: 'img_icon_study',
    name: 'Icon Study Image Config',
    templateId: 'icon_study',
    position: 'both',
    styleModifiers: parseStyleModifiers(iconStudyStyle),
    negativePrompts: ['complex scenes', 'multiple objects', 'textures', 'gradients', 'busy'],
  },

  single_line: {
    id: 'img_single_line',
    name: 'Single Line Emotion Image Config',
    templateId: 'single_line',
    position: 'both',
    styleModifiers: parseStyleModifiers(singleLineStyle),
    negativePrompts: ['color', 'filled shapes', 'realistic', 'detailed shading'],
  },

  painterly_horizon: {
    id: 'img_painterly_horizon',
    name: 'Painterly Horizon Image Config',
    templateId: 'painterly_horizon',
    position: 'both',
    styleModifiers: parseStyleModifiers(painterlyHorizonStyle),
    negativePrompts: ['photorealistic', 'sharp lines', 'digital', 'flat'],
  },

  lyrical_abstract: {
    id: 'img_lyrical_abstract',
    name: 'Lyrical Abstract Image Config',
    templateId: 'lyrical_abstract',
    position: 'both',
    styleModifiers: parseStyleModifiers(lyricalAbstractStyle),
    negativePrompts: ['sharp edges', 'defined shapes', 'realistic', 'geometric'],
  },

  negative_space: {
    id: 'img_negative_space',
    name: 'Negative Space Revelation Image Config',
    templateId: 'negative_space',
    position: 'both',
    styleModifiers: parseStyleModifiers(negativeSpaceStyle),
    negativePrompts: ['busy', 'colorful', 'detailed', 'cluttered'],
  },

  botanical_silhouette: {
    id: 'img_botanical_silhouette',
    name: 'Botanical Silhouette Image Config',
    templateId: 'botanical_silhouette',
    position: 'both',
    styleModifiers: parseStyleModifiers(botanicalSilhouetteStyle),
    negativePrompts: ['bright colors', 'busy patterns', 'geometric', 'loud'],
  },

  geometric_poise: {
    id: 'img_geometric_poise',
    name: 'Geometric Poise Image Config',
    templateId: 'geometric_poise',
    position: 'both',
    styleModifiers: parseStyleModifiers(geometricPoiseStyle),
    negativePrompts: ['organic shapes', 'realistic', 'photographic', 'soft edges'],
  },

  collage_reverie: {
    id: 'img_collage_reverie',
    name: 'Collage Reverie Image Config',
    templateId: 'collage_reverie',
    position: 'both',
    styleModifiers: parseStyleModifiers(collageReverieStyle),
    negativePrompts: ['clean digital', 'minimal', 'modern', 'polished'],
  },

  letterpress_minimal: {
    id: 'img_letterpress_minimal',
    name: 'Letterpress Minimal Image Config',
    templateId: 'letterpress_minimal',
    position: 'both',
    styleModifiers: parseStyleModifiers(letterpressMinimalStyle),
    negativePrompts: ['bright colors', 'busy patterns', 'playful', 'whimsical', 'cute', 'digital effects', 'gradients'],
  },

  night_sky_quiet: {
    id: 'img_night_sky_quiet',
    name: 'Night Sky Quiet Image Config',
    templateId: 'night_sky_quiet',
    position: 'both',
    styleModifiers: parseStyleModifiers(nightSkyQuietStyle),
    negativePrompts: ['bright daylight', 'harsh contrast', 'busy', 'chaotic', 'neon colors', 'cluttered'],
  },

  playful_doodle: {
    id: 'img_playful_doodle',
    name: 'Playful Doodle Image Config',
    templateId: 'playful_doodle',
    position: 'both',
    styleModifiers: parseStyleModifiers(playfulDoodleStyle),
    negativePrompts: ['serious', 'formal', 'dark', 'heavy', 'realistic', 'photographic', 'complex'],
  },
};

/**
 * Get style modifiers for a specific template
 */
export function getTemplateModifiers(templateId: string): string[] {
  return TEMPLATE_IMAGE_CONFIGS[templateId]?.styleModifiers || [];
}

/**
 * Build the final image prompt by combining:
 * 1. Subject prompt (what to draw)
 * 2. Base style modifiers (FORM - how it looks structurally)
 * 3. Holiday overlay (PALETTE/MOOD - color and emotional treatment)
 * 4. Position modifiers
 * 5. Quality enhancers
 *
 * Layer composition: Base Style (form) + Holiday Overlay (palette/mood) + Vibe (intensity)
 */
export function buildImagePrompt(
  subjectPrompt: string,
  templateId: string,
  position: 'front' | 'back',
  answers?: Record<string, unknown>,
  coverTextPreference?: 'text-on-image' | 'design-only' | null
): string {
  const config = TEMPLATE_IMAGE_CONFIGS[templateId];
  const positionMods = POSITION_MODIFIERS[position];

  // Build placeholder context from user answers
  const context = buildPlaceholderContext(answers || {}, subjectPrompt);

  // Detect holiday from answers
  const holidayId = mapSpecialDayToHolidayId(
    (answers?.specialDay as string) || (answers?.lifeEvent as string) || ''
  );

  // Resolve any conflicts between holiday and sensitive occasions
  const conflictResolution = resolveHolidayConflict(holidayId, answers || {});

  const parts: string[] = [subjectPrompt];

  // LAYER 1: Base Style Modifiers (FORM)
  // These control the structural/artistic style
  if (config?.styleModifiers) {
    let styleString = config.styleModifiers.join(', ');
    styleString = replacePlaceholders(styleString, context);
    if (styleString) {
      parts.push(styleString);
    }
  }

  // LAYER 2: Holiday Overlay (PALETTE/MOOD)
  // These modify color and emotional treatment WITHOUT changing form
  if (conflictResolution.resolvedOverlay?.visualTreatment) {
    parts.push(conflictResolution.resolvedOverlay.visualTreatment);
  }

  // LAYER 3: Position-specific modifiers
  parts.push(positionMods.join(', '));

  // Add cover text preference for front only
  if (position === 'front' && coverTextPreference) {
    parts.push(COVER_TEXT_MODIFIERS[coverTextPreference]);
  }

  // Add quality enhancers
  parts.push(IMAGE_BASE_SETTINGS.quality);
  parts.push(IMAGE_BASE_SETTINGS.lighting);
  parts.push(IMAGE_BASE_SETTINGS.aesthetic);

  // Always add no-text instruction last (important constraint)
  parts.push(IMAGE_BASE_SETTINGS.noText);

  return parts.join(', ');
}

/**
 * Get fallback prompts when image generation fails
 */
export function getFallbackPrompts(
  position: 'front' | 'back',
  occasion?: string
): string[] {
  const occasionContext = occasion || 'this special moment';

  if (position === 'front') {
    return [
      `A single meaningful object symbolizing ${occasionContext}, thoughtfully arranged`,
      `A warm, minimalist scene that reflects quiet connection and care`,
    ];
  }

  return [
    'Subtle abstract shapes with generous negative space and soft texture',
    'A gentle gradient wash with faint organic patterns and calm movement',
  ];
}

/**
 * Build negative prompt for image generation
 * Combines template negatives with holiday avoid list and conflict negatives
 */
export function buildNegativePrompt(
  templateId: string,
  answers?: Record<string, unknown>
): string {
  const config = TEMPLATE_IMAGE_CONFIGS[templateId];
  const negatives: string[] = [];

  // Add template-specific negatives
  if (config?.negativePrompts) {
    negatives.push(...config.negativePrompts);
  }

  // Add holiday-specific avoid list and conflict negatives
  const holidayId = mapSpecialDayToHolidayId(
    (answers?.specialDay as string) || ''
  );

  if (holidayId) {
    const conflictResolution = resolveHolidayConflict(holidayId, answers || {});
    negatives.push(...conflictResolution.additionalNegatives);
  }

  // Always add text-related negatives
  negatives.push('text', 'lettering', 'typography', 'words', 'numbers', 'watermarks');

  // Deduplicate
  const unique = [...new Set(negatives)];

  return unique.join(', ');
}

/**
 * Get the effective template ID after conflict resolution
 * May override the user's selection if conflict rules apply
 */
export function getEffectiveTemplateId(
  requestedTemplateId: string,
  answers: Record<string, unknown>
): { templateId: string; wasOverridden: boolean; reason?: string } {
  const holidayId = mapSpecialDayToHolidayId(
    (answers?.specialDay as string) || ''
  );

  if (!holidayId) {
    return { templateId: requestedTemplateId, wasOverridden: false };
  }

  const resolution = resolveHolidayConflict(holidayId, answers);

  if (resolution.hasConflict && resolution.forcedTemplateId) {
    return {
      templateId: resolution.forcedTemplateId,
      wasOverridden: true,
      reason: resolution.explanation,
    };
  }

  return { templateId: requestedTemplateId, wasOverridden: false };
}

/**
 * Get holiday overlay information for display/debugging
 */
export function getHolidayOverlayInfo(answers: Record<string, unknown>): {
  holidayId: HolidayId | null;
  overlay: ReturnType<typeof getHolidayOverlay>;
  conflictResolution: ReturnType<typeof resolveHolidayConflict>;
} {
  const holidayId = mapSpecialDayToHolidayId(
    (answers?.specialDay as string) || ''
  );

  return {
    holidayId,
    overlay: holidayId ? getHolidayOverlay(holidayId) : null,
    conflictResolution: resolveHolidayConflict(holidayId, answers),
  };
}
