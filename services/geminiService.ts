import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedCard, DesignOption, DesignOptions, CardFormat, CoverTextPreference } from "../types";
import { recommendDesignStarter, DESIGN_STARTERS } from "./designSystem";
import {
  getTextSystemPrompt,
  BANNED_PHRASES,
  TEMPLATE_GENERATION_INSTRUCTION,
  ART_DIRECTION_INSTRUCTION,
  getArtDirectionInstruction,
  buildImagePrompt,
  getFallbackPrompts,
  getEffectiveTemplateId,
  getHolidayOverlayInfo,
} from "./prompts";

// Initialize Gemini Client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('VITE_GEMINI_API_KEY environment variable is not set. Please add it to your .env.local file.');
}
const ai = new GoogleGenAI({ apiKey });

const TEXT_MODEL = 'gemini-2.0-flash'; // Text generation model
const IMAGE_MODEL = 'imagen-4.0-generate-001'; // Imagen 4 for high-quality image generation

const passesQualityChecks = (message: string, answers: Record<string, any>) => {
  const text = message.toLowerCase();
  const hasName = answers.name ? text.includes(String(answers.name).toLowerCase()) : true;
  const lengthOk = message.trim().length >= 40 && message.trim().length <= 600;
  const hasOccasion = answers.occasion ? text.includes(String(answers.occasion).toLowerCase()) : true;
  const hasBanned = BANNED_PHRASES.some((phrase) => text.includes(phrase));
  const negativeSignals = ['hate', 'worthless', 'ruined', 'never', 'always', 'manipulate'];
  const negativeHits = negativeSignals.filter((word) => text.includes(word)).length;
  const sentimentOk = negativeHits <= 1;

  return {
    isValid: lengthOk && !hasBanned && sentimentOk,
    hasName,
    hasOccasion,
    lengthOk,
  };
};

const postProcessOptions = (options: string[], answers: Record<string, any>) => {
  const cleaned = options
    .map((msg) => msg.replace(/\s+/g, ' ').trim())
    .filter((msg) => msg.length > 0);

  const filtered = cleaned.filter((msg) => {
    const checks = passesQualityChecks(msg, answers);
    return checks.isValid;
  });

  return filtered.length >= 4 ? filtered.slice(0, 4) : cleaned.slice(0, 4);
};

/**
 * Generate an image from a prompt using Imagen 4
 * @param finalImagePrompt - The complete image prompt
 * @param aspectRatio - Aspect ratio for the image (default: '1:1')
 *   Supported: '1:1', '3:4', '4:3', '9:16', '16:9'
 */
const generateImageFromPrompt = async (
  finalImagePrompt: string,
  aspectRatio: string = '1:1'
): Promise<string> => {
  let imageBase64 = '';
  let attempts = 0;
  const MAX_RETRIES = 1; // 1 retry means 2 total attempts

  while (attempts <= MAX_RETRIES) {
    try {
      attempts++;

      // Use Imagen 4 API via REST call (predict endpoint)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:predict?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instances: [{ prompt: finalImagePrompt }],
            parameters: {
              sampleCount: 1,
              aspectRatio: aspectRatio,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.predictions?.[0]?.bytesBase64Encoded) {
        const mimeType = data.predictions[0].mimeType || 'image/png';
        imageBase64 = `data:${mimeType};base64,${data.predictions[0].bytesBase64Encoded}`;
      }

      if (imageBase64) {
        break;
      }
      throw new Error("No images returned");
    } catch (imgError) {
      console.warn(`Image generation attempt ${attempts} failed:`, imgError);
      if (attempts > MAX_RETRIES) {
        throw new Error("Failed to generate image after retries.");
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return imageBase64;
};

/**
 * Card message option with structured output matching Cardwriter format
 */
export interface CardMessageOption {
  frontText: string;
  insideMessage: string;
  signOff: string;
}

export const generateMessageOptions = async (
  answers: Record<string, any>,
  attempt: number = 0,
  previousMessages: string[] = []
): Promise<string[]> => {
  const model = TEXT_MODEL;

  // Get context-appropriate system prompt from prompt library
  // Pass full answers to enable guardrail detection
  const promptOccasion = answers.specialDay || answers.lifeEvent || answers.occasion;
  const systemPrompt = getTextSystemPrompt(
    promptOccasion,
    answers.relationshipType,
    Array.isArray(answers.vibe) ? answers.vibe : [answers.vibe],
    answers // Pass full answers for guardrail detection
  );
  const safetyPrompt = systemPrompt.content;

  // QA hint from previous scoring (if regenerating due to low scores)
  const qaHint = answers._qaHint
    ? `\n\nIMPROVEMENT FOCUS (previous generation scored low):\n${answers._qaHint}`
    : '';

  // Vibe-specific instructions from mapping
  const vibeInstructions = answers._vibeInstructions
    ? `\n\n${answers._vibeInstructions}`
    : '';

  const adjustmentNote = attempt > 0
    ? `Attempt ${attempt}: Focus on higher specificity, safe warmth, and avoid repeating prior options.${qaHint}`
    : `First attempt.${vibeInstructions}`;

  const previousBlock = previousMessages.length > 0
    ? `Previously generated options (avoid reusing phrasing): ${JSON.stringify(previousMessages)}`
    : "";

  // Determine the occasion based on cardType
  const getOccasionContext = () => {
    if (answers.cardType === 'special_day' && answers.specialDay) {
      return answers.specialDay;
    }
    if (answers.cardType === 'life_event' && answers.lifeEvent) {
      return answers.lifeEvent;
    }
    return answers.occasion || 'a personal moment';
  };

  // Determine special day for Cardwriter prompt
  const getSpecialDay = () => {
    if (answers.cardType === 'special_day' && answers.specialDay) {
      const specialDayMap: Record<string, string> = {
        "Valentine's Day": 'valentines_day',
        "Mother's Day": 'mothers_day',
        "Father's Day": 'fathers_day',
        'Christmas': 'christmas',
        'Hanukkah': 'hanukkah',
        'New Year': 'new_year',
        'Thanksgiving': 'thanksgiving',
        'Easter': 'easter',
      };
      return specialDayMap[answers.specialDay] || 'other_or_none';
    }
    return 'other_or_none';
  };

  const occasionContext = getOccasionContext();
  const specialDay = getSpecialDay();

  // Build user details object for Cardwriter format
  const userDetails: Record<string, string> = {};
  if (answers.recentMoment) userDetails.recentMoment = answers.recentMoment;
  if (answers.sharedMemory) userDetails.sharedMemory = answers.sharedMemory;
  if (answers.insideJoke) userDetails.insideJoke = answers.insideJoke;
  if (answers.whatYouAdmire) userDetails.whatYouAdmire = answers.whatYouAdmire;
  if (answers.whatTheyDid) userDetails.whatTheyDid = answers.whatTheyDid;
  if (answers.taughtYou) userDetails.taughtYou = answers.taughtYou;
  if (answers.alwaysSays) userDetails.alwaysSays = answers.alwaysSays;
  if (answers.proudMoment) userDetails.proudMoment = answers.proudMoment;
  if (answers.theirThing) userDetails.theirThing = answers.theirThing;
  if (answers.theirQuirk) userDetails.theirQuirk = answers.theirQuirk;
  if (answers.anyDetails) userDetails.anyDetails = answers.anyDetails;

  const prompt = `
Generate 4 distinct card text options. For each, provide FRONT_TEXT, INSIDE_MESSAGE, and SIGN_OFF.

INPUTS:
- recipientName: ${answers.name || 'Friend'}
- relationshipType: ${answers.relationshipType || 'friend'}
- occasion: ${occasionContext}
- specialDay: ${specialDay}
- vibe: ${Array.isArray(answers.vibe) ? answers.vibe.join(', ') : answers.vibe || 'heartfelt'}
${answers.humorType ? `- humorType: ${answers.humorType}` : ''}
${answers.heartfeltDepth ? `- heartfeltDepth: ${answers.heartfeltDepth}` : ''}
- userDetails: ${Object.keys(userDetails).length > 0 ? JSON.stringify(userDetails) : 'none provided'}
${Array.isArray(answers.quickTraits) && answers.quickTraits.length > 0 ? `- quickTraits: ${answers.quickTraits.join(', ')}` : ''}
${answers.senderName ? `- senderName: ${answers.senderName}` : ''}

VARIATION REQUIREMENTS:
- Option 1: Short & punchy, direct tone
- Option 2: Heartfelt & warm, deeper emotional connection
- Option 3: Memory/detail-forward, anchor on specific input if available
- Option 4: Different angle based on vibe (playful, poetic, casual, or bold)

${adjustmentNote}
${previousBlock}

Return exactly 4 options in this JSON format:
{
  "options": [
    {
      "frontText": "1-4 words for card cover (or empty string if design-only)",
      "insideMessage": "45-110 word message following Cardwriter structure rules",
      "signOff": "1-3 word closing with optional sender name"
    }
  ]
}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: safetyPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  frontText: { type: Type.STRING },
                  insideMessage: { type: Type.STRING },
                  signOff: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const json = JSON.parse(response.text || "{}");
    if (json.options && Array.isArray(json.options)) {
      // Combine structured output into display strings for backward compatibility
      // Format: "insideMessage\n\nsignOff" (frontText stored separately if needed)
      const combinedMessages = json.options.map((opt: CardMessageOption) => {
        const message = opt.insideMessage || '';
        const signOff = opt.signOff || '';
        return signOff ? `${message}\n\n${signOff}` : message;
      });

      // Store frontText options in answers for later use in design generation
      answers._frontTextOptions = json.options.map((opt: CardMessageOption) => opt.frontText || '');

      const processed = postProcessOptions(combinedMessages, answers);
      if (processed.length === 4) {
        return processed;
      }
    }
    return ["Thinking of you...", "Happy Birthday!", "Hope you have a great day.", "Cheers!"];
  } catch (error) {
    console.error("Message generation error:", error);
    // Gentle warning logic: If generation failed, it might be due to safety filters on the input.
    throw new Error("We couldn't generate a message for this request. Please try adjusting your details or tone.");
  }
};

export const generateDesignOptions = async (
  answers: Record<string, any>,
  selectedMessage: string,
  templateId: string,
  isHeavilyEdited: boolean = false,
  preferences?: {
    cardFormat?: CardFormat | null;
    coverTextPreference?: CoverTextPreference | null;
  }
): Promise<DesignOptions> => {
  const model = TEXT_MODEL;

  // Get effective template (may be overridden by holiday conflict resolution)
  // e.g., Holiday + apology → letterpress_minimal
  const { templateId: effectiveTemplateId, wasOverridden, reason } =
    getEffectiveTemplateId(templateId, answers);

  if (wasOverridden) {
    console.info(`[Holiday Overlay] Template overridden: ${reason}`);
  }

  // Get holiday overlay info for logging/debugging
  const holidayInfo = getHolidayOverlayInfo(answers);
  if (holidayInfo.holidayId) {
    console.info(`[Holiday Overlay] Detected: ${holidayInfo.holidayId}, conflict: ${holidayInfo.conflictResolution.hasConflict}`);
  }

  const template = DESIGN_STARTERS[effectiveTemplateId] || recommendDesignStarter(answers);
  const cardFormat = preferences?.cardFormat ?? null;
  const coverTextPreference = preferences?.coverTextPreference ?? null;

  const toneNote = isHeavilyEdited
    ? "Prioritize the selected message tone over the original vibe if they conflict."
    : "Balance the selected message tone with the user's vibe choices.";

  const cardFormatLabel = cardFormat === 'book-open'
    ? 'Book open (folded card)'
    : cardFormat === 'single-card'
      ? 'Single card (postcard style)'
      : 'Unspecified';

  const coverTextGuidance = coverTextPreference === 'text-on-image'
    ? 'Front design should leave clear space for a short cover line. Do not include any text.'
    : 'Front design should be image-only with no reserved text space. Do not include any text.';

  const detailLines = [
    answers.recentMoment ? `Recent moment: "${answers.recentMoment}"` : "",
    answers.theirThing ? `Their thing: "${answers.theirThing}"` : "",
    answers.insideJoke ? `Inside joke: "${answers.insideJoke}"` : "",
    answers.sharedMemory ? `Shared memory: "${answers.sharedMemory}"` : "",
    answers.whatYouAdmire ? `Admire: "${answers.whatYouAdmire}"` : "",
    answers.partnerSubtype ? `Partner subtype: "${answers.partnerSubtype}"` : "",
    answers.duration ? `Relationship duration: "${answers.duration}"` : "",
    Array.isArray(answers.quickTraits) && answers.quickTraits.length > 0
      ? `Traits: ${answers.quickTraits.join(', ')}`
      : "",
    answers.anyDetails ? `Details: "${answers.anyDetails}"` : "",
  ].filter(Boolean);

  // Determine the occasion based on cardType for design
  const getDesignOccasion = () => {
    if (answers.cardType === 'special_day' && answers.specialDay) {
      return answers.specialDay;
    }
    if (answers.cardType === 'life_event' && answers.lifeEvent) {
      return answers.lifeEvent;
    }
    return answers.occasion || 'Unknown';
  };

  const designOccasion = getDesignOccasion();

  const prompt = `
    Template: ${template.name}
    Template Description: ${template.description}

    Context:
    - Recipient: ${answers.name || 'Unknown'}
    - Relationship: ${answers.relationshipType || 'Unknown'}
    - Card Type: ${answers.cardType === 'special_day' ? 'Special Day/Holiday' : answers.cardType === 'life_event' ? 'Life Event' : 'Personal'}
    - Occasion: ${designOccasion}
    - Vibe: ${Array.isArray(answers.vibe) ? answers.vibe.join(', ') : answers.vibe || 'Unspecified'}
    - Selected Message: "${selectedMessage}"
    - Card format: ${cardFormatLabel}
    - Cover text preference: ${coverTextPreference || 'unspecified'}

    Specific details (use when possible):
    ${detailLines.length > 0 ? detailLines.join('\n') : 'No extra details provided.'}

    ${toneNote}
    ${coverTextGuidance}

    If this is for a specific holiday (like Valentine's Day, Christmas, etc.), incorporate subtle thematic elements that fit the occasion.

    Return two front prompts and two back prompts.
  `;

  let frontPrompts: string[] = [];
  let backPrompts: string[] = [];

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: TEMPLATE_GENERATION_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            frontPrompts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            backPrompts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const json = JSON.parse(response.text || "{}");
    frontPrompts = Array.isArray(json.frontPrompts) ? json.frontPrompts : [];
    backPrompts = Array.isArray(json.backPrompts) ? json.backPrompts : [];
  } catch (error) {
    console.warn("Prompt generation failed, using fallback prompts.", error);
  }

  if (frontPrompts.length < 2) {
    frontPrompts = [
      `A single meaningful object symbolizing ${answers.occasion || 'this moment'}, thoughtfully arranged`,
      `A warm, minimalist scene that reflects ${answers.relationshipType || 'your relationship'} and quiet connection`,
    ];
  }

  if (backPrompts.length < 2) {
    backPrompts = [
      'Subtle abstract shapes with generous negative space and soft texture',
      'A gentle gradient wash with faint organic patterns and calm movement',
    ];
  }

  const frontOptions: DesignOption[] = [];
  for (let i = 0; i < 2; i += 1) {
    const basePrompt = frontPrompts[i] || frontPrompts[0];
    // Use buildImagePrompt with effectiveTemplateId (holiday-aware) and answers for personalization
    // Holiday overlay is automatically applied inside buildImagePrompt based on answers.specialDay
    const finalPrompt = buildImagePrompt(
      basePrompt,
      effectiveTemplateId,
      'front',
      answers,
      coverTextPreference
    );
    const image = await generateImageFromPrompt(finalPrompt);
    frontOptions.push({
      id: `front-${i + 1}`,
      image,
      prompt: basePrompt,
    });
  }

  const backOptions: DesignOption[] = [];
  for (let i = 0; i < 2; i += 1) {
    const basePrompt = backPrompts[i] || backPrompts[0];
    // Use buildImagePrompt with effectiveTemplateId (holiday-aware) and answers for personalization
    const finalPrompt = buildImagePrompt(
      basePrompt,
      effectiveTemplateId,
      'back',
      answers
    );
    const image = await generateImageFromPrompt(finalPrompt);
    backOptions.push({
      id: `back-${i + 1}`,
      image,
      prompt: basePrompt,
    });
  }

  return { front: frontOptions, back: backOptions };
};

/**
 * Step 2: Generate Design (Image + Final Data) based on selected message
 * @param isHeavilyEdited - If true, the user significantly changed the message. 
 * We should prioritize the literal text over the initial "vibe" parameters for the art direction.
 */
export const generateCardDesign = async (
  answers: Record<string, any>,
  selectedMessage: string,
  isHeavilyEdited: boolean = false
): Promise<GeneratedCard> => {
  const model = TEXT_MODEL;
  
  // 1. Get Design Recommendation based on inputs
  const designStarter = recommendDesignStarter(answers);

  // Logic: Logic for Tone Mismatch Handling
  // If the user rewrote the message, the original 'answers' might contradict the new text.
  // We explicitly tell the model to prioritize the text in that case.
  const overrideInstruction = isHeavilyEdited 
    ? "ALERT: The user has manually rewritten the message significantly. The emotional tone of the 'Selected Message' takes precedence over the 'User Answers' or 'Design Style' if they conflict. Analyze the new message text deeply for the visual cue."
    : "Ensure the visual fits the context of the user answers and the message.";

  // Construct the prompt for the Art Direction
  const prompt = `
    Create a visual art prompt for a greeting card.
    
    ${overrideInstruction}
    
    Context:
    - User Answers: ${JSON.stringify(answers)}
    - Selected Message (The visual should support this text): "${selectedMessage}"
    
    --- ART DIRECTION INSTRUCTIONS ---
    Internal Design Style: "${designStarter.name}"
    Style Description: ${designStarter.description}

    Your task:
    Describe a specific subject, object, or scene that fits the user's context AND the emotion of the selected message.
    Crucially, ensure this subject matter fits the "${designStarter.name}" style described above.
    
    IMPORTANT: 
    - DO NOT include generic style keywords (like "watercolor", "minimalist") in the output. We append those automatically.
    - Focus on the SUBJECT MATTER (e.g., "A single red bicycle leaning against a tree" or "Abstract geometric shapes dancing").
    
    Output JSON Schema:
    {
      "artPrompt": "string"
    }
  `;

  try {
    // A. Generate Art Prompt text
    const textResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: ART_DIRECTION_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            artPrompt: { type: Type.STRING },
          },
        },
      },
    });

    const jsonResponse = JSON.parse(textResponse.text || "{}");
    const { artPrompt } = jsonResponse;

    // B. Generate Image
    const finalImagePrompt = `${artPrompt}. ${designStarter.imagePromptSuffix}. aesthetic, no text, card cover art.`;
    const imageBase64 = await generateImageFromPrompt(finalImagePrompt);

    return {
      id: crypto.randomUUID(), // Temp ID
      status: 'draft',
      createdAt: new Date().toISOString(),
      message: selectedMessage,
      artPrompt: finalImagePrompt,
      image: imageBase64,
    };

  } catch (error) {
    console.error("Design generation error:", error);
    throw new Error("Failed to generate card design.");
  }
};
