import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Look up a day's business hours regardless of key casing. Profiles store
 * "Monday" (from onboarding/edit forms) but older data may use "monday".
 */
export function getDayHours<T>(hours: Record<string, T> | undefined, day: string): T | undefined {
  if (!hours) return undefined;
  const target = day.toLowerCase();
  const key = Object.keys(hours).find((k) => k.toLowerCase() === target);
  return key ? hours[key] : undefined;
}
