import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about †hε drεαmεr, his background, technical expertise, and what drives his self-hosting and engineering work.",
};

const SKILL_CATEGORIES = [
  {
    title: "Systems & Infrastructure",
    skills: ["Linux (AlmaLinux, Debian, RedHat, Ubuntu)", "Bash Scripting", "Systemd Services", "Self-Hosting"],
  },
  {
    title: "Networking & VPNs",
    skills: ["XRAY", "SOCKS5", "Routing & Switching", "DNS Configuration", "Firewalls (ufw, nftables)", "Reverse Proxies (Nginx)"],
  },
  {
    title: "Cloud & Automation",
    skills: ["Amazon Web Services (AWS)", "Microsoft Azure", "GitHub Actions CI/CD", "Cloudflare Ecosystem", "Python Scripts"],
  },
  {
    title: "Cybersecurity",
    skills: ["Linux CLI", "Server Hardening", "Web Hacking", "VPN"],
  },
];

export default function AboutPage() {
  return (
    <article className="prose prose-slate max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">About Me</h1>
        <p className="mt-2 text-sm text-slate-400 font-mono">the-dreamer.about()</p>
      </header>

      <section className="space-y-6 text-slate-300">
        <p className="text-lg leading-relaxed text-slate-200">
          Hi, I&apos;m †hε drεαmεr. I build, secure, and automate digital infrastructure.
        </p>

        <p>
          My passion lies at the intersection of Linux, networking, self-hosting, and systems automation.
        </p>

        <p>
          By day, I work with cloud infrastructure, networking protocols, and secure tunnel technologies. By night, I sleep.
        </p>

        <h2 className="text-xl font-semibold text-slate-100 mt-10 mb-4 border-b border-slate-800 pb-2">Technical Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {SKILL_CATEGORIES.map((category) => (
            <div key={category.title} className="p-4 rounded-lg border border-slate-800 bg-slate-950/20">
              <h3 className="font-mono text-sm font-semibold text-sky-400 mb-3">{category.title}</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {category.skills.map((skill) => (
                  <li key={skill} className="flex items-start gap-2">
                    <span className="text-sky-400 select-none mr-1.5">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-slate-100 mt-10 mb-4 border-b border-slate-800 pb-2">Philosophy</h2>
        <blockquote className="border-l-2 border-emerald-500 pl-4 py-1 italic text-slate-400 bg-slate-900/10">
          &quot;If you can&apos;t reproduce it from a single configuration file and a clean install script, it doesn&apos;t exist. If you haven&apos;t documented it, it will be forgotten.&quot;
        </blockquote>

        <p className="mt-6">
          This site serves as my public knowledge vault. I write articles to share solutions to complex edge cases, review configuration paradigms, and keep an index of notes I can refer back to from my terminal.
        </p>
      </section>
    </article>
  );
}
