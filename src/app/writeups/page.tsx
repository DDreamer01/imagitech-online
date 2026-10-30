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
  // Rationed accent palette, cycled per platform card
  const accents = [
    { text: "text-emerald-400", chip: "border-slate-800 bg-slate-900/60 text-emerald-400" },
    { text: "text-sky-400", chip: "border-slate-800 bg-slate-900/60 text-sky-400" },
    { text: "text-amber-400", chip: "border-slate-800 bg-slate-900/60 text-amber-400" },
  ];
  return accents[index % accents.length];
}

export default function WriteupsHubPage() {
  return (
    <div className="space-y-10 max-w-4xl">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">Writeups</h1>
        <p className="mt-2 text-sm text-slate-400 font-mono">
          solve_log() &bull; platforms: {WRITEUP_PLATFORMS.length} live
        </p>
      </header>

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
              className="group flex flex-col rounded-lg border border-slate-800 bg-slate-950/40 p-5 transition-colors hover:border-slate-600 hover:bg-slate-900/40"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className={`font-mono text-sm font-bold ${accent.text}`}>
                  {platform.name}
                </h2>
                <span
                  className={`shrink-0 px-1.5 py-0.5 rounded border font-mono text-[10px] ${accent.chip}`}
                >
                  {writeups.length} {writeups.length === 1 ? "writeup" : "writeups"}
                </span>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed flex-none">
                {platform.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 font-mono text-xs text-slate-500 flex items-center justify-between gap-2">
                {latest ? (
                  <span className="truncate">latest: {latest.title}</span>
                ) : (
                  <span className={validPlatform ? "text-slate-600" : "text-red-400"}>
                    {validPlatform ? "no writeups yet" : "offline"}
                  </span>
                )}
                <span className="shrink-0 text-slate-600 group-hover:text-sky-400 transition-colors">
                  enter →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
