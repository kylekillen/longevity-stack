import Link from "next/link";

export const metadata = {
  title: "Why We Don't Recommend Amazon for Supplements — The Longevity Agent",
  description: "University of Mississippi research found 57% of supplements from Amazon failed quality testing. Here's why commingled inventory makes Amazon a risky choice for supplements.",
};

export default function WhyNotAmazonPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-6">
        Why We Don&apos;t Recommend Amazon for Supplements
      </h1>

      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-[var(--muted)] mb-8">
          Amazon is often the cheapest option. We show Amazon prices when they&apos;re lowest,
          because we believe in transparency. But we flag Amazon with a trust score of 2/10 for supplements,
          and here&apos;s why.
        </p>

        <h2 className="text-2xl font-bold text-[var(--foreground)] mt-10 mb-4">The 57% Failure Rate</h2>
        <p className="text-[var(--muted)] mb-4">
          Researchers at the <strong>University of Mississippi&apos;s National Center for Natural Products Research</strong> tested
          supplements purchased from Amazon and found that <strong>57% failed quality testing</strong>. Products
          either didn&apos;t contain what the label claimed, contained undisclosed ingredients, or had
          contamination issues.
        </p>
        <p className="text-[var(--muted)] mb-4">
          This isn&apos;t a problem with the brands themselves. Many of these same products pass
          quality testing when purchased directly from the manufacturer or from vetted retailers like
          iHerb, Thorne Direct, or Nootropics Depot. The issue is Amazon&apos;s supply chain.
        </p>

        <h2 className="text-2xl font-bold text-[var(--foreground)] mt-10 mb-4">Commingled Inventory: The Root Cause</h2>
        <p className="text-[var(--muted)] mb-4">
          Amazon uses a system called <strong>&quot;commingled inventory&quot;</strong> (also called &quot;stickerless
          inventory&quot;). Here&apos;s how it works:
        </p>
        <ol className="list-decimal list-inside space-y-3 text-[var(--muted)] mb-6">
          <li>Multiple sellers list the same product on Amazon.</li>
          <li>All sellers ship their inventory to Amazon&apos;s warehouses.</li>
          <li>Amazon stores all units together in the same bin, regardless of which seller supplied them.</li>
          <li>When you buy from &quot;Seller A,&quot; you might receive a unit that was actually supplied by &quot;Seller C.&quot;</li>
        </ol>
        <p className="text-[var(--muted)] mb-4">
          This means that even if you buy from the official brand store on Amazon,
          you might receive a counterfeit unit that was shipped to the warehouse by a fraudulent
          third-party seller. Amazon mixes them all together.
        </p>

        <h2 className="text-2xl font-bold text-[var(--foreground)] mt-10 mb-4">Brands Are Sounding the Alarm</h2>
        <div className="space-y-4 mb-6">
          <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
            <p className="text-sm text-yellow-400">
              <strong>Thorne Research:</strong> &quot;Thorne does not sell on Amazon and has not authorized
              any third party to sell Thorne products on Amazon. Products found on Amazon claiming to be
              Thorne are not guaranteed to be authentic.&quot;
            </p>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
            <p className="text-sm text-yellow-400">
              <strong>Nordic Naturals:</strong> Has repeatedly warned consumers that products purchased
              through Amazon may be counterfeit, expired, or improperly stored. They recommend buying
              only through authorized retailers.
            </p>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
            <p className="text-sm text-yellow-400">
              <strong>Garden of Life:</strong> Launched a &quot;Choose Wisely&quot; campaign warning
              consumers that products purchased on Amazon may not be genuine, may have been stored
              improperly, or may be past their expiration dates.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[var(--foreground)] mt-10 mb-4">The Temperature Problem</h2>
        <p className="text-[var(--muted)] mb-4">
          Beyond counterfeits, there&apos;s the storage issue. Many supplements — especially
          probiotics, omega-3 fish oils, and certain vitamins — are sensitive to heat and humidity.
          Amazon warehouses are not climate-controlled for supplement storage. Products may sit in
          trucks, loading docks, or warehouses at temperatures that degrade their active ingredients.
        </p>
        <p className="text-[var(--muted)] mb-4">
          Direct-ship retailers like iHerb maintain climate-controlled warehouses specifically
          designed for supplement storage. When you buy from Thorne Direct, the product ships from
          Thorne&apos;s own facility. The chain of custody is clean.
        </p>

        <h2 className="text-2xl font-bold text-[var(--foreground)] mt-10 mb-4">When We Do Recommend Amazon</h2>
        <p className="text-[var(--muted)] mb-4">
          We still show Amazon prices for two reasons:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-[var(--muted)] mb-6">
          <li><strong>Transparency:</strong> You should see all options and make informed decisions.</li>
          <li><strong>Some products are lower risk:</strong> Shelf-stable products from brands that DO authorize Amazon sales (like NOW Foods) have a lower counterfeit risk.</li>
        </ol>
        <p className="text-[var(--muted)] mb-4">
          But we always flag Amazon with a low trust score (2/10) and recommend direct-ship alternatives
          when available. The few dollars you save aren&apos;t worth the risk of receiving a counterfeit
          or degraded product.
        </p>

        <h2 className="text-2xl font-bold text-[var(--foreground)] mt-10 mb-4">Our Recommended Retailers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[
            { name: 'iHerb', trust: 8, note: 'Climate-controlled warehouses, rigorous QC' },
            { name: 'Thorne Direct', trust: 9, note: 'Ships direct from manufacturer, NSF certified' },
            { name: 'Life Extension', trust: 9, note: 'Premium longevity brand, heavy R&D investment' },
            { name: 'Nootropics Depot', trust: 9, note: 'Publishes COAs for every batch' },
            { name: 'Pure Encapsulations', trust: 9, note: 'Hypoallergenic, no unnecessary additives' },
          ].map((v) => (
            <div key={v.name} className="border border-[var(--card-border)] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-[var(--foreground)]">{v.name}</span>
                <span className="text-xs bg-green-900/50 text-green-400 px-1.5 py-0.5 rounded">{v.trust}/10</span>
              </div>
              <p className="text-xs text-[var(--muted)]">{v.note}</p>
            </div>
          ))}
        </div>

        <div className="bg-[var(--surface)] border border-[var(--card-border)] rounded-xl p-6 text-center">
          <p className="text-[var(--muted)] mb-4">Ready to build a stack from vetted retailers?</p>
          <Link
            href="/ingredients"
            className="inline-flex items-center px-6 py-3 bg-[var(--accent)] text-white font-medium rounded-lg hover:bg-[var(--accent-hover)]"
          >
            Browse Supplements
          </Link>
        </div>
      </div>

      <div className="border-t border-[var(--card-border)] pt-6 mt-10">
        <p className="text-xs text-[var(--muted)]">
          We earn affiliate commissions from all retailers listed, including Amazon. We recommend
          against Amazon for supplements despite earning commissions from them, because trust is
          more important than revenue. See our{" "}
          <Link href="/how-we-make-money" className="underline">transparency page</Link>.
        </p>
      </div>
    </div>
  );
}
