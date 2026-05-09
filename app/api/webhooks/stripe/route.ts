import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderStatus } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
  apiVersion: '2024-04-10',
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') ?? '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = intent.metadata.orderId;
      if (orderId) {
        await updateOrderStatus(orderId, 'confirmed');
        // TODO: Send confirmation email here
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = intent.metadata.orderId;
      if (orderId) {
        await updateOrderStatus(orderId, 'cancelled');
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}

// Disable body parsing for Stripe webhooks
export const config = { api: { bodyParser: false } };
