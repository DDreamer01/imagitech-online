import React from "react";
import Link from "next/link";

const SECONDARY_GROUPS: { label: string; href: string; external?: boolean }[][] = [
  [
    { label: "Tags", href: "/tags" },
    { label: "Uses", href: "/uses" },
    { label: "Now", href: "/now" },
    { label: "Changelog", href: "/changelog" },
  ],
  [
    { label: "GitHub", href: "https://github.com/DDreamer01", external: true },
    { label: "Sitemap", href: "/sitemap.xml" },
    { label: "RSS", href: "/feed.xml" },
  ],
];

function FooterLink({ label, href, external }: { label: string; href: string; external?: boolean }) {
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">
      {label}
    </a>
  ) : (
    <Link href={href} className="hover:text-slate-300 transition-colors">
      {label}
    </Link>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/20 py-6 text-xs text-slate-500 font-mono">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-y-1 text-center sm:text-left">
            <span>© {currentYear} †hε drεαmεr. All rights reserved.</span>
            <span className="text-emerald-500 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>System Status: Online</span>
            </span>
          </div>
          <div className="flex flex-col sm:items-end items-center gap-y-1">
            {SECONDARY_GROUPS.map((group, idx) => (
              <div
                key={idx}
                className="flex flex-wrap items-center justify-center gap-x-4"
              >
                {group.map((link, linkIdx) => (
                  <React.Fragment key={link.label}>
                    {linkIdx > 0 && <span className="text-slate-800">/</span>}
                    <FooterLink {...link} />
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
