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
    <div className="bg-white">
      <section className="py-16 sm:py-20 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--navy)] mb-4">Blog</h1>
          <p className="text-xl text-[var(--gray)]">
            The science behind longevity medicine. Evidence-based, no hype.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="divide-y divide-gray-100">
            {posts.map((post) => (
              <article key={post.slug} className="py-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--navy)] bg-blue-50 px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-[var(--gray-light)]">{post.readTime} read</span>
                </div>
                <Link href={`/blog/${post.slug}`} className="group">
                  <h2 className="text-xl font-bold text-[var(--navy)] group-hover:text-[var(--navy-light)] transition-colors mb-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-[var(--gray)] text-sm leading-relaxed mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--gray-light)]">{formatDate(post.date)}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-medium text-[var(--navy)] hover:underline underline-offset-2"
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
