import express from 'express';
import { config } from 'dotenv';
import Lob from 'lob';
import Stripe from 'stripe';

config();

const app = express();
const port = Number(process.env.PORT) || 8787;

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' })
  : null;

const lobApiKey = process.env.LOB_API_KEY;
const lob = lobApiKey ? new Lob(lobApiKey) : null;

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  if (!stripe) {
    return res.status(500).send('Stripe is not configured.');
  }

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers['stripe-signature'];

  if (!endpointSecret) {
    return res.status(500).send('STRIPE_WEBHOOK_SECRET is not set.');
  }

  if (!signature) {
    return res.status(400).send('Missing Stripe signature.');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
  } catch (error) {
    return res.status(400).send(error?.message || 'Webhook signature verification failed.');
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        email: paymentIntent.receipt_email,
        metadata: paymentIntent.metadata,
      });
      // TODO: Update order status in database
      // TODO: Send confirmation email
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.error('Payment failed:', {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        email: paymentIntent.receipt_email,
        error: paymentIntent.last_payment_error?.message,
        metadata: paymentIntent.metadata,
      });
      // TODO: Send failure notification
      break;
    }
    default:
      console.log('Unhandled Stripe event:', event.type);
  }

  res.json({ received: true });
});

app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/stripe/payment-intent', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY is not set.' });
  }

  const { amount, currency = 'usd', email, metadata, idempotencyKey } = req.body || {};

  if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ error: 'Invalid amount.' });
  }

  try {
    const createOptions = {
      amount: Math.round(Number(amount)),
      currency,
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
      metadata,
    };

    const requestOptions = idempotencyKey ? { idempotencyKey } : {};

    const paymentIntent = await stripe.paymentIntents.create(createOptions, requestOptions);

    res.json({
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    const message = error?.message || 'Stripe payment intent failed.';
    res.status(500).json({ error: message });
  }
});

app.post('/api/lob/verify-address', async (req, res) => {
  if (!lob) {
    return res.status(500).json({ error: 'LOB_API_KEY is not set.' });
  }

  const { address } = req.body || {};

  if (!address || !address.line1 || !address.city || !address.state || !address.postalCode) {
    return res.status(400).json({ error: 'Missing address fields.' });
  }

  try {
    const verification = await lob.usVerifications.verify({
      primary_line: address.line1,
      secondary_line: address.line2 || '',
      city: address.city,
      state: address.state,
      zip_code: address.postalCode,
    });

    const isDeliverable = verification.deliverability === 'deliverable' ||
      verification.deliverability === 'deliverable_unnecessary_unit' ||
      verification.deliverability === 'deliverable_incorrect_unit' ||
      verification.deliverability === 'deliverable_missing_unit';

    res.json({
      deliverability: verification.deliverability,
      deliverabilityAnalysis: verification.deliverability_analysis,
      standardizedAddress: {
        line1: verification.primary_line,
        line2: verification.secondary_line || '',
        city: verification.components?.city,
        state: verification.components?.state,
        postalCode: verification.components?.zip_code,
      },
      valid: isDeliverable,
    });
  } catch (error) {
    const message = error?.message || 'Address verification failed.';
    res.status(400).json({ error: message });
  }
});

app.post('/api/lob/postcard', async (req, res) => {
  if (!lob) {
    return res.status(500).json({ error: 'LOB_API_KEY is not set.' });
  }

  const {
    front,
    back,
    size = '6x9',
    mailType = 'usps_first_class',
    sendDate,
    to,
    metadata,
    description,
    idempotencyKey,
  } = req.body || {};

  if (!front) {
    return res.status(400).json({ error: 'Missing front artwork.' });
  }

  if (!to || !to.name || !to.address_line1 || !to.address_city || !to.address_state || !to.address_zip) {
    return res.status(400).json({ error: 'Missing or incomplete destination address.' });
  }

  const from = {
    name: process.env.LOB_FROM_NAME || 'Anyday',
    address_line1: process.env.LOB_FROM_LINE1 || '',
    address_line2: process.env.LOB_FROM_LINE2 || '',
    address_city: process.env.LOB_FROM_CITY || '',
    address_state: process.env.LOB_FROM_STATE || '',
    address_zip: process.env.LOB_FROM_ZIP || '',
    address_country: process.env.LOB_FROM_COUNTRY || 'US',
  };

  if (!from.address_line1 || !from.address_city || !from.address_zip) {
    return res.status(500).json({ error: 'LOB_FROM_* address fields are not set.' });
  }

  try {
    const createOptions = {
      description: description || 'Anyday Postcard',
      to,
      from,
      front,
      back: back || front,
      size,
      mail_type: mailType,
      send_date: sendDate,
      metadata,
    };

    const requestOptions = idempotencyKey ? { idempotencyKey } : {};

    const postcard = await lob.postcards.create(createOptions, requestOptions);

    res.json({
      id: postcard.id,
      status: postcard.status,
      trackingNumber: postcard.tracking_number || null,
      expectedDeliveryDate: postcard.expected_delivery_date || null,
    });
  } catch (error) {
    const message = error?.message || 'Lob request failed.';
    res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`Lob API server listening on http://localhost:${port}`);
});
