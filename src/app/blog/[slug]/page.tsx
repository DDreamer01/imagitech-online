import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlogPostBySlug, getBlogPosts, extractHeadings } from "@/lib/mdx";
import Mdx from "@/components/Mdx";
import TableOfContents from "@/components/TableOfContents";
import Giscus from "@/components/Giscus";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: ["†hε drεαmεr"],
    },
  };
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getBlogPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const headings = extractHeadings(post.content);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-start">
      {/* Article Content Column */}
      <div className="lg:col-span-3 min-w-0">
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-slate-500 hover:text-sky-400 mb-6 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          index_articles()
        </Link>

        {/* Post Header — Framed Technical Dossier */}
        <header className="mb-10 border border-slate-800 bg-slate-950/40 p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-sky-400 uppercase tracking-widest text-[11px] font-bold">
              <span className="inline-block w-2 h-2 bg-sky-400"></span>
              <span>Field Guide</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500 uppercase tracking-wider text-[11px]">
              <time dateTime={post.date}>{post.date}</time>
              <span>&bull;</span>
              <span>{post.readingTime}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight">
              {post.title}
            </h1>
            {post.description && (
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl pt-1">
                {post.description}
              </p>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <span className="text-slate-500 uppercase tracking-wider text-[10px]">Taxonomy</span>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="border border-slate-800 px-2 py-0.5 text-[11px] text-slate-300 uppercase tracking-wider bg-slate-900/40">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Mobile Table of Contents */}
        {headings.length > 0 && (
          <details className="lg:hidden mb-8 border border-slate-800 bg-slate-950/40 p-4 font-mono text-xs">
            <summary className="font-semibold text-slate-300 cursor-pointer select-none focus:text-sky-400 focus:outline-none flex items-center justify-between">
              <span>Outline ({headings.length} headings)</span>
              <span className="text-slate-600 text-[10px]">toc()</span>
            </summary>
            <ul className="mt-3 pl-3 border-l border-slate-800 space-y-2 text-slate-400">
              {headings.map((item) => (
                <li 
                  key={item.id}
                  style={{ paddingLeft: `${(item.depth - 2) * 12}px` }}
                >
                  <a href={`#${item.id}`} className="hover:text-sky-400 transition-colors">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        )}

        {/* MDX Body Content */}
        <div className="prose prose-slate prose-invert max-w-none">
          <Mdx source={post.content} />
        </div>

        {/* Prev / Next Navigation */}
        <nav className="mt-14 pt-8 border-t border-slate-800" aria-label="Post navigation">
          <div className="flex flex-col sm:flex-row justify-between gap-4 font-mono">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group flex-1 p-5 border border-slate-800 bg-slate-950/30 hover:border-slate-600 hover:bg-slate-900/40 transition-colors"
              >
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5">
                  <span>←</span>
                  <span>[ PREV ]</span>
                </div>
                <span className="text-sm font-semibold text-slate-200 group-hover:text-sky-400 transition-colors line-clamp-1">{prevPost.title}</span>
              </Link>
            ) : <div className="flex-1" />}
            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group flex-1 p-5 border border-slate-800 bg-slate-950/30 hover:border-slate-600 hover:bg-slate-900/40 transition-colors text-right"
              >
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center justify-end gap-1.5">
                  <span>[ NEXT ]</span>
                  <span>→</span>
                </div>
                <span className="text-sm font-semibold text-slate-200 group-hover:text-sky-400 transition-colors line-clamp-1">{nextPost.title}</span>
              </Link>
            ) : <div className="flex-1" />}
          </div>
        </nav>

        {/* Comments */}
        <Giscus slug={slug} />
      </div>

      {/* Sticky Table of Contents Sidebar */}
      <aside className="lg:col-span-1 sticky top-24 hidden lg:block max-h-[calc(100vh-8rem)] overflow-y-auto">
        <TableOfContents items={headings} />
      </aside>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": post.title,
            "description": post.description,
            "datePublished": post.date,
            "author": {
              "@type": "Person",
              "name": "†hε drεαmεr"
            },
            "publisher": {
              "@type": "Organization",
              "name": "†hε drεαmεr's Notebook"
            }
          })
        }}
      />
    </div>
  );
}
