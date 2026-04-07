import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — The Longevity Agent",
  description:
    "The science behind prescription longevity medicine. Rapamycin, LDN, HRT, testosterone optimization — evidence-based, no hype.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div>
      <section className="py-16 sm:py-20 border-b border-[var(--card-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-[var(--muted)]">
            The science behind longevity medicine. Evidence-based, no hype.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="divide-y divide-[var(--card-border)]">
            {posts.map((post) => (
              <article key={post.slug} className="py-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)] bg-[var(--accent-dim)] border border-[var(--accent)]/20 px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-[var(--muted-light)]">{post.readTime} read</span>
                </div>
                <Link href={`/blog/${post.slug}`} className="group">
                  <h2 className="text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors mb-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-[var(--muted)] text-sm leading-relaxed mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--muted-light)]">{formatDate(post.date)}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-medium text-[var(--accent)] hover:underline underline-offset-2"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
