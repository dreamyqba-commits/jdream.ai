import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://jdream.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: BASE, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${BASE}/pricing`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${BASE}/use-cases`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE}/models`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE}/app`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE}/terms`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${BASE}/privacy`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${BASE}/contact`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${BASE}/dmca`, priority: 0.2, changeFrequency: "yearly" as const },
  ];

  return staticRoutes.map(({ url, priority, changeFrequency }) => ({
    url,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
