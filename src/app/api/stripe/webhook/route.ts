import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeServer } from '@/lib/stripe-server';
import { updateBookingPayment, updateMechanicSubscription, updateMechanicConnectAccount } from '@/lib/firestore-helpers';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripeServer();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook verification failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { bookingId } = paymentIntent.metadata;
      if (bookingId) {
        try {
          await updateBookingPayment(bookingId, paymentIntent.id);
        } catch (err) {
          console.error('Failed to update booking payment status:', err);
        }
      }
      break;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const mechanicId = subscription.metadata.mechanicId;
      const planName = subscription.metadata.planName ?? '';
      if (mechanicId) {
        const status = subscription.status === 'active' || subscription.status === 'trialing'
          ? (subscription.status === 'trialing' ? 'trial' : 'active')
          : 'inactive';
        try {
          await updateMechanicSubscription(mechanicId, status, planName, subscription.id);
        } catch (err) {
          console.error('Failed to update subscription status:', err);
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const mechanicId = subscription.metadata.mechanicId;
      if (mechanicId) {
        try {
          await updateMechanicSubscription(mechanicId, 'inactive', '', undefined);
        } catch (err) {
          console.error('Failed to cancel subscription:', err);
        }
      }
      break;
    }

    case 'account.updated': {
      const account = event.data.object as Stripe.Account;
      const mechanicId = account.metadata?.mechanicId;
      if (mechanicId) {
        const chargesEnabled = account.charges_enabled ?? false;
        const payoutsEnabled = account.payouts_enabled ?? false;
        const onboardingComplete = chargesEnabled && payoutsEnabled;
        try {
          await updateMechanicConnectAccount(mechanicId, account.id, onboardingComplete);
        } catch (err) {
          console.error('Failed to update Connect account status:', err);
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
