import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPost, formatDate } from "@/lib/blog";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — The Longevity Agent`,
    description: post.excerpt,
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

  return (
    <div className="bg-white">

      <article className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back */}
          <Link href="/blog" className="text-sm text-[var(--gray)] hover:text-[var(--navy)] transition-colors mb-8 block">
            ← Back to blog
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--navy)] bg-blue-50 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-[var(--gray-light)]">{post.readTime} read</span>
            <span className="text-xs text-[var(--gray-light)]">{formatDate(post.date)}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--navy)] leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-lg text-[var(--gray)] leading-relaxed border-l-4 border-[var(--navy)] pl-4 mb-10">
            {post.excerpt}
          </p>

          {/* Content */}
          <div className="prose-longevity">
            {sections.map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-xl font-bold text-[var(--navy)] mt-10 mb-4">
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (block.startsWith("- ")) {
                const items = block.split("\n").filter((l) => l.startsWith("- "));
                return (
                  <ul key={i} className="space-y-2 mb-6 list-disc list-inside text-[var(--gray)]">
                    {items.map((item, j) => (
                      <li key={j}>{item.replace("- ", "")}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="text-[var(--gray)] leading-relaxed mb-6">
                  {block}
                </p>
              );
            })}
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="py-12 bg-[var(--gray-bg)] border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-3">
            Ready to start?
          </h2>
          <p className="text-[var(--gray)] mb-6">
            Prescription longevity medicine starting at $19/month. Physician review within 48 hours.
          </p>
          <Link
            href="/intake"
            className="inline-flex items-center gap-2 bg-[var(--navy)] text-white font-semibold px-7 py-3 rounded-lg hover:bg-[var(--navy-dark)] transition-colors"
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
        <section className="py-12 border-t border-gray-100">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-lg font-bold text-[var(--navy)] mb-6">More from the blog</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="border border-gray-200 rounded-xl p-5 hover:border-[var(--navy)] transition-colors group"
                >
                  <span className="text-xs font-semibold text-[var(--navy)] uppercase tracking-wide">{p.category}</span>
                  <h3 className="font-semibold text-[var(--navy)] mt-1 mb-1 group-hover:text-[var(--navy-light)] transition-colors leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[var(--gray-light)]">{p.readTime} read</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
