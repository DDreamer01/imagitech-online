import React from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Metadata } from "next";
import Mdx from "@/components/Mdx";

export const metadata: Metadata = {
  title: "Changelog",
  description: "A reverse-chronological log of changes, improvements, and new content added to imagitech.online.",
};

export default function ChangelogPage() {
  const filePath = path.join(process.cwd(), "content", "changelog.mdx");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(fileContent);

  return (
    <div className="max-w-3xl">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sky-400 mb-2">
          Platform History
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-100">Changelog</h1>
        <p className="mt-2 text-xs text-slate-400 font-mono tracking-wider uppercase">site.history()</p>
      </header>

      <div className="prose prose-slate prose-invert max-w-none">
        <Mdx source={content} />
      </div>
    </div>
  );
}
