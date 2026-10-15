/**
 * Shared demo accounts so visitors (and interviewers) can explore both sides
 * of the marketplace without signing up. The data behind them is seeded by
 * `scripts/seed-demo.mjs`. These are throwaway accounts with no real data.
 */
export const DEMO_PASSWORD = 'kaput-demo-2026';

export const DEMO_ACCOUNTS = {
  driver: { email: 'demo.driver@example.com', label: 'Car owner' },
  mechanic: { email: 'demo.mechanic@example.com', label: 'Mechanic' },
} as const;

export type DemoRole = keyof typeof DEMO_ACCOUNTS;

export function isDemoEmail(email: string | null | undefined): boolean {
  return Boolean(email && email.toLowerCase().endsWith('@example.com'));
}
