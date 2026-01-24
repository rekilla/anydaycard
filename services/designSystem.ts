import { getVibeMapping, getAllowedStyles } from './vibeStyleMapping';
import {
  mapSpecialDayToHolidayId,
  getHolidayOverlay,
  getHolidayRecommendedStyles,
  resolveHolidayConflict,
  HolidayId,
} from './prompts';

export interface DesignStarter {
  id: string;
  name: string;
  description: string; // Context for the Text LLM
  imagePromptSuffix: string; // Technical keywords for the Image Model
}

export const DESIGN_STARTERS: Record<string, DesignStarter> = {
  floral_whisper: {
    id: 'floral_whisper',
    name: 'Floral Whisper',
    description: 'Soft, watercolor-style florals, organic shapes, gentle nature motifs. Ideally minimal subject matter focused on nature.',
    imagePromptSuffix: 'watercolor style, soft edges, pastel colors, organic composition, botanical illustration, white background, high quality, soft lighting, greeting card aesthetic'
  },
  textural_motif: {
    id: 'textural_motif',
    name: 'Textural Motif',
    description: 'Rich paper textures, fabric patterns, tactile feel, close-up details. Focus on patterns or textured objects.',
    imagePromptSuffix: 'macro photography style, textured paper background, tactile details, rich depth, elegant pattern, craft aesthetic, high resolution'
  },
  icon_study: {
    id: 'icon_study',
    name: 'Icon Study',
    description: 'A single meaningful object centered in the frame, minimalist. Great for representing specific inside jokes or objects.',
    imagePromptSuffix: 'minimalist vector illustration, single centered object, clean solid background, flat design, bold simplicity, modern graphic'
  },
  single_line: {
    id: 'single_line',
    name: 'Single Line Emotion',
    description: 'Continuous line drawing, abstract and intimate. Focus on hands, faces, or connecting shapes.',
    imagePromptSuffix: 'continuous line drawing, picasso style, minimalist sketch, black ink on cream paper, elegant curves, abstract art, sophisticated'
  },
  painterly_horizon: {
    id: 'painterly_horizon',
    name: 'Painterly Horizon',
    description: 'Abstract landscapes, broad brushstrokes, hope and forward motion. Focus on skies, horizons, or paths.',
    imagePromptSuffix: 'impressionist oil painting, broad brushstrokes, abstract landscape, soft gradient sky, hopeful atmosphere, artistic texture, thick paint'
  },
  lyrical_abstract: {
    id: 'lyrical_abstract',
    name: 'Lyrical Abstract',
    description: 'Fluid shapes, alcohol ink style, emotional flow. Non-representational emotional colors.',
    imagePromptSuffix: 'alcohol ink art, fluid shapes, dreamlike, ethereal, flowing colors, abstract expressionism, soft transitions, no specific objects'
  },
  negative_space: {
    id: 'negative_space',
    name: 'Negative Space Revelation',
    description: 'High contrast, silhouette, large empty areas. Focus on a small, poignant detail emerging from space.',
    imagePromptSuffix: 'high contrast silhouette, dramatic lighting, large negative space, minimalist composition, powerful simplicity, elegant'
  },
  botanical_silhouette: {
    id: 'botanical_silhouette',
    name: 'Botanical Silhouette',
    description: 'Dark natural shapes against light background, quiet and respectful. Focus on shadows and leaf patterns.',
    imagePromptSuffix: 'botanical silhouette, shadow play, nature inspired, monochromatic, elegant, calm composition, organic shapes'
  },
  geometric_poise: {
    id: 'geometric_poise',
    name: 'Geometric Poise',
    description: 'Bold geometric shapes, modern, celebration. Focus on confetti, shapes, or structured patterns.',
    imagePromptSuffix: 'bauhaus style, geometric shapes, bold colors, modern graphic design, balanced composition, abstract celebration, vector art'
  },
  collage_reverie: {
    id: 'collage_reverie',
    name: 'Collage Reverie',
    description: 'Mixed media style, torn paper edges, vintage feel. Great for nostalgia and storytelling.',
    imagePromptSuffix: 'mixed media collage, torn paper texture, vintage aesthetic, layered composition, artistic scrapbooking style, analog feel'
  },
  letterpress_minimal: {
    id: 'letterpress_minimal',
    name: 'Letterpress Minimal',
    description: 'Premium letterpress aesthetic with deep impression on thick paper. Single muted color, abundant negative space, timeless and serious. Best for sincere gratitude, apologies requiring ownership, and professional occasions.',
    imagePromptSuffix: 'letterpress printing style, debossed impression, thick cotton paper, single ink color, cream background, minimal design, elegant simplicity, print craftsmanship'
  },
  night_sky_quiet: {
    id: 'night_sky_quiet',
    name: 'Night Sky Quiet',
    description: 'Serene constellation art with deep blues and gentle starlight. Evokes presence across distance, patience, and comfort. Best for missing someone, get well wishes, and encouragement during difficult times.',
    imagePromptSuffix: 'night sky illustration, constellation pattern, deep indigo blue, scattered stars, watercolor style, cosmic atmosphere, quiet and vast, comforting presence'
  },
  playful_doodle: {
    id: 'playful_doodle',
    name: 'Playful Doodle',
    description: 'Charming hand-drawn sketches with abundant white space. Light humor, human and imperfect. Best for just because notes, casual celebrations, friend cards with funny vibes, and early dating.',
    imagePromptSuffix: 'hand-drawn doodle illustration, pen sketch style, lots of white space, whimsical marginalia, simple line art, cheerful and light, notebook aesthetic'
  }
};

export type CardCategoryId =
  | 'love_romance'
  | 'encouragement_support'
  | 'apology'
  | 'gratitude'
  | 'celebration'
  | 'missing_you'
  | 'get_well'
  | 'just_because';

export interface CardCategory {
  id: CardCategoryId;
  label: string;
  description: string;
  templateIds: string[];
}

export const CARD_CATEGORIES: Record<CardCategoryId, CardCategory> = {
  love_romance: {
    id: 'love_romance',
    label: 'Love & Romance',
    description: 'Tender, intimate, and emotionally warm designs.',
    templateIds: ['floral_whisper', 'textural_motif', 'icon_study', 'single_line', 'night_sky_quiet'],
  },
  encouragement_support: {
    id: 'encouragement_support',
    label: 'Encouragement & Support',
    description: 'Hopeful, steady, and uplifting visuals.',
    templateIds: ['night_sky_quiet', 'painterly_horizon', 'lyrical_abstract', 'letterpress_minimal', 'icon_study', 'negative_space'],
  },
  apology: {
    id: 'apology',
    label: 'Apology / I Messed Up',
    description: 'Soft, quiet, and respectful repair.',
    templateIds: ['letterpress_minimal', 'floral_whisper', 'botanical_silhouette', 'lyrical_abstract', 'negative_space'],
  },
  gratitude: {
    id: 'gratitude',
    label: 'Gratitude / Thank You',
    description: 'Thoughtful, crafted, and appreciative.',
    templateIds: ['letterpress_minimal', 'botanical_silhouette', 'textural_motif', 'floral_whisper', 'icon_study'],
  },
  celebration: {
    id: 'celebration',
    label: 'Celebration (Birthday / Milestones)',
    description: 'Bright, lively, and celebratory energy.',
    templateIds: ['geometric_poise', 'collage_reverie', 'playful_doodle', 'floral_whisper', 'icon_study'],
  },
  missing_you: {
    id: 'missing_you',
    label: 'Missing You / Thinking of You',
    description: 'Soft presence and emotional closeness.',
    templateIds: ['night_sky_quiet', 'painterly_horizon', 'lyrical_abstract', 'icon_study', 'negative_space'],
  },
  get_well: {
    id: 'get_well',
    label: 'Get Well / Going Through Something',
    description: 'Gentle, patient, and caring.',
    templateIds: ['night_sky_quiet', 'painterly_horizon', 'floral_whisper', 'botanical_silhouette', 'lyrical_abstract'],
  },
  just_because: {
    id: 'just_because',
    label: 'Just Because',
    description: 'Easy, personal, and playful by default.',
    templateIds: ['playful_doodle', 'icon_study', 'floral_whisper', 'textural_motif', 'collage_reverie'],
  },
};

export const getCardCategory = (answers: Record<string, any>): CardCategory => {
  const occasion = (answers['occasion'] || '').toLowerCase();
  const vibes = Array.isArray(answers['vibe']) ? answers['vibe'] : [answers['vibe'] || ''];
  const vibeStr = vibes.join(' ').toLowerCase();
  const relationship = (answers['relationshipType'] || '').toLowerCase();

  if (occasion.includes('messed up') || vibeStr.includes('apologetic')) {
    return CARD_CATEGORIES.apology;
  }
  if (occasion.includes('thank') || vibeStr.includes('grateful')) {
    return CARD_CATEGORIES.gratitude;
  }
  if (occasion.includes('anniversary') || relationship.includes('partner') || relationship.includes('spouse') || relationship.includes('dating')) {
    return CARD_CATEGORIES.love_romance;
  }
  if (occasion.includes('miss')) {
    return CARD_CATEGORIES.missing_you;
  }
  if (occasion.includes('going through')) {
    return CARD_CATEGORIES.get_well;
  }
  if (
    occasion.includes('birthday') ||
    occasion.includes('achieved') ||
    occasion.includes('congratulations') ||
    occasion.includes('holiday')
  ) {
    return CARD_CATEGORIES.celebration;
  }
  if (vibeStr.includes('encouraging')) {
    return CARD_CATEGORIES.encouragement_support;
  }
  if (occasion.includes('just because') || occasion.includes('no reason')) {
    return CARD_CATEGORIES.just_because;
  }

  return CARD_CATEGORIES.just_because;
};

export const getTemplateRecommendations = (answers: Record<string, any>) => {
  const category = getCardCategory(answers);
  const templates = category.templateIds
    .map((id) => DESIGN_STARTERS[id])
    .filter((template): template is DesignStarter => Boolean(template));
  return { category, templates };
};

/**
 * Recommend a design starter using the deterministic vibe-to-style mapping.
 *
 * SMART EMOTIONAL RISK RULE:
 * "If emotional risk is high, reduce visual emotion"
 * - Apology → letterpress_minimal (serious, ownership)
 * - Illness/Get Well → night_sky_quiet (patient, comforting)
 * - Professional occasions → letterpress_minimal (respectful distance)
 *
 * This override takes precedence over vibe-based mapping when applicable.
 *
 * Fallback order:
 * 1. Smart emotional risk rule (if applicable)
 * 2. Primary style from vibe mapping
 * 3. Secondary style from vibe mapping
 * 4. Fallback style from vibe mapping
 * 5. Ultimate fallback: floral_whisper
 */
export const recommendDesignStarter = (answers: Record<string, any>): DesignStarter => {
  const vibes = Array.isArray(answers['vibe']) ? answers['vibe'] : [answers['vibe'] || ''];
  const occasion = (answers['occasion'] || '').toLowerCase();
  const relationship = (answers['relationshipType'] || '').toLowerCase();
  const vibeStr = vibes.join(' ').toLowerCase();

  // SMART RULE 1: Apology → Letterpress (serious ownership)
  if (
    occasion.includes('messed up') ||
    occasion.includes('apologize') ||
    vibeStr.includes('apologetic')
  ) {
    if (DESIGN_STARTERS['letterpress_minimal']) {
      return DESIGN_STARTERS['letterpress_minimal'];
    }
  }

  // SMART RULE 2: Illness/Get Well → Night Sky (comforting presence)
  if (
    occasion.includes('going through') ||
    occasion.includes('get well') ||
    occasion.includes('sick') ||
    occasion.includes('difficult')
  ) {
    if (DESIGN_STARTERS['night_sky_quiet']) {
      return DESIGN_STARTERS['night_sky_quiet'];
    }
  }

  // SMART RULE 3: Professional → Letterpress (respectful distance)
  if (
    relationship.includes('coworker') ||
    relationship.includes('professional') ||
    relationship.includes('boss')
  ) {
    if (DESIGN_STARTERS['letterpress_minimal']) {
      return DESIGN_STARTERS['letterpress_minimal'];
    }
  }

  // Use the deterministic vibe-to-style mapping
  const mapping = getVibeMapping(vibes);

  // Try primary allowed style
  const primaryStyleId = mapping.styleConstraints.primaryStyle;
  if (DESIGN_STARTERS[primaryStyleId]) {
    return DESIGN_STARTERS[primaryStyleId];
  }

  // Try secondary allowed style
  const secondaryStyleId = mapping.styleConstraints.secondaryStyle;
  if (DESIGN_STARTERS[secondaryStyleId]) {
    return DESIGN_STARTERS[secondaryStyleId];
  }

  // Try fallback style
  const fallbackStyleId = mapping.styleConstraints.fallbackStyle;
  if (DESIGN_STARTERS[fallbackStyleId]) {
    return DESIGN_STARTERS[fallbackStyleId];
  }

  // Ultimate fallback
  return DESIGN_STARTERS.floral_whisper;
};

/**
 * Get all allowed styles for the given answers (for template selection UI)
 */
export const getAllowedStylesForAnswers = (answers: Record<string, any>): DesignStarter[] => {
  const vibes = Array.isArray(answers['vibe']) ? answers['vibe'] : [answers['vibe'] || ''];
  const allowedIds = getAllowedStyles(vibes);

  return allowedIds
    .map(id => DESIGN_STARTERS[id])
    .filter((starter): starter is DesignStarter => Boolean(starter));
};

// ============================================
// HOLIDAY-AWARE RECOMMENDATIONS
// ============================================

export interface HolidayAwareRecommendation {
  primary: DesignStarter;
  alternatives: DesignStarter[];
  holidayContext?: {
    holidayId: HolidayId;
    hasConflict: boolean;
    explanation?: string;
  };
}

/**
 * Get holiday-aware template recommendations
 *
 * Priority order:
 * 1. Conflict resolution forced template (if applicable)
 * 2. Holiday best styles intersection with vibe allowed styles
 * 3. Vibe-based recommendations (fallback)
 *
 * This function respects the layer composition:
 * Base Style (form) + Holiday Overlay (palette/mood) + Vibe (intensity)
 */
export const getHolidayAwareRecommendations = (
  answers: Record<string, any>
): HolidayAwareRecommendation => {
  const vibes = Array.isArray(answers['vibe']) ? answers['vibe'] : [answers['vibe'] || ''];

  // Detect holiday
  const holidayId = mapSpecialDayToHolidayId(
    answers.specialDay || answers.lifeEvent || ''
  );

  // Check for conflicts first
  if (holidayId) {
    const resolution = resolveHolidayConflict(holidayId, answers);

    // If conflict forces a template, use it
    if (resolution.hasConflict && resolution.forcedTemplateId) {
      const forcedTemplate = DESIGN_STARTERS[resolution.forcedTemplateId];
      if (forcedTemplate) {
        // Get alternatives from vibe mapping for variety
        const vibeStyles = getAllowedStyles(vibes);
        const alternatives = vibeStyles
          .filter(id => id !== resolution.forcedTemplateId)
          .slice(0, 2)
          .map(id => DESIGN_STARTERS[id])
          .filter((t): t is DesignStarter => Boolean(t));

        return {
          primary: forcedTemplate,
          alternatives,
          holidayContext: {
            holidayId,
            hasConflict: true,
            explanation: resolution.explanation,
          },
        };
      }
    }

    // No conflict: intersect holiday best styles with vibe allowed styles
    const holidayStyleIds = getHolidayRecommendedStyles(holidayId);
    const vibeStyles = getAllowedStyles(vibes);

    if (holidayStyleIds.length > 0) {
      // Find intersection
      const intersection = vibeStyles.filter(id => holidayStyleIds.includes(id));

      if (intersection.length > 0) {
        // Use first intersection as primary
        const primary = DESIGN_STARTERS[intersection[0]];
        const alternatives = intersection
          .slice(1, 3)
          .map(id => DESIGN_STARTERS[id])
          .filter((t): t is DesignStarter => Boolean(t));

        if (primary) {
          return {
            primary,
            alternatives,
            holidayContext: {
              holidayId,
              hasConflict: false,
            },
          };
        }
      }

      // No intersection: prefer holiday styles but include vibe alternatives
      const holidayPrimary = DESIGN_STARTERS[holidayStyleIds[0]];
      if (holidayPrimary) {
        const alternatives = vibeStyles
          .slice(0, 2)
          .map(id => DESIGN_STARTERS[id])
          .filter((t): t is DesignStarter => Boolean(t));

        return {
          primary: holidayPrimary,
          alternatives,
          holidayContext: {
            holidayId,
            hasConflict: false,
          },
        };
      }
    }
  }

  // Fallback: use existing vibe-based recommendation
  const recommended = recommendDesignStarter(answers);
  const vibeStyles = getAllowedStyles(vibes);
  const alternatives = vibeStyles
    .filter(id => id !== recommended.id)
    .slice(0, 2)
    .map(id => DESIGN_STARTERS[id])
    .filter((t): t is DesignStarter => Boolean(t));

  return {
    primary: recommended,
    alternatives,
  };
};
