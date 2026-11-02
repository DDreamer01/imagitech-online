import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWriteups, getWriteupPlatform, getWriteupModules, WRITEUP_PLATFORMS } from "@/lib/mdx";

interface PageProps {
  params: Promise<{ platform: string }>;
}

export async function generateStaticParams() {
  return WRITEUP_PLATFORMS.map((platform) => ({
    platform: platform.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { platform: platformSlug } = await params;
  const platform = getWriteupPlatform(platformSlug);

  if (!platform) {
    return {
      title: "Platform Not Found",
    };
  }

  return {
    title: `${platform.name} Writeups`,
    description: platform.description,
  };
}

// Status badge config
function statusBadge(status?: string) {
  if (status === "completed") {
    return { label: "🟠 Completed", className: "text-orange-400 border-orange-900 bg-orange-950/40" };
  }
  if (status === "in-progress") {
    return { label: "⏳ In Progress", className: "text-yellow-400 border-yellow-900 bg-yellow-950/40" };
  }
  return null;
}

export default async function WriteupPlatformPage({ params }: PageProps) {
  const { platform: platformSlug } = await params;
  const platform = getWriteupPlatform(platformSlug);

  if (!platform) {
    notFound();
  }

  // --- pwn.college: show module cards ---
  if (platform.hasModules) {
    const modules = getWriteupModules(platformSlug);

    return (
      <div className="space-y-10 max-w-4xl">
        {/* Back Link */}
        <Link
          href="/writeups"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 hover:text-sky-400 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          back_to_platforms()
        </Link>

        <header>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
            {platform.name} <span className="text-emerald-400">Writeups</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400 font-mono">
            listing_modules() &bull; {modules.length} course{modules.length !== 1 ? "s" : ""} tracked
          </p>
        </header>

        {modules.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-800 bg-slate-950/40 p-10 text-center">
            <p className="font-mono text-sm text-slate-500">
              No modules found. Add a subfolder under{" "}
              <code className="text-slate-400">content/writeups/{platformSlug}/</code>.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((mod) => (
              <Link
                key={mod.slug}
                href={`/writeups/${platformSlug}/${mod.slug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-950/40 p-5 transition-colors hover:border-slate-600 hover:bg-slate-900/40"
              >
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs mb-2">
                  <span className="px-1.5 py-0.5 rounded border border-slate-800 bg-slate-950 text-emerald-400">
                    {mod.belt ? "track" : "dojo"}
                  </span>
                  {mod.belt && (
                    <span className="px-1.5 py-0.5 rounded border border-orange-900/80 bg-orange-950/40 text-orange-400 font-semibold">
                      🥋 {mod.belt} Track
                    </span>
                  )}
                  <span className="px-1.5 py-0.5 rounded border border-slate-800 bg-slate-900/60 text-slate-400">
                    {mod.belt && mod.totalModules
                      ? `${mod.writeupCount} / ${mod.totalModules} modules`
                      : `${mod.writeupCount} ${mod.writeupCount === 1 ? "writeup" : "writeups"}`}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                  {mod.name}
                </h2>

                {mod.description && (
                  <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">
                    {mod.description}
                  </p>
                )}

                <div className="mt-3 pt-3 border-t border-slate-800/80 font-mono text-xs text-slate-600 flex items-center justify-between">
                  <span>{mod.belt ? "view track & writeups →" : "view writeups →"}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- Flat platforms: HackTheBox, PortSwigger ---
  const writeups = getWriteups(platformSlug);

  return (
    <div className="space-y-10 max-w-4xl">
      {/* Back Link */}
      <Link
        href="/writeups"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 hover:text-sky-400 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        back_to_platforms()
      </Link>

      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
          {platform.name} <span className="text-sky-400">Writeups</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400 font-mono">
          listing_solves() &bull; {writeups.length} archived
        </p>
      </header>

      {writeups.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-800 bg-slate-950/40 p-10 text-center">
          <p className="font-mono text-sm text-slate-500">
            No writeups archived for {platform.name} yet.
          </p>
          <p className="mt-2 font-mono text-xs text-slate-600">Run `npm run new` to scaffold one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {writeups.map((writeup) => (
            <Link
              key={writeup.slug}
              href={`/writeups/${platformSlug}/${writeup.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-950/40 p-5 transition-colors hover:border-slate-600 hover:bg-slate-900/40"
            >
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs mb-2">
                {writeup.difficulty && (
                  <span className="px-1.5 py-0.5 rounded border border-slate-800 bg-slate-900/60 text-sky-400">
                    {writeup.difficulty}
                  </span>
                )}
                {writeup.points && (
                  <span className="px-1.5 py-0.5 rounded border border-slate-800 bg-slate-900/60 text-slate-400">
                    {writeup.points} pts
                  </span>
                )}
                <span className="text-slate-500">&bull;</span>
                <time className="text-slate-500" dateTime={writeup.date}>
                  {writeup.date}
                </time>
                {writeup.readingTime && (
                  <>
                    <span className="text-slate-500">&bull;</span>
                    <span className="text-slate-500">{writeup.readingTime}</span>
                  </>
                )}
              </div>

              <h2 className="text-lg font-bold text-slate-100 group-hover:text-sky-400 transition-colors">
                {writeup.title}
              </h2>
              {writeup.description && (
                <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">
                  {writeup.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
