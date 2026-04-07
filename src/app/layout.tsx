import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://thelongevityagent.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "The Longevity Agent — Cheapest Prescription Longevity Medications",
    template: "%s | The Longevity Agent",
  },
  description:
    "Physician-prescribed longevity medications starting at $19/month. Cheaper than Hims, AgelessRx, Hone Health, and every major telehealth platform. Rapamycin, semaglutide, TRT, HRT, LDN, and more.",
  keywords: [
    "cheap rapamycin prescription",
    "cheapest semaglutide online",
    "cheapest TRT online",
    "longevity medications online",
    "physician-prescribed longevity",
    "metformin for longevity",
    "low dose naltrexone online",
    "compounded semaglutide",
    "bioidentical HRT online",
    "enclomiphene prescription",
    "cheapest finasteride",
    "cheapest telehealth prescriptions",
    "anti-aging prescriptions online",
  ],
  authors: [{ name: "The Longevity Agent" }],
  creator: "The Longevity Agent",
  publisher: "The Longevity Agent",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "The Longevity Agent",
    title: "The Longevity Agent — Cheapest Prescription Longevity Medications",
    description:
      "Physician-prescribed longevity medications starting at $19/month. Rapamycin, semaglutide, TRT, HRT, LDN, finasteride, tretinoin. Cheaper than every major telehealth platform.",
    images: [
      {
        url: "/og-product.png",
        width: 1200,
        height: 630,
        alt: "The Longevity Agent — Prescription Longevity Medications from $19/mo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Longevity Agent — Cheapest Prescription Longevity Medications",
    description:
      "Rapamycin, semaglutide, TRT, HRT, LDN, finasteride, tretinoin. Physician-prescribed. Starting at $19/month.",
    images: ["/og-product.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

// Site-wide JSON-LD: MedicalOrganization
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  name: "The Longevity Agent",
  url: SITE_URL,
  description:
    "Physician-prescribed longevity and preventive health medications. Board-certified physicians. Starting at $19/month.",
  medicalSpecialty: "Geriatric Medicine",
  availableService: [
    { "@type": "MedicalTherapy", name: "Rapamycin therapy" },
    { "@type": "MedicalTherapy", name: "GLP-1 therapy (compounded semaglutide)" },
    { "@type": "MedicalTherapy", name: "Testosterone replacement therapy" },
    { "@type": "MedicalTherapy", name: "Bioidentical hormone replacement therapy" },
    { "@type": "MedicalTherapy", name: "Low dose naltrexone therapy" },
  ],
  priceRange: "$19-$129/month",
  areaServed: { "@type": "Country", name: "United States" },
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
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
