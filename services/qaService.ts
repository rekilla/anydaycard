/**
 * QA Scoring Service
 *
 * This module provides LLM-based quality assurance scoring for greeting card messages.
 * Messages are scored on 4 dimensions (0-5 each, 20 max total):
 * - Specificity: References unique user details
 * - Tone Match: Matches requested vibe
 * - Cliche Avoidance: Fresh, original language
 * - Safety: Appropriate for relationship, no harmful content
 *
 * Scoring thresholds:
 * - >= 12/20: Pass
 * - 10-11: Auto-regenerate once
 * - < 10 after regen: Ask user for one more detail
 */

import { GoogleGenAI, Type } from "@google/genai";
import { detectHighRiskOccasions, validateMessage, GuardrailValidationResult } from "./guardrails";
import { getVibeMapping, checkHardBans } from "./vibeStyleMapping";

// Initialize Gemini Client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const QA_MODEL = 'gemini-2.0-flash';

/**
 * Score for a single dimension (0-5)
 */
export interface QAScoreDimension {
  name: string;
  score: number;
  maxScore: 5;
  feedback: string;
}

/**
 * Complete QA score result for a message
 */
export interface QAScoreResult {
  totalScore: number;
  maxPossibleScore: number;
  normalizedScore: number; // 0-1 scale
  dimensions: {
    specificity: QAScoreDimension;
    toneMatch: QAScoreDimension;
    clicheAvoidance: QAScoreDimension;
    safety: QAScoreDimension;
  };
  passesThreshold: boolean;
  shouldAutoRegenerate: boolean;
  suggestedUserPrompt?: string;
  guardrailResult?: GuardrailValidationResult;
}

/**
 * Configuration for QA scoring thresholds
 */
export interface QAScoringConfig {
  /** Minimum score to pass (default: 12/20 = 60%) */
  minimumThreshold: number;
  /** Below this, auto-regenerate (default: 10/20 = 50%) */
  autoRegenerateThreshold: number;
  /** Maximum auto-regeneration attempts (default: 1) */
  maxAutoRegenerations: number;
}

/**
 * Metrics for tracking QA performance
 */
export interface QAMetrics {
  firstGenAcceptanceRate: number;
  averageScore: number;
  regenerationRate: number;
  userDetailRequestRate: number;
}

/**
 * Default configuration
 */
export const DEFAULT_QA_CONFIG: QAScoringConfig = {
  minimumThreshold: 12,        // 60% of 20
  autoRegenerateThreshold: 10, // 50% of 20
  maxAutoRegenerations: 1,
};

/**
 * The QA rubric system prompt for consistent scoring
 */
const QA_RUBRIC_SYSTEM_PROMPT = `
You are a quality assurance evaluator for personalized greeting card messages.

Score each message on these 4 dimensions using a 0-5 scale:

## SPECIFICITY (0-5)
- 0: Generic message with no personal details whatsoever
- 1: Only uses recipient's name, nothing else personal
- 2: One vague personal reference that could apply to anyone
- 3: Contains 1-2 specific details from user input
- 4: Weaves multiple specific details naturally into the message
- 5: Deeply personalized with multiple unique, specific references that feel intimate

## TONE MATCH (0-5)
- 0: Completely wrong tone for the occasion/relationship (e.g., joke in a grief card)
- 1: Tone is noticeably off or inconsistent
- 2: Basic tone is correct but feels forced or generic
- 3: Good tone match for occasion and relationship
- 4: Excellent tone that clearly reflects the requested vibe
- 5: Perfect tone that feels authentically human and emotionally resonant

## CLICHE AVOIDANCE (0-5)
- 0: Multiple overused phrases ("special day", "always there for me", "from the bottom of my heart")
- 1: Several clichés that make the message feel generic
- 2: One or two clichés present
- 3: Mostly original language with minor generic phrasing
- 4: Fresh, creative phrasing throughout
- 5: Entirely original and memorable language that feels unique

## SAFETY (0-5)
- 0: Contains harmful, manipulative, guilt-tripping, or clearly inappropriate content
- 1: Boundary violations or pressure tactics present
- 2: Slightly inappropriate for the relationship type or context
- 3: Safe but could be more appropriate or sensitive
- 4: Appropriate and respectful for the context
- 5: Perfectly appropriate, emotionally safe, and boundary-respecting

CRITICAL SCORING GUIDELINES:
- Be strict but fair. Most good messages should score 3-4 on each dimension.
- Reserve 5s for truly exceptional cases - they should be rare.
- A score of 2 means "needs improvement" - don't give it lightly.
- A score of 0-1 means significant problems exist.
- Your feedback should be brief (1 sentence) and actionable.
`;

/**
 * Build context summary from user answers for QA evaluation
 */
function buildContextSummary(answers: Record<string, any>): string {
  const lines: string[] = [];

  if (answers.name) lines.push(`Recipient: ${answers.name}`);
  if (answers.relationshipType) lines.push(`Relationship: ${answers.relationshipType}`);

  const occasion = answers.occasion || answers.specialDay || answers.lifeEvent;
  if (occasion) lines.push(`Occasion: ${occasion}`);

  if (answers.vibe) {
    const vibes = Array.isArray(answers.vibe) ? answers.vibe.join(', ') : answers.vibe;
    lines.push(`Requested vibe: ${vibes}`);
  }

  // Include specific details that the message should reference
  if (answers.recentMoment) lines.push(`Recent moment: "${answers.recentMoment}"`);
  if (answers.insideJoke) lines.push(`Inside joke: "${answers.insideJoke}"`);
  if (answers.theirThing) lines.push(`Their interest: "${answers.theirThing}"`);
  if (answers.sharedMemory) lines.push(`Shared memory: "${answers.sharedMemory}"`);
  if (answers.whatYouAdmire) lines.push(`What admired: "${answers.whatYouAdmire}"`);
  if (answers.childhoodMemory) lines.push(`Childhood memory: "${answers.childhoodMemory}"`);

  return lines.join('\n');
}

/**
 * Generate suggested user prompt based on lowest scoring dimension
 */
function generateUserPrompt(
  dimensions: QAScoreResult['dimensions'],
  answers: Record<string, any>
): string {
  // Find the lowest scoring dimension
  const entries = Object.entries(dimensions) as [string, QAScoreDimension][];
  const lowest = entries.reduce((min, curr) =>
    curr[1].score < min[1].score ? curr : min
  );

  switch (lowest[0]) {
    case 'specificity':
      return "Can you share one specific memory or detail about them? Even something small helps make the message feel more personal.";
    case 'toneMatch':
      return "What's one word that best describes how you want them to feel when they read this?";
    case 'clicheAvoidance':
      return "What's something only you would say to them? An inside joke, a nickname, or something unique to your relationship?";
    case 'safety':
      return "Could you tell me a bit more about your relationship? That helps us write something that feels just right.";
    default:
      return "Any other details you'd like to add to make this more personal?";
  }
}

/**
 * Clamp score to valid range (0-5)
 */
function clampScore(score: number): number {
  return Math.max(0, Math.min(5, Math.round(score)));
}

/**
 * Get default passing score (used when QA service fails)
 */
function getDefaultPassingScore(): QAScoreResult {
  const defaultDimension = (name: string): QAScoreDimension => ({
    name,
    score: 3,
    maxScore: 5,
    feedback: 'Default score (QA service unavailable)',
  });

  return {
    totalScore: 12,
    maxPossibleScore: 20,
    normalizedScore: 0.6,
    dimensions: {
      specificity: defaultDimension('Specificity'),
      toneMatch: defaultDimension('Tone Match'),
      clicheAvoidance: defaultDimension('Cliche Avoidance'),
      safety: defaultDimension('Safety'),
    },
    passesThreshold: true,
    shouldAutoRegenerate: false,
  };
}

/**
 * Score a single message using LLM evaluation
 */
export async function scoreMessage(
  message: string,
  answers: Record<string, any>,
  config: QAScoringConfig = DEFAULT_QA_CONFIG
): Promise<QAScoreResult> {
  // First, run guardrail validation (fast, no API call)
  const highRiskOccasions = detectHighRiskOccasions(answers);
  const guardrailResult = validateMessage(message, highRiskOccasions);

  // Also check vibe-specific hard bans
  const vibes = Array.isArray(answers.vibe) ? answers.vibe : [answers.vibe || ''];
  const vibeBanResult = checkHardBans(message, vibes);

  // If guardrails are violated, return a failing score immediately
  if (!guardrailResult.isValid || vibeBanResult.hasBan) {
    const safetyScore = guardrailResult.isValid ? (vibeBanResult.hasBan ? 1 : 3) : 0;
    const safetyFeedback = !guardrailResult.isValid
      ? `Contains problematic content: ${guardrailResult.hardViolations[0]?.explanation || 'guardrail violation'}`
      : vibeBanResult.hasBan
      ? `Contains banned phrase for this vibe: "${vibeBanResult.bannedPhrase}"`
      : 'Safe';

    return {
      totalScore: safetyScore + 3 + 3 + 3, // Safety is 0-1, others default to 3
      maxPossibleScore: 20,
      normalizedScore: (safetyScore + 9) / 20,
      dimensions: {
        specificity: { name: 'Specificity', score: 3, maxScore: 5, feedback: 'Not evaluated due to safety issue' },
        toneMatch: { name: 'Tone Match', score: 3, maxScore: 5, feedback: 'Not evaluated due to safety issue' },
        clicheAvoidance: { name: 'Cliche Avoidance', score: 3, maxScore: 5, feedback: 'Not evaluated due to safety issue' },
        safety: { name: 'Safety', score: safetyScore, maxScore: 5, feedback: safetyFeedback },
      },
      passesThreshold: false,
      shouldAutoRegenerate: true,
      suggestedUserPrompt: undefined,
      guardrailResult,
    };
  }

  // If no API key or AI client, return default passing score
  if (!ai) {
    console.warn('QA Service: No API key available, returning default score');
    return getDefaultPassingScore();
  }

  const contextSummary = buildContextSummary(answers);

  const prompt = `
Score this greeting card message:

MESSAGE:
"${message}"

CONTEXT (what the user provided - the message should reference some of these):
${contextSummary}

Return a JSON object with scores (0-5) and brief feedback (1 sentence) for each dimension.
`;

  try {
    const response = await ai.models.generateContent({
      model: QA_MODEL,
      contents: prompt,
      config: {
        systemInstruction: QA_RUBRIC_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            specificity: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                feedback: { type: Type.STRING },
              },
            },
            toneMatch: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                feedback: { type: Type.STRING },
              },
            },
            clicheAvoidance: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                feedback: { type: Type.STRING },
              },
            },
            safety: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                feedback: { type: Type.STRING },
              },
            },
          },
        },
      },
    });

    const scores = JSON.parse(response.text || "{}");
    return buildScoreResult(scores, config, answers, guardrailResult);
  } catch (error) {
    console.error("QA scoring failed:", error);
    // Return passing score on error to not block user
    return {
      ...getDefaultPassingScore(),
      guardrailResult,
    };
  }
}

/**
 * Build the complete score result from raw LLM scores
 */
function buildScoreResult(
  scores: any,
  config: QAScoringConfig,
  answers: Record<string, any>,
  guardrailResult?: GuardrailValidationResult
): QAScoreResult {
  const dimensions = {
    specificity: {
      name: 'Specificity',
      score: clampScore(scores.specificity?.score ?? 3),
      maxScore: 5 as const,
      feedback: scores.specificity?.feedback || 'No feedback',
    },
    toneMatch: {
      name: 'Tone Match',
      score: clampScore(scores.toneMatch?.score ?? 3),
      maxScore: 5 as const,
      feedback: scores.toneMatch?.feedback || 'No feedback',
    },
    clicheAvoidance: {
      name: 'Cliche Avoidance',
      score: clampScore(scores.clicheAvoidance?.score ?? 3),
      maxScore: 5 as const,
      feedback: scores.clicheAvoidance?.feedback || 'No feedback',
    },
    safety: {
      name: 'Safety',
      score: clampScore(scores.safety?.score ?? 4),
      maxScore: 5 as const,
      feedback: scores.safety?.feedback || 'No feedback',
    },
  };

  const totalScore = Object.values(dimensions).reduce((sum, d) => sum + d.score, 0);
  const maxPossibleScore = 20;
  const normalizedScore = totalScore / maxPossibleScore;

  const passesThreshold = totalScore >= config.minimumThreshold;
  const shouldAutoRegenerate = totalScore < config.autoRegenerateThreshold;

  // Generate user prompt if score is borderline (doesn't pass but shouldn't auto-regen)
  let suggestedUserPrompt: string | undefined;
  if (!passesThreshold && !shouldAutoRegenerate) {
    suggestedUserPrompt = generateUserPrompt(dimensions, answers);
  }

  return {
    totalScore,
    maxPossibleScore,
    normalizedScore,
    dimensions,
    passesThreshold,
    shouldAutoRegenerate,
    suggestedUserPrompt,
    guardrailResult,
  };
}

/**
 * Score multiple message options and return sorted by score
 */
export async function scoreMessageOptions(
  messages: string[],
  answers: Record<string, any>,
  config: QAScoringConfig = DEFAULT_QA_CONFIG
): Promise<Array<{ message: string; score: QAScoreResult }>> {
  // Score all messages in parallel
  const scored = await Promise.all(
    messages.map(async (message) => ({
      message,
      score: await scoreMessage(message, answers, config),
    }))
  );

  // Sort by score (highest first)
  return scored.sort((a, b) => b.score.totalScore - a.score.totalScore);
}

/**
 * Message rubric - explicit good/bad criteria for reference
 */
export const MESSAGE_RUBRIC = {
  must: [
    'Reference at least 1 unique detail from user inputs',
    'Sound like a human, not a poem generator',
    'Avoid Hallmark cliches ("special day", "always there for me", etc.)',
    'Match vibe (funny should not be mean, heartfelt should not be overdramatic)',
  ],
  mustNot: [
    'Mention AI, prompts, or anything like "as an AI..."',
    'Contain manipulative guilt or pressure',
    'Contain medical/legal claims or promises',
    'Include private/embarrassing details unless user explicitly provided them',
  ],
};

/**
 * Metrics storage key
 */
const METRICS_STORAGE_KEY = 'anyday_qa_metrics';

/**
 * Metrics event for tracking
 */
interface MetricsEvent {
  timestamp: string;
  firstGenPassed: boolean;
  regenerationCount: number;
  userDetailRequested: boolean;
  finalScore: number;
}

/**
 * Track QA generation metrics
 */
export function trackGenerationMetrics(event: Omit<MetricsEvent, 'timestamp'>): void {
  try {
    const stored = localStorage.getItem(METRICS_STORAGE_KEY);
    const events: MetricsEvent[] = stored ? JSON.parse(stored) : [];

    events.push({
      ...event,
      timestamp: new Date().toISOString(),
    });

    // Keep last 100 events
    if (events.length > 100) {
      events.shift();
    }

    localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.warn('Failed to track QA metrics:', e);
  }
}

/**
 * Get aggregated QA metrics
 */
export function getQAMetrics(): QAMetrics {
  try {
    const stored = localStorage.getItem(METRICS_STORAGE_KEY);
    const events: MetricsEvent[] = stored ? JSON.parse(stored) : [];

    if (events.length === 0) {
      return {
        firstGenAcceptanceRate: 0,
        averageScore: 0,
        regenerationRate: 0,
        userDetailRequestRate: 0,
      };
    }

    const firstGenPassed = events.filter(e => e.firstGenPassed).length;
    const regenerated = events.filter(e => e.regenerationCount > 0).length;
    const userDetailRequested = events.filter(e => e.userDetailRequested).length;
    const totalScore = events.reduce((sum, e) => sum + e.finalScore, 0);

    return {
      firstGenAcceptanceRate: firstGenPassed / events.length,
      averageScore: totalScore / events.length,
      regenerationRate: regenerated / events.length,
      userDetailRequestRate: userDetailRequested / events.length,
    };
  } catch (e) {
    console.warn('Failed to get QA metrics:', e);
    return {
      firstGenAcceptanceRate: 0,
      averageScore: 0,
      regenerationRate: 0,
      userDetailRequestRate: 0,
    };
  }
}
