/**
 * QA-Enhanced Message Generation
 *
 * This module wraps the standard message generation with QA scoring
 * to ensure high-quality, personalized messages. It implements:
 *
 * 1. Score all 4 generated options
 * 2. Auto-regenerate if scores are below threshold
 * 3. Request user detail if scores remain low after regeneration
 * 4. Track first-gen acceptance metrics
 */

import { generateMessageOptions } from './geminiService';
import {
  scoreMessageOptions,
  trackGenerationMetrics,
  QAScoreResult,
  QAScoringConfig,
  DEFAULT_QA_CONFIG,
} from './qaService';
import { getVibePromptInstructions } from './vibeStyleMapping';

/**
 * Result of QA-enhanced generation
 */
export interface QAGenerationResult {
  /** The generated messages (best 4, sorted by score) */
  messages: string[];
  /** QA scores for each message */
  scores: QAScoreResult[];
  /** Number of regeneration attempts made */
  regenerationAttempts: number;
  /** Whether user should be prompted for more detail */
  userPromptNeeded: boolean;
  /** Suggested prompt to ask the user */
  suggestedPrompt?: string;
  /** Metrics about this generation */
  metrics: {
    firstGenPassed: boolean;
    bestScore: number;
    averageScore: number;
  };
}

/**
 * Find the dimension with lowest average score across all messages
 */
function findLowestDimension(
  scored: Array<{ message: string; score: QAScoreResult }>
): string {
  const dimensionSums: Record<string, number> = {
    specificity: 0,
    toneMatch: 0,
    clicheAvoidance: 0,
    safety: 0,
  };

  for (const item of scored) {
    for (const [key, value] of Object.entries(item.score.dimensions)) {
      dimensionSums[key] += value.score;
    }
  }

  return Object.entries(dimensionSums)
    .reduce((min, curr) => (curr[1] < min[1] ? curr : min))[0];
}

/**
 * Get QA hint guidance for regeneration based on lowest dimension
 */
function getQAHintGuidance(dimension: string): string {
  switch (dimension) {
    case 'specificity':
      return 'Include MORE specific details from the user input. Reference exact names, places, moments, or inside jokes they provided. Make it unmistakably personal.';
    case 'toneMatch':
      return 'Better match the requested vibe. If they want funny, be genuinely funny. If heartfelt, go deeper emotionally. Match the energy they asked for.';
    case 'clicheAvoidance':
      return 'AVOID these overused phrases: "always there for me", "special day", "from the bottom of my heart", "what would I do without you", "means the world to me". Use fresh, original language.';
    case 'safety':
      return 'Ensure the message is appropriate for the relationship type. No guilt-tripping, pressure, or boundary violations. Keep it emotionally safe.';
    default:
      return 'Focus on quality, personalization, and authentic human voice.';
  }
}

/**
 * Generate messages with QA scoring and auto-regeneration
 *
 * @param answers - User's wizard answers
 * @param config - QA scoring configuration
 * @returns QA-enhanced generation result
 */
export async function generateAndScoreMessages(
  answers: Record<string, any>,
  config: QAScoringConfig = DEFAULT_QA_CONFIG
): Promise<QAGenerationResult> {
  let regenerationAttempts = 0;
  let allPreviousMessages: string[] = [];
  let bestScored: Array<{ message: string; score: QAScoreResult }> = [];
  let firstGenPassed = false;

  // Get vibe-based constraints for prompt
  const vibes = Array.isArray(answers.vibe) ? answers.vibe : [answers.vibe || ''];
  const vibeInstructions = getVibePromptInstructions(vibes);

  // First generation attempt
  const initialMessages = await generateMessageOptions(answers, 0, []);
  const initialScored = await scoreMessageOptions(initialMessages, answers, config);

  // Check if all pass threshold
  const passingMessages = initialScored.filter(m => m.score.passesThreshold);
  firstGenPassed = passingMessages.length >= 4;

  if (firstGenPassed) {
    // Track metrics
    trackGenerationMetrics({
      firstGenPassed: true,
      regenerationCount: 0,
      userDetailRequested: false,
      finalScore: initialScored[0].score.totalScore,
    });

    return {
      messages: initialScored.map(m => m.message),
      scores: initialScored.map(m => m.score),
      regenerationAttempts: 0,
      userPromptNeeded: false,
      metrics: {
        firstGenPassed: true,
        bestScore: initialScored[0].score.totalScore,
        averageScore: initialScored.reduce((sum, m) => sum + m.score.totalScore, 0) / initialScored.length,
      },
    };
  }

  // Check if we need auto-regeneration
  const needsRegeneration = initialScored.some(m => m.score.shouldAutoRegenerate);

  if (needsRegeneration && regenerationAttempts < config.maxAutoRegenerations) {
    regenerationAttempts++;
    allPreviousMessages = initialMessages;

    // Find lowest scoring dimension to focus improvement
    const lowestDimension = findLowestDimension(initialScored);
    const qaHint = getQAHintGuidance(lowestDimension);

    // Add QA hint to answers for regeneration
    const answersWithHint = {
      ...answers,
      _qaHint: qaHint,
      _vibeInstructions: vibeInstructions,
    };

    // Regenerate with improvement focus
    const regeneratedMessages = await generateMessageOptions(
      answersWithHint,
      regenerationAttempts,
      allPreviousMessages
    );

    const regeneratedScored = await scoreMessageOptions(regeneratedMessages, answers, config);

    // Combine and take best 4
    const allScored = [...initialScored, ...regeneratedScored]
      .sort((a, b) => b.score.totalScore - a.score.totalScore)
      .slice(0, 4);

    bestScored = allScored;
  } else {
    bestScored = initialScored;
  }

  // Check if we need user input
  const stillLowScores = bestScored.filter(m => !m.score.passesThreshold);
  const userPromptNeeded = stillLowScores.length > 2; // More than half failing

  let suggestedPrompt: string | undefined;
  if (userPromptNeeded && bestScored.length > 0 && bestScored[0].score.suggestedUserPrompt) {
    suggestedPrompt = bestScored[0].score.suggestedUserPrompt;
  }

  // Track metrics
  trackGenerationMetrics({
    firstGenPassed,
    regenerationCount: regenerationAttempts,
    userDetailRequested: userPromptNeeded,
    finalScore: bestScored[0]?.score.totalScore || 0,
  });

  return {
    messages: bestScored.map(m => m.message),
    scores: bestScored.map(m => m.score),
    regenerationAttempts,
    userPromptNeeded,
    suggestedPrompt,
    metrics: {
      firstGenPassed,
      bestScore: bestScored[0]?.score.totalScore || 0,
      averageScore: bestScored.reduce((sum, m) => sum + m.score.totalScore, 0) / bestScored.length,
    },
  };
}

/**
 * Re-generate messages after user provides additional detail
 *
 * @param answers - Updated answers with additional detail
 * @param previousResult - Previous generation result
 * @param config - QA scoring configuration
 * @returns New QA-enhanced generation result
 */
export async function regenerateWithDetail(
  answers: Record<string, any>,
  previousResult: QAGenerationResult,
  config: QAScoringConfig = DEFAULT_QA_CONFIG
): Promise<QAGenerationResult> {
  const previousMessages = previousResult.messages;
  const attempt = previousResult.regenerationAttempts + 1;

  // Generate new messages with updated answers
  const newMessages = await generateMessageOptions(answers, attempt, previousMessages);
  const newScored = await scoreMessageOptions(newMessages, answers, config);

  // Combine with previous best and take top 4
  const previousScored = previousResult.messages.map((msg, i) => ({
    message: msg,
    score: previousResult.scores[i],
  }));

  const allScored = [...previousScored, ...newScored]
    .sort((a, b) => b.score.totalScore - a.score.totalScore)
    .slice(0, 4);

  const stillLowScores = allScored.filter(m => !m.score.passesThreshold);
  const userPromptNeeded = stillLowScores.length > 2;

  return {
    messages: allScored.map(m => m.message),
    scores: allScored.map(m => m.score),
    regenerationAttempts: attempt,
    userPromptNeeded,
    suggestedPrompt: userPromptNeeded ? allScored[0]?.score.suggestedUserPrompt : undefined,
    metrics: {
      firstGenPassed: previousResult.metrics.firstGenPassed,
      bestScore: allScored[0]?.score.totalScore || 0,
      averageScore: allScored.reduce((sum, m) => sum + m.score.totalScore, 0) / allScored.length,
    },
  };
}

/**
 * Get a human-readable explanation of message quality
 */
export function explainMessageQuality(score: QAScoreResult): string {
  const { totalScore, maxPossibleScore, dimensions } = score;
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);

  const lines: string[] = [];

  if (percentage >= 80) {
    lines.push('Excellent message quality!');
  } else if (percentage >= 60) {
    lines.push('Good message quality.');
  } else if (percentage >= 40) {
    lines.push('Message could be improved.');
  } else {
    lines.push('Message needs significant improvement.');
  }

  // Add dimension feedback for lowest scores
  const sortedDimensions = Object.entries(dimensions)
    .sort((a, b) => a[1].score - b[1].score);

  for (const [, dim] of sortedDimensions.slice(0, 2)) {
    if (dim.score < 3 && dim.feedback !== 'No feedback') {
      lines.push(`${dim.name}: ${dim.feedback}`);
    }
  }

  return lines.join(' ');
}
