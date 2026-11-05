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
    <div className="space-y-12 max-w-4xl">
      <header className="border-b border-slate-800 pb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400 mb-3 flex items-center gap-3">
          <span className="inline-block w-2 h-2 bg-sky-400"></span>
          // Field Notes &amp; Engineering Articles
        </div>
        <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-tight text-slate-100">
          Blog
        </h1>
        <p className="mt-2 text-xs text-slate-400 font-mono tracking-wider uppercase">
          index_articles() &bull; {posts.length} entries published
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-sm text-slate-500 font-mono italic p-6 border border-slate-800 bg-slate-950/20">
          No articles published yet. Check back soon.
        </p>
      ) : (
        <div className="border-t border-b border-slate-800 divide-y divide-slate-800/80">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block py-6 px-4 -mx-4 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-baseline transition-all hover:bg-slate-900/90"
            >
              {/* Date */}
              <span className="col-span-12 md:col-span-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-500 group-hover:text-slate-300">
                {post.date}
              </span>

              {/* Primary Tag Badge */}
              <span className="col-span-12 md:col-span-2 flex flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em]">
                {post.tags && post.tags[0] ? (
                  <span className="border border-slate-700 group-hover:border-sky-400 px-2 py-0.5 text-slate-300 group-hover:text-sky-400 transition-colors">
                    {post.tags[0]}
                  </span>
                ) : (
                  <span className="border border-slate-800 px-2 py-0.5 text-slate-500">
                    Guide
                  </span>
                )}
                {post.readingTime && (
                  <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                    {post.readingTime}
                  </span>
                )}
              </span>

              {/* Title & Description */}
              <span className="col-span-12 md:col-span-6">
                <span className="block font-bold text-slate-100 group-hover:text-sky-400 transition-colors text-base sm:text-xl leading-snug">
                  {post.title}
                </span>
                <span className="mt-2 block text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 line-clamp-2 leading-relaxed">
                  {post.description}
                </span>
              </span>

              {/* Directional Prompt */}
              <span className="hidden md:flex col-span-2 justify-end font-mono text-xs uppercase tracking-[0.18em] text-slate-500 group-hover:text-sky-400 transition-colors">
                Read →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
