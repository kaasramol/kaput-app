import { NextRequest, NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe-server';
import { updateMechanicConnectAccount } from '@/lib/firestore-helpers';

export async function POST(request: NextRequest) {
  try {
    const { mechanicId, email, businessName } = (await request.json()) as {
      mechanicId: string;
      email: string;
      businessName: string;
    };

    if (!mechanicId || !email) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const stripe = getStripeServer();

    const account = await stripe.accounts.create({
      type: 'express',
      country: 'CA',
      email,
      business_type: 'individual',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: { mechanicId },
      business_profile: {
        name: businessName,
        mcc: '7538', // Automotive repair shops
      },
    });

    await updateMechanicConnectAccount(mechanicId, account.id, false);

    const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${origin}/dashboard/mechanic?connect=refresh`,
      return_url: `${origin}/dashboard/mechanic?connect=success`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create Connect account.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
