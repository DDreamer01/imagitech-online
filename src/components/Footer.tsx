import React from "react";
import Link from "next/link";

const PROFILES = [
  { label: "GitHub", href: "https://github.com/DDreamer01" },
  { label: "X", href: "https://x.com/This_is_Dreamer" },
  {
    label: "Hack The Box",
    href: "https://profile.hackthebox.com/profile/019da1da-9b2f-7339-8004-27b20ffe2821?utm_medium=copy_url",
  },
  {
    label: "pwn.college",
    href: "https://pwn.college/hacker/172741",
  },
];

const NAVIGATION_LINKS = [
  { label: "Tags", href: "/tags" },
  { label: "Uses", href: "/uses" },
  { label: "Now", href: "/now" },
  { label: "Changelog", href: "/changelog" },
  { label: "Sitemap", href: "/sitemap.xml" },
  { label: "RSS", href: "/feed.xml" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/20 py-6 sm:py-8 text-xs text-slate-500 font-mono">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Identity */}
          <div className="space-y-1.5 sm:space-y-2">
            <span className="text-slate-300 font-bold tracking-wider block">
              †hε drεαmεr
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              System Engineering × Infrastructure &amp; Security
            </p>
            {/* Desktop status & copyright */}
            <div className="hidden sm:block pt-2 space-y-1">
              <div className="text-emerald-500 flex items-center gap-1.5 text-[11px]">
                <span className="inline-block w-1.5 h-1.5 bg-emerald-500 animate-pulse"></span>
                <span>System Status: Online</span>
              </div>
              <p className="text-slate-600 text-[10px] pt-0.5">
                © {currentYear} †hε drεαmεr.
              </p>
            </div>
          </div>

          {/* Social & Security Profiles: 2 columns on mobile, 1 on desktop */}
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 block border-b border-slate-800/60 pb-1">
              Profiles
            </span>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-y-1.5 gap-x-3 text-[11px]">
              {PROFILES.map((profile) => (
                <li key={profile.label}>
                  <a
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-slate-200 transition-colors flex items-center gap-1 group"
                  >
                    <span>{profile.label}</span>
                    <span className="text-slate-700 group-hover:text-slate-400 transition-colors text-[10px]">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation / Index: 3 columns on mobile, 2 on desktop */}
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 block border-b border-slate-800/60 pb-1">
              Index
            </span>
            <ul className="grid grid-cols-3 sm:grid-cols-2 gap-y-1.5 gap-x-2 text-[11px]">
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-slate-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile: System Status & Copyright side by side */}
        <div className="sm:hidden mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
          <div className="text-emerald-500 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 bg-emerald-500 animate-pulse"></span>
            <span>System Status: Online</span>
          </div>
          <p className="text-slate-600 text-[10px]">
            © {currentYear} †hε drεαmεr.
          </p>
        </div>
      </div>
    </footer>
  );
}
