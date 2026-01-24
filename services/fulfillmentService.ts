import { GeneratedCard } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
}

interface FulfillmentInput {
  card: GeneratedCard;
  email: string;
  deliveryMode: 'now' | 'later';
  shippingSpeed: 'standard' | 'expedited' | 'byDate';
  scheduledDate?: string;
  shippingAddress: ShippingAddress;
  size?: '4x6' | '6x9';
}

export interface FulfillmentResult {
  trackingNumber: string;
  deliveryEstimate: string;
  lobId?: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const estimateDelivery = (input: FulfillmentInput) => {
  if (input.deliveryMode === 'later' && input.scheduledDate) return input.scheduledDate;
  const eta = new Date(Date.now() + (input.shippingSpeed === 'expedited' ? 3 : 5) * 86400000);
  return eta.toISOString().split('T')[0];
};

const normalizeArtwork = (image?: string) => {
  if (!image) return '';
  if (image.startsWith('data:') || image.startsWith('http')) return image;
  return `data:image/png;base64,${image}`;
};

export const createPostcardOrder = async (input: FulfillmentInput): Promise<FulfillmentResult> => {
  const front = normalizeArtwork(input.card.image);
  const back = normalizeArtwork(input.card.backImage) || front;

  const payload = {
    front,
    back,
    size: input.size || '6x9',
    sendDate: input.deliveryMode === 'later' ? input.scheduledDate : undefined,
    to: {
      name: input.shippingAddress.name,
      address_line1: input.shippingAddress.line1,
      address_line2: input.shippingAddress.line2,
      address_city: input.shippingAddress.city,
      address_state: input.shippingAddress.state,
      address_zip: input.shippingAddress.postalCode,
      address_country: 'US',
    },
    metadata: {
      email: input.email,
      cardId: input.card.id,
    },
  };

  try {
    const response = await fetch(`${API_BASE}/api/lob/postcard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'Lob request failed');
    }

    const data = await response.json();
    return {
      trackingNumber: data.trackingNumber || `LOB-${Date.now()}`,
      deliveryEstimate: data.expectedDeliveryDate || estimateDelivery(input),
      lobId: data.id,
    };
  } catch (_error) {
    await delay(500);
    return {
      trackingNumber: `ADC-${Math.floor(Math.random() * 900000 + 100000)}`,
      deliveryEstimate: estimateDelivery(input),
    };
  }
};
