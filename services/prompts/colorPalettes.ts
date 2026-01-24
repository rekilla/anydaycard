/**
 * Color palette system for card design
 * Vibe and holiday determine color treatment, not subject matter
 *
 * Holiday palettes override vibe palettes when present
 */

export interface ColorPalette {
  name: string;
  promptModifier: string; // Injected as {{colorPalette}} in style templates
}

/**
 * Vibe-based color palettes (10 vibes)
 * Keys match vibe values from the wizard
 */
export const VIBE_PALETTES: Record<string, ColorPalette> = {
  Heartfelt: {
    name: 'Warm Embrace',
    promptModifier: 'warm color palette with dusty rose, cream, soft terracotta, and muted gold tones, emotionally sincere and tender atmosphere',
  },
  Funny: {
    name: 'Playful Pop',
    promptModifier: 'cheerful bright color palette with sunny yellow, coral, mint green, and sky blue accents, playful energetic mood',
  },
  Spicy: {
    name: 'Bold Heat',
    promptModifier: 'bold color palette with deep crimson, burnt orange, warm black, and gold accents, confident passionate atmosphere',
  },
  Weird: {
    name: 'Quirky Charm',
    promptModifier: 'unexpected color palette with muted purple, olive green, dusty pink, and ochre, charmingly offbeat mood',
  },
  Grateful: {
    name: 'Thankful Warmth',
    promptModifier: 'rich color palette with warm amber, sage green, cream, and soft brown tones, genuine appreciative atmosphere',
  },
  Nostalgic: {
    name: 'Vintage Memory',
    promptModifier: 'vintage color palette with sepia, faded rose, dusty blue, and antique cream tones, warmly nostalgic mood',
  },
  Encouraging: {
    name: 'Uplifting Light',
    promptModifier: 'uplifting color palette with soft peach, warm white, gentle yellow, and sky blue, hopeful supportive atmosphere',
  },
  Apologetic: {
    name: 'Humble Quiet',
    promptModifier: 'subdued color palette with soft gray, muted sage, pale lavender, and quiet cream tones, humble sincere atmosphere',
  },
  Proud: {
    name: 'Celebratory Gold',
    promptModifier: 'rich color palette with deep navy, warm gold, cream, and burgundy accents, dignified celebratory mood',
  },
  Playful: {
    name: 'Joyful Bright',
    promptModifier: 'bright color palette with coral pink, turquoise, sunny yellow, and fresh white, joyful lighthearted energy',
  },
};

/**
 * Holiday-based color palettes (9 holidays)
 * Keys match holiday IDs from holidayOverlays.ts
 */
export const HOLIDAY_PALETTES: Record<string, ColorPalette> = {
  valentines_day: {
    name: 'Romantic Rose',
    promptModifier: 'romantic color palette with soft blush pink, warm cream, muted rose, and gentle mauve tones, intimate and tender not cliche',
  },
  mothers_day: {
    name: 'Soft Bloom',
    promptModifier: 'gentle color palette with soft pink, lavender, cream, and sage green tones, warm nurturing feminine energy',
  },
  fathers_day: {
    name: 'Steady Warmth',
    promptModifier: 'grounded color palette with navy blue, warm tan, forest green, and cream tones, steady dependable warmth',
  },
  christmas: {
    name: 'Elegant Winter',
    promptModifier: 'elegant color palette with forest green, deep burgundy, warm gold, and cream accents, sophisticated holiday warmth',
  },
  hanukkah: {
    name: 'Festival Light',
    promptModifier: 'luminous color palette with deep blue, silver, white, and warm gold tones, radiant peaceful celebration',
  },
  new_year: {
    name: 'Fresh Start',
    promptModifier: 'sparkling color palette with midnight blue, champagne gold, silver, and crisp white, celebratory hopeful energy',
  },
  thanksgiving: {
    name: 'Harvest Warmth',
    promptModifier: 'rich color palette with burnt orange, deep red, golden yellow, and warm brown tones, abundant grateful atmosphere',
  },
  easter: {
    name: 'Spring Renewal',
    promptModifier: 'fresh color palette with soft lavender, pale yellow, mint green, and blush pink, gentle spring renewal energy',
  },
  other: {
    name: 'Universal Warmth',
    promptModifier: 'balanced warm color palette with soft neutrals, muted earth tones, and gentle warmth',
  },
};

/**
 * Default palette when no vibe or holiday matches
 */
export const DEFAULT_PALETTE: ColorPalette = {
  name: 'Gentle Neutral',
  promptModifier: 'soft neutral color palette with warm cream, gentle gray, and muted earth tones, universally appealing warmth',
};

/**
 * Resolve final color palette based on vibe + holiday
 * Holiday takes precedence when present
 *
 * @param vibes - Array of vibes from wizard (primary vibe is first)
 * @param holidayId - Holiday ID if applicable (from mapSpecialDayToHolidayId)
 * @returns Resolved color palette
 */
export function resolveColorPalette(
  vibes: string[],
  holidayId: string | null
): ColorPalette {
  // Holiday override takes precedence
  if (holidayId && HOLIDAY_PALETTES[holidayId]) {
    return HOLIDAY_PALETTES[holidayId];
  }

  // Use primary vibe palette
  const primaryVibe = vibes[0];
  if (primaryVibe && VIBE_PALETTES[primaryVibe]) {
    return VIBE_PALETTES[primaryVibe];
  }

  // Fallback to default
  return DEFAULT_PALETTE;
}

/**
 * Get color palette prompt modifier string
 * Convenience function for direct injection into prompts
 */
export function getColorPaletteModifier(
  vibes: string[],
  holidayId: string | null
): string {
  const palette = resolveColorPalette(vibes, holidayId);
  return palette.promptModifier;
}
