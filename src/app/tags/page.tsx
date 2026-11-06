import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllTags } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Topic Index / Tags",
  description: "Browse articles and technical logs categorized by systems engineering topics and networking protocols.",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-edge pb-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sky-400 mb-2">
          Taxonomy Matrix
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
          Topic Index
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl pt-1">
          Explore all documented guides, systems architecture diagrams, and networking blueprints filtered by technology.
        </p>
      </div>

      {/* Tags Cloud Grid */}
      {tags.length === 0 ? (
        <p className="font-mono text-sm text-content-muted italic">No tags indexed yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2.5 pt-2">
          {tags.map(({ name, count }) => (
            <Link
              key={name}
              href={`/tags/${encodeURIComponent(name.toLowerCase())}`}
              className="group inline-flex items-center gap-2 px-3 py-1.5 border border-edge bg-surface/60 hover:border-brand/60 hover:bg-surface-elevated transition-all font-mono text-xs"
            >
              <span className="text-content-muted group-hover:text-brand transition-colors">
                #{name}
              </span>
              <span className="px-1.5 py-0.2 bg-canvas text-[10px] text-content-muted group-hover:text-content-main border border-edge/60 transition-colors">
                {count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
