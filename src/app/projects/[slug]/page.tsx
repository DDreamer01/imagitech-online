import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug, getProjects, extractHeadings } from "@/lib/mdx";
import Mdx from "@/components/Mdx";
import TableOfContents from "@/components/TableOfContents";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  
  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} - Project Documentation`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const headings = extractHeadings(project.content);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-start">
      {/* Main Documentation Column */}
      <div className="lg:col-span-3 min-w-0">
        
        {/* Back Link */}
        <Link 
          href="/projects" 
          className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 hover:text-sky-400 mb-6 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          back_to_repos()
        </Link>

        {/* Project Header Block */}
        <header className="mb-8 border-b border-slate-800 pb-6">
          <time className="text-xs text-slate-500 font-mono block mb-1">{project.date}</time>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
            {project.title}
          </h1>
          <p className="mt-4 text-slate-400 text-base leading-relaxed">
            {project.description}
          </p>

          {/* Links & Tech Stack */}
          <div className="mt-6 flex flex-wrap gap-4 items-center justify-between border-t border-slate-900 pt-5">
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <span 
                  key={tech} 
                  className="font-mono text-xs px-2 py-0.5 rounded border border-slate-800 bg-slate-900/60 text-slate-400"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              {project.github && (
                <a 
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:text-slate-100 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  GitHub
                </a>
              )}
              {project.url && (
                <a 
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-sky-950 bg-sky-950/20 text-sky-400 hover:border-sky-800 hover:text-sky-300 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Link
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Table of Contents */}
        {headings.length > 0 && (
          <details className="lg:hidden mb-6 rounded-lg border border-slate-800 bg-slate-950/20 p-4 font-mono text-xs">
            <summary className="font-semibold text-slate-300 cursor-pointer select-none focus:text-sky-400 focus:outline-none">
              Outline ({headings.length} headings)
            </summary>
            <ul className="mt-3 pl-3 border-l border-slate-800 space-y-2 text-slate-400">
              {headings.map((item) => (
                <li 
                  key={item.id}
                  style={{ paddingLeft: `${(item.depth - 2) * 12}px` }}
                >
                  <a href={`#${item.id}`} className="hover:text-sky-400 transition-colors">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        )}

        {/* Documentation Content */}
        <div className="prose prose-slate prose-invert max-w-none">
          <Mdx source={project.content} />
        </div>

      </div>

      {/* Sticky Table of Contents Sidebar */}
      <aside className="lg:col-span-1 sticky top-24 hidden lg:block max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 border-l border-slate-800/60 pl-6">
        <TableOfContents items={headings} />
      </aside>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": project.title,
            "description": project.description,
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Linux, macOS, Windows",
            "codeRepository": project.github,
            "author": {
              "@type": "Person",
              "name": "†hε drεαmεr"
            }
          })
        }}
      />
    </div>
  );
}
