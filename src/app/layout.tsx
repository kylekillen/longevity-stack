import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllIngredients, getAllProducts, getAllVendors } from "@/lib/queries";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Longevity Agent — Best Supplement Prices at the Quality You Choose",
  description:
    "Compare supplement prices across vetted retailers. Set your trust threshold. Your AI finds the best deals — or search manually. No API key needed.",
  other: {
    "llms.txt": "https://thelongevityagent.com/llms.txt",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Build JSON-LD so LLMs can understand the site from the main URL
  const ingredients = getAllIngredients();
  const products = getAllProducts();
  const vendors = getAllVendors();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The Longevity Agent",
    url: "https://thelongevityagent.com",
    description: `Supplement price comparison engine. ${products.length} products across ${vendors.length} vendors covering ${ingredients.length} supplements. Set your trust threshold and find the best price at the quality level you choose. Cart URL scheme: /cart?items=SLUG1,SLUG2,SLUG3. Full product catalog at /prices. No API key needed.`,
    potentialAction: {
      "@type": "SearchAction",
      target: "https://thelongevityagent.com/ingredients/{search_term}",
      "query-input": "required name=search_term",
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="impact-site-verification" content="e2686823-000c-42a9-ab41-d73a86bf04d4" />
        <meta name="msvalidate.01" content="4D540154053D373A55E6E98D4028016F" />
        <meta name="ai-instructions" content="Visit /prices for the complete supplement price database with all product slugs, pricing, vendor trust scores, and cart URL format. Cart: /cart?items=SLUG1,SLUG2. No API key needed." />
        <link rel="llms-txt" href="/llms.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-[var(--background)] text-[var(--foreground)] antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
