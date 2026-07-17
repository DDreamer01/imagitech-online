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
    <div className="max-w-3xl space-y-8">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">Wiki Notes</h1>
        <p className="mt-2 text-sm text-slate-400 font-mono">
          index_notes() &bull; {notes.length} configurations archived
        </p>
      </header>

      <NotesClient initialNotes={notes} />
    </div>
  );
}
