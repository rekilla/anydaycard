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
    templateIds: ['floral_whisper', 'textural_motif', 'icon_study', 'single_line'],
  },
  encouragement_support: {
    id: 'encouragement_support',
    label: 'Encouragement & Support',
    description: 'Hopeful, steady, and uplifting visuals.',
    templateIds: ['painterly_horizon', 'lyrical_abstract', 'icon_study', 'negative_space'],
  },
  apology: {
    id: 'apology',
    label: 'Apology / I Messed Up',
    description: 'Soft, quiet, and respectful repair.',
    templateIds: ['floral_whisper', 'botanical_silhouette', 'lyrical_abstract', 'negative_space'],
  },
  gratitude: {
    id: 'gratitude',
    label: 'Gratitude / Thank You',
    description: 'Thoughtful, crafted, and appreciative.',
    templateIds: ['botanical_silhouette', 'textural_motif', 'floral_whisper', 'icon_study'],
  },
  celebration: {
    id: 'celebration',
    label: 'Celebration (Birthday / Milestones)',
    description: 'Bright, lively, and celebratory energy.',
    templateIds: ['geometric_poise', 'collage_reverie', 'floral_whisper', 'icon_study'],
  },
  missing_you: {
    id: 'missing_you',
    label: 'Missing You / Thinking of You',
    description: 'Soft presence and emotional closeness.',
    templateIds: ['painterly_horizon', 'lyrical_abstract', 'icon_study', 'negative_space'],
  },
  get_well: {
    id: 'get_well',
    label: 'Get Well / Going Through Something',
    description: 'Gentle, patient, and caring.',
    templateIds: ['painterly_horizon', 'floral_whisper', 'botanical_silhouette', 'lyrical_abstract'],
  },
  just_because: {
    id: 'just_because',
    label: 'Just Because',
    description: 'Easy, personal, and playful by default.',
    templateIds: ['icon_study', 'floral_whisper', 'textural_motif', 'collage_reverie'],
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

export const recommendDesignStarter = (answers: Record<string, any>): DesignStarter => {
  const occasion = (answers['occasion'] || '').toLowerCase();
  const vibes = Array.isArray(answers['vibe']) ? answers['vibe'] : [answers['vibe'] || ''];
  const vibeStr = vibes.join(' ').toLowerCase();
  const relationship = (answers['relationshipType'] || '').toLowerCase();
  
  // Helper: Does the user have specific inputs?
  const hasSpecifics = (answers['insideJoke'] && answers['insideJoke'].length > 3) || 
                       (answers['recentMoment'] && answers['recentMoment'].length > 10) ||
                       (answers['theirThing'] && answers['theirThing'].length > 10) ||
                       (answers['anyDetails'] && answers['anyDetails'].length > 10);

  // --- LOGIC MAPPING ---

  // 1. Apology / Messed Up
  if (occasion.includes('apology') || occasion.includes('messed up') || vibeStr.includes('apologetic')) {
    if (vibeStr.includes('heartfelt')) return DESIGN_STARTERS.floral_whisper;
    return DESIGN_STARTERS.negative_space; // Humble, quiet
  }

  // 2. Love / Partner / Anniversary
  if (occasion.includes('anniversary') || relationship.includes('partner') || relationship.includes('spouse') || relationship.includes('dating')) {
    if (hasSpecifics && (vibeStr.includes('funny') || vibeStr.includes('weird'))) {
      return DESIGN_STARTERS.icon_study; // Focus on the specific joke object
    }
    if (vibeStr.includes('nostalgic')) return DESIGN_STARTERS.textural_motif;
    if (vibeStr.includes('spicy') || vibeStr.includes('heartfelt')) return DESIGN_STARTERS.single_line;
    return DESIGN_STARTERS.floral_whisper;
  }

  // 3. Celebration / Birthday
  if (occasion.includes('birthday') || occasion.includes('congratulations') || occasion.includes('holiday') || occasion.includes('achieved')) {
    if (vibeStr.includes('weird') || vibeStr.includes('funny')) return DESIGN_STARTERS.collage_reverie;
    if (vibeStr.includes('nostalgic')) return DESIGN_STARTERS.textural_motif;
    if (vibeStr.includes('heartfelt')) return DESIGN_STARTERS.floral_whisper;
    return DESIGN_STARTERS.geometric_poise; // Default modern celebration
  }

  // 4. Support / Missing Someone
  if (occasion.includes('going through') || occasion.includes('miss')) {
    if (vibeStr.includes('encouraging')) return DESIGN_STARTERS.painterly_horizon; // Horizon = Hope
    return DESIGN_STARTERS.lyrical_abstract; // Calm, safe
  }

  // 5. Gratitude
  if (occasion.includes('thank') || vibeStr.includes('grateful')) {
    if (vibeStr.includes('professional') || relationship.includes('coworker')) return DESIGN_STARTERS.botanical_silhouette;
    return DESIGN_STARTERS.textural_motif;
  }

  // 6. Professional / Coworker (General)
  if (relationship.includes('coworker') || relationship.includes('professional')) {
    return DESIGN_STARTERS.geometric_poise;
  }

  // 7. General Vibe Fallbacks
  if (vibeStr.includes('encouraging')) return DESIGN_STARTERS.painterly_horizon;
  if (vibeStr.includes('weird') || vibeStr.includes('playful')) return DESIGN_STARTERS.collage_reverie;
  if (vibeStr.includes('funny')) return DESIGN_STARTERS.icon_study;
  if (vibeStr.includes('proud')) return DESIGN_STARTERS.geometric_poise;
  if (vibeStr.includes('calm') || vibeStr.includes('nature')) return DESIGN_STARTERS.floral_whisper;
  
  // Ultimate Fallback
  return DESIGN_STARTERS.floral_whisper;
};
