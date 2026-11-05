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
    <div className="space-y-10">
      {/* Category Tabs Selector with Crisp Hairline Buttons */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-800 font-mono text-xs">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 border transition-all uppercase tracking-wider text-[11px] focus:outline-none ${
                isActive
                  ? "border-sky-400 bg-sky-950/40 text-sky-400 font-bold"
                  : "border-slate-800 bg-slate-950/30 text-slate-400 hover:border-slate-600 hover:text-slate-200"
              }`}
            >
              {category === "All" ? "all_notes()" : category}
            </button>
          );
        })}
      </div>

      {filteredNotes.length === 0 ? (
        <p className="text-sm text-slate-500 font-mono italic p-6 border border-slate-800 bg-slate-950/20">
          No notes found in this category.
        </p>
      ) : (
        <div className="space-y-12">
          {activeCategories.map((category) => (
            <section key={category} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="font-mono text-xs font-bold text-sky-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-sky-400"></span>
                  {"//"} {category}
                </h2>
                <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                  {grouped[category].length} {grouped[category].length === 1 ? "entry" : "entries"}
                </span>
              </div>

              <div className="border-t border-b border-slate-800 divide-y divide-slate-800/60">
                {grouped[category].map((note) => (
                  <Link
                    key={note.slug}
                    href={`/notes/${note.slug}`}
                    className="py-4 px-3 flex items-center justify-between gap-4 group hover:bg-slate-900/60 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-semibold text-slate-200 group-hover:text-sky-400 transition-colors">
                      {note.title}
                    </span>
                    <div className="flex items-center gap-3 shrink-0 font-mono text-xs text-slate-500">
                      <time dateTime={note.date} className="text-[11px]">
                        {note.date}
                      </time>
                      <span className="text-slate-600 group-hover:text-sky-400 transition-colors">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
