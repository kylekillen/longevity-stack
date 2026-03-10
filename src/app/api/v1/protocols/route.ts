import { getAllStacks, getStackBySlug } from '@/lib/queries';
import { NextRequest } from 'next/server';
import { apiResponse, apiError, handleOptions } from '@/lib/api-helpers';

export function OPTIONS() {
  return handleOptions();
}

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const slug = searchParams.get('slug');

  if (slug) {
    const stack = getStackBySlug(slug);
    if (!stack) {
      return apiError(`Protocol '${slug}' not found`, 404);
    }

    const ingredients = JSON.parse(stack.ingredients || '[]');
    const research = JSON.parse(stack.research || '[]');

    return apiResponse({
      protocol: {
        name: stack.name,
        slug: stack.slug,
        description: stack.description,
        goal: stack.goal,
        ingredients,
        dosing_notes: stack.dosing_notes,
        source: stack.source,
        source_url: stack.source_url,
        research,
        url: `https://thelongevityagent.com/protocols/${stack.slug}`,
      },
    });
  }

  const stacks = getAllStacks();

  return apiResponse({
    total: stacks.length,
    protocols: stacks.map(s => ({
      name: s.name,
      slug: s.slug,
      description: s.description,
      goal: s.goal,
      ingredients: JSON.parse(s.ingredients || '[]'),
      source: s.source,
      url: `https://thelongevityagent.com/protocols/${s.slug}`,
    })),
  });
}
