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
  trackingNumber: string;
  deliveryEstimate: string;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
  };
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
  lastCardDate?: string;
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
