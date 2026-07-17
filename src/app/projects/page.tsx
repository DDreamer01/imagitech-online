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
    <div className="space-y-10 max-w-4xl">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">Projects</h1>
        <p className="mt-2 text-sm text-slate-400 font-mono">
          list_repos() &bull; {projects.length} nodes active
        </p>
      </header>

      {/* Featured Projects Grid */}
      {featured.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-sm font-mono font-bold text-sky-400 uppercase tracking-wider border-b border-slate-800 pb-1.5">{"// Featured Work"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((project) => (
              <div 
                key={project.slug} 
                className="group relative flex flex-col justify-between rounded-lg border border-slate-800/80 bg-slate-950/20 p-6 hover:border-slate-700/80 hover:bg-slate-950/30 transition-all"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-200 group-hover:text-sky-400 transition-colors">
                    <Link href={`/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>
                
                <div className="mt-6 space-y-3 pt-4 border-t border-slate-900/60">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span 
                        key={tech} 
                        className="font-mono text-[10px] px-2 py-0.5 rounded border border-slate-800 bg-slate-900 text-slate-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <Link href={`/projects/${project.slug}`} className="text-sky-400 hover:underline">
                      details()
                    </Link>
                    {project.github && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-slate-400 hover:text-slate-200 hover:underline"
                      >
                        src_code()
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Other Projects List */}
      {others.length > 0 && (
        <section className="space-y-4 pt-4">
          <h2 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1.5">{"// Archive & Small Utilities"}</h2>
          <div className="divide-y divide-slate-800/60">
            {others.map((project) => (
              <div 
                key={project.slug} 
                className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-200 group-hover:text-sky-400 transition-colors">
                    <Link href={`/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2 max-w-2xl">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap md:flex-nowrap items-center gap-3 shrink-0">
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span 
                        key={tech} 
                        className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-slate-800/80 bg-slate-900/40 text-slate-500"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Link 
                    href={`/projects/${project.slug}`} 
                    className="font-mono text-xs text-sky-400 hover:underline pl-2 border-l border-slate-800"
                  >
                    view()
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length === 0 && (
        <p className="text-sm text-slate-500 font-mono italic p-6 border border-slate-800 rounded bg-slate-950/20">
          No projects logged yet.
        </p>
      )}
    </div>
  );
}
