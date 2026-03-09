import Link from "next/link";
import { getAllStacks, getProductBySlug } from "@/lib/queries";

export const metadata = {
  title: "Biohacker Protocols — Longevity Stack",
  description: "Shop published supplement protocols from Bryan Johnson, Peter Attia, Andrew Huberman, Ben Greenfield, and Rhonda Patrick at the best prices.",
};

export default function ProtocolsPage() {
  const stacks = getAllStacks();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Biohacker Protocols</h1>
        <p className="text-gray-500 max-w-2xl">
          Published supplement stacks from leading health optimizers. We are not affiliated with any of these individuals.
          We just make it easy to shop their publicly shared protocols at the best prices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stacks.map((stack) => {
          const items = JSON.parse(stack.ingredients);
          const products = items.map((slug: string) => getProductBySlug(slug)).filter(Boolean);
          const totalPrice = products.reduce((sum: number, p: any) => sum + (p?.price || 0), 0);

          return (
            <Link
              key={stack.slug}
              href={`/protocols/${stack.slug}`}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-emerald-200 transition-all"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">{stack.name}</h2>
              <p className="text-sm text-gray-500 mb-3 line-clamp-3">{stack.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-400">{items.length} supplements</span>
                <span className="text-lg font-bold text-emerald-600">${totalPrice.toFixed(2)}</span>
              </div>
              {stack.source && <p className="text-xs text-gray-400 mt-1">Source: {stack.source}</p>}
            </Link>
          );
        })}
      </div>

      <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="font-semibold text-amber-900 mb-2">Disclaimer</h3>
        <p className="text-sm text-amber-800">
          These protocols are based on publicly available information shared by these individuals on their podcasts, websites, and social media.
          We are not affiliated with, endorsed by, or connected to any of them. Individual supplement needs vary — consult your healthcare provider.
          Protocols may have changed since we last updated this page.
        </p>
      </div>
    </div>
  );
}
