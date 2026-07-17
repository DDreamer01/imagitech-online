import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/20 py-6 text-xs text-slate-500 font-mono">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-center sm:text-left">
            <span>© {currentYear} †hε drεαmεr. All rights reserved.</span>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="text-emerald-500 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>System Status: Online</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              GitHub
            </a>
            <span className="text-slate-800">/</span>
            <a href="/sitemap.xml" className="hover:text-slate-300 transition-colors">
              Sitemap
            </a>
            <span className="text-slate-800">/</span>
            <a href="/feed.xml" className="hover:text-slate-300 transition-colors">
              RSS
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
