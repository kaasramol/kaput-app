import type { MetadataRoute } from "next";
import { getMechanics } from "@/lib/firestore-queries";

const BASE_URL = "https://kaput.ca";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/for-mechanics`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Dynamically add active mechanic profile pages
  let mechanicPages: MetadataRoute.Sitemap = [];
  try {
    const mechanics = await getMechanics();
    mechanicPages = mechanics.map((m) => ({
      url: `${BASE_URL}/mechanic/${m.id}`,
      lastModified: m.updatedAt?.toDate?.() ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Firestore unavailable at build time — skip dynamic pages
  }

  return [...staticPages, ...mechanicPages];
}
