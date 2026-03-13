import { NextRequest, NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe-server';

interface PaymentIntentBody {
  amount: number;
  bookingId: string;
  carOwnerId: string;
  mechanicId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PaymentIntentBody;
    const { amount, bookingId, carOwnerId, mechanicId } = body;

    if (!amount || !bookingId || !carOwnerId || !mechanicId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Amount must be positive.' }, { status: 400 });
    }

    const stripe = getStripeServer();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'cad',
      metadata: { bookingId, carOwnerId, mechanicId },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create payment intent.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
