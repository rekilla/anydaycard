export interface WizardState {
  step: number;
  answers: Record<string, any>;
  isGenerating: boolean;
  generatedCard: GeneratedCard | null;
}

export type CardStatus = 'draft' | 'paid' | 'printing' | 'shipped' | 'delivered';
export type OrderStatus = 'scheduled' | 'paid' | 'printing' | 'shipped' | 'delivered';
export type NotificationType = 'receipt' | 'reminder' | 'shipping' | 'delivery';
export type NotificationStatus = 'queued' | 'sent';

export interface GeneratedCard {
  id: string;
  status: CardStatus;
  message: string;
  image: string; // Base64 or URL
  artPrompt: string;
  backImage?: string; // Base64 or URL
  backArtPrompt?: string;
  designTemplateId?: string;
  designTemplateName?: string;
  cardFormat?: CardFormat;
  coverTextPreference?: CoverTextPreference;
  scheduledDate?: string; // ISO Date string YYYY-MM-DD
  recipientName?: string; // For dashboard history
  recipientId?: string; // Link to profile
  price?: number;
  shippingSpeed?: 'standard' | 'expedited' | 'byDate';
  shippingAddress?: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
  };
  trackingNumber?: string;
  deliveryEstimate?: string;
  reminderDate?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  cardId: string;
  recipientName: string;
  email: string;
  total: number;
  shippingCost: number;
  status: OrderStatus;
  createdAt: string;
  scheduledDate?: string;
  shippingSpeed?: 'standard' | 'expedited' | 'byDate';
  shippingAddress?: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
  };
  trackingNumber?: string;
  deliveryEstimate?: string;
}

export interface NotificationItem {
  id: string;
  orderId: string;
  type: NotificationType;
  status: NotificationStatus;
  scheduledFor?: string;
  sentAt?: string;
}

export interface CheckoutMeta {
  shippingCost: number;
  total: number;
  deliveryMode: 'now' | 'later';
  scheduledDate?: string;
  reminderEnabled: boolean;
  shippingSpeed: 'standard' | 'expedited' | 'byDate';
  trackingNumber?: string;
  deliveryEstimate?: string;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
  };
  fulfillmentError?: boolean;
}

export interface User {
  email: string;
  name?: string;
  isAnonymous: boolean;
}

export interface RecipientProfile {
  id: string;
  name: string;
  relationshipType: string;
  birthDate?: string;
  anniversary?: string;
  lastCardDate?: string;
  /** Saved wizard answers for pre-filling future cards */
  savedAnswers?: {
    vibe?: string[];
    theirThing?: string;
    insideJoke?: string;
    quickTraits?: string[];
    sharedMemory?: string;
    whatYouAdmire?: string;
  };
  /** Whether the user explicitly opted to save this profile */
  userSaved: boolean;
  createdAt: string;
}

export interface QuestionOption {
  label: string;
  value: string;
  icon?: string;
}

export interface Question {
  id: string;
  text: string;
  eyebrow?: string;
  type: 'text' | 'textarea' | 'grid' | 'multiselect' | 'list' | 'pills';
  options?: QuestionOption[];
  maxSelections?: number;
  placeholder?: string;
  required?: boolean;
  condition?: (answers: Record<string, any>) => boolean;
}

export interface DesignOption {
  id: string;
  image: string;
  prompt: string;
}

export interface DesignOptions {
  front: DesignOption[];
  back: DesignOption[];
}

export type CardFormat = 'book-open' | 'single-card';
export type CoverTextPreference = 'text-on-image' | 'design-only';

export enum RelationshipType {
  Partner = 'Partner/Spouse',
  Friend = 'A friend',
  Parent = 'My parent',
  Child = 'My child',
  Sibling = 'Sibling',
  Grandparent = 'Grandparent',
  Professional = 'Coworker/Professional',
  Dating = "Someone I'm dating (it's new)",
  Other = 'Someone else',
}

export type FulfillmentStatus = 'idle' | 'processing' | 'success';

// ============================================
// REGENERATION TYPES
// ============================================

/**
 * Phase of regeneration for message generation
 * - initial: First generation (4 standard options)
 * - rephrase: Same content angles, new phrasing
 * - new_angle: Switch to different angle (memory/admiration/future)
 * - clarify: Ask user for more detail or suggest vibe switch
 */
export type RegenerationPhase = 'initial' | 'rephrase' | 'new_angle' | 'clarify';

/**
 * Message angle for regeneration
 * - memory-forward: Focus on shared memories and past
 * - admiration-forward: Focus on what you admire about them
 * - future-forward: Focus on hopes and future together
 * - humor-forward: Lean into humor and playfulness
 */
export type MessageAngle = 'memory-forward' | 'admiration-forward' | 'future-forward' | 'humor-forward';

/**
 * Context for regeneration state tracking
 */
export interface RegenerationContext {
  phase: RegenerationPhase;
  attemptNumber: number;
  previousMessages: string[];
  currentAngle?: MessageAngle;
  changeExplanation?: string;
}

/**
 * Explanation of what changed between message generations
 */
export interface ChangeExplanation {
  /** What was changed (e.g., "Made it funnier", "Focused on memories") */
  summary: string;
  /** Specific aspects that changed */
  aspects: Array<'tone' | 'length' | 'specificity' | 'angle'>;
}

// ============================================
// QR CODE / VIRAL TYPES
// ============================================

/**
 * Data encoded in QR code for recipient referral
 * NOTE: Does NOT include wizard inputs for privacy
 */
export interface CardReferralData {
  cardId: string;
  senderName?: string;
  timestamp: number;
}

// ============================================
// PRINT SPECIFICATION TYPES
// ============================================

/**
 * Card size names for print specifications
 */
export type CardSizeName = 'A2' | 'A6' | '5x7' | '6x9_postcard' | '4x6';

/**
 * Paper finish options
 */
export type PaperFinish = 'matte' | 'glossy' | 'satin' | 'uncoated';

/**
 * Paper weight options
 */
export type PaperWeight = 'standard' | 'premium' | 'heavyweight';

/**
 * Print specification for card generation
 */
export interface PrintSpec {
  cardSize: CardSizeName;
  finish?: PaperFinish;
  weight?: PaperWeight;
  envelope?: string;
}
