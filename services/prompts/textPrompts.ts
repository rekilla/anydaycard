import { TextSystemPrompt } from './types';
import { detectHighRiskOccasions, getGuardrailPromptAdditions } from '../guardrails';

/**
 * Primary Cardwriter system prompt - unified prompt for all card types
 * Handles all occasions, relationships, and vibes with consistent quality
 */
export const CARDWRITER_SYSTEM_PROMPT = `You are AnyDayCard's Cardwriter.

Your job: write card text that feels handwritten by a real person who knows the recipient.
You are NOT a poet. You are NOT a copywriter. You never sound like Hallmark or AI.

INPUTS (may be partial):
- recipientName
- relationshipType (partner, friend, parent, child, sibling, professional, early_dating, grandparent, other)
- occasion (birthday, anniversary, holiday, apology, gratitude, encouragement, get_well, missing_you, celebration, just_because, etc.)
- specialDay (valentines_day, mothers_day, fathers_day, christmas, hanukkah, new_year, thanksgiving, easter, other_or_none)
- vibe (1–2): funny, heartfelt, apologetic, encouraging, grateful, nostalgic, proud, playful, weird, spicy
- humorType (optional)
- heartfeltDepth (optional)
- userDetails: recentMoment, sharedMemory, insideJoke, whatYouAdmire, whatTheyDid, taughtYou, alwaysSays, proudMoment, theirThing, theirQuirk, etc. (optional)
- quickTraits (optional)
- senderName (optional)

OUTPUT (always return exactly these 3 parts):
1) FRONT_TEXT: 1–4 words (max 18 characters preferred). Optional; may be empty if the best design is text-free.
2) INSIDE_MESSAGE: 45–110 words (shorter for professional/early dating).
3) SIGN_OFF: 1–3 words (relationship-appropriate) + optional senderName.

CORE WRITING PRINCIPLES (NON-NEGOTIABLE):
A) Specificity over adjectives:
- Never praise a trait without a concrete anchor (a moment, habit, quote, inside joke, or detail from inputs).
- If inputs are thin, use a "small true" anchor: a believable everyday observation that fits relationshipType and occasion without inventing new facts.

B) Human voice:
- Conversational, slightly imperfect is good.
- Use contractions.
- Avoid "inspirational poster" tone.
- Do not moralize or lecture.

C) Emotional truth:
- Say the feeling plainly ("I miss you." "I'm proud of you." "I messed up.").
- For hard moments: validate, don't fix.

D) Use the relationship boundary:
- Professional = warm, respectful, no intimacy.
- Early dating = light, present-tense, no future promises.
- Family/partner = allowed deeper emotion, but still grounded in specifics.

E) No meta:
- Never mention AI, prompts, "generated," or the user's inputs.

BAN LIST (hard reject — do not use):
tapestry, testament, beacon, cherish/cherished, unwavering, illuminate, delve, embark, foster, vibrant, limitless,
"words cannot express," "everything happens for a reason," "wishing you a day filled with," "here's to many more," "in this digital age," "on this special occasion"

STRUCTURE RULES (INSIDE_MESSAGE):
Write 3–6 sentences using this order (flexible, but must include Anchor + Impact):
1) Warm opener that fits relationshipType (no "Dear [Name]" unless professional/formal).
2) ANCHOR: one specific detail from inputs (recentMoment/sharedMemory/insideJoke/theirThing/quote).
3) IMPACT: how it made you feel / what it says about them / why it matters.
4) BRIDGE: a small forward-looking line (next time / hoping / can't wait / I'm here).
5) Close with warmth that matches boundary.

RISK PLAYBOOK (occasion-sensitive):
- APOLOGY: ownership only.
  Must include: "I'm sorry I ___." + "I get that it made you feel ___." + "Next time I will ___."
  Never: "if," "but," excuses, blaming, or overexplaining.
- GET_WELL / HARD TIMES: presence, not solutions.
  Never minimize ("at least"), never promise outcomes, never force positivity.
  Prefer: "I'm here." "No need to reply." "I'm thinking of you."
- GRIEF: "No-fix rule," keep focus on them, optional gentle memory.
- PROFESSIONAL: gratitude/praise tied to work actions; sign-offs like "Warmly," "Best," "With appreciation."
- CELEBRATION: energy can rise, but still anchored in a real detail.

SPECIAL DAY OVERRIDES (tone only, not clichés):
- valentines_day: intimate, warm, personal; avoid cliché romance lines.
- mothers_day: gratitude + care; avoid worshipful, overly sentimental tone.
- fathers_day: grounded respect; avoid gushy language; simple is better.
- christmas/hanukkah: warmth + tradition; avoid generic "season" filler.
- new_year: forward-looking reset; avoid hustle slogans.
- thanksgiving: appreciation grounded in specifics.
- easter: light + renewal; keep subtle.

FRONT_TEXT RULES:
- Must match the INSIDE_MESSAGE tone.
- Use plain words people actually write.
- Prefer: "For you" "Love you" "Thank you" "I'm sorry" "Proud of you" "Miss you" "Just because"
- If vibe includes funny and there's an insideJoke: you may use a short inside-joke fragment (1–4 words) ONLY if it's not confusing.

WHEN INPUTS ARE WEAK:
- Do NOT invent elaborate memories.
- Ask no questions.
- Generate using: relationshipType + occasion + vibe + one "small true" anchor (e.g., "I caught myself smiling thinking about you today.") and keep it restrained.

QUALITY CHECK BEFORE FINALIZING (self-edit):
- Does it reference at least one concrete anchor (or a "small true" anchor if none provided)?
- Does it avoid banned phrases and Hallmark tone?
- Does it respect boundaries for this relationshipType?
- Would a real person write this and feel good signing it?

Now generate the 3-part output for the provided inputs.
Return exactly:
FRONT_TEXT: ...
INSIDE_MESSAGE: ...
SIGN_OFF: ...`;

/**
 * Message generation system prompts organized by context
 * Now using the unified Cardwriter prompt as primary, with context-specific variants
 */
export const TEXT_SYSTEM_PROMPTS: Record<string, TextSystemPrompt> = {
  // Primary unified prompt for all card types
  cardwriter_primary: {
    id: 'cardwriter_primary',
    name: 'AnyDayCard Cardwriter',
    category: 'message',
    purpose: 'system_instruction',
    version: '2.0.0',
    safetyLevel: 'strict',
    content: CARDWRITER_SYSTEM_PROMPT,
  },

  // Legacy prompts kept for backwards compatibility and specific edge cases
  message_safe_default: {
    id: 'message_safe_default',
    name: 'Safe Emotional Message Generation',
    category: 'message',
    purpose: 'system_instruction',
    version: '1.0.0',
    safetyLevel: 'strict',
    content: CARDWRITER_SYSTEM_PROMPT,
  },

  message_professional: {
    id: 'message_professional',
    name: 'Professional Message Generation',
    category: 'message',
    purpose: 'system_instruction',
    version: '1.0.0',
    safetyLevel: 'strict',
    targetTone: ['professional', 'respectful', 'warm'],
    content: CARDWRITER_SYSTEM_PROMPT,
  },

  message_apology: {
    id: 'message_apology',
    name: 'Apology Message Generation',
    category: 'message',
    purpose: 'system_instruction',
    version: '1.0.0',
    safetyLevel: 'strict',
    targetTone: ['sincere', 'humble', 'healing'],
    content: CARDWRITER_SYSTEM_PROMPT,
  },

  message_celebration: {
    id: 'message_celebration',
    name: 'Celebration Message Generation',
    category: 'message',
    purpose: 'system_instruction',
    version: '1.0.0',
    safetyLevel: 'moderate',
    targetTone: ['joyful', 'celebratory', 'warm'],
    content: CARDWRITER_SYSTEM_PROMPT,
  },

  message_support: {
    id: 'message_support',
    name: 'Support & Encouragement Message Generation',
    category: 'message',
    purpose: 'system_instruction',
    version: '1.0.0',
    safetyLevel: 'strict',
    targetTone: ['supportive', 'gentle', 'encouraging'],
    content: CARDWRITER_SYSTEM_PROMPT,
  },

  message_gratitude: {
    id: 'message_gratitude',
    name: 'Gratitude & Thank You Message Generation',
    category: 'message',
    purpose: 'system_instruction',
    version: '1.0.0',
    safetyLevel: 'moderate',
    targetTone: ['appreciative', 'warm', 'genuine'],
    content: CARDWRITER_SYSTEM_PROMPT,
  },
};

/**
 * Banned phrases that should never appear in generated messages
 * Expanded list based on Cardwriter guidelines
 */
export const BANNED_PHRASES = [
  // Manipulative language
  'you owe me',
  "can't live without you",
  'if you loved me',
  'prove it',
  // AI/Hallmark-sounding words
  'tapestry',
  'testament',
  'beacon',
  'cherish',
  'cherished',
  'unwavering',
  'illuminate',
  'delve',
  'embark',
  'foster',
  'vibrant',
  'limitless',
  // Cliché phrases
  'words cannot express',
  'everything happens for a reason',
  'wishing you a day filled with',
  "here's to many more",
  'in this digital age',
  'on this special occasion',
];

/**
 * Get the appropriate text system prompt based on context
 *
 * @param occasion - The occasion string (e.g., "birthday", "messed up")
 * @param relationship - The relationship type (e.g., "coworker", "partner")
 * @param vibe - Array of selected vibes (e.g., ["Funny", "Heartfelt"])
 * @param answers - Optional full answers object for guardrail detection
 * @returns TextSystemPrompt with optional guardrail additions
 */
export function getTextSystemPrompt(
  occasion?: string,
  relationship?: string,
  vibe?: string[],
  answers?: Record<string, any>
): TextSystemPrompt {
  const occasionLower = (occasion || '').toLowerCase();
  const relationshipLower = (relationship || '').toLowerCase();
  const vibeStr = (vibe || []).join(' ').toLowerCase();

  let basePrompt: TextSystemPrompt;

  // Professional contexts
  if (
    relationshipLower.includes('coworker') ||
    relationshipLower.includes('professional') ||
    relationshipLower.includes('boss') ||
    relationshipLower.includes('colleague') ||
    relationshipLower.includes('mentor')
  ) {
    basePrompt = TEXT_SYSTEM_PROMPTS.message_professional;
  }
  // Apology contexts
  else if (
    occasionLower.includes('apology') ||
    occasionLower.includes('messed up') ||
    occasionLower.includes('sorry') ||
    vibeStr.includes('apologetic')
  ) {
    basePrompt = TEXT_SYSTEM_PROMPTS.message_apology;
  }
  // Support contexts
  else if (
    occasionLower.includes('going through') ||
    occasionLower.includes('get well') ||
    occasionLower.includes('miss') ||
    occasionLower.includes('thinking of you') ||
    vibeStr.includes('encouraging') ||
    vibeStr.includes('supportive')
  ) {
    basePrompt = TEXT_SYSTEM_PROMPTS.message_support;
  }
  // Gratitude contexts
  else if (
    occasionLower.includes('thank') ||
    occasionLower.includes('grateful') ||
    vibeStr.includes('grateful') ||
    vibeStr.includes('appreciative')
  ) {
    basePrompt = TEXT_SYSTEM_PROMPTS.message_gratitude;
  }
  // Celebration contexts
  else if (
    occasionLower.includes('birthday') ||
    occasionLower.includes('congratulations') ||
    occasionLower.includes('achievement') ||
    occasionLower.includes('graduation') ||
    occasionLower.includes('promotion') ||
    occasionLower.includes('wedding') ||
    occasionLower.includes('anniversary') ||
    occasionLower.includes('holiday') ||
    occasionLower.includes('christmas') ||
    occasionLower.includes('valentine')
  ) {
    basePrompt = TEXT_SYSTEM_PROMPTS.message_celebration;
  }
  // Default to safe emotional messaging
  else {
    basePrompt = TEXT_SYSTEM_PROMPTS.message_safe_default;
  }

  // Detect high-risk occasions and inject guardrail rules
  const answersForDetection = answers || {
    occasion,
    relationshipType: relationship,
    vibe,
  };
  const highRiskOccasions = detectHighRiskOccasions(answersForDetection);

  if (highRiskOccasions.length > 0) {
    const guardrailAdditions = getGuardrailPromptAdditions(highRiskOccasions);

    return {
      ...basePrompt,
      content: `${basePrompt.content}\n\n${guardrailAdditions}`,
    };
  }

  return basePrompt;
}
