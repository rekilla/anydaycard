const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface FulfillmentInput {
  deliveryMode: 'now' | 'later';
  shippingSpeed: 'standard' | 'expedited' | 'byDate';
  scheduledDate?: string;
}

export interface FulfillmentResult {
  trackingNumber: string;
  deliveryEstimate: string;
}

export const createPostcardOrder = async (input: FulfillmentInput): Promise<FulfillmentResult> => {
  await delay(500);
  const trackingNumber = `ADC-${Math.floor(Math.random() * 900000 + 100000)}`;
  const etaDate = input.deliveryMode === 'later' && input.scheduledDate
    ? input.scheduledDate
    : new Date(Date.now() + (input.shippingSpeed === 'expedited' ? 3 : 5) * 86400000)
        .toISOString()
        .split('T')[0];

  return { trackingNumber, deliveryEstimate: etaDate };
};
