// Re-export all types
export * from './types';

// Re-export text prompts
export {
  CARDWRITER_SYSTEM_PROMPT,
  TEXT_SYSTEM_PROMPTS,
  BANNED_PHRASES,
  getTextSystemPrompt,
} from './textPrompts';

// Re-export image prompts
export {
  IMAGE_BASE_SETTINGS,
  POSITION_MODIFIERS,
  COVER_TEXT_MODIFIERS,
  TEMPLATE_IMAGE_CONFIGS,
  getTemplateModifiers,
  buildImagePrompt,
  buildStaticImagePrompt,
  getFallbackPrompts,
  buildNegativePrompt,
  getEffectiveTemplateId,
  getHolidayOverlayInfo,
} from './imagePrompts';

// Re-export static subjects
export {
  STATIC_SUBJECTS,
  getStaticSubjects,
  getSubjectPrompt,
} from './staticSubjects';

// Re-export color palettes
export {
  VIBE_PALETTES,
  HOLIDAY_PALETTES,
  DEFAULT_PALETTE,
  resolveColorPalette,
  getColorPaletteModifier,
} from './colorPalettes';

// Re-export holiday overlay system
export {
  parseHolidayOverlay,
  getAllHolidayOverlays,
  getHolidayOverlay,
  mapSpecialDayToHolidayId,
  styleNameToId,
  getHolidayRecommendedStyles,
} from './holidayOverlays';

export { resolveHolidayConflict, wouldForceTemplate } from './holidayConflictResolver';

// Re-export template/design prompts
export {
  TEMPLATE_GENERATION_INSTRUCTION,
  ART_DIRECTION_INSTRUCTION,
  CONTEXT_OVERRIDES,
  getArtDirectionInstruction,
  buildDesignPrompt,
  buildArtPromptContext,
} from './templatePrompts';

// Re-export placeholder utilities
export {
  replacePlaceholders,
  buildPlaceholderContext,
  buildColorPaletteContext,
  hasPlaceholders,
  getPlaceholderKeys,
} from './placeholderUtils';
