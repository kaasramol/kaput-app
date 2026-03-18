import { NextRequest, NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe-server';
import { getMechanicById } from '@/lib/firestore-queries';

const PLATFORM_FEE_PERCENT = 0; // Kaput uses subscription model, no per-transaction fee

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
    const amountCents = Math.round(amount * 100);

    // Look up mechanic's Connect account for direct payouts
    const mechanic = await getMechanicById(mechanicId);
    const connectAccountId = mechanic?.stripeConnectAccountId;
    const connectReady = mechanic?.connectOnboardingComplete === true && connectAccountId;

    const paymentIntentParams: Parameters<typeof stripe.paymentIntents.create>[0] = {
      amount: amountCents,
      currency: 'cad',
      metadata: { bookingId, carOwnerId, mechanicId },
    };

    // Route funds to mechanic's Connect account if onboarding is complete
    if (connectReady) {
      const platformFee = Math.round(amountCents * PLATFORM_FEE_PERCENT);
      paymentIntentParams.transfer_data = {
        destination: connectAccountId,
      };
      if (platformFee > 0) {
        paymentIntentParams.application_fee_amount = platformFee;
      }
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create payment intent.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
