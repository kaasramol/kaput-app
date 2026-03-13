import { NextRequest, NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe-server';

export async function POST(request: NextRequest) {
  try {
    const { stripeConnectAccountId } = (await request.json()) as {
      stripeConnectAccountId: string;
    };

    if (!stripeConnectAccountId) {
      return NextResponse.json({ error: 'Missing account ID.' }, { status: 400 });
    }

    const stripe = getStripeServer();
    const loginLink = await stripe.accounts.createLoginLink(stripeConnectAccountId);

    return NextResponse.json({ url: loginLink.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create dashboard link.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
