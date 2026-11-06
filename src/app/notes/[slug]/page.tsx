import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNoteBySlug, getNotes, extractHeadings } from "@/lib/mdx";
import Mdx from "@/components/Mdx";
import TableOfContents from "@/components/TableOfContents";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const notes = getNotes();
  return notes.map((note) => ({
    slug: note.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  
  if (!note) {
    return {
      title: "Note Not Found",
    };
  }

  return {
    title: `${note.title} - Developer Notes`,
    description: `Quick reference note about ${note.title} in the ${note.category} category.`,
  };
}

export default async function NoteDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  const headings = extractHeadings(note.content);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-start">
      {/* Documentation Content */}
      <div className="lg:col-span-3 min-w-0">
        
        {/* Back Link */}
        <Link 
          href="/notes" 
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-slate-500 hover:text-sky-400 mb-6 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          index_notes()
        </Link>

        {/* Note Header — Framed Dossier */}
        <header className="mb-10 border border-slate-800 bg-slate-950/40 p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-emerald-400 uppercase tracking-widest text-[11px] font-bold">
              <span className="inline-block w-2 h-2 bg-emerald-400"></span>
              <span>Cheatsheet &bull; {note.category}</span>
            </div>
            <time className="text-slate-500 uppercase tracking-wider text-[11px]">{note.date}</time>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100 leading-tight">
            {note.title}
          </h1>
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

        {/* Compiled Content */}
        <div className="prose prose-slate prose-invert max-w-none">
          <Mdx source={note.content} />
        </div>

      </div>

      {/* Sticky Table of Contents Sidebar */}
      {headings.length > 0 && (
        <aside className="lg:col-span-1 sticky top-24 hidden lg:block max-h-[calc(100vh-8rem)] overflow-y-auto">
          <TableOfContents items={headings} />
        </aside>
      )}
    </div>
  );
}
