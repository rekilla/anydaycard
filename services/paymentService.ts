const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface CheckoutSession {
  id: string;
  clientSecret: string;
}

export interface PaymentResult {
  paymentIntentId: string;
  status: 'succeeded' | 'failed';
}

export const createCheckoutSession = async (email: string, amount: number): Promise<CheckoutSession> => {
  await delay(600);
  return {
    id: `cs_${Math.floor(Math.random() * 900000 + 100000)}`,
    clientSecret: `cs_secret_${btoa(`${email}:${amount}`).slice(0, 12)}`,
  };
};

export const confirmPayment = async (sessionId: string): Promise<PaymentResult> => {
  await delay(900);
  return {
    paymentIntentId: `pi_${sessionId.slice(3)}`,
    status: 'succeeded',
  };
};
