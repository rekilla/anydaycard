/**
 * QR Code Service
 *
 * This module handles QR code generation for the viral loop feature.
 * Each card can include a QR code that links recipients back to create
 * their own card, turning every delivered card into customer acquisition.
 *
 * Privacy: QR codes do NOT include wizard inputs - only card ID and optional sender name.
 */

import type { CardReferralData } from '../types';

// QR code generation using canvas (no external dependency)
// For production, consider using 'qrcode' npm package for better quality

/**
 * Base URL for the application
 */
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://anydaycard.com'; // Fallback for SSR
};

/**
 * Encode referral data to a URL-safe string
 */
export function encodeReferralData(data: CardReferralData): string {
  try {
    const json = JSON.stringify(data);
    // Use base64url encoding (URL-safe)
    const base64 = btoa(json)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    return base64;
  } catch (e) {
    console.error('Failed to encode referral data:', e);
    return '';
  }
}

/**
 * Decode referral data from URL-safe string
 */
export function decodeReferralData(encoded: string): CardReferralData | null {
  try {
    // Restore base64 padding and characters
    let base64 = encoded
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }

    const json = atob(base64);
    const data = JSON.parse(json) as CardReferralData;

    // Validate required fields
    if (!data.cardId || typeof data.timestamp !== 'number') {
      return null;
    }

    return data;
  } catch (e) {
    console.error('Failed to decode referral data:', e);
    return null;
  }
}

/**
 * Generate a referral URL for a card
 */
export function generateReferralUrl(data: CardReferralData): string {
  const encoded = encodeReferralData(data);
  return `${getBaseUrl()}/#/reply/${encoded}`;
}

/**
 * Create referral data for a card
 */
export function createReferralData(
  cardId: string,
  senderName?: string
): CardReferralData {
  return {
    cardId,
    senderName: senderName || undefined,
    timestamp: Date.now(),
  };
}

/**
 * QR Code generation options
 */
export interface QRCodeOptions {
  /** Size in pixels (width and height) */
  size?: number;
  /** Margin around QR code in modules */
  margin?: number;
  /** Dark color (foreground) */
  darkColor?: string;
  /** Light color (background) */
  lightColor?: string;
  /** Error correction level */
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

const DEFAULT_QR_OPTIONS: Required<QRCodeOptions> = {
  size: 150,
  margin: 1,
  darkColor: '#1e293b', // slate-800
  lightColor: '#ffffff',
  errorCorrectionLevel: 'M',
};

/**
 * Simple QR code generator using canvas
 * For basic use - production should use 'qrcode' npm package
 *
 * This is a placeholder implementation. To generate actual QR codes,
 * install the qrcode package: npm install qrcode @types/qrcode
 */
export async function generateQRCodeDataUrl(
  url: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const opts = { ...DEFAULT_QR_OPTIONS, ...options };

  // Try to use the qrcode library if available
  try {
    // Dynamic import to avoid bundling if not installed
    const QRCode = await import('qrcode');

    const dataUrl = await QRCode.toDataURL(url, {
      width: opts.size,
      margin: opts.margin,
      color: {
        dark: opts.darkColor,
        light: opts.lightColor,
      },
      errorCorrectionLevel: opts.errorCorrectionLevel,
    });

    return dataUrl;
  } catch (e) {
    // Fallback: return a placeholder or generate simple QR
    console.warn('QRCode library not available, using placeholder');
    return generatePlaceholderQR(url, opts);
  }
}

/**
 * Generate a placeholder QR code (simple canvas-based)
 * This is a fallback when the qrcode library is not installed
 */
function generatePlaceholderQR(url: string, opts: Required<QRCodeOptions>): string {
  // Create a simple placeholder that looks like a QR code
  const canvas = document.createElement('canvas');
  canvas.width = opts.size;
  canvas.height = opts.size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return '';
  }

  // Fill background
  ctx.fillStyle = opts.lightColor;
  ctx.fillRect(0, 0, opts.size, opts.size);

  // Draw border
  ctx.strokeStyle = opts.darkColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(4, 4, opts.size - 8, opts.size - 8);

  // Draw corner squares (QR code finder patterns)
  const cornerSize = opts.size / 5;
  const positions = [
    [8, 8],
    [opts.size - cornerSize - 8, 8],
    [8, opts.size - cornerSize - 8],
  ];

  ctx.fillStyle = opts.darkColor;
  for (const [x, y] of positions) {
    // Outer square
    ctx.fillRect(x, y, cornerSize, cornerSize);
    // Inner white
    ctx.fillStyle = opts.lightColor;
    ctx.fillRect(x + 4, y + 4, cornerSize - 8, cornerSize - 8);
    // Inner black
    ctx.fillStyle = opts.darkColor;
    ctx.fillRect(x + 8, y + 8, cornerSize - 16, cornerSize - 16);
  }

  // Add some random-looking dots (simple pattern)
  const moduleSize = opts.size / 25;
  for (let i = 0; i < 50; i++) {
    const x = Math.floor(Math.random() * 20 + 2) * moduleSize;
    const y = Math.floor(Math.random() * 20 + 2) * moduleSize;
    ctx.fillRect(x, y, moduleSize * 0.8, moduleSize * 0.8);
  }

  return canvas.toDataURL('image/png');
}

/**
 * Generate a complete QR code image for card back
 * Includes the QR code and optional text
 */
export async function generateCardBackQR(
  cardId: string,
  senderName?: string,
  options: QRCodeOptions = {}
): Promise<{
  qrDataUrl: string;
  referralUrl: string;
  referralData: CardReferralData;
}> {
  const referralData = createReferralData(cardId, senderName);
  const referralUrl = generateReferralUrl(referralData);
  const qrDataUrl = await generateQRCodeDataUrl(referralUrl, options);

  return {
    qrDataUrl,
    referralUrl,
    referralData,
  };
}

/**
 * Get tracking info from a referral code in the URL
 */
export function getReferralFromUrl(): CardReferralData | null {
  if (typeof window === 'undefined') return null;

  const hash = window.location.hash;
  const match = hash.match(/#\/reply\/([^/?]+)/);

  if (!match) return null;

  return decodeReferralData(match[1]);
}

/**
 * Store referral source for analytics
 */
export function trackReferralSource(referralData: CardReferralData): void {
  try {
    localStorage.setItem('anyday_referral_source', JSON.stringify({
      ...referralData,
      landedAt: Date.now(),
    }));
  } catch (e) {
    console.warn('Failed to track referral source:', e);
  }
}

/**
 * Get stored referral source
 */
export function getStoredReferralSource(): (CardReferralData & { landedAt: number }) | null {
  try {
    const stored = localStorage.getItem('anyday_referral_source');
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
}
