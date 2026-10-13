// Public site address. Set NEXT_PUBLIC_APP_URL per environment (no trailing slash).
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://kaput-azure.vercel.app").replace(/\/$/, "");
export const SITE_HOST = new URL(SITE_URL).host;
