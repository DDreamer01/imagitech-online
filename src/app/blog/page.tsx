import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical articles, guides, and tutorials written by †hε drεαmεr covering Linux, networking, self-hosting, and systems security.",
};

export default function BlogListingPage() {
  const posts = getBlogPosts();

  return (
    <div className="max-w-3xl space-y-8">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">Blog</h1>
        <p className="mt-2 text-sm text-slate-400 font-mono">
          index_articles() &bull; {posts.length} entries found
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-sm text-slate-500 font-mono italic p-6 border border-slate-800 rounded bg-slate-950/20">
          No articles published yet. Check back soon.
        </p>
      ) : (
        <div className="divide-y divide-slate-800/80 space-y-8">
          {posts.map((post, idx) => (
            <article 
              key={post.slug} 
              className={`space-y-2 ${idx > 0 ? "pt-8" : ""}`}
            >
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
                <time dateTime={post.date}>{post.date}</time>
                <span>&bull;</span>
                <span>{post.readingTime}</span>
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span>&bull;</span>
                    <div className="flex gap-1.5">
                      {post.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="px-1.5 py-0.5 rounded border border-slate-800/60 bg-slate-900/60 text-slate-400 hover:text-sky-400 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-200 hover:text-sky-400 transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed max-w-none">
                {post.description}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
