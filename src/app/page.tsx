import React from "react";
import Link from "next/link";
import { getProjects, getNotes, getWriteups, getWriteupPlatform } from "@/lib/mdx";
import { generateRssFeed } from "@/lib/rss";

export default function HomePage() {
  generateRssFeed();
  const writeups = getWriteups().slice(0, 4);
  const projects = getProjects().filter((p) => p.featured).slice(0, 3);
  const notes = getNotes().slice(0, 5);

  return (
    <div className="space-y-16">
      {/* Bio / Hero Section with Neo-Brutalist Typographic Impact */}
      <section className="space-y-6 max-w-4xl border-b border-slate-800 pb-12">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400 flex items-center gap-3">
          <span className="inline-block w-2 h-2 bg-sky-400"></span>
          System Engineering × Infrastructure &amp; Security
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl leading-[0.94] tracking-tight uppercase text-slate-100">
          †Hε DRεαMεR<br />
          <span className="text-sky-400 block text-2xl sm:text-4xl md:text-5xl mt-2 tracking-normal font-sans font-extrabold normal-case">
            Build &bull; Secure &bull; Automate &bull; Break
          </span>
        </h1>

        <p className="font-mono text-xs sm:text-sm text-slate-400 uppercase tracking-widest">
          Linux systems administration &bull; Cloud VMs &bull; Offensive Security
        </p>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl pt-1">
          I work with Linux servers, high-security network tunnels, and cloud infrastructure on Azure, writing tools in Bash, Python, and Go. 
          This website serves as my public notebook, CTF writeup repository, and field manual for lessons learned in production.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Link
            href="/writeups"
            className="inline-flex items-center gap-2 bg-sky-400 text-slate-950 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider hover:bg-sky-300 transition-colors"
          >
            Explore Writeups →
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 border border-slate-700 text-slate-200 px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider hover:bg-slate-900 hover:border-slate-500 transition-colors"
          >
            View Projects
          </Link>
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 border border-slate-800 text-slate-400 px-4 py-2.5 text-xs font-mono uppercase tracking-wider hover:text-slate-200 hover:border-slate-700 transition-colors"
          >
            Wiki Notes
          </Link>
        </div>
      </section>

      {/* Laboratory Status Dashboard — Framed Brutalist Telemetry */}
      <section className="border border-slate-800 bg-slate-950/40 p-6">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 mb-6 gap-2">
          <div className="flex items-center gap-2.5 font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>// Laboratory Status · Live Nodes Telemetry</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
            cloud: azure · region: eastus
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm font-mono">
          {/* Panel 1 — Live public services */}
          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-[0.2em] text-sky-400 font-bold border-b border-slate-900 pb-1.5 flex items-center justify-between">
              <span>[ 01 ] Services</span>
              <span className="text-[10px] text-slate-600">active</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <a href="https://fs.imagitech.online" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400 transition-colors">fs.imagitech.online</a>
                <span className="text-emerald-400 font-semibold">Online</span>
              </div>
              <div className="flex justify-between">
                <a href="https://schlookup.imagitech.online" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400 transition-colors">schlookup.imagitech.online</a>
                <span className="text-emerald-400 font-semibold">Online</span>
              </div>
              <div className="flex justify-between">
                <a href="https://readme.imagitech.online" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400 transition-colors">readme.imagitech.online</a>
                <span className="text-emerald-400 font-semibold">Online</span>
              </div>
              <div className="flex justify-between">
                <a href="https://nextcloud.imagitech.online" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400 transition-colors">nextcloud.imagitech.online</a>
                <span className="text-slate-600">Offline</span>
              </div>
              <div className="flex justify-between">
                <a href="https://us.imagitech.online" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400 transition-colors">us.imagitech.online</a>
                <span className="text-emerald-400 font-semibold">Online</span>
              </div>
            </div>
          </div>

          {/* Panel 2 — Azure cloud regions / VM locations */}
          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-400 font-bold border-b border-slate-900 pb-1.5 flex items-center justify-between">
              <span>[ 02 ] Networks</span>
              <span className="text-[10px] text-slate-600">routing</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between"><span className="text-slate-500">North Central US</span> <span>Storage Server</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Central US</span> <span>Lookup Gateway</span></div>
              <div className="flex justify-between"><span className="text-slate-500">North Central US</span> <span>README Studio</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Cloudflare DNS</span> <span>Global Edge</span></div>
            </div>
          </div>

          {/* Panel 3 — Technology stack */}
          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold border-b border-slate-900 pb-1.5 flex items-center justify-between">
              <span>[ 03 ] Stack</span>
              <span className="text-[10px] text-slate-600">engine</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between"><span className="text-slate-500">Cloud Host</span> <span>Microsoft Azure</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Operating Sys</span> <span>Debian 13 · Kali</span></div>
              <div className="flex justify-between"><span className="text-slate-500">VPN Gateway</span> <span>Xray-core · HAProxy</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Runtime</span> <span>Next.js 16 · Node 22</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Writeups — 12-Column Editorial Row Grid with Tactile Hover */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-slate-800 pb-3 gap-4 flex-wrap">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sky-400 mb-1">
              // Security Research &amp; Solves
            </div>
            <h2 className="font-display text-2xl sm:text-4xl uppercase tracking-tight text-slate-100">
              Recent Writeups
            </h2>
          </div>
          <Link
            href="/writeups"
            className="font-mono text-xs uppercase tracking-widest text-sky-400 hover:text-sky-300 transition-colors inline-flex items-center gap-1.5"
          >
            view_all_solves() →
          </Link>
        </div>

        {writeups.length === 0 ? (
          <p className="text-sm text-slate-500 font-mono italic p-6 border border-slate-800 bg-slate-950/20">
            No writeups published yet.
          </p>
        ) : (
          <div className="border-t border-b border-slate-800 divide-y divide-slate-800/80">
            {writeups.map((writeup) => {
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

                  {/* Platform & Difficulty Badges */}
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

                  {/* Action Link */}
                  <span className="hidden md:flex col-span-2 justify-end font-mono text-xs uppercase tracking-[0.18em] text-slate-500 group-hover:text-sky-400 transition-colors">
                    Solve →
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Featured Projects & Wiki Notes Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-4">
        {/* Left Column: Featured Projects */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-end justify-between border-b border-slate-800 pb-3 gap-4">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400 mb-1">
                // Engineering Repositories
              </div>
              <h2 className="font-display text-2xl uppercase tracking-tight text-slate-100">
                Featured Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="font-mono text-xs uppercase tracking-widest text-sky-400 hover:text-sky-300 transition-colors"
            >
              all_projects() →
            </Link>
          </div>

          {projects.length === 0 ? (
            <p className="text-sm text-slate-500 font-mono italic">No featured projects yet.</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project, idx) => (
                <div
                  key={project.slug}
                  className="group relative border border-slate-800 bg-slate-950/20 p-5 hover:border-slate-700 transition-all hover:bg-slate-900/40"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      [ 0{idx + 1} ]
                    </span>
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-slate-500 hover:text-sky-400 transition-colors"
                      >
                        github_repo →
                      </a>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-sky-400 transition-colors">
                    <Link href={`/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[10px] px-1.5 py-0.5 border border-slate-800 text-slate-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Latest Notes & System Indexes */}
        <div className="lg:col-span-5 space-y-8">
          {/* Latest Notes */}
          <div className="space-y-6">
            <div className="flex items-end justify-between border-b border-slate-800 pb-3 gap-4">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400 mb-1">
                  // Quick Cheatsheets
                </div>
                <h2 className="font-display text-2xl uppercase tracking-tight text-slate-100">
                  Latest Notes
                </h2>
              </div>
              <Link
                href="/notes"
                className="font-mono text-xs uppercase tracking-widest text-sky-400 hover:text-sky-300 transition-colors"
              >
                index() →
              </Link>
            </div>

            {notes.length === 0 ? (
              <p className="text-sm text-slate-500 font-mono italic">No notes indexed yet.</p>
            ) : (
              <div className="border-t border-b border-slate-800 divide-y divide-slate-800/60">
                {notes.map((note) => (
                  <Link
                    key={note.slug}
                    href={`/notes/${note.slug}`}
                    className="py-3 px-2 flex items-center justify-between gap-3 group hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="min-w-0 flex items-center gap-2.5">
                      <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 border border-slate-800 text-slate-400 shrink-0 group-hover:border-sky-400 group-hover:text-sky-400 transition-colors">
                        {note.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-sky-400 transition-colors truncate">
                        {note.title}
                      </span>
                    </div>
                    <time className="text-[10px] text-slate-500 font-mono shrink-0">
                      {note.date}
                    </time>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick System Links */}
          <div className="p-5 border border-slate-800 bg-slate-950/30 space-y-3 font-mono text-xs">
            <h3 className="font-bold text-slate-200 border-b border-slate-800/80 pb-2 uppercase tracking-wider text-[11px]">
              {"// System Indexes"}
            </h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a
                  href="https://github.com/DDreamer01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sky-400 transition-colors flex items-center justify-between"
                >
                  <span>github_profile</span>
                  <span className="text-slate-600">→</span>
                </a>
              </li>
              <li>
                <Link
                  href="/uses"
                  className="hover:text-sky-400 transition-colors flex items-center justify-between"
                >
                  <span>hardware_stack</span>
                  <span className="text-slate-600">→</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/now"
                  className="hover:text-sky-400 transition-colors flex items-center justify-between"
                >
                  <span>current_focus</span>
                  <span className="text-slate-600">→</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="hover:text-sky-400 transition-colors flex items-center justify-between"
                >
                  <span>site_changelog</span>
                  <span className="text-slate-600">→</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "†hε drεαmεr",
            "url": "https://imagitech.online",
            "jobTitle": "Systems & Infrastructure Engineer",
            "sameAs": ["https://github.com/DDreamer01"],
          }),
        }}
      />
    </div>
  );
}
