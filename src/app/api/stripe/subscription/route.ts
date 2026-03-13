import { NextRequest, NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe-server';
import { updateMechanicStripeCustomerId } from '@/lib/firestore-helpers';

const PLAN_PRICES: Record<string, { name: string; amount: number }> = {
  starter: { name: 'Starter', amount: 4900 },
  professional: { name: 'Professional', amount: 9900 },
  enterprise: { name: 'Enterprise', amount: 19900 },
};

export async function POST(request: NextRequest) {
  try {
    const { mechanicId, email, planId, stripeCustomerId } = (await request.json()) as {
      mechanicId: string;
      email: string;
      planId: string;
      stripeCustomerId?: string;
    };

    if (!mechanicId || !email || !planId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const plan = PLAN_PRICES[planId];
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan.' }, { status: 400 });
    }

    const stripe = getStripeServer();
    const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    let customerId = stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { mechanicId },
      });
      customerId = customer.id;
      await updateMechanicStripeCustomerId(mechanicId, customerId);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: { name: `Kaput ${plan.name} Plan` },
            recurring: { interval: 'month' },
            unit_amount: plan.amount,
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 14,
        metadata: { mechanicId, planName: plan.name },
      },
      success_url: `${origin}/dashboard/mechanic?subscription=success`,
      cancel_url: `${origin}/dashboard/mechanic?subscription=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create checkout session.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
