'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, CreditCard, ExternalLink, Zap, Shield, Crown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMechanicDashboardData } from '@/hooks/useMechanicDashboardData';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    icon: Zap,
    description: 'Perfect for independent mechanics just getting started.',
    features: [
      'Business profile listing',
      'Up to 10 quote requests/month',
      'Basic calendar & booking',
      'In-app messaging',
      'Secure Stripe payments',
      'Email support',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    icon: Shield,
    description: 'For established shops ready to grow their customer base.',
    highlighted: true,
    features: [
      'Everything in Starter',
      'Unlimited quote requests',
      'Priority listing in search',
      'Full analytics dashboard',
      'Portfolio & certification badges',
      'Push notifications',
      'Review management tools',
      'Priority support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    icon: Crown,
    description: 'For multi-location shops and high-volume operations.',
    features: [
      'Everything in Professional',
      'Multiple location support',
      'Team member accounts',
      'Advanced analytics',
      'Custom branding on profile',
      'API access',
      'Dedicated account manager',
      'Phone support',
    ],
  },
];

export function SubscriptionContent() {
  const { user } = useAuth();
  const { profile, loading } = useMechanicDashboardData(user?.uid);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-lg font-medium text-text-primary">No mechanic profile found</p>
      </div>
    );
  }

  const currentPlan = profile.subscriptionPlan?.toLowerCase() || '';
  const isActive = profile.subscriptionStatus === 'active' || profile.subscriptionStatus === 'trial';

  async function handleSubscribe(planId: string) {
    if (!user?.email || !profile) return;
    setSubscribing(planId);

    try {
      const res = await fetch('/api/stripe/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mechanicId: profile.id,
          email: user.email,
          planId,
          stripeCustomerId: profile.stripeCustomerId,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Failed to create checkout session
    } finally {
      setSubscribing(null);
    }
  }

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard/mechanic"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary">Choose Your Plan</h1>
        <p className="mt-2 text-text-secondary">
          All plans include a 14-day free trial. Cancel anytime.
        </p>
        {isActive && (
          <Badge variant={profile.subscriptionStatus === 'active' ? 'success' : 'warning'} className="mt-3">
            Current Plan: {profile.subscriptionPlan || 'Trial'}
          </Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const PlanIcon = plan.icon;

          return (
            <Card
              key={plan.id}
              className={cn(
                'relative p-6',
                plan.highlighted && 'border-accent/50 shadow-lg shadow-accent/5'
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}

              <div className="flex items-center gap-3">
                <div className={cn(
                  'rounded-[var(--radius-md)] p-2',
                  plan.highlighted ? 'bg-accent/15' : 'bg-bg-elevated'
                )}>
                  <PlanIcon className={cn('h-5 w-5', plan.highlighted ? 'text-accent-light' : 'text-text-muted')} />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">{plan.name}</h3>
                  <p className="text-xs text-text-muted">{plan.description}</p>
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-text-primary">${plan.price}</span>
                <span className="text-sm text-text-muted">/month</span>
              </div>

              <Button
                className="mt-5 w-full"
                variant={isCurrent ? 'secondary' : plan.highlighted ? 'primary' : 'secondary'}
                disabled={isCurrent || subscribing !== null}
                loading={subscribing === plan.id}
                onClick={() => handleSubscribe(plan.id)}
              >
                {isCurrent ? (
                  'Current Plan'
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    {isActive ? 'Switch Plan' : 'Start Free Trial'}
                  </>
                )}
              </Button>

              <ul className="mt-5 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className={cn(
                      'mt-0.5 h-3.5 w-3.5 shrink-0',
                      plan.highlighted ? 'text-accent' : 'text-success'
                    )} />
                    <span className="text-sm text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      {/* Stripe Connect section */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-text-primary">
              <ExternalLink className="h-5 w-5 text-accent-light" />
              Stripe Connect — Get Paid
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              {profile.connectOnboardingComplete
                ? 'Your payouts are set up. Payments go directly to your bank account.'
                : 'Connect your bank account to receive payouts from customer payments.'}
            </p>
          </div>
          {profile.connectOnboardingComplete ? (
            <ConnectDashboardButton accountId={profile.stripeConnectAccountId!} />
          ) : (
            <ConnectOnboardButton mechanicId={profile.id} email={user?.email ?? ''} businessName={profile.businessName} />
          )}
        </div>
      </Card>
    </div>
  );
}

function ConnectOnboardButton({ mechanicId, email, businessName }: { mechanicId: string; email: string; businessName: string }) {
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mechanicId, email, businessName }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Failed
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="primary" size="sm" loading={loading} onClick={handleConnect}>
      <ExternalLink className="h-4 w-4" />
      Set Up Payouts
    </Button>
  );
}

function ConnectDashboardButton({ accountId }: { accountId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDashboard() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/connect/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripeConnectAccountId: accountId }),
      });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch {
      // Failed
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="secondary" size="sm" loading={loading} onClick={handleDashboard}>
      <ExternalLink className="h-4 w-4" />
      Stripe Dashboard
    </Button>
  );
}
