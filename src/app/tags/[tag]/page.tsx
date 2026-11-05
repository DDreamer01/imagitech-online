import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllTags, getPostsByTag } from "@/lib/mdx";

interface TagDetailPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((t) => ({
    tag: encodeURIComponent(t.name.toLowerCase()),
  }));
}

export async function generateMetadata({ params }: TagDetailPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const formattedTag = decodedTag.charAt(0).toUpperCase() + decodedTag.slice(1);

  return {
    title: `${formattedTag} - Topic Archive`,
    description: `Technical guides, systems engineering notes, and configurations tagged under #${formattedTag}.`,
  };
}

export default async function TagDetailPage({ params }: TagDetailPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  if (posts.length === 0) {
    notFound();
  }

  const formattedTag = decodedTag.charAt(0).toUpperCase() + decodedTag.slice(1);

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/tags"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-content-muted hover:text-brand transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        all_tags()
      </Link>

      {/* Header */}
      <div className="space-y-2 border-b border-edge pb-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sky-400 mb-2">
          // Tag Archive
        </div>
        <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-tight text-slate-100">
          #{formattedTag}
        </h1>
        <p className="font-mono text-xs text-slate-400 uppercase tracking-wider">
          Showing {posts.length} {posts.length === 1 ? "article" : "articles"} indexed under this topic
        </p>
      </div>

      {/* Articles List */}
      <div className="border-t border-b border-slate-800 divide-y divide-slate-800/80">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block py-5 px-3 -mx-3 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-baseline transition-all hover:bg-slate-900/90"
          >
            {/* Date */}
            <span className="col-span-12 md:col-span-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-500 group-hover:text-slate-300">
              {post.date}
            </span>

            {/* Reading Time */}
            <span className="col-span-12 md:col-span-2 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
              {post.readingTime || "Guide"}
            </span>

            {/* Title & Description */}
            <span className="col-span-12 md:col-span-6">
              <span className="block font-bold text-slate-100 group-hover:text-sky-400 transition-colors text-base sm:text-lg leading-snug">
                {post.title}
              </span>
              <span className="mt-1 block text-xs text-slate-400 group-hover:text-slate-300 line-clamp-1 leading-relaxed">
                {post.description}
              </span>
            </span>

            {/* Directional Action */}
            <span className="hidden md:flex col-span-2 justify-end font-mono text-xs uppercase tracking-[0.18em] text-slate-500 group-hover:text-sky-400 transition-colors">
              Read →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
