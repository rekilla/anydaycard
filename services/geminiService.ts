import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedCard, DesignOption, DesignOptions, CardFormat, CoverTextPreference } from "../types";
import { recommendDesignStarter, DESIGN_STARTERS } from "./designSystem";

// Initialize Gemini Client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('VITE_GEMINI_API_KEY environment variable is not set. Please add it to your .env.local file.');
}
const ai = new GoogleGenAI({ apiKey });

const TEXT_MODEL = 'gemini-1.5-flash'; // Text generation model
const IMAGE_MODEL = 'gemini-2.5-flash-image'; // Image generation model ("Nano Banana")

const MESSAGE_SYSTEM_INSTRUCTION = `
AnyDayCard — Safe Emotional Message Generation

You are an AI writer for AnyDayCard, a product that creates deeply personal greeting card messages based on user-provided relationship details and memories.

Your role is to write emotionally resonant, specific, and human-sounding card messages while maintaining strict emotional safety, appropriateness, and respect.

NON-NEGOTIABLE SAFETY GUARDRAILS:

1. No Harmful or Manipulative Language
- Never generate language that guilt-trips, pressures, or emotionally coerces.
- Avoid phrases like "I can't live without you" or "You owe me".

2. Apology & Repair Rules
- Acknowledge harm without minimizing it.
- Do not frame apologies as transactional.
- Avoid excessive self-flagellation.

3. Illness, Grief & Vulnerability
- Avoid medical advice or timelines ("you'll be okay soon").
- Avoid platitudes ("everything happens for a reason").
- Prefer presence and patience.

4. Relationship Appropriateness
- Professional: Respectful, warm, NON-INTIMATE. No "Love" or overly personal declarations.
- New Dating: Light, curious, non-committal.
- Friendship: Mutual, balanced, not romantic unless specified.

5. Humor Safety
- Humor must be inclusive and kind.
- No mean-spirited sarcasm or punching down.
- If humor conflicts with sensitivity, drop humor.

6. Specificity Without Exposure
- Use user details but avoid revealing secrets or embarrassing facts.
- Transform sensitive input into gentle, symbolic language if needed.

ABSOLUTE RULE:
If the user's input suggests intensity that could cause harm or discomfort, dial it down rather than amplifying it. A card should leave the recipient feeling seen, not cornered.

Generate 4 distinct options that vary in tone, structure, and length.
`;

const DESIGN_SYSTEM_INSTRUCTION = `
You are an expert art director.
Your goal is to describe a visual scene for a greeting card cover that matches the emotion of the chosen message and the user's details.
Focus on symbolic, meaningful imagery.
`;

const TEMPLATE_PROMPT_INSTRUCTION = `
You are an expert art director for greeting card design.
Generate short, specific subject prompts that are print-ready and fit the requested template style.
The prompts must be image-only (no text, lettering, or typography).
Front prompts should feel like a hero cover illustration.
Back prompts should be subtle, low-contrast backgrounds suitable for overlaying readable message text.
Return JSON with "frontPrompts" (2 items) and "backPrompts" (2 items), each 1 sentence.
`;

/**
 * Step 1: Generate 4 distinct message options
 */
const BANNED_PHRASES = [
  'you owe me',
  "can't live without you",
  'if you loved me',
  'prove it',
];

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

const generateImageFromPrompt = async (finalImagePrompt: string): Promise<string> => {
  let imageBase64 = '';
  let attempts = 0;
  const MAX_RETRIES = 1; // 1 retry means 2 total attempts

  while (attempts <= MAX_RETRIES) {
    try {
      attempts++;
      const imageResponse = await ai.models.generateContent({
        model: IMAGE_MODEL,
        contents: {
          parts: [{ text: finalImagePrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
          },
        },
      });

      if (imageResponse.candidates?.[0]?.content?.parts) {
        for (const part of imageResponse.candidates[0].content.parts) {
          if (part.inlineData) {
            imageBase64 = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
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

export const generateMessageOptions = async (
  answers: Record<string, any>,
  attempt: number = 0,
  previousMessages: string[] = []
): Promise<string[]> => {
  const model = TEXT_MODEL;
  const safetyPrompt = MESSAGE_SYSTEM_INSTRUCTION.trim();
  if (!safetyPrompt) {
    throw new Error('Message safety system prompt is missing.');
  }

  const adjustmentNote = attempt > 0
    ? `Attempt ${attempt}: Focus on higher specificity, safe warmth, and avoid repeating prior options.`
    : "First attempt.";

  const previousBlock = previousMessages.length > 0
    ? `Previously generated options (avoid reusing phrasing): ${JSON.stringify(previousMessages)}`
    : "";

  const prompt = `
    Generate 4 distinct greeting card message options for:
    Recipient Name: ${answers.name}
    Relationship: ${answers.relationshipType}
    Occasion: ${answers.occasion}
    Vibe: ${Array.isArray(answers.vibe) ? answers.vibe.join(', ') : answers.vibe}
    
    Specific Details & Context:
    ${JSON.stringify(answers, null, 2)}
    
    REQUIREMENTS:
    - Option 1: Short & Punchy (Direct, maybe slightly witty if vibe fits)
    - Option 2: Heartfelt & Warm (Focus on the relationship depth)
    - Option 3: Narrative (Reference the specific memory/detail provided directly)
    - Option 4: A different angle (e.g. Poetic, or Casual, or Deep depending on the vibe)
    - Avoid guilt, pressure, or manipulative language.
    - Use at least one specific detail when available.
    
    ${adjustmentNote}
    ${previousBlock}
    
    Ensure all options feel like they were written by the user, not a robot.
    
    Output JSON Schema:
    {
      "options": ["string", "string", "string", "string"]
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
              items: { type: Type.STRING }
            }
          }
        },
      },
    });

    const json = JSON.parse(response.text || "{}");
    if (json.options && Array.isArray(json.options)) {
      const processed = postProcessOptions(json.options, answers);
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
  const template = DESIGN_STARTERS[templateId] || recommendDesignStarter(answers);
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

  const prompt = `
    Template: ${template.name}
    Template Description: ${template.description}

    Context:
    - Recipient: ${answers.name || 'Unknown'}
    - Relationship: ${answers.relationshipType || 'Unknown'}
    - Occasion: ${answers.occasion || 'Unknown'}
    - Vibe: ${Array.isArray(answers.vibe) ? answers.vibe.join(', ') : answers.vibe || 'Unspecified'}
    - Selected Message: "${selectedMessage}"
    - Card format: ${cardFormatLabel}
    - Cover text preference: ${coverTextPreference || 'unspecified'}

    Specific details (use when possible):
    ${detailLines.length > 0 ? detailLines.join('\n') : 'No extra details provided.'}

    ${toneNote}
    ${coverTextGuidance}

    Return two front prompts and two back prompts.
  `;

  let frontPrompts: string[] = [];
  let backPrompts: string[] = [];

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: TEMPLATE_PROMPT_INSTRUCTION,
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
    const frontTextInstruction = coverTextPreference === 'text-on-image'
      ? 'greeting card cover, leave clean space for a short cover line, no text.'
      : 'greeting card cover, no text.';
    const finalPrompt = `${basePrompt}. ${template.imagePromptSuffix}. ${frontTextInstruction}`;
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
    const finalPrompt = `${basePrompt}. ${template.imagePromptSuffix}. subtle, low contrast, extra whitespace for text, no text.`;
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
        systemInstruction: DESIGN_SYSTEM_INSTRUCTION,
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
