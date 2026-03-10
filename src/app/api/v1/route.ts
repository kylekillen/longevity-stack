import { apiResponse, handleOptions } from '@/lib/api-helpers';

export function OPTIONS() {
  return handleOptions();
}

export function GET() {
  return apiResponse({
    name: 'The Longevity Agent API',
    version: 'v1',
    description: 'Free, no-auth supplement price comparison API. Compare prices across trusted vendors, check interactions, and build checkout carts.',
    base_url: 'https://thelongevityagent.com/api/v1',
    endpoints: {
      'GET /products': {
        description: 'List all products with optional filtering',
        params: {
          q: 'Search by name, ingredient, or brand',
          ingredient: 'Filter by ingredient slug (e.g., quercetin)',
          vendor: 'Filter by vendor slug (e.g., nootropics-depot)',
          min_trust: 'Minimum vendor trust score (1-10)',
          sort: 'Sort by: per_serving (default), price, trust',
          limit: 'Max results (default 500, max 500)',
          offset: 'Pagination offset',
        },
        example: '/api/v1/products?ingredient=quercetin&min_trust=7',
      },
      'GET /products/:slug': {
        description: 'Get a single product with alternatives',
        example: '/api/v1/products/quercetin-now-500mg',
      },
      'GET /ingredients': {
        description: 'List all supplement ingredients with metadata',
        example: '/api/v1/ingredients',
      },
      'GET /ingredients/:slug': {
        description: 'Get ingredient details with all products and research',
        example: '/api/v1/ingredients/quercetin',
      },
      'GET /vendors': {
        description: 'List all trusted vendors with trust scores',
        example: '/api/v1/vendors',
      },
      'GET /compare': {
        description: 'Compare multiple products and get total pricing',
        params: {
          slugs: 'Comma-separated product slugs (required)',
          vendor: 'Lock to a specific vendor slug (optional)',
        },
        example: '/api/v1/compare?slugs=d3-now-5000iu,k2-now-100mcg,magnesium-nutricost-200mg',
      },
      'GET /interactions': {
        description: 'Check drug/supplement interactions between ingredients',
        params: {
          ingredients: 'Comma-separated ingredient slugs (required)',
        },
        example: '/api/v1/interactions?ingredients=quercetin,vitamin-k2,omega-3',
      },
      'GET /protocols': {
        description: 'List biohacker protocol stacks (Huberman, Attia, Johnson, etc.)',
        params: {
          slug: 'Get a specific protocol by slug (optional)',
        },
        example: '/api/v1/protocols?slug=bryan-johnson-blueprint',
      },
    },
    cart_url_format: 'https://thelongevityagent.com/cart?items=SLUG1,SLUG2,SLUG3',
    authentication: 'None required. All endpoints are free and open.',
    rate_limit: 'No rate limit. Be reasonable.',
    cors: 'All origins allowed.',
  });
}
