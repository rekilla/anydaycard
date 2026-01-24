/**
 * Print Specifications
 *
 * This module defines the exact print constraints for card generation,
 * including dimensions, DPI requirements, bleed areas, and typography rules.
 */

import type { CardSizeName, PaperFinish, PaperWeight, CardFormat } from '../types';

/**
 * Dimensions in inches and pixels at 300 DPI
 */
export interface CardDimensions {
  widthInches: number;
  heightInches: number;
  widthPixels300DPI: number;
  heightPixels300DPI: number;
}

/**
 * Bleed and safe area specifications
 */
export interface BleedSpec {
  /** Bleed extends beyond trim (typically 0.125") */
  bleedInches: number;
  /** Safe margin from trim edge (typically 0.25") */
  safeMarginInches: number;
}

/**
 * Front image requirements
 */
export interface FrontImageSpec {
  /** Aspect ratio string (e.g., "5:7", "2:3") */
  aspectRatio: string;
  /** Minimum DPI for print quality */
  minDPI: number;
  /** Recommended DPI for best quality */
  recommendedDPI: number;
  /** Minimum width in pixels */
  minWidthPixels: number;
  /** Minimum height in pixels */
  minHeightPixels: number;
  /** Imagen API aspect ratio to use */
  imagenAspectRatio: string;
}

/**
 * Complete print specification for a card size
 */
export interface PrintSpecification {
  id: CardSizeName;
  displayName: string;
  description: string;
  /** Final card size after cutting */
  trimSize: CardDimensions;
  /** Size including bleed for printing */
  withBleed: CardDimensions;
  /** Safe zone for critical content */
  safeArea: CardDimensions;
  /** Bleed specifications */
  bleedSpec: BleedSpec;
  /** Can be used as folded card */
  supportsFolded: boolean;
  /** Can be used as postcard */
  supportsPostcard: boolean;
  /** Front image requirements */
  frontImage: FrontImageSpec;
  /** Lob API size if compatible */
  lobSize?: '4x6' | '6x9' | '6x11';
  /** Whether Lob can print this size */
  lobCompatible: boolean;
}

/**
 * Inside message typography specifications
 */
export interface MessageTypographySpec {
  id: string;
  name: string;
  /** Maximum characters total */
  maxCharacters: number;
  /** Maximum number of lines */
  maxLines: number;
  /** Recommended font size in points */
  recommendedFontSizePt: number;
  /** Minimum font size in points */
  minFontSizePt: number;
  /** Maximum font size in points */
  maxFontSizePt: number;
  /** Line height multiplier */
  lineHeightMultiplier: number;
  /** Margins in inches */
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  /** Safe print width for text in inches */
  safePrintWidthInches: number;
  /** Maximum characters per line */
  maxCharactersPerLine: number;
}

/**
 * Envelope option
 */
export interface EnvelopeOption {
  id: string;
  displayName: string;
  style: 'standard' | 'square' | 'invitation';
  colorOptions: string[];
  fitsCardSizes: CardSizeName[];
  priceModifierCents: number;
}

/**
 * Paper finish option
 */
export interface FinishOption {
  id: string;
  displayName: string;
  finish: PaperFinish;
  weight: PaperWeight;
  description: string;
  priceModifierCents: number;
  availableForFormats: CardFormat[];
}

// ============================================
// CARD SIZE SPECIFICATIONS
// ============================================

export const CARD_SIZE_SPECS: Record<CardSizeName, PrintSpecification> = {
  '6x9_postcard': {
    id: '6x9_postcard',
    displayName: '6" x 9" Postcard',
    description: 'Large postcard format. Great for photos and bold designs. Currently the default for Lob.',
    trimSize: {
      widthInches: 6,
      heightInches: 9,
      widthPixels300DPI: 1800,
      heightPixels300DPI: 2700,
    },
    withBleed: {
      widthInches: 6.25,
      heightInches: 9.25,
      widthPixels300DPI: 1875,
      heightPixels300DPI: 2775,
    },
    safeArea: {
      widthInches: 5.5,
      heightInches: 8.5,
      widthPixels300DPI: 1650,
      heightPixels300DPI: 2550,
    },
    bleedSpec: {
      bleedInches: 0.125,
      safeMarginInches: 0.25,
    },
    supportsFolded: false,
    supportsPostcard: true,
    frontImage: {
      aspectRatio: '2:3',
      minDPI: 300,
      recommendedDPI: 350,
      minWidthPixels: 1800,
      minHeightPixels: 2700,
      imagenAspectRatio: '2:3', // Closest supported ratio
    },
    lobSize: '6x9',
    lobCompatible: true,
  },

  '4x6': {
    id: '4x6',
    displayName: '4" x 6" Postcard',
    description: 'Standard postcard size. Compact and affordable.',
    trimSize: {
      widthInches: 4,
      heightInches: 6,
      widthPixels300DPI: 1200,
      heightPixels300DPI: 1800,
    },
    withBleed: {
      widthInches: 4.25,
      heightInches: 6.25,
      widthPixels300DPI: 1275,
      heightPixels300DPI: 1875,
    },
    safeArea: {
      widthInches: 3.5,
      heightInches: 5.5,
      widthPixels300DPI: 1050,
      heightPixels300DPI: 1650,
    },
    bleedSpec: {
      bleedInches: 0.125,
      safeMarginInches: 0.25,
    },
    supportsFolded: false,
    supportsPostcard: true,
    frontImage: {
      aspectRatio: '2:3',
      minDPI: 300,
      recommendedDPI: 350,
      minWidthPixels: 1200,
      minHeightPixels: 1800,
      imagenAspectRatio: '2:3',
    },
    lobSize: '4x6',
    lobCompatible: true,
  },

  '5x7': {
    id: '5x7',
    displayName: '5" x 7"',
    description: 'Classic greeting card size. Perfect for most occasions.',
    trimSize: {
      widthInches: 5,
      heightInches: 7,
      widthPixels300DPI: 1500,
      heightPixels300DPI: 2100,
    },
    withBleed: {
      widthInches: 5.25,
      heightInches: 7.25,
      widthPixels300DPI: 1575,
      heightPixels300DPI: 2175,
    },
    safeArea: {
      widthInches: 4.5,
      heightInches: 6.5,
      widthPixels300DPI: 1350,
      heightPixels300DPI: 1950,
    },
    bleedSpec: {
      bleedInches: 0.125,
      safeMarginInches: 0.25,
    },
    supportsFolded: true,
    supportsPostcard: false,
    frontImage: {
      aspectRatio: '5:7',
      minDPI: 300,
      recommendedDPI: 350,
      minWidthPixels: 1500,
      minHeightPixels: 2100,
      imagenAspectRatio: '3:4', // Closest supported ratio, will need cropping
    },
    lobCompatible: false, // Lob only supports postcards currently
  },

  A2: {
    id: 'A2',
    displayName: 'A2 (4.25" x 5.5")',
    description: 'Compact folded card. Fits standard A2 envelope.',
    trimSize: {
      widthInches: 4.25,
      heightInches: 5.5,
      widthPixels300DPI: 1275,
      heightPixels300DPI: 1650,
    },
    withBleed: {
      widthInches: 4.5,
      heightInches: 5.75,
      widthPixels300DPI: 1350,
      heightPixels300DPI: 1725,
    },
    safeArea: {
      widthInches: 3.75,
      heightInches: 5,
      widthPixels300DPI: 1125,
      heightPixels300DPI: 1500,
    },
    bleedSpec: {
      bleedInches: 0.125,
      safeMarginInches: 0.25,
    },
    supportsFolded: true,
    supportsPostcard: false,
    frontImage: {
      aspectRatio: '17:22',
      minDPI: 300,
      recommendedDPI: 350,
      minWidthPixels: 1275,
      minHeightPixels: 1650,
      imagenAspectRatio: '3:4', // Closest supported ratio
    },
    lobCompatible: false,
  },

  A6: {
    id: 'A6',
    displayName: 'A6 (4.5" x 6.25")',
    description: 'Medium folded card. Popular international size.',
    trimSize: {
      widthInches: 4.5,
      heightInches: 6.25,
      widthPixels300DPI: 1350,
      heightPixels300DPI: 1875,
    },
    withBleed: {
      widthInches: 4.75,
      heightInches: 6.5,
      widthPixels300DPI: 1425,
      heightPixels300DPI: 1950,
    },
    safeArea: {
      widthInches: 4,
      heightInches: 5.75,
      widthPixels300DPI: 1200,
      heightPixels300DPI: 1725,
    },
    bleedSpec: {
      bleedInches: 0.125,
      safeMarginInches: 0.25,
    },
    supportsFolded: true,
    supportsPostcard: false,
    frontImage: {
      aspectRatio: '18:25',
      minDPI: 300,
      recommendedDPI: 350,
      minWidthPixels: 1350,
      minHeightPixels: 1875,
      imagenAspectRatio: '3:4',
    },
    lobCompatible: false,
  },
};

// ============================================
// MESSAGE TYPOGRAPHY SPECIFICATIONS
// ============================================

export const MESSAGE_TYPOGRAPHY_SPECS: Record<string, MessageTypographySpec> = {
  standard: {
    id: 'standard',
    name: 'Standard Message',
    maxCharacters: 500,
    maxLines: 12,
    recommendedFontSizePt: 12,
    minFontSizePt: 10,
    maxFontSizePt: 16,
    lineHeightMultiplier: 1.5,
    margins: {
      top: 0.5,
      right: 0.5,
      bottom: 0.75,
      left: 0.5,
    },
    safePrintWidthInches: 4,
    maxCharactersPerLine: 50,
  },
  compact: {
    id: 'compact',
    name: 'Compact Message',
    maxCharacters: 300,
    maxLines: 8,
    recommendedFontSizePt: 11,
    minFontSizePt: 9,
    maxFontSizePt: 14,
    lineHeightMultiplier: 1.4,
    margins: {
      top: 0.375,
      right: 0.375,
      bottom: 0.5,
      left: 0.375,
    },
    safePrintWidthInches: 3.5,
    maxCharactersPerLine: 45,
  },
  postcard_back: {
    id: 'postcard_back',
    name: 'Postcard Back',
    maxCharacters: 200,
    maxLines: 6,
    recommendedFontSizePt: 10,
    minFontSizePt: 8,
    maxFontSizePt: 12,
    lineHeightMultiplier: 1.3,
    margins: {
      top: 0.25,
      right: 3.0, // Address side takes up right portion
      bottom: 0.25,
      left: 0.25,
    },
    safePrintWidthInches: 2.75,
    maxCharactersPerLine: 35,
  },
};

// ============================================
// ENVELOPE OPTIONS
// ============================================

export const ENVELOPE_OPTIONS: EnvelopeOption[] = [
  {
    id: 'white_standard',
    displayName: 'White Envelope',
    style: 'standard',
    colorOptions: ['white'],
    fitsCardSizes: ['5x7', 'A2', 'A6'],
    priceModifierCents: 0,
  },
  {
    id: 'cream_standard',
    displayName: 'Cream Envelope',
    style: 'standard',
    colorOptions: ['cream'],
    fitsCardSizes: ['5x7', 'A2', 'A6'],
    priceModifierCents: 0,
  },
  {
    id: 'kraft_standard',
    displayName: 'Kraft Envelope',
    style: 'standard',
    colorOptions: ['kraft'],
    fitsCardSizes: ['5x7', 'A2', 'A6'],
    priceModifierCents: 50,
  },
];

// ============================================
// PAPER FINISH OPTIONS
// ============================================

export const FINISH_OPTIONS: FinishOption[] = [
  {
    id: 'matte_standard',
    displayName: 'Matte',
    finish: 'matte',
    weight: 'standard',
    description: 'Classic matte finish. Elegant and easy to write on.',
    priceModifierCents: 0,
    availableForFormats: ['book-open', 'single-card'],
  },
  {
    id: 'glossy_standard',
    displayName: 'Glossy',
    finish: 'glossy',
    weight: 'standard',
    description: 'Vibrant glossy finish. Makes colors pop.',
    priceModifierCents: 100,
    availableForFormats: ['single-card'],
  },
  {
    id: 'matte_premium',
    displayName: 'Premium Matte',
    finish: 'matte',
    weight: 'premium',
    description: 'Thick, luxurious matte cardstock.',
    priceModifierCents: 200,
    availableForFormats: ['book-open', 'single-card'],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get print spec for a card format and optional size preference
 */
export function getPrintSpec(
  format: CardFormat,
  preferredSize?: CardSizeName
): PrintSpecification {
  // For postcards, use 6x9 by default (Lob compatible)
  if (format === 'single-card') {
    if (preferredSize && CARD_SIZE_SPECS[preferredSize]?.supportsPostcard) {
      return CARD_SIZE_SPECS[preferredSize];
    }
    return CARD_SIZE_SPECS['6x9_postcard'];
  }

  // For folded cards, use 5x7 by default
  if (preferredSize && CARD_SIZE_SPECS[preferredSize]?.supportsFolded) {
    return CARD_SIZE_SPECS[preferredSize];
  }
  return CARD_SIZE_SPECS['5x7'];
}

/**
 * Get the Imagen API aspect ratio for a card size
 */
export function getImagenAspectRatio(cardSize: CardSizeName): string {
  return CARD_SIZE_SPECS[cardSize]?.frontImage.imagenAspectRatio || '1:1';
}

/**
 * Get message typography spec for a card format
 */
export function getMessageTypography(format: CardFormat): MessageTypographySpec {
  if (format === 'single-card') {
    return MESSAGE_TYPOGRAPHY_SPECS.postcard_back;
  }
  return MESSAGE_TYPOGRAPHY_SPECS.standard;
}

/**
 * Validate message length against print specs
 */
export function validateMessageLength(
  message: string,
  format: CardFormat
): { isValid: boolean; error?: string } {
  const spec = getMessageTypography(format);
  const charCount = message.length;

  if (charCount > spec.maxCharacters) {
    return {
      isValid: false,
      error: `Message is ${charCount} characters. Maximum for ${spec.name} is ${spec.maxCharacters} characters.`,
    };
  }

  const lines = message.split('\n');
  if (lines.length > spec.maxLines) {
    return {
      isValid: false,
      error: `Message has ${lines.length} lines. Maximum for ${spec.name} is ${spec.maxLines} lines.`,
    };
  }

  // Check for lines that are too long
  const longLines = lines.filter(line => line.length > spec.maxCharactersPerLine);
  if (longLines.length > 0) {
    return {
      isValid: false,
      error: `Some lines exceed ${spec.maxCharactersPerLine} characters. Consider shorter lines for best print quality.`,
    };
  }

  return { isValid: true };
}
