import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWriteupBySlug, getWriteups, getWriteupPlatform, extractHeadings, WRITEUP_PLATFORMS } from "@/lib/mdx";
import Mdx from "@/components/Mdx";
import TableOfContents from "@/components/TableOfContents";

interface PageProps {
  params: Promise<{ platform: string; slug: string }>;
}

export async function generateStaticParams() {
  return WRITEUP_PLATFORMS.flatMap((platform) =>
    getWriteups(platform.slug).map((writeup) => ({
      platform: platform.slug,
      slug: writeup.slug,
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { platform: platformSlug, slug } = await params;
  const writeup = getWriteupBySlug(platformSlug, slug);
  const platform = getWriteupPlatform(platformSlug);

  if (!writeup || !platform) {
    return {
      title: "Writeup Not Found",
    };
  }

  return {
    title: `${writeup.title} - ${platform.name}`,
    description: writeup.description || `Security writeup for ${writeup.title} on ${platform.name}.`,
  };
}

export default async function WriteupDetailPage({ params }: PageProps) {
  const { platform: platformSlug, slug } = await params;
  const writeup = getWriteupBySlug(platformSlug, slug);
  const platform = getWriteupPlatform(platformSlug);

  if (!writeup || !platform) {
    notFound();
  }

  const headings = extractHeadings(writeup.content);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-start">
      {/* Writeup Content */}
      <div className="lg:col-span-3 min-w-0">

        {/* Back Link */}
        <Link
          href={`/writeups/${platformSlug}`}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 hover:text-sky-400 mb-6 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          back_to_{platformSlug}()
        </Link>

        {/* Writeup Header */}
        <header className="mb-8 border-b border-slate-800 pb-5">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono mb-2">
            <span className="px-1.5 py-0.5 rounded border border-slate-800 bg-slate-900/60 text-emerald-400">
              {platform.name}
            </span>
            {writeup.difficulty && (
              <span className="px-1.5 py-0.5 rounded border border-slate-800 bg-slate-900/60 text-sky-400">
                {writeup.difficulty}
              </span>
            )}
            {writeup.points && (
              <span className="px-1.5 py-0.5 rounded border border-slate-800 bg-slate-900/60 text-slate-400">
                {writeup.points} pts
              </span>
            )}
            <span className="text-slate-500">&bull;</span>
            <time className="text-slate-500" dateTime={writeup.date}>{writeup.date}</time>
            {writeup.readingTime && (
              <>
                <span className="text-slate-500">&bull;</span>
                <span className="text-slate-500">{writeup.readingTime}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
            {writeup.title}
          </h1>
        </header>

        {/* Mobile Table of Contents */}
        {headings.length > 0 && (
          <details className="lg:hidden mb-6 rounded-lg border border-slate-800 bg-slate-950/20 p-4 font-mono text-xs">
            <summary className="font-semibold text-slate-300 cursor-pointer select-none focus:text-sky-400 focus:outline-none">
              Outline ({headings.length} headings)
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

        {/* Compiled Content */}
        <div className="prose prose-slate prose-invert max-w-none">
          <Mdx source={writeup.content} />
        </div>

      </div>

      {/* Sticky Table of Contents Sidebar */}
      {headings.length > 0 && (
        <aside className="lg:col-span-1 sticky top-24 hidden lg:block max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 border-l border-slate-800/60 pl-6">
          <TableOfContents items={headings} />
        </aside>
      )}
    </div>
  );
}
