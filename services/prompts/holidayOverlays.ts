/**
 * Holiday Overlay Loader
 *
 * Loads and parses holiday overlay prompts from .txt files.
 * These overlays modify COLOR, TONE, and EMOTIONAL BOUNDARIES
 * without changing the base art style's FORM.
 *
 * Layer composition: Base Style (form) + Holiday Overlay (palette/mood) + Vibe (intensity)
 */

import { HolidayId, HolidayOverlay } from './types';

// Holiday prompt file imports (Vite ?raw)
import valentinesDayRaw from './holidays/valentines_day.txt?raw';
import mothersDayRaw from './holidays/mothers_day.txt?raw';
import fathersDayRaw from './holidays/fathers_day.txt?raw';
import christmasRaw from './holidays/christmas.txt?raw';
import hanukkahRaw from './holidays/hanukkah.txt?raw';
import newYearRaw from './holidays/new_year.txt?raw';
import thanksgivingRaw from './holidays/thanksgiving.txt?raw';
import easterRaw from './holidays/easter.txt?raw';
import otherRaw from './holidays/other.txt?raw';

/**
 * Raw overlay content mapped by holiday ID
 */
const RAW_OVERLAYS: Record<HolidayId, string> = {
  valentines_day: valentinesDayRaw,
  mothers_day: mothersDayRaw,
  fathers_day: fathersDayRaw,
  christmas: christmasRaw,
  hanukkah: hanukkahRaw,
  new_year: newYearRaw,
  thanksgiving: thanksgivingRaw,
  easter: easterRaw,
  other: otherRaw,
};

/**
 * Parse a holiday .txt file into structured HolidayOverlay
 *
 * Expected format:
 * Line 1: Emotional rule: <rule>
 * Line 2: Avoid: <comma-separated list>
 * Line 3: (blank)
 * Lines 4-8+: Visual treatment paragraph
 * Section: ---BEST BASE STYLES---
 * Section: ---TEXT OVERRIDE--- (optional)
 */
export function parseHolidayOverlay(id: HolidayId, raw: string): HolidayOverlay {
  const lines = raw.split('\n').map((l) => l.trim());

  // Parse line 1: Emotional rule
  const emotionalRuleLine = lines[0] || '';
  const emotionalRule = emotionalRuleLine.replace(/^Emotional rule:\s*/i, '').trim();

  // Parse line 2: Avoid list
  const avoidLine = lines[1] || '';
  const avoidStr = avoidLine.replace(/^Avoid:\s*/i, '').trim();
  const avoidList = avoidStr
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // Find section markers
  const bestStylesIndex = lines.findIndex((l) => l.includes('---BEST BASE STYLES---'));
  const textOverrideIndex = lines.findIndex((l) => l.includes('---TEXT OVERRIDE---'));

  // Parse visual treatment (lines 4 until first section marker or end)
  const visualEndIndex = bestStylesIndex > 0 ? bestStylesIndex : lines.length;
  const visualLines = lines.slice(3, visualEndIndex).filter((l) => l.length > 0);
  const visualTreatment = visualLines.join(' ').trim();

  // Parse best base styles
  let bestBaseStyles: string[] = [];
  if (bestStylesIndex >= 0) {
    const stylesEndIndex = textOverrideIndex > bestStylesIndex ? textOverrideIndex : lines.length;
    const styleLines = lines.slice(bestStylesIndex + 1, stylesEndIndex);
    bestBaseStyles = styleLines
      .filter((l) => l.startsWith('-'))
      .map((l) => l.replace(/^-\s*/, '').trim())
      .filter(Boolean);
  }

  // Parse text override (optional)
  let textOverride: string | undefined;
  if (textOverrideIndex >= 0) {
    const overrideLines = lines.slice(textOverrideIndex + 1);
    textOverride = overrideLines.join(' ').trim() || undefined;
  }

  return {
    id,
    emotionalRule,
    avoidList,
    visualTreatment,
    bestBaseStyles,
    textOverride,
  };
}

/**
 * Cache of parsed overlays (lazy initialization)
 */
let overlayCache: Record<HolidayId, HolidayOverlay> | null = null;

/**
 * Get all parsed holiday overlays
 */
export function getAllHolidayOverlays(): Record<HolidayId, HolidayOverlay> {
  if (!overlayCache) {
    overlayCache = {} as Record<HolidayId, HolidayOverlay>;
    for (const [id, raw] of Object.entries(RAW_OVERLAYS)) {
      overlayCache[id as HolidayId] = parseHolidayOverlay(id as HolidayId, raw);
    }
  }
  return overlayCache;
}

/**
 * Get a specific holiday overlay by ID
 */
export function getHolidayOverlay(id: HolidayId | null | undefined): HolidayOverlay | null {
  if (!id) return null;
  const overlays = getAllHolidayOverlays();
  return overlays[id] || null;
}

/**
 * Map display name or ID to HolidayId
 * Handles both "Valentine's Day" and "valentines_day" formats
 */
export function mapSpecialDayToHolidayId(specialDay: string | null | undefined): HolidayId | null {
  if (!specialDay) return null;

  const mapping: Record<string, HolidayId> = {
    // Display names
    "Valentine's Day": 'valentines_day',
    "Mother's Day": 'mothers_day',
    "Father's Day": 'fathers_day',
    Christmas: 'christmas',
    Hanukkah: 'hanukkah',
    'New Year': 'new_year',
    Thanksgiving: 'thanksgiving',
    Easter: 'easter',
    'Other Holiday': 'other',
    // ID format (from getSpecialDay())
    valentines_day: 'valentines_day',
    mothers_day: 'mothers_day',
    fathers_day: 'fathers_day',
    christmas: 'christmas',
    hanukkah: 'hanukkah',
    new_year: 'new_year',
    thanksgiving: 'thanksgiving',
    easter: 'easter',
    other_or_none: 'other',
    other: 'other',
  };

  return mapping[specialDay] || null;
}

/**
 * Convert friendly style name to template ID
 */
export function styleNameToId(name: string): string | null {
  const mapping: Record<string, string> = {
    'Floral Whisper': 'floral_whisper',
    'Textural Motif': 'textural_motif',
    'Icon Study': 'icon_study',
    'Icon Study (romantic object)': 'icon_study',
    'Icon Study (abstract holiday object)': 'icon_study',
    'Icon Study (light-based symbol)': 'icon_study',
    'Single Line Emotion': 'single_line',
    'Painterly Horizon': 'painterly_horizon',
    'Lyrical Abstract': 'lyrical_abstract',
    'Negative Space Revelation': 'negative_space',
    'Botanical Silhouette': 'botanical_silhouette',
    'Geometric Poise': 'geometric_poise',
    'Collage Reverie': 'collage_reverie',
    'Modern Letterpress Minimal': 'letterpress_minimal',
    'Letterpress Minimal': 'letterpress_minimal',
    'Night Sky Quiet': 'night_sky_quiet',
    'Playful Doodle': 'playful_doodle',
  };
  return mapping[name] || null;
}

/**
 * Get recommended template IDs for a holiday
 */
export function getHolidayRecommendedStyles(holidayId: HolidayId | null): string[] {
  if (!holidayId) return [];

  const overlay = getHolidayOverlay(holidayId);
  if (!overlay) return [];

  return overlay.bestBaseStyles.map(styleNameToId).filter((id): id is string => id !== null);
}
