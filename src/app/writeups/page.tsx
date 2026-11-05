import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getWriteups, getWriteupPlatform, WRITEUP_PLATFORMS } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Writeups",
  description:
    "†hε drεαmεr's security writeups — walk-throughs and solutions from pwn.college, HackTheBox, and PortSwigger.",
};

function platformAccentIndex(index: number) {
  const accents = [
    { text: "text-emerald-400", chip: "border-emerald-500/30 text-emerald-400 bg-emerald-950/20" },
    { text: "text-sky-400", chip: "border-sky-500/30 text-sky-400 bg-sky-950/20" },
    { text: "text-amber-400", chip: "border-amber-500/30 text-amber-400 bg-amber-950/20" },
  ];
  return accents[index % accents.length];
}

export default function WriteupsHubPage() {
  const allWriteups = getWriteups();

  return (
    <div className="space-y-14 max-w-4xl">
      <header className="border-b border-slate-800 pb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sky-400 mb-3 flex items-center gap-3">
          <span className="inline-block w-2 h-2 bg-sky-400"></span>
          Offensive Security · CTF Walk-Throughs &amp; Labs
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
          Writeups
        </h1>
        <p className="mt-2 text-xs text-slate-400 font-mono tracking-wider uppercase">
          solve_log() &bull; {allWriteups.length} total solutions across {WRITEUP_PLATFORMS.length} platforms
        </p>
      </header>

      {/* Practice Platforms Grid */}
      <section className="space-y-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400 border-b border-slate-800 pb-2">
          Target Platforms
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {WRITEUP_PLATFORMS.map((platform, index) => {
            const writeups = getWriteups(platform.slug);
            const accent = platformAccentIndex(index);
            const latest = writeups[0];
            const validPlatform = getWriteupPlatform(platform.slug) !== null;

            return (
              <Link
                key={platform.slug}
                href={`/writeups/${platform.slug}`}
                className="group flex flex-col justify-between border border-slate-800 bg-slate-950/40 p-6 transition-all hover:border-slate-600 hover:bg-slate-900/60"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 font-mono text-[11px]">
                    <span className="text-slate-500 tracking-[0.2em] uppercase">
                      [ 0{index + 1} ]
                    </span>
                    <span
                      className={`shrink-0 px-2 py-0.5 border text-[10px] uppercase font-bold tracking-wider ${accent.chip}`}
                    >
                      {writeups.length} {writeups.length === 1 ? "solve" : "solves"}
                    </span>
                  </div>

                  <h2 className={`text-xl font-bold ${accent.text} group-hover:text-white transition-colors`}>
                    {platform.name}
                  </h2>

                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {platform.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800/80 font-mono text-xs text-slate-500 flex items-center justify-between gap-2">
                  {latest ? (
                    <span className="truncate text-[11px]">latest: {latest.title}</span>
                  ) : (
                    <span className={validPlatform ? "text-slate-600" : "text-red-400"}>
                      {validPlatform ? "no writeups yet" : "offline"}
                    </span>
                  )}
                  <span className="shrink-0 text-slate-500 group-hover:text-sky-400 transition-colors">
                    enter →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* All Recent Solves Stream — Editorial 12-Column Rows */}
      <section className="space-y-6 pt-4">
        <div className="flex items-end justify-between border-b border-slate-800 pb-3 gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400 mb-1">
              Master Solves Stream
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">
              Recent Walkthroughs
            </h2>
          </div>
          <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
            {allWriteups.length} entries
          </span>
        </div>

        <div className="border-t border-b border-slate-800 divide-y divide-slate-800/80">
          {allWriteups.map((writeup) => {
            const href = writeup.module
              ? `/writeups/${writeup.platform}/${writeup.module}/${writeup.slug}`
              : `/writeups/${writeup.platform}/${writeup.slug}`;
            const platform = getWriteupPlatform(writeup.platform);

            return (
              <Link
                key={`${writeup.platform}-${writeup.module || ""}-${writeup.slug}`}
                href={href}
                className="group block py-5 px-3 -mx-3 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-baseline transition-all hover:bg-slate-900/90"
              >
                {/* Date */}
                <span className="col-span-12 md:col-span-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-500 group-hover:text-slate-300">
                  {writeup.date}
                </span>

                {/* Platform Badge */}
                <span className="col-span-12 md:col-span-2 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em]">
                  <span className="border border-slate-700 group-hover:border-sky-400 px-2 py-0.5 text-slate-300 group-hover:text-sky-400 transition-colors">
                    {platform?.name || writeup.platform}
                  </span>
                  {writeup.difficulty && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      [{writeup.difficulty}]
                    </span>
                  )}
                </span>

                {/* Title & Description */}
                <span className="col-span-12 md:col-span-6">
                  <span className="block font-bold text-slate-100 group-hover:text-sky-400 transition-colors text-base sm:text-lg leading-snug">
                    {writeup.title}
                  </span>
                  {writeup.description && (
                    <span className="mt-1 block text-xs text-slate-400 group-hover:text-slate-300 line-clamp-1 leading-relaxed">
                      {writeup.description}
                    </span>
                  )}
                </span>

                {/* Directional Action */}
                <span className="hidden md:flex col-span-2 justify-end font-mono text-xs uppercase tracking-[0.18em] text-slate-500 group-hover:text-sky-400 transition-colors">
                  Solve →
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
