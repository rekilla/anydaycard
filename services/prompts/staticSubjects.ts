/**
 * Static subject prompts for each design template
 * These replace AI-generated subjects for more consistent, controlled output
 *
 * Each template has 2 front options and 2 back options
 * User info (vibe, holiday) only affects color palette, not subjects
 */

export interface TemplateSubjects {
  front: { option1: string; option2: string };
  back: { option1: string; option2: string };
}

export const STATIC_SUBJECTS: Record<string, TemplateSubjects> = {
  floral_whisper: {
    front: {
      option1: 'Delicate peony blooms with soft petals unfurling, single stem arrangement with morning dew droplets catching light',
      option2: 'Loose watercolor roses in gentle cascade, overlapping translucent petals with organic flowing composition',
    },
    back: {
      option1: 'Faint botanical leaves as watermark texture, barely visible stems trailing softly across space',
      option2: 'Soft petal fragments scattered like whispered suggestions, ethereal and barely-there',
    },
  },

  textural_motif: {
    front: {
      option1: 'Rich woven fabric texture with subtle thread patterns, tactile linen weave catching soft directional light',
      option2: 'Layered handmade paper with torn edges and natural fiber inclusions, organic texture study',
    },
    back: {
      option1: 'Gentle linen canvas texture, soft neutral weave pattern barely visible',
      option2: 'Subtle handmade paper grain, quiet texture with natural imperfections',
    },
  },

  icon_study: {
    front: {
      option1: 'A single origami paper crane folded with care, centered and grounded with subtle shadow on clean background',
      option2: 'A vintage brass key with ornate bow, isolated against generous negative space with soft studio lighting',
    },
    back: {
      option1: 'Minimalist single brushstroke suggesting a circle, zen-like simplicity with calm negative space',
      option2: 'Gentle gradient wash from edge, clean and unobtrusive with abundant breathing room',
    },
  },

  single_line: {
    front: {
      option1: 'Continuous single line drawing of two hands reaching toward each other, elegant unbroken stroke',
      option2: 'One-line portrait profile silhouette, flowing continuous contour with graceful curves',
    },
    back: {
      option1: 'Simple continuous line forming abstract gentle wave, minimal and meditative',
      option2: 'Single flowing line creating soft spiral, calm and contemplative movement',
    },
  },

  painterly_horizon: {
    front: {
      option1: 'Abstract landscape with soft horizon line, impressionist brushstrokes blending sky and earth',
      option2: 'Dreamy sunset seascape with loose oil painting technique, warm light meeting calm water',
    },
    back: {
      option1: 'Soft color field with gentle horizontal bands, muted tones fading into each other',
      option2: 'Atmospheric gradient suggesting distant horizon, peaceful and expansive',
    },
  },

  lyrical_abstract: {
    front: {
      option1: 'Fluid organic shapes flowing and merging, alcohol ink style with soft edges and natural movement',
      option2: 'Abstract watercolor forms dancing across space, loose and expressive with gentle color bleeding',
    },
    back: {
      option1: 'Soft wash of color with subtle organic movement, barely-there abstract suggestion',
      option2: 'Gentle color bloom fading to edges, ethereal and calming abstraction',
    },
  },

  negative_space: {
    front: {
      option1: 'High contrast silhouette of bird in flight against bright sky, dramatic use of light and shadow',
      option2: 'Single tree silhouette at golden hour, bold dark form against luminous background',
    },
    back: {
      option1: 'Minimal dark shape at edge of frame, generous bright negative space dominating',
      option2: 'Subtle shadow suggestion in corner, vast open space for text',
    },
  },

  botanical_silhouette: {
    front: {
      option1: 'Delicate fern frond silhouette against soft light, intricate leaf patterns in shadow',
      option2: 'Eucalyptus branch shadow play, organic botanical forms in deep tones',
    },
    back: {
      option1: 'Faint leaf shadow at edge, whisper of botanical form barely visible',
      option2: 'Subtle stem silhouette trailing from corner, gentle and unobtrusive',
    },
  },

  geometric_poise: {
    front: {
      option1: 'Bold overlapping circles and triangles in balanced composition, clean Bauhaus-inspired geometry',
      option2: 'Intersecting angular forms creating dynamic tension, sharp edges with confident placement',
    },
    back: {
      option1: 'Single geometric shape anchored in corner, minimal and precise with clean lines',
      option2: 'Subtle grid pattern fading to transparency, architectural and orderly',
    },
  },

  collage_reverie: {
    front: {
      option1: 'Layered torn paper elements with vintage ephemera, mixed media textures and overlapping forms',
      option2: 'Nostalgic collage with botanical prints and handwritten fragments, dreamy layered composition',
    },
    back: {
      option1: 'Single torn paper edge with subtle texture, aged paper quality barely visible',
      option2: 'Faint vintage paper texture with gentle aging marks, quiet nostalgic backdrop',
    },
  },

  letterpress_minimal: {
    front: {
      option1: 'Single debossed geometric mark with subtle shadow, refined letterpress impression on cotton paper',
      option2: 'Minimal embossed line detail, premium tactile quality with understated elegance',
    },
    back: {
      option1: 'Clean cotton paper texture, subtle letterpress grid impression barely visible',
      option2: 'Refined paper surface with gentle tooth, minimal and sophisticated',
    },
  },

  night_sky_quiet: {
    front: {
      option1: 'Constellation pattern across deep blue expanse, delicate star points connected by faint lines',
      option2: 'Crescent moon with scattered stars, peaceful night sky with comforting presence',
    },
    back: {
      option1: 'Deep blue gradient with single distant star, vast quiet space',
      option2: 'Subtle cosmic dust texture, dark and calming with gentle sparkle',
    },
  },

  playful_doodle: {
    front: {
      option1: 'Whimsical hand-drawn flowers and swirls, cheerful notebook marginalia style sketches',
      option2: 'Playful doodle characters and stars, loose pen sketches with joyful energy',
    },
    back: {
      option1: 'Simple doodle border at edge, light-hearted pen marks with lots of white space',
      option2: 'Tiny scattered stars and dots, minimal playful accents leaving room for text',
    },
  },
};

/**
 * Get static subjects for a template
 * Returns default subjects if template not found
 */
export function getStaticSubjects(templateId: string): TemplateSubjects {
  return STATIC_SUBJECTS[templateId] || STATIC_SUBJECTS.icon_study;
}

/**
 * Get a specific subject prompt
 */
export function getSubjectPrompt(
  templateId: string,
  position: 'front' | 'back',
  optionIndex: 0 | 1
): string {
  const subjects = getStaticSubjects(templateId);
  const optionKey = optionIndex === 0 ? 'option1' : 'option2';
  return subjects[position][optionKey];
}
