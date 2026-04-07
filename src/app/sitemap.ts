import { MetadataRoute } from "next";
import { getAllStacks } from "@/lib/stacks";
import { getAllPosts } from "@/lib/blog";

const BASE = "https://thelongevityagent.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE}/build-your-stack`, changeFrequency: "weekly" as const, priority: 0.95 },
    { url: `${BASE}/pricing`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/men`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${BASE}/women`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${BASE}/blog`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/how-it-works`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/faq`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/about`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE}/llm`, changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const stackPages = getAllStacks().map((s) => ({
    url: `${BASE}/stacks/${s.id}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const blogPages = getAllPosts().map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.75,
    lastModified: new Date(p.date),
  }));

  return [...staticPages, ...stackPages, ...blogPages];
}
