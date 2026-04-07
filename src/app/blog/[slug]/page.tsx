import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPost, formatDate } from "@/lib/blog";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

const SITE_URL = "https://thelongevityagent.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `${SITE_URL}/blog/${slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.date,
      images: [{ url: "/og-product.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getAllPosts().filter((p) => p.slug !== slug).slice(0, 2);

  // Convert simple markdown-ish content to HTML blocks
  const sections = post.content.split(/\n\n+/).map((block) => block.trim()).filter(Boolean);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: "The Longevity Agent" },
    publisher: {
      "@type": "Organization",
      name: "The Longevity Agent",
      url: SITE_URL,
    },
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "The Science", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back */}
          <Link href="/blog" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8 block">
            ← Back to blog
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)] bg-[var(--accent-dim)] border border-[var(--accent)]/20 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-[var(--muted-light)]">{post.readTime} read</span>
            <span className="text-xs text-[var(--muted-light)]">{formatDate(post.date)}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-lg text-[var(--muted)] leading-relaxed border-l-4 border-[var(--accent)] pl-4 mb-10">
            {post.excerpt}
          </p>

          {/* Content */}
          <div className="prose-longevity">
            {sections.map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-xl font-bold text-[var(--foreground)] mt-10 mb-4">
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (block.startsWith("- ")) {
                const items = block.split("\n").filter((l) => l.startsWith("- "));
                return (
                  <ul key={i} className="space-y-2 mb-6 list-disc list-inside text-[var(--muted)]">
                    {items.map((item, j) => (
                      <li key={j}>{item.replace("- ", "")}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="text-[var(--muted)] leading-relaxed mb-6">
                  {block}
                </p>
              );
            })}
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="py-12 bg-[var(--surface)] border-t border-[var(--card-border)]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Ready to start?
          </h2>
          <p className="text-[var(--muted)] mb-6">
            Prescription longevity medicine starting at $19/month. Physician review within 48 hours.
          </p>
          <Link
            href="/intake"
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--background)] font-semibold px-7 py-3 rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
          >
            Start your intake
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="py-12 border-t border-[var(--card-border)]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-lg font-bold mb-6">More from the blog</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 hover:border-[var(--accent)]/40 transition-colors group"
                >
                  <span className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wide">{p.category}</span>
                  <h3 className="font-semibold text-[var(--foreground)] mt-1 mb-1 group-hover:text-[var(--accent)] transition-colors leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[var(--muted-light)]">{p.readTime} read</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
