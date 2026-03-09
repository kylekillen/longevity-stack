import Link from "next/link";

export const metadata = {
  title: "How We Make Money — The Longevity Agent",
  description: "Full transparency on how The Longevity Agent earns revenue through affiliate commissions.",
};

export default function HowWeMakeMoneyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-6">How We Make Money</h1>

      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-[var(--muted)] mb-8">
          Full transparency. No fine print. Here&apos;s exactly how The Longevity Agent generates revenue.
        </p>

        <h2 className="text-2xl font-bold text-[var(--foreground)] mt-10 mb-4">Affiliate Commissions</h2>
        <p className="text-[var(--muted)] mb-4">
          When you click a &quot;Buy&quot; button on our site and make a purchase, we earn a commission
          from the retailer. The commission rates vary:
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)]">
                <th className="text-left py-2 pr-4 font-medium text-[var(--muted)]">Retailer</th>
                <th className="text-right py-2 pr-4 font-medium text-[var(--muted)]">Commission</th>
                <th className="text-left py-2 font-medium text-[var(--muted)]">Notes</th>
              </tr>
            </thead>
            <tbody className="text-[var(--muted)]">
              <tr className="border-b border-[var(--card-border)]">
                <td className="py-2 pr-4">iHerb</td>
                <td className="py-2 pr-4 text-right">5-20%</td>
                <td className="py-2">Volume tiers, best general program</td>
              </tr>
              <tr className="border-b border-[var(--card-border)]">
                <td className="py-2 pr-4">Thorne</td>
                <td className="py-2 pr-4 text-right">15%</td>
                <td className="py-2">Premium brand, high average order value</td>
              </tr>
              <tr className="border-b border-[var(--card-border)]">
                <td className="py-2 pr-4">Life Extension</td>
                <td className="py-2 pr-4 text-right">8-12%</td>
                <td className="py-2">Large catalog</td>
              </tr>
              <tr className="border-b border-[var(--card-border)]">
                <td className="py-2 pr-4">Nootropics Depot</td>
                <td className="py-2 pr-4 text-right">10%</td>
                <td className="py-2">Core audience match</td>
              </tr>
              <tr className="border-b border-[var(--card-border)]">
                <td className="py-2 pr-4">Pure Encapsulations</td>
                <td className="py-2 pr-4 text-right">~8%</td>
                <td className="py-2">Via ShareASale</td>
              </tr>
              <tr className="border-b border-[var(--card-border)]">
                <td className="py-2 pr-4">Amazon</td>
                <td className="py-2 pr-4 text-right">1%</td>
                <td className="py-2">Lowest commission, lowest trust</td>
              </tr>
              <tr className="border-b border-[var(--card-border)]">
                <td className="py-2 pr-4">All other vendors</td>
                <td className="py-2 pr-4 text-right">5-12%</td>
                <td className="py-2">NOW Foods, Jarrow, Swanson, Nordic Naturals, Momentous, Garden of Life, Vital Proteins, Bulk Supplements, Nutricost, Nature&apos;s Way</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-[var(--foreground)] mt-10 mb-4">Our Commitments</h2>

        <div className="space-y-4 mb-8">
          <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-lg p-4">
            <h3 className="font-semibold text-cyan-300 mb-1">We always show the cheapest option</h3>
            <p className="text-sm text-cyan-400">
              Even when the cheapest retailer pays us the lowest commission. If Amazon is genuinely
              the best price for an authenticated product, we show it — even though Amazon pays us 1%
              compared to 15% from Thorne Direct.
            </p>
          </div>

          <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-lg p-4">
            <h3 className="font-semibold text-cyan-300 mb-1">We flag authenticity risks</h3>
            <p className="text-sm text-cyan-400">
              We don&apos;t hide the{" "}
              <Link href="/why-not-amazon" className="underline">problems with Amazon supplements</Link>.
              We warn users even though it costs us conversions. Trust is more valuable than any
              single commission.
            </p>
          </div>

          <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-lg p-4">
            <h3 className="font-semibold text-cyan-300 mb-1">No sponsored placements</h3>
            <p className="text-sm text-cyan-400">
              Product ordering is always by price (per-serving cost). We never accept payment to
              rank a product higher. What you see is sorted by value, not by who pays us more.
            </p>
          </div>

          <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-lg p-4">
            <h3 className="font-semibold text-cyan-300 mb-1">No hidden fees or markups</h3>
            <p className="text-sm text-cyan-400">
              The prices you see are the actual retail prices at each vendor. We don&apos;t add
              markups, and our affiliate links don&apos;t change the price you pay. The vendor
              pays us from their marketing budget.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[var(--foreground)] mt-10 mb-4">What This Costs to Run</h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)]">
                <th className="text-left py-2 pr-4 font-medium text-[var(--muted)]">Expense</th>
                <th className="text-right py-2 font-medium text-[var(--muted)]">Monthly Cost</th>
              </tr>
            </thead>
            <tbody className="text-[var(--muted)]">
              <tr className="border-b border-[var(--card-border)]">
                <td className="py-2 pr-4">Hosting (Vercel)</td>
                <td className="py-2 text-right">$0-20</td>
              </tr>
              <tr className="border-b border-[var(--card-border)]">
                <td className="py-2 pr-4">Database</td>
                <td className="py-2 text-right">$0-25</td>
              </tr>
              <tr className="border-b border-[var(--card-border)]">
                <td className="py-2 pr-4">Price monitoring</td>
                <td className="py-2 text-right">$49</td>
              </tr>
              <tr className="border-b border-[var(--card-border)]">
                <td className="py-2 pr-4">Domain</td>
                <td className="py-2 text-right">~$1</td>
              </tr>
              <tr className="border-b border-[var(--card-border)] font-medium">
                <td className="py-2 pr-4">Total</td>
                <td className="py-2 text-right">$50-95/month</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-[var(--muted)] mb-8">
          We break even at roughly 5-10 affiliate conversions per month. This is a lean operation
          by design.
        </p>

        <h2 className="text-2xl font-bold text-[var(--foreground)] mt-10 mb-4">What We Don&apos;t Do</h2>
        <ul className="list-disc list-inside space-y-2 text-[var(--muted)] mb-8">
          <li>We don&apos;t sell your data</li>
          <li>We don&apos;t require accounts or emails</li>
          <li>We don&apos;t run display ads</li>
          <li>We don&apos;t accept sponsored content or paid reviews</li>
          <li>We don&apos;t make medical claims or provide medical advice</li>
        </ul>

        <p className="text-[var(--muted)]">
          Questions about our business model? We&apos;re happy to explain anything in detail.
          Transparency builds trust, and trust is our only real product.
        </p>
      </div>

      <div className="border-t border-[var(--card-border)] pt-6 mt-10">
        <p className="text-xs text-[var(--muted)]">
          This page is part of our commitment to transparency. We believe that being honest about
          how we make money is the only way to build the trust necessary to recommend health products.
        </p>
      </div>
    </div>
  );
}
