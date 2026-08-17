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
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">Changelog</h1>
        <p className="mt-2 text-sm text-slate-400 font-mono">site.history()</p>
      </header>

      <div className="prose prose-slate prose-invert max-w-none">
        <Mdx source={content} />
      </div>
    </div>
  );
}
