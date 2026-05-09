import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
  apiVersion: '2024-04-10',
});

export async function POST(req: NextRequest) {
  try {
    const { amount, orderId, orderNumber, customerEmail } = await req.json();

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert EGP to piastres
      currency: 'egp',
      automatic_payment_methods: { enabled: true },
      metadata: { orderId, orderNumber, customerEmail },
      description: `SteelLuxe Order ${orderNumber}`,
      receipt_email: customerEmail,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
