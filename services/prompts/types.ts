/**
 * Prompt category for selection
 */
export type PromptCategory = 'message' | 'design' | 'image';

/**
 * Prompt purpose/use case
 */
export type PromptPurpose =
  | 'system_instruction'
  | 'user_prompt'
  | 'modifier'
  | 'fallback';

/**
 * Safety level for text prompts
 */
export type SafetyLevel = 'strict' | 'moderate' | 'relaxed';

/**
 * Image position on the card
 */
export type ImagePosition = 'front' | 'back' | 'both';

/**
 * Base interface for all prompts
 */
export interface BasePrompt {
  id: string;
  name: string;
  category: PromptCategory;
  purpose: PromptPurpose;
  content: string;
  version: string;
  metadata?: Record<string, unknown>;
}

/**
 * System instruction prompt for text/message generation
 */
export interface TextSystemPrompt extends BasePrompt {
  category: 'message';
  purpose: 'system_instruction';
  safetyLevel: SafetyLevel;
  targetTone?: string[];
}

/**
 * Image generation prompt configuration
 */
export interface ImagePromptConfig {
  id: string;
  name: string;
  templateId: string;
  position: ImagePosition;
  styleModifiers: string[];
  negativePrompts?: string[];
}

/**
 * Prompt selection criteria
 */
export interface PromptSelector {
  category: PromptCategory;
  purpose?: PromptPurpose;
  templateId?: string;
  position?: 'front' | 'back';
  occasion?: string;
  relationship?: string;
  vibe?: string[];
}

/**
 * Context for replacing placeholders in image prompts
 * Placeholders like {{their_thing}} get replaced with actual user data
 */
export interface PlaceholderContext {
  subject?: string;
  name?: string;
  relationship?: string;
  occasion?: string;
  vibe?: string;
  their_thing?: string;
  inside_joke?: string;
  recent_moment?: string;
  shared_memory?: string;
  what_admire?: string;
  traits?: string;
  any_details?: string;
}

// ============================================
// HOLIDAY OVERLAY TYPES
// ============================================

/**
 * Holiday identifier (matches .txt file names)
 */
export type HolidayId =
  | 'valentines_day'
  | 'mothers_day'
  | 'fathers_day'
  | 'christmas'
  | 'hanukkah'
  | 'new_year'
  | 'thanksgiving'
  | 'easter'
  | 'other';

/**
 * Parsed holiday overlay data from .txt files
 *
 * These overlays modify COLOR, TONE, and EMOTIONAL BOUNDARIES
 * without changing the base art style's FORM.
 */
export interface HolidayOverlay {
  id: HolidayId;
  /** Emotional rule guiding the overlay (e.g., "intimacy > spectacle") */
  emotionalRule: string;
  /** Visual elements to avoid (e.g., "loud reds, clichés, novelty hearts") */
  avoidList: string[];
  /** Visual treatment paragraph to inject into prompts */
  visualTreatment: string;
  /** Recommended base styles that pair well with this holiday */
  bestBaseStyles: string[];
  /** Typography override instructions (optional) */
  textOverride?: string;
}

/**
 * Conflict type when holiday overlays meet sensitive occasions
 * Reuses HighRiskOccasion from guardrails.ts
 */
export type OverlayConflict = 'apology' | 'illness' | 'professional' | 'grief';

/**
 * Result of conflict resolution between holiday and sensitive occasion
 */
export interface ConflictResolution {
  /** Whether a conflict was detected */
  hasConflict: boolean;
  /** The type of conflict detected */
  conflictType?: OverlayConflict;
  /** Modified overlay after applying conflict resolution (or original if no conflict) */
  resolvedOverlay: HolidayOverlay | null;
  /** Forced template override (e.g., letterpress for professional) */
  forcedTemplateId?: string;
  /** Additional negative prompts to add due to conflict */
  additionalNegatives: string[];
  /** Explanation of what was changed */
  explanation?: string;
}

/**
 * Extended context for building holiday-aware image prompts
 */
export interface HolidayPromptContext extends PlaceholderContext {
  /** Current holiday (if any) */
  holidayId?: HolidayId;
  /** Detected high-risk occasions from guardrails */
  highRiskOccasions?: OverlayConflict[];
  /** Resolved overlay after conflict handling */
  resolvedOverlay?: HolidayOverlay | null;
}
