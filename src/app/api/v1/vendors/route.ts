import { getAllVendors } from '@/lib/queries';
import { apiResponse, handleOptions } from '@/lib/api-helpers';

export function OPTIONS() {
  return handleOptions();
}

export function GET() {
  const vendors = getAllVendors();

  return apiResponse({
    total: vendors.length,
    vendors: vendors.map(v => ({
      name: v.name,
      slug: v.slug,
      url: v.url,
      trust_score: v.trust_score,
      ships_direct: !!v.ships_direct,
      trust_notes: v.trust_notes,
      free_shipping_threshold: v.free_shipping_threshold,
    })),
  });
}
