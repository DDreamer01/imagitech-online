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
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-brand font-bold uppercase tracking-wider">
            {"// Tag Archive"}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-content-main sm:text-4xl">
          #{formattedTag}
        </h1>
        <p className="font-mono text-xs text-content-muted">
          Showing {posts.length} {posts.length === 1 ? "article" : "articles"} indexed under this topic.
        </p>
      </div>

      {/* Articles List */}
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="group space-y-2">
            <div className="flex items-center gap-3 text-xs text-content-muted font-mono">
              <time dateTime={post.date}>{post.date}</time>
              <span>&bull;</span>
              <span>{post.readingTime}</span>
            </div>
            <h2 className="text-xl font-bold text-content-main group-hover:text-brand transition-colors">
              <Link href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-content-muted leading-relaxed line-clamp-2">
              {post.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.tags.map((t) => (
                <Link
                  key={t}
                  href={`/tags/${encodeURIComponent(t.toLowerCase())}`}
                  className="font-mono text-[10px] px-2 py-0.5 rounded border border-edge bg-surface text-content-muted hover:border-brand hover:text-brand transition-colors"
                >
                  #{t}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
