/**
 * Recipient Sensitivity Guardrails
 *
 * This module provides safety guardrails for high-risk occasions to prevent
 * harmful, insensitive, or inappropriate messages. The goal is to prevent
 * the most expensive failure mode: a bad card someone actually mails.
 *
 * High-risk occasions:
 * - Grief: Sympathy, loss, bereavement
 * - Illness: Get well, health struggles, chronic conditions
 * - Apology: Making amends, reconciliation
 * - Professional: Workplace relationships
 */

/**
 * High-risk occasion categories
 */
export type HighRiskOccasion = 'grief' | 'illness' | 'apology' | 'professional';

/**
 * A guardrail rule with detection pattern and enforcement
 */
export interface GuardrailRule {
  id: string;
  name: string;
  /** Regex patterns that violate this rule */
  violationPatterns: RegExp[];
  /** Human-readable explanation of why this is problematic */
  explanation: string;
  /** Severity: 'hard' = block/reject, 'soft' = flag/warn */
  severity: 'hard' | 'soft';
  /** Suggested replacement or alternative phrasing */
  alternatives?: string[];
}

/**
 * Occasion-specific guardrail configuration
 */
export interface OccasionGuardrails {
  occasion: HighRiskOccasion;
  name: string;
  description: string;
  /** Hard bans - message MUST NOT contain these */
  hardBans: GuardrailRule[];
  /** Soft warnings - flag but allow with caution */
  softWarnings: GuardrailRule[];
  /** Required structural elements (for apology only) */
  requiredStructure?: string[];
  /** System prompt additions for this occasion */
  promptAdditions: string;
}

/**
 * Guardrails for each high-risk occasion
 */
export const OCCASION_GUARDRAILS: Record<HighRiskOccasion, OccasionGuardrails> = {
  grief: {
    occasion: 'grief',
    name: 'Grief & Loss',
    description: 'Sympathy cards, condolences, bereavement support',
    hardBans: [
      {
        id: 'grief_timeline',
        name: 'No Timeline Promises',
        violationPatterns: [
          /you('ll| will) (feel better|heal|move on|get over)/i,
          /time heals/i,
          /in time,? you/i,
          /soon you('ll| will)/i,
          /it gets easier/i,
        ],
        explanation: 'Never promise timelines for grief - everyone heals differently',
        severity: 'hard',
        alternatives: ["I'm here for you", 'Take all the time you need', 'No timeline for grief'],
      },
      {
        id: 'grief_platitudes',
        name: 'No Empty Platitudes',
        violationPatterns: [
          /everything happens for a reason/i,
          /they('re| are) in a better place/i,
          /at least (they|he|she|you)/i,
          /look on the bright side/i,
          /stay strong/i,
          /be strong/i,
          /keep your chin up/i,
          /every cloud has a silver lining/i,
          /god only gives us what we can handle/i,
          /they wouldn't want you to be sad/i,
        ],
        explanation: 'Platitudes minimize grief and feel dismissive',
        severity: 'hard',
        alternatives: ["I'm so sorry", 'I wish I had the right words', "I'm here"],
      },
      {
        id: 'grief_religious_assumption',
        name: 'No Religious Assumptions',
        violationPatterns: [
          /god('s| has) (a plan|called them|needed them)/i,
          /heaven needed (an angel|another|them)/i,
          /they('re| are) (an angel|with god|in heaven) now/i,
          /the lord works in mysterious ways/i,
          /god never gives us more than/i,
        ],
        explanation: "Don't assume religious beliefs unless user specified them",
        severity: 'hard',
        alternatives: ['Their memory lives on', 'They touched so many lives'],
      },
      {
        id: 'grief_comparison',
        name: 'No Comparisons',
        violationPatterns: [
          /i know (exactly )?how you feel/i,
          /when (my|i) .{0,30} (died|passed|lost)/i,
          /the same thing happened to me/i,
        ],
        explanation: "Focus on them, not your own experiences unless specifically relevant",
        severity: 'hard',
        alternatives: ["I can't imagine what you're going through"],
      },
    ],
    softWarnings: [
      {
        id: 'grief_move_on',
        name: 'Moving On Language',
        violationPatterns: [
          /move forward/i,
          /new chapter/i,
          /closure/i,
        ],
        explanation: 'Be careful with "moving on" language - grief has no timeline',
        severity: 'soft',
      },
    ],
    promptAdditions: `
GRIEF-SPECIFIC RULES (CRITICAL - violating these will hurt the recipient):
- Lead with presence: "I'm here" > "I understand"
- Acknowledge the loss directly and specifically
- Don't try to explain, rationalize, or find meaning in the loss
- Silence and presence are valid - you don't need to fill space
- Honor the person who passed if you know details about them
- NEVER promise timelines ("time heals", "you'll feel better")
- NEVER use platitudes ("better place", "everything happens for a reason")
- NEVER assume religious beliefs
- NEVER compare to your own losses
`,
  },

  illness: {
    occasion: 'illness',
    name: 'Illness & Health',
    description: 'Get well cards, health struggles, chronic conditions',
    hardBans: [
      {
        id: 'illness_medical_promises',
        name: 'No Medical Promises',
        violationPatterns: [
          /you('ll| will) (be fine|be okay|get better|recover|beat this|overcome)/i,
          /you('re| are) going to (be fine|make it|pull through)/i,
          /nothing to worry about/i,
          /i know you('ll| will) (beat|overcome|conquer)/i,
          /you('re| are) (a fighter|strong enough|tough enough)/i,
        ],
        explanation: 'Never make medical promises - outcomes are uncertain',
        severity: 'hard',
        alternatives: ["I'm rooting for you", 'Sending you strength', 'Thinking of you'],
      },
      {
        id: 'illness_minimizing',
        name: 'No Minimizing',
        violationPatterns: [
          /at least (it's not|you don't|you can still|they caught)/i,
          /could be worse/i,
          /it's (just|only) a/i,
          /you('re| are) lucky (it's|they|that)/i,
          /other people have it worse/i,
        ],
        explanation: "Don't minimize their health struggle",
        severity: 'hard',
        alternatives: ['This is hard', "I'm sorry you're going through this"],
      },
      {
        id: 'illness_unsolicited_advice',
        name: 'No Medical Advice',
        violationPatterns: [
          /you should (try|take|see|eat|drink|do)/i,
          /have you (tried|considered|thought about)/i,
          /my (friend|cousin|uncle|aunt|mom|dad|relative).{0,30}(cured|healed|fixed|helped).{0,20}(by|with|using)/i,
          /i read that/i,
          /studies show/i,
          /natural remedies/i,
          /have you tried (yoga|meditation|essential oils|vitamins)/i,
        ],
        explanation: "Don't offer unsolicited medical advice",
        severity: 'hard',
        alternatives: ['Let me know if there is anything I can do'],
      },
      {
        id: 'illness_toxic_positivity',
        name: 'No Toxic Positivity',
        violationPatterns: [
          /think positive/i,
          /positive thinking/i,
          /mind over matter/i,
          /attitude is everything/i,
          /just stay positive/i,
          /good vibes only/i,
        ],
        explanation: 'Toxic positivity dismisses real struggles',
        severity: 'hard',
        alternatives: ["It's okay to feel however you feel"],
      },
    ],
    softWarnings: [
      {
        id: 'illness_pressure',
        name: 'No Recovery Pressure',
        violationPatterns: [
          /can't wait (to|until) you('re| are)/i,
          /hurry (up and )?get better/i,
          /we need you back/i,
        ],
        explanation: 'Avoid pressure to recover quickly',
        severity: 'soft',
      },
    ],
    promptAdditions: `
ILLNESS-SPECIFIC RULES (CRITICAL - violating these will hurt the recipient):
- Acknowledge their experience without diagnosing or predicting outcomes
- Offer presence, not solutions: "I'm here" > "Have you tried..."
- "Thinking of you" is often enough - don't over-promise
- Don't assume outcome or timeline for recovery
- Respect their privacy - don't ask probing questions about their condition
- NEVER make medical promises ("you'll beat this")
- NEVER minimize ("at least it's not...", "could be worse")
- NEVER offer unsolicited medical advice or suggest treatments
- NEVER use toxic positivity ("stay positive!")
`,
  },

  apology: {
    occasion: 'apology',
    name: 'Apology & Repair',
    description: 'Making amends, reconciliation, owning mistakes',
    hardBans: [
      {
        id: 'apology_but_deflection',
        name: 'No "But" Deflection',
        violationPatterns: [
          /sorry,? but/i,
          /apologize,? but/i,
          /i was wrong,? but/i,
          /my bad,? but/i,
          /i messed up,? but/i,
        ],
        explanation: '"But" negates the apology - own it fully without deflection',
        severity: 'hard',
        alternatives: ['I was wrong. Full stop.', 'I made a mistake.'],
      },
      {
        id: 'apology_passive',
        name: 'No Passive Voice',
        violationPatterns: [
          /mistakes were made/i,
          /if (I|you|anyone) (was|were) hurt/i,
          /if (I|this|that) caused/i,
          /whatever (I did|happened)/i,
          /if (I|you) feel/i,
          /for any (hurt|pain|offense)/i,
        ],
        explanation: 'Use "I" statements - take direct responsibility',
        severity: 'hard',
        alternatives: ['I was wrong', 'I hurt you', 'I made a mistake'],
      },
      {
        id: 'apology_expectation',
        name: 'No Forgiveness Demands',
        violationPatterns: [
          /you (should|need to|have to|must) forgive/i,
          /i (said|already) sorry,? (so|now)/i,
          /can we (just)? move on/i,
          /let('s| us)? (just)? forget/i,
          /let('s| us)? put this behind us/i,
          /water under the bridge/i,
          /i hope you (can|will) forgive/i,
        ],
        explanation: 'Forgiveness is their choice and their timeline, not your demand',
        severity: 'hard',
        alternatives: ['Take whatever time you need', "I'll be here when you're ready"],
      },
      {
        id: 'apology_humor',
        name: 'No Humor/Sarcasm',
        violationPatterns: [
          /my bad/i,
          /oops/i,
          /whoops/i,
          /lol/i,
          /haha/i,
          /jk/i,
          /just kidding/i,
          /\u{1F605}/u, // sweat smile emoji
          /\u{1F62C}/u, // grimacing face emoji
        ],
        explanation: 'Apologies must be sincere - no deflecting with humor',
        severity: 'hard',
      },
      {
        id: 'apology_excuses',
        name: 'No Excuses',
        violationPatterns: [
          /i was (just|only) (trying|attempting)/i,
          /i didn't mean to/i,
          /i didn't (know|realize|think)/i,
          /you have to understand/i,
          /in my defense/i,
          /to be fair/i,
          /i was stressed/i,
          /i was tired/i,
          /i was (drunk|drinking)/i,
        ],
        explanation: 'Explaining WHY you did it shifts focus from the harm caused',
        severity: 'hard',
        alternatives: ['I take full responsibility', 'My reasons don\'t matter - the impact does'],
      },
      {
        id: 'apology_blame_shift',
        name: 'No Blame Shifting',
        violationPatterns: [
          /you made me/i,
          /you (also|too)/i,
          /you (always|never)/i,
          /if you hadn't/i,
          /it takes two/i,
          /we both/i,
        ],
        explanation: 'An apology is about YOUR actions, not theirs',
        severity: 'hard',
      },
    ],
    softWarnings: [],
    requiredStructure: [
      'OWN_IT: Acknowledge the specific action or behavior',
      'IMPACT: Recognize how it affected them (not your intent)',
      'REPAIR: State what you will do differently (if appropriate)',
      'SPACE: Respect their process and timeline',
    ],
    promptAdditions: `
APOLOGY STRUCTURE (follow this order - CRITICAL):
1. OWN IT: "I [specific action]" - be specific about what you did wrong
2. IMPACT: "I know this [hurt/affected you because...]" - show you understand the IMPACT, not your intent
3. REPAIR: "I will [specific change]" - only include if you can actually commit to it
4. SPACE: "Take whatever time you need" - respect their timeline

CRITICAL APOLOGY RULES:
- NEVER use "but" after sorry - it negates the apology
- NEVER use passive voice ("mistakes were made") - use "I" statements
- NEVER demand or expect forgiveness
- NEVER use humor to deflect
- NEVER explain WHY you did it - focus on the harm, not your reasons
- NEVER shift blame or mention what they did wrong
- An apology is about THEIR experience, not your intentions
`,
  },

  professional: {
    occasion: 'professional',
    name: 'Professional Relationships',
    description: 'Coworkers, managers, clients, mentors',
    hardBans: [
      {
        id: 'professional_intimate',
        name: 'No Intimate Language',
        violationPatterns: [
          /\blove you\b/i,
          /\bi love\b/i,
          /xoxo/i,
          /\bmiss you\b/i,
          /\bhugs?\b/i,
          /\bkiss(es)?\b/i,
          /\bsweetheart\b/i,
          /\bhoney\b/i,
          /\bbabe\b/i,
          /\bdarling\b/i,
          /\u{1F48B}/u, // kiss emoji
          /\u{1F618}/u, // kissing face emoji
          /\u{1F970}/u, // smiling face with hearts
          /\u{1F495}/u, // two hearts
          /\u{1F497}/u, // growing heart
        ],
        explanation: 'Keep workplace boundaries appropriate',
        severity: 'hard',
        alternatives: ['Best regards', 'Warmly', 'With appreciation', 'Cheers'],
      },
      {
        id: 'professional_overfamiliar',
        name: 'No Over-Familiarity',
        violationPatterns: [
          /\bbestie\b/i,
          /\bbff\b/i,
          /\bsoul ?mate\b/i,
          /\bmy person\b/i,
          /\bother half\b/i,
        ],
        explanation: 'Maintain professional distance even with friendly colleagues',
        severity: 'hard',
      },
      {
        id: 'professional_personal_comments',
        name: 'No Inappropriate Personal Comments',
        violationPatterns: [
          /you look (hot|sexy|gorgeous|stunning)/i,
          /nice (body|legs|figure)/i,
          /what are you wearing/i,
        ],
        explanation: 'Keep comments work-appropriate',
        severity: 'hard',
      },
    ],
    softWarnings: [
      {
        id: 'professional_personal_life',
        name: 'Careful with Personal Life References',
        violationPatterns: [
          /your (family|kids|spouse|partner|husband|wife|boyfriend|girlfriend)/i,
          /at home/i,
          /personal life/i,
        ],
        explanation: 'Reference personal life carefully in work contexts',
        severity: 'soft',
      },
    ],
    promptAdditions: `
PROFESSIONAL BOUNDARIES:
- Warm but not intimate - think "respected colleague" not "close friend"
- Focus on professional qualities and work achievements
- Appropriate closings: "Best regards," "Warmly," "With appreciation," "Cheers"
- NEVER: "Love," "XOXO," "Miss you," or romantic/intimate language
- Keep any personal references work-appropriate
- When in doubt, err on the side of formality
`,
  },
};

/**
 * Detect which high-risk occasions apply to the current context
 */
export function detectHighRiskOccasions(answers: Record<string, any>): HighRiskOccasion[] {
  const occasions: HighRiskOccasion[] = [];

  const occasion = (answers.occasion || answers.lifeEvent || answers.specialDay || '').toLowerCase();
  const vibes = Array.isArray(answers.vibe) ? answers.vibe : [answers.vibe || ''];
  const vibeStr = vibes.join(' ').toLowerCase();
  const relationship = (answers.relationshipType || '').toLowerCase();

  // Grief detection
  if (
    occasion.includes('loss') ||
    occasion.includes('passed') ||
    occasion.includes('passing') ||
    occasion.includes('death') ||
    occasion.includes('died') ||
    occasion.includes('sympathy') ||
    occasion.includes('condolence') ||
    occasion.includes('memorial') ||
    occasion.includes('funeral') ||
    occasion.includes('bereavement')
  ) {
    occasions.push('grief');
  }

  // Illness detection
  if (
    occasion.includes('going through') ||
    occasion.includes('get well') ||
    occasion.includes('sick') ||
    occasion.includes('ill') ||
    occasion.includes('hospital') ||
    occasion.includes('surgery') ||
    occasion.includes('recovery') ||
    occasion.includes('diagnosis') ||
    occasion.includes('treatment') ||
    occasion.includes('cancer') ||
    occasion.includes('health')
  ) {
    occasions.push('illness');
  }

  // Apology detection
  if (
    occasion.includes('messed up') ||
    occasion.includes('apolog') ||
    occasion.includes('sorry') ||
    occasion.includes('forgive') ||
    occasion.includes('repair') ||
    occasion.includes('amend') ||
    vibeStr.includes('apologetic')
  ) {
    occasions.push('apology');
  }

  // Professional detection
  if (
    relationship.includes('coworker') ||
    relationship.includes('professional') ||
    relationship.includes('boss') ||
    relationship.includes('manager') ||
    relationship.includes('client') ||
    relationship.includes('mentor') ||
    relationship.includes('colleague') ||
    relationship.includes('employee') ||
    relationship.includes('direct report') ||
    relationship.includes('work')
  ) {
    occasions.push('professional');
  }

  return occasions;
}

/**
 * Result of guardrail validation
 */
export interface GuardrailViolation {
  ruleId: string;
  ruleName: string;
  occasion: HighRiskOccasion;
  matchedText: string;
  severity: 'hard' | 'soft';
  explanation: string;
  alternatives?: string[];
}

export interface GuardrailValidationResult {
  isValid: boolean;
  violations: GuardrailViolation[];
  hardViolations: GuardrailViolation[];
  softViolations: GuardrailViolation[];
}

/**
 * Validate a message against applicable guardrails
 */
export function validateMessage(
  message: string,
  applicableOccasions: HighRiskOccasion[]
): GuardrailValidationResult {
  const violations: GuardrailViolation[] = [];

  for (const occasionType of applicableOccasions) {
    const guardrails = OCCASION_GUARDRAILS[occasionType];

    // Check hard bans
    for (const rule of guardrails.hardBans) {
      for (const pattern of rule.violationPatterns) {
        const match = message.match(pattern);
        if (match) {
          violations.push({
            ruleId: rule.id,
            ruleName: rule.name,
            occasion: occasionType,
            matchedText: match[0],
            severity: rule.severity,
            explanation: rule.explanation,
            alternatives: rule.alternatives,
          });
          break; // Only report first match per rule
        }
      }
    }

    // Check soft warnings
    for (const rule of guardrails.softWarnings) {
      for (const pattern of rule.violationPatterns) {
        const match = message.match(pattern);
        if (match) {
          violations.push({
            ruleId: rule.id,
            ruleName: rule.name,
            occasion: occasionType,
            matchedText: match[0],
            severity: rule.severity,
            explanation: rule.explanation,
            alternatives: rule.alternatives,
          });
          break;
        }
      }
    }
  }

  const hardViolations = violations.filter(v => v.severity === 'hard');
  const softViolations = violations.filter(v => v.severity === 'soft');

  return {
    isValid: hardViolations.length === 0,
    violations,
    hardViolations,
    softViolations,
  };
}

/**
 * Get combined prompt additions for all applicable occasions
 */
export function getGuardrailPromptAdditions(occasions: HighRiskOccasion[]): string {
  if (occasions.length === 0) return '';

  const additions = occasions
    .map(o => OCCASION_GUARDRAILS[o].promptAdditions)
    .join('\n\n');

  return `
--- HIGH-RISK OCCASION GUARDRAILS ---
The following occasions have been detected: ${occasions.join(', ')}

${additions}
--- END GUARDRAILS ---
`.trim();
}

/**
 * Get a human-readable summary of guardrail violations for display
 */
export function formatViolationSummary(result: GuardrailValidationResult): string {
  if (result.isValid && result.softViolations.length === 0) {
    return 'Message passes all guardrails.';
  }

  const lines: string[] = [];

  if (result.hardViolations.length > 0) {
    lines.push('BLOCKED - Message contains problematic content:');
    for (const v of result.hardViolations) {
      lines.push(`  - "${v.matchedText}": ${v.explanation}`);
      if (v.alternatives && v.alternatives.length > 0) {
        lines.push(`    Try instead: ${v.alternatives.join(' | ')}`);
      }
    }
  }

  if (result.softViolations.length > 0) {
    lines.push('WARNINGS - Consider revising:');
    for (const v of result.softViolations) {
      lines.push(`  - "${v.matchedText}": ${v.explanation}`);
    }
  }

  return lines.join('\n');
}
