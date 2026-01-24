export interface PaymentIntentRequest {
  amount: number;
  currency?: string;
  email?: string;
  metadata?: Record<string, string>;
  idempotencyKey?: string;
}

export interface PaymentIntentResponse {
  id: string;
  clientSecret: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const createPaymentIntent = async (payload: PaymentIntentRequest): Promise<PaymentIntentResponse> => {
  const response = await fetch(`${API_BASE}/api/stripe/payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Unable to create payment intent.');
  }

  return response.json();
};
