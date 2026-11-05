import React from "react";
import type { Metadata } from "next";
import { getNotes } from "@/lib/mdx";
import NotesClient from "./NotesClient";

export const metadata: Metadata = {
  title: "Wiki Notes",
  description: "†hε drεαmεr's short-form developer notes, cheatsheets, quick configurations, command snippets, and diagnostic logs.",
};

export default function NotesListingPage() {
  const notes = getNotes();

  return (
    <div className="max-w-4xl space-y-10">
      <header className="border-b border-slate-800 pb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sky-400 mb-3 flex items-center gap-3">
          <span className="inline-block w-2 h-2 bg-sky-400"></span>
          Cheatsheets · Commands · Diagnostic Logs
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
          Wiki Notes
        </h1>
        <p className="mt-2 text-xs text-slate-400 font-mono tracking-wider uppercase">
          index_notes() &bull; {notes.length} configurations archived
        </p>
      </header>

      <NotesClient initialNotes={notes} />
    </div>
  );
}
