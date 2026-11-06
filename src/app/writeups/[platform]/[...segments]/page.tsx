import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getWriteupPlatform,
  getWriteupModules,
  getWriteupsByModule,
  getWriteupByModuleAndSlug,
  getWriteupBySlug,
  getWriteups,
  extractHeadings,
  WRITEUP_PLATFORMS,
} from "@/lib/mdx";
import { getPlatformTheme } from "@/lib/platform-themes";
import type { Writeup, WriteupPlatform } from "@/types";
import Mdx from "@/components/Mdx";
import TableOfContents from "@/components/TableOfContents";

interface PageProps {
  params: Promise<{ platform: string; segments: string[] }>;
}

// ------------------------------------------------------------------
// Static params generation
// ------------------------------------------------------------------

export async function generateStaticParams() {
  const params: { platform: string; segments: string[] }[] = [];

  for (const platform of WRITEUP_PLATFORMS) {
    if (platform.hasModules) {
      // Module list page: /writeups/[platform]/[module]
      const modules = getWriteupModules(platform.slug);
      for (const mod of modules) {
        params.push({ platform: platform.slug, segments: [mod.slug] });

        // Individual writeup page: /writeups/[platform]/[module]/[slug]
        const writeups = getWriteupsByModule(platform.slug, mod.slug);
        for (const writeup of writeups) {
          params.push({ platform: platform.slug, segments: [mod.slug, writeup.slug] });
          // ALSO direct alias page: /writeups/[platform]/[slug] (resolves user's 404 for /writeups/pwn-college/web-security)
          params.push({ platform: platform.slug, segments: [writeup.slug] });
        }
      }
    } else {
      // Flat writeup page: /writeups/[platform]/[slug]
      const writeups = getWriteups(platform.slug);
      for (const writeup of writeups) {
        params.push({ platform: platform.slug, segments: [writeup.slug] });
      }
    }
  }

  return params;
}

// ------------------------------------------------------------------
// Metadata
// ------------------------------------------------------------------

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { platform: platformSlug, segments } = await params;
  const platform = getWriteupPlatform(platformSlug);
  if (!platform) return { title: "Not Found" };

  if (platform.hasModules && segments.length === 2) {
    const [moduleSlug, slug] = segments;
    const writeup = getWriteupByModuleAndSlug(platformSlug, moduleSlug, slug);
    if (!writeup) return { title: "Writeup Not Found" };
    return {
      title: `${writeup.title} — ${platform.name}`,
      description: writeup.description || `${platform.name} writeup: ${writeup.title}`,
    };
  }

  if (platform.hasModules && segments.length === 1) {
    const [moduleOrSlug] = segments;
    const modules = getWriteupModules(platformSlug);
    const mod = modules.find((m) => m.slug === moduleOrSlug);
    if (mod) {
      const modName = mod.name || toTitleCase(moduleOrSlug);
      return {
        title: `${modName} — ${platform.name}`,
        description:
          mod.description || `Writeups and solutions for ${modName} on ${platform.name}.`,
      };
    }
    // Direct writeup fallback under modular platform
    const writeup = getWriteups(platformSlug).find((w) => w.slug === moduleOrSlug);
    if (writeup) {
      return {
        title: `${writeup.title} — ${platform.name}`,
        description: writeup.description || `${platform.name} writeup: ${writeup.title}`,
      };
    }
  }

  // Flat
  if (segments.length === 1) {
    const writeup = getWriteupBySlug(platformSlug, segments[0]);
    if (!writeup) return { title: "Writeup Not Found" };
    return {
      title: `${writeup.title} - ${platform.name}`,
      description: writeup.description || `Security writeup for ${writeup.title} on ${platform.name}.`,
    };
  }

  return { title: "Not Found" };
}

// ------------------------------------------------------------------
// Helpers & Track Syllabus
// ------------------------------------------------------------------

function toTitleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function statusConfig(status?: string) {
  if (status === "completed")
    return {
      label: "🟠 Completed",
      className: "px-1.5 py-0.5 border border-orange-900 bg-orange-950/40 text-orange-400",
    };
  if (status === "in-progress")
    return {
      label: "⏳ In Progress",
      className: "px-1.5 py-0.5 border border-yellow-900 bg-yellow-950/40 text-yellow-400",
    };
  return null;
}

interface SyllabusItem {
  slug: string;
  number: number;
  name: string;
  summary: string;
}

const INTRO_CYBERSECURITY_SYLLABUS: SyllabusItem[] = [
  { slug: "web-security", number: 1, name: "Web Security", summary: "Content injection, cross-site scripting (XSS), and CSRF" },
  { slug: "intercepting-communication", number: 2, name: "Intercepting Communication", summary: "Wireshark packet sniffing, ARP spoofing & TLS interception" },
  { slug: "cryptography", number: 3, name: "Cryptography", summary: "Classical ciphers, modern encryption, hashing & RSA" },
  { slug: "access-control", number: 4, name: "Access Control", summary: "Linux permissions, SUID abuse, capabilities & authorization" },
  { slug: "reverse-engineering", number: 5, name: "Reverse Engineering", summary: "x86 disassembly, decompilation & control flow recovery" },
  { slug: "binary-exploitation", number: 6, name: "Binary Exploitation", summary: "Memory corruption, stack overflows & shellcoding" },
  { slug: "integrated-security", number: 7, name: "Integrated Security", summary: "Full-spectrum capstone challenge awarding the Orange Belt" },
];

function renderWriteupArticle(
  writeup: Writeup,
  platform: WriteupPlatform,
  modName?: string,
  moduleSlug?: string
) {
  const theme = getPlatformTheme(platform.slug);
  const headings = extractHeadings(writeup.content);
  const badge = statusConfig(writeup.status);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-start">
      <div className="lg:col-span-3 min-w-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500 mb-6 flex-wrap">
          <Link href="/writeups" className="hover:text-slate-300 transition-colors">writeups</Link>
          <span>/</span>
          <Link href={`/writeups/${platform.slug}`} className={`${theme.hoverText} transition-colors`}>
            {platform.name}
          </Link>
          {modName && moduleSlug && (
            <>
              <span>/</span>
              <Link
                href={`/writeups/${platform.slug}/${moduleSlug}`}
                className={`${theme.hoverText} transition-colors`}
              >
                {modName}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-slate-400 truncate">{writeup.title}</span>
        </div>

        {/* Header — Framed Spec Dossier */}
        <header className="mb-10 border border-slate-800 bg-slate-950/40 p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-3 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 py-0.5 border ${theme.chip} uppercase tracking-wider text-[11px] font-bold`}>
                {platform.name}
              </span>
              {modName && (
                <span className="px-2 py-0.5 border border-slate-800 bg-slate-900/60 text-slate-300 uppercase tracking-wider text-[11px]">
                  {modName}
                </span>
              )}
              {writeup.belt && (
                <span className="px-2 py-0.5 border border-orange-900 bg-orange-950/40 text-orange-400 font-semibold text-[11px]">
                  🥋 {writeup.belt}
                </span>
              )}
              {writeup.difficulty && (
                <span className="px-2 py-0.5 border border-slate-800 bg-slate-900/60 text-slate-300 text-[11px]">
                  {writeup.difficulty}
                </span>
              )}
              {writeup.points && (
                <span className="px-2 py-0.5 border border-slate-800 bg-slate-900/60 text-slate-300 text-[11px]">
                  {writeup.points} pts
                </span>
              )}
              {badge && <span className={`font-mono text-xs ${badge.className}`}>{badge.label}</span>}
            </div>
            <div className="flex items-center gap-3 text-slate-500 uppercase tracking-wider text-[11px]">
              <time dateTime={writeup.date}>{writeup.date}</time>
              {writeup.readingTime && (
                <>
                  <span>&bull;</span>
                  <span>{writeup.readingTime}</span>
                </>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-100 leading-tight">
            {writeup.title}
          </h1>
        </header>

        {/* Mobile ToC */}
        {headings.length > 0 && (
          <details className="lg:hidden mb-8 border border-slate-800 bg-slate-950/40 p-4 font-mono text-xs">
            <summary className="font-semibold text-slate-300 cursor-pointer select-none focus:outline-none flex items-center justify-between">
              <span>Outline ({headings.length} headings)</span>
              <span className="text-slate-600 text-[10px]">toc()</span>
            </summary>
            <ul className="mt-3 pl-3 border-l border-slate-800 space-y-2 text-slate-400">
              {headings.map((item) => (
                <li key={item.id} style={{ paddingLeft: `${(item.depth - 2) * 12}px` }}>
                  <a href={`#${item.id}`} className={`${theme.hoverText} transition-colors`}>
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        )}

        <div className="prose prose-slate prose-invert max-w-none">
          <Mdx source={writeup.content} />
        </div>
      </div>

      {headings.length > 0 && (
        <aside className="lg:col-span-1 sticky top-24 hidden lg:block max-h-[calc(100vh-8rem)] overflow-y-auto">
          <TableOfContents items={headings} />
        </aside>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Page
// ------------------------------------------------------------------

export default async function WriteupCatchAllPage({ params }: PageProps) {
  const { platform: platformSlug, segments } = await params;
  const platform = getWriteupPlatform(platformSlug);

  if (!platform) notFound();

  const theme = getPlatformTheme(platformSlug);

  // ----------------------------------------------------------------
  // MODULE LIST PAGE OR DIRECT WRITEUP ALIAS  /writeups/[platform]/[segment]
  // ----------------------------------------------------------------
  if (platform.hasModules && segments.length === 1) {
    const moduleOrSlug = segments[0];
    const modules = getWriteupModules(platformSlug);
    const mod = modules.find((m) => m.slug === moduleOrSlug);

    // If it matched a module folder, show the module hub / roadmap
    if (mod) {
      const writeups = getWriteupsByModule(platformSlug, moduleOrSlug);
      const modName = mod.name || toTitleCase(moduleOrSlug);
      const publishedSlugs = new Set(writeups.map((w) => w.slug));
      const isIntroTrack = moduleOrSlug === "intro-to-cybersecurity";
      const isBeltTrack = Boolean(mod.belt);
      const totalCount = isIntroTrack
        ? INTRO_CYBERSECURITY_SYLLABUS.length
        : mod.totalModules || writeups.length;
      const completedCount = writeups.filter((w) => w.status === "completed").length;
      const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      return (
        <div className="space-y-10 max-w-4xl">
          <Link
            href={`/writeups/${platformSlug}`}
            className={`inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 ${theme.hoverText} transition-colors`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            back_to_{platformSlug}()
          </Link>

          {/* Header */}
          <header className="space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
              <span>{platform.name}</span>
              <span>/</span>
              <span className={theme.text}>{modName}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
                {modName}
              </h1>
              {mod.belt ? (
                <span className="px-2 py-0.5 border border-orange-900/80 bg-orange-950/40 text-orange-400 font-mono text-xs font-semibold">
                  🥋 {mod.belt} Track
                </span>
              ) : (
                <span className="px-1.5 py-0.5 border border-slate-800 bg-slate-900/60 text-slate-400 font-mono text-xs">
                  {writeups.length} {writeups.length === 1 ? "writeup" : "writeups"}
                </span>
              )}
            </div>

            {mod.description ? (
              <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                {mod.description}
              </p>
            ) : (
              <p className="text-sm text-slate-400 font-mono">
                listing_solves() &bull; {writeups.length} archived
              </p>
            )}

            {/* Progress Tracker Card — only rendered for formal belt tracks */}
            {isBeltTrack && (
              <div className="border border-slate-800 bg-slate-950/60 p-4 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    Track Progress: <strong className="text-slate-200">{completedCount} of {totalCount}</strong> modules completed
                  </span>
                  <span className="text-orange-400 font-semibold">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-400 h-full transition-all duration-500"
                    style={{ width: `${Math.max(progressPercent, 4)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Completion of all {totalCount} modules awards the official pwn.college 🥋 <strong className="text-slate-300">{mod.belt}</strong>.
                </p>
              </div>
            )}
          </header>

          {/* Module Roadmap or Simple Writeups List */}
          <div className="space-y-4">
            {isIntroTrack ? (
              <>
                <h2 className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                  Curriculum Roadmap ({totalCount} Modules)
                </h2>

                <div className="space-y-3">
                  {INTRO_CYBERSECURITY_SYLLABUS.map((item) => {
                    const isPublished = publishedSlugs.has(item.slug);
                    const writeup = writeups.find((w) => w.slug === item.slug);
                    const isCompleted = writeup?.status === "completed";

                    if (isPublished && writeup) {
                      return (
                        <Link
                          key={item.slug}
                          href={`/writeups/${platformSlug}/${moduleOrSlug}/${item.slug}`}
                          className="group block border border-slate-800 bg-slate-950/40 p-5 transition-colors hover:border-slate-600 hover:bg-slate-900/40"
                        >
                          <div className="flex flex-wrap items-center gap-2 font-mono text-xs mb-2">
                            <span className="px-1.5 py-0.5 border border-slate-800 bg-slate-900/60 text-slate-400">
                              Module {item.number}
                            </span>
                            {isCompleted && (
                              <span className="px-1.5 py-0.5 border border-orange-900 bg-orange-950/40 text-orange-400 font-mono text-xs">
                                🟠 Completed
                              </span>
                            )}
                            <span className="text-slate-500">&bull;</span>
                            <time className="text-slate-500" dateTime={writeup.date}>{writeup.date}</time>
                            {writeup.readingTime && (
                              <>
                                <span className="text-slate-500">&bull;</span>
                                <span className="text-slate-500">{writeup.readingTime}</span>
                              </>
                            )}
                          </div>
                          <h3 className={`text-lg font-bold text-slate-100 ${theme.actionHover} transition-colors`}>
                            {writeup.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                            {writeup.description || item.summary}
                          </p>
                        </Link>
                      );
                    }

                    // In-progress or upcoming module placeholder
                    const isNext = item.number === 2;
                    return (
                      <div
                        key={item.slug}
                        className="border border-dashed border-slate-800/80 bg-slate-950/20 p-4 opacity-75"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
                            <span>Module {item.number}</span>
                            <span>&bull;</span>
                            <span className="text-slate-300 font-semibold">{item.name}</span>
                          </div>
                          {isNext ? (
                            <span className="font-mono text-[11px] px-1.5 py-0.5 border border-yellow-900/80 bg-yellow-950/30 text-yellow-400">
                              Next Up
                            </span>
                          ) : (
                            <span className="font-mono text-[10px] text-slate-600">upcoming</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{item.summary}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <h2 className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                  Writeups in this module
                </h2>

                {writeups.length === 0 ? (
                  <div className="border border-dashed border-slate-800 bg-slate-950/40 p-10 text-center">
                    <p className="font-mono text-sm text-slate-500">
                      No writeups published in this module yet.
                    </p>
                    <p className="mt-2 font-mono text-xs text-slate-600">
                      Create your writeup files (with <code className="text-slate-400">published: true</code>) inside this folder.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {writeups.map((writeup) => {
                      const writeupBadge = statusConfig(writeup.status);
                      return (
                        <Link
                          key={writeup.slug}
                          href={`/writeups/${platformSlug}/${moduleOrSlug}/${writeup.slug}`}
                          className="group block border border-slate-800 bg-slate-950/40 p-5 transition-colors hover:border-slate-600 hover:bg-slate-900/40"
                        >
                          <div className="flex flex-wrap items-center gap-2 font-mono text-xs mb-2">
                            {writeup.difficulty && (
                              <span className="px-1.5 py-0.5 border border-slate-800 bg-slate-900/60 text-slate-300">
                                {writeup.difficulty}
                              </span>
                            )}
                            {writeupBadge && <span className={`font-mono text-xs ${writeupBadge.className}`}>{writeupBadge.label}</span>}
                            <span className="text-slate-500">&bull;</span>
                            <time className="text-slate-500" dateTime={writeup.date}>{writeup.date}</time>
                            {writeup.readingTime && (
                              <>
                                <span className="text-slate-500">&bull;</span>
                                <span className="text-slate-500">{writeup.readingTime}</span>
                              </>
                            )}
                          </div>
                          <h3 className={`text-lg font-bold text-slate-100 ${theme.actionHover} transition-colors`}>
                            {writeup.title}
                          </h3>
                          {writeup.description && (
                            <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{writeup.description}</p>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      );
    }

    // Direct writeup alias fallback under modular platform (e.g. /writeups/pwn-college/web-security)
    const directWriteup = getWriteups(platformSlug).find((w) => w.slug === moduleOrSlug);
    if (directWriteup) {
      const directMod = directWriteup.moduleSlug ? modules.find((m) => m.slug === directWriteup.moduleSlug) : undefined;
      const modName = directMod?.name || (directWriteup.moduleSlug ? toTitleCase(directWriteup.moduleSlug) : undefined);
      return renderWriteupArticle(directWriteup, platform, modName, directWriteup.moduleSlug);
    }

    notFound();
  }

  // ----------------------------------------------------------------
  // MODULE WRITEUP PAGE  /writeups/[platform]/[module]/[slug]
  // ----------------------------------------------------------------
  if (platform.hasModules && segments.length === 2) {
    const [moduleSlug, slug] = segments;
    const writeup = getWriteupByModuleAndSlug(platformSlug, moduleSlug, slug);
    if (!writeup) notFound();

    const modules = getWriteupModules(platformSlug);
    const mod = modules.find((m) => m.slug === moduleSlug);
    const modName = mod?.name || toTitleCase(moduleSlug);

    return renderWriteupArticle(writeup, platform, modName, moduleSlug);
  }

  // ----------------------------------------------------------------
  // FLAT WRITEUP PAGE  /writeups/[platform]/[slug]  (HTB, PortSwigger)
  // ----------------------------------------------------------------
  if (!platform.hasModules && segments.length === 1) {
    const slug = segments[0];
    const writeup = getWriteupBySlug(platformSlug, slug);
    if (!writeup) notFound();

    return renderWriteupArticle(writeup, platform);
  }

  notFound();
}
