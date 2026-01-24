/**
 * Deterministic Vibe-to-Style Mapping
 *
 * This module provides a table-based lookup for mapping vibe combinations
 * to allowed art styles and message constraints. This replaces the prose-based
 * logic in designSystem.ts for more consistent, predictable regeneration.
 */

// All available vibes from constants.ts
export type Vibe =
  | 'Funny'
  | 'Heartfelt'
  | 'Spicy'
  | 'Weird'
  | 'Grateful'
  | 'Nostalgic'
  | 'Encouraging'
  | 'Apologetic'
  | 'Proud'
  | 'Playful';

// All available design template IDs from designSystem.ts
export type DesignTemplateId =
  | 'floral_whisper'
  | 'textural_motif'
  | 'icon_study'
  | 'single_line'
  | 'painterly_horizon'
  | 'lyrical_abstract'
  | 'negative_space'
  | 'botanical_silhouette'
  | 'geometric_poise'
  | 'collage_reverie'
  | 'letterpress_minimal'
  | 'night_sky_quiet'
  | 'playful_doodle';

/**
 * Vibe combination key (normalized, sorted alphabetically)
 * Single vibe: "Funny"
 * Combo: "Funny+Heartfelt"
 */
export type VibeComboKey = string;

/**
 * Art style constraints for a vibe combination
 */
export interface StyleConstraints {
  /** Primary allowed design template (always used first) */
  primaryStyle: DesignTemplateId;
  /** Secondary allowed design template (fallback or alternative) */
  secondaryStyle: DesignTemplateId;
  /** Fallback if neither primary nor secondary is available */
  fallbackStyle: DesignTemplateId;
}

/**
 * Message generation constraints for a vibe combination
 */
export interface MessageConstraints {
  /** 0-10 scale: 0=no humor, 10=full comedy */
  humorLevel: number;
  /** 0-10 scale: 0=professional distance, 10=deeply intimate */
  warmthLevel: number;
  /** Suggested message length range in characters */
  lengthRange: { min: number; max: number };
  /** Tone keywords to encourage in generation */
  toneKeywords: string[];
  /** Phrases/patterns to avoid (soft bans - flag but don't hard reject) */
  softBans: string[];
  /** Hard bans - message MUST NOT contain these */
  hardBans: string[];
}

/**
 * Complete vibe mapping entry
 */
export interface VibeMappingEntry {
  vibeCombo: VibeComboKey;
  styleConstraints: StyleConstraints;
  messageConstraints: MessageConstraints;
}

/**
 * The master mapping table - single source of truth for vibe→style mapping
 *
 * Design philosophy:
 * - Funny vibes → icon_study (bold objects), collage_reverie (playful chaos)
 * - Heartfelt vibes → floral_whisper (soft), single_line (intimate)
 * - Apologetic vibes → negative_space (humble), botanical_silhouette (quiet)
 * - Encouraging vibes → painterly_horizon (hope), lyrical_abstract (flow)
 * - Nostalgic vibes → textural_motif (tactile), collage_reverie (vintage)
 * - Proud vibes → geometric_poise (celebration), icon_study (achievement)
 */
export const VIBE_STYLE_MAPPING: Record<VibeComboKey, VibeMappingEntry> = {
  // ============================================
  // SINGLE VIBES
  // ============================================

  'Funny': {
    vibeCombo: 'Funny',
    styleConstraints: {
      primaryStyle: 'icon_study',
      secondaryStyle: 'collage_reverie',
      fallbackStyle: 'geometric_poise',
    },
    messageConstraints: {
      humorLevel: 8,
      warmthLevel: 5,
      lengthRange: { min: 40, max: 200 },
      toneKeywords: ['playful', 'witty', 'light', 'fun', 'teasing'],
      softBans: ['serious', 'somber', 'heavy'],
      hardBans: [],
    },
  },

  'Heartfelt': {
    vibeCombo: 'Heartfelt',
    styleConstraints: {
      primaryStyle: 'floral_whisper',
      secondaryStyle: 'single_line',
      fallbackStyle: 'lyrical_abstract',
    },
    messageConstraints: {
      humorLevel: 2,
      warmthLevel: 9,
      lengthRange: { min: 80, max: 400 },
      toneKeywords: ['sincere', 'tender', 'meaningful', 'deep', 'genuine'],
      softBans: ['joke', 'lol', 'haha', 'rofl'],
      hardBans: [],
    },
  },

  'Spicy': {
    vibeCombo: 'Spicy',
    styleConstraints: {
      primaryStyle: 'single_line',
      secondaryStyle: 'negative_space',
      fallbackStyle: 'lyrical_abstract',
    },
    messageConstraints: {
      humorLevel: 3,
      warmthLevel: 8,
      lengthRange: { min: 40, max: 200 },
      toneKeywords: ['flirty', 'bold', 'intimate', 'suggestive', 'confident'],
      softBans: ['formal', 'distant', 'professional'],
      hardBans: [],
    },
  },

  'Weird': {
    vibeCombo: 'Weird',
    styleConstraints: {
      primaryStyle: 'collage_reverie',
      secondaryStyle: 'lyrical_abstract',
      fallbackStyle: 'icon_study',
    },
    messageConstraints: {
      humorLevel: 6,
      warmthLevel: 4,
      lengthRange: { min: 40, max: 250 },
      toneKeywords: ['absurd', 'quirky', 'unexpected', 'surreal', 'offbeat'],
      softBans: ['cliche', 'standard', 'typical'],
      hardBans: [],
    },
  },

  'Grateful': {
    vibeCombo: 'Grateful',
    styleConstraints: {
      primaryStyle: 'letterpress_minimal',
      secondaryStyle: 'botanical_silhouette',
      fallbackStyle: 'textural_motif',
    },
    messageConstraints: {
      humorLevel: 2,
      warmthLevel: 8,
      lengthRange: { min: 60, max: 350 },
      toneKeywords: ['appreciative', 'thankful', 'warm', 'specific', 'genuine'],
      softBans: ['generic thanks', 'obligatory'],
      hardBans: [],
    },
  },

  'Nostalgic': {
    vibeCombo: 'Nostalgic',
    styleConstraints: {
      primaryStyle: 'textural_motif',
      secondaryStyle: 'collage_reverie',
      fallbackStyle: 'floral_whisper',
    },
    messageConstraints: {
      humorLevel: 3,
      warmthLevel: 7,
      lengthRange: { min: 80, max: 400 },
      toneKeywords: ['memories', 'reminiscent', 'wistful', 'reflective', 'timeless'],
      softBans: ['future-focused', 'forward-looking'],
      hardBans: [],
    },
  },

  'Encouraging': {
    vibeCombo: 'Encouraging',
    styleConstraints: {
      primaryStyle: 'painterly_horizon',
      secondaryStyle: 'lyrical_abstract',
      fallbackStyle: 'geometric_poise',
    },
    messageConstraints: {
      humorLevel: 3,
      warmthLevel: 8,
      lengthRange: { min: 60, max: 300 },
      toneKeywords: ['hopeful', 'supportive', 'uplifting', 'strength', 'believing'],
      softBans: ['pessimistic', 'doubtful'],
      hardBans: [],
    },
  },

  'Apologetic': {
    vibeCombo: 'Apologetic',
    styleConstraints: {
      primaryStyle: 'letterpress_minimal',
      secondaryStyle: 'negative_space',
      fallbackStyle: 'botanical_silhouette',
    },
    messageConstraints: {
      humorLevel: 0,
      warmthLevel: 6,
      lengthRange: { min: 80, max: 350 },
      toneKeywords: ['sincere', 'humble', 'accountable', 'genuine', 'repair'],
      softBans: ['joke', 'funny', 'light'],
      hardBans: ['but', 'however', 'although', 'excuse'],
    },
  },

  'Proud': {
    vibeCombo: 'Proud',
    styleConstraints: {
      primaryStyle: 'geometric_poise',
      secondaryStyle: 'icon_study',
      fallbackStyle: 'collage_reverie',
    },
    messageConstraints: {
      humorLevel: 4,
      warmthLevel: 7,
      lengthRange: { min: 60, max: 300 },
      toneKeywords: ['celebration', 'achievement', 'admiration', 'impressed', 'honored'],
      softBans: ['downplaying', 'modest'],
      hardBans: [],
    },
  },

  'Playful': {
    vibeCombo: 'Playful',
    styleConstraints: {
      primaryStyle: 'playful_doodle',
      secondaryStyle: 'collage_reverie',
      fallbackStyle: 'icon_study',
    },
    messageConstraints: {
      humorLevel: 7,
      warmthLevel: 6,
      lengthRange: { min: 40, max: 200 },
      toneKeywords: ['fun', 'light', 'cheerful', 'energetic', 'mischievous'],
      softBans: ['serious', 'formal'],
      hardBans: [],
    },
  },

  // ============================================
  // COMMON VIBE COMBINATIONS (sorted alphabetically)
  // ============================================

  'Apologetic+Heartfelt': {
    vibeCombo: 'Apologetic+Heartfelt',
    styleConstraints: {
      primaryStyle: 'letterpress_minimal',
      secondaryStyle: 'floral_whisper',
      fallbackStyle: 'negative_space',
    },
    messageConstraints: {
      humorLevel: 0,
      warmthLevel: 7,
      lengthRange: { min: 100, max: 400 },
      toneKeywords: ['sincere', 'vulnerable', 'genuine', 'humble', 'caring'],
      softBans: ['defensive', 'explaining'],
      hardBans: ['but', 'however', 'you should'],
    },
  },

  'Encouraging+Heartfelt': {
    vibeCombo: 'Encouraging+Heartfelt',
    styleConstraints: {
      primaryStyle: 'painterly_horizon',
      secondaryStyle: 'floral_whisper',
      fallbackStyle: 'lyrical_abstract',
    },
    messageConstraints: {
      humorLevel: 2,
      warmthLevel: 9,
      lengthRange: { min: 80, max: 400 },
      toneKeywords: ['uplifting', 'warm', 'supportive', 'believing', 'tender'],
      softBans: ['preachy', 'lecturing'],
      hardBans: [],
    },
  },

  'Funny+Heartfelt': {
    vibeCombo: 'Funny+Heartfelt',
    styleConstraints: {
      primaryStyle: 'icon_study',
      secondaryStyle: 'floral_whisper',
      fallbackStyle: 'collage_reverie',
    },
    messageConstraints: {
      humorLevel: 5,
      warmthLevel: 7,
      lengthRange: { min: 60, max: 300 },
      toneKeywords: ['warm humor', 'affectionate', 'gentle wit', 'loving tease'],
      softBans: ['mean', 'cutting', 'sarcastic'],
      hardBans: [],
    },
  },

  'Funny+Nostalgic': {
    vibeCombo: 'Funny+Nostalgic',
    styleConstraints: {
      primaryStyle: 'collage_reverie',
      secondaryStyle: 'textural_motif',
      fallbackStyle: 'icon_study',
    },
    messageConstraints: {
      humorLevel: 6,
      warmthLevel: 6,
      lengthRange: { min: 60, max: 300 },
      toneKeywords: ['reminiscing', 'playful memories', 'throwback', 'inside joke'],
      softBans: ['serious', 'heavy'],
      hardBans: [],
    },
  },

  'Funny+Playful': {
    vibeCombo: 'Funny+Playful',
    styleConstraints: {
      primaryStyle: 'playful_doodle',
      secondaryStyle: 'icon_study',
      fallbackStyle: 'collage_reverie',
    },
    messageConstraints: {
      humorLevel: 9,
      warmthLevel: 5,
      lengthRange: { min: 40, max: 180 },
      toneKeywords: ['silly', 'fun', 'energetic', 'teasing', 'goofy'],
      softBans: ['serious', 'deep'],
      hardBans: [],
    },
  },

  'Funny+Proud': {
    vibeCombo: 'Funny+Proud',
    styleConstraints: {
      primaryStyle: 'geometric_poise',
      secondaryStyle: 'icon_study',
      fallbackStyle: 'collage_reverie',
    },
    messageConstraints: {
      humorLevel: 6,
      warmthLevel: 6,
      lengthRange: { min: 50, max: 250 },
      toneKeywords: ['celebratory', 'playful pride', 'light roast', 'impressed'],
      softBans: ['mocking', 'dismissive'],
      hardBans: [],
    },
  },

  'Funny+Weird': {
    vibeCombo: 'Funny+Weird',
    styleConstraints: {
      primaryStyle: 'collage_reverie',
      secondaryStyle: 'lyrical_abstract',
      fallbackStyle: 'icon_study',
    },
    messageConstraints: {
      humorLevel: 8,
      warmthLevel: 3,
      lengthRange: { min: 40, max: 200 },
      toneKeywords: ['absurdist', 'surreal', 'quirky', 'unexpected', 'strange'],
      softBans: ['conventional', 'normal'],
      hardBans: [],
    },
  },

  'Grateful+Heartfelt': {
    vibeCombo: 'Grateful+Heartfelt',
    styleConstraints: {
      primaryStyle: 'floral_whisper',
      secondaryStyle: 'botanical_silhouette',
      fallbackStyle: 'textural_motif',
    },
    messageConstraints: {
      humorLevel: 1,
      warmthLevel: 9,
      lengthRange: { min: 80, max: 400 },
      toneKeywords: ['deep appreciation', 'meaningful', 'specific thanks', 'touched'],
      softBans: ['generic', 'obligatory'],
      hardBans: [],
    },
  },

  'Heartfelt+Nostalgic': {
    vibeCombo: 'Heartfelt+Nostalgic',
    styleConstraints: {
      primaryStyle: 'textural_motif',
      secondaryStyle: 'single_line',
      fallbackStyle: 'floral_whisper',
    },
    messageConstraints: {
      humorLevel: 2,
      warmthLevel: 8,
      lengthRange: { min: 100, max: 450 },
      toneKeywords: ['memories', 'tender', 'reflecting', 'cherished', 'timeless'],
      softBans: ['rushed', 'forward-only'],
      hardBans: [],
    },
  },

  'Heartfelt+Proud': {
    vibeCombo: 'Heartfelt+Proud',
    styleConstraints: {
      primaryStyle: 'geometric_poise',
      secondaryStyle: 'floral_whisper',
      fallbackStyle: 'painterly_horizon',
    },
    messageConstraints: {
      humorLevel: 2,
      warmthLevel: 8,
      lengthRange: { min: 80, max: 350 },
      toneKeywords: ['admiration', 'celebration', 'deep pride', 'moved', 'inspired'],
      softBans: ['casual', 'flippant'],
      hardBans: [],
    },
  },

  'Playful+Spicy': {
    vibeCombo: 'Playful+Spicy',
    styleConstraints: {
      primaryStyle: 'single_line',
      secondaryStyle: 'negative_space',
      fallbackStyle: 'lyrical_abstract',
    },
    messageConstraints: {
      humorLevel: 5,
      warmthLevel: 7,
      lengthRange: { min: 40, max: 180 },
      toneKeywords: ['flirty', 'teasing', 'cheeky', 'fun', 'suggestive'],
      softBans: ['formal', 'distant'],
      hardBans: [],
    },
  },

  'Proud+Grateful': {
    vibeCombo: 'Grateful+Proud',
    styleConstraints: {
      primaryStyle: 'botanical_silhouette',
      secondaryStyle: 'geometric_poise',
      fallbackStyle: 'textural_motif',
    },
    messageConstraints: {
      humorLevel: 2,
      warmthLevel: 8,
      lengthRange: { min: 80, max: 350 },
      toneKeywords: ['honored', 'thankful', 'admiration', 'appreciation', 'impressed'],
      softBans: ['casual', 'generic'],
      hardBans: [],
    },
  },
};

/**
 * Normalize vibe array to canonical combo key
 * Sorts alphabetically and joins with '+'
 */
export function normalizeVibeCombo(vibes: string[]): VibeComboKey {
  if (!vibes || vibes.length === 0) {
    return 'Heartfelt'; // Default
  }
  const validVibes = vibes.filter(v => v && typeof v === 'string');
  if (validVibes.length === 0) {
    return 'Heartfelt';
  }
  const sorted = [...validVibes].sort();
  return sorted.join('+');
}

/**
 * Get mapping for a vibe combination
 * Falls back to primary vibe if combo not found, then to Heartfelt
 */
export function getVibeMapping(vibes: string[]): VibeMappingEntry {
  const combo = normalizeVibeCombo(vibes);

  // Try exact match
  if (VIBE_STYLE_MAPPING[combo]) {
    return VIBE_STYLE_MAPPING[combo];
  }

  // Fall back to first vibe only
  const primaryVibe = vibes[0] || 'Heartfelt';
  if (VIBE_STYLE_MAPPING[primaryVibe]) {
    return VIBE_STYLE_MAPPING[primaryVibe];
  }

  // Ultimate fallback
  return VIBE_STYLE_MAPPING['Heartfelt'];
}

/**
 * Get allowed styles for a vibe combination (ordered by preference)
 */
export function getAllowedStyles(vibes: string[]): DesignTemplateId[] {
  const mapping = getVibeMapping(vibes);
  return [
    mapping.styleConstraints.primaryStyle,
    mapping.styleConstraints.secondaryStyle,
    mapping.styleConstraints.fallbackStyle,
  ];
}

/**
 * Get message constraints for a vibe combination
 */
export function getMessageConstraints(vibes: string[]): MessageConstraints {
  const mapping = getVibeMapping(vibes);
  return mapping.messageConstraints;
}

/**
 * Check if a message contains any hard-banned phrases for the given vibes
 */
export function checkHardBans(message: string, vibes: string[]): { hasBan: boolean; bannedPhrase?: string } {
  const constraints = getMessageConstraints(vibes);
  const lowerMessage = message.toLowerCase();

  for (const ban of constraints.hardBans) {
    if (lowerMessage.includes(ban.toLowerCase())) {
      return { hasBan: true, bannedPhrase: ban };
    }
  }

  return { hasBan: false };
}

/**
 * Check if a message contains any soft-banned phrases for the given vibes
 */
export function checkSoftBans(message: string, vibes: string[]): string[] {
  const constraints = getMessageConstraints(vibes);
  const lowerMessage = message.toLowerCase();

  return constraints.softBans.filter(ban =>
    lowerMessage.includes(ban.toLowerCase())
  );
}

/**
 * Get prompt instructions based on vibe constraints
 */
export function getVibePromptInstructions(vibes: string[]): string {
  const mapping = getVibeMapping(vibes);
  const constraints = mapping.messageConstraints;

  const humorDescription = constraints.humorLevel <= 2
    ? 'Keep serious, minimal to no humor'
    : constraints.humorLevel <= 5
    ? 'Light humor OK, but not the focus'
    : constraints.humorLevel <= 7
    ? 'Be playful and fun'
    : 'Lean into humor, be funny';

  const warmthDescription = constraints.warmthLevel <= 3
    ? 'Keep professional distance'
    : constraints.warmthLevel <= 6
    ? 'Warm but not overly intimate'
    : constraints.warmthLevel <= 8
    ? 'Emotionally warm and personal'
    : 'Deeply intimate and heartfelt';

  return `
MESSAGE CONSTRAINTS (from vibe "${mapping.vibeCombo}"):
- Humor: ${humorDescription} (${constraints.humorLevel}/10)
- Warmth: ${warmthDescription} (${constraints.warmthLevel}/10)
- Target Length: ${constraints.lengthRange.min}-${constraints.lengthRange.max} characters
- Encouraged Tone: ${constraints.toneKeywords.join(', ')}
${constraints.softBans.length > 0 ? `- AVOID these tones: ${constraints.softBans.join(', ')}` : ''}
${constraints.hardBans.length > 0 ? `- NEVER use: ${constraints.hardBans.join(', ')}` : ''}
`.trim();
}
