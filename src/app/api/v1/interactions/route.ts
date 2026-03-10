import { NextRequest } from 'next/server';
import { getInteractionsBetween } from '@/lib/queries';
import { apiResponse, apiError, handleOptions } from '@/lib/api-helpers';

export function OPTIONS() {
  return handleOptions();
}

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ingredientsParam = searchParams.get('ingredients');

  if (!ingredientsParam) {
    return apiError('Missing required parameter: ingredients (comma-separated ingredient slugs)', 400);
  }

  const slugs = ingredientsParam.split(',').filter(Boolean);
  if (slugs.length === 0) {
    return apiError('No valid ingredient slugs provided', 400);
  }

  const interactions = getInteractionsBetween(slugs);

  // Also check for cross-ingredient warnings
  const warnings: string[] = [];
  const slugSet = new Set(slugs);

  // Known required pairings
  if (slugSet.has('vitamin-d3') && !slugSet.has('vitamin-k2')) {
    warnings.push('Vitamin D3 should be paired with Vitamin K2 to prevent arterial calcification');
  }
  if ((slugSet.has('nmn') || slugSet.has('nicotinamide-riboside')) && !slugSet.has('tmg')) {
    warnings.push('NMN/NR should be paired with TMG (methyl donor replacement)');
  }

  // Known contraindications between ingredients in the set
  if (slugSet.has('quercetin') || slugSet.has('fisetin')) {
    warnings.push('Quercetin/Fisetin senolytic protocol: use 2 days/month only, not daily');
  }

  return apiResponse({
    checked: slugs,
    interactions,
    warnings,
  });
}
