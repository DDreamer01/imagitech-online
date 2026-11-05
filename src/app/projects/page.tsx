import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getProjects } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Projects",
  description: "†hε drεαmεr's software and infrastructure projects, including self-hosted web utilities, automation modules, and network diagnostic setups.",
};

export default function ProjectsListingPage() {
  const projects = getProjects();
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <div className="space-y-12 max-w-4xl">
      <header className="border-b border-slate-800 pb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sky-400 mb-3 flex items-center gap-3">
          <span className="inline-block w-2 h-2 bg-sky-400"></span>
          // Systems Infrastructure &amp; Tooling
        </div>
        <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-tight text-slate-100">
          Projects
        </h1>
        <p className="mt-2 text-xs text-slate-400 font-mono tracking-wider uppercase">
          list_repos() &bull; {projects.length} nodes active
        </p>
      </header>

      {/* Featured Projects Grid */}
      {featured.length > 0 && (
        <section className="space-y-6">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400 border-b border-slate-800 pb-2">
            // Primary Systems
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((project, idx) => (
              <div 
                key={project.slug} 
                className="group relative flex flex-col justify-between border border-slate-800 bg-slate-950/40 p-6 hover:border-slate-600 hover:bg-slate-900/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 font-mono text-[11px]">
                    <span className="text-slate-500 tracking-[0.2em] uppercase">
                      [ 0{idx + 1} ]
                    </span>
                    {project.github && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-slate-500 hover:text-sky-400 transition-colors uppercase tracking-wider text-[10px]"
                      >
                        github_repo →
                      </a>
                    )}
                  </div>

                  <h3 className="font-display text-xl uppercase tracking-tight text-slate-100 group-hover:text-sky-400 transition-colors">
                    <Link href={`/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>
                
                <div className="mt-6 space-y-3 pt-4 border-t border-slate-900">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span 
                        key={tech} 
                        className="font-mono text-[10px] px-1.5 py-0.5 border border-slate-800 text-slate-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono pt-1">
                    <Link href={`/projects/${project.slug}`} className="text-sky-400 hover:underline">
                      view_spec() →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Other Projects List */}
      {others.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400 border-b border-slate-800 pb-2">
            // Archive &amp; Small Utilities
          </div>
          <div className="border-t border-b border-slate-800 divide-y divide-slate-800/60">
            {others.map((project) => (
              <div 
                key={project.slug} 
                className="py-5 px-3 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-slate-900/60 transition-colors"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-200 group-hover:text-sky-400 transition-colors">
                    <Link href={`/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 max-w-2xl leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap md:flex-nowrap items-center gap-3 shrink-0">
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span 
                        key={tech} 
                        className="font-mono text-[9px] px-1.5 py-0.5 border border-slate-800/80 text-slate-500"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Link 
                    href={`/projects/${project.slug}`} 
                    className="font-mono text-xs text-sky-400 hover:underline pl-3 border-l border-slate-800"
                  >
                    view() →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length === 0 && (
        <p className="text-sm text-slate-500 font-mono italic p-6 border border-slate-800 bg-slate-950/20">
          No projects logged yet.
        </p>
      )}
    </div>
  );
}
