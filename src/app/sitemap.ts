import { MetadataRoute } from 'next';
import { getAllIngredients, getAllStacks } from '@/lib/queries';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://thelongevityagent.com';
  const ingredients = getAllIngredients();
  const stacks = getAllStacks();

  const staticPages = [
    { url: baseUrl, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/ingredients`, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/protocols`, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/prices`, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/trust-methodology`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/why-not-amazon`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/how-we-make-money`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/cart`, changeFrequency: 'daily' as const, priority: 0.7 },
  ];

  const ingredientPages = ingredients.map((ing) => ({
    url: `${baseUrl}/ingredients/${ing.ingredient_slug}`,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const stackPages = stacks.map((stack) => ({
    url: `${baseUrl}/protocols/${stack.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...ingredientPages, ...stackPages];
}
