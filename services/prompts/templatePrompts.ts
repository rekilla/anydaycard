/**
 * System instruction for template-specific design prompt generation
 * Used when generating front/back prompts based on selected template
 */
export const TEMPLATE_GENERATION_INSTRUCTION = `
You are an expert art director for greeting card design with deep knowledge of image generation.

YOUR GOAL: Generate vivid, specific visual prompts that will produce beautiful, emotionally resonant images.

PROMPT WRITING RULES:
1. Be SPECIFIC and VISUAL - describe exactly what should appear in the image
   BAD: "something romantic"
   GOOD: "two intertwined coffee cups with steam forming a heart shape, morning light"

2. Include COMPOSITION details - where things are placed, perspective, focus
   - "centered", "close-up", "wide shot", "from above", "soft focus background"

3. Include LIGHTING and MOOD
   - "golden hour lighting", "soft diffused light", "dramatic shadows", "warm glow"

4. Reference the user's SPECIFIC DETAILS when provided (their interests, memories, inside jokes)
   - Transform personal details into symbolic visual elements

5. NEVER include text, words, letters, or typography in any prompt

FRONT PROMPTS: Hero cover illustrations - bold, eye-catching, emotionally impactful
BACK PROMPTS: Subtle backgrounds - soft, minimal, lots of negative space for text overlay

Return JSON with "frontPrompts" (2 items) and "backPrompts" (2 items), each 1-2 sentences max.
`.trim();

/**
 * Art direction system instruction for general design generation
 * Used for creating visual descriptions that match message emotion
 */
export const ART_DIRECTION_INSTRUCTION = `
You are an expert art director.
Your goal is to describe a visual scene for a greeting card cover that matches the emotion of the chosen message and the user's details.
Focus on symbolic, meaningful imagery.
`.trim();

/**
 * Context-specific override instructions
 */
export const CONTEXT_OVERRIDES = {
  /**
   * When the user has heavily edited the message
   * The visual should prioritize the edited message's tone over original context
   */
  heavilyEdited: `
ALERT: The user has manually rewritten the message significantly.
The emotional tone of the 'Selected Message' takes precedence over the 'User Answers' or 'Design Style' if they conflict.
Analyze the new message text deeply for the visual cue.
`.trim(),

  /**
   * Standard instruction when message is original or lightly edited
   */
  standard: 'Ensure the visual fits the context of the user answers and the message.',
};

/**
 * Get the appropriate art direction instruction based on edit state
 */
export function getArtDirectionInstruction(isHeavilyEdited: boolean): string {
  return isHeavilyEdited
    ? CONTEXT_OVERRIDES.heavilyEdited
    : CONTEXT_OVERRIDES.standard;
}

/**
 * Build the full design generation prompt with context
 */
export function buildDesignPrompt(
  templateName: string,
  templateDescription: string,
  answers: Record<string, unknown>,
  selectedMessage: string,
  cardFormat: string,
  coverTextPreference?: string | null
): string {
  const designOccasion =
    answers.specialDay || answers.lifeEvent || answers.occasion || 'Just Because';

  return `
Template: ${templateName}
Template Description: ${templateDescription}

Context:
- Recipient: ${answers.name || 'Unknown'}
- Relationship: ${answers.relationshipType || 'Unknown'}
- Card Type: ${answers.cardType === 'special_day' ? 'Special Day/Holiday' : answers.cardType === 'life_event' ? 'Life Event' : 'Just Because'}
- Occasion: ${designOccasion}
- Vibe: ${Array.isArray(answers.vibe) ? answers.vibe.join(', ') : answers.vibe || 'Unspecified'}
- Selected Message: "${selectedMessage}"
- Card format: ${cardFormat}
- Cover text preference: ${coverTextPreference || 'unspecified'}

Return two front prompts and two back prompts.
`.trim();
}

/**
 * Build the art prompt generation context
 */
export function buildArtPromptContext(
  designStyleName: string,
  designStyleDescription: string,
  answers: Record<string, unknown>,
  selectedMessage: string,
  isHeavilyEdited: boolean
): string {
  const overrideInstruction = getArtDirectionInstruction(isHeavilyEdited);

  return `
Create a visual art prompt for a greeting card.

${overrideInstruction}

Context:
- User Answers: ${JSON.stringify(answers)}
- Selected Message (The visual should support this text): "${selectedMessage}"

--- ART DIRECTION INSTRUCTIONS ---
Internal Design Style: "${designStyleName}"
Style Description: ${designStyleDescription}

Your task:
Describe a specific subject, object, or scene that fits the user's context AND the emotion of the selected message.
Crucially, ensure this subject matter fits the "${designStyleName}" style described above.

IMPORTANT:
- DO NOT include generic style keywords (like "watercolor", "minimalist") in the output. We append those automatically.
- Focus on the SUBJECT MATTER (e.g., "A single red bicycle leaning against a tree" or "Abstract geometric shapes dancing").

Output JSON Schema:
{
  "artPrompt": "string"
}
`.trim();
}
