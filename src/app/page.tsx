import React from "react";
import Link from "next/link";
import { getProjects, getNotes, getWriteups, getWriteupPlatform } from "@/lib/mdx";
import { generateRssFeed } from "@/lib/rss";

export default function HomePage() {
  generateRssFeed();
  const writeups = getWriteups().slice(0, 3);
  const projects = getProjects().filter(p => p.featured).slice(0, 3);
  const notes = getNotes().slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Bio / Intro Section */}
      <section className="space-y-4 max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-5xl">
          †hε drεαmεr
        </h1>
        <p className="font-mono text-sm text-sky-400">
          Linux systems administration &bull; Automation & Scripting &bull; Cybersecurity
        </p>
        <p className="text-lg text-slate-300 leading-relaxed pt-2">
          I work with Linux servers and Cloud VMs, and use languages like Bash, Python, and Go. I'm learning to hack too.
          This website serves as my technical documentation vault, project library, and notebook for lessons learned in the field.
        </p>
      </section>

      {/* Infrastructure Status Dashboard */}
      <section className="rounded-lg border border-slate-800 bg-slate-950/20 p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
              Laboratory status / Nodes online
            </h2>
          </div>
          <span className="font-mono text-[10px] text-slate-500">cloud: azure · region: eastus</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-mono">

          {/* Panel 1 — Live public services */}
          <div className="space-y-3">
            <h3 className="text-xs text-sky-400 font-bold border-b border-slate-900 pb-1">{"// Services"}</h3>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between">
                <a href="https://fs.imagitech.online" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-400 transition-colors">fs.imagitech.online</a>
                <span className="text-emerald-400">Online</span>
              </div>
              <div className="flex justify-between">
                <a href="https://schlookup.imagitech.online" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-400 transition-colors">schlookup.imagitech.online</a>
                <span className="text-emerald-400">Online</span>
              </div>
              <div className="flex justify-between">
                <a href="https://readme.imagitech.online" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-400 transition-colors">readme.imagitech.online</a>
                <span className="text-emerald-400">Online</span>
              </div>
              <div className="flex justify-between">
                <a href="https://nextcloud.imagitech.online" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-400 transition-colors">nextcloud.imagitech.online</a>
                <span className="text-emerald-400">Offline</span>
              </div>
              <div className="flex justify-between">
                <a href="https://us.imagitech.online" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-400 transition-colors">us.imagitech.online</a>
                <span className="text-emerald-400">Online</span>
              </div>
            </div>
          </div>

          {/* Panel 2 — Azure cloud regions / VM locations */}
          <div className="space-y-3">
            <h3 className="text-xs text-emerald-400 font-bold border-b border-slate-900 pb-1">{"// Active Networks"}</h3>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between"><span className="text-slate-500">North Central US</span> <span>File Storage Server</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Central US</span> <span>Lookup Tool</span></div>
              <div className="flex justify-between"><span className="text-slate-500">North Central US</span> <span>README Studio</span></div>
              <div className="flex justify-between"><span className="text-slate-500">-</span> <span>Nextcloud</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Cloudflare DNS</span> <span>README Studio</span></div>
            </div>
          </div>

          {/* Panel 3 — Technology stack */}
          <div className="space-y-3">
            <h3 className="text-xs text-slate-400 font-bold border-b border-slate-900 pb-1">{"// Stack"}</h3>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between"><span className="text-slate-500">Cloud</span> <span>Microsoft Azure</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Python</span> <span>Ubuntu</span></div>
              <div className="flex justify-between"><span className="text-slate-500">HTML/CCS/JavaScript</span> <span>Ubuntu</span></div>
              <div className="flex justify-between"><span className="text-slate-500">-</span> <span>Docker</span></div>
              <div className="flex justify-between"><span className="text-slate-500">VPN Engine</span> <span>Haproxy • Xray-core</span></div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle Column - Blog & Projects */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Featured Projects Section */}
          <section className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xl font-bold text-slate-100">Featured Projects</h2>
              <Link href="/projects" className="text-xs font-mono text-sky-400 hover:underline">
                view_all()
              </Link>
            </div>
            {projects.length === 0 ? (
              <p className="text-sm text-slate-500 font-mono italic">No featured projects yet.</p>
            ) : (
              <div className="space-y-6">
                {projects.map((project) => (
                  <div key={project.slug} className="group relative rounded-lg border border-slate-800/80 bg-slate-950/20 p-5 hover:border-slate-700/80 transition-all">
                    <h3 className="text-base font-bold text-slate-200 group-hover:text-sky-400 transition-colors">
                      <Link href={`/projects/${project.slug}`}>
                        {project.title}
                      </Link>
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-400 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="font-mono text-[10px] px-2 py-0.5 rounded border border-slate-800 bg-slate-900 text-slate-400">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Writeups Section */}
          <section className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xl font-bold text-slate-100">Recent Writeups</h2>
              <Link href="/writeups" className="text-xs font-mono text-sky-400 hover:underline">
                view_all()
              </Link>
            </div>
            {writeups.length === 0 ? (
              <p className="text-sm text-slate-500 font-mono italic">No writeups published yet.</p>
            ) : (
              <div className="space-y-6">
                {writeups.map((writeup) => {
                  const href = writeup.module
                    ? `/writeups/${writeup.platform}/${writeup.module}/${writeup.slug}`
                    : `/writeups/${writeup.platform}/${writeup.slug}`;
                  const platform = getWriteupPlatform(writeup.platform);

                  return (
                    <article key={`${writeup.platform}-${writeup.module || ""}-${writeup.slug}`} className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
                        <span className="px-1.5 py-0.5 rounded border border-slate-800 bg-slate-900/60 text-emerald-400">
                          {platform?.name || writeup.platform}
                        </span>
                        {writeup.difficulty && (
                          <span className="px-1.5 py-0.5 rounded border border-slate-800 bg-slate-900/60 text-sky-400">
                            {writeup.difficulty}
                          </span>
                        )}
                        <span>&bull;</span>
                        <time dateTime={writeup.date}>{writeup.date}</time>
                        {writeup.readingTime && (
                          <>
                            <span>&bull;</span>
                            <span>{writeup.readingTime}</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-200 hover:text-sky-400 transition-colors">
                        <Link href={href}>
                          {writeup.title}
                        </Link>
                      </h3>
                      {writeup.description && (
                        <p className="text-sm text-slate-400 line-clamp-2">
                          {writeup.description}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>

        </div>

        {/* Right Column - Wiki Notes */}
        <div className="space-y-12">
          
          {/* Latest Wiki Notes Section */}
          <section className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xl font-bold text-slate-100">Latest Notes</h2>
              <Link href="/notes" className="text-xs font-mono text-sky-400 hover:underline">
                view_all()
              </Link>
            </div>
            {notes.length === 0 ? (
              <p className="text-sm text-slate-500 font-mono italic">No notes indexed yet.</p>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note.slug} className="flex items-start gap-3">
                    <span className="font-mono text-xs px-2 py-0.5 rounded border border-slate-800/80 bg-slate-900/40 text-emerald-400 shrink-0 mt-0.5">
                      {note.category}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-300 hover:text-sky-400 transition-colors truncate">
                        <Link href={`/notes/${note.slug}`}>
                          {note.title}
                        </Link>
                      </h3>
                      <time className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        {note.date}
                      </time>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick System Links */}
          <section className="p-4 rounded-lg border border-slate-800/80 bg-slate-950/20 space-y-3 font-mono text-xs">
            <h3 className="font-bold text-slate-200 border-b border-slate-900 pb-1.5">{"// System Indexes"}</h3>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <a href="https://github.com/DDreamer01" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors flex items-center justify-between">
                  <span>github_profile</span>
                  <span className="text-slate-600">--&gt;</span>
                </a>
              </li>
              <li>
                <Link href="/uses" className="hover:text-sky-400 transition-colors flex items-center justify-between">
                  <span>hardware_stack</span>
                  <span className="text-slate-600">--&gt;</span>
                </Link>
              </li>
              <li>
                <Link href="/now" className="hover:text-sky-400 transition-colors flex items-center justify-between">
                  <span>current_focus</span>
                  <span className="text-slate-600">--&gt;</span>
                </Link>
              </li>
             </ul>
          </section>

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
            "sameAs": [
              "https://github.com/DDreamer01"
            ]
          })
        }}
      />
    </div>
  );
}
