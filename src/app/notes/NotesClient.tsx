"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Note } from "@/types";

interface NotesClientProps {
  initialNotes: Note[];
}

export default function NotesClient({ initialNotes }: NotesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Dynamically extract categories from the loaded notes list
  const categories = useMemo(() => {
    const cats = new Set(initialNotes.map((note) => note.category || "General"));
    return ["All", ...Array.from(cats).sort()];
  }, [initialNotes]);

  // Filter notes based on the selected category tab
  const filteredNotes = useMemo(() => {
    if (selectedCategory === "All") return initialNotes;
    return initialNotes.filter((note) => (note.category || "General") === selectedCategory);
  }, [initialNotes, selectedCategory]);

  // Group filtered notes by category
  const grouped = useMemo(() => {
    return filteredNotes.reduce((acc, note) => {
      const cat = note.category || "General";
      if (!acc[cat]) {
        acc[cat] = [];
      }
      acc[cat].push(note);
      return acc;
    }, {} as Record<string, Note[]>);
  }, [filteredNotes]);

  const activeCategories = useMemo(() => {
    return Object.keys(grouped).sort();
  }, [grouped]);

  return (
    <div className="space-y-8">
      {/* Category Tabs Selector */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-900 font-mono text-xs">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded transition-all focus:outline-none focus:ring-1 focus:ring-sky-500/50 ${
                isActive
                  ? "bg-sky-950/40 border border-sky-500/30 text-sky-400 font-bold"
                  : "border border-slate-800 bg-slate-950/20 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              {category === "All" ? "all_notes()" : `${category.toLowerCase()}`}
            </button>
          );
        })}
      </div>

      {filteredNotes.length === 0 ? (
        <p className="text-sm text-slate-500 font-mono italic p-6 border border-slate-800 rounded bg-slate-950/20">
          No notes found in this category.
        </p>
      ) : (
        <div className="space-y-10">
          {activeCategories.map((category) => (
            <section key={category} className="space-y-3">
              <h2 className="text-sm font-mono font-bold text-sky-400 uppercase tracking-wider border-b border-slate-800 pb-1.5">
                {"//"} {category}
              </h2>
              <ul className="divide-y divide-slate-800/40">
                {grouped[category].map((note) => (
                  <li key={note.slug} className="py-3 flex items-center justify-between gap-4 group">
                    <Link
                      href={`/notes/${note.slug}`}
                      className="text-sm font-semibold text-slate-200 hover:text-sky-400 group-hover:text-sky-400 transition-colors"
                    >
                      {note.title}
                    </Link>
                    <time className="text-xs text-slate-500 font-mono shrink-0">
                      {note.date}
                    </time>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
